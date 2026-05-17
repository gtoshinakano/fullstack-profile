import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { event } from '@/lib/ga'
import { sendMessage } from './useOpenRouterStream'

const MAX_QUESTIONS = 3
const MAX_CHARS = 200

type MessageRole = 'welcome' | 'user' | 'assistant'

interface Message {
  role: MessageRole
  content: string
  isStreaming?: boolean
}

const DOT_COLORS = ['bg-[#FF5F57]', 'bg-[#FFBD2E]', 'bg-[#28C840]']

const ToshiAITerminal = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
  const { t } = useTranslation()

  const [messages, setMessages] = useState<Message[]>([])
  const [questionsUsed, setQuestionsUsed] = useState(0)
  const [isStreaming, setIsStreaming] = useState(false)
  const [input, setInput] = useState('')
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([{ role: 'welcome', content: t('toshi-ai.welcome') }])
  }, [t])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [messages])

  if (!apiKey) return null

  const remaining = MAX_QUESTIONS - questionsUsed
  const isOverLimit = input.length > MAX_CHARS
  const canSubmit =
    input.trim().length > 0 &&
    !isOverLimit &&
    remaining > 0 &&
    !isStreaming

  const handleSubmit = async () => {
    if (!canSubmit) return

    const question = input.trim()
    setInput('')
    setQuestionsUsed((n) => n + 1)

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: question },
      { role: 'assistant', content: '', isStreaming: true },
    ])

    setIsStreaming(true)

    try {
      await sendMessage(question, (chunk) => {
        setMessages((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          updated[updated.length - 1] = {
            ...last,
            content: last.content + chunk,
          }
          return updated
        })
      })

      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          isStreaming: false,
        }
        return updated
      })

      event({
        action: 'ai_terminal_query',
        params: {
          event_category: 'toshi-ai',
          event_label: String(MAX_QUESTIONS - questionsUsed - 1),
        },
      })
    } catch {
      setQuestionsUsed((n) => n - 1)
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: t('toshi-ai.error'),
          isStreaming: false,
        }
        return updated
      })
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className='rounded-lg overflow-hidden shadow-2xl border border-gray-700 my-8'>
      {/* Title bar */}
      <div className='bg-gray-800 px-4 py-3 flex items-center gap-2'>
        {DOT_COLORS.map((color, i) => (
          <span key={i} className={`w-3 h-3 rounded-full ${color}`} />
        ))}
        <span className='text-gray-300 text-sm ml-3 font-mono'>
          {t('toshi-ai.title')}
        </span>
      </div>

      {/* Output area */}
      <div
        ref={outputRef}
        className='bg-gray-900 font-mono text-sm overflow-y-auto p-4 min-h-[200px] max-h-[400px]'
        role='log'
        aria-live='polite'
        aria-label={t('toshi-ai.title')}
      >
        {messages.map((msg, i) => (
          <div key={i} className='mb-2 leading-relaxed'>
            {msg.role === 'user' ? (
              <span className='text-white'>
                <span className='text-green-400 font-bold select-none'>{'>'} </span>
                {msg.content}
              </span>
            ) : (
              <span className='text-green-400'>
                <span className='font-bold select-none'>{'>'} Toshi AI: </span>
                {msg.content}
                {msg.isStreaming && (
                  <span className='animate-pulse ml-0.5'>▋</span>
                )}
              </span>
            )}
          </div>
        ))}
        {remaining === 0 && !isStreaming && (
          <p className='text-yellow-400 text-xs mt-2'>{t('toshi-ai.limit-reached')}</p>
        )}
      </div>

      {/* Input bar */}
      <div className='flex items-center gap-2 px-4 py-3 border-t border-gray-700 bg-gray-800'>
        <span className='text-green-400 font-bold font-mono select-none'>{'>'}</span>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={remaining > 0 ? t('toshi-ai.placeholder') : ''}
          disabled={remaining === 0 || isStreaming}
          aria-label={t('toshi-ai.placeholder')}
          className='bg-transparent text-white flex-1 outline-none placeholder-gray-500 font-mono text-sm disabled:opacity-40'
        />
        <span
          className={`text-xs font-mono ${
            isOverLimit ? 'text-red-400' : 'text-gray-500'
          }`}
        >
          {t('toshi-ai.char-count', { count: input.length })}
        </span>
        <span className='text-xs text-gray-500 whitespace-nowrap'>
          {t('toshi-ai.questions-remaining', { count: remaining })}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className='text-xs px-3 py-1 rounded bg-green-700 text-white font-mono disabled:opacity-30 hover:bg-green-600 transition-colors'
        >
          {t('toshi-ai.send')}
        </button>
      </div>
    </div>
  )
}

export default ToshiAITerminal
