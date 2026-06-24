# 📋 Manual de Usuario — Sistema POS

**Versión:** 1.0  
**Fecha:** Junio 2026  
**Soporte:** sistema-pos-orpin.vercel.app

---

## 📌 Índice

1. [Acceso al sistema](#1-acceso-al-sistema)
2. [Dashboard principal](#2-dashboard-principal)
3. [Inventario de productos](#3-inventario-de-productos)
4. [Pantalla de ventas](#4-pantalla-de-ventas)
5. [Historial de ventas](#5-historial-de-ventas)
6. [Reportes y estadísticas](#6-reportes-y-estadísticas)
7. [Gestión de usuarios](#7-gestión-de-usuarios)
8. [Preguntas frecuentes](#8-preguntas-frecuentes)

---

## 1. Acceso al sistema

### ¿Cómo entrar?
1. Abre tu navegador (Chrome, Edge o Firefox)
2. Ve a: **sistema-pos-orpin.vercel.app**
3. Escribe tu correo y contraseña
4. Haz clic en **Iniciar sesión**

### Tipos de usuario
| Rol | Acceso |
|---|---|
| **Administrador** | Acceso completo a todos los módulos |
| **Cajero** | Solo puede hacer ventas, ver inventario y reportes |

> ⚠️ Si olvidaste tu contraseña, contacta al administrador del sistema.

---

## 2. Dashboard principal

Al iniciar sesión verás el panel principal con:

- **Total de ventas** — cuántas ventas se han procesado
- **Ingresos totales** — dinero generado en todas las ventas
- **Productos activos** — cuántos productos tienes en el sistema
- **Stock bajo** — productos que necesitan reabastecimiento

### Módulos disponibles
- 📦 **Inventario** — gestiona tus productos
- 🛒 **Ventas** — procesa ventas
- 📊 **Reportes** — estadísticas del negocio
- 👥 **Usuarios** — (solo admin) gestiona el equipo

### Modo oscuro / claro
Haz clic en el ícono 🌙/☀️ en la barra superior para cambiar el tema visual.

---

## 3. Inventario de productos

### Ver productos
Al entrar al módulo verás una tabla con todos los productos activos, su precio, stock y categoría.

### Agregar un producto
1. Haz clic en **+ Nuevo producto**
2. Completa los campos:
   - **Nombre** — nombre del producto (ej: Coca-Cola 355ml)
   - **Categoría** — grupo al que pertenece (ej: Bebidas)
   - **Precio** — precio de venta en RD$
   - **Stock** — cantidad disponible
3. Haz clic en **Crear producto**

### Editar un producto
1. Busca el producto en la tabla
2. Haz clic en **Editar**
3. Modifica los datos que necesites
4. Haz clic en **Guardar cambios**

### Eliminar un producto
1. Haz clic en **Eliminar** en la fila del producto
2. Confirma la acción
> El producto no se borra permanentemente, solo se desactiva.

### Alertas de stock
- 🟠 **Stock bajo** — menos de 10 unidades
- 🔴 **Crítico** — menos de 5 unidades
- 🚫 **Sin stock** — 0 unidades (no aparece en ventas)

---

## 4. Pantalla de ventas

Esta es la pantalla principal del cajero.

### Procesar una venta
1. Busca el producto escribiendo su nombre en el buscador
2. O filtra por categoría usando los botones de colores
3. Haz clic en el producto para agregarlo al carrito
4. Ajusta la cantidad con los botones **+** y **−**
5. Para quitar un producto del carrito haz clic en **✕**

### Calcular el cambio
1. En el campo **💵 Monto recibido** escribe cuánto te dio el cliente
2. El sistema calculará automáticamente el **cambio a devolver**
3. Si el monto es insuficiente verás una advertencia en rojo

### Completar la venta
1. Haz clic en **💳 Procesar venta**
2. Aparecerá el ticket de venta con el resumen
3. Puedes **imprimir** el ticket o simplemente **cerrar**

### Ticket de venta
El ticket incluye:
- Nombre del negocio
- Fecha y hora
- Lista de productos comprados
- Total, monto recibido y cambio
- Número de ticket

---

## 5. Historial de ventas

Aquí puedes ver todas las ventas realizadas.

### Ver el historial
1. Desde el dashboard haz clic en **Historial**
2. Verás la lista de ventas ordenadas de más reciente a más antigua

### Filtrar por fecha
1. Haz clic en el campo de fecha
2. Selecciona el día que quieres consultar
3. La lista se actualizará automáticamente
4. Para ver todas las ventas haz clic en **Limpiar**

### Ver detalle de una venta
Haz clic en cualquier venta para expandirla y ver:
- Productos vendidos
- Cantidad y precio unitario
- Subtotal por producto
- Total de la venta

---

## 6. Reportes y estadísticas

### Resumen general
En la parte superior verás 4 tarjetas con:
- Total de ventas realizadas
- Ingresos totales en RD$
- Productos activos
- Productos con stock bajo

### Gráfica de ingresos por día
Muestra cuánto dinero se generó cada día. Útil para identificar los días de mayor venta.

### Productos más vendidos
Gráfica de barras con los 5 productos que más unidades se han vendido.

### Alertas de stock bajo
Tabla con todos los productos que tienen 10 unidades o menos, con su estado actual.

### Exportar PDF
1. Haz clic en **📄 Exportar PDF**
2. Se descargará automáticamente un archivo con:
   - Resumen general
   - Productos más vendidos
   - Ingresos por día
   - Productos con stock bajo

---

## 7. Gestión de usuarios

> ⚠️ Este módulo solo está disponible para **Administradores**.

### Ver usuarios
Lista de todos los usuarios activos con su nombre, correo, rol y fecha de creación.

### Crear un usuario
1. Haz clic en **+ Nuevo usuario**
2. Completa los campos:
   - **Nombre** — nombre completo
   - **Email** — correo electrónico (será el usuario para entrar)
   - **Contraseña** — mínimo 6 caracteres
   - **Rol** — Cajero o Administrador
3. Haz clic en **Crear usuario**

### Editar un usuario
1. Haz clic en **Editar** en la fila del usuario
2. Puedes cambiar nombre, email, rol o contraseña
3. Si no quieres cambiar la contraseña, deja ese campo vacío
4. Haz clic en **Guardar cambios**

### Desactivar un usuario
1. Haz clic en **Eliminar**
2. Confirma la acción
> El usuario no podrá iniciar sesión, pero sus ventas quedan registradas.

> ⚠️ No puedes eliminarte a ti mismo.

---

## 8. Preguntas frecuentes

**¿El sistema funciona sin internet?**
No, el sistema requiere conexión a internet para funcionar ya que la base de datos está en la nube.

**¿Puedo usar el sistema desde el celular?**
Sí, el sistema es compatible con navegadores móviles.

**¿Qué pasa si cierro el navegador?**
Tu sesión se mantiene activa. Al volver a entrar, el sistema te llevará directamente al dashboard.

**¿Cada cuánto se actualiza el stock?**
El stock se actualiza en tiempo real con cada venta procesada.

**¿Puedo recuperar una venta cancelada?**
Una vez procesada, la venta queda registrada en el historial y no puede eliminarse.

**¿Hay un límite de productos?**
No hay límite de productos en el sistema.

**¿Cómo cambio mi contraseña?**
Actualmente el administrador puede cambiar tu contraseña desde el módulo de usuarios.

---

## 📞 Soporte técnico

Para reportar problemas o solicitar ayuda contacta al administrador del sistema.

---

*Sistema POS — Desarrollado por Walny Miguel Carreras Valencia*