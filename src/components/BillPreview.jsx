import React from 'react';
import { Download } from 'lucide-react';
import { APP_NAME } from '/src/constants.js';

const BillPreview = ({ bill, resetForm }) => {

  const generatePDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${bill.billNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            color: #333;
          }
          
          /* --- HEADER LAYOUT (Updated for Side-by-Side) --- */
          .header {
            /* Reduced padding from 30px to 15px to reduce height */
            padding: 15px 20px; 
            margin-bottom: 20px;
            border-bottom: 4px solid #2563eb;
            background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
            color: white;
            border-radius: 10px;
          }
          
          .header-content {
            display: flex;
            align-items: center;     /* Vertically center logo and text */
            justify-content: center; /* Horizontally center the group */
            gap: 20px;               /* Space between logo and text */
            margin-bottom: 10px;
          }

          .logo {
            width: 70px;  /* Reduced size */
            height: 70px;
            object-fit: contain;
            /* No margin needed here anymore */
          }

          .header-text {
            text-align: left; /* Align text to the left of the block */
          }

          .hotel-name {
            font-size: 28px; /* Slightly smaller to fit better */
            font-weight: bold;
            margin: 0;
            line-height: 1.2;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }

          .tagline {
            margin: 4px 0;
            font-size: 14px;
            opacity: 0.9;
          }

          .address {
            font-size: 12px;
            opacity: 0.8;
            margin: 0;
          }

          .invoice-label {
            text-align: center;
            font-size: 20px;
            margin-top: 5px;
            padding-top: 5px;
            border-top: 1px solid rgba(255,255,255,0.2);
            color: #fbbf24;
            font-weight: bold;
            letter-spacing: 1px;
          }

          /* --- REST OF THE CSS --- */
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 15px;
          }
          .info-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
          }
          .info-title {
            font-weight: bold;
            color: #1e40af;
            font-size: 12px;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .info-row:last-child { border-bottom: none; }
          .info-label { font-weight: 600; color: #64748b; }
          .info-value { color: #1e293b; }
          .package-box {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 2px solid #3b82f6;
          }
          .package-name {
            font-size: 15px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .table th {
            background: #1e40af;
            color: white;
            padding: 10px;
            text-align: left;
          }
          .table td {
            padding: 10px 15px;
            border-bottom: 1px solid #e2e8f0;
          }
          .total-section {
            margin-top: 20px;
            background: #f8fafc;
            padding: 10px;
            border-radius: 8px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
          }
          .total-label { font-weight: 600; color: #475569; }
          .total-value { color: #1e293b; font-weight: 600; }
          .grand-total {
            font-size: 20px;
            color: #1e40af;
            border-top: 3px solid #2563eb;
            padding-top: 15px;
            margin-top: 10px;
            font-weight: bold;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
          }

          @media print { 
            body { padding: 5px; margin: 0; }
            .header, .info-grid, .package-box, .table, .total-section, .footer { page-break-inside: avoid; }
            .header { padding: 5px; margin-bottom: 5px; }
            .logo { width: 50px; height: 50px; } /* Smaller logo for print */
            .hotel-name { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-content">
            
            <img src="https://res.cloudinary.com/dluwvqdaz/image/upload/v1763126831/logo_fatuqr.png" alt="Logo" class="logo" />
            
            <div class="header-text">
              <h1 class="hotel-name">${APP_NAME}</h1>
              <p class="tagline">Your Comfort is Our Priority</p>
              <p class="address">173A, Theresiya waththa, Ananda Maithri Road, Balangoda. | Tel: +94 74 337 7071</p>
            </div>

          </div>
        </div>

        <div class="info-grid">
          <div class="info-section">
            <div class="info-title">Invoice Details</div>
            <div class="info-row">
              <span class="info-label">Invoice No:</span>
              <span class="info-value">${bill.billNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${new Date(bill.billDate).toLocaleString()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Type:</span>
              <span class="info-value">${bill.details.type}</span>
            </div>
          </div>

          <div class="info-section">
            <div class="info-title">Guest Information</div>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${bill.guestName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${bill.guestPhone}</span>
            </div>
            ${bill.guestEmail ? `
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${bill.guestEmail}</span>
            </div>` : ''}
          </div>
        </div>

        ${bill.billType === 'room' ? `
        <div class="package-box">
          <div class="package-name">Room Booking Details</div>
          <p><strong>Room Number:</strong> ${bill.details.roomNumber}</p>
          <p><strong>Check-in:</strong> ${new Date(bill.details.checkIn).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(bill.details.checkOut).toLocaleDateString()}</p>
          <p><strong>Number of Nights:</strong> ${bill.details.nights}</p>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount (LKR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Room Charges (${bill.details.nights} nights @ LKR ${bill.details.roomPrice.toLocaleString()}/night)</td>
              <td style="text-align: right;"><strong>${bill.details.roomTotal.toLocaleString()}</strong></td>
            </tr>
            ${bill.details.breakfast > 0 ? `
            <tr>
              <td>Breakfast (${bill.details.nights} days @ LKR ${bill.details.breakfast.toLocaleString()}/day)</td>
              <td style="text-align: right;">${(bill.details.breakfast * bill.details.nights).toLocaleString()}</td>
            </tr>` : ''}
            ${bill.details.lunch > 0 ? `
            <tr>
              <td>Lunch (${bill.details.nights} days @ LKR ${bill.details.lunch.toLocaleString()}/day)</td>
              <td style="text-align: right;">${(bill.details.lunch * bill.details.nights).toLocaleString()}</td>
            </tr>` : ''}
            ${bill.details.dinner > 0 ? `
            <tr>
              <td>Dinner (${bill.details.nights} days @ LKR ${bill.details.dinner.toLocaleString()}/day)</td>
              <td style="text-align: right;">${(bill.details.dinner * bill.details.nights).toLocaleString()}</td>
            </tr>` : ''}
            ${bill.details.foodTotal > 0 ? `
            <tr style="background: #f8fafc; font-weight: bold;">
              <td>Total Food Charges</td>
              <td style="text-align: right;">${bill.details.foodTotal.toLocaleString()}</td>
            </tr>` : ''}
          </tbody>
        </table>
        ` : `
        <div class="package-box">
          <div class="package-name">${bill.details.packageName}</div>
          <p><strong>Function Date:</strong> ${new Date(bill.details.functionDate).toLocaleDateString()}</p>
          <p><strong>Number of Guests:</strong> ${bill.details.numPeople}</p>
          <div style="margin-top: 10px;">
            ${bill.details.packageFeatures.map(f => `<span style="background: white; padding: 5px 10px; margin: 5px; display: inline-block; border-radius: 15px; font-size: 12px;">✓ ${f}</span>`).join('')}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Rate (LKR)</th>
              <th style="text-align: right;">Amount (LKR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${bill.details.packageName}</strong></td>
              <td style="text-align: center;">${bill.details.numPeople}</td>
              <td style="text-align: right;">${bill.details.pricePerPerson.toLocaleString()}</td>
              <td style="text-align: right;"><strong>${bill.subtotal.toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>
        `}

        <div class="total-section">
          <div class="total-row">
            <span class="total-label">Subtotal:</span>
            <span class="total-value">LKR ${bill.subtotal.toLocaleString()}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Service Charge (10%):</span>
            <span class="total-value">LKR ${bill.serviceCharge.toLocaleString()}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Tax (5%):</span>
            <span class="total-value">LKR ${bill.tax.toLocaleString()}</span>
          </div>
          <div class="total-row grand-total">
            <span class="total-label">TOTAL AMOUNT:</span>
            <span class="total-value">LKR ${bill.total.toLocaleString()}</span>
          </div>
        </div>

        ${bill.specialRequests ? `
        <div style="margin-top: 15px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
          <strong style="color: #92400e;">Special Requests:</strong><br>
          <span style="color: #78350f;">${bill.specialRequests}</span>
        </div>` : ''}

        <div class="footer">
          <p style="font-size: 18px; color: #1e40af; font-weight: bold;">Thank You for Choosing ${APP_NAME}!</p>
          <p style="color: #64748b; margin-top: 5px;">We hope you enjoyed your experience with us.</p>
          <p style="margin-top: 10px; color: #64748b;">For inquiries: info@dreamstayhotel.lk | www.dreamstayhotel.lk</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="text-center mb-6 pb-6 border-b-2 border-blue-600">
        
        {/* ON SCREEN PREVIEW: Keep it centered here or side-by-side? 
            Keeping centered for mobile responsiveness, but using the Cloudinary logo */}
        <img 
          src="https://res.cloudinary.com/dluwvqdaz/image/upload/v1763126831/logo_fatuqr.png" 
          alt="Logo" 
          className="w-24 h-24 mx-auto mb-4 object-contain" 
        />

        <h2 className="text-3xl font-bold text-blue-800">{APP_NAME}</h2>
        <p className="text-gray-600">Your Comfort is Our Priority</p>
        <p className="text-sm text-gray-500 mt-1">Tax Invoice</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Invoice Number</p>
          <p className="font-semibold text-lg">{bill.billNumber}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Date</p>
          <p className="font-semibold text-lg">{new Date(bill.billDate).toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Guest Name</p>
          <p className="font-semibold text-lg">{bill.guestName}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Phone</p>
          <p className="font-semibold text-lg">{bill.guestPhone}</p>
        </div>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-lg text-blue-800 mb-2">{bill.details.type}</h3>
        {bill.billType === 'room' ? (
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <p><strong>Room Number:</strong> {bill.details.roomNumber}</p>
            <p><strong>Nights:</strong> {bill.details.nights}</p>
            <p><strong>Check-in:</strong> {new Date(bill.details.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(bill.details.checkOut).toLocaleDateString()}</p>
          </div>
        ) : (
          <div className="text-sm">
            <p><strong>Package:</strong> {bill.details.packageName}</p>
            <p><strong>Date:</strong> {new Date(bill.details.functionDate).toLocaleDateString()}</p>
            <p><strong>Number of Guests:</strong> {bill.details.numPeople}</p>
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 font-semibold">Description</th>
              <th className="text-right p-3 font-semibold">Amount (LKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bill.billType === 'room' ? (
              <>
                <tr>
                  <td className="p-3">Room Charges ({bill.details.nights} nights × LKR {bill.details.roomPrice.toLocaleString()})</td>
                  <td className="p-3 text-right font-semibold">{bill.details.roomTotal.toLocaleString()}</td>
                </tr>
                {bill.details.foodTotal > 0 && (
                  <tr>
                    <td className="p-3">
                      Food Charges ({bill.details.nights} days)
                      <div className="text-sm text-gray-600 mt-1">
                        {bill.details.breakfast > 0 && `Breakfast: LKR ${bill.details.breakfast} `}
                        {bill.details.lunch > 0 && `Lunch: LKR ${bill.details.lunch} `}
                        {bill.details.dinner > 0 && `Dinner: LKR ${bill.details.dinner}`}
                      </div>
                    </td>
                    <td className="p-3 text-right font-semibold">{bill.details.foodTotal.toLocaleString()}</td>
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td className="p-3">
                  {bill.details.packageName}
                  <div className="text-sm text-gray-600">
                    {bill.details.numPeople} guests × LKR {bill.details.pricePerPerson.toLocaleString()}
                  </div>
                </td>
                <td className="p-3 text-right font-semibold">{bill.subtotal.toLocaleString()}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between py-2">
          <span className="font-medium">Subtotal:</span>
          <span className="font-semibold">LKR {bill.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="font-medium">Service Charge (10%):</span>
          <span className="font-semibold">LKR {bill.serviceCharge.toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Tax (5%):</span>
          <span className="font-semibold">LKR {bill.tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-3 mt-2">
          <span className="text-xl font-bold text-gray-800">GRAND TOTAL:</span>
          <span className="text-2xl font-bold text-blue-600">LKR {bill.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={generatePDF}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download/Print Invoice
        </button>
        <button
          onClick={resetForm}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          New Bill
        </button>
      </div>
    </div>
  );
};

export default BillPreview;