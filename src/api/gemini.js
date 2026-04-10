const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const adviceItemSchema = {
  type: 'object',
  properties: {
    priority: { type: 'string', enum: ['low', 'medium', 'high'] },
    reason: { type: 'string' },
    tip: { type: 'string' },
  },
  required: ['priority', 'reason', 'tip'],
}

const adviceResponseSchema = {
  type: 'object',
  properties: {
    cpu: adviceItemSchema,
    gpu: adviceItemSchema,
    ram: adviceItemSchema,
    storage: adviceItemSchema,
  },
}

const sanitizeJson = (text) => text
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/\s*,\s*([}\]])/g, '$1')

const parseGeminiJson = (text) => {
  const cleaned = (text ?? '').replace(/```json|```/g, '').trim()
  if (!cleaned) return null

  try {
    return JSON.parse(cleaned)
  } catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start >= 0 && end > start) {
      const sliced = cleaned.slice(start, end + 1)
      try {
        return JSON.parse(sanitizeJson(sliced))
      } catch {
        return null
      }
    }
  }

  return null
}

const requestGeminiJson = async ({ prompt, retryPrompt, responseSchema, temperature, maxOutputTokens, retries = 2 }) => {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const effectivePrompt = attempt === 0 ? prompt : (retryPrompt || prompt)
    const temp = attempt === 0 ? temperature : 0.1
    const maxTokens = attempt === 0 ? maxOutputTokens : Math.min(maxOutputTokens, 800)
    const generationConfig = {
      temperature: temp,
      maxOutputTokens: maxTokens,
      responseMimeType: 'application/json',
      ...(responseSchema ? { responseSchema } : {}),
    }

    let response
    try {
      response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: effectivePrompt }] }],
          generationConfig,
        }),
      })
    } catch (err) {
      if (attempt < retries) {
        await sleep(400 * (attempt + 1))
        continue
      }
      throw err
    }

    if (!response.ok) {
      if (response.status >= 500 && attempt < retries) {
        await sleep(600 * (attempt + 1))
        continue
      }
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.error?.message || `Gemini API error ${response.status}`)
    }

    const data = await response.json().catch(() => null)
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const parsed = parseGeminiJson(raw)
    if (parsed) return { parsed, raw }

    if (attempt < retries) {
      await sleep(300 * (attempt + 1))
      continue
    }

    return { parsed: null, raw }
  }

  return { parsed: null, raw: '' }
}

/**
 * Ask Gemini to pick one component per category from a real list fetched from DB.
 * Returns a parsed JSON object: { cpu: {...}, gpu: {...}, ... }
 */
export async function generateBuildWithGemini({ budget, usage, priority }) {
  const prompt = `
You are a PC building expert for the Indian market. Build a complete PC within a STRICT budget and aim to use most of the budget.

Budget: ₹${budget} INR — THIS IS A HARD LIMIT. Total MUST be under ₹${budget}, but aim to be close.
Usage: ${usage}
Priority: ${priority}

STRICT RULES:
- The SUM of all 7 part prices MUST be less than ₹${budget} INR
- If you cannot fit a part within budget, pick a cheaper alternative — never exceed
- Target a total between 95% and 100% of the budget when possible
- All prices must be real current Indian market prices (Amazon.in, MDComputers, Primeabgb)
- CPU and motherboard MUST have matching sockets
- Optimize for ${usage} with ${priority} priority
- Do NOT suggest parts that would push total over budget

Budget breakdown guide (adjust per priority):
- CPU: ~20% of budget = ₹${Math.round(budget * 0.20).toLocaleString('en-IN')}
- GPU: ~35% of budget = ₹${Math.round(budget * 0.35).toLocaleString('en-IN')}
- Motherboard: ~12% = ₹${Math.round(budget * 0.12).toLocaleString('en-IN')}
- RAM: ~8% = ₹${Math.round(budget * 0.08).toLocaleString('en-IN')}
- Storage: ~10% = ₹${Math.round(budget * 0.10).toLocaleString('en-IN')}
- PSU: ~8% = ₹${Math.round(budget * 0.08).toLocaleString('en-IN')}
- Case: ~7% = ₹${Math.round(budget * 0.07).toLocaleString('en-IN')}

Respond ONLY with valid JSON, no explanation, no markdown:
{
  "cpu":         { "name": "...", "brand": "...", "price": 0, "specs": "brief one-line spec" },
  "gpu":         { "name": "...", "brand": "...", "price": 0, "specs": "..." },
  "motherboard": { "name": "...", "brand": "...", "price": 0, "specs": "..." },
  "memory":      { "name": "...", "brand": "...", "price": 0, "specs": "..." },
  "storage":     { "name": "...", "brand": "...", "price": 0, "specs": "..." },
  "psu":         { "name": "...", "brand": "...", "price": 0, "specs": "..." },
  "case":        { "name": "...", "brand": "...", "price": 0, "specs": "..." }
}

FINAL CHECK: Before responding, add up all 7 prices. If total > ₹${budget}, replace the most expensive part with a cheaper one until total ≤ ₹${budget}. If total is far below budget, upgrade the most impactful parts while staying under budget.
`

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      tools: [{ googleSearch: {} }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
      },
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini API error ${response.status}`)
  }

  const data = await response.json()
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  const parsed = parseGeminiJson(raw)

  if (!parsed) {
    console.warn('Gemini raw response:', raw)
    throw new Error('Gemini returned invalid JSON. Try again.')
  }

  return parsed
}

/**
 * Ask Gemini for upgrade advice given current components.
 * Returns { reason, priority, tip } per category.
 */
export async function generateUpgradeAdvice({ currentComponents, budget, usageType }) {
  const componentSummary = Object.entries(currentComponents)
    .filter(([, v]) => v !== null)
    .map(([key, comp]) => `${key.toUpperCase()}: ${comp.name} (₹${Math.round((comp.price ?? 0) * 84).toLocaleString('en-IN')})`)
    .join('\n')

  const prompt = `
You are a PC upgrade advisor. A user has the following current PC components:

${componentSummary}

Their usage type is: ${usageType}
Their upgrade budget is: ${budget ? `₹${budget} INR` : 'not specified'}

For each component they have, give a SHORT upgrade recommendation.
Respond ONLY with valid JSON, no markdown, no explanation:

{
  "cpu": { "priority": "low|medium|high", "reason": "one sentence why or why not to upgrade", "tip": "brief what to look for" },
  "gpu": { "priority": "low|medium|high", "reason": "...", "tip": "..." },
  "ram": { "priority": "low|medium|high", "reason": "...", "tip": "..." },
  "storage": { "priority": "low|medium|high", "reason": "...", "tip": "..." }
}

Only include keys for components the user has. Keep each reason under 15 words. Keep each tip under 10 words.
`

  const strictAdvicePrompt = `${prompt}

IMPORTANT:
- Reply with ONLY minified JSON.
- Use double quotes for all keys and string values.
- No trailing commas or extra text.`

  const { parsed, raw } = await requestGeminiJson({
    prompt,
    retryPrompt: strictAdvicePrompt,
    responseSchema: adviceResponseSchema,
    temperature: 0.3,
    maxOutputTokens: 800,
    retries: 2,
  })

  if (!parsed) console.warn('Gemini invalid JSON (advice):', raw)
  return parsed // graceful fallback — upgrade planner still works without AI advice
}