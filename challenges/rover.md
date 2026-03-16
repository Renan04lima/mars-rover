## Challenge: Mars Rover Control System

**Context:** You are developing the software for a Mars rover that needs to navigate and avoid obstacles while collecting data from its surroundings. The rover has a set of basic commands and sensors that provide information about its immediate environment.

**Objective:** Implement a control system for the rover that allows efficient navigation through unknown terrain, avoiding obstacles and collecting data.

### Problem Description:

**Rover Model:**

- The rover can move forward (F), backward (B), turn left (L), or turn right (R).
- The rover can collect data while stationary (S).
- The rover has sensors that can detect the presence of obstacles in front of it and on the sides.

**Input:**

- The environment is represented by a 2D grid where:
  - **0** represents a free cell.
  - **1** represents an obstacle.
- The initial position of the rover is provided along with an initial orientation (north, south, east, west).
- A set of commands that the rover must follow.

**Commands:**

- **F (forward):** Moves the rover one cell in the current direction.
- **B (backward):** Moves the rover one cell in the opposite direction of the current direction.
- **L (left):** Turns the rover 90 degrees to the left.
- **R (right):** Turns the rover 90 degrees to the right.
- **S (collect data):** Collects data from the current environment.

**Constraints:**

- The rover cannot move outside the boundaries of the grid.
- The rover cannot move into cells with obstacles.
- The rover must avoid obstacles, navigating around them if possible.

**Output:**

- The final position of the rover and its orientation.
- Data collected during the mission.

### Additional Requirements:

- The solution must be containerized using Docker.
- The evaluation will take into consideration the following aspects:
  - Adherence to Object-Oriented Programming (OOP) principles.
  - Application of SOLID principles.
  - Clean code practices.
  - Implementation of unit and integration tests.
  - Proper use of Docker and Docker Compose.

## Example Outputs:

#### Scenario 1: Simple Path with No Obstacles

**Input:**

- Grid: [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ]
- Initial position: `(0, 0)`
- Initial orientation: `E` (East)
- Commands: `F, F, R, F, S`

**Output:**

- Final Position: `(2, 1)`
- Final Orientation: `S` (South)
- Data Collected: `[(2, 1)]`

#### Scenario 2: Encountering and Avoiding Obstacles

**Input:**

- Grid: [ [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0], [1, 0, 1, 0] ]
- Initial position: `(0, 0)`
- Initial orientation: `E` (East)
- Commands: `F, F, R, F, F, L, F, S`

**Output:**

- Final Position: `(1, 0)`
- Final Orientation: `E` (East)
- Data Collected: `[(1, 0)]`

#### Scenario 3: Complex Path with Multiple Obstacles

**Input:**

- Grid: [ [0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 1, 0, 0] ]
- Initial position: `(0, 0)`
- Initial orientation: `E` (East)
- Commands: `F, R, F, F, L, F, F, R, F, S`

**Output:**

- Final Position: `(2, 3)`
- Final Orientation: `S` (South)
- Data Collected: `[(2, 3)]`

#### Scenario 4: Hitting the Boundary of the Grid

**Input:**

- Grid: [ [0, 0, 0], [0, 1, 0], [0, 0, 0] ]
- Initial position: `(2, 0)`
- Initial orientation: `E` (East)
- Commands: `F, L, F, F, S`

**Output:**

- Final Position: `(2, 0)`
- Final Orientation: `N` (North)
- Data Collected: `[(2, 0)]`

