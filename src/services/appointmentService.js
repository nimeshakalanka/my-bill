const API_BASE = '/.netlify/functions';
const LOCAL_KEY = 'summit_appointments_local';

export const appointmentService = {
    // Fetch all appointments — tries Netlify Blobs, falls back to localStorage
    async fetchAppointments() {
        try {
            const response = await fetch(`${API_BASE}/appointments`);
            if (response.ok) {
                const data = await response.json();
                console.log('Appointments loaded from Netlify Blobs:', data.length);
                return data;
            }
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            // Fallback: localStorage (for local dev without netlify dev)
            console.warn('Netlify function unavailable, using localStorage fallback:', error.message);
            try {
                const raw = localStorage.getItem(LOCAL_KEY);
                return raw ? JSON.parse(raw) : [];
            } catch {
                return [];
            }
        }
    },

    // Save all appointments — tries Netlify Blobs, falls back to localStorage
    async saveAppointments(appointments) {
        try {
            const response = await fetch(`${API_BASE}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'save', appointments })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Appointments saved to Netlify Blobs:', result);
                // Mirror to localStorage as cache
                localStorage.setItem(LOCAL_KEY, JSON.stringify(appointments));
                return result;
            }
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            // Fallback: save to localStorage
            console.warn('Netlify save failed, saving to localStorage:', error.message);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(appointments));
            return { success: true, local: true, count: appointments.length };
        }
    },

    // Delete a specific appointment — tries Netlify Blobs, falls back to localStorage
    async deleteAppointment(id) {
        try {
            const response = await fetch(`${API_BASE}/appointments?id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Appointment deleted from Netlify Blobs:', result);
                if (result.appointments) {
                    localStorage.setItem(LOCAL_KEY, JSON.stringify(result.appointments));
                }
                return result;
            }
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            // Fallback: delete from localStorage
            console.warn('Netlify delete failed, deleting from localStorage:', error.message);
            try {
                const raw = localStorage.getItem(LOCAL_KEY);
                const existing = raw ? JSON.parse(raw) : [];
                const updated = existing.filter(a => a.id !== id);
                localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
                return { success: true, local: true, appointments: updated };
            } catch {
                return { success: true, local: true, appointments: [] };
            }
        }
    }
};
