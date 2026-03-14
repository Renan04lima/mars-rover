export type Direction = 'N' | 'E' | 'S' | 'W';
export type Command = 'F' | 'B' | 'L' | 'R' | 'S';
export type Position = [number, number]; // [x, y]

export interface SimulationRequest {
  grid: number[][];
  initial_position: Position;
  initial_orientation: Direction;
  commands: string;
}

export interface SimulationResponse {
  final_position: Position;
  final_orientation: Direction;
  data_collected: Position[];
}
