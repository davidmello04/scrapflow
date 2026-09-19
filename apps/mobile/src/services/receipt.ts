import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { Purchase } from '../types/purchase';
import { buildReceiptHtml } from '../utils/receipt-html';

export async function createReceiptPdf(purchase: Purchase) {
  const result = await Print.printToFileAsync({ html: buildReceiptHtml(purchase) });
  return result.uri;
}

export async function shareReceiptPdf(purchase: Purchase) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('O compartilhamento de arquivos não está disponível neste dispositivo.');
  }

  const uri = await createReceiptPdf(purchase);
  await Sharing.shareAsync(uri, {
    dialogTitle: `Compartilhar comprovante #${purchase._id.slice(-8).toUpperCase()}`,
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
  });
}

export async function printReceipt(purchase: Purchase) {
  await Print.printAsync({ html: buildReceiptHtml(purchase) });
}
