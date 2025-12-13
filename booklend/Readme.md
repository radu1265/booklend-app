# Run backend and DB using Docker

1. Make sure you have Docker and Docker Compose installed on your machine.
2. Make sure you have maven installed on your machine.
3. mvn clean install
4. mvn -DskipTests package
5. docker-compose up --build
6. The backend service will be accessible at `http://localhost:8080` and the database will be running on the default PostgreSQL port `5432`.
7. you can use swagger to test the APIs: `http://localhost:8080/swagger-ui.html`
8. For book image contact me.