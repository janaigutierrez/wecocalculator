// ============================================================
// print.js — Generació del full de càrrega per imprimir
// ============================================================

import { calculateTotals, formatWeight, formatVolume } from "./calculator";

export function printDeliveryNote(cart) {
    const totals = calculateTotals(cart);
    const html = buildPrintHTML(cart, totals);
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.focus();
    // Delay to allow resources to load before print dialog
    setTimeout(() => win.print(), 300);
}

function lineDescription(line) {
    if (line.type === "pack") {
        return {
            desc: `${line.productName || line.shortName} — ${line.formatLabel}`,
            detail: `${line.quantity} packs · ${line.totalUnits} u.`,
        };
    }
    if (line.type === "pallet") {
        return {
            desc: `${line.productName || line.shortName} — ${line.palletBaseLabel}`,
            detail: `${line.totalUnits} u. · h: ${line.palletHeightCm} cm`,
        };
    }
    if (line.type === "box") {
        return {
            desc: line.label,
            detail: line.observations
                ? line.observations
                : `${line.dims.l}×${line.dims.w}×${line.dims.h} cm`,
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

function buildPrintHTML(cart, totals) {
    const date = new Date().toLocaleDateString("ca-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const rows = cart
        .map((line, i) => {
            const { desc, detail } = lineDescription(line);
            const q = line.qty || 1;
            const w = line.totalWeight * q;
            const v = line.totalVolume * q;
            const qLabel = q > 1 ? ` ×${q}` : "";
            return `
        <tr>
            <td class="n">${i + 1}</td>
            <td class="desc">${escHtml(desc)}${qLabel ? `<span style="color:#aaa;font-weight:normal">${escHtml(qLabel)}</span>` : ""}</td>
            <td class="detail">${escHtml(detail)}</td>
            <td class="num">${escHtml(formatWeight(w))}</td>
            <td class="num">${escHtml(formatVolume(v))}</td>
        </tr>`;
        })
        .join("\n");

    return `<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <title>Full de Càrrega — WECO</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #111;
            background: #fff;
            padding: 32px 40px;
        }
        @media print {
            body { padding: 12px 20px; }
        }

        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 28px;
            padding-bottom: 16px;
            border-bottom: 2px solid #111;
        }
        .header h1 {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 3px;
            text-transform: uppercase;
        }
        .header .sub {
            font-size: 11px;
            color: #888;
            margin-top: 4px;
            letter-spacing: 1px;
        }
        .header .date {
            font-size: 12px;
            color: #555;
            text-align: right;
        }

        /* Table */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 28px;
        }
        thead tr {
            border-bottom: 1px solid #111;
        }
        th {
            padding: 8px 10px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #555;
            font-weight: normal;
        }
        th.num { text-align: right; }
        td {
            padding: 8px 10px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: top;
        }
        td.n    { color: #aaa; width: 30px; }
        td.desc { font-weight: bold; }
        td.detail { color: #666; font-size: 11px; }
        td.num  { text-align: right; white-space: nowrap; }
        tbody tr:last-child td { border-bottom: none; }

        /* Totals */
        .totals {
            display: flex;
            justify-content: flex-end;
            margin-top: 8px;
        }
        .totals-box {
            border-top: 2px solid #111;
            min-width: 280px;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            padding: 8px 10px;
            border-bottom: 1px solid #e5e7eb;
        }
        .totals-row:last-child { border-bottom: none; }
        .totals-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #555;
        }
        .totals-value {
            font-size: 16px;
            font-weight: bold;
        }
        .totals-value.small { font-size: 13px; font-weight: normal; color: #444; }

        /* Signature area */
        .signatures {
            margin-top: 48px;
            display: flex;
            gap: 48px;
        }
        .sig-box {
            flex: 1;
            border-top: 1px solid #aaa;
            padding-top: 8px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Full de Càrrega</h1>
            <div class="sub">WECO Calculator</div>
        </div>
        <div class="date">${escHtml(date)}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Descripció</th>
                <th>Detall</th>
                <th class="num">Pes</th>
                <th class="num">Volum</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>

    <div class="totals">
        <div class="totals-box">
            <div class="totals-row">
                <span class="totals-label">Pes total</span>
                <span class="totals-value">${escHtml(formatWeight(totals.totalWeight))}</span>
            </div>
            <div class="totals-row">
                <span class="totals-label">Volum total</span>
                <span class="totals-value">${escHtml(formatVolume(totals.totalVolume))}</span>
            </div>
            <div class="totals-row">
                <span class="totals-label">Línies</span>
                <span class="totals-value small">${totals.lineCount}</span>
            </div>
        </div>
    </div>

    <div class="signatures">
        <div class="sig-box">Preparat per</div>
        <div class="sig-box">Rebut per</div>
    </div>
</body>
</html>`;
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
