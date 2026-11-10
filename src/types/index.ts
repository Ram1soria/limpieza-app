export interface ServicePackage {
  id: string;
  name: string;
  category: 'hogar' | 'obra' | 'comercial' | 'especial';
  defaultPeople: number;
  defaultHours: number;
  fixedPrice: number;
  unitLabel?: string;
  monthlyOption?: string;
  details: string[];
  features: string;
  isMinimumControlled?: boolean;
}

export interface QuoteFormState {
  id?: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  serviceType: 'package' | 'custom';
  packageId: string;
  customTitle: string;
  peopleCount: number;
  hoursPerPerson: number;
  hourlyRate: number;
  isUrgent: boolean; // +20%
  noUtilities: boolean; // +$40.000
  notes: string;
  status: 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'completada';
  createdAt: string;
  validUntil: string;
}

export interface QuoteCalculation {
  totalHours: number;
  baseAmount: number;
  urgentAmount: number;
  noUtilitiesAmount: number;
  totalAmount: number;
  depositAmount: number; // 50%
  balanceAmount: number; // 50%
  isBelowMinimum: boolean;
  minimumAmount: number;
}
