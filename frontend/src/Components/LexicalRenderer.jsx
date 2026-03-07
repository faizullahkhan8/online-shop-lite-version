/**
 * LexicalRenderer
 *
 * Converts a serialised Lexical editor-state JSON string into semantic HTML.
 * Falls back gracefully to a plain <p> when the value is not JSON
 * (backward-compatible with existing plain-text descriptions).
 */

// ─── Node → HTML helpers ──────────────────────────────────────────────────────

function applyTextFormats(text, format) {
    // format is a bitmask: bold=1, italic=2, strikethrough=4, underline=8, code=16, subscript=32, superscript=64
    let node = text;
    if (format & 1) node = `<strong>${node}</strong>`;
    if (format & 2) node = `<em>${node}</em>`;
    if (format & 4) node = `<s>${node}</s>`;
    if (format & 8) node = `<u>${node}</u>`;
    if (format & 16) node = `<code>${node}</code>`;
    return node;
}

function renderNode(node) {
    if (!node) return "";

    switch (node.type) {
        case "text": {
            const escaped = node.text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            return applyTextFormats(escaped, node.format || 0);
        }

        case "linebreak":
            return "<br />";

        case "paragraph": {
            const inner = (node.children || []).map(renderNode).join("");
            return `<p class="lx-paragraph">${inner}</p>`;
        }

        case "heading": {
            const tag = node.tag || "h2"; // h1 | h2 | h3 …
            const inner = (node.children || []).map(renderNode).join("");
            return `<${tag} class="lx-${tag}">${inner}</${tag}>`;
        }

        case "quote": {
            const inner = (node.children || []).map(renderNode).join("");
            return `<blockquote class="lx-blockquote">${inner}</blockquote>`;
        }

        case "list": {
            const tag = node.listType === "number" ? "ol" : "ul";
            const inner = (node.children || []).map(renderNode).join("");
            return `<${tag} class="lx-${tag}">${inner}</${tag}>`;
        }

        case "listitem": {
            const inner = (node.children || []).map(renderNode).join("");
            return `<li class="lx-listitem">${inner}</li>`;
        }

        case "link": {
            const inner = (node.children || []).map(renderNode).join("");
            const href = node.url || "#";
            return `<a href="${href}" class="lx-link" target="_blank" rel="noopener noreferrer">${inner}</a>`;
        }

        case "root": {
            return (node.children || []).map(renderNode).join("");
        }

        default: {
            // Unknown node — try to render children, else skip
            if (node.children) {
                return (node.children || []).map(renderNode).join("");
            }
            return "";
        }
    }
}

function lexicalJsonToHtml(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        if (!parsed?.root) return null;
        return renderNode(parsed.root);
    } catch {
        return null;
    }
}

// ─── Component ────────────────────────────────────────────────────────────────

const LexicalRenderer = ({ value, className = "" }) => {
    const html = value ? lexicalJsonToHtml(value) : null;

    const styles = `
        .lx-paragraph { margin: 0 0 0.6em; line-height: 1.75; }
        .lx-h1 { font-size: 1.6rem; font-weight: 700; margin: 0.8em 0 0.4em; color: #111827; }
        .lx-h2 { font-size: 1.25rem; font-weight: 600; margin: 0.7em 0 0.35em; color: #1f2937; }
        .lx-h3 { font-size: 1.05rem; font-weight: 600; margin: 0.6em 0 0.3em; color: #374151; }
        .lx-blockquote {
            border-left: 3px solid #3b82f6;
            padding-left: 14px;
            color: #6b7280;
            font-style: italic;
            margin: 0.8em 0;
        }
        .lx-ul { list-style-type: disc; padding-left: 1.4rem; margin: 0.5em 0; }
        .lx-ol { list-style-type: decimal; padding-left: 1.4rem; margin: 0.5em 0; }
        .lx-listitem { margin: 0.2em 0; line-height: 1.7; }
        .lx-link { color: #2563eb; text-decoration: underline; }
        .lx-link:hover { color: #1d4ed8; }
    `;

    if (html) {
        return (
            <>
                <style>{styles}</style>
                <div
                    className={`lx-root ${className}`}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </>
        );
    }

    // Plain-text fallback (legacy descriptions)
    return (
        <p className={`text-zinc-700 text-md leading-relaxed font-light ${className}`}>
            {value ||
                "A masterclass in modern design and functional elegance, part of our exclusive Studio Edition series."}
        </p>
    );
};

export default LexicalRenderer;
