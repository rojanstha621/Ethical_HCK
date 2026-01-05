import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Loader2, RefreshCw, Plus, Settings, X as XIcon } from "lucide-react";
import api from "../../services/api.js";
import MemberForm from "./MemberForm";

function MemberList() {
  const [members, setMembers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMember, setEditingMember] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [newPositionName, setNewPositionName] = useState("");
  const [positionLoading, setPositionLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.getMembers();
      if (response.success) {
        setMembers(response.members);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const positionsList = await api.getPositions();
      setPositions(positionsList);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchPositions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.deleteMember(id);
      fetchMembers();
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message || "Failed to delete member");
    }
  };

  const handleEditSuccess = () => {
    setEditingMember(null);
    fetchMembers();
  };

  const handleAddPosition = async () => {
    if (!newPositionName.trim()) return;

    try {
      setPositionLoading(true);
      await api.createPosition(newPositionName.trim());
      setNewPositionName("");
      fetchPositions();
    } catch (err) {
      setError(err.message || "Failed to add position");
    } finally {
      setPositionLoading(false);
    }
  };

  const handleDeletePosition = async (id) => {
    try {
      await api.deletePosition(id);
      fetchPositions();
    } catch (err) {
      setError(err.message || "Failed to delete position");
    }
  };

  if (editingMember) {
    return (
      <MemberForm
        member={editingMember}
        positions={positions}
        onSuccess={handleEditSuccess}
        onCancel={() => setEditingMember(null)}
      />
    );
  }

  // Group members by position
  const groupedMembers = members.reduce((acc, member) => {
    const position = member.position || "No Position";
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(member);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-heading mb-2">Members Management</h2>
          <p className="text-text-muted text-sm">
            Manage community members and their information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPositionModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-red text-white hover:bg-accent-redDark transition-colors"
          >
            <Settings className="h-4 w-4" />
            Manage Positions
          </button>
          <button
            onClick={fetchMembers}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface/50 hover:bg-background/50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-accent-red/10 border border-accent-red/30 text-accent-red">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-20 glass-panel">
          <p className="text-text-muted mb-4">No members found</p>
          <p className="text-sm text-text-muted">
            Add your first member using the "Add Member" tab
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMembers).map(([position, positionMembers]) => (
            <div key={position} className="glass-panel p-6">
              <h3 className="text-lg font-heading mb-4 text-accent-red border-b border-border pb-2">
                {position} ({positionMembers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {positionMembers.map((member) => (
                  <motion.div
                    key={member._id || member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-border rounded-lg p-4 hover:border-accent-red/50 transition-colors bg-background/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-heading text-text-primary">
                          {member.name}
                        </h4>
                        {member.position && (
                          <p className="text-xs text-accent-red mt-1">
                            {member.position}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingMember(member)}
                          className="p-2 rounded-lg hover:bg-surface transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-text-muted hover:text-accent-red" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(member._id || member.id)}
                          className="p-2 rounded-lg hover:bg-surface transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-text-muted hover:text-accent-red" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-text-muted">
                      <p>{member.email}</p>
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noreferrer"
                          className="block hover:text-accent-red transition-colors"
                        >
                          GitHub
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="block hover:text-accent-red transition-colors"
                        >
                          LinkedIn
                        </a>
                      )}
                      {member.instagram && (
                        <a
                          href={member.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="block hover:text-accent-red transition-colors"
                        >
                          Instagram
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Position Management Modal */}
      {showPositionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading">Manage Positions</h3>
              <button
                onClick={() => setShowPositionModal(false)}
                className="p-1 rounded hover:bg-surface transition-colors"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Add new position */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newPositionName}
                onChange={(e) => setNewPositionName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddPosition()}
                placeholder="New position name (e.g., Leader)"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50"
              />
              <button
                onClick={handleAddPosition}
                disabled={positionLoading || !newPositionName.trim()}
                className="px-4 py-2 rounded-lg bg-accent-red text-white hover:bg-accent-redDark transition-colors disabled:opacity-50"
              >
                {positionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Position list */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {positions.length === 0 ? (
                <p className="text-text-muted text-sm text-center py-4">
                  No positions added yet. Add your first position above.
                </p>
              ) : (
                positions.map((position) => (
                  <div
                    key={position._id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50"
                  >
                    <span className="text-text-primary">{position.name}</span>
                    <button
                      onClick={() => handleDeletePosition(position._id)}
                      className="p-1 rounded hover:bg-surface transition-colors"
                      title="Delete position"
                    >
                      <Trash2 className="h-4 w-4 text-text-muted hover:text-accent-red" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <p className="text-xs text-text-muted mt-4">
              Positions will appear as options when adding or editing members.
            </p>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 max-w-md"
          >
            <h3 className="text-lg font-heading mb-4">Confirm Delete</h3>
            <p className="text-text-muted mb-6">
              Are you sure you want to delete this member? This action cannot be undone.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-lg bg-accent-red text-white font-medium hover:bg-accent-redDark transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-transparent text-text-primary font-medium hover:bg-background/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default MemberList;
