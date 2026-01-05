import React, { useState, useRef } from "react";
import { Upload, X as XIcon, Loader2, Image as ImageIcon } from "lucide-react";
import api from "../../services/api.js";

/**
 * Reusable Image Upload Component
 * @param {Object} props
 * @param {string} props.value - Current image URL
 * @param {function} props.onChange - Callback when image is uploaded (receives URL)
 * @param {string} props.folder - Cloudinary folder name (optional)
 * @param {string} props.label - Label text (optional)
 * @param {boolean} props.required - Whether field is required (optional)
 */
function ImageUpload({
    value = "",
    onChange,
    folder = "ethical-hck",
    label = "Image",
    required = false,
}) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            setError("File size must be less than 10MB");
            return;
        }

        setError("");
        setUploading(true);

        try {
            const result = await api.uploadImage(file, folder);
            onChange(result.url);
        } catch (err) {
            setError(err.message || "Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleRemove = () => {
        onChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-text-primary">
                    {label} {required && "*"}
                </label>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />

            {/* Upload area or preview */}
            {value ? (
                <div className="relative group">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-background">
                        <img
                            src={value}
                            alt="Uploaded preview"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay with actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={handleClick}
                                className="px-4 py-2 rounded-lg bg-accent-red text-white text-sm font-medium hover:bg-accent-redDark transition-colors"
                            >
                                Replace
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <p className="mt-1 text-xs text-text-muted truncate">{value}</p>
                </div>
            ) : (
                <div
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
            relative w-full h-48 rounded-lg border-2 border-dashed cursor-pointer
            flex flex-col items-center justify-center gap-3
            transition-all duration-200
            ${dragOver
                            ? "border-accent-red bg-accent-red/10"
                            : "border-border bg-background hover:border-accent-red/50 hover:bg-surface/50"
                        }
            ${uploading ? "pointer-events-none" : ""}
          `}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
                            <span className="text-sm text-text-muted">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <div className="p-3 rounded-full bg-surface">
                                {dragOver ? (
                                    <ImageIcon className="h-8 w-8 text-accent-red" />
                                ) : (
                                    <Upload className="h-8 w-8 text-text-muted" />
                                )}
                            </div>
                            <div className="text-center">
                                <span className="text-sm text-text-primary font-medium">
                                    {dragOver ? "Drop image here" : "Click to upload or drag and drop"}
                                </span>
                                <p className="text-xs text-text-muted mt-1">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Error message */}
            {error && (
                <p className="text-sm text-accent-red">{error}</p>
            )}
        </div>
    );
}

export default ImageUpload;
