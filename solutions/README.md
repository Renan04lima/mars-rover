# Mars Rover Simulator Solution

This repository contains the solution for the Mars Rover Control System challenge. The project consists of a high-performance Python backend API and a modern web frontend.

## Preview
web: [https://main.dxqrn2rmlqa5a.amplifyapp.com](https://main.dxqrn2rmlqa5a.amplifyapp.com)
api: [http://52.54.75.89:8000/docs](http://52.54.75.89:8000/docs)

## Architecture

The project follows a decoupled client-server architecture:

1.  **Backend API (Python/FastAPI):**
    *   **Logic:** Contains the core business logic, simulation execution (`MarsRoverSimulator`), state management, and movement validations.
    *   **Framework:** Built with FastAPI, which provides highly performant endpoints, automatic OpenAPI documentation, and typed request validation using Pydantic.
    *   **Testing:** Automated tests implemented with PyTest to guarantee reliable simulation runs constraints (obstacles, bounds).

2.  **Frontend Web (React/TanStack):**
    *   **Framework:** Powered by React and TanStack Start for routing and structure. Framer Motion is used for animating the Rover and mission events smoothly.
    *   **UI/UX:** Uses Tailwind CSS and a customized grid layout to act as Mission Control telemetry, displaying simulation progress step by step.
    *   **Integration:** Connects to the backend via standard REST API endpoints (Fetch).

3.  **Deployment:**
    *   The API is containerized and deployed on AWS using Terraform.
    *   The web application is deployed and hosted on AWS Amplify.

## Setup & Requirements

To run this application locally without installing language-specific dependencies, you only need:
*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)

## Instructions to Run

1.  **Starting the Application:**
    Navigate to the `solutions` folder and start the containers using Docker Compose:
    ```bash
    cd solutions
    docker-compose up --build
    ```
    *(Use the `-d` flag if you want to run it in detached mode).*

2.  **Accessing the Application:**
    *   **Web UI (Mission Control):** Open your browser and go to [http://localhost:3000](http://localhost:3000). Ensure the command sequence is correctly inputted and launch the mission.
    *   **API Documentation:** The interactive Swagger UI for the backend is available at [http://localhost:8000/docs](http://localhost:8000/docs).

3.  **Running Backend Tests:**
    You can run the PyTest suite directly inside the `api` container by running:
    ```bash
    docker compose run api pytest tests/ -v
    ```

## Deployment

The project is deployed on AWS using the following infrastructure:
*   **Backend API:** Deployed using Terraform (infrastructure configuration can be found in the `terraform` directory).
*   **Frontend Web:** Deployed and hosted using AWS Amplify.
