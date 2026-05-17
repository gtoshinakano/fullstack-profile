import { buildSystemPrompt } from './systemPrompt'

export interface SendMessageResult {
  model: string
  totalTokens: number
}

export async function sendMessage(
  question: string,
  onChunk: (text: string) => void
): Promise<SendMessageResult> {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
  if (!apiKey) throw new Error('NEXT_PUBLIC_OPENROUTER_API_KEY is not set')

  const model = process.env.NEXT_PUBLIC_OPENROUTER_MODEL
  if (!model) throw new Error('NEXT_PUBLIC_OPENROUTER_MODEL is not set')

  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: question },
        ],
        stream: true,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let capturedModel = ''
  let lastData: Record<string, unknown> | null = null

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data: ') || trimmed === 'data: [DONE]') continue
      try {
        const data = JSON.parse(trimmed.slice(6))
        if (!capturedModel && data.model) capturedModel = data.model
        lastData = data
        const content = data.choices?.[0]?.delta?.content
        if (content) onChunk(content)
      } catch {
        // skip malformed SSE lines
      }
    }
  }

  const usage = lastData?.usage as Record<string, number> | undefined
  const totalTokens = usage?.total_tokens ?? 0

  return { model: capturedModel || model, totalTokens }
}
