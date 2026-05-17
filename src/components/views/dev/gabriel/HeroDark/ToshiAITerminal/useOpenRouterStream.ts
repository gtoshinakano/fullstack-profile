export interface SendMessageResult {
  model: string
  totalTokens: number
}

export async function sendMessage(
  question: string,
  onChunk: (text: string) => void
): Promise<SendMessageResult> {
  const workerUrl = process.env.NEXT_PUBLIC_TOSHI_AI_WORKER_URL
  if (!workerUrl) throw new Error('NEXT_PUBLIC_TOSHI_AI_WORKER_URL is not set')

  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })

  if (!response.ok) {
    throw new Error(`Worker API error: ${response.status}`)
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

  return { model: capturedModel || workerUrl, totalTokens }
}
