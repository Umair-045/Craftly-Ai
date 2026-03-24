const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-3.2-11b-vision-instruct';
const TEXT_MODEL = 'meta-llama/llama-3.1-8b-instruct';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
  'HTTP-Referer': 'http://localhost:3000',
  'X-Title': 'Craftly AI'
};

export async function detectMaterials(imageBase64, mediaType) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: MODEL,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mediaType || 'image/jpeg'};base64,${imageBase64}` }
          },
          {
            type: 'text',
            text: `Analyze this image and identify ALL visible household items or recyclable materials for crafts.
Return ONLY a JSON array (no markdown, no extra text):
[{"name":"item name","emoji":"appropriate emoji"}]
Look for: bottles, cardboard, paper, fabric, cans, jars, egg cartons, toilet rolls, magazines, containers, buttons, ribbons, bottle caps, etc.`
          }
        ]
      }],
      max_tokens: 1000
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'API error');
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  const match = text.match(/\[[\s\S]*\]/);
  return match ? JSON.parse(match[0]) : [];
}

export async function generateCrafts(materials, preferences) {
  const materialsText = materials.join(', ');
  const toolsText = preferences.tools?.length > 0 ? preferences.tools.join(', ') : 'scissors and glue only';
  const timestamp = Date.now();

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: TEXT_MODEL,
      messages: [{
        role: 'user',
        content: `You are a creative DIY craft expert. Generate 4 UNIQUE and CREATIVE craft project ideas.

MATERIALS: ${materialsText}
SKILL: ${preferences.skillLevel}
TIME: ${preferences.timeAvailable} minutes
PURPOSE: ${preferences.purpose}
TOOLS: ${toolsText}

Return ONLY a valid JSON array (no markdown, no extra text):
[{"id":"craft-${timestamp}-1","name":"Craft Name","emoji":"🎨","difficulty":"Easy ⭐","time":"20 mins","materials":["material1","material2"],"steps":[{"title":"Step Title","description":"What to do"}],"tips":["helpful tip"]}]

Make all 4 crafts completely different from each other.`
      }],
      max_tokens: 2500
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'API error');
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  const match = text.match(/\[[\s\S]*\]/);
  return match ? JSON.parse(match[0]) : [];
}
