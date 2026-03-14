import { createFileRoute } from '@tanstack/react-router'
import { RoverSimulation } from '../components/RoverSimulation'

export const Route = createFileRoute('/')({
  component: RoverSimulation,
})
