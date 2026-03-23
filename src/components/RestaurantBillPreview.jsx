import React from 'react';
import { Download, RotateCcw } from 'lucide-react';

const RestaurantBillPreview = ({ bill, resetForm }) => {

  const generatePDF = () => {
    const printWindow = window.open('', '', 'width=900,height=1200');
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Restaurant Invoice - ${bill.billNumber}</title>
        <style>
          @page { size: A4; margin: 12mm 14mm 12mm 14mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 11px; color: #111; background: #fff; width: 100%; }

          .letterhead { text-align: center; padding-bottom: 8px; margin-bottom: 10px; }
          .letterhead img.logo { width: 62px; height: 62px; object-fit: contain; display: block; margin: 0 auto 4px auto; }
          .letterhead h1 { font-size: 18px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 3px; color: #000; }
          .letterhead .address-line { font-size: 10.5px; color: #111; margin: 2px 0; }
          .letterhead .contact-line { font-size: 10.5px; color: #111; margin: 2px 0; font-weight: 600; }
          .header-rule { border: none; border-top: 3px double #111; margin: 7px 0 10px 0; }

          .invoice-title-bar {
            display: flex; justify-content: space-between; align-items: center;
            background: #166534; color: white;
            padding: 6px 12px; border-radius: 4px; margin-bottom: 10px;
          }
          .invoice-title-bar .inv-label { font-size: 13px; font-weight: bold; letter-spacing: 1px; }
          .invoice-title-bar .inv-meta { font-size: 10px; text-align: right; line-height: 1.5; }

          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
          .info-box { background: #f0fdf4; border-left: 3px solid #16a34a; padding: 8px 10px; border-radius: 3px; }
          .info-box .box-title { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #166534; margin-bottom: 6px; letter-spacing: 0.5px; }
          .info-row { display: flex; justify-content: space-between; font-size: 10px; padding: 3px 0; border-bottom: 1px solid #dcfce7; }
          .info-row:last-child { border-bottom: none; }
          .info-row .lbl { color: #555; font-weight: 600; }
          .info-row .val { color: #111; }

          table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 10px; }
          table thead tr { background: #166534; color: white; }
          table th { padding: 6px 8px; text-align: left; font-weight: 700; }
          table td { padding: 5px 8px; border-bottom: 1px solid #e2e8f0; color: #111; }
          table tbody tr:last-child td { border-bottom: none; }
          table tbody tr:nth-child(even) { background: #f8fafc; }

          .totals-block { background: #f0fdf4; border-radius: 4px; padding: 8px 12px; margin-bottom: 8px; }
          .total-row { display: flex; justify-content: space-between; font-size: 10px; padding: 3px 0; border-bottom: 1px solid #dcfce7; }
          .total-row:last-child { border-bottom: none; }
          .total-row .t-lbl { color: #555; font-weight: 600; }
          .total-row .t-val { font-weight: 600; color: #111; }
          .total-row.discount .t-val { color: #16a34a; }
          .grand-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: 900; color: #166534; border-top: 2px solid #16a34a; margin-top: 6px; padding-top: 6px; }

          .special-box { background: #fef3c7; border-left: 3px solid #f59e0b; padding: 6px 10px; border-radius: 3px; margin-bottom: 8px; font-size: 10px; }

          .page-footer { margin-top: 10px; padding-top: 8px; border-top: 1px solid #ccc; display: flex; justify-content: space-between; align-items: flex-end; }
          .page-footer .reg-no { font-size: 10px; font-weight: 700; color: #111; }
          .page-footer .thank-you { text-align: right; font-size: 10px; color: #555; }
          .page-footer .thank-you strong { color: #166534; font-size: 11px; display: block; }

          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            * { border-radius: 0 !important; }
            html { margin: 0; }
          }
        </style>
      </head>
      <body>

        <!-- LETTERHEAD -->
        <div class="letterhead">
          <img src="https://res.cloudinary.com/dluwvqdaz/image/upload/v1763126831/logo_fatuqr.png" alt="Summit Resort Logo" class="logo" />
          <h1>Summit Resort</h1>
          <p class="address-line">No: 173A, Theresiya Waththa, Ananda Maithreya Mawatha, Balangoda</p>
          <p class="address-line">summitresort@gmail.com</p>
          <p class="contact-line">0743377071 &nbsp; 0770208493</p>
        </div>
        <hr class="header-rule" />

        <!-- INVOICE TITLE BAR -->
        <div class="invoice-title-bar">
          <span class="inv-label">RESTAURANT INVOICE</span>
          <div class="inv-meta">
            <div>Invoice No: <strong>${bill.billNumber}</strong></div>
            <div>Date: ${new Date(bill.billDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>

        <!-- INFO GRID -->
        <div class="info-grid">
          <div class="info-box">
            <div class="box-title">Invoice Details</div>
            <div class="info-row"><span class="lbl">Invoice No:</span><span class="val">${bill.billNumber}</span></div>
            <div class="info-row"><span class="lbl">Date:</span><span class="val">${new Date(bill.billDate).toLocaleDateString('en-GB')}</span></div>
            <div class="info-row"><span class="lbl">Type:</span><span class="val">Restaurant Order</span></div>
            ${bill.tableNumber ? `<div class="info-row"><span class="lbl">Table:</span><span class="val">${bill.tableNumber}</span></div>` : ''}
          </div>
          <div class="info-box">
            <div class="box-title">Customer Information</div>
            <div class="info-row"><span class="lbl">Name:</span><span class="val">${bill.customerName}</span></div>
            <div class="info-row"><span class="lbl">Phone:</span><span class="val">${bill.customerPhone}</span></div>
          </div>
        </div>

        <!-- ORDER ITEMS TABLE -->
        <table>
          <thead><tr>
            <th>Item</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Unit Price (LKR)</th>
            <th style="text-align:right;">Total (LKR)</th>
          </tr></thead>
          <tbody>
            ${bill.orderItems.map(item => `
            <tr>
              <td>${item.name}</td>
              <td style="text-align:center;">${item.qty}</td>
              <td style="text-align:right;">${item.price.toLocaleString()}</td>
              <td style="text-align:right;font-weight:700;">${(item.price * item.qty).toLocaleString()}</td>
            </tr>`).join('')}
          </tbody>
        </table>

        <!-- SPECIAL REQUESTS -->
        ${bill.specialRequests ? `
        <div class="special-box">
          <strong>Special Requests:</strong> ${bill.specialRequests}
        </div>` : ''}

        <!-- TOTALS -->
        <div class="totals-block">
          <div class="total-row"><span class="t-lbl">Subtotal:</span><span class="t-val">LKR ${bill.subtotal.toLocaleString()}</span></div>
          <div class="total-row"><span class="t-lbl">Service Charge (10%):</span><span class="t-val">LKR ${bill.serviceCharge.toLocaleString()}</span></div>
          ${bill.discount > 0 ? `<div class="total-row discount"><span class="t-lbl">Discount${bill.discountType === 'percentage' ? ' (' + bill.discountValue + '%)' : ''}:</span><span class="t-val">- LKR ${bill.discount.toLocaleString()}</span></div>` : ''}
          <div class="grand-row">
            <span>TOTAL AMOUNT:</span>
            <span>LKR ${bill.total.toLocaleString()}</span>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="page-footer">
          <div class="reg-no">REG NO - R/B/03655</div>
          <div class="thank-you">
            <strong>Thank You for Dining at Summit Resort!</strong>
            We hope to serve you again soon.
          </div>
        </div>

      </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 300);
  };

  // ── ON-SCREEN PREVIEW ─────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      {/* Letterhead */}
      <div className="text-center py-6 px-6 border-b-2 border-double border-gray-800">
        <img
          src="https://res.cloudinary.com/dluwvqdaz/image/upload/v1763126831/logo_fatuqr.png"
          alt="Logo" className="w-16 h-16 mx-auto mb-2 object-contain"
        />
        <h2 className="text-2xl font-black tracking-widest uppercase text-gray-900">Summit Resort</h2>
        <p className="text-gray-700 text-sm mt-1">No: 173A, Theresiya Waththa, Ananda Maithreya Mawatha, Balangoda</p>
        <p className="text-gray-700 text-sm">summitresort@gmail.com</p>
        <p className="text-gray-700 text-sm font-semibold">0743377071 &nbsp; 0770208493</p>
      </div>

      <div className="p-6 md:p-8">
        {/* Invoice title strip */}
        <div className="flex justify-between items-center bg-green-700 text-white px-4 py-2.5 rounded-lg mb-5">
          <span className="font-bold text-lg tracking-wide">RESTAURANT INVOICE</span>
          <div className="text-right text-xs leading-relaxed">
            <div>Invoice No: <strong>{bill.billNumber}</strong></div>
            <div>Date: {new Date(bill.billDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded-r-lg">
            <p className="text-xs font-bold uppercase text-green-700 mb-2 tracking-wide">Invoice Details</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Invoice No:</span><span>{bill.billNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Date:</span><span>{new Date(bill.billDate).toLocaleDateString('en-GB')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Type:</span><span>Restaurant Order</span></div>
              {bill.tableNumber && <div className="flex justify-between"><span className="text-gray-500 font-medium">Table:</span><span>{bill.tableNumber}</span></div>}
            </div>
          </div>
          <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded-r-lg">
            <p className="text-xs font-bold uppercase text-green-700 mb-2 tracking-wide">Customer Information</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Name:</span><span>{bill.customerName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Phone:</span><span>{bill.customerPhone}</span></div>
            </div>
          </div>
        </div>

        {/* Order items table */}
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="text-left p-2.5 font-semibold">Item</th>
                <th className="text-center p-2.5 font-semibold w-16">Qty</th>
                <th className="text-right p-2.5 font-semibold w-28">Unit (LKR)</th>
                <th className="text-right p-2.5 font-semibold w-28">Total (LKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bill.orderItems.map((item, i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                  <td className="p-2.5">{item.name}</td>
                  <td className="p-2.5 text-center">{item.qty}</td>
                  <td className="p-2.5 text-right">{item.price.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-semibold">{(item.price * item.qty).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Special requests */}
        {bill.specialRequests && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg mb-4 text-sm">
            <strong className="text-amber-800">Special Requests:</strong>{' '}
            <span className="text-amber-700">{bill.specialRequests}</span>
          </div>
        )}

        {/* Totals */}
        <div className="bg-green-50 rounded-lg p-4 mb-5">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Subtotal:</span>
              <span className="font-semibold">LKR {bill.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Service Charge (10%):</span>
              <span className="font-semibold">LKR {bill.serviceCharge.toLocaleString()}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span className="font-medium">Discount{bill.discountType === 'percentage' ? ` (${bill.discountValue}%)` : ''}:</span>
                <span className="font-semibold">- LKR {bill.discount.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center border-t-2 border-green-600 mt-3 pt-3">
            <span className="text-lg font-black text-gray-800">GRAND TOTAL:</span>
            <span className="text-2xl font-black text-green-700">LKR {bill.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-gray-300 pt-3 mb-5 text-sm">
          <span className="font-bold text-gray-700">REG NO - R/B/03655</span>
          <span className="text-gray-500 italic">Thank you for dining at Summit Resort!</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={generatePDF}
            className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" /> Download / Print Invoice
          </button>
          <button
            onClick={resetForm}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> New Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantBillPreview;
