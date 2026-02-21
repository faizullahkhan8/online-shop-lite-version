import { useState } from "react";
import { X, Upload, Loader } from "lucide-react";
import { useUploadMultipleImages } from "../../features/upload.api";
import { toast } from "react-toastify";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 10;

const UploadImagesModal = ({ isOpen, onClose, onSuccess }) => {
    const [files, setFiles] = useState([]);

    const uploadMultipleImages = useUploadMultipleImages();

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);

        if (files.length + selected.length > MAX_FILES) {
            return toast.error(`Maximum ${MAX_FILES} images allowed`);
        }

        const validFiles = [];

        for (let file of selected) {
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

        setFiles((prev) => [...prev, ...validFiles]);
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
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
                toast.success("Images uploaded successfully");
                handleClose();
            }
        } catch (err) {
            toast.error(err.message || "Upload failed");
        }
    };

    const handleClose = () => {
        setFiles([]);
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
                        Click to select images
                    </span>
                    <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>

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
                        disabled={uploadMultipleImages.isPending}
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
        </div>
    );
};

export default UploadImagesModal;
