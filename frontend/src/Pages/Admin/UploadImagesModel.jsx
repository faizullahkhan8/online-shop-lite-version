import { useState } from "react";
import { X, Upload, Loader } from "lucide-react";
import { useUploadMultipleImages } from "../../features/upload.api";
import { toast } from "react-toastify";
import ImageEditor from "../../Components/ImageEditor.jsx";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 10;

const UploadImagesModal = ({ isOpen, onClose, onSuccess }) => {
    const [files, setFiles] = useState([]);
    const [cropQueue, setCropQueue] = useState([]);

    const uploadMultipleImages = useUploadMultipleImages();
    const activeCropFile = cropQueue[0] || null;

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files || []);
        if (selected.length === 0) return;

        const currentTotal = files.length + cropQueue.length;
        if (currentTotal >= MAX_FILES) {
            e.target.value = "";
            return toast.error(`Maximum ${MAX_FILES} images allowed`);
        }

        const availableSlots = MAX_FILES - currentTotal;
        const selectedWithinLimit = selected.slice(0, availableSlots);

        if (selected.length > availableSlots) {
            toast.error(`Only ${availableSlots} more images can be added`);
        }

        const validFiles = [];

        for (const file of selectedWithinLimit) {
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name} is not a valid image`);
                continue;
            }

            if (file.size > MAX_FILE_SIZE) {
                toast.error(`${file.name} exceeds 5MB limit`);
                continue;
            }

            validFiles.push(file);
        }

        if (validFiles.length > 0) {
            setCropQueue((prev) => [...prev, ...validFiles]);
        }

        e.target.value = "";
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (cropQueue.length > 0) {
            return toast.error("Please finish cropping selected images first");
        }

        if (files.length === 0) {
            return toast.error("Please select at least one image");
        }

        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("images", file);
            });

            const res = await uploadMultipleImages.mutateAsync(formData);

            if (res?.images?.length > 0) {
                onSuccess(res.images);
                handleClose();
            }
        } catch (err) {
            toast.error(err.message || "Upload failed");
        }
    };

    const handleCropConfirm = (croppedFile) => {
        setFiles((prev) => [...prev, croppedFile]);
        setCropQueue((prev) => prev.slice(1));
    };

    const handleCropCancel = () => {
        setCropQueue((prev) => prev.slice(1));
    };

    const handleClose = () => {
        setFiles([]);
        setCropQueue([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        Upload Product Images
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Drop Area */}
                <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-10 cursor-pointer hover:bg-gray-50 transition">
                    <Upload size={28} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                        Click to select and crop images
                    </span>
                    <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>

                {cropQueue.length > 0 && (
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        {`Finish cropping ${cropQueue.length} selected image${cropQueue.length > 1 ? "s" : ""} before upload.`}
                    </p>
                )}

                {/* Selected Files Preview */}
                {files.length > 0 && (
                    <div className="max-h-48 overflow-y-auto space-y-2">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                            >
                                <span className="text-xs truncate">
                                    {file.name}
                                </span>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 text-xs"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm rounded-lg border"
                        disabled={uploadMultipleImages.isPending}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleUpload}
                        disabled={
                            uploadMultipleImages.isPending ||
                            cropQueue.length > 0
                        }
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg flex items-center gap-2"
                    >
                        {uploadMultipleImages.isPending ? (
                            <>
                                <Loader size={14} className="animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Upload"
                        )}
                    </button>
                </div>
            </div>

            <ImageEditor
                isOpen={Boolean(activeCropFile)}
                file={activeCropFile}
                onCancel={handleCropCancel}
                onConfirm={handleCropConfirm}
                aspect={1}
                title="Crop Image"
            />
        </div>
    );
};

export default UploadImagesModal;
