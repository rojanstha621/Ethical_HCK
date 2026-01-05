import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Reusable Custom Sections Component
 * Allows admin to add unlimited custom sections with name and description
 * @param {Object} props
 * @param {Array} props.value - Array of { sectionName, description } objects
 * @param {function} props.onChange - Callback when sections change
 * @param {string} props.label - Label text (optional)
 */
function CustomSections({
    value = [],
    onChange,
    label = "Custom Sections",
}) {
    const [newSection, setNewSection] = useState({ sectionName: "", description: "" });
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleAddSection = () => {
        if (!newSection.sectionName.trim() || !newSection.description.trim()) return;

        onChange([...value, {
            sectionName: newSection.sectionName.trim(),
            description: newSection.description.trim(),
        }]);
        setNewSection({ sectionName: "", description: "" });
    };

    const handleRemoveSection = (index) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleUpdateSection = (index, field, newValue) => {
        const updated = [...value];
        updated[index] = { ...updated[index], [field]: newValue };
        onChange(updated);
    };

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-text-primary">
                {label}
            </label>

            {/* Existing sections */}
            {value.length > 0 && (
                <div className="space-y-3">
                    {value.map((section, index) => (
                        <div
                            key={index}
                            className="border border-border rounded-lg bg-background/50 overflow-hidden"
                        >
                            {/* Section header */}
                            <div
                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-surface/50 transition-colors"
                                onClick={() => toggleExpand(index)}
                            >
                                <div className="flex items-center gap-3">
                                    {expandedIndex === index ? (
                                        <ChevronUp className="h-4 w-4 text-text-muted" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-text-muted" />
                                    )}
                                    <span className="font-medium text-text-primary">
                                        {section.sectionName}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveSection(index);
                                    }}
                                    className="p-1 rounded hover:bg-surface transition-colors"
                                >
                                    <Trash2 className="h-4 w-4 text-text-muted hover:text-accent-red" />
                                </button>
                            </div>

                            {/* Expanded content - editable */}
                            {expandedIndex === index && (
                                <div className="p-3 border-t border-border space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-text-muted mb-1">
                                            Section Name
                                        </label>
                                        <input
                                            type="text"
                                            value={section.sectionName}
                                            onChange={(e) => handleUpdateSection(index, "sectionName", e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-text-muted mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            value={section.description}
                                            onChange={(e) => handleUpdateSection(index, "description", e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-red/50"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add new section */}
            <div className="border border-dashed border-border rounded-lg p-4 space-y-3">
                <p className="text-xs text-text-muted">
                    Add a new custom section (e.g., Community Partners, Sponsors, Special Thanks)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        type="text"
                        value={newSection.sectionName}
                        onChange={(e) => setNewSection(prev => ({ ...prev, sectionName: e.target.value }))}
                        placeholder="Section Name"
                        className="px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50"
                    />
                    <textarea
                        value={newSection.description}
                        onChange={(e) => setNewSection(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description / Content"
                        rows={2}
                        className="px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent-red/50"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAddSection}
                    disabled={!newSection.sectionName.trim() || !newSection.description.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-red text-white hover:bg-accent-redDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="h-4 w-4" />
                    Add Section
                </button>
            </div>

            {value.length > 0 && (
                <p className="text-xs text-text-muted">
                    {value.length} custom section{value.length !== 1 ? 's' : ''} added. Click on a section to edit.
                </p>
            )}
        </div>
    );
}

export default CustomSections;
