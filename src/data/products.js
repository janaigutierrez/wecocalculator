// ============================================================
// products.js — Definició de productes i formats
// Per afegir nous productes: afegir entrada a `products` usant
// packFormats(unitWeight, barLengthCm) per generar els formats.
// ============================================================

export const BOX_SIZES = {
    gran: { label: 'Gran', dims: { l: 40, w: 30, h: 20 } },
    mitjana: { label: 'Mitjana', dims: { l: 30, w: 20, h: 20 } },
    petita: { label: 'Petita', dims: { l: 20, w: 18, h: 12 } },
};

export const PALLET_BASES = {
    mig: { label: 'Mig palet', shortLabel: 'Mig', weight: 12, dims: { width: 80, depth: 60 } },
    europeu: { label: 'Palet europeu', shortLabel: 'Europeu', weight: 20, dims: { width: 120, depth: 80 } },
    especial: { label: 'Palet especial', shortLabel: 'Especial', weight: 60, dims: { width: 120, depth: 240 } },
};

// Helper: genera formats pack 2/3/4/5 per a un producte
function packFormats(unitWeight, barLengthCm) {
    const L = barLengthCm;
    return {
        pack2: { label: "Pack 2", units: 2, weight: unitWeight * 2, volume: (L / 100) * (10 / 100) * (5 / 100), dims: { l: L, w: 10, h: 5 }, type: "pack" },
        pack3: { label: "Pack 3", units: 3, weight: unitWeight * 3, volume: (L / 100) * (15 / 100) * (15 / 100), dims: { l: L, w: 15, h: 15 }, type: "pack" },
        pack4: { label: "Pack 4", units: 4, weight: unitWeight * 4, volume: (L / 100) * (15 / 100) * (15 / 100), dims: { l: L, w: 15, h: 15 }, type: "pack" },
        pack5: { label: "Pack 5", units: 5, weight: unitWeight * 5, volume: (L / 100) * (25 / 100) * (15 / 100), dims: { l: L, w: 25, h: 15 }, type: "pack" },
    };
}

export const products = {
    SYX169FB4: {
        name: "Barrera SYX.169.FB4",
        shortName: "SYX.169",
        unitWeight: 3.5,
        barLengthCm: 205,
        isFavorite: true,
        formats: packFormats(3.5, 205),
    },
    BRACKETS: {
        name: "Bracket",
        shortName: "Bracket",
        unitWeight: 5,
        barLengthCm: 225,
        isFavorite: true,
        formats: packFormats(5, 225),
    },
};
