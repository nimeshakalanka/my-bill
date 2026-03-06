import React from 'react';
import { Download, RotateCcw } from 'lucide-react';

const BillPreview = ({ bill, resetForm }) => {

  const generatePDF = () => {
    const printWindow = window.open('', '', 'width=900,height=1200');
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${bill.billNumber}</title>
        <style>
          @page {
            size: A4;
            margin: 12mm 14mm 12mm 14mm;
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #111;
            background: #fff;
            width: 100%;
          }

          /* ===== LETTERHEAD HEADER ===== */
          .letterhead {
            text-align: center;
            padding-bottom: 8px;
            margin-bottom: 10px;
          }
          .letterhead img.logo {
            width: 62px;
            height: 62px;
            object-fit: contain;
            display: block;
            margin: 0 auto 4px auto;
          }
          .letterhead h1 {
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 3px;
            color: #000;
          }
          .letterhead .address-line {
            font-size: 10.5px;
            color: #111;
            margin: 2px 0;
          }
          .letterhead .contact-line {
            font-size: 10.5px;
            color: #111;
            margin: 2px 0;
            font-weight: 600;
          }
          /* Double horizontal rule like the letterhead */
          .header-rule {
            border: none;
            border-top: 3px double #111;
            margin: 7px 0 10px 0;
          }

          /* ===== INVOICE TITLE BAR ===== */
          .invoice-title-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #1e40af;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          .invoice-title-bar .inv-label {
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 1px;
          }
          .invoice-title-bar .inv-meta {
            font-size: 10px;
            text-align: right;
            line-height: 1.5;
          }

          /* ===== TWO-COLUMN INFO GRID ===== */
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
          }
          .info-box {
            background: #f8fafc;
            border-left: 3px solid #2563eb;
            padding: 8px 10px;
            border-radius: 3px;
          }
          .info-box .box-title {
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            color: #1e40af;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            padding: 3px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .info-row:last-child { border-bottom: none; }
          .info-row .lbl { color: #555; font-weight: 600; }
          .info-row .val { color: #111; }

          /* ===== DETAIL BOX ===== */
          .detail-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 4px;
            padding: 7px 10px;
            margin-bottom: 10px;
            font-size: 10px;
          }
          .detail-box .detail-title {
            font-size: 11px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
          }
          .detail-box p { margin: 2px 0; }
          .feature-tag {
            display: inline-block;
            background: white;
            border: 1px solid #93c5fd;
            padding: 2px 7px;
            border-radius: 10px;
            font-size: 9px;
            margin: 2px 2px 0 0;
            color: #1e40af;
          }

          /* ===== TABLES ===== */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            font-size: 10px;
          }
          table thead tr {
            background: #1e40af;
            color: white;
          }
          table th {
            padding: 6px 8px;
            text-align: left;
            font-weight: 700;
          }
          table td {
            padding: 5px 8px;
            border-bottom: 1px solid #e2e8f0;
            color: #111;
          }
          table tbody tr:last-child td { border-bottom: none; }
          table tbody tr:nth-child(even) { background: #f8fafc; }
          .section-label {
            font-size: 11px;
            font-weight: bold;
            color: #1e40af;
            margin: 8px 0 4px 0;
          }

          /* ===== TOTALS ===== */
          .totals-block {
            background: #f8fafc;
            border-radius: 4px;
            padding: 8px 12px;
            margin-bottom: 8px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            padding: 3px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .total-row:last-child { border-bottom: none; }
          .total-row .t-lbl { color: #555; font-weight: 600; }
          .total-row .t-val { font-weight: 600; color: #111; }
          .total-row.discount .t-val { color: #16a34a; }
          .grand-row {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 900;
            color: #1e40af;
            border-top: 2px solid #2563eb;
            margin-top: 6px;
            padding-top: 6px;
          }

          /* ===== SPECIAL REQUESTS ===== */
          .special-box {
            background: #fef3c7;
            border-left: 3px solid #f59e0b;
            padding: 6px 10px;
            border-radius: 3px;
            margin-bottom: 8px;
            font-size: 10px;
          }

          /* ===== FOOTER ===== */
          .page-footer {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #ccc;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .page-footer .reg-no {
            font-size: 10px;
            font-weight: 700;
            color: #111;
          }
          .page-footer .thank-you {
            text-align: right;
            font-size: 10px;
            color: #555;
          }
          .page-footer .thank-you strong {
            color: #1e40af;
            font-size: 11px;
            display: block;
          }

          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            /* Remove ALL rounded corners — prevents curved black marks at page edges */
            * { border-radius: 0 !important; }
            /* Remove browser-added headers/footers URL / date text */
            html { margin: 0; }
          }
        </style>
      </head>
      <body>

        <!-- LETTERHEAD HEADER -->
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
          <span class="inv-label">TAX INVOICE</span>
          <div class="inv-meta">
            <div>Invoice No: <strong>${bill.billNumber}</strong></div>
            <div>Date: ${new Date(bill.billDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>

        <!-- GUEST & INVOICE INFO -->
        <div class="info-grid">
          <div class="info-box">
            <div class="box-title">Invoice Details</div>
            <div class="info-row"><span class="lbl">Invoice No:</span><span class="val">${bill.billNumber}</span></div>
            <div class="info-row"><span class="lbl">Date:</span><span class="val">${new Date(bill.billDate).toLocaleDateString('en-GB')}</span></div>
            <div class="info-row"><span class="lbl">Type:</span><span class="val">${bill.details.type}</span></div>
          </div>
          <div class="info-box">
            <div class="box-title">Guest Information</div>
            <div class="info-row"><span class="lbl">Name:</span><span class="val">${bill.guestName}</span></div>
            <div class="info-row"><span class="lbl">Phone:</span><span class="val">${bill.guestPhone}</span></div>
            ${bill.guestEmail ? `<div class="info-row"><span class="lbl">Email:</span><span class="val">${bill.guestEmail}</span></div>` : ''}
          </div>
        </div>

        <!-- BOOKING DETAILS -->
        ${bill.billType === 'room' ? `
        <div class="detail-box">
          <div class="detail-title">Room Booking Details</div>
          <p><strong>Room Number:</strong> ${bill.details.roomNumber} &nbsp;&nbsp; <strong>Nights:</strong> ${bill.details.nights}</p>
          <p><strong>Check-in:</strong> ${new Date(bill.details.checkIn).toLocaleDateString('en-GB')} &nbsp;&nbsp; <strong>Check-out:</strong> ${new Date(bill.details.checkOut).toLocaleDateString('en-GB')}</p>
        </div>
        <table>
          <thead><tr>
            <th>Description</th>
            <th style="text-align:right;">Amount (LKR)</th>
          </tr></thead>
          <tbody>
            <tr>
              <td>Room Charges (${bill.details.nights} night${bill.details.nights > 1 ? 's' : ''} × LKR ${bill.details.roomPrice.toLocaleString()}/night)</td>
              <td style="text-align:right;font-weight:700;">${bill.details.roomTotal.toLocaleString()}</td>
            </tr>
            ${bill.details.breakfast > 0 ? `<tr><td>Breakfast (${bill.details.nights} days × LKR ${bill.details.breakfast.toLocaleString()}/day)</td><td style="text-align:right;">${(bill.details.breakfast * bill.details.nights).toLocaleString()}</td></tr>` : ''}
            ${bill.details.lunch > 0 ? `<tr><td>Lunch (${bill.details.nights} days × LKR ${bill.details.lunch.toLocaleString()}/day)</td><td style="text-align:right;">${(bill.details.lunch * bill.details.nights).toLocaleString()}</td></tr>` : ''}
            ${bill.details.dinner > 0 ? `<tr><td>Dinner (${bill.details.nights} days × LKR ${bill.details.dinner.toLocaleString()}/day)</td><td style="text-align:right;">${(bill.details.dinner * bill.details.nights).toLocaleString()}</td></tr>` : ''}
            ${bill.details.foodTotal > 0 ? `<tr style="background:#eff6ff;font-weight:700;"><td>Total Food Charges</td><td style="text-align:right;">${bill.details.foodTotal.toLocaleString()}</td></tr>` : ''}
          </tbody>
        </table>
        ` : `
        <div class="detail-box">
          <div class="detail-title">${bill.details.packageName}</div>
          <p><strong>Function Date:</strong> ${new Date(bill.details.functionDate).toLocaleDateString('en-GB')} &nbsp;&nbsp; <strong>Number of Guests:</strong> ${bill.details.numPeople}</p>
          <div style="margin-top:5px;">
            ${bill.details.packageFeatures.map(f => `<span class="feature-tag">✓ ${f}</span>`).join('')}
          </div>
        </div>
        <table>
          <thead><tr>
            <th>Description</th>
            <th style="text-align:center;">Guests</th>
            <th style="text-align:right;">Rate (LKR)</th>
            <th style="text-align:right;">Amount (LKR)</th>
          </tr></thead>
          <tbody>
            <tr>
              <td>${bill.details.packageName}</td>
              <td style="text-align:center;">${bill.details.numPeople}</td>
              <td style="text-align:right;">${bill.details.pricePerPerson.toLocaleString()}</td>
              <td style="text-align:right;font-weight:700;">${bill.subtotal.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        `}

        <!-- ADDITIONAL CHARGES -->
        ${bill.additionalCharges && bill.additionalCharges.length > 0 ? `
        <div class="section-label">Additional Charges</div>
        <table>
          <thead><tr>
            <th>Item</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Price (LKR)</th>
            <th style="text-align:right;">Total (LKR)</th>
          </tr></thead>
          <tbody>
            ${bill.additionalCharges.map(c => `
            <tr>
              <td>${c.name}</td>
              <td style="text-align:center;">${c.quantity}</td>
              <td style="text-align:right;">${c.price.toLocaleString()}</td>
              <td style="text-align:right;font-weight:700;">${c.total.toLocaleString()}</td>
            </tr>`).join('')}
            <tr style="background:#eff6ff;font-weight:700;">
              <td colspan="3" style="text-align:right;">Total Additional:</td>
              <td style="text-align:right;">${bill.additionalChargesTotal.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        ` : ''}

        <!-- SPECIAL REQUESTS -->
        ${bill.specialRequests ? `
        <div class="special-box">
          <strong>Special Requests:</strong> ${bill.specialRequests}
        </div>` : ''}

        <!-- TOTALS -->
        <div class="totals-block">
          <div class="total-row"><span class="t-lbl">Subtotal:</span><span class="t-val">LKR ${bill.subtotal.toLocaleString()}</span></div>
          <div class="total-row"><span class="t-lbl">Service Charge (10%):</span><span class="t-val">LKR ${bill.serviceCharge.toLocaleString()}</span></div>
          ${bill.additionalChargesTotal > 0 ? `<div class="total-row"><span class="t-lbl">Additional Charges:</span><span class="t-val">LKR ${bill.additionalChargesTotal.toLocaleString()}</span></div>` : ''}
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
            <strong>Thank You for Choosing Summit Resort!</strong>
            We hope you enjoyed your experience with us.
          </div>
        </div>

      </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 300);
  };

  // ========================
  // ON-SCREEN PREVIEW
  // ========================
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      {/* --- LETTERHEAD HEADER (screen preview) --- */}
      <div className="text-center py-6 px-6 border-b-2 border-double border-gray-800">
        <img
          src="https://res.cloudinary.com/dluwvqdaz/image/upload/v1763126831/logo_fatuqr.png"
          alt="Logo"
          className="w-16 h-16 mx-auto mb-2 object-contain"
        />
        <h2 className="text-2xl font-black tracking-widest uppercase text-gray-900">Summit Resort</h2>
        <p className="text-gray-700 text-sm mt-1">No: 173A, Theresiya Waththa, Ananda Maithreya Mawatha, Balangoda</p>
        <p className="text-gray-700 text-sm">summitresort@gmail.com</p>
        <p className="text-gray-700 text-sm font-semibold">0743377071 &nbsp; 0770208493</p>
      </div>

      <div className="p-6 md:p-8">
        {/* Invoice title strip */}
        <div className="flex justify-between items-center bg-blue-700 text-white px-4 py-2.5 rounded-lg mb-5">
          <span className="font-bold text-lg tracking-wide">TAX INVOICE</span>
          <div className="text-right text-xs leading-relaxed">
            <div>Invoice No: <strong>{bill.billNumber}</strong></div>
            <div>Date: {new Date(bill.billDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 border-l-4 border-blue-600 p-3 rounded-r-lg">
            <p className="text-xs font-bold uppercase text-blue-700 mb-2 tracking-wide">Invoice Details</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Invoice No:</span><span>{bill.billNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Date:</span><span>{new Date(bill.billDate).toLocaleDateString('en-GB')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Type:</span><span>{bill.details.type}</span></div>
            </div>
          </div>
          <div className="bg-gray-50 border-l-4 border-blue-600 p-3 rounded-r-lg">
            <p className="text-xs font-bold uppercase text-blue-700 mb-2 tracking-wide">Guest Information</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Name:</span><span>{bill.guestName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Phone:</span><span>{bill.guestPhone}</span></div>
              {bill.guestEmail && <div className="flex justify-between"><span className="text-gray-500 font-medium">Email:</span><span>{bill.guestEmail}</span></div>}
            </div>
          </div>
        </div>

        {/* Booking details */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          {bill.billType === 'room' ? (
            <>
              <h3 className="font-bold text-blue-800 mb-2">Room Booking Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Room:</span> {bill.details.roomNumber}</p>
                <p><span className="font-medium">Nights:</span> {bill.details.nights}</p>
                <p><span className="font-medium">Check-in:</span> {new Date(bill.details.checkIn).toLocaleDateString('en-GB')}</p>
                <p><span className="font-medium">Check-out:</span> {new Date(bill.details.checkOut).toLocaleDateString('en-GB')}</p>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-bold text-blue-800 mb-1">{bill.details.packageName}</h3>
              <p className="text-sm"><span className="font-medium">Date:</span> {new Date(bill.details.functionDate).toLocaleDateString('en-GB')} &nbsp; <span className="font-medium">Guests:</span> {bill.details.numPeople}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {bill.details.packageFeatures.map((f, i) => (
                  <span key={i} className="text-xs bg-white border border-blue-300 text-blue-700 px-2 py-0.5 rounded-full">✓ {f}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Charges table */}
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="text-left p-2.5 font-semibold">Description</th>
                {bill.billType !== 'room' && <th className="text-center p-2.5 font-semibold">Guests</th>}
                {bill.billType !== 'room' && <th className="text-right p-2.5 font-semibold">Rate (LKR)</th>}
                <th className="text-right p-2.5 font-semibold">Amount (LKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bill.billType === 'room' ? (
                <>
                  <tr>
                    <td className="p-2.5">Room Charges ({bill.details.nights} night{bill.details.nights > 1 ? 's' : ''} × LKR {bill.details.roomPrice.toLocaleString()})</td>
                    <td className="p-2.5 text-right font-semibold">{bill.details.roomTotal.toLocaleString()}</td>
                  </tr>
                  {bill.details.foodTotal > 0 && (
                    <tr className="bg-gray-50">
                      <td className="p-2.5">
                        Food Charges ({bill.details.nights} days)
                        <span className="text-xs text-gray-500 ml-2">
                          {bill.details.breakfast > 0 && `B: ${bill.details.breakfast} `}
                          {bill.details.lunch > 0 && `L: ${bill.details.lunch} `}
                          {bill.details.dinner > 0 && `D: ${bill.details.dinner}`}
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-semibold">{bill.details.foodTotal.toLocaleString()}</td>
                    </tr>
                  )}
                </>
              ) : (
                <tr>
                  <td className="p-2.5">{bill.details.packageName}</td>
                  <td className="p-2.5 text-center">{bill.details.numPeople}</td>
                  <td className="p-2.5 text-right">{bill.details.pricePerPerson.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-semibold">{bill.subtotal.toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Additional charges */}
        {bill.additionalCharges && bill.additionalCharges.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-blue-800 text-sm mb-2">Additional Charges</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="text-left p-2.5">Item</th>
                    <th className="text-center p-2.5">Qty</th>
                    <th className="text-right p-2.5">Price</th>
                    <th className="text-right p-2.5">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bill.additionalCharges.map((charge, i) => (
                    <tr key={i}>
                      <td className="p-2.5">{charge.name}</td>
                      <td className="p-2.5 text-center">{charge.quantity}</td>
                      <td className="p-2.5 text-right">{charge.price.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-semibold">{charge.total.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50">
                    <td colSpan="3" className="p-2.5 text-right font-bold">Total Additional:</td>
                    <td className="p-2.5 text-right font-bold text-blue-700">{bill.additionalChargesTotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Special requests */}
        {bill.specialRequests && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg mb-4 text-sm">
            <strong className="text-amber-800">Special Requests:</strong> <span className="text-amber-700">{bill.specialRequests}</span>
          </div>
        )}

        {/* Totals */}
        <div className="bg-gray-50 rounded-lg p-4 mb-5">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Subtotal:</span>
              <span className="font-semibold">LKR {bill.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Service Charge (10%):</span>
              <span className="font-semibold">LKR {bill.serviceCharge.toLocaleString()}</span>
            </div>
            {bill.additionalChargesTotal > 0 && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Additional Charges:</span>
                <span className="font-semibold">LKR {bill.additionalChargesTotal.toLocaleString()}</span>
              </div>
            )}
            {bill.discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span className="font-medium">Discount{bill.discountType === 'percentage' ? ` (${bill.discountValue}%)` : ''}:</span>
                <span className="font-semibold">- LKR {bill.discount.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center border-t-2 border-blue-600 mt-3 pt-3">
            <span className="text-lg font-black text-gray-800">GRAND TOTAL:</span>
            <span className="text-2xl font-black text-blue-700">LKR {bill.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer note */}
        <div className="flex justify-between items-center border-t border-gray-300 pt-3 mb-5 text-sm">
          <span className="font-bold text-gray-700">REG NO - R/B/03655</span>
          <span className="text-gray-500 italic">Thank you for choosing Summit Resort!</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={generatePDF}
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download / Print Invoice
          </button>
          <button
            onClick={resetForm}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            New Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillPreview;