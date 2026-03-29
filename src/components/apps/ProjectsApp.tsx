import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useWindowSize } from '../../hooks/useWindowSize'

const PROJECTS_URL = 'https://raw.githubusercontent.com/ret-UNRN/data/main/projects.json'

interface Repo {
  name: string
  description: string
  langs: string[]  // uno o más lenguajes, ej: ['TypeScript', 'React']
  url: string
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: 'text-blue-400 border-blue-400/30',
  React: 'text-cyan-400 border-cyan-400/30',
  'C++': 'text-purple-400 border-purple-400/30',
  Python: 'text-yellow-400 border-yellow-400/30',
  Markdown: 'text-green border-green/30',
  JavaScript: 'text-yellow-300 border-yellow-300/30',
  Go: 'text-cyan-300 border-cyan-300/30',
  Rust: 'text-orange-400 border-orange-400/30',
  Java: 'text-accent border-accent/30',
  Shell: 'text-green border-green/30',
}

const LOADING_LINES = [
  '$ git remote -v',
  '  origin  https://github.com/ret-unrn (fetch)',
  '$ git fetch origin...',
]

export default function ProjectsApp() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [visibleLines, setVisibleLines] = useState(0)
  const [animDone, setAnimDone] = useState(false)
  const { isMobile } = useWindowSize()

  // Animación de terminal + fetch en paralelo
  useEffect(() => {
    let i = 0
    const next = () => {
      i++
      setVisibleLines(i)
      if (i < LOADING_LINES.length) {
        setTimeout(next, 180)
      } else {
        setTimeout(() => setAnimDone(true), 400)
      }
    }
    const id = setTimeout(next, 100)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch(PROJECTS_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: Repo[]) => {
        if (!cancelled) {
          setRepos(data)
          setStatus('ok')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => { cancelled = true }
  }, [])

  const ready = animDone && status !== 'loading'

  if (!ready) {
    const padding = isMobile ? 'px-4 py-4' : 'px-6 py-6'
    const fontSize = isMobile ? 'text-[0.7rem]' : 'text-xs'
    return (
      <div className={`flex h-full flex-col justify-center ${padding} font-mono ${fontSize}`}>
        {LOADING_LINES.slice(0, visibleLines).map((line, i) => (
          <p
            key={i}
            className={`leading-relaxed ${line.startsWith('$') ? 'text-green' : 'text-muted'}`}
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {line}
            {i === visibleLines - 1 && (
              <span className="animate-[blink_700ms_step-end_infinite] ml-0.5 inline-block">▌</span>
            )}
          </p>
        ))}
      </div>
    )
  }

  const padding = isMobile ? 'px-4 py-4' : 'px-6 py-6'
  const headerText = isMobile ? 'text-[0.7rem]' : 'text-xs'
  const repoName = isMobile ? 'text-xs' : 'text-sm'
  const repoDesc = isMobile ? 'text-[0.65rem]' : 'text-xs'
  const langTag = isMobile ? 'text-[0.6rem]' : 'text-[0.7rem]'
  const cardGap = isMobile ? 'gap-2' : 'gap-3'
  const cardPadding = isMobile ? 'p-3' : 'p-4'

  return (
    <div className={`h-full overflow-auto ${padding}`}>
      {/* Header */}
      <div className="mb-3 flex flex-col items-start justify-between gap-2 sm:mb-4 sm:flex-row sm:items-center sm:gap-3">
        <span className={`font-mono ${headerText} text-muted`}>$ ls ~/proyectos/</span>
        <a
          href="https://github.com/ret-unrn"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1 font-mono ${headerText} text-accent hover:underline`}
        >
          <ExternalLink size={isMobile ? 10 : 12} />
          github.com/ret-unrn
        </a>
      </div>

      {/* Error */}
      {status === 'error' && (
        <p className="font-mono text-xs text-red-500">error al cargar proyectos</p>
      )}

      {/* Repos */}
      {status === 'ok' && (
        <div className={`grid grid-cols-1 ${cardGap} sm:grid-cols-2`}>
          {repos.map((repo, i) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group rounded-lg border border-border bg-surface-2 transition-colors hover:border-accent/40 ${cardPadding}`}
              style={{ animation: 'slide-in 200ms ease-out both', animationDelay: `${i * 60}ms` }}
            >
              <p className={`font-mono font-semibold text-green group-hover:underline ${repoName}`}>
                {repo.name}
              </p>
              <p className={`mt-1 font-mono leading-relaxed text-muted ${repoDesc}`}>
                {repo.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1 sm:mt-3">
                {repo.langs.map((lang) => (
                  <span
                    key={lang}
                    className={`rounded border px-1.5 py-0.5 font-mono ${langTag} ${LANG_COLORS[lang] ?? 'text-muted border-border'}`}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
