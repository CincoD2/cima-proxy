export default async function handler(req, res) {
  try {
    const pagina = Number(req.query.pagina || 1);

    // Pedimos R03 completo y filtramos subgrupos broncodilatadores
    const url =
      'https://cima.aemps.es/cima/rest/medicamentos' +
      '?comerc=1&atc=R03&pagina=' + pagina;

    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!r.ok) {
      return res.status(r.status).json({ error: 'Error CIMA' });
    }

    const data = await r.json();

    const subgrupos = ['R03AC', 'R03CC', 'R03AK', 'R03AL'];

    const filtrados = (data.resultados || []).filter(m =>
      m.atcs?.some(a => subgrupos.some(s => a.codigo.startsWith(s)))
    );

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    res.status(200).json({
      version: 'BRONCODILATADORES_PROD',
      pagina,
      total: filtrados.length,
      resultados: filtrados
    });

  } catch (e) {
    res.status(500).json({ error: 'Proxy error' });
  }
}
