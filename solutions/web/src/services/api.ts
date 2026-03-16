import { type SimulationRequest, type SimulationResponse } from '../types/rover'

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const simulateMission = async (payload: SimulationRequest): Promise<SimulationResponse> => {
  const response = await fetch(`${VITE_API_URL}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Simulation failed');
  }

  return response.json();
};
