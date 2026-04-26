const Product = require("../models/Product");

// We are bypassing LangChain completely to test a raw fetch connection
const processQuery = async (query) => {
  require('dotenv').config();

  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing in environment variables. Please add it to .env to enable the Smart Assistant.");
  }

  try {
    console.log("--> Discovering supported models for this API key...");
    
    // First, ask Google what models this specific API key is allowed to use
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`;
    const listRes = await fetch(listUrl).then(res => res.json());

    if (listRes.error) {
      throw new Error(`API Key Error: ${listRes.error.message}`);
    }

    // Find the best available Gemini model that supports generateContent
    const availableModels = listRes.models || [];
    let targetModel = availableModels.find(m => m.name.includes("gemini-1.5-flash") && m.supportedGenerationMethods.includes("generateContent"));
    
    if (!targetModel) {
      targetModel = availableModels.find(m => m.name.includes("gemini") && m.supportedGenerationMethods.includes("generateContent"));
    }

    if (!targetModel) {
      const allNames = availableModels.map(m => m.name).join(", ");
      throw new Error(`Your API key has no access to Gemini models. Available models: ${allNames || 'None'}`);
    }

    console.log("--> Selected Model:", targetModel.name);

    const url = `https://generativelanguage.googleapis.com/v1beta/${targetModel.name}:generateContent?key=${process.env.GOOGLE_API_KEY}`;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: query }] }]
      })
    };

    const fetchPromise = fetch(url, requestOptions).then(res => res.json());

    const result = await Promise.race([
      fetchPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Raw Fetch Request Timed Out (took more than 20 seconds). Network issue likely.")), 20000))
    ]);

    if (result.error) {
      throw new Error(result.error.message);
    }

    console.log("--> AI responded successfully!");
    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("--> AI Service Error:", error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  processQuery,
};
