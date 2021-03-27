### STEP 1: Build ###
FROM honsq90/node-10.18.0-awscli AS compile-image
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build


### STEP 2: Run web server ###
FROM nginx
RUN apt update && apt install -y curl
COPY --from=compile-image /usr/src/app/dist/angular-monitor-iot /usr/share/nginx/html
RUN ls -la /usr/share/nginx/html

### Despues de descargar ejecutar estos dos comandos
# docker build -t vlondonoo/integracion:angular-monitor-iot .
#docker run -d -p 80:80 vlondonoo/integracion:angular-monitor-iot
