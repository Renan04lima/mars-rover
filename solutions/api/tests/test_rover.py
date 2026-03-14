import pytest
from src.domain.enums import Direction, Command
from src.domain.position import Position
from src.domain.grid import Grid
from src.domain.rover import MarsRover

def test_position_addition():
    p1 = Position(1, 1)
    p2 = Position(2, -1)
    p3 = p1 + p2
    assert p3.x == 3
    assert p3.y == 0

def test_grid_initialization():
    grid = Grid([[0, 1], [1, 0]])
    assert grid.width == 2
    assert grid.height == 2

def test_grid_out_of_bounds():
    grid = Grid([[0, 1], [1, 0]])
    assert grid.is_within_bounds(Position(0, 0))
    assert not grid.is_within_bounds(Position(2, 0))

def test_rover_initialization_fails_on_obstacle():
    grid = Grid([[0, 1], [1, 0]])
    with pytest.raises(ValueError):
        MarsRover(Position(1, 0), Direction.EAST, grid)

def test_rover_moves_forward():
    grid = Grid([[0, 0, 0], [0, 0, 0]])
    rover = MarsRover(Position(0, 0), Direction.EAST, grid)
    rover.process_commands([Command.FORWARD])
    assert rover.position == Position(1, 0)
    
def test_rover_turns_left():
    grid = Grid([[0, 0, 0], [0, 0, 0]])
    rover = MarsRover(Position(0, 0), Direction.NORTH, grid)
    rover.process_commands([Command.LEFT])
    assert rover.orientation == Direction.WEST

def test_rover_collects_data():
    grid = Grid([[0, 0, 0], [0, 0, 0]])
    rover = MarsRover(Position(0, 0), Direction.EAST, grid)
    rover.process_commands([Command.FORWARD, Command.COLLECT_DATA])
    assert rover.collected_data == [Position(1, 0)]

def test_rover_stops_at_obstacle():
    grid = Grid([[0, 1, 0]])
    rover = MarsRover(Position(0, 0), Direction.EAST, grid)
    rover.process_commands([Command.FORWARD, Command.FORWARD]) # second try to move into 1,0 ignores it
    assert rover.position == Position(0, 0) # first forward hits obstacle, doesn't move

def test_rover_stops_at_boundary():
    grid = Grid([[0, 0]])
    rover = MarsRover(Position(1, 0), Direction.EAST, grid)
    rover.process_commands([Command.FORWARD])
    assert rover.position == Position(1, 0)

