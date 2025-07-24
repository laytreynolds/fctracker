# Start from the latest golang base image
FROM golang:1.21 as builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the Go app
RUN go build -o server .

# Start a new, minimal image
FROM gcr.io/distroless/base-debian11

WORKDIR /app

# Copy the built binary from the builder
COPY --from=builder /app/server .

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Run the binary
CMD ["./server"]
