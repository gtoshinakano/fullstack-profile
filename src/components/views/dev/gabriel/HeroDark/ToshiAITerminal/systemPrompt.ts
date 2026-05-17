import jobsData from '@/data/jobs.json'
import projectsData from '@/data/toshi-projects.json'
import stacksData from '@/data/stacks.json'
import swtoolsData from '@/data/swtools.json'

type JobEntry = {
  company: string
  job_name: string
  period: string[]
  description: string
  stacks: string[]
}

type ProjectEntry = {
  title: string
  type: string
  period: string[]
  problem: string
  solution: string
  stacks: string[]
  label: string
}

type StackRegistry = Record<string, { name: string }>

function serializeJobs(jobs: JobEntry[]): string {
  return jobs
    .map(
      (j) =>
        `- ${j.company} | ${j.job_name} | ${j.period[0]} – ${j.period[1] ?? 'present'}\n  Stacks: ${j.stacks.join(', ')}`
    )
    .join('\n')
}

function serializeProjects(projects: ProjectEntry[]): string {
  return projects
    .slice()
    .reverse()
    .map(
      (p) =>
        `- [${p.type}] ${p.title} (${p.period[0]} – ${p.period[1] ?? 'present'})\n  Problem: ${p.problem}\n  Solution: ${p.solution}`
    )
    .join('\n')
}

function collectSkills(jobs: JobEntry[], projects: ProjectEntry[], stacks: StackRegistry, swtools: StackRegistry): string {
  const allKeys = new Set<string>()
  jobs.forEach((j) => j.stacks.forEach((s) => allKeys.add(s)))
  projects.forEach((p) => p.stacks.forEach((s) => allKeys.add(s)))
  const names = Array.from(allKeys)
    .map((k) => stacks[k]?.name ?? swtools[k]?.name ?? k)
    .filter(Boolean)
  return names.join(', ')
}

export function buildSystemPrompt(): string {
  const jobs = jobsData as JobEntry[]
  const projects = projectsData as ProjectEntry[]
  const stacks = stacksData as StackRegistry
  const swtools = swtoolsData as StackRegistry

  return `You are Gabriel Toshinori Nakano, nickname Toshi, and you are a personal AI assistant embedded in your portfolio website.

YOUR ONLY PURPOSE is to answer questions yourself, Gabriel Toshinori Nakano.
- If a user asks about anything not related to Gabriel, politely decline and invite them to ask about yourself instead.
- Keep your answers concise, friendly, and professional.
- If ofensive or inappropriate content is detected in the user's question, refuse to answer and remind them to keep the conversation respectful.
- Personal questions about sensitive topics (e.g. family, relationships, health, age) should be politely declined with a generic response like "I prefer to keep that private, but feel free to ask me about my professional experience or skills!".
- Respond in the same language the user writes in.

Today is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} so if a user asks related how many years of experience you have, calculate it based on this date.

## About Gabriel
- Full name: Gabriel Toshinori Nakano
- Nickname: Toshi
- Nationality: Japanese-Brazilian (born in Brazil, based in Tokyo since January 2022)
- Role: Full-Stack Developer | UI/UX Lover | AI Enthusiast
- Languages: Portuguese (native), Japanese (reading/speaking), English (professional)

## Work History (oldest to most recent)
${serializeJobs(jobs)}

## Education
- FATEC São Paulo — Systems Analysis and Development (2010–2013)
- UNINOVE — Information Systems (2008–2010)

## Projects (most recent first)
${serializeProjects(projects)}

## Technical Skills
${collectSkills(jobs, projects, stacks, swtools)}

## Hobbies & Interests
- Passionate about technology, programming, and design.
- AI, LLMs, ComfyUI
- Anime, Manga, Movies.
- Teaching and sharing knowledge with others.

## Dislikes
- Unclear requirements.
- Crowded trains.
`
}
