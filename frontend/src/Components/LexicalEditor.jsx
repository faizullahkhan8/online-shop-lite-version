import { useEffect, useRef, useCallback } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import {
    $getRoot,
    $createParagraphNode,
    $createTextNode,
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
} from "lexical";

import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode,
    ListItemNode,
} from "@lexical/list";

import {
    $createHeadingNode,
    $isHeadingNode,
    HeadingNode,
    QuoteNode,
    $createQuoteNode,
} from "@lexical/rich-text";

import { $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";

import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Quote,
    Undo2,
    Redo2,
} from "lucide-react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = {
    heading: {
        h1: "lexical-h1",
        h2: "lexical-h2",
    },
    text: {
        bold: "lexical-bold",
        italic: "lexical-italic",
        underline: "lexical-underline",
        strikethrough: "lexical-strikethrough",
    },
    list: {
        nested: { listitem: "lexical-nested-listitem" },
        ol: "lexical-ol",
        ul: "lexical-ul",
        listitem: "lexical-listitem",
    },
    quote: "lexical-quote",
    paragraph: "lexical-paragraph",
};

// ─── Initial Value Plugin ─────────────────────────────────────────────────────
/**
 * Populates the editor with `value` once on mount.
 * If `value` is valid Lexical JSON, restore it; otherwise treat as plain text.
 */
function InitialValuePlugin({ value }) {
    const [editor] = useLexicalComposerContext();
    const hasInit = useRef(false);

    useEffect(() => {
        if (hasInit.current) return;
        hasInit.current = true;

        if (!value) return;

        // Try restoring Lexical JSON state
        try {
            const parsed = JSON.parse(value);
            // Lexical JSON always has a "root" key
            if (parsed && parsed.root) {
                const editorState = editor.parseEditorState(value);
                editor.setEditorState(editorState);
                return;
            }
        } catch {
            /* not JSON — fall through to plain text */
        }

        // Plain text fallback
        editor.update(() => {
            const root = $getRoot();
            root.clear();
            const para = $createParagraphNode();
            para.append($createTextNode(value));
            root.append(para);
        });
    }, [editor, value]);

    return null;
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
function Toolbar() {
    const [editor] = useLexicalComposerContext();

    const formatText = useCallback(
        (format) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
        },
        [editor]
    );

    const formatHeading = useCallback(
        (tag) => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createHeadingNode(tag));
                }
            });
        },
        [editor]
    );

    const formatQuote = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
            }
        });
    }, [editor]);

    const formatParagraph = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createParagraphNode());
            }
        });
    }, [editor]);

    const insertList = useCallback(
        (type) => {
            if (type === "bullet") {
                editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            } else {
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            }
        },
        [editor]
    );

    const ToolbarBtn = ({ onClick, title, children }) => (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            title={title}
            className="lexical-toolbar-btn"
        >
            {children}
        </button>
    );

    const Divider = () => <span className="lexical-toolbar-divider" />;

    return (
        <div className="lexical-toolbar">
            <ToolbarBtn onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} title="Undo">
                <Undo2 size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} title="Redo">
                <Redo2 size={14} />
            </ToolbarBtn>

            <Divider />

            <ToolbarBtn onClick={() => formatText("bold")} title="Bold (Ctrl+B)">
                <Bold size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => formatText("italic")} title="Italic (Ctrl+I)">
                <Italic size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => formatText("underline")} title="Underline (Ctrl+U)">
                <Underline size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => formatText("strikethrough")} title="Strikethrough">
                <Strikethrough size={14} />
            </ToolbarBtn>

            <Divider />

            <ToolbarBtn onClick={() => formatHeading("h1")} title="Heading 1">
                <Heading1 size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => formatHeading("h2")} title="Heading 2">
                <Heading2 size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={formatQuote} title="Blockquote">
                <Quote size={14} />
            </ToolbarBtn>

            <Divider />

            <ToolbarBtn onClick={() => insertList("bullet")} title="Bullet List">
                <List size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => insertList("numbered")} title="Numbered List">
                <ListOrdered size={14} />
            </ToolbarBtn>
        </div>
    );
}

// ─── Main LexicalEditor ───────────────────────────────────────────────────────
const initialConfig = {
    namespace: "ProductDescriptionEditor",
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
    theme,
    onError(error) {
        console.error("[LexicalEditor]", error);
    },
};

/**
 * @param {string}   value     - Lexical JSON string or legacy plain text
 * @param {function} onChange  - called with the serialised JSON string on every change
 */
const LexicalEditor = ({ value, onChange }) => {
    const handleChange = useCallback(
        (editorState) => {
            const json = JSON.stringify(editorState.toJSON());
            onChange?.(json);
        },
        [onChange]
    );

    return (
        <div className="lexical-wrapper">
            <style>{`
                .lexical-wrapper {
                    border: 1px solid #d1d5db;
                    border-radius: 16px;
                    overflow: hidden;
                    background: #fff;
                }
                .lexical-toolbar {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 2px;
                    padding: 8px 12px;
                    border-bottom: 1px solid #e5e7eb;
                    background: #f9fafb;
                }
                .lexical-toolbar-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 30px;
                    border: none;
                    border-radius: 8px;
                    background: transparent;
                    color: #374151;
                    cursor: pointer;
                    transition: background 0.15s, color 0.15s;
                }
                .lexical-toolbar-btn:hover {
                    background: #e5e7eb;
                    color: #111827;
                }
                .lexical-toolbar-divider {
                    width: 1px;
                    height: 20px;
                    background: #e5e7eb;
                    margin: 0 4px;
                }
                .lexical-content-editable {
                    min-height: 160px;
                    padding: 14px 16px;
                    font-size: 14px;
                    color: #374151;
                    outline: none;
                    line-height: 1.7;
                }
                .lexical-placeholder {
                    position: absolute;
                    top: 14px;
                    left: 16px;
                    font-size: 14px;
                    color: #9ca3af;
                    pointer-events: none;
                    user-select: none;
                }
                .lexical-editor-inner {
                    position: relative;
                }
                /* Rich-text styles */
                .lexical-h1 { font-size: 1.5rem; font-weight: 700; margin: 8px 0 4px; color: #111827; }
                .lexical-h2 { font-size: 1.2rem; font-weight: 600; margin: 6px 0 4px; color: #1f2937; }
                .lexical-bold { font-weight: 700; }
                .lexical-italic { font-style: italic; }
                .lexical-underline { text-decoration: underline; }
                .lexical-strikethrough { text-decoration: line-through; }
                .lexical-ul { list-style-type: disc; padding-left: 1.5rem; margin: 4px 0; }
                .lexical-ol { list-style-type: decimal; padding-left: 1.5rem; margin: 4px 0; }
                .lexical-listitem { margin: 2px 0; }
                .lexical-nested-listitem { list-style: none; }
                .lexical-quote {
                    border-left: 3px solid #3b82f6;
                    padding-left: 12px;
                    color: #6b7280;
                    font-style: italic;
                    margin: 6px 0;
                }
                .lexical-paragraph { margin: 2px 0; }
            `}</style>

            <LexicalComposer initialConfig={initialConfig}>
                <Toolbar />
                <div className="lexical-editor-inner">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="lexical-content-editable" />
                        }
                        placeholder={
                            <div className="lexical-placeholder">
                                Write a detailed product description…
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>
                <HistoryPlugin />
                <ListPlugin />
                <OnChangePlugin onChange={handleChange} />
                <InitialValuePlugin value={value} />
            </LexicalComposer>
        </div>
    );
};

export default LexicalEditor;
