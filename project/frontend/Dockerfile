# Frontend Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose frontend port
EXPOSE 5173

CMD ["npm", "run", "dev"]
