export default async function handler(req, res) {
  try {
    const pagina = Number(req.query.pagina || 1);

    const url =
      'https://cima.aemps.es/cima/rest/medicamentos' +
      '?comerc=1&atc=R03&pagina=' + pagina;

    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!r.ok) {
      return res.status(r.status).json({ error: 'Error CIMA' });
    }

    const data = await r.json();

    const filtrados = (data.resultados || []).filter(m => {
      if (!m.atcs) return false;

      return m.atcs.some(a => {
        const c = a.codigo;
        return (
          c.startsWith('R03A') &&     // broncodilatadores
          !c.startsWith('R03BA') &&   // excluye CI
          !c.startsWith('R03DC')      // excluye antileucotrienos
        );
      });
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    res.status(200).json({
      version: 'BRONCODILATADORES_PROD_v2',
      pagina,
      total: filtrados.length,
      resultados: filtrados
    });

  } catch (e) {
    res.status(500).json({ error: 'Proxy error' });
  }
}
