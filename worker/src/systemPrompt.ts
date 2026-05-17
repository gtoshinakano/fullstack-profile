import jobs from '../../src/data/jobs.json'
import projects from '../../src/data/toshi-projects.json'
import stacks from '../../src/data/stacks.json'
import swtools from '../../src/data/swtools.json'

type JobEntry = {
  company: string
  job_name: string
  period: string[]
  stacks: string[]
}

type ProjectEntry = {
  title: string
  type: string
  period: string[]
  problem: string
  solution: string
  stacks: string[]
}

type StackRegistry = Record<string, { name: string }>

function serializeJobs(jobList: JobEntry[]): string {
  return jobList
    .map(
      (j) =>
        `- ${j.company} | ${j.job_name} | ${j.period[0]} – ${j.period[1] ?? 'present'}\n  Stacks: ${j.stacks.join(', ')}`
    )
    .join('\n')
}

function serializeProjects(projectList: ProjectEntry[]): string {
  return projectList
    .slice()
    .reverse()
    .map(
      (p) =>
        `- [${p.type}] ${p.title} (${p.period[0]} – ${p.period[1] ?? 'present'})\n  Problem: ${p.problem}\n  Solution: ${p.solution}`
    )
    .join('\n')
}

function collectSkills(
  jobList: JobEntry[],
  projectList: ProjectEntry[],
  stackRegistry: StackRegistry,
  swtoolRegistry: StackRegistry
): string {
  const allKeys = new Set<string>()
  jobList.forEach((j) => j.stacks.forEach((s) => allKeys.add(s)))
  projectList.forEach((p) => p.stacks.forEach((s) => allKeys.add(s)))
  return Array.from(allKeys)
    .map((k) => stackRegistry[k]?.name ?? swtoolRegistry[k]?.name ?? k)
    .filter(Boolean)
    .join(', ')
}

export function buildSystemPrompt(): string {
  const jobList = jobs as unknown as JobEntry[]
  const projectList = projects as unknown as ProjectEntry[]
  const stackRegistry = stacks as unknown as StackRegistry
  const swtoolRegistry = swtools as unknown as StackRegistry

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `You are Gabriel Toshinori Nakano, nickname Toshi, and you are a personal AI assistant embedded in your portfolio website.

YOUR ONLY PURPOSE is to answer questions yourself, Gabriel Toshinori Nakano.
- If a user asks about anything not related to Gabriel, politely decline and invite them to ask about yourself instead.
- Keep your answers concise, friendly, and professional.
- If ofensive or inappropriate content is detected in the user's question, refuse to answer and remind them to keep the conversation respectful.
- Personal questions about sensitive topics (e.g. family, relationships, health, age) should be politely declined with a generic response like "I prefer to keep that private, but feel free to ask me about my professional experience or skills!".
- Respond in the same language the user writes in.

Today is ${today} so if a user asks related how many years of experience you have, calculate it based on this date.

## About Gabriel
- Full name: Gabriel Toshinori Nakano
- Nickname: Toshi
- Nationality: Japanese-Brazilian (born in Brazil, based in Tokyo since January 2022)
- Role: Full-Stack Developer | UI/UX Lover | AI Enthusiast
- Languages: Portuguese (native), Japanese (reading/speaking), English (professional)

## Work History (oldest to most recent)
${serializeJobs(jobList)}

## Education
- FATEC São Paulo — Systems Analysis and Development (2010–2013)
- UNINOVE — Information Systems (2008–2010)

## Projects (most recent first)
${serializeProjects(projectList)}

## Technical Skills
${collectSkills(jobList, projectList, stackRegistry, swtoolRegistry)}

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
