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

  // Additional Surcharges if any
  if (form.isUrgent || form.noUtilities) {
    currentY += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('Adicionales aplicados:', 18, currentY);
    currentY += 6;
    doc.setFont('helvetica', 'normal');
    if (form.isUrgent) {
      doc.text(`• Servicio de urgencia (para el día siguiente, +20%): ${formatCurrency(calc.urgentAmount)}`, 22, currentY);
      currentY += 5.5;
    }
    if (form.noUtilities) {
      doc.text(`• Inmueble sin servicio de luz / agua habilitado: ${formatCurrency(calc.noUtilitiesAmount)}`, 22, currentY);
      currentY += 5.5;
    }
  }

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
