import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

const jobs = defineCollection({
  name: 'jobs',
  directory: 'content/jobs',
  include: '**/*.md',
  schema: z.object({
    jobTitle: z.string(),
    summary: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    company: z.string(),
    location: z.string(),
    tags: z.array(z.string()),
    content: z.string(),
  }),
})

const education = defineCollection({
  name: 'education',
  directory: 'content/education',
  include: '**/*.md',
  schema: z.object({
    school: z.string(),
    summary: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    tags: z.array(z.string()),
    content: z.string(),
  }),
})

export const allJobs = [
  {
    jobTitle: 'Senior Frontend Engineer',
    summary: 'Led the frontend team in developing the main web application.',
    startDate: '2021-01',
    endDate: '2023-12',
    company: 'Tech Corp',
    location: 'Remote',
    tags: ['React', 'TypeScript', 'Tailwind CSS'],
    content: 'Developed and maintained various features using React and TypeScript.',
  },
  {
    jobTitle: 'Frontend Developer',
    summary: 'Developed user interfaces for web applications.',
    startDate: '2018-05',
    endDate: '2020-12',
    company: 'Web Solutions Inc',
    location: 'New York, NY',
    tags: ['JavaScript', 'React', 'CSS'],
    content: 'Collaborated with designers to implement pixel-perfect UIs.',
  },
];

export const allEducations = [
  {
    school: 'University of Technology',
    summary: 'Bachelor of Science in Computer Science',
    startDate: '2014-09',
    endDate: '2018-05',
    tags: ['Algorithms', 'Data Structures', 'Web Development'],
    content: 'Graduated with honors. Participated in various hackathons.',
  },
];

export default defineConfig({
  collections: [jobs, education],
})
