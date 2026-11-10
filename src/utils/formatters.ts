import type { QuoteFormState, QuoteCalculation } from '../types';
import { SERVICE_PACKAGES, GENERAL_CONDITIONS } from '../data/packages';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

export function generateWhatsAppMessage(form: QuoteFormState, calc: QuoteCalculation): string {
  const pkg = form.serviceType === 'package' 
    ? SERVICE_PACKAGES.find(p => p.id === form.packageId) 
    : null;

  const serviceName = pkg ? pkg.name : (form.customTitle || 'Servicio de Limpieza Profesional');
  const teamDetail = pkg 
    ? `${pkg.defaultPeople} personas • ${pkg.defaultHours} hs` 
    : `${form.peopleCount} personas • ${form.hoursPerPerson} hs (${calc.totalHours} hs/hombre totales)`;

  const detailsList = pkg 
    ? pkg.details.map(d => `  ▫️ ${d}`).join('\n')
    : '  ▫️ Limpieza integral según relevamiento y especificaciones acordadas.';

  const extrasText: string[] = [];
  if (form.isUrgent) extrasText.push(`  ▫️ Servicio Urgente (+20%): +${formatCurrency(calc.urgentAmount)}`);
  if (form.noUtilities) extrasText.push(`  ▫️ Inmueble sin luz/agua: +${formatCurrency(calc.noUtilitiesAmount)}`);

  const clientGreeting = form.clientName.trim() 
    ? `Hola *${form.clientName.trim()}*, te acercamos el presupuesto solicitado:` 
    : `Hola, te acercamos el presupuesto solicitado para el servicio de limpieza:`;

  return `✨ *PRESUPUESTO - LIMPIEZA PROFESIONAL* ✨
📍 _Mendoza, Argentina_

${clientGreeting}

📋 *Servicio:* ${serviceName}
👥 *Equipo asignado:* ${teamDetail}

🧹 *Tareas incluidas:*
${detailsList}
${extrasText.length > 0 ? `\n⚡ *Adicionales:* \n${extrasText.join('\n')}` : ''}

───────────────
💵 *PRECIO TOTAL:* *${formatCurrency(calc.totalAmount)}*
💳 *Seña 50% (reserva de fecha):* *${formatCurrency(calc.depositAmount)}*
🤝 *Saldo 50% (al finalizar el trabajo):* *${formatCurrency(calc.balanceAmount)}*
───────────────

📌 *Condiciones comerciales:*
${GENERAL_CONDITIONS.map(c => `• ${c}`).join('\n')}

¿Te gustaría que te reservemos una fecha en agenda? ¡Escribinos para coordinar! 🙌`;
}
