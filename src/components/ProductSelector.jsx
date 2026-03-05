// ============================================================
// ProductSelector.jsx — Cerca de text amb dropdown filtrat
// ============================================================

import { useState } from "react";
import { products } from "../data/products";

export function ProductSelector({ selectedProduct, onSelect }) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const selectedData = selectedProduct ? products[selectedProduct] : null;
    const displayName = selectedData ? (selectedData.shortName || selectedData.name) : "";

    const allEntries = Object.entries(products);
    const favorites = allEntries.filter(([, p]) => p.isFavorite);
    const others = allEntries.filter(([, p]) => !p.isFavorite);

    const q = query.toLowerCase().trim();
    const filtered = q
        ? allEntries.filter(([, p]) =>
            p.name.toLowerCase().includes(q) ||
            (p.shortName && p.shortName.toLowerCase().includes(q)))
        : null;

    function handleSelect(key) {
        onSelect(key);
        setQuery("");
        setOpen(false);
    }

    return (
        <div className="relative">
            <input
                type="text"
                value={open ? query : displayName}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => { setQuery(""); setOpen(true); }}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                placeholder="Cerca model..."
                className={`w-full bg-neutral-800 border font-mono text-sm px-3 py-2.5 rounded outline-none transition-all ${
                    selectedProduct && !open
                        ? "border-yellow-400 text-yellow-400"
                        : "border-neutral-700 text-neutral-300 focus:border-yellow-400"
                }`}
            />
            {open && (
                <div className="absolute top-full left-0 right-0 bg-neutral-800 border border-t-0 border-neutral-700 rounded-b z-20 max-h-52 overflow-y-auto shadow-xl">
                    {filtered ? (
                        filtered.length === 0 ? (
                            <div className="px-3 py-2 text-xs font-mono text-neutral-600">Cap resultat</div>
                        ) : filtered.map(([key, p]) => (
                            <ProductOption key={key} productKey={key} product={p} selected={selectedProduct === key} onSelect={handleSelect} />
                        ))
                    ) : (
                        <>
                            {favorites.length > 0 && (
                                <>
                                    <div className="px-3 py-1.5 text-xs font-mono text-neutral-600 uppercase tracking-widest">⭐ Favorits</div>
                                    {favorites.map(([key, p]) => (
                                        <ProductOption key={key} productKey={key} product={p} selected={selectedProduct === key} onSelect={handleSelect} />
                                    ))}
                                </>
                            )}
                            {others.length > 0 && (
                                <>
                                    <div className="px-3 py-1.5 text-xs font-mono text-neutral-600 uppercase tracking-widest border-t border-neutral-700">Tots</div>
                                    {others.map(([key, p]) => (
                                        <ProductOption key={key} productKey={key} product={p} selected={selectedProduct === key} onSelect={handleSelect} />
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function ProductOption({ productKey, product, selected, onSelect }) {
    return (
        <button
            onMouseDown={() => onSelect(productKey)}
            className={`w-full text-left px-3 py-2 font-mono text-sm transition-all ${
                selected
                    ? "bg-yellow-400/10 text-yellow-400"
                    : "text-neutral-300 hover:bg-neutral-700"
            }`}
        >
            {product.shortName || product.name}
            {product.shortName && product.shortName !== product.name && (
                <span className="text-neutral-600 text-xs ml-2">{product.name}</span>
            )}
        </button>
    );
}
