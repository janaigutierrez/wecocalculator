// ============================================================
// products.js — Definició de productes i formats
// Per afegir nous models, copiar l'estructura de SYX169FB4
// ============================================================

export const PALLET_WEIGHT = {
    half: 12,
    full: 25,
};

export const PALLET_DIMS = {
    half: { width: 80, depth: 60 },
    full: { width: 120, depth: 80 },
};

export const UNIT_WEIGHT = 3.5;

export const products = {
    SYX169FB4: {
        name: "Barrera SYX.169.FB4",
        shortName: "SYX.169",
        unitWeight: UNIT_WEIGHT,
        barLengthCm: 205,
        isFavorite: true,
        formats: {
            pack2: {
                label: "Pack 2",
                units: 2,
                weight: UNIT_WEIGHT * 2,
                volume: (205 / 100) * (15 / 100) * (10 / 100),
                dims: { l: 205, w: 15, h: 10 },
                type: "pack",
            },
            pack3: {
                label: "Pack 3",
                units: 3,
                weight: UNIT_WEIGHT * 3,
                volume: (205 / 100) * (15 / 100) * (15 / 100),
                dims: { l: 205, w: 15, h: 15 },
                type: "pack",
            },
            pack4: {
                label: "Pack 4",
                units: 4,
                weight: UNIT_WEIGHT * 4,
                volume: (205 / 100) * (15 / 100) * (15 / 100),
                dims: { l: 205, w: 15, h: 15 },
                type: "pack",
            },
            pack5: {
                label: "Pack 5",
                units: 5,
                weight: UNIT_WEIGHT * 5,
                volume: (205 / 100) * (25 / 100) * (15 / 100),
                dims: { l: 205, w: 25, h: 15 },
                type: "pack",
            },
            halfPallet: {
                label: "Mig Palet (30-39u)",
                minUnits: 30,
                maxUnits: 39,
                palletWeight: PALLET_WEIGHT.half,
                palletDims: PALLET_DIMS.half,
                type: "pallet",
                palletType: "half",
            },
            fullPallet: {
                label: "Palet Europeu (40+u)",
                minUnits: 40,
                maxUnits: null,
                palletWeight: PALLET_WEIGHT.full,
                palletDims: PALLET_DIMS.full,
                type: "pallet",
                palletType: "full",
            },
        },
    },
};