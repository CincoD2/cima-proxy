export default async function handler(req, res) {
  try {
    const pagina = Number(req.query.pagina || 1);

    // 1. Pedimos presentaciones respiratorias
    const url =
      'https://cima.aemps.es/cima/rest/presentaciones' +
      '?vmp=R03&comerc=1&pagina=' + pagina;

    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!r.ok) {
      return res.status(r.status).json({ error: 'Error CIMA' });
    }

    const data = await r.json();

    const BRONCODILATADORES = [
      'SALBUTAMOL',
      'FORMOTEROL',
      'SALMETEROL',
      'TERBUTALINA',
      'INDACATEROL',
      'TIOTROPIO',
      'GLICOPIRRONIO',
      'ACLIDINIO',
      'UMECLIDINIO',
      'IPRATROPIO'
    ];

    // 2. Filtramos por principio activo
    const filtrados = (data.resultados || []).filter(p =>
      BRONCODILATADORES.some(pa =>
        p.pactivos?.toUpperCase().includes(pa)
      )
    );

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    res.status(200).json({
      version: 'BRONCODILATADORES_PRESENTACIONES_OK',
      pagina,
      total: filtrados.length,
      resultados: filtrados
    });

  } catch (e) {
    res.status(500).json({ error: 'Proxy error' });
  }
}
