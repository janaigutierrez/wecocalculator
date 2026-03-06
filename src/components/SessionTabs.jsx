// ============================================================
// SessionTabs.jsx — Pestanyes de sessió de càrrega
// ============================================================

import { useState, useRef, useEffect } from "react";

export function SessionTabs({ sessions, activeId, onSwitch, onCreate, onRename, onDelete }) {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingId]);

    function startEdit(session, e) {
        e.stopPropagation();
        setEditingId(session.id);
        setEditName(session.name);
    }

    function commitEdit() {
        if (editName.trim()) onRename(editingId, editName.trim());
        setEditingId(null);
    }

    function handleEditKey(e) {
        if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
        if (e.key === "Escape") setEditingId(null);
    }

    return (
        <div className="flex items-center gap-1 overflow-x-auto min-h-[34px]">
            {sessions.map((session) => {
                const isActive = session.id === activeId;
                const isEditing = editingId === session.id;

                return (
                    <div
                        key={session.id}
                        onClick={() => !isEditing && onSwitch(session.id)}
                        className={`group flex items-center gap-1 pl-3 pr-1.5 py-1.5 rounded border text-xs font-mono cursor-pointer flex-shrink-0 transition-all select-none ${
                            isActive
                                ? "bg-neutral-800 border-yellow-400 text-neutral-200"
                                : "bg-transparent border-neutral-800 text-neutral-600 hover:border-neutral-600 hover:text-neutral-400"
                        }`}
                    >
                        {isEditing ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={handleEditKey}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-transparent outline-none w-20 text-xs font-mono text-neutral-200"
                            />
                        ) : (
                            <span
                                onDoubleClick={(e) => startEdit(session, e)}
                                title="Doble-clic per reanomenar"
                            >
                                {session.name}
                            </span>
                        )}

                        {sessions.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                                className={`ml-0.5 w-4 h-4 flex items-center justify-center rounded text-[10px] transition-colors ${
                                    isActive
                                        ? "text-neutral-600 hover:text-red-500"
                                        : "text-neutral-800 group-hover:text-neutral-600 hover:!text-red-500"
                                }`}
                            >
                                ×
                            </button>
                        )}
                    </div>
                );
            })}

            {/* Botó nova sessió */}
            <button
                onClick={onCreate}
                title="Nova sessió de càrrega"
                className="w-7 h-[34px] flex items-center justify-center rounded border border-neutral-800 text-neutral-600 text-sm font-mono hover:border-yellow-400 hover:text-yellow-400 transition-all flex-shrink-0"
            >
                +
            </button>
        </div>
    );
}
