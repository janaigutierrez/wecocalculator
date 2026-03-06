// ============================================================
// sessions.js — Persistència de sessions de càrrega
// ============================================================

const KEY_SESSIONS = "weco_sessions";
const KEY_ACTIVE   = "weco_active_session";

function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Migra el cart antic (weco_cart) a la primera sessió si no hi ha sessions guardades
function migrateOldCart() {
    try {
        const old = localStorage.getItem("weco_cart");
        return old ? JSON.parse(old) : [];
    } catch {
        return [];
    }
}

export function loadSessions() {
    try {
        const raw = localStorage.getItem(KEY_SESSIONS);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch { /* ignore */ }
    // Primera vegada: crea una sessió inicial (migrant cart antic si n'hi ha)
    const initial = [{ id: genId(), name: "Càrrega 1", cart: migrateOldCart() }];
    saveSessions(initial, initial[0].id);
    return initial;
}

export function saveSessions(sessions, activeId) {
    localStorage.setItem(KEY_SESSIONS, JSON.stringify(sessions));
    if (activeId !== undefined) {
        localStorage.setItem(KEY_ACTIVE, activeId);
    }
}

export function loadActiveId(sessions) {
    const saved = localStorage.getItem(KEY_ACTIVE);
    if (saved && sessions.find((s) => s.id === saved)) return saved;
    return sessions[0]?.id ?? null;
}

export { genId };
