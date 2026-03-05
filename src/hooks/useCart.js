// ============================================================
// useCart.js — Estat global del cart amb React hooks
// ============================================================

import { useState } from "react";
import { calculateTotals } from "../utils/calculator";
import { saveCart, loadCart } from "../utils/storage";

export function useCart() {
    const [cart, setCart] = useState(() => loadCart());

    function addLine(line) {
        const newCart = [...cart, { ...line, id: Date.now(), qty: 1 }];
        setCart(newCart);
        saveCart(newCart);
        return { success: true };
    }

    function removeLine(id) {
        const newCart = cart.filter((l) => l.id !== id);
        setCart(newCart);
        saveCart(newCart);
    }

    // delta: +1 o -1. Mínim qty = 1
    function updateLineQty(id, delta) {
        const newCart = cart.map((l) =>
            l.id === id ? { ...l, qty: Math.max(1, (l.qty || 1) + delta) } : l
        );
        setCart(newCart);
        saveCart(newCart);
    }

    function clearCart() {
        setCart([]);
        saveCart([]);
    }

    const totals = calculateTotals(cart);

    return {
        cart,
        totals,
        addLine,
        removeLine,
        updateLineQty,
        clearCart,
    };
}
