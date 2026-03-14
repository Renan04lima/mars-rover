from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Tuple

from src.application.simulator import MarsRoverSimulator

app = FastAPI(
    title="Mars Rover Simulator API",
    description="An API to control and simulate the Mars Rover navigation."
)

origins = ["*"] # Use specific origins in production

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # Allows specified origins
    allow_credentials=True,        # Allows cookies/credentials
    allow_methods=["*"],           # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],           # Allows all headers
)

class SimulationRequest(BaseModel):
    grid: List[List[int]] = Field(..., description="2D grid representing the terrain (0 for empty, 1 for obstacle)")
    initial_position: Tuple[int, int] = Field(..., description="Initial X and Y coordinates (e.g. [0, 0])")
    initial_orientation: str = Field(..., description="Initial orientation: N, S, E, or W")
    commands: str = Field(..., description="Comma-separated commands list: F, B, L, R, S")

class SimulationResponse(BaseModel):
    final_position: Tuple[int, int]
    final_orientation: str
    data_collected: List[Tuple[int, int]]

@app.post("/simulate", response_model=SimulationResponse)
def simulate_rover(request: SimulationRequest):
    try:
        simulator = MarsRoverSimulator(
            grid_matrix=request.grid,
            initial_x=request.initial_position[0],
            initial_y=request.initial_position[1],
            initial_dir=request.initial_orientation
        )
        return simulator.run(request.commands)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error: " + str(e))
