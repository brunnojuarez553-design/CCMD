// /api/vision.js
// Función serverless de Vercel para el diagnóstico visual del vehículo.
// Recibe una imagen en base64 desde el navegador y la reenvía a un modelo de visión
// de Groq usando la API key guardada en la variable de entorno GROQ_API_KEY.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GROQ_API_KEY no está configurada en el servidor.' });
    return;
  }

  try {
    const { image, mimeType, prompt } = req.body || {};
    if (!image || !prompt) {
      res.status(400).json({ error: 'Los campos "image" y "prompt" son requeridos.' });
      return;
    }

    const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${image}`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ],
        temperature: 0.4,
        max_completion_tokens: 1024,
      }),
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      res.status(groqResponse.status).json({
        error: (data && data.error && data.error.message) || 'Error al conectar con Groq.',
      });
      return;
    }

    const content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    res.status(200).json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error interno del servidor.' });
  }
};
