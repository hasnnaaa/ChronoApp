import { supabase } from '../config/supabase.js';

export const BookmarkModel = {
  // Ambil bookmark milik user 
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        id, created_at,
        articles (id, title, category, excerpt, image_url, created_at, likes_count, profiles(full_name))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Tambah Bookmark
  async create(userId, articleId) {
    const { error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: userId, article_id: articleId }]);
    if (error) throw error;
    return true;
  },

  // Hapus Bookmark (Berdasarkan User & Artikel -> Untuk Toggle)
  async delete(userId, articleId) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('article_id', articleId);
    if (error) throw error;
    return true;
  },

  // Hapus Bookmark (Berdasarkan ID Bookmark -> Untuk Reading List)
  async deleteById(id) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Cek Status
  async checkStatus(userId, articleId) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('article_id', articleId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};