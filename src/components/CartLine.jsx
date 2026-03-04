// ============================================================
// CartLine.jsx — Línia individual del cart
// ============================================================

import { formatWeight, formatVolume, formatBreakdown } from "../utils/calculator";

export function CartLine({ line, onRemove }) {
    const qtyLabel =
        line.type === "pallet"
            ? `${line.unitsPerPallet} unitats`
            : `×${line.quantity} (${line.totalUnits}u)`;

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-md p-3 flex items-center gap-3 hover:border-neutral-700 transition-all">

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-neutral-200">
                        {line.productName}
                    </span>
                    <span className="text-xs font-mono bg-neutral-800 border border-neutral-700 text-neutral-500 px-2 py-0.5 rounded">
                        {line.formatLabel}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                        {qtyLabel}
                    </span>
                </div>

                {/* Desglossament palet */}
                {line.type === "pallet" && line.breakdown && (
                    <div className="text-xs font-mono text-neutral-600 mt-1">
                        {formatBreakdown(line.breakdown)} · alçada {line.palletHeightCm}cm
                    </div>
                )}
            </div>

            {/* Valors */}
            <div className="flex flex-col items-end gap-0.5 min-w-[90px]">
                <span className="text-sm font-mono font-bold text-neutral-200">
                    {formatWeight(line.totalWeight)}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                    {formatVolume(line.totalVolume)}
                </span>
            </div>

            {/* Botó eliminar */}
            <button
                onClick={() => onRemove(line.id)}
                className="w-7 h-7 flex items-center justify-center rounded border border-transparent text-neutral-600 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all text-xs flex-shrink-0"
            >
                ✕
            </button>
        </div>
    );
}