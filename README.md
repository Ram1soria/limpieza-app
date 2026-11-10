# Limpieza Profesional Mendoza - Cotizador & Gestion

Aplicacion web progresiva (Web App / PWA) diseñada para empresas de servicios de limpieza profesional, final de obra, mantenimiento y desinfeccion en Mendoza, Argentina.

---

## Funcionalidades Principales

- **Cotizador Rapido y Flexible:**
  - **7 Paquetes Estandar:** Limpieza Profunda, Final de Obra Liviana/Pesada, Mantenimiento Semanal, Post Mudanza, Oficinas y Vidrios.
  - **Calculo a Medida:** Formula matematica basada en personas requeridas x horas estimadas x tarifa hora-hombre ($14.500 ARS).
  - **Calculo Comercial Automatico:** Desglose automatico de seña del 50% para reserva y saldo del 50% al finalizar.
- **Exportacion y Presupuestos:**
  - **Presupuesto Formal en PDF:** Documento profesional con detalle de tareas, cliente y seña para enviar o imprimir.
  - **Folleto / Catalogo en PDF:** Descarga de catalogo comercial de los 7 servicios (con y sin precios) para clientes indecisos.
  - **Mensaje para WhatsApp:** Enlace directo a WhatsApp Web / App con formato listo para enviar al cliente.
- **Lista de Precios Interactiva:** Replica digital del tarifario oficial para consulta rapida.
- **Historial de Cotizaciones:** Almacenamiento local de presupuestos para seguimiento de prospectos.
- **Configuracion de Tarifas:** Modificacion sencilla del valor hora ante variaciones de costos.

---

## Tecnologias

- **React 19** con **TypeScript**
- **Vite** para desarrollo y compilacion ultra rapida
- **Tailwind CSS** para un diseño moderno y responsive
- **jsPDF** para generacion de documentos PDF en el navegador

---

## Ejecucion Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para produccion
npm run build
```
