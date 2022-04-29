# API REST Aviación
---
API REST para un sistema de una compañia de aviación.

---
## Iniciar proyecto
Para una fácil distribución de la API, se utilizó un contenedor de docker, así que será necesario su [instalación](http://https://www.docker.com/get-started/ "instalación") y la instalación de [docker compose](https://docs.docker.com/compose/install/ "docker compose"); 20.10.14 es la versión de docker sobre las que se crearon las imagenes. 

Seguido de eso, se moverá al directorio del repositorio y ejecutará el comando para construir la imagen de su interés: 

Para desarrollo:

`docker build -t av-dev -f docker-images/dev.Dockerfile .`

Para producción:

`docker build -t av-prod -f docker-images/prod.Dockerfile .`

#### Producción
Ahora, si decidió iniciar el proyecto en modo producción, sólo deberá agregar su archivo enviroment `.env` como en el ejemplo del repositorio `.env-example` sin tocar la variable `MONGO_URL`. Si desea desactivar el seeder iguale la variable `SEEDER` a 0. 

Despues ejecutar:

`docker-compose --env-file .env up`

#### Desarrollo
Suponiendo que desea iniciar el entorno en desarrollo, también deberá agregar un archivo `.env` como en el apartado de producción se indica, sin embargo, para este caso añadirá un archivo `docker-compose.override.yml` con el siguiente contenido:

```yaml
services:
    app:
        image: av-dev
        volumes:
            - .:/usr/src
```
E igualmente ejecutar:

`docker-compose --env-file .env up`

Y listo, ahora tiene la aplicación  en su maquina en el puerto que configuró.

---

## Documentación
La documentación de la API REST puede ser consultada desde el mismo proyecto en la ruta:
`/api-docs/`
