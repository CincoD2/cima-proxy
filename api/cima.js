export default async function handler(req, res) {
  try {
    const page = req.query.pagina || 1;

    const url =
      'https://cima.aemps.es/cima/rest/medicamentos' +
      '?comerc=1' +
      '&pagina=' + page;

    const r = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: 'Error CIMA' });
    }

    const data = await r.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ error: 'Proxy error' });
  }
}
