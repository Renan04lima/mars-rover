from typing import List
from src.domain.enums import CellType
from src.domain.position import Position

class Grid:
    def __init__(self, matrix: List[List[int]]):
        if not matrix or not matrix[0]:
            raise ValueError("Grid cannot be empty")
        self._matrix = matrix
        self._height = len(matrix)
        self._width = len(matrix[0])

    @property
    def width(self) -> int:
        return self._width

    @property
    def height(self) -> int:
        return self._height

    def is_within_bounds(self, pos: Position) -> bool:
        return 0 <= pos.x < self._width and 0 <= pos.y < self._height

    def get_cell(self, pos: Position) -> CellType:
        if not self.is_within_bounds(pos):
            raise IndexError("Position out of bounds")
        value = self._matrix[pos.y][pos.x] # Notice that y is rows, x is cols based on typical 2D array representation
        return CellType(value)

    def is_obstacle(self, pos: Position) -> bool:
        if not self.is_within_bounds(pos):
            return True  # Out of bounds is treated as an obstacle
        return self.get_cell(pos) == CellType.OBSTACLE
