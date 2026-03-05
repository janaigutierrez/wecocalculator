// ============================================================
// CartLine.jsx — Línia individual del cart amb comptador ×N
// ============================================================

import { formatWeight, formatVolume, roundTo } from "../utils/calculator";

export function CartLine({ line, onRemove, onUpdateQty }) {
    const qty = line.qty || 1;
    const displayWeight = roundTo(line.totalWeight * qty, 3);
    const displayVolume = roundTo(line.totalVolume * qty, 5);

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-md p-3 flex items-center gap-3 hover:border-neutral-700 transition-all">

            {/* Info */}
            <div className="flex-1 min-w-0">
                {line.type === "box"    && <BoxLineInfo    line={line} />}
                {line.type === "free"   && <FreeLineInfo   line={line} />}
                {(line.type === "pack" || line.type === "pallet") && <BarreraLineInfo line={line} />}
            </div>

            {/* Valors (×qty aplicat) */}
            <div className="flex flex-col items-end gap-0.5 min-w-[90px]">
                <span className="text-sm font-mono font-bold text-neutral-200">
                    {formatWeight(displayWeight)}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                    {formatVolume(displayVolume)}
                </span>
            </div>

            {/* Comptador ×N + eliminar */}
            <div className="flex items-center gap-1 flex-shrink-0">
                <button
                    onClick={() => onUpdateQty(-1)}
                    disabled={qty <= 1}
                    className="w-6 h-6 flex items-center justify-center rounded border border-neutral-700 text-neutral-500 font-mono text-xs hover:border-yellow-400 hover:text-yellow-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    −
                </button>
                <span className="text-xs font-mono text-neutral-400 w-7 text-center">×{qty}</span>
                <button
                    onClick={() => onUpdateQty(+1)}
                    className="w-6 h-6 flex items-center justify-center rounded border border-neutral-700 text-neutral-500 font-mono text-xs hover:border-yellow-400 hover:text-yellow-400 transition-all"
                >
                    +
                </button>
                <button
                    onClick={() => onRemove(line.id)}
                    className="w-6 h-6 flex items-center justify-center rounded border border-transparent text-neutral-600 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all text-xs ml-1"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

function BarreraLineInfo({ line }) {
    if (line.type === "pallet") {
        const label = line.palletBaseLabel || line.formatLabel || "Palet";
        const units = line.totalUnits ?? "?";
        return (
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-neutral-200">{line.productName}</span>
                <span className="text-xs font-mono bg-neutral-800 border border-neutral-700 text-neutral-500 px-2 py-0.5 rounded">{label}</span>
                <span className="text-xs font-mono text-neutral-500">{units} u.</span>
                {line.palletHeightCm && (
                    <span className="text-xs font-mono text-neutral-600">h:{line.palletHeightCm}cm</span>
                )}
            </div>
        );
    }
    // pack
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-neutral-200">{line.productName}</span>
            <span className="text-xs font-mono bg-neutral-800 border border-neutral-700 text-neutral-500 px-2 py-0.5 rounded">{line.formatLabel}</span>
            <span className="text-xs font-mono text-neutral-500">×{line.quantity} ({line.totalUnits}u)</span>
        </div>
    );
}

function BoxLineInfo({ line }) {
    return (
        <>
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-neutral-200">{line.label}</span>
                <span className="text-xs font-mono bg-neutral-800 border border-neutral-700 text-neutral-500 px-2 py-0.5 rounded">
                    {line.dims.l}×{line.dims.w}×{line.dims.h} cm
                </span>
            </div>
            {line.observations && (
                <div className="text-xs font-mono text-neutral-600 mt-1">{line.observations}</div>
            )}
        </>
    );
}

function FreeLineInfo({ line }) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-neutral-200">{line.label}</span>
            <span className="text-xs font-mono bg-neutral-800 border border-neutral-700 text-neutral-500 px-2 py-0.5 rounded">
                {line.dims.l}×{line.dims.w}×{line.dims.h} cm
            </span>
            {line.quantity > 1 && (
                <span className="text-xs font-mono text-neutral-500">×{line.quantity}</span>
            )}
        </div>
    );
}
