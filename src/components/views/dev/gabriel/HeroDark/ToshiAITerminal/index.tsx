import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { event } from '@/lib/ga'
import { sendMessage } from './useOpenRouterStream'
import type { SendMessageResult } from './useOpenRouterStream'

const MAX_QUESTIONS = 3
const MAX_CHARS = 200

type MessageRole = 'welcome' | 'user' | 'assistant'

interface Message {
  role: MessageRole
  content: string
  isStreaming?: boolean
  model?: string
  totalTokens?: number
}

const DOT_COLORS = ['bg-[#FF5F57]', 'bg-[#FFBD2E]', 'bg-[#28C840]']

const ToshiAITerminal = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
  const { t } = useTranslation()

  const [messages, setMessages] = useState<Message[]>([])
  const [questionsUsed, setQuestionsUsed] = useState(0)
  const [isStreaming, setIsStreaming] = useState(false)
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
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
      const result: SendMessageResult = await sendMessage(question, (chunk) => {
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
          model: result.model,
          totalTokens: result.totalTokens,
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

  const inputDisabled = remaining === 0 || isStreaming
  const showCursor = isFocused && !inputDisabled
  const showPlaceholder = !input && !isFocused && !inputDisabled

  return (
    <div className='max-w-3xl mx-auto rounded-lg overflow-hidden shadow-2xl border border-gray-700 my-8'>
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
              <div className='font-mono'>
                <span className='text-green-400 font-bold select-none'>{'>'} User: </span>
                <span className='text-white'>{msg.content}</span>
              </div>
            ) : (
              <div>
                <div className='font-mono'>
                  <span className='text-green-400 font-bold select-none'>{'>'} Toshi AI: </span>
                  <span className='text-gray-300'>{msg.content}</span>
                  {msg.isStreaming && (
                    <span className='animate-pulse ml-0.5 text-green-400'>▋</span>
                  )}
                </div>
                {!msg.isStreaming && msg.model && (
                  <div className='text-gray-500 text-xs font-mono mt-1 pl-4'>
                    — {msg.model} [{msg.totalTokens ?? 0} tokens]
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {remaining === 0 && !isStreaming && (
          <p className='text-gray-400 text-xs mt-2 font-mono'>{t('toshi-ai.limit-reached')}</p>
        )}
      </div>

      {/* Input bar */}
      <div className='flex items-center gap-2 px-4 py-3 border-t border-gray-700 bg-gray-800'>
        <span className='text-green-400 font-bold font-mono select-none'>{'>'}</span>

        {/* Input with blinking block cursor */}
        <div className='flex-1 relative flex items-center min-w-0 overflow-hidden'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={inputDisabled}
            aria-label={t('toshi-ai.placeholder')}
            className='absolute inset-0 bg-transparent text-transparent caret-transparent outline-none font-mono text-sm disabled:cursor-not-allowed'
          />
          <span className='font-mono text-sm whitespace-pre pointer-events-none'>
            {showPlaceholder
              ? <span className='text-gray-500'>{t('toshi-ai.placeholder')}</span>
              : <span className='text-white'>{input}</span>
            }
          </span>
          {showCursor && (
            <span className='cursor-blink text-white font-mono text-sm select-none leading-none'>█</span>
          )}
        </div>

        <span
          className={`text-xs font-mono shrink-0 ${
            isOverLimit ? 'text-red-400' : 'text-gray-500'
          }`}
        >
          {t('toshi-ai.char-count', { count: input.length })}
        </span>
        <span className='text-xs text-gray-500 whitespace-nowrap font-mono shrink-0'>
          {t('toshi-ai.questions-remaining', { count: remaining })}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className='text-xs px-3 py-1 rounded bg-green-700 text-white font-mono disabled:opacity-30 hover:bg-green-600 transition-colors shrink-0'
        >
          {t('toshi-ai.send')}
        </button>
      </div>
    </div>
  )
}

export default ToshiAITerminal
