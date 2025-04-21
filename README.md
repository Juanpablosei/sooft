# API Documentation

Aplicacion en arquitectura hexagonal 

## Rutas de la API

## Configuración del archivo `.env`
El archivo `.env` debe incluir las siguientes variables de entorno:

```dotenv
PORT=3000
MONGODB_URI='mongodb+srv://root-user:gcfkCb490BWDGGXe@cluster0.4c1x2.mongodb.net/libreria'
```

Estas variables configuran el puerto en el que corre la aplicación y la conexión a la base de datos MongoDB.

---
### 1. Crear una compañía
**Endpoint:**
```
POST localhost:3000/api/companies/create
```

**Descripción:**
Crea una nueva compañía en el sistema.

**Cuerpo de la solicitud (JSON):**
```json
{
  "cuit": "string",          // CUIT de la compañía xx-12345678-x
  "businessName": "string"  // Nombre de la compañía
}
```

---

### 2. Obtener compañías registradas el último mes
**Endpoint:**
```
GET localhost:3000/api/companies/last-month
```

**Descripción:**
Obtiene todas las compañías que se registraron en el último mes.

---

### 3. Crear una transferencia
**Endpoint:**
```
POST localhost:3000/api/transfers/create
```

**Descripción:**
Crea un nuevo depósito o transferencia en el sistema.

**Cuerpo de la solicitud (JSON):**
```json
{
  "amount": "number",         // Cantidad transferida
  "companyId": "string",      // CUIT válido de una compañía
  "creditAccount": "string",  // Cuenta de destino
  "debitAccount": "string"    // Cuenta de origen
}
```

---

### 4. Obtener transferencias realizadas el último mes
**Endpoint:**
```
GET localhost:3000/api/transfers/last-month
```

**Descripción:**
Obtiene todas las compañías que realizaron transferencias  el último mes.

---


