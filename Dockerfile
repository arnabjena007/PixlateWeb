# Stage 1: Build the Go binary
FROM golang:1.21-alpine AS go-builder
RUN apk add --no-cache git
WORKDIR /go-src
RUN git clone https://github.com/arnabjena007/Pixlate.git .
RUN go build -o /pix ./cmd/pix

# Stage 2: Build the Next.js app
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy Next.js artifacts
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy the Go binary to the root directory where the API route expects it
COPY --from=go-builder /pix ./pix
RUN chmod +x ./pix

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]
