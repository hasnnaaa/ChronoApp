import { supabase } from '../config/supabase.js';

export const ArticleModel = {
  async getAll() {
    const { data, error } = await supabase
      .from('articles')
      .select('*, profiles(full_name, username, avatar_url)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('articles')
      .select('*, profiles(full_name, username, avatar_url)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // Create artikel
  async create(articleData) {
    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Get artikel by user
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Search artikel
  async search(query) {
    const { data, error } = await supabase
      .from('articles')
      .select('*, profiles(full_name, avatar_url)')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getByCategory(category) {
    const { data, error } = await supabase
      .from('articles')
      .select('*, profiles(full_name, avatar_url)')
      .eq('category', category) // Pakai .eq (Equal) biar harus sama persis
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Update artikel
  async update(id, articleData) {
    const { data, error } = await supabase
      .from('articles')
      .update(articleData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Hapus artikel
  async delete(id) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};