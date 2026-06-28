# Deployment

Where the project runs and how it ships: CI/CD, environments, and release.

## Pipeline

- Built as a Docker image.

## Environments

- Containerized environment running Nginx to serve the static output (`dist/`).
- Configuration: `Dockerfile` and `nginx.conf` at the project root.

## Release

- Build image: `docker build -t portfolio .`
- Run container: `docker run -p 80:80 portfolio`

## Monitoring

- Nginx standard access and error logs.
