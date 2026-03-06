import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const store = getStore({
    name: 'appointments',
    consistency: 'strong'
  });

  console.log('Appointments store initialized');

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
    // GET all appointments
    if (req.method === 'GET') {
      const data = await store.get('all_appointments', { type: 'json' });
      return new Response(JSON.stringify(data || []), { status: 200, headers });
    }

    // POST - save all appointments
    if (req.method === 'POST') {
      const body = await req.json();
      console.log('POST appointments, action:', body.action, 'count:', body.appointments?.length);

      if (body.action === 'save') {
        if (!body.appointments || !Array.isArray(body.appointments)) {
          return new Response(JSON.stringify({ error: 'Invalid appointments data' }), { status: 400, headers });
        }
        await store.setJSON('all_appointments', body.appointments);
        console.log('Appointments saved to Netlify Blobs');
        return new Response(JSON.stringify({ success: true, count: body.appointments.length }), { status: 200, headers });
      }

      return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers });
    }

    // DELETE a specific appointment by id
    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');

      console.log('DELETE appointment id:', id);

      if (!id) {
        return new Response(JSON.stringify({ error: 'Appointment id required' }), { status: 400, headers });
      }

      const data = await store.get('all_appointments', { type: 'json' }) || [];
      const updated = data.filter(a => a.id !== id);

      if (data.length === updated.length) {
        console.warn('No appointment removed — id not found:', id);
      }

      await store.setJSON('all_appointments', updated);
      console.log('Remaining appointments:', updated.length);

      return new Response(JSON.stringify({ success: true, appointments: updated }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });

  } catch (error) {
    console.error('Appointments function error:', error);
    return new Response(JSON.stringify({ error: error.message, details: error.stack }), { status: 500, headers });
  }
};
