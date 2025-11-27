exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { anthropicRequest } = JSON.parse(event.body || "{}");

    if (!anthropicRequest) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing anthropicRequest in body" })
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing ANTHROPIC_API_KEY on server" })
      };
    }

    const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(anthropicRequest)
    });

    const text = await apiResponse.text();

    return {
      statusCode: apiResponse.status,
      headers: { "content-type": "application/json" },
      body: text
    };
  } catch (err) {
    console.error("Function error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: String(err) })
    };
  }
};
