from src.application.simulator import MarsRoverSimulator
import pytest

def test_scenario_1():
    grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
    simulator = MarsRoverSimulator(grid, 0, 0, 'E')
    result = simulator.run('F, F, R, F, S')
    assert result['final_position'] == (2, 1)
    assert result['final_orientation'] == 'S'
    assert result['data_collected'] == [(2, 1)]

