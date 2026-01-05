import React, { useState, useRef } from "react";
import { Upload, X as XIcon, Loader2, Image as ImageIcon, Plus } from "lucide-react";
import api from "../../services/api.js";

/**
 * Reusable Multi-Image Upload Component for galleries
 * @param {Object} props
 * @param {string[]} props.value - Array of current image URLs
 * @param {function} props.onChange - Callback when images change (receives array of URLs)
 * @param {string} props.folder - Cloudinary folder name (optional)
 * @param {string} props.label - Label text (optional)
 * @param {number} props.maxImages - Maximum number of images (optional, default 10)
 */
function MultiImageUpload({
    value = [],
    onChange,
    folder = "ethical-hck/gallery",
    label = "Gallery Images",
    maxImages = 10,
}) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleFilesSelect = async (files) => {
        if (!files || files.length === 0) return;

        // Check max images limit
        if (value.length + files.length > maxImages) {
            setError(`Maximum ${maxImages} images allowed`);
            return;
        }

        // Validate all files
        const validFiles = [];
        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                setError("Please select only image files");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError("Each file must be less than 10MB");
                return;
            }
            validFiles.push(file);
        }

        setError("");
        setUploading(true);

        try {
            // Upload files one by one to avoid overwhelming the server
            const newUrls = [];
            for (const file of validFiles) {
                const result = await api.uploadImage(file, folder);
                newUrls.push(result.url);
            }
            onChange([...value, ...newUrls]);
        } catch (err) {
            setError(err.message || "Failed to upload images");
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            handleFilesSelect(files);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length > 0) {
            handleFilesSelect(files);
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

    const handleRemove = (index) => {
        const newValue = value.filter((_, i) => i !== index);
        onChange(newValue);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-sm font-medium text-text-primary">
                    {label}
                </label>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleInputChange}
                className="hidden"
            />

            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {/* Existing images */}
                {value.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                        <div className="w-full h-full rounded-lg overflow-hidden border border-border bg-background">
                            <img
                                src={url}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute top-1 right-1 p-1.5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <XIcon className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add more button / drop zone */}
                {value.length < maxImages && (
                    <div
                        onClick={handleClick}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`
              aspect-square rounded-lg border-2 border-dashed cursor-pointer
              flex flex-col items-center justify-center gap-2
              transition-all duration-200
              ${dragOver
                                ? "border-accent-red bg-accent-red/10"
                                : "border-border bg-background hover:border-accent-red/50 hover:bg-surface/50"
                            }
              ${uploading ? "pointer-events-none" : ""}
            `}
                    >
                        {uploading ? (
                            <Loader2 className="h-6 w-6 text-accent-red animate-spin" />
                        ) : (
                            <>
                                <Plus className="h-6 w-6 text-text-muted" />
                                <span className="text-xs text-text-muted text-center px-2">
                                    Add images
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Info text */}
            <p className="text-xs text-text-muted">
                {value.length} of {maxImages} images • Click or drag to add more
            </p>

            {/* Error message */}
            {error && (
                <p className="text-sm text-accent-red">{error}</p>
            )}
        </div>
    );
}

export default MultiImageUpload;
