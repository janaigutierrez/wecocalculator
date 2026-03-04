// ============================================================
// FormatSelector.jsx — Botons de selecció de format
// ============================================================

import { products } from "../data/products";

export function FormatSelector({ selectedProduct, selectedFormat, onSelect }) {
    if (!selectedProduct) return null;

    const formats = products[selectedProduct].formats;

    return (
        <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Format
            </span>

            <div className="grid grid-cols-2 gap-2">
                {Object.entries(formats).map(([key, format]) => (
                    <button
                        key={key}
                        onClick={() => onSelect(key)}
                        className={`p-3 rounded border text-left transition-all ${selectedFormat === key
                                ? "bg-yellow-400/10 border-yellow-400"
                                : "bg-neutral-800 border-neutral-700 hover:border-yellow-400"
                            }`}
                    >
                        <span
                            className={`block text-sm font-mono font-bold ${selectedFormat === key ? "text-yellow-400" : "text-neutral-300"
                                }`}
                        >
                            {format.label}
                        </span>
                        {format.type === "pack" && (
                            <span className="block text-xs text-neutral-500 mt-1">
                                {format.weight}kg · {(format.volume * 1000).toFixed(1)}L
                            </span>
                        )}
                        {format.type === "pallet" && (
                            <span className="block text-xs text-neutral-500 mt-1">
                                {format.minUnits}–{format.maxUnits ?? "∞"} unitats
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}