import ReactMarkdown from 'react-markdown'

interface MarkdownContentProps {
  content: string
}

const MarkdownContent = ({ content }: MarkdownContentProps) => {
  return (
    <div className='terminal-markdown'>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className='text-green-400 font-bold text-base mt-2 mb-1 font-mono'>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className='text-green-400 font-bold text-sm mt-2 mb-1 font-mono'>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className='text-green-400 font-bold text-sm mt-1 mb-1 font-mono'>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className='text-gray-300 my-1 font-mono'>{children}</p>
          ),
          strong: ({ children }) => (
            <strong className='text-white font-bold'>{children}</strong>
          ),
          em: ({ children }) => (
            <em className='text-gray-300 italic'>{children}</em>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-')
            if (isBlock || String(children).includes('\n')) {
              return (
                <pre className='bg-gray-800 border border-gray-700 rounded p-2 my-2 overflow-x-auto'>
                  <code className='text-green-300 text-xs font-mono whitespace-pre'>
                    {children}
                  </code>
                </pre>
              )
            }
            return (
              <code className='bg-gray-800 text-green-300 px-1 rounded font-mono text-xs'>
                {children}
              </code>
            )
          },
          pre: ({ children }) => <>{children}</>,
          ul: ({ children }) => (
            <ul className='list-disc list-inside my-1 space-y-0.5'>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className='list-decimal list-inside my-1 space-y-0.5'>{children}</ol>
          ),
          li: ({ children }) => (
            <li className='text-gray-300 font-mono'>{children}</li>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-cyan-400 underline hover:text-cyan-300'
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className='border-l-2 border-gray-600 pl-3 my-1 text-gray-400 italic font-mono'>
              {children}
            </blockquote>
          ),
          hr: () => <hr className='border-gray-700 my-2' />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownContent
