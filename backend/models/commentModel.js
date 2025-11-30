import { supabase } from '../config/supabase.js';

export const CommentModel = {
  // Ambil komentar berdasarkan artikel
  async getByArticle(articleId) {
    const { data, error } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id, profiles(full_name, avatar_url, username)')
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Tambah komentar
  async create(content, articleId, userId) {
    const { error } = await supabase
      .from('comments')
      .insert([{ content, article_id: articleId, user_id: userId }]);
    if (error) throw error;
  },

  // Hapus komentar
  async delete(id) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};