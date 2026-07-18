// /api/chat.js
// Función serverless de Vercel que hace de intermediario entre el sitio y la API de Groq.
// La API key de Groq NUNCA se expone al navegador: vive solo en la variable de entorno
// GROQ_API_KEY, configurada desde el panel de Vercel (Settings > Environment Variables).

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
    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'El campo "messages" es requerido y debe ser un array.' });
      return;
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
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

    // Se devuelve tal cual el formato de Groq/OpenAI: { choices: [{ message: { content } }] }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error interno del servidor.' });
  }
};
