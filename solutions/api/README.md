# Mars Rover Solution

This solution is designed using Object-Oriented Programming (OOP) and SOLID principles in Python.

### Features
- Type checking with standard annotations.
- Clean separation of Domain and Application logic.
- Containerized testing environment with Docker and `docker-compose`.

### Running the API and Tests

To run the REST API server and the test suite using Docker Compose, simply run:

```bash
docker-compose up --build
```

The FastAPI application will be accessible at:
- Swagger UI (Documentation): [http://localhost:8000/docs](http://localhost:8000/docs)
- API endpoint: `POST http://localhost:8000/simulate`

### Approach
The commands represent the target trajectory. A rudimentary pathfinding mechanism or obstacle avoidance would dynamically adapt to obstacles without crashing the rover. The baseline implementation handles basic collision stops and parsing.
