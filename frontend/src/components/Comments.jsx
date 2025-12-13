import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import TrashCan from "./ui/TrashCan";
import EditPen from "./ui/EditPen";

export default function Comments({ comments, postId, setComments, setError }) {
    const { user } = useContext(AuthContext);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleEdit = (comment) => {
        setEditingId(comment.id);
        setEditText(comment.text);
        setOpenDropdown(null);
    };

    const handleSaveEdit = async (commentId) => {
        const token = localStorage.getItem("token");

        try {
            const result = await fetch(
                `${import.meta.env.VITE_BACKEND_URL
                }/posts/${postId}/comments/${commentId}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: editText }),
                }
            );

            const data = await result.json();

            if (result.ok) {
                setComments((prev) =>
                    prev.map((c) => (c.id === commentId ? { ...c, text: editText } : c))
                );
                setEditingId(null);
                setEditText("");
            } else {
                if (Array.isArray(data.error.message)) {
                    setError(data.error.message.map((error) => error.msg).join(" "));
                } else {
                    setError(data.error.message);
                }
            }
        } catch (e) {
            console.error(e);
            setError("Failed to update comment");
        }
    };

    const handleDelete = async (commentId) => {
        const token = localStorage.getItem("token");

        try {
            const result = await fetch(
                `${import.meta.env.VITE_BACKEND_URL
                }/posts/${postId}/comments/${commentId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (result.ok) {
                setComments((prev) => prev.filter((c) => c.id !== commentId));
                setOpenDropdown(null);
            } else {
                const data = await result.json();
                setError(data.error.message);
            }
        } catch (e) {
            console.error(e);
            setError("Failed to delete comment");
        }
    };

    return (
        <div className="space-y-6">
            {comments.length > 0 ? (
                comments.map((comment) => {
                    const isEditing = editingId === comment.id;
                    const isOwner = (user && user.id === comment.usersId) || user?.admin;

                    return (
                        <div
                            key={comment.id}
                            className="bg-neutral-800 p-6 rounded-lg border border-neutral-800/50"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-emerald-400 font-medium">
                                    {comment.author ? comment.author : "Anonymous"}
                                </span>

                                {isOwner && !isEditing && (
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setOpenDropdown(
                                                    openDropdown === comment.id ? null : comment.id
                                                )
                                            }
                                            className="text-neutral-400 hover:text-neutral-200 p-1 rounded hover:bg-neutral-700 transition-colors cursor-pointer"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                />
                                            </svg>
                                        </button>

                                        {openDropdown === comment.id && (
                                            <div className="absolute right-0 mt-2 w-32 bg-neutral-700 border border-neutral-600 rounded-lg shadow-xl z-10">
                                                <button
                                                    onClick={() => handleEdit(comment)}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-600 rounded-t-lg transition-colors cursor-pointer"
                                                >
                                                    <EditPen w={4} h={4} color={"emerald"} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-red-400 hover:bg-neutral-600 rounded-b-lg transition-colors cursor-pointer"
                                                >
                                                    <TrashCan w={4} h={4} color={"emerald"} />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        maxLength={200}
                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-neutral-600 resize-none"
                                        rows={4}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSaveEdit(comment.id)}
                                            disabled={!editText.trim()}
                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors cursor-pointer"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditText("");
                                            }}
                                            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-sm font-medium rounded transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-neutral-300 text-sm sm:text-base">
                                    {comment.text}
                                </p>
                            )}
                        </div>
                    );
                })
            ) : (
                <p className="text-neutral-500 italic text-center">No comments yet!</p>
            )}
        </div>
    );
}
