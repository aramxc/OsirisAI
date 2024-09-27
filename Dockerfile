# Start with a base image that includes Go
FROM golang:1.21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files from app/api
COPY app/api/go.mod app/api/go.sum ./

# Download the Go module dependencies
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Set the working directory to app/api
WORKDIR /app/app/api

# Build the Go application
RUN go build -o main .

# Move back to the root directory
WORKDIR /app

# Expose the port specified in your fly.toml
EXPOSE 8080

# Run the compiled binary
CMD ["./app/api/main"]