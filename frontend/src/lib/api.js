import { supabase } from './supabase';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const extractTable = (endpoint) => {
  const parts = endpoint.split('/').filter(Boolean);
  // mapping for special routes
  if (parts[0] === 'auth') return 'users';
  return parts[0];
};

export const api = {
  get: async (endpoint) => {
    const table = extractTable(endpoint);
    
    if (endpoint.includes('/auth/me')) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new ApiError('Not logged in', 401);
      const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single();
      return { success: true, user: profile || session.user };
    }
    
    // Generic GET
    if (['news', 'events', 'students', 'admissions', 'payments', 'contacts', 'calendar'].includes(table)) {
      let query = supabase.from(table).select('*');
      
      // Note: we're doing basic fetching, sorting can be added here
      const { data, error } = await query;
      
      if (error) throw new ApiError(error.message, 500, error);
      
      // Map to expected frontend formats
      if (table === 'news') return { success: true, news: data, pagination: { total: data.length } };
      if (table === 'events') return { success: true, events: data, pagination: { total: data.length } };
      if (table === 'students') return { success: true, students: data, pagination: { total: data.length } };
      if (table === 'admissions') return { success: true, admissions: data, pagination: { total: data.length } };
      if (table === 'payments') {
        const rev = data.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
        return { success: true, payments: data, stats: { thisMonthRevenue: rev, totalCollected: rev } };
      }
      if (table === 'contacts') return { success: true, contacts: data, summary: { new: data.filter(c => c.status === 'new').length } };
      if (table === 'calendar') return { success: true, events: data };
      
      return { success: true, data };
    }
    
    return { success: true, data: [] };
  },
  
  post: async (endpoint, body) => {
    const table = extractTable(endpoint);
    if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
      return { success: false, message: 'Use AuthContext for authentication' };
    }
    
    if (['news', 'events', 'students', 'admissions', 'payments', 'contacts', 'calendar'].includes(table)) {
      const { data, error } = await supabase.from(table).insert([body]).select();
      if (error) throw new ApiError(error.message, 500, error);
      return { success: true, data: data[0] };
    }
    
    return { success: true };
  },
  
  put: async (endpoint, body) => {
    const table = extractTable(endpoint);
    const parts = endpoint.split('/').filter(Boolean);
    const id = parts[parts.length - 1]; // Assume last part is ID
    
    if (['news', 'events', 'students', 'admissions', 'payments', 'contacts', 'calendar'].includes(table)) {
      const { data, error } = await supabase.from(table).update(body).eq('id', id).select();
      if (error) throw new ApiError(error.message, 500, error);
      return { success: true, data: data[0] };
    }
    return { success: true };
  },
  
  delete: async (endpoint) => {
    const table = extractTable(endpoint);
    const parts = endpoint.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    
    if (['news', 'events', 'students', 'admissions', 'payments', 'contacts', 'calendar'].includes(table)) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw new ApiError(error.message, 500, error);
      return { success: true };
    }
    return { success: true };
  },
  
  upload: async (endpoint, formData) => {
    // Basic mock for upload, returns a dummy image as actual storage upload requires more setup
    return { success: true, url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600' };
  }
};

export { ApiError };
