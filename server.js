const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());
app.get('/', (req, res) => res.json({status:'NewsDesk Proxy OK'}));
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({error:'Missing url'});
  try {
    const headers = {};
    if (req.headers['authorization']) headers['Authorization'] = req.headers['authorization'];
    if (req.headers['appid']) headers['AppId'] = req.headers['appid'];
    if (req.headers['appkey']) headers['AppKey'] = req.headers['appkey'];
    const r = await fetch(url, {headers, timeout:15000});
    const body = await r.text();
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Content-Type', r.headers.get('content-type') || 'text/plain');
    res.status(r.status).send(body);
  } catch(e) { res.status(500).json({error:e.message}); }
});
app.listen(3000, '0.0.0.0', () => console.log('Proxy running on port 3000'));
