const API_BASE = '/.netlify/functions';

export const billService = {
  // Fetch all bills
  async fetchBills() {
    try {
      const response = await fetch(`${API_BASE}/bills`);
      if (!response.ok) throw new Error('Failed to fetch bills');
      return await response.json();
    } catch (error) {
      console.error('Error fetching bills:', error);
      return [];
    }
  },

  // Save all bills
  async saveBills(bills) {
    try {
      const response = await fetch(`${API_BASE}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', bills })
      });
      if (!response.ok) throw new Error('Failed to save bills');
      return await response.json();
    } catch (error) {
      console.error('Error saving bills:', error);
      throw error;
    }
  },

  // Delete a specific bill
  async deleteBill(billNumber) {
    try {
      const response = await fetch(`${API_BASE}/bills?billNumber=${billNumber}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete bill');
      return await response.json();
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw error;
    }
  }
};