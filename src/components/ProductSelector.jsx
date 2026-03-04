// ============================================================
// ProductSelector.jsx — Botons ràpids + desplegable altres models
// ============================================================

import { products } from "../data/products";

export function ProductSelector({ selectedProduct, onSelect }) {
    const favorites = Object.entries(products).filter(([, p]) => p.isFavorite);
    const others = Object.entries(products).filter(([, p]) => !p.isFavorite);

    return (
        <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Model
            </span>

            {/* Favorits */}
            <div className="flex flex-wrap gap-2">
                {favorites.map(([key, product]) => (
                    <button
                        key={key}
                        onClick={() => onSelect(key)}
                        className={`px-4 py-2 text-sm font-mono font-bold rounded border transition-all ${selectedProduct === key
                                ? "bg-yellow-400/10 border-yellow-400 text-yellow-400"
                                : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-yellow-400 hover:text-yellow-400"
                            }`}
                    >
                        {product.shortName || product.name}
                    </button>
                ))}
            </div>

            {/* Altres */}
            {others.length > 0 && (
                <select
                    onChange={(e) => e.target.value && onSelect(e.target.value)}
                    value=""
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-xs px-3 py-2 rounded outline-none focus:border-yellow-400"
                >
                    <option value="">Altres models...</option>
                    {others.map(([key, product]) => (
                        <option key={key} value={key}>
                            {product.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}