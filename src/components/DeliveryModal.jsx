// ============================================================
// DeliveryModal.jsx — Previsualització i impressió del full de càrrega
// ============================================================

import { calculateTotals, formatWeight, formatVolume } from "../utils/calculator";
import { printDeliveryNote } from "../utils/print";

export function DeliveryModal({ cart, onClose }) {
    const totals = calculateTotals(cart);

    const date = new Date().toLocaleDateString("ca-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    function handlePrint() {
        printDeliveryNote(cart);
    }

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-neutral-800 flex-shrink-0">
                    <span className="font-mono font-bold text-xs uppercase tracking-widest text-neutral-300">
                        Full de Càrrega
                    </span>
                    <button
                        onClick={onClose}
                        className="text-neutral-600 hover:text-neutral-300 transition-colors text-sm"
                    >
                        ✕
                    </button>
                </div>

                {/* Document preview — scrollable */}
                <div className="overflow-y-auto flex-1 p-5">
                    <div className="bg-white text-black rounded font-mono text-xs p-6 flex flex-col gap-4">

                        {/* Document header */}
                        <div className="flex justify-between items-start pb-3 border-b-2 border-black">
                            <div>
                                <h1 className="text-base font-bold tracking-widest uppercase">Full de Càrrega</h1>
                                <p className="text-[10px] text-gray-500 mt-0.5 tracking-wider uppercase">WECO Calculator</p>
                            </div>
                            <div className="text-right text-[11px] text-gray-500">{date}</div>
                        </div>

                        {/* Lines table */}
                        {cart.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">Cap línia afegida</p>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-300">
                                        <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-gray-500 font-normal w-6">#</th>
                                        <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-gray-500 font-normal">Descripció</th>
                                        <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-gray-500 font-normal">Detall</th>
                                        <th className="pb-2 text-right text-[10px] uppercase tracking-wider text-gray-500 font-normal">Pes</th>
                                        <th className="pb-2 text-right text-[10px] uppercase tracking-wider text-gray-500 font-normal">Volum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((line, i) => {
                                        const { desc, detail } = lineDescription(line);
                                        const q = line.qty || 1;
                                        const w = line.totalWeight * q;
                                        const v = line.totalVolume * q;
                                        return (
                                            <tr key={line.id} className="border-b border-gray-100">
                                                <td className="py-2 text-gray-400">{i + 1}</td>
                                                <td className="py-2 font-bold pr-3">{desc}{q > 1 && <span className="text-gray-400 font-normal ml-1">×{q}</span>}</td>
                                                <td className="py-2 text-gray-500 pr-3">{detail}</td>
                                                <td className="py-2 text-right whitespace-nowrap">{formatWeight(w)}</td>
                                                <td className="py-2 text-right whitespace-nowrap text-gray-600">{formatVolume(v)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        {/* Totals */}
                        <div className="flex justify-end pt-2">
                            <div className="border-t-2 border-black min-w-[240px]">
                                <div className="flex justify-between items-baseline py-1.5 border-b border-gray-200">
                                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Pes total</span>
                                    <span className="text-base font-bold">{formatWeight(totals.totalWeight)}</span>
                                </div>
                                <div className="flex justify-between items-baseline py-1.5 border-b border-gray-200">
                                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Volum total</span>
                                    <span className="text-base font-bold">{formatVolume(totals.totalVolume)}</span>
                                </div>
                                <div className="flex justify-between items-baseline py-1.5">
                                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Línies</span>
                                    <span className="text-sm text-gray-600">{totals.lineCount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Signature area */}
                        <div className="flex gap-10 mt-6 pt-4">
                            <div className="flex-1 border-t border-gray-300 pt-2 text-[10px] uppercase tracking-wider text-gray-400">
                                Preparat per
                            </div>
                            <div className="flex-1 border-t border-gray-300 pt-2 text-[10px] uppercase tracking-wider text-gray-400">
                                Rebut per
            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-5 py-4 border-t border-neutral-800 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="bg-transparent border border-neutral-700 text-neutral-400 font-mono text-xs px-4 py-2 rounded hover:border-neutral-500 hover:text-neutral-200 transition-all"
                    >
                        Tancar
                    </button>
                    <button
                        onClick={handlePrint}
                        disabled={cart.length === 0}
                        className="bg-yellow-400 text-black font-mono font-bold text-xs px-4 py-2 rounded hover:bg-yellow-300 transition-all disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed"
                    >
                        🖨 Imprimir / PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

function lineDescription(line) {
    if (line.type === "pack") {
        return {
            desc: `${line.shortName || line.productName} — ${line.formatLabel}`,
            detail: `${line.quantity} packs · ${line.totalUnits} u.`,
        };
    }
    if (line.type === "pallet") {
        return {
            desc: `${line.shortName || line.productName} — ${line.palletBaseLabel}`,
            detail: `${line.totalUnits} u. · h: ${line.palletHeightCm} cm`,
        };
    }
    if (line.type === "box") {
        return {
            desc: line.label,
            detail: line.observations || `${line.dims.l}×${line.dims.w}×${line.dims.h} cm`,
        };
    }
    if (line.type === "free") {
        const qty = line.quantity > 1 ? ` ×${line.quantity}` : "";
        return {
            desc: line.label,
            detail: `${line.dims.l}×${line.dims.w}×${line.dims.h} cm${qty}`,
        };
    }
    return { desc: "—", detail: "" };
}
