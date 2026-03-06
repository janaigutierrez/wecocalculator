// ============================================================
// useCart.js — Operacions sobre el cart de la sessió activa
// La persistència és responsabilitat de useSessions
// ============================================================

import { calculateTotals } from "../utils/calculator";

export function useCart(cart, updateCart) {
    function addLine(line) {
        updateCart([...cart, { ...line, id: Date.now(), qty: 1 }]);
        return { success: true };
    }

    function removeLine(id) {
        updateCart(cart.filter((l) => l.id !== id));
    }

    // delta: +1 o -1. Mínim qty = 1
    function updateLineQty(id, delta) {
        updateCart(
            cart.map((l) =>
                l.id === id ? { ...l, qty: Math.max(1, (l.qty || 1) + delta) } : l
            )
        );
    }

    function clearCart() {
        updateCart([]);
    }

    const totals = calculateTotals(cart);

    return { cart, totals, addLine, removeLine, updateLineQty, clearCart };
}
