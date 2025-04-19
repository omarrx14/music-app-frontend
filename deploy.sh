#!/bin/bash

# Variables
DOCKER_USERNAME="omarrx14"
IMAGE_NAME="music-app-frontend"
VERSION="1.0.0"

# Construir la imagen
echo "Construyendo la imagen..."
docker-compose build

# Etiquetar la imagen
echo "Etiquetando la imagen..."
docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:latest ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}

# Subir la imagen a Docker Hub
echo "Subiendo la imagen a Docker Hub..."
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}

echo "¡Despliegue completado!" 