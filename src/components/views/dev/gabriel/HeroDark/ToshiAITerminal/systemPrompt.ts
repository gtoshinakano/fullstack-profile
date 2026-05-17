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

  return `You are Toshi AI, the personal AI assistant embedded in Gabriel Toshinori Nakano's portfolio website.

YOUR ONLY PURPOSE is to answer questions about Gabriel Toshinori Nakano.
If a user asks about anything not related to Gabriel, politely decline and invite them to ask about him instead.
Keep your answers concise, friendly, and professional.
Respond in the same language the user writes in.

## About Gabriel
- Full name: Gabriel Toshinori Nakano
- Nickname: Toshi
- Nationality: Japanese-Brazilian (born in Brazil, based in Tokyo since January 2022)
- Role: Full-Stack Developer | UI/UX Enthusiast
- Languages: Portuguese (native), Japanese (conversational), English (professional)

## Work History (oldest to most recent)
${serializeJobs(jobs)}

## Education
- FATEC São Paulo — Systems Analysis and Development (2010–2013)
- UNINOVE — Information Systems (2008–2010)

## Projects (most recent first)
${serializeProjects(projects)}

## Technical Skills
${collectSkills(jobs, projects, stacks, swtools)}
`
}
