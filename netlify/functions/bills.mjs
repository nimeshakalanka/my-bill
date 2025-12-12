import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const store = getStore({
    name: 'bills',
    consistency: 'strong'
  });
  
  console.log('Store initialized successfully');
  
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
      console.log('POST request received, action:', body.action, 'bills count:', body.bills?.length);
      
      if (body.action === 'save') {
        if (!body.bills || !Array.isArray(body.bills)) {
          console.error('Invalid bills data:', body.bills);
          return new Response(JSON.stringify({ error: 'Invalid bills data' }), { 
            status: 400, 
            headers 
          });
        }
        
        // Save entire bills array
        await store.setJSON('all_bills', body.bills);
        console.log('Bills saved successfully to Netlify Blobs');
        
        return new Response(JSON.stringify({ success: true, count: body.bills.length }), { 
          status: 200, 
          headers 
        });
      }
      
      return new Response(JSON.stringify({ error: 'Invalid action' }), { 
        status: 400, 
        headers 
      });
    }

    // DELETE a specific bill
    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const billNumber = url.searchParams.get('billNumber');
      
      console.log('DELETE request received for bill:', billNumber);
      
      if (!billNumber) {
        return new Response(JSON.stringify({ error: 'Bill number required' }), { 
          status: 400, 
          headers 
        });
      }

      const billsData = await store.get('all_bills', { type: 'json' }) || [];
      console.log('Current bills count:', billsData.length);
      console.log('Bill numbers in DB:', billsData.map(b => b.billNumber));
      console.log('Looking for bill to delete:', billNumber);
      
      const updatedBills = billsData.filter(b => b.billNumber !== billNumber);
      console.log('Updated bills count after filter:', updatedBills.length);
      console.log('Remaining bill numbers:', updatedBills.map(b => b.billNumber));
      
      if (billsData.length === updatedBills.length) {
        console.warn('WARNING: No bills were removed! Bill not found.');
      }
      
      await store.setJSON('all_bills', updatedBills);
      console.log('Bills saved to store successfully');
      
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
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), { 
      status: 500, 
      headers 
    });
  }
};