// ============================================================
// CartTotals.jsx — Totals globals de la càrrega
// ============================================================

import { formatWeight, formatVolume } from "../utils/calculator";

export function CartTotals({ totals }) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-md p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                    Pes total
                </span>
                <span className="text-2xl font-mono font-bold text-yellow-400">
                    {formatWeight(totals.totalWeight)}
                </span>
            </div>

            <div className="border-t border-neutral-800" />

            <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                    Volum total
                </span>
                <span className="text-2xl font-mono font-bold text-yellow-400">
                    {formatVolume(totals.totalVolume)}
                </span>
            </div>

            <div className="border-t border-neutral-800" />

            <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                    Línies
                </span>
                <span className="text-sm font-mono text-neutral-400">
                    {totals.lineCount} {totals.lineCount === 1 ? "línia" : "línies"}
                </span>
            </div>
        </div>
    );
}