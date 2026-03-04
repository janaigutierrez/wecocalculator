// ============================================================
// calculator.js — Lògica de càlcul
// ============================================================

export function roundTo(value, decimals) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function formatWeight(kg) {
    return `${kg.toLocaleString("ca-ES")} kg`;
}

export function formatVolume(m3) {
    return `${m3.toFixed(4)} m³`;
}

export function breakdownPalletUnits(totalUnits) {
    const breakdown = [];
    let remaining = totalUnits;
    const packSizes = [5, 4, 3, 2];
    for (const size of packSizes) {
        if (remaining >= size) {
            const count = Math.floor(remaining / size);
            breakdown.push({ packSize: size, qty: count });
            remaining -= count * size;
        }
    }
    if (remaining > 0) {
        breakdown.push({ packSize: remaining, qty: 1 });
    }
    return breakdown;
}

export function calcPalletVolume(barLengthCm, palletWidthCm, heightCm) {
    return (barLengthCm / 100) * (palletWidthCm / 100) * (heightCm / 100);
}

export function calcPalletData(product, format, units, heightCm) {
    const totalUnitWeight = units * product.unitWeight;
    const weight = totalUnitWeight + format.palletWeight;
    const volume = calcPalletVolume(
        product.barLengthCm,
        format.palletDims.width,
        heightCm
    );
    const breakdown = breakdownPalletUnits(units);
    return { weight, volume, breakdown };
}

export function calculateLine({ product, productKey, format, formatKey, quantity, palletHeightCm = null }) {
    if (format.type === "pack") {
        return {
            id: Date.now(),
            productKey,
            formatKey,
            productName: product.name,
            formatLabel: format.label,
            quantity,
            totalUnits: format.units * quantity,
            totalWeight: roundTo(format.weight * quantity, 3),
            totalVolume: roundTo(format.volume * quantity, 5),
            type: "pack",
            dims: format.dims,
        };
    }

    if (format.type === "pallet") {
        if (!palletHeightCm || palletHeightCm <= 0) return null;
        const { weight, volume, breakdown } = calcPalletData(product, format, units, palletHeightCm);
        return {
            id: Date.now(),
            productKey,
            formatKey,
            productName: product.name,
            formatLabel: format.label,
            quantity: 1,
            totalUnits: quantity,
            totalWeight: roundTo(weight, 3),
            totalVolume: roundTo(volume, 5),
            type: "pallet",
            palletType: format.palletType,
            palletHeightCm,
            breakdown,
            unitsPerPallet: quantity,
        };
    }
}

export function calculateTotals(cart) {
    return {
        totalWeight: roundTo(cart.reduce((sum, l) => sum + l.totalWeight, 0), 3),
        totalVolume: roundTo(cart.reduce((sum, l) => sum + l.totalVolume, 0), 5),
        totalUnits: cart.reduce((sum, l) => sum + (l.totalUnits || 0), 0),
        lineCount: cart.length,
    };
}

export function formatBreakdown(breakdown) {
    return breakdown.map((b) => `${b.qty}× Pack ${b.packSize}`).join(" + ");
}