import { supabase } from '../config/supabase.js';

export const UserModel = {
  // Cari user berdasarkan email (untuk login)
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  },

  // Cari user berdasarkan ID (untuk profil)
  async findById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Register User Baru
  async create(userData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update Profil
  async update(id, updateData) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};