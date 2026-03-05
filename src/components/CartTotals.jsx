// ============================================================
// CartTotals.jsx — Totals globals + resum per model
// ============================================================

import { formatWeight, formatVolume, roundTo } from "../utils/calculator";

export function CartTotals({ totals, cart }) {
    const groups = buildGroups(cart);

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-md p-4 flex flex-col gap-3">

            {/* Totals globals */}
            <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Pes total</span>
                <span className="text-2xl font-mono font-bold text-yellow-400">
                    {formatWeight(totals.totalWeight)}
                </span>
            </div>

            <div className="border-t border-neutral-800" />

            <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Volum total</span>
                <span className="text-2xl font-mono font-bold text-yellow-400">
                    {formatVolume(totals.totalVolume)}
                </span>
            </div>

            <div className="border-t border-neutral-800" />

            {/* Línies + resum per model (tot junt) */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                    {totals.lineCount} {totals.lineCount === 1 ? "línia" : "línies"}:
                </span>
                {groups.map((g, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 pl-2">
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-mono font-bold text-neutral-300 truncate">{g.name}</span>
                            {g.detail && (
                                <span className="text-xs font-mono text-neutral-600">{g.detail}</span>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                            <span className="text-xs font-mono text-neutral-300">{formatWeight(g.totalWeight)}</span>
                            <span className="text-xs font-mono text-neutral-500">{formatVolume(g.totalVolume)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function buildGroups(cart) {
    const barrierMap = {};
    const boxMap = {};
    const freeList = [];

    for (const line of cart) {
        const q = line.qty || 1;
        if (line.type === "pack" || line.type === "pallet") {
            const key = line.productKey;
            if (!barrierMap[key]) {
                barrierMap[key] = { name: line.shortName || line.productName, units: 0, totalWeight: 0, totalVolume: 0 };
            }
            barrierMap[key].units += (line.totalUnits || 0) * q;
            barrierMap[key].totalWeight = roundTo(barrierMap[key].totalWeight + line.totalWeight * q, 3);
            barrierMap[key].totalVolume = roundTo(barrierMap[key].totalVolume + line.totalVolume * q, 5);
        } else if (line.type === "box") {
            const key = line.boxSizeKey;
            if (!boxMap[key]) {
                boxMap[key] = { name: line.label, count: 0, totalWeight: 0, totalVolume: 0 };
            }
            boxMap[key].count += q;
            boxMap[key].totalWeight = roundTo(boxMap[key].totalWeight + line.totalWeight * q, 3);
            boxMap[key].totalVolume = roundTo(boxMap[key].totalVolume + line.totalVolume * q, 5);
        } else if (line.type === "free") {
            const lineQtyLabel = q > 1 ? ` ×${q}` : "";
            freeList.push({
                name: line.label,
                detail: `${line.dims.l}×${line.dims.w}×${line.dims.h} cm${lineQtyLabel}`,
                totalWeight: roundTo(line.totalWeight * q, 3),
                totalVolume: roundTo(line.totalVolume * q, 5),
            });
        }
    }

    const groups = [];

    for (const g of Object.values(barrierMap)) {
        groups.push({
            name: g.name,
            detail: `${g.units} unitats`,
            totalWeight: g.totalWeight,
            totalVolume: g.totalVolume,
        });
    }

    for (const g of Object.values(boxMap)) {
        groups.push({
            name: g.name,
            detail: `${g.count} ${g.count === 1 ? "caixa" : "caixes"}`,
            totalWeight: g.totalWeight,
            totalVolume: g.totalVolume,
        });
    }

    for (const g of freeList) {
        groups.push(g);
    }

    return groups;
}
