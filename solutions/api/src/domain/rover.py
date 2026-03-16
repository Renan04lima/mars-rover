from typing import List, Tuple
from src.domain.enums import Direction, Command
from src.domain.position import Position
from src.domain.grid import Grid

class MarsRover:
    _DIRECTION_MAP = {
        Direction.NORTH: Position(0, -1),
        Direction.SOUTH: Position(0, 1),
        Direction.EAST: Position(1, 0),
        Direction.WEST: Position(-1, 0)
    }

    _LEFT_TURN = {
        Direction.NORTH: Direction.WEST,
        Direction.WEST: Direction.SOUTH,
        Direction.SOUTH: Direction.EAST,
        Direction.EAST: Direction.NORTH
    }

    _RIGHT_TURN = {
        Direction.NORTH: Direction.EAST,
        Direction.EAST: Direction.SOUTH,
        Direction.SOUTH: Direction.WEST,
        Direction.WEST: Direction.NORTH
    }

    def __init__(self, position: Position, orientation: Direction, grid: Grid):
        if not grid.is_within_bounds(position):
            raise ValueError("Initial rover position is out of grid bounds")
        if grid.is_obstacle(position):
            raise ValueError("Initial rover position is an obstacle")
            
        self._position = position
        self._orientation = orientation
        self._grid = grid
        self._collected_data: List[Position] = []
        self._command_map = {
            Command.FORWARD: self._move_forward,
            Command.BACKWARD: self._move_backward,
            Command.LEFT: self._turn_left,
            Command.RIGHT: self._turn_right,
            Command.COLLECT_DATA: self._collect_data
        }

    @property
    def position(self) -> Position:
        return self._position

    @property
    def orientation(self) -> Direction:
        return self._orientation

    @property
    def collected_data(self) -> List[Position]:
        return self._collected_data.copy()

    def process_commands(self, commands: List[Command]) -> None:
        """Processes a list of commands. Stops if an obstacle is encountered in move path."""
        for command in commands:
            success = self._command_map[command]()
            if not success:
                # Based on requirements, if an obstacle or boundary is hit, the rover
                # ignores the forward/backward move. It can still turn.
                pass

    def _move_forward(self) -> bool:
        delta = self._DIRECTION_MAP[self._orientation]
        new_position = self._position + delta
        return self._try_move(new_position)

    def _move_backward(self) -> bool:
        delta = self._DIRECTION_MAP[self._orientation]
        new_position = self._position - delta
        return self._try_move(new_position)

    def _turn_left(self) -> bool:
        self._orientation = self._LEFT_TURN[self._orientation]
        return True

    def _turn_right(self) -> bool:
        self._orientation = self._RIGHT_TURN[self._orientation]
        return True

    def _collect_data(self) -> bool:
        self._collected_data.append(self._position)
        return True

    def _try_move(self, new_position: Position) -> bool:
        if not self._grid.is_within_bounds(new_position):
            return False  # Hit a boundary
        if self._grid.is_obstacle(new_position):
            return False  # Hit an obstacle

        self._position = new_position
        return True
