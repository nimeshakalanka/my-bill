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
      console.log('Attempting to delete bill:', billNumber);
      const response = await fetch(`${API_BASE}/bills?billNumber=${encodeURIComponent(billNumber)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Delete failed:', errorData);
        throw new Error('Failed to delete bill');
      }
      
      const result = await response.json();
      console.log('Delete successful, remaining bills:', result.bills?.length);
      return result;
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw error;
    }
  }
};