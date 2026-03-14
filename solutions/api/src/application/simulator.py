from typing import List, Tuple
from src.domain.enums import Command, Direction
from src.domain.grid import Grid
from src.domain.position import Position
from src.domain.rover import MarsRover

class MarsRoverSimulator:
    def __init__(self, grid_matrix: List[List[int]], initial_x: int, initial_y: int, initial_dir: str):
        self.grid = Grid(grid_matrix)
        self.initial_pos = Position(initial_x, initial_y)
        self.initial_dir = Direction(initial_dir)
        self.rover = MarsRover(self.initial_pos, self.initial_dir, self.grid)

    def run(self, command_str: str) -> dict:
        """Runs the simulation based on a comma-separated command string."""
        commands = self._parse_commands(command_str)
        self.rover.process_commands(commands)
        
        return {
            "final_position": (self.rover.position.x, self.rover.position.y),
            "final_orientation": self.rover.orientation.value,
            "data_collected": [(pos.x, pos.y) for pos in self.rover.collected_data]
        }

    def _parse_commands(self, command_str: str) -> List[Command]:
        parts = [part.strip().upper() for part in command_str.split(',') if part.strip()]
        return [Command(c) for c in parts]
