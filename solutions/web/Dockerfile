FROM node:20-slim

WORKDIR /app

# Copy dependency files
COPY . ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose the frontend port
EXPOSE 3000

CMD ["npm", "run", "dev", "--host", "0.0.0.0"]

