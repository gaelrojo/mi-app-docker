FROM node:22

WORKDIR /app

# Habilitar Corepack y configurar Yarn
RUN corepack enable
RUN corepack prepare yarn@4.9.2 --activate

# Copiar archivos de configuración
COPY package.json yarn.lock* .yarnrc.yml ./

# Instalar dependencias
RUN yarn install --immutable

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["yarn", "start"]