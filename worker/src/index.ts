import { buildSystemPrompt } from './systemPrompt'

interface Env {
  OPENROUTER_API_KEY: string
  OPENROUTER_MODEL: string
}

const ALLOWED_ORIGIN = 'https://gtoshinakano.github.io'

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') ?? ''

    if (request.method === 'OPTIONS') {
      if (origin !== ALLOWED_ORIGIN) {
        return new Response('Forbidden', { status: 403 })
      }
      return new Response(null, {
        status: 204,
        headers: { ...corsHeaders(ALLOWED_ORIGIN), 'Access-Control-Max-Age': '86400' },
      })
    }

    if (request.method !== 'POST' || origin !== ALLOWED_ORIGIN) {
      return new Response('Forbidden', { status: 403 })
    }

    let question: string
    try {
      const body = (await request.json()) as { question?: string }
      question = (body.question ?? '').trim()
      if (!question) {
        return new Response(JSON.stringify({ error: 'question is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
        })
      }
    } catch {
      return new Response(JSON.stringify({ error: 'invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
      })
    }

    let upstream: Response
    try {
      upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: env.OPENROUTER_MODEL,
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            { role: 'user', content: question },
          ],
          stream: true,
        }),
      })
    } catch {
      return new Response(JSON.stringify({ error: 'upstream timeout' }), {
        status: 504,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
      })
    }

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: 'upstream error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
      })
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        ...corsHeaders(ALLOWED_ORIGIN),
      },
    })
  },
}
