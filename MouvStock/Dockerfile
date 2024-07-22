# Utiliser l'image de base Node.js
FROM node:latest

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier le reste de l'application dans le conteneur
COPY . .

# Définir la variable d'environnement DATABASE_URL
ENV DATABASE_URL=mysql://root:password@db:3306/mouvstockdb

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port sur lequel l'application Next.js va fonctionner
EXPOSE 3000

# Commande par défaut pour démarrer l'application
CMD ["npm", "run", "dev"]
