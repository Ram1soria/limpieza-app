import type { ServicePackage } from '../types';

export const DEFAULT_HOURLY_RATE = 14500;
export const MINIMUM_PROFUNDA_PRICE = 130000;
export const NO_UTILITIES_SURCHARGE = 40000;
export const URGENT_SURCHARGE_PCT = 0.20;

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'limpieza-profunda',
    name: 'Limpieza Profunda',
    category: 'hogar',
    defaultPeople: 2,
    defaultHours: 5,
    fixedPrice: 145000,
    features: 'Casa / Depto - 2 personas - 5 hs',
    details: [
      'Cocina y desengrasado',
      'Baños completos a fondo',
      'Pisos y zócalos',
      'Vidrios internos y marcos',
      'Puertas y aberturas',
      'Aspirado final completo'
    ],
    isMinimumControlled: true
  },
  {
    id: 'obra-liviana',
    name: 'Final de Obra Liviana',
    category: 'obra',
    defaultPeople: 2,
    defaultHours: 6,
    fixedPrice: 175000,
    features: '2 personas - 6 hs - Polvo de obra',
    details: [
      'Remoción de polvo fino de obra en suspensión',
      'Pisos y zócalos',
      'Baños y sanitarios a estrenar',
      'Cocina y muebles',
      'Vidrios con rasqueta y despegado',
      'Aberturas y rieles',
      'Aspirado industrial'
    ]
  },
  {
    id: 'obra-pesada',
    name: 'Final de Obra Pesada',
    category: 'obra',
    defaultPeople: 3,
    defaultHours: 6,
    fixedPrice: 260000,
    features: '3 personas - 6 hs - Cemento y pintura',
    details: [
      'Todo lo incluido en obra liviana',
      'Remoción de cemento superficial y restos de mezcla',
      'Pintura y siliconas en vidrios y pisos',
      'Doble pasada de limpieza profunda en todas las áreas'
    ]
  },
  {
    id: 'mantenimiento-semanal',
    name: 'Mantenimiento Semanal',
    category: 'hogar',
    defaultPeople: 1,
    defaultHours: 3,
    fixedPrice: 48000,
    unitLabel: '/ visita',
    monthlyOption: 'Mensual 4 visitas: $185.000',
    features: '1 persona - 3 hs - 1 vez por semana',
    details: [
      'Mantenimiento regular de pisos',
      'Limpieza de baños',
      'Cocina y mesadas',
      'Desempolvado general'
    ]
  },
  {
    id: 'post-mudanza',
    name: 'Post Mudanza / Alquiler',
    category: 'hogar',
    defaultPeople: 2,
    defaultHours: 4,
    fixedPrice: 120000,
    features: 'Casa vacía - 2 personas - 4 hs',
    details: [
      'Cocina y artefactos a fondo',
      'Baños desinfectados completos',
      'Pisos y zócalos',
      'Vidrios y marcos',
      'Placares y bajomesadas por dentro'
    ]
  },
  {
    id: 'oficina-comercio',
    name: 'Oficina / Comercio',
    category: 'comercial',
    defaultPeople: 2,
    defaultHours: 4,
    fixedPrice: 125000,
    unitLabel: '/ visita',
    monthlyOption: 'Abono 2x semana: $850.000',
    features: '2 personas - 4 hs',
    details: [
      'Pisos y recepción',
      'Puestos de trabajo y escritorios',
      'Baños comerciales y reposición básica',
      'Office / Cocineta',
      'Vidrios y mamparas internas'
    ]
  },
  {
    id: 'vidrios-solos',
    name: 'Vidrios Solos',
    category: 'especial',
    defaultPeople: 2,
    defaultHours: 3,
    fixedPrice: 95000,
    features: '2 personas - 3 hs',
    details: [
      'Vidrios cara interna y externa',
      'Marcos, perfiles y guías',
      'Persianas (sin trabajo en altura con andamio)'
    ]
  }
];

export const GENERAL_CONDITIONS = [
  'Precios con insumos profesionales y traslado incluidos (Mendoza)',
  'Validez del presupuesto: 7 días corridos',
  'Seña del 50% para reservar la fecha en agenda',
  'Saldo del 50% al finalizar la jornada y verificar conformidad',
  'No incluye retiro de escombros de gran porte, pulido de pisos ni trabajo en altura con andamios'
];
