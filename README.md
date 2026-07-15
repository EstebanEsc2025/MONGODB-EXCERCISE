# MONGODB-EXCERCISE

Backend simple con Express y Mongoose para consumir datos de usuarios.

## Ejecutar

```bash
npm start
```

## Endpoints

- GET /usuarios: lista todos los usuarios.
- POST /usuarios: crea un nuevo usuario.
- PATCH /api/v1/actualizar-estado/:id: actualiza el campo estado de un usuario.

Ejemplo de cuerpo para POST:

```json
{
  "nombre": "María",
  "apellido": "Torres",
  "edad": 27,
  "email": "maria@example.com",
  "password": "123456",
  "perfil": {
    "ciudad": "Bogotá"
  },
  "hobbies": [
    {
      "nombre": "Correr",
      "frecuencia": "Semanal"
    }
  ]
}
```
