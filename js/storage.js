/* storage.js — Supabase-backed data layer for Fieldnotes */

const SUPABASE_URL = 'https://mpvnhwixmjxoxrosfxdq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4b0NdHMnTv-yWaOMF2pDXg_XLhNA8xH';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false });
  if (error) { console.error('getAllPosts:', error); return []; }
  return data;
}

async function getPostById(id) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) { console.error('getPostById:', error); return null; }
  return data;
}

async function getPostsByCategory(category) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .ilike('category', category)
    .order('date', { ascending: false });
  if (error) { console.error('getPostsByCategory:', error); return []; }
  return data;
}

async function getCategories() {
  const { data, error } = await supabase.from('posts').select('category');
  if (error) { console.error('getCategories:', error); return []; }
  const set = new Set(data.map(p => p.category));
  return [...set].sort((a, b) => a.localeCompare(b));
}

async function addPost(post) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: post.title.trim(),
      category: post.category.trim(),
      date: post.date || new Date().toISOString().slice(0, 10),
      excerpt: post.excerpt.trim(),
      body: post.body,
      image: post.image || null
    })
    .select()
    .single();
  if (error) { console.error('addPost:', error); throw error; }
  return data;
}

async function updatePost(id, updates) {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updatePost:', error); throw error; }
  return data;
}

async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) { console.error('deletePost:', error); throw error; }
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
