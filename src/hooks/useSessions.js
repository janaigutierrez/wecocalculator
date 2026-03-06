// ============================================================
// useSessions.js — Estat de sessions de càrrega
// ============================================================

import { useState } from "react";
import { loadSessions, saveSessions, loadActiveId, genId } from "../utils/sessions";

export function useSessions() {
    const [sessions, setSessions] = useState(() => loadSessions());
    const [activeId, setActiveId] = useState(() => {
        const s = loadSessions();
        return loadActiveId(s);
    });

    const activeSession = sessions.find((s) => s.id === activeId) ?? sessions[0];

    function _commit(newSessions, newActiveId) {
        setSessions(newSessions);
        saveSessions(newSessions, newActiveId ?? activeId);
    }

    function createSession() {
        const id = genId();
        const name = `Càrrega ${sessions.length + 1}`;
        const newSessions = [...sessions, { id, name, cart: [] }];
        setActiveId(id);
        _commit(newSessions, id);
    }

    function switchSession(id) {
        setActiveId(id);
        saveSessions(sessions, id);
    }

    function updateActiveCart(newCart) {
        const newSessions = sessions.map((s) =>
            s.id === activeId ? { ...s, cart: newCart } : s
        );
        _commit(newSessions);
    }

    function renameSession(id, name) {
        _commit(sessions.map((s) => (s.id === id ? { ...s, name } : s)));
    }

    function deleteSession(id) {
        if (sessions.length <= 1) return;
        const newSessions = sessions.filter((s) => s.id !== id);
        const newActiveId = id === activeId ? newSessions[0].id : activeId;
        setActiveId(newActiveId);
        _commit(newSessions, newActiveId);
    }

    return {
        sessions,
        activeId,
        activeSession,
        createSession,
        switchSession,
        updateActiveCart,
        renameSession,
        deleteSession,
    };
}
