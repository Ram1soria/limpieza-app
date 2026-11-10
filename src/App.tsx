import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calculator, 
  FileText, 
  History, 
  Settings, 
  Copy, 
  Download, 
  CheckCircle2, 
  Users, 
  Trash2, 
  Search, 
  Check, 
  Send 
} from 'lucide-react';

import type { QuoteFormState, QuoteCalculation } from './types';
import { 
  SERVICE_PACKAGES, 
  DEFAULT_HOURLY_RATE, 
  MINIMUM_PROFUNDA_PRICE, 
  NO_UTILITIES_SURCHARGE, 
  GENERAL_CONDITIONS 
} from './data/packages';
import { calculateQuote } from './utils/calculator';
import { formatCurrency, generateWhatsAppMessage } from './utils/formatters';
import { generateQuotePDF } from './utils/pdfGenerator';

interface SavedQuote extends QuoteFormState {
  id: string;
  calculatedTotal: number;
  calculatedDeposit: number;
}

export function App() {
  const [activeTab, setActiveTab] = useState<'cotizador' | 'tarifario' | 'historial' | 'ajustes'>('cotizador');
  const [hourlyRate, setHourlyRate] = useState<number>(DEFAULT_HOURLY_RATE);
  const [minimumProfunda, setMinimumProfunda] = useState<number>(MINIMUM_PROFUNDA_PRICE);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Form State
  const [form, setForm] = useState<QuoteFormState>({
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    serviceType: 'package',
    packageId: 'limpieza-profunda',
    customTitle: 'Limpieza A Medida',
    peopleCount: 2,
    hoursPerPerson: 4,
    hourlyRate: DEFAULT_HOURLY_RATE,
    isUrgent: false,
    noUtilities: false,
    notes: '',
    status: 'enviada',
    createdAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  // Saved quotes list (persisted in localStorage)
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>(() => {
    try {
      const saved = localStorage.getItem('cleanpro_quotes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search filter for history
  const [historyFilter, setHistoryFilter] = useState('');

  // Keep hourlyRate in sync with form
  useEffect(() => {
    setForm(prev => ({ ...prev, hourlyRate }));
  }, [hourlyRate]);

  // Current Calculation
  const calculation: QuoteCalculation = calculateQuote(form);
  const selectedPackage = SERVICE_PACKAGES.find(p => p.id === form.packageId);

  // Handle WhatsApp Copy
  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppMessage(form, calculation);
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // Handle WhatsApp Direct Send
  const handleOpenWhatsApp = () => {
    const text = generateWhatsAppMessage(form, calculation);
    const cleanPhone = form.clientPhone.replace(/\D/g, '');
    const url = cleanPhone.length > 6 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Handle PDF Export
  const handleDownloadPDF = () => {
    generateQuotePDF(form, calculation);
  };

  // Handle Save Quote
  const handleSaveQuote = () => {
    const newQuote: SavedQuote = {
      ...form,
      id: 'COT-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
      calculatedTotal: calculation.totalAmount,
      calculatedDeposit: calculation.depositAmount
    };

    const updated = [newQuote, ...savedQuotes];
    setSavedQuotes(updated);
    localStorage.setItem('cleanpro_quotes', JSON.stringify(updated));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Handle Delete Quote
  const handleDeleteQuote = (id: string) => {
    const updated = savedQuotes.filter(q => q.id !== id);
    setSavedQuotes(updated);
    localStorage.setItem('cleanpro_quotes', JSON.stringify(updated));
  };

  // Quick select package from Tarifario tab
  const handleSelectPackageFromList = (pkgId: string) => {
    setForm(prev => ({
      ...prev,
      serviceType: 'package',
      packageId: pkgId
    }));
    setActiveTab('cotizador');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Limpieza Profesional <span className="text-teal-400 font-semibold text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">Mendoza</span>
              </h1>
              <p className="text-xs text-slate-400">Cotizador y Gestión de Servicios</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 overflow-x-auto text-sm">
            <button
              onClick={() => setActiveTab('cotizador')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'cotizador' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Cotizador
            </button>
            <button
              onClick={() => setActiveTab('tarifario')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'tarifario' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Lista de Precios
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'historial' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <History className="w-4 h-4" />
              Historial ({savedQuotes.length})
            </button>
            <button
              onClick={() => setActiveTab('ajustes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'ajustes' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              Tarifas
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        
        {/* ===================== TAB 1: COTIZADOR ===================== */}
        {activeTab === 'cotizador' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Form Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Card 1: Client Information */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">1</span>
                  Datos del Cliente
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre o Empresa</label>
                    <input
                      type="text"
                      placeholder="Ej. Martina Gómez"
                      value={form.clientName}
                      onChange={e => setForm({ ...form, clientName: e.target.value })}
                      className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">WhatsApp / Teléfono</label>
                    <input
                      type="tel"
                      placeholder="Ej. 261 555-1234"
                      value={form.clientPhone}
                      onChange={e => setForm({ ...form, clientPhone: e.target.value })}
                      className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Dirección / Barrio (Mendoza)</label>
                  <input
                    type="text"
                    placeholder="Ej. Barrio Dalvian, Quinta Sección, Godoy Cruz..."
                    value={form.clientAddress}
                    onChange={e => setForm({ ...form, clientAddress: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Card 2: Service Selection */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">2</span>
                    Tipo de Servicio
                  </h2>
                  
                  {/* Mode Selector */}
                  <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, serviceType: 'package' })}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        form.serviceType === 'package' 
                          ? 'bg-white text-teal-700 shadow-sm font-semibold' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Paquetes Fijos (7)
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, serviceType: 'custom' })}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        form.serviceType === 'custom' 
                          ? 'bg-white text-teal-700 shadow-sm font-semibold' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Cálculo a Medida
                    </button>
                  </div>
                </div>

                {/* Option A: Packages Grid */}
                {form.serviceType === 'package' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {SERVICE_PACKAGES.map((pkg) => {
                      const isSelected = form.packageId === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setForm({ ...form, packageId: pkg.id })}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                            isSelected 
                              ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-sm' 
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <h3 className="text-sm font-bold text-slate-900">{pkg.name}</h3>
                              {isSelected && (
                                <span className="bg-teal-600 text-white p-0.5 rounded-full">
                                  <Check className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium mb-2">{pkg.features}</p>
                          </div>
                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              {pkg.defaultPeople} pers • {pkg.defaultHours} hs
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {formatCurrency(pkg.fixedPrice)}
                              {pkg.unitLabel && <span className="text-xs font-normal text-slate-500">{pkg.unitLabel}</span>}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Option B: Custom Calculator by People and Hours */
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre o concepto del servicio</label>
                      <input
                        type="text"
                        value={form.customTitle}
                        onChange={e => setForm({ ...form, customTitle: e.target.value })}
                        placeholder="Ej. Limpieza Integral de Galpón o Residencia"
                        className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* People Counter */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-2">Cantidad de personas requeridas</label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, peopleCount: Math.max(1, form.peopleCount - 1) })}
                            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-lg"
                          >
                            -
                          </button>
                          <span className="text-base font-bold text-slate-900 w-10 text-center">{form.peopleCount}</span>
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, peopleCount: form.peopleCount + 1 })}
                            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-lg"
                          >
                            +
                          </button>
                          <span className="text-xs text-slate-500">operarios</span>
                        </div>
                      </div>

                      {/* Hours per person Counter */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-2">Horas por persona</label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, hoursPerPerson: Math.max(1, form.hoursPerPerson - 1) })}
                            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-lg"
                          >
                            -
                          </button>
                          <span className="text-base font-bold text-slate-900 w-10 text-center">{form.hoursPerPerson} hs</span>
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, hoursPerPerson: form.hoursPerPerson + 1 })}
                            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-lg"
                          >
                            +
                          </button>
                          <span className="text-xs text-slate-500">por jornada</span>
                        </div>
                      </div>
                    </div>

                    {/* Formula helper banner */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <strong>Regla de cálculo:</strong> {form.peopleCount} personas × {form.hoursPerPerson} hs = <strong>{calculation.totalHours} hs-hombre totales</strong>. 
                        Multiplicado por la tarifa de {formatCurrency(form.hourlyRate)}/h = <strong>{formatCurrency(calculation.baseAmount)}</strong> de base.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Quotation Summary & Actions (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sticky top-24 space-y-6">
                
                {/* Header summary */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
                      Resumen del Presupuesto
                    </span>
                    <span className="text-xs text-slate-500">Validez: 7 días</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    {form.serviceType === 'package' ? selectedPackage?.name : form.customTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {form.serviceType === 'package' 
                      ? selectedPackage?.features 
                      : `${form.peopleCount} personas × ${form.hoursPerPerson} hs (${calculation.totalHours} hs/h)`}
                  </p>
                </div>

                {/* Subtotal & Total Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-800">TOTAL PRESUPUESTADO:</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {formatCurrency(calculation.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* 50% Deposit & 50% Balance Card */}
                <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Modalidad de cobro comercial:</span>
                    <span className="text-teal-400 font-bold">50% / 50%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                      <span className="text-[10px] text-teal-300 uppercase font-bold tracking-wider block mb-1">
                        Seña para reservar
                      </span>
                      <span className="text-base font-bold text-white">
                        {formatCurrency(calculation.depositAmount)}
                      </span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                        Saldo al finalizar
                      </span>
                      <span className="text-base font-bold text-slate-200">
                        {formatCurrency(calculation.balanceAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Included Tasks Preview - All tasks visible */}
                {form.serviceType === 'package' && selectedPackage && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                    <span className="font-semibold text-slate-800 block">Tareas comprendidas en el servicio:</span>
                    <div className="space-y-1.5">
                      {selectedPackage.details.map((d, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Action Buttons */}
                <div className="space-y-2 pt-2">
                  {/* WhatsApp Copy Button */}
                  <button
                    type="button"
                    onClick={handleCopyWhatsApp}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white shadow-sm transition-all"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        ¡Texto Copiado para WhatsApp!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar Mensaje para WhatsApp
                      </>
                    )}
                  </button>

                  {/* Send Direct to WhatsApp */}
                  <button
                    type="button"
                    onClick={handleOpenWhatsApp}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    Abrir Chat Directo en WhatsApp
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* PDF Download Button */}
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all"
                    >
                      <Download className="w-4 h-4 text-slate-600" />
                      Descargar PDF
                    </button>

                    {/* Save to History Button */}
                    <button
                      type="button"
                      onClick={handleSaveQuote}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-all"
                    >
                      {saveSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-teal-700" />
                          ¡Guardada!
                        </>
                      ) : (
                        <>
                          <History className="w-4 h-4 text-teal-700" />
                          Guardar
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Conditions brief */}
                <p className="text-[11px] text-slate-400 text-center leading-tight">
                  Precios con insumos y traslado incluidos en Mendoza. Validez por 7 días.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: TARIFARIO (LA HOJA ORIGINAL) ===================== */}
        {activeTab === 'tarifario' && (
          <div className="space-y-6">
            
            {/* Header banner */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
              <span className="text-teal-400 font-bold text-xs uppercase tracking-widest block mb-1">
                Catálogo Vigente
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                LISTA DE PRECIOS - LIMPIEZA PROFESIONAL
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto mb-4">
                Final de obra • Profunda • Mantenimiento • Oficinas • Vidrios
              </p>
              <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700">
                <span>Precios con insumos y traslado incluidos</span>
                <span>•</span>
                <span>Mendoza</span>
                <span>•</span>
                <span>Validez 7 días</span>
                <span>•</span>
                <span className="text-teal-300 font-semibold">Seña 50% para reservar</span>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICE_PACKAGES.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 text-base">{pkg.name}</h3>
                      <span className="text-sm font-black text-slate-900 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
                        {formatCurrency(pkg.fixedPrice)}
                        {pkg.unitLabel && <span className="text-[10px] font-normal"> {pkg.unitLabel}</span>}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md mb-3 w-fit">
                      <Users className="w-3.5 h-3.5" />
                      {pkg.features}
                    </div>

                    {pkg.monthlyOption && (
                      <p className="text-xs text-teal-700 font-medium mb-3 italic">
                        {pkg.monthlyOption}
                      </p>
                    )}

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-600 block mb-1">Comprende:</span>
                      {pkg.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleSelectPackageFromList(pkg.id)}
                      className="w-full py-2 px-3 rounded-xl font-semibold text-xs bg-slate-900 hover:bg-teal-700 text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      Cotizar este paquete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Rule Box (Matching the yellow footer in the photo) */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 text-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Regla Rápida para Cotizar
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 mb-1">
                Horas totales × {formatCurrency(hourlyRate)} = Tu precio
              </p>
              <p className="text-xs text-slate-600 mb-3">
                Ej: 2 personas × 3 hs = 6 hs totales × {formatCurrency(hourlyRate)} = {formatCurrency(6 * hourlyRate)}
              </p>
              
              <div className="flex flex-wrap gap-3 pt-3 border-t border-amber-200 text-xs">
                <span className="bg-white/80 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                  🛑 <strong>Piso mínimo:</strong> nunca bajar de {formatCurrency(minimumProfunda)} en profunda.
                </span>
                <span className="bg-white/80 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                  ⚡ <strong>Urgente para mañana:</strong> +20%
                </span>
                <span className="bg-white/80 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                  🚰 <strong>Sin luz / agua:</strong> +{formatCurrency(NO_UTILITIES_SURCHARGE)}
                </span>
              </div>
            </div>

            {/* General Conditions footer */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 text-xs text-slate-500 space-y-2">
              <h4 className="font-bold text-slate-700">Condiciones comerciales generales:</h4>
              <ul className="list-disc list-inside space-y-1">
                {GENERAL_CONDITIONS.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: HISTORIAL DE COTIZACIONES ===================== */}
        {activeTab === 'historial' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-bold text-slate-900">Historial de Presupuestos Guardados</h2>
                <p className="text-xs text-slate-500">Cotizaciones generadas y registradas para seguimiento de clientes</p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por cliente o servicio..."
                  value={historyFilter}
                  onChange={e => setHistoryFilter(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            {savedQuotes.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-700 mb-1">No hay presupuestos guardados todavía</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Cuando generes un presupuesto en el cotizador, presiona el botón "Guardar" para conservarlo aquí.
                </p>
                <button
                  onClick={() => setActiveTab('cotizador')}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition-all"
                >
                  Ir al Cotizador
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedQuotes
                  .filter(q => 
                    q.clientName.toLowerCase().includes(historyFilter.toLowerCase()) ||
                    q.clientAddress.toLowerCase().includes(historyFilter.toLowerCase()) ||
                    (q.serviceType === 'package' ? q.packageId : q.customTitle).toLowerCase().includes(historyFilter.toLowerCase())
                  )
                  .map((quote) => {
                    const pkg = quote.serviceType === 'package' 
                      ? SERVICE_PACKAGES.find(p => p.id === quote.packageId) 
                      : null;
                    const title = pkg ? pkg.name : quote.customTitle;

                    return (
                      <div 
                        key={quote.id} 
                        className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              {quote.id}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(quote.createdAt).toLocaleDateString('es-AR')}
                            </span>
                            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                              {quote.status}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900">
                            {quote.clientName || 'Cliente no especificado'} 
                            <span className="font-normal text-slate-500 text-xs ml-2">({title})</span>
                          </h3>

                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            {quote.clientPhone && <span>📱 {quote.clientPhone}</span>}
                            {quote.clientAddress && <span>📍 {quote.clientAddress}</span>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                          <div className="text-right">
                            <span className="text-sm font-bold text-slate-900 block">
                              {formatCurrency(quote.calculatedTotal)}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Seña 50%: {formatCurrency(quote.calculatedDeposit)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* PDF Button */}
                            <button
                              onClick={() => {
                                const calc = calculateQuote(quote);
                                generateQuotePDF(quote, calc);
                              }}
                              title="Descargar PDF"
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            {/* WhatsApp Button */}
                            <button
                              onClick={() => {
                                const calc = calculateQuote(quote);
                                const text = generateWhatsAppMessage(quote, calc);
                                navigator.clipboard.writeText(text);
                                alert('¡Copiado para WhatsApp!');
                              }}
                              title="Copiar texto para WhatsApp"
                              className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteQuote(quote.id)}
                              title="Eliminar registro"
                              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: AJUSTES DE TARIFAS ===================== */}
        {activeTab === 'ajustes' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Configuración de Parámetros y Tarifas</h2>
              <p className="text-xs text-slate-500">
                Ajusta los valores base del sistema cuando haya actualizaciones de precios por inflación o insumos.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tarifa base por Hora-Hombre (ARS)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="500"
                    value={hourlyRate}
                    onChange={e => setHourlyRate(Number(e.target.value))}
                    className="w-full text-sm pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Valor actual en la lista: $14.500 / hora por operario.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Piso mínimo para Limpieza Profunda (ARS)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="5000"
                    value={minimumProfunda}
                    onChange={e => setMinimumProfunda(Number(e.target.value))}
                    className="w-full text-sm pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Alerta preventiva si una cotización profunda queda por debajo de este valor ($130.000).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Modificadores preconfigurados:</span>
                <div>• Recargo por urgencia (mañana): <strong>+20%</strong></div>
                <div>• Recargo por falta de luz o agua: <strong>+${NO_UTILITIES_SURCHARGE.toLocaleString('es-AR')}</strong></div>
                <div>• Política de cobro: <strong>50% de seña para reservar</strong>, 50% al finalizar.</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  alert('¡Tarifas actualizadas correctamente!');
                  setActiveTab('cotizador');
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-teal-700 text-white transition-all"
              >
                Guardar y volver al Cotizador
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
