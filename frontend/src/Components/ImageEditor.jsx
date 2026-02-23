import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import { Loader2 } from "lucide-react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getImage = (src) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = src;
    });

const getCroppedFile = async (src, area, originalFile) => {
    const image = await getImage(src);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Canvas context is not supported");
    }

    const width = clamp(Math.round(area.width), 1, image.width);
    const height = clamp(Math.round(area.height), 1, image.height);
    const x = clamp(Math.round(area.x), 0, image.width - width);
    const y = clamp(Math.round(area.y), 0, image.height - height);

    canvas.width = width;
    canvas.height = height;

    context.drawImage(
        image,
        x,
        y,
        width,
        height,
        0,
        0,
        width,
        height,
    );

    return new Promise((resolve, reject) => {
        const fileType = originalFile.type || "image/jpeg";

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Failed to crop image"));
                    return;
                }

                resolve(
                    new File([blob], originalFile.name, {
                        type: fileType,
                        lastModified: Date.now(),
                    }),
                );
            },
            fileType,
            0.92,
        );
    });
};

const ImageEditor = ({
    isOpen,
    file,
    onCancel,
    onConfirm,
    aspect = 1,
    title = "Crop image",
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    const imageUrl = useMemo(() => {
        if (!file) return "";
        return URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    useEffect(() => {
        if (!isOpen) return;
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setIsCropping(false);
    }, [isOpen, file]);

    const handleCropComplete = useCallback((_, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleConfirm = async () => {
        if (!file || !croppedAreaPixels || isCropping) return;

        setIsCropping(true);

        try {
            const croppedFile = await getCroppedFile(
                imageUrl,
                croppedAreaPixels,
                file,
            );
            onConfirm(croppedFile);
        } catch (error) {
            console.error("Image crop failed:", error);
        } finally {
            setIsCropping(false);
        }
    };

    if (!isOpen || !file) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h3>
                    <span className="text-xs text-gray-500">{file.name}</span>
                </div>

                <div className="relative h-80 w-full bg-gray-900 rounded-xl overflow-hidden">
                    <Cropper
                        image={imageUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={handleCropComplete}
                        objectFit="contain"
                        showGrid={false}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm text-gray-700">
                        Zoom
                    </label>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(event) => setZoom(Number(event.target.value))}
                        className="w-full"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isCropping}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isCropping}
                        className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white flex items-center gap-2"
                    >
                        {isCropping ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Cropping...
                            </>
                        ) : (
                            "Apply Crop"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
