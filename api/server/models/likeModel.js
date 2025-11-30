import { supabase } from '../config/supabase.js';

export const LikeModel = {
  // Tambah Like
  async add(userId, articleId) {
    const { error } = await supabase
      .from('likes')
      .insert([{ user_id: userId, article_id: articleId }]);
    if (error) throw error;
  },

  // Hapus Like
  async remove(userId, articleId) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('article_id', articleId);
    if (error) throw error;
  },

  // Cek Status Like
  async checkStatus(userId, articleId) {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('article_id', articleId)
      .single();
    return data;
  }
};