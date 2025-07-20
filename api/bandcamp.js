// Netlify / Vercel compatible serverless function
export default async function handler(req, res) {
  const query = req.query.query || req.query.q || '';
  if (!query) {
    res.status(400).json({ error: 'Missing query' });
    return;
  }
  const url = `https://bandcamp.com/api/fuzzysearch/1/autocomplete?search_text=${encodeURIComponent(query)}`;
  try {
    const r = await fetch(url);
    if (!r.ok) {
      res.status(r.status).json({ error: 'Bandcamp error' });
      return;
    }
    const json = await r.json();
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json(json);
  } catch (e) {
    res.status(500).json({ error: 'Fetch failed' });
  }
} 