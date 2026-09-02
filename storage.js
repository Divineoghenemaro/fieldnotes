/* storage.js — localStorage-backed post store for Fieldnotes */

const STORAGE_KEY = 'fieldnotes_posts_v1';

const SEED_POSTS = [
  {
    id: 'seed-1',
    title: 'The weight of a paper map',
    category: 'Wandering',
    date: '2026-08-18',
    excerpt: 'On why I still fold a paper map into my bag, even when my phone knows the way better.',
    body: [
      "My phone gets me there faster. It knows the traffic, the shortcuts, the roadworks that started this morning. And yet I still keep a paper map folded into the outside pocket of my bag, soft at the creases from years of being opened and closed in the wind.",
      "A paper map doesn't route you. It shows you a place, whole and at once, and lets you decide. You see the coastline curve around a headland you weren't planning to visit, a lake with no road to it, a town whose name you like the sound of. The phone shows you the next turn. The map shows you the country.",
      "I've started noticing how much of my thinking has become turn-by-turn. Do the next right thing, then the next. It works. But every so often I want to unfold the whole sheet and see where I actually am."
    ]
  },
  {
    id: 'seed-2',
    title: 'Notes on rereading',
    category: 'Reading',
    date: '2026-08-10',
    excerpt: 'A book you reread is a different book, because you are a different reader.',
    body: [
      "I used to feel a mild guilt about rereading — so many unread books, so little time, and here I am back inside one I already know the ending to. But a book you reread isn't the same book. The sentences haven't moved, but you have.",
      "This month I went back to a novel I first read at twenty-two and found a completely different story sitting in the same words. The parts I underlined then are not the parts that stop me now. What I took for wisdom I now read as a young person's ache, and what I skimmed past then reads now like the whole point.",
      "Rereading isn't revisiting. It's checking your own instruments against a fixed star."
    ]
  },
  {
    id: 'seed-3',
    title: 'A short defense of doing it badly first',
    category: 'Craft',
    date: '2026-07-29',
    excerpt: 'The first draft, the first pot, the first stitch — none of them need to be good. They need to exist.',
    body: [
      "Every craft has a version of this lesson and every beginner has to learn it separately, as if no one has ever told them before: the first attempt is not supposed to be good. It's supposed to exist, so that the second attempt has something to push against.",
      "I watch people stall out before they start because they're picturing the finished thing and measuring their first move against it. But a first draft isn't a small version of the final piece. It's scaffolding. Nobody photographs the scaffolding.",
      "Do it badly first. Do it badly on purpose if that helps. The badness is not a detour from the good version — it's the only road there is."
    ]
  },
  {
    id: 'seed-4',
    title: 'What the corner shop knows',
    category: 'Everyday',
    date: '2026-07-14',
    excerpt: 'Small, unremarkable places hold more of a neighborhood\'s memory than the landmarks do.',
    body: [
      "The corner shop near my old flat has been run by the same family for eleven years. In that time I've watched them track, without ever saying so directly, who's moved in, who's moved out, who's expecting, who's out of work, who's grieving.",
      "Landmarks get the postcards. But it's the corner shop, the launderette, the bus stop bench, that actually hold a neighborhood's memory — because they're where people pass through often enough, and briefly enough, to be honestly themselves.",
      "I think about this every time a shop like that closes. It's not just a business. It's an instrument that had learned how to read a whole street, and now it's gone quiet."
    ]
  },
  {
    id: 'seed-5',
    title: 'Working in the margins of the day',
    category: 'Craft',
    date: '2026-06-30',
    excerpt: 'The best ten minutes of writing I get are rarely the ten minutes I scheduled for it.',
    body: [
      "I keep a proper writing hour, most mornings, and I don't want to undersell it — it's where the real structural work happens. But if I'm honest, some of my best sentences arrive in the margins: waiting for the kettle, on a train platform, in the gap between meetings when my brain hasn't fully switched tasks yet.",
      "There's something about a margin that a scheduled block doesn't have: no expectation. You're not there to produce. You're just there, briefly, with a thought that wandered in.",
      "I've started keeping a small notebook for exactly these gaps. Most of it is unusable. But once every so often a margin note turns out to be the actual spine of the piece I thought I was writing in the proper hour."
    ]
  }
];

function loadPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_POSTS));
    return [...SEED_POSTS];
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    console.error('Fieldnotes: could not parse stored posts, reseeding.', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_POSTS));
  return [...SEED_POSTS];
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function getAllPosts() {
  return loadPosts().sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getPostById(id) {
  return loadPosts().find(p => p.id === id) || null;
}

function getPostsByCategory(category) {
  return getAllPosts().filter(p => p.category.toLowerCase() === category.toLowerCase());
}

function getCategories() {
  const posts = loadPosts();
  const set = new Set(posts.map(p => p.category));
  return [...set].sort((a, b) => a.localeCompare(b));
}

function addPost(post) {
  const posts = loadPosts();
  const newPost = {
    id: 'post-' + Date.now(),
    title: post.title.trim(),
    category: post.category.trim(),
    date: post.date || new Date().toISOString().slice(0, 10),
    excerpt: post.excerpt.trim(),
    body: post.body,
    image: post.image || null
  };
  posts.push(newPost);
  savePosts(posts);
  return newPost;
}

function updatePost(id, updates) {
  const posts = loadPosts();
  const idx = posts.findIndex(p => p.id === id);
  if (idx === -1) return null;
  posts[idx] = { ...posts[idx], ...updates };
  savePosts(posts);
  return posts[idx];
}

function deletePost(id) {
  const posts = loadPosts().filter(p => p.id !== id);
  savePosts(posts);
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
