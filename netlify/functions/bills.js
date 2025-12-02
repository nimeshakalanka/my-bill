import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const store = getStore('bills');
  
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    // GET all bills
    if (req.method === 'GET') {
      const billsData = await store.get('all_bills', { type: 'json' });
      return new Response(JSON.stringify(billsData || []), { 
        status: 200, 
        headers 
      });
    }

    // POST - Create new bill or update all bills
    if (req.method === 'POST') {
      const body = await req.json();
      
      if (body.action === 'save') {
        // Save entire bills array
        await store.setJSON('all_bills', body.bills);
        return new Response(JSON.stringify({ success: true }), { 
          status: 200, 
          headers 
        });
      }
    }

    // DELETE a specific bill
    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const billNumber = url.searchParams.get('billNumber');
      
      if (!billNumber) {
        return new Response(JSON.stringify({ error: 'Bill number required' }), { 
          status: 400, 
          headers 
        });
      }

      const billsData = await store.get('all_bills', { type: 'json' }) || [];
      const updatedBills = billsData.filter(b => b.billNumber !== billNumber);
      await store.setJSON('all_bills', updatedBills);
      
      return new Response(JSON.stringify({ success: true, bills: updatedBills }), { 
        status: 200, 
        headers 
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers 
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers 
    });
  }
};