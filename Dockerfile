FROM node:22

WORKDIR /app

# Habilitar Corepack
RUN corepack enable
RUN corepack prepare yarn@stable --activate

# Copiar archivos de configuración
COPY package.json yarn.lock ./
COPY .yarnrc.yml ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["yarn", "start"]