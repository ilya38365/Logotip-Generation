export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt } = req.body;
  if (!prompt) {
    res.status(400).json({ error: 'No prompt provided' });
    return;
  }

  const apiToken = "r8_bzMz1mcT6tjCqzoZX6nqA1b49hgJUoa1NIadk"; 

  try {
    // Создаём запрос на запуск генерации в Replicate
    const predictionRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${apiToken}`
      },
      body: JSON.stringify({
        version: "13b576ee37e8bce5448d8e71c3c2f6f875f04e04b58e37b7b8f60edbcaecf26b",
        input: { prompt }
      })
    });

    if (!predictionRes.ok) {
      const errorText = await predictionRes.text();
      res.status(500).json({ error: 'Ошибка API Replicate: ' + errorText });
      return;
    }

    const prediction = await predictionRes.json();

    // Возвращаем сразу ответ с URL (в идеале нужно ждать статуса)
    res.status(200).json(prediction);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
