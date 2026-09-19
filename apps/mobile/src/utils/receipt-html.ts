import type { Purchase } from '../types/purchase';
import { formatCurrencyFromCents } from './currency';
import { formatDateTime } from './date';
import { formatWeightFromGrams } from './weight';

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#039;',
    '"': '&quot;',
  })[character] ?? character);
}

export function buildReceiptHtml(purchase: Purchase) {
  const shortId = purchase._id.slice(-8).toUpperCase();
  const totalWeight = purchase.items.reduce((sum, item) => sum + item.weightInGrams, 0);
  const rows = purchase.items.map((item) => `
    <tr>
      <td>
        <strong>${escapeHtml(item.materialName)}</strong>
        <span>${escapeHtml(formatWeightFromGrams(item.weightInGrams))} × ${escapeHtml(formatCurrencyFromCents(item.pricePerKgInCents))}/kg</span>
      </td>
      <td class="right">${escapeHtml(formatCurrencyFromCents(item.subtotalInCents))}</td>
    </tr>
  `).join('');

  return `<!doctype html>
  <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        @page { margin: 28px; }
        * { box-sizing: border-box; }
        body { color: #183A2A; font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .page { border: 1px solid #DDE7D9; border-radius: 18px; overflow: hidden; }
        header { background: #183A2A; color: white; padding: 28px; }
        .brand { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .document { color: #BFD4C5; font-size: 12px; font-weight: 700; letter-spacing: 1.2px; margin-top: 7px; text-transform: uppercase; }
        main { padding: 28px; }
        .meta { display: flex; gap: 18px; justify-content: space-between; margin-bottom: 24px; }
        .meta-block { flex: 1; }
        .meta-block.right { text-align: right; }
        .label { color: #66756D; display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.8px; margin-bottom: 5px; text-transform: uppercase; }
        .value { font-size: 15px; font-weight: 700; }
        table { border-collapse: collapse; width: 100%; }
        th { border-bottom: 2px solid #DDE7D9; color: #66756D; font-size: 10px; letter-spacing: 0.8px; padding: 10px 0; text-align: left; text-transform: uppercase; }
        td { border-bottom: 1px solid #E9EFE6; font-size: 14px; padding: 14px 0; }
        td span { color: #66756D; display: block; font-size: 11px; margin-top: 4px; }
        .right { text-align: right; }
        .summary { background: #F4F7F2; border-radius: 13px; display: flex; justify-content: space-between; margin-top: 22px; padding: 18px; }
        .summary-note { color: #66756D; font-size: 11px; margin-top: 4px; }
        .total { color: #2E5D43; font-size: 26px; font-weight: 800; }
        footer { color: #66756D; font-size: 10px; line-height: 1.5; padding: 0 28px 26px; text-align: center; }
      </style>
    </head>
    <body>
      <section class="page">
        <header>
          <div class="brand">ScrapFlow</div>
          <div class="document">Comprovante de compra de materiais recicláveis</div>
        </header>
        <main>
          <div class="meta">
            <div class="meta-block">
              <span class="label">Vendedor ou fornecedor</span>
              <span class="value">${escapeHtml(purchase.sellerName)}</span>
            </div>
            <div class="meta-block right">
              <span class="label">Operação</span>
              <span class="value">#${escapeHtml(shortId)}</span>
            </div>
          </div>
          <div class="meta">
            <div class="meta-block">
              <span class="label">Data e hora</span>
              <span class="value">${escapeHtml(formatDateTime(purchase.createdAt))}</span>
            </div>
            <div class="meta-block right">
              <span class="label">Peso total</span>
              <span class="value">${escapeHtml(formatWeightFromGrams(totalWeight))}</span>
            </div>
          </div>
          <table>
            <thead><tr><th>Material e pesagem</th><th class="right">Subtotal</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="summary">
            <div><strong>Total da compra</strong><div class="summary-note">${purchase.items.length} ${purchase.items.length === 1 ? 'item registrado' : 'itens registrados'}</div></div>
            <div class="total">${escapeHtml(formatCurrencyFromCents(purchase.totalInCents))}</div>
          </div>
        </main>
        <footer>
          Documento operacional gerado pelo ScrapFlow. Não possui valor fiscal.<br />
          Os valores correspondem ao registro persistido no momento da compra.
        </footer>
      </section>
    </body>
  </html>`;
}
