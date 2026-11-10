# 🧹 Limpieza Profesional Mendoza - Cotizador & Gestión

Aplicación web progresiva (Web App / PWA) diseñada para empresas de servicios de limpieza profesional, final de obra, mantenimiento y desinfección en Mendoza, Argentina.

---

## 🚀 Funcionalidades Principales

- **Cotizador Rápido y Flexible:**
  - **7 Paquetes Estándar:** Limpieza Profunda, Final de Obra Liviana/Pesada, Mantenimiento Semanal, Post Mudanza, Oficinas y Vidrios.
  - **Cálculo a Medida:** Fórmula matemática basada en personas requeridas $\times$ horas estimadas $\times$ tarifa hora-hombre ($14.500 ARS).
  - **Adicionales Inteligentes:**
    - Urgencias para el día siguiente (+20%).
    - Inmuebles sin suministro de agua/luz (+$40.000 ARS).
    - Regla de piso mínimo para Limpieza Profunda ($130.000 ARS).
  - **Cálculo Comercial Automático:** Seña del 50% para reserva y saldo del 50% al finalizar.
- **Exportación con 1 Clic:**
  - 💬 **Mensaje con formato para WhatsApp:** Listo para copiar y pegar con emojis, términos y detalle claro.
  - 📄 **Descarga de Presupuesto en PDF:** Documento formal con membrete profesional para enviar al cliente.
- **Lista de Precios Interactiva:** Réplica digital del tarifario oficial para consulta rápida del personal.
- **Historial de Cotizaciones:** Almacenamiento local de presupuestos para seguimiento de prospectos.
- **Configuración de Tarifas:** Modificación sencilla del valor hora ante variaciones de costos.

---

## 🛠️ Tecnologías

- **React 19** con **TypeScript**
- **Vite** para desarrollo ultra rápido
- **Tailwind CSS** para un diseño moderno y responsive (PC y celular)
- **Lucide Icons**
- **jsPDF** para generación de presupuestos en PDF del lado del cliente

---

## 💻 Cómo ejecutar en local

```bash
# 1. Instalar dependencias (si es la primera vez)
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 🌐 Cómo subir a tu GitHub

1. Crea un repositorio nuevo y vacío en tu [GitHub](https://github.com/new) (ej: `limpieza-mendoza-app`).
2. En la terminal de esta carpeta, corre:

```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```
