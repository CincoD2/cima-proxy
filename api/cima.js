export default async function handler(req, res) {
  try {
    const pagina = req.query.pagina || 1;

    // ATC broncodilatadores
    const atc = req.query.atc || 'R03';

    const url =
      'https://cima.aemps.es/cima/rest/medicamentos' +
      '?comerc=1' +
      '&atc=' + atc +
      '&pagina=' + pagina;

    const r = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: 'Error CIMA' });
    }

    const data = await r.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json({
  DEBUG_PROXY: 'SOLO_BRONCODILATADORES_v2',
  pagina,
  totalFiltrados: filtrados.length,
  resultados: filtrados
});

  } catch (e) {
    res.status(500).json({ error: 'Proxy error' });
  }
}

// redeploy force
