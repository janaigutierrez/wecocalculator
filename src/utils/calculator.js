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
            shortName: product.shortName,
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
        const { weight, volume, breakdown } = calcPalletData(product, format, quantity, palletHeightCm);
        return {
            id: Date.now(),
            productKey,
            formatKey,
            productName: product.name,
            shortName: product.shortName,
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

export function calculatePalletLine({ product, productKey, palletBase, palletBaseKey, unitCount, palletHeightCm }) {
    const weight = roundTo(unitCount * product.unitWeight + palletBase.weight, 3);
    const volume = roundTo(calcPalletVolume(product.barLengthCm, palletBase.dims.width, palletHeightCm), 5);
    return {
        id: Date.now(),
        type: 'pallet',
        productKey,
        productName: product.name,
        shortName: product.shortName,
        palletBaseKey,
        palletBaseLabel: palletBase.label,
        totalUnits: unitCount,
        totalWeight: weight,
        totalVolume: volume,
        palletHeightCm,
    };
}

export function calculateBoxLine({ boxSizeKey, boxSize, weight, observations }) {
    const { l, w, h } = boxSize.dims;
    const volume = roundTo((l / 100) * (w / 100) * (h / 100), 5);
    return {
        id: Date.now(),
        type: 'box',
        boxSizeKey,
        label: `Caixa ${boxSize.label}`,
        dims: boxSize.dims,
        totalWeight: roundTo(weight, 3),
        totalVolume: volume,
        observations: observations || '',
    };
}

export function calculateFreeLine({ label, dims, weight, quantity }) {
    const volume = roundTo((dims.l / 100) * (dims.w / 100) * (dims.h / 100), 5);
    return {
        id: Date.now(),
        type: 'free',
        label,
        dims,
        weight: roundTo(weight, 3),
        volume,
        quantity,
        totalWeight: roundTo(weight * quantity, 3),
        totalVolume: roundTo(volume * quantity, 5),
    };
}

export function calculateTotals(cart) {
    return {
        totalWeight: roundTo(cart.reduce((sum, l) => sum + l.totalWeight * (l.qty || 1), 0), 3),
        totalVolume: roundTo(cart.reduce((sum, l) => sum + l.totalVolume * (l.qty || 1), 0), 5),
        totalUnits: cart.reduce((sum, l) => sum + (l.totalUnits || 0) * (l.qty || 1), 0),
        lineCount: cart.length,
    };
}

export function formatBreakdown(breakdown) {
    return breakdown.map((b) => `${b.qty}× Pack ${b.packSize}`).join(" + ");
}
