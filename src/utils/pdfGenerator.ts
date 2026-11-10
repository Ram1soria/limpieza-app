import jsPDF from 'jspdf';
import type { QuoteFormState, QuoteCalculation } from '../types';
import { SERVICE_PACKAGES, GENERAL_CONDITIONS } from '../data/packages';
import { formatCurrency } from './formatters';

export function generateQuotePDF(form: QuoteFormState, calc: QuoteCalculation) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pkg = form.serviceType === 'package' 
    ? SERVICE_PACKAGES.find(p => p.id === form.packageId) 
    : null;
  const serviceName = pkg ? pkg.name : (form.customTitle || 'Servicio de Limpieza Profesional');

  // Header Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, 'F');

  // Brand / Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('LIMPIEZA PROFESIONAL', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Mendoza, Argentina  •  Servicios Integrales y Finales de Obra', 14, 25);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}  •  Validez: 7 días corridos`, 14, 31);

  // Quote Badge in top right
  doc.setFillColor(13, 148, 136); // teal-600
  doc.roundedRect(140, 12, 56, 16, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PRESUPUESTO FORMAL', 144, 20);
  doc.setFontSize(8);
  doc.text(`REF: #COT-${Date.now().toString().slice(-5)}`, 144, 25);

  // Client Details Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL CLIENTE', 14, 52);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 54, 196, 54);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Cliente:`, 14, 62);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${form.clientName || 'Consumidor Final'}`, 35, 62);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Teléfono:`, 14, 69);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${form.clientPhone || 'No especificado'}`, 35, 69);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Ubicación:`, 105, 62);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${form.clientAddress || 'Mendoza'}`, 128, 62);

  // Service Breakdown Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('DETALLE DEL SERVICIO', 14, 85);
  doc.line(14, 87, 196, 87);

  // Box for Service Name
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 91, 182, 14, 2, 2, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110); // teal-700
  doc.text(serviceName.toUpperCase(), 18, 100);

  // Team breakdown
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const teamText = pkg 
    ? `Equipo: ${pkg.defaultPeople} personas  |  Jornada: ${pkg.defaultHours} hs estimadas`
    : `Equipo: ${form.peopleCount} personas  |  Jornada: ${form.hoursPerPerson} hs estimadas (${calc.totalHours} hs/hombre totales)`;
  doc.text(teamText, 18, 112);

  // Included items
  let currentY = 122;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Tareas e ítems contemplados:', 18, currentY);
  currentY += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const items = pkg ? pkg.details : ['Limpieza integral según especificaciones e inspección inicial.'];
  items.forEach(item => {
    doc.text(`• ${item}`, 22, currentY);
    currentY += 5.5;
  });

  // Pricing Box
  currentY = Math.max(currentY + 6, 180);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, currentY, 182, 38, 2, 2, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Total Presupuesto:', 20, currentY + 11);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${formatCurrency(calc.totalAmount)}`, 70, currentY + 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Seña 50% (Reserva en agenda):', 20, currentY + 22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text(`${formatCurrency(calc.depositAmount)}`, 75, currentY + 22);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Saldo 50% (Al finalizar el trabajo):', 20, currentY + 31);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text(`${formatCurrency(calc.balanceAmount)}`, 75, currentY + 31);

  // Terms & Conditions at bottom
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TÉRMINOS Y CONDICIONES:', 14, 234);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  let condY = 240;
  GENERAL_CONDITIONS.forEach(cond => {
    doc.text(`• ${cond}`, 16, condY);
    condY += 4.5;
  });

  // Footer signature line
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 275, 196, 275);
  doc.setFontSize(7.5);
  doc.text('Limpieza Profesional Mendoza  •  Comuníquese para confirmar o modificar su fecha de servicio.', 14, 280);

  // Trigger download
  const safeClientName = (form.clientName || 'Cliente').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Presupuesto_${safeClientName}_${Date.now().toString().slice(-4)}.pdf`);
}

/**
 * Genera el Catálogo / Folleto comercial de los 7 servicios
 * con opción de incluir o no los precios.
 */
export function generateCatalogPDF(showPrices: boolean = true) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 36, 'F');

  // Brand title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('LIMPIEZA PROFESIONAL', 14, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(45, 212, 191); // teal-400
  doc.text('CATÁLOGO DE SERVICIOS INTEGRALES  •  MENDOZA', 14, 23);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Insumos de primera línea, maquinaria profesional y personal capacitado.', 14, 29);

  // Top info strip
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 36, 210, 9, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('• Insumos y traslados incluidos en Gran Mendoza   • Seña 50% reserva de fecha   • Facturación y garantía', 14, 42);

  // 2-Column Grid Layout for 7 services
  // Left column: 3 services (Limpieza profunda, Obra liviana, Obra pesada)
  // Right column: 4 services (Post mudanza, Oficina, Mantenimiento, Vidrios)
  const leftColX = 12;
  const rightColX = 109;
  const colWidth = 89;

  const leftServices = SERVICE_PACKAGES.slice(0, 3);
  const rightServices = SERVICE_PACKAGES.slice(3, 7);

  // Render left column
  let currentY = 48;
  leftServices.forEach((pkg) => {
    const cardHeight = 62;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(leftColX, currentY, colWidth, cardHeight, 2, 2, 'FD');

    // Title & Price
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 118, 110); // teal-700
    doc.text(pkg.name.toUpperCase(), leftColX + 4, currentY + 7);

    if (showPrices) {
      doc.setFillColor(254, 243, 199); // amber-100
      doc.roundedRect(leftColX + colWidth - 28, currentY + 3, 24, 6, 1, 1, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(120, 53, 15); // amber-900
      doc.text(`${formatCurrency(pkg.fixedPrice)}`, leftColX + colWidth - 26, currentY + 7.5);
    }

    // Subtitle features
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(`${pkg.features}`, leftColX + 4, currentY + 13);

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(leftColX + 4, currentY + 16, leftColX + colWidth - 4, currentY + 16);

    // Items
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    let itemY = currentY + 21;
    pkg.details.slice(0, 5).forEach((d) => {
      doc.text(`✓ ${d}`, leftColX + 5, itemY);
      itemY += 4.5;
    });

    currentY += cardHeight + 4;
  });

  // Render right column
  currentY = 48;
  rightServices.forEach((pkg) => {
    const cardHeight = 46;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(rightColX, currentY, colWidth, cardHeight, 2, 2, 'FD');

    // Title & Price
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 118, 110);
    doc.text(pkg.name.toUpperCase(), rightColX + 4, currentY + 7);

    if (showPrices) {
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(rightColX + colWidth - 30, currentY + 3, 26, 6, 1, 1, 'F');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(120, 53, 15);
      const priceText = `${formatCurrency(pkg.fixedPrice)}${pkg.unitLabel ? ' /v' : ''}`;
      doc.text(priceText, rightColX + colWidth - 28, currentY + 7.5);
    }

    // Subtitle features
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(`${pkg.features}`, rightColX + 4, currentY + 13);

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(rightColX + 4, currentY + 16, rightColX + colWidth - 4, currentY + 16);

    // Items
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    let itemY = currentY + 21;
    pkg.details.slice(0, 4).forEach((d) => {
      doc.text(`✓ ${d}`, rightColX + 5, itemY);
      itemY += 4.5;
    });

    currentY += cardHeight + 4;
  });

  // Bottom CTA & Contact Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(12, 252, 186, 32, 2, 2, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('¿DUDAS SOBRE QUÉ SERVICIO SE ADAPTA A TU INMUEBLE?', 18, 261);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Envíanos fotos o la ubicación de tu propiedad y te asesoramos al instante sin compromiso.', 18, 267);
  doc.text('Coordinamos visitas de relevamiento técnico para obras y oficinas comerciales.', 18, 273);

  doc.setFillColor(13, 148, 136); // teal-600
  doc.roundedRect(18, 276, 75, 6, 1, 1, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('CONSULTAS Y RESERVAS POR WHATSAPP', 21, 280.5);

  const priceSuffix = showPrices ? 'ConPrecios' : 'Informativo';
  doc.save(`Catalogo_Servicios_Limpieza_${priceSuffix}.pdf`);
}
