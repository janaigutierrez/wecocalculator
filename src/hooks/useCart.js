// ============================================================
// useCart.js — Estat global del cart amb React hooks
// ============================================================

import { useState } from "react";
import { calculateLine, calculateTotals } from "../utils/calculator";
import { saveCart, loadCart, saveLastSelection } from "../utils/storage";
import { products } from "../data/products";

export function useCart() {
    const [cart, setCart] = useState(() => loadCart());

    function addLine({ productKey, formatKey, quantity, palletHeightCm }) {
        const product = products[productKey];
        const format = product.formats[formatKey];

        const line = calculateLine({
            product,
            productKey,
            format,
            formatKey,
            quantity,
            palletHeightCm,
        });

        if (!line) return { error: "Introdueix l'alçada del palet" };

        const newCart = [...cart, { ...line, id: Date.now() }];
        setCart(newCart);
        saveCart(newCart);
        saveLastSelection(productKey, formatKey);
        return { success: true };
    }

    function removeLine(id) {
        const newCart = cart.filter((l) => l.id !== id);
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
        clearCart,
    };
}