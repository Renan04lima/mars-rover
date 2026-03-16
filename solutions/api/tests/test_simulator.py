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

def test_scenario_2():
    grid = [
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [1, 0, 1, 0]
    ]
    simulator = MarsRoverSimulator(grid, 0, 0, 'E')
    result = simulator.run('F, F, R, F, F, L, F, S')
    assert result['final_position'] == (1, 0)
    assert result['final_orientation'] == 'E'
    assert result['data_collected'] == [(1, 0)]

def test_scenario_3():
    grid = [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 1, 0, 0]
    ]
    simulator = MarsRoverSimulator(grid, 0, 0, 'E')
    result = simulator.run('F, R, F, F, L, F, F, R, F, S')
    assert result['final_position'] == (2, 3)
    assert result['final_orientation'] == 'S'
    assert result['data_collected'] == [(2, 3)]

def test_scenario_4():
    grid = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ]
    simulator = MarsRoverSimulator(grid, 2, 0, 'E')
    result = simulator.run('F, L, F, F, S')
    assert result['final_position'] == (2, 0)
    assert result['final_orientation'] == 'N'
    assert result['data_collected'] == [(2, 0)]

