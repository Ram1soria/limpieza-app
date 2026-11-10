import type { QuoteFormState, QuoteCalculation } from '../types';
import { 
  DEFAULT_HOURLY_RATE, 
  MINIMUM_PROFUNDA_PRICE, 
  NO_UTILITIES_SURCHARGE, 
  URGENT_SURCHARGE_PCT, 
  SERVICE_PACKAGES 
} from '../data/packages';

export function calculateQuote(form: QuoteFormState): QuoteCalculation {
  let baseAmount = 0;
  let totalHours = 0;
  const minimumAmount = MINIMUM_PROFUNDA_PRICE;
  let isBelowMinimum = false;

  if (form.serviceType === 'package') {
    const pkg = SERVICE_PACKAGES.find(p => p.id === form.packageId);
    if (pkg) {
      baseAmount = pkg.fixedPrice;
      totalHours = pkg.defaultPeople * pkg.defaultHours;
      if (pkg.id === 'limpieza-profunda' && baseAmount < MINIMUM_PROFUNDA_PRICE) {
        isBelowMinimum = true;
      }
    }
  } else {
    // Cálculo personalizado: Horas totales * Tarifa
    const people = Math.max(1, form.peopleCount || 1);
    const hours = Math.max(1, form.hoursPerPerson || 1);
    totalHours = people * hours;
    baseAmount = totalHours * (form.hourlyRate || DEFAULT_HOURLY_RATE);
    
    // Regla de piso si es profunda personalizada
    if (form.customTitle.toLowerCase().includes('profunda') && baseAmount < MINIMUM_PROFUNDA_PRICE) {
      isBelowMinimum = true;
    }
  }

  // Recargos
  const urgentAmount = form.isUrgent ? Math.round(baseAmount * URGENT_SURCHARGE_PCT) : 0;
  const noUtilitiesAmount = form.noUtilities ? NO_UTILITIES_SURCHARGE : 0;

  const totalAmount = baseAmount + urgentAmount + noUtilitiesAmount;
  const depositAmount = Math.round(totalAmount * 0.5);
  const balanceAmount = totalAmount - depositAmount;

  return {
    totalHours,
    baseAmount,
    urgentAmount,
    noUtilitiesAmount,
    totalAmount,
    depositAmount,
    balanceAmount,
    isBelowMinimum,
    minimumAmount
  };
}
