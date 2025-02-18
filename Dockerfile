FROM node:22-alpine

WORKDIR /usr/src/app

# Install dependencies for Prisma and seeding
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client and run migrations/seeding
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run seed

RUN npm run build

EXPOSE 4000
CMD ["npm", "run", "start:prod"]