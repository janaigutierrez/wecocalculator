// ============================================================
// storage.js — Persistència amb localStorage
// ============================================================

const KEYS = {
    cart: "weco_cart",
    lastProduct: "weco_last_product",
    lastFormat: "weco_last_format",
    deliveryCounter: "weco_delivery_counter",
    companyData: "weco_company_data",
};

export function saveCart(cart) {
    try {
        localStorage.setItem(KEYS.cart, JSON.stringify(cart));
    } catch (e) {
        console.warn("Error guardant cart:", e);
    }
}

export function loadCart() {
    try {
        const raw = localStorage.getItem(KEYS.cart);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

export function saveLastSelection(productKey, formatKey) {
    localStorage.setItem(KEYS.lastProduct, productKey);
    localStorage.setItem(KEYS.lastFormat, formatKey);
}

export function loadLastSelection() {
    return {
        productKey: localStorage.getItem(KEYS.lastProduct) || null,
        formatKey: localStorage.getItem(KEYS.lastFormat) || null,
    };
}

export function getNextDeliveryNumber() {
    const current = parseInt(localStorage.getItem(KEYS.deliveryCounter) || "0");
    const next = current + 1;
    localStorage.setItem(KEYS.deliveryCounter, next.toString());
    return next.toString().padStart(6, "0");
}

export function saveCompanyData(data) {
    localStorage.setItem(KEYS.companyData, JSON.stringify(data));
}

export function loadCompanyData() {
    try {
        const raw = localStorage.getItem(KEYS.companyData);
        return raw ? JSON.parse(raw) : { company: "", address: "" };
    } catch (e) {
        return { company: "", address: "" };
    }
}

export function clearCart() {
    localStorage.removeItem(KEYS.cart);
}