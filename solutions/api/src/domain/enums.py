from enum import Enum

class Direction(Enum):
    NORTH = 'N'
    EAST = 'E'
    SOUTH = 'S'
    WEST = 'W'

class Command(Enum):
    FORWARD = 'F'
    BACKWARD = 'B'
    LEFT = 'L'
    RIGHT = 'R'
    COLLECT_DATA = 'S'

class CellType(Enum):
    EMPTY = 0
    OBSTACLE = 1
