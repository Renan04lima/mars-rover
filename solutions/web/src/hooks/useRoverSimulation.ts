import { useState, useCallback } from 'react';
import { type Direction, type Position, type Command, type SimulationResponse } from '../types/rover';
import { simulateMission } from '../services/api';

const DIRECTIONS: Record<Direction, Position> = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0]
};

const ROTATE_LEFT: Record<Direction, Direction> = { N: 'W', W: 'S', S: 'E', E: 'N' };
const ROTATE_RIGHT: Record<Direction, Direction> = { N: 'E', E: 'S', S: 'W', W: 'N' };

export const useRoverSimulation = () => {
  const [grid, setGrid] = useState<number[][]>([
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [1, 0, 1, 0]
  ]);
  
  const initialPosition: Position = [0, 0];
  const initialOrientation: Direction = 'E';

  const [position, setPosition] = useState<Position>(initialPosition);
  const [orientation, setOrientation] = useState<Direction>(initialOrientation);
  const [commandsStr, setCommandsStr] = useState<string>('F, F, R, F, F, L, F, S');
  const [isPlaying, setIsPlaying] = useState(false);
  const [collectedData, setCollectedData] = useState<Position[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState<number>(-1);
  const [apiResult, setApiResult] = useState<SimulationResponse | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);

  const reset = () => {
    setPosition(initialPosition);
    setOrientation(initialOrientation);
    setCollectedData([]);
    setCurrentCommandIndex(-1);
    setApiResult(null);
    setIsCollecting(false);
  };

  const runSimulation = useCallback(async () => {
    if (isPlaying) return;
    
    reset();
    setIsPlaying(true);

    try {
      const result = await simulateMission({
        grid,
        initial_position: initialPosition,
        initial_orientation: initialOrientation,
        commands: commandsStr
      });
      setApiResult(result);
    } catch (e) {
      console.error("Backend error:", e);
    }

    const commands = commandsStr.split(',').map(c => c.trim().toUpperCase() as Command);

    let currPos: Position = initialPosition;
    let currOri: Direction = initialOrientation;

    for (let i = 0; i < commands.length; i++) {
      setCurrentCommandIndex(i);
      const cmd = commands[i];

      await new Promise(r => setTimeout(r, 600)); // Animation delay

      if (cmd === 'L') {
        currOri = ROTATE_LEFT[currOri];
        setOrientation(currOri);
      } else if (cmd === 'R') {
        currOri = ROTATE_RIGHT[currOri];
        setOrientation(currOri);
      } else if (cmd === 'F' || cmd === 'B') {
         const moveMultiplier = cmd === 'F' ? 1 : -1;
         const dx = DIRECTIONS[currOri][0] * moveMultiplier;
         const dy = DIRECTIONS[currOri][1] * moveMultiplier;
         const nx = currPos[0] + dx;
         const ny = currPos[1] + dy;
         
         // Validation: within bounds and not an obstacle
         if (nx >= 0 && ny >= 0 && nx < grid[0].length && ny < grid.length && grid[ny][nx] !== 1) {
            currPos = [nx, ny];
            setPosition(currPos);
         }
      } else if (cmd === 'S') {
         setIsCollecting(true);
         setCollectedData(prev => [...prev, currPos]);
         await new Promise(r => setTimeout(r, 400)); // Show collection animation
         setIsCollecting(false);
      }
    }
    
    setCurrentCommandIndex(-1);
    setIsPlaying(false);
  }, [grid, commandsStr, isPlaying]);

  return {
    grid, setGrid,
    position, setPosition,
    orientation, setOrientation,
    isPlaying,
    collectedData,
    commandsStr, setCommandsStr,
    runSimulation,
    reset,
    currentCommandIndex,
    apiResult,
    isCollecting
  };
};
