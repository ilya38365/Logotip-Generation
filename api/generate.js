export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Для новых функций Vercel нужно явно прочитать JSON из тела:
    const body = await req.json ? await req.json() : req.body;
    const prompt = body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const apiToken = "r8_bzMz1mcT6tjCqzoZX6nqA1b49hgJUoa1NIadk"; 

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${apiToken}`,
      },
      body: JSON.stringify({
        version: "13b576ee37e8bce5448d8e71c3c2f6f875f04e04b58e37b7b8f60edbcaecf26b",
        input: { prompt },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data?.error?.message || "Replicate API error" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: error.message });
  }
}

