<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

#Ejecutar en desarrollo

1. Clonar el repositorio.

2. Ejecutar
```
  yarn install
```

3. Tener Nest CLI instalando
```
  npm install -g @nestjs/c
```

4. Levantar la base de datos
```
  docker-compose up -d
```

5. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

6. Llenar las variables de entornos definidas en el __.env__

7. Para correr el proyecto
```
  yarn start:dev
```

8. Reconstruir la base de datos con la semilla
```
  localhost:3000/api/v2/seed
```

##Stack utilizado
*MongoDB
*Nest
