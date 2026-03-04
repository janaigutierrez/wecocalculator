// ============================================================
// LinePreview.jsx — Preview del càlcul en temps real
// ============================================================

import { products } from "../data/products";
import { calculateLine, calcPalletData, formatWeight, formatVolume, formatBreakdown } from "../utils/calculator";

export function LinePreview({ selectedProduct, selectedFormat, quantity, palletHeightCm }) {
    if (!selectedProduct || !selectedFormat) {
        return (
            <div className="bg-neutral-800 border border-neutral-700 rounded p-4 min-h-[72px] flex items-center">
                <span className="text-xs font-mono text-neutral-600">
                    Selecciona model i format per veure el càlcul
                </span>
            </div>
        );
    }

    const product = products[selectedProduct];
    const format = product.formats[selectedFormat];

    // --- PALET ---
    if (format.type === "pallet") {
        if (!palletHeightCm || palletHeightCm <= 0) {
            return (
                <div className="bg-neutral-800 border border-neutral-700 rounded p-4 min-h-[72px] flex items-center">
                    <span className="text-xs font-mono text-neutral-600">
                        Introdueix l'alçada del palet per calcular
                    </span>
                </div>
            );
        }

        const { weight, volume, breakdown } = calcPalletData(product, format, quantity, palletHeightCm);

        return (
            <div className="bg-neutral-800 border border-neutral-700 rounded p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-mono font-bold text-neutral-200">
                        {product.shortName} · {format.label}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">{quantity} unitats</span>
                </div>
                <div className="text-xs font-mono text-neutral-500">
                    {formatBreakdown(breakdown)}
                </div>
                <div className="flex gap-4">
                    <span className="text-sm font-mono font-bold text-yellow-400">
                        ⚖ {formatWeight(weight)}
                    </span>
                    <span className="text-sm font-mono font-bold text-yellow-400">
                        📦 {formatVolume(volume)}
                    </span>
                </div>
            </div>
        );
    }

    // --- PACK ---
    const line = calculateLine({ product, productKey: selectedProduct, format, formatKey: selectedFormat, quantity });
    if (!line) return null;

    return (
        <div className="bg-neutral-800 border border-neutral-700 rounded p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-mono font-bold text-neutral-200">
                    {product.shortName} · {format.label}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                    ×{quantity} = {line.totalUnits}u
                </span>
            </div>
            <div className="flex gap-4">
                <span className="text-sm font-mono font-bold text-yellow-400">
                    ⚖ {formatWeight(line.totalWeight)}
                </span>
                <span className="text-sm font-mono font-bold text-yellow-400">
                    📦 {formatVolume(line.totalVolume)}
                </span>
            </div>
        </div>
    );
}