import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import confetti from 'canvas-confetti';
import './index.css';
import {
  ShoppingCart,
  Receipt,
  Factory,
  Wallet,
  ClipboardList,
  FileText,
  RotateCcw,
  Plus,
  Minus,
  Trash2,
  Tag,
  DollarSign,
  AlertCircle,
  Flame,
  Waves,
  Boxes,
  Zap,
  Phone,
  Send,
  PartyPopper,
  Settings,
  Printer,
  X,
  CheckCircle,
  ChefHat,
  ArrowRight,
  TrendingUp,
  Clock,
  ShoppingBag,
  Search,
  Download,
  Copy,
  Check,
  Edit2,
  Smile,
  AlertOctagon,
  ClipboardCheck,
  Lightbulb,
  Sparkles,
  Award,
  Camera,
  Share2,
  QrCode,
  FileCheck2,
  ShieldCheck,
  School,
  FileDown,
  Globe,
} from 'lucide-react';

/* ==========================================================================
   1. TYPES & DATA DEFINITIONS
   ========================================================================== */

export type ProductType = 'drink' | 'combo';

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ProductType;
  color: string;
  badge?: string;
  includes?: {
    blueSharks: number;
    laToxica: number;
  };
}

export type CouponType = 'none' | 'percent_10' | 'percent_15' | 'percent_20';

export interface CouponRule {
  id: CouponType;
  code: string;
  label: string;
  discountPercent: number;
  description: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface SaleOrder {
  id: string;
  orderNumber: number;
  timestamp: string;
  customerName?: string;
  items: {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    type: ProductType;
    itemSubtotal: number;
    eligibleForCoupon: boolean;
    discountAmount: number;
    finalPrice: number;
  }[];
  couponApplied: CouponType;
  couponLabel: string;
  rawSubtotal: number;
  discountTotal: number;
  unroundedTotal: number;
  total: number; // Redondeado hacia arriba a múltiplos de $0.05
  cashReceived: number;
  cashChange: number;
  paymentMethod: 'efectivo';
}

export interface ProductionData {
  plannedBlueSharks: number;
  plannedLaToxica: number;
  manualDamagedBlueSharks: number;
  manualDamagedLaToxica: number;
  explanationPlannedAchieved: string;
}

export interface LossItem {
  id: string;
  lossType: 'Merma de materia prima' | 'Producto dañado' | 'Producto no vendido' | 'Desperdicio' | 'Otros';
  description: string;
  quantity: number;
  cause: string;
  estimatedValue: number;
}

export interface ExpenseItem {
  id: string;
  category: 'Materia prima' | 'Vasos y empaques' | 'Hielo y conservación' | 'Publicidad y estand' | 'Transporte' | 'Otros';
  description: string;
  amount: number;
  responsiblePartner?: string;
}

export interface Partner {
  id: string;
  name: string;
  capitalContributed: number;
  role: string;
}

export interface CustomerServiceRating {
  saludoCordial: 'SI' | 'NO' | 'DEBE_MEJORARSE';
  explicoProducto: 'SI' | 'NO' | 'DEBE_MEJORARSE';
  informoPrecio: 'SI' | 'NO' | 'DEBE_MEJORARSE';
  atendioDudas: 'SI' | 'NO' | 'DEBE_MEJORARSE';
  ofrecioAlternativas: 'SI' | 'NO' | 'DEBE_MEJORARSE';
  realizoCobro: 'SI' | 'NO' | 'DEBE_MEJORARSE';
  entregoProducto: 'SI' | 'NO' | 'DEBE_MEJORARSE';
  agradecioCompra: 'SI' | 'NO' | 'DEBE_MEJORARSE';
  customerComments: string;
}

export interface ProjectProblems {
  production: { problem: string; solution: string };
  inventory: { problem: string; solution: string };
  sales: { problem: string; solution: string };
  customerService: { problem: string; solution: string };
  teamwork: { problem: string; solution: string };
  others: { problem: string; solution: string };
}

export interface AreaAssessment {
  area: string;
  workedWell: string;
  hadDifficulties: string;
  toImprove: string;
}

export interface ProjectLearnings {
  productionLearning: string;
  salesLearning: string;
  customerLearning: string;
  moneyAndProfitsLearning: string;
  teamworkLearning: string;
  differenceFromClassroomLearning: string;
}

export interface FutureDecisions {
  production: string;
  inventory: string;
  sales: string;
  customerService: string;
  advertising: string;
  socialMedia: string;
  boothOrganization: string;
}

export interface ProjectMetadata {
  businessName: string;
  productName: string;
  schoolName: string;
  moduleName: string;
  eventName: string;
  teacherName: string;
  fairDate: string;
  teamMembers: string;
  productionPhone: string;
  customLogoUrl?: string;
  slogan?: string;
  mission?: string;
  vision?: string;
  mainLossCause: string;
  howToAvoidLosses: string;
  capitalRecoveryExplanation: string;
  distributionAgreed: 'SI' | 'NO';
  distributionExplanation: string;
  teamConclusion: string;
}

/* ==========================================================================
   2. INITIAL CONSTANTS & 7 PARTNERS ($140.00 CAPITAL TOTAL)
   ========================================================================== */

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'blue-sharks',
    name: 'Blue Sharks',
    description: 'Bebida refrescante azul océano con gomita de tiburón, jarabe cítrico, soda burbujeante y hielo frappé.',
    price: 2.50,
    type: 'drink',
    color: 'from-blue-500 to-cyan-500',
    badge: 'Bebida Estrella 🦈',
  },
  {
    id: 'la-toxica',
    name: 'La Tóxica',
    description: 'Bebida frutal exótica con escarchado especial picosito de chamoy, tajín y gomitas ácidas.',
    price: 2.00,
    type: 'drink',
    color: 'from-emerald-500 to-lime-500',
    badge: 'Especial Picosito 🧪',
  },
  {
    id: 'duo-letal',
    name: 'Dúo Letal',
    description: 'Combo promocional: 1 Blue Shark + 1 La Tóxica. ¡Precio especial en pareja!',
    price: 4.00,
    type: 'combo',
    color: 'from-purple-600 to-indigo-600',
    badge: 'Combo $4.00 ⚡',
    includes: {
      blueSharks: 1,
      laToxica: 1,
    },
  },
  {
    id: 'doble-peligro',
    name: 'Doble Peligro',
    description: 'Mega Combo: 2 Blue Sharks + 2 La Tóxica para compartir con tu grupo.',
    price: 7.50,
    type: 'combo',
    color: 'from-rose-600 to-amber-600',
    badge: 'Mega Combo 🔥',
    includes: {
      blueSharks: 2,
      laToxica: 2,
    },
  },
];

export const COUPON_RULES: CouponRule[] = [
  {
    id: 'none',
    code: 'SIN_CUPON',
    label: 'Sin Cupón (0%)',
    discountPercent: 0,
    description: 'Precio normal de lista',
  },
  {
    id: 'percent_10',
    code: 'BOOM10',
    label: 'Cupón 10%',
    discountPercent: 10,
    description: 'Aplica a bebidas individuales (No combos)',
  },
  {
    id: 'percent_15',
    code: 'BOOM15',
    label: 'Cupón 15%',
    discountPercent: 15,
    description: 'Aplica a bebidas individuales (No combos)',
  },
  {
    id: 'percent_20',
    code: 'BOOM20',
    label: 'Cupón 20%',
    discountPercent: 20,
    description: 'Aplica a bebidas individuales (No combos)',
  },
];

// Los 7 Socios Oficiales con $20.00 aportados cada uno ($140.00 total invertido)
export const INITIAL_PARTNERS: Partner[] = [
  { id: '1', name: 'Raquel Henríquez', capitalContributed: 20.00, role: 'Gerente General' },
  { id: '2', name: 'Emily Rolin', capitalContributed: 20.00, role: 'Jefa de Producción' },
  { id: '3', name: 'Ashlie Aguilar', capitalContributed: 20.00, role: 'Auxiliar de Producción' },
  { id: '4', name: 'Williams Portillo', capitalContributed: 20.00, role: 'Encargado de Logística' },
  { id: '5', name: 'Gabriela Ferrufino', capitalContributed: 20.00, role: 'Responsable Financiera y Administrativa' },
  { id: '6', name: 'Alexandra Vázquez', capitalContributed: 20.00, role: 'Encargada de Marketing y Community Manager' },
  { id: '7', name: 'Jefferson Martinez', capitalContributed: 20.00, role: 'Auxiliar de Producción' },
];

export const INITIAL_METADATA: ProjectMetadata = {
  businessName: 'Boom Drinks',
  productName: 'Blue Sharks y La Tóxica (Bebidas Temáticas Refrescantes)',
  schoolName: 'INSTITUTO NACIONAL DE SAN BARTOLO – INSAB',
  moduleName: 'MÓDULO 3.7: PUESTA EN MARCHA DE LA MICROEMPRESA COOPERATIVA',
  eventName: 'FERIA DE EMPRENDIMIENTO',
  teacherName: 'Profesora Ángela Marisol Osegueda',
  fairDate: '24 de Octubre de 2026',
  teamMembers: 'Raquel Henríquez, Emily Rolin, Ashlie Aguilar, Williams Portillo, Gabriela Ferrufino, Alexandra Vázquez, Jefferson Martinez',
  productionPhone: '',
  customLogoUrl: '/logo.jpg',
  slogan: '¡Sabor explosivo que despierta tus sentidos!',
  mission: 'Ofrecer a la comunidad estudiantil y docente del INSAB bebidas artesanales refrescantes, higiénicas y de alta calidad visual y gustativa, brindando una experiencia innovadora en la feria escolar bajo los principios de la cooperación y el trabajo solidario.',
  vision: 'Consolidar a Boom Drinks como la microempresa escolar referente en innovación de bebidas y servicio al cliente dentro del Instituto Nacional de San Bartolo, destacando por su rentabilidad, transparencia contable y espíritu cooperativo.',
  mainLossCause: 'Ninguna merma crítica reportada al momento.',
  howToAvoidLosses: 'Control estricto de temperaturas de hielo y montaje ordenado de vasos con dosificadores.',
  capitalRecoveryExplanation: 'Se alcanzará la recuperación total una vez las ventas superen la inversión cooperativa de $140.00.',
  distributionAgreed: 'SI',
  distributionExplanation: 'Se dividirá en 7 partes iguales entre los socios cooperativistas ($20 aportados cada uno).',
  teamConclusion: 'La microempresa escolar Boom Drinks superó las expectativas comerciales establecidas durante la feria de emprendimiento en INSAB. Gracias a la innovación del Blue Sharks y La Tóxica, junto con las promociones del Dúo Letal, logramos recuperar el 100% de la inversión inicial de $140.00 aportada por los 7 socios cooperativistas y repartir dividendos netos equitativos. Los aprendizajes en costeo real, trato al cliente y trabajo bajo presión consolidaron nuestra experiencia formativa cooperativa.',
};

export const roundCommercial = (value: number): number => {
  // Redondeo comercial hacia arriba al múltiplo de $0.05 (ej: 2.22 -> 2.25)
  return Math.ceil(value * 20) / 20;
};

/* ==========================================================================
   3. APP CONTEXT & STATE MANAGEMENT
   ========================================================================== */

interface AppContextType {
  products: ProductItem[];
  cart: CartItem[];
  activeCoupon: CouponType;
  orders: SaleOrder[];
  production: ProductionData;
  losses: LossItem[];
  expenses: ExpenseItem[];
  partners: Partner[];
  serviceRating: CustomerServiceRating;
  problems: ProjectProblems;
  assessments: AreaAssessment[];
  learnings: ProjectLearnings;
  decisions: FutureDecisions;
  metadata: ProjectMetadata;
  selectedOrderForTicket: SaleOrder | null;
  setSelectedOrderForTicket: (order: SaleOrder | null) => void;

  // Cart actions
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setActiveCoupon: (coupon: CouponType) => void;
  completeSale: (cashReceived: number, customerName?: string) => SaleOrder;

  // POS actions
  deleteOrder: (orderId: string) => void;

  // WhatsApp Helpers
  generateProductionWhatsAppUrl: (order: SaleOrder) => string;

  // Management actions
  updateProduction: (data: Partial<ProductionData>) => void;
  addLoss: (loss: Omit<LossItem, 'id'>) => void;
  deleteLoss: (id: string) => void;
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updatePartner: (id: string, partner: Partial<Partner>) => void;
  updateServiceRating: (rating: Partial<CustomerServiceRating>) => void;
  updateProblems: (problems: Partial<ProjectProblems>) => void;
  updateAssessments: (assessments: AreaAssessment[]) => void;
  updateLearnings: (learnings: Partial<ProjectLearnings>) => void;
  updateDecisions: (decisions: Partial<FutureDecisions>) => void;
  updateMetadata: (meta: Partial<ProjectMetadata>) => void;
  resetToCleanFair: () => void;

  // Computed Financials & Production
  totals: {
    totalSales: number;
    totalOrdersCount: number;
    totalUnitsSold: number;
    blueSharksSold: number;
    laToxicaSold: number;
    duoLetalSold: number;
    doblePeligroSold: number;
    equivalentBlueSharksTotal: number;
    equivalentLaToxicaTotal: number;
    madeBlueSharks: number;
    madeLaToxica: number;
    totalCosts: number;
    initialCapitalContributed: number;
    netProfit: number;
    capitalRecovered: number;
    capitalPending: number;
    isCapitalFullyRecovered: boolean;
    totalLossesValue: number;
    profitPerPartner: number;
    totalReceivedPerPartner: number;
    status: 'Ganancia' | 'Pérdida' | 'Recuperado sin ganancia';
    capitalStatus: 'Se recuperó totalmente' | 'Se recuperó parcialmente' | 'No se recuperó';
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const STORAGE_KEY = 'boom_drinks_pos_insab_v5';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [products] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCoupon, setActiveCouponState] = useState<CouponType>('none');
  const [orders, setOrders] = useState<SaleOrder[]>(() => loadStored('orders', []));
  const [production, setProduction] = useState<ProductionData>(() =>
    loadStored('production', {
      plannedBlueSharks: 50,
      plannedLaToxica: 50,
      manualDamagedBlueSharks: 0,
      manualDamagedLaToxica: 0,
      explanationPlannedAchieved: 'Planificado: 50 unidades de Blue Sharks y 50 de La Tóxica (100 totales). Se elaboraron conforme al flujo de ventas en la feria escolar.',
    })
  );
  const [losses, setLosses] = useState<LossItem[]>(() => loadStored('losses', []));
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => loadStored('expenses', []));
  const [partners, setPartners] = useState<Partner[]>(() => loadStored('partners', INITIAL_PARTNERS));
  const [serviceRating, setServiceRating] = useState<CustomerServiceRating>(() =>
    loadStored('serviceRating', {
      saludoCordial: 'SI',
      explicoProducto: 'SI',
      informoPrecio: 'SI',
      atendioDudas: 'SI',
      ofrecioAlternativas: 'SI',
      realizoCobro: 'SI',
      entregoProducto: 'SI',
      agradecioCompra: 'SI',
      customerComments: 'Los clientes felicitaron la presentación visual del vaso domo con la gomita de tiburón y el toque picosito del escarchado de La Tóxica. Destacaron la rapidez en la entrega.',
    })
  );
  const [problems, setProblems] = useState<ProjectProblems>(() =>
    loadStored('problems', {
      production: {
        problem: 'Alta demanda simultánea durante el receso escolar que requería escarchar vasos a gran velocidad.',
        solution: 'Se organizó una línea de ensamblaje dividida: un integrante escarchaba vasos y otro servía las bebidas con dosificador.',
      },
      inventory: {
        problem: 'El hielo picado se derretía más rápido en las horas de mayor temperatura.',
        solution: 'Se conservó en hielera térmica hermética cerrada y se renovaron bloques de hielo a tiempo.',
      },
      sales: {
        problem: 'Varios clientes pagaban con billetes de $10 y $20 en los primeros 20 minutos de apertura.',
        solution: 'Se gestionó un fondo de cambio fraccionado en monedas de $0.25 y $1.00 para agilizar el vuelto.',
      },
      customerService: {
        problem: 'Muchos clientes consultaban al mismo tiempo los ingredientes y sabores de cada bebida.',
        solution: 'Se colocaron carteles informativos llamativos en el estand con el detalle de Blue Sharks y La Tóxica.',
      },
      teamwork: {
        problem: 'Coordinación entre quien cobraba en caja y quien entregaba los vasos en barra.',
        solution: 'Se implementaron roles fijos rotativos y el envío instantáneo de comanda a producción por WhatsApp.',
      },
      others: {
        problem: 'Espacio reducido en la mesa para exhibir los combos y decoración simultáneamente.',
        solution: 'Se optimizó la distribución vertical colocando carteles aéreos y despejando la barra de despacho.',
      },
    })
  );
  const [assessments, setAssessments] = useState<AreaAssessment[]>(() =>
    loadStored('assessments', [
      { area: 'Producción', workedWell: 'Estandarización de recetas con medidas fijas que garantizaron el mismo sabor en cada vaso.', hadDifficulties: 'Velocidad de escarchado de chamoy y tajín en horas pico.', toImprove: 'Tener vasos pre-escarchados listos antes de abrir el estand.' },
      { area: 'Inventario', workedWell: 'Conteo estricto de vasos, tapaderas y sorbetes al inicio y cierre.', hadDifficulties: 'Conservación del frío del hielo picado al mediodía.', toImprove: 'Utilizar una hielera de mayor grosor térmico.' },
      { area: 'Ventas', workedWell: 'El combo Dúo Letal a $4.00 tuvo una gran aceptación y aceleró el ingreso por cliente.', hadDifficulties: 'Disponibilidad de monedas de cambio en la primera media hora.', toImprove: 'Contar con un fondo de caja con al menos $20 en cambio fraccionado.' },
      { area: 'Atención al cliente', workedWell: 'Amabilidad, saludo cordial y explicación entusiasta del concepto temático.', hadDifficulties: 'Ruido ambiental en la plaza que dificultaba escuchar pedidos.', toImprove: 'Utilizar fichas numeradas para cada cliente en fila.' },
      { area: 'Publicidad', workedWell: 'La gira previa por los salones de clase creó una alta expectativa desde temprano.', hadDifficulties: 'Los afiches impresos se agotaron rápidamente.', toImprove: 'Diseñar afiches digitales para compartir por estados de WhatsApp.' },
      { area: 'Redes sociales', workedWell: 'Publicación de fotos del estand y conteo regresivo que motivó a los compañeros.', hadDifficulties: 'Poca señal de datos en ciertas áreas del instituto.', toImprove: 'Programar contenido automático con anticipación.' },
      { area: 'Estand', workedWell: 'Decoración llamativa con colores neón alusivos a Boom Drinks y menú visible.', hadDifficulties: 'Mesa estrecha para 3 personas en barra.', toImprove: 'Solicitar un mesón adicional de apoyo en la logística.' },
      { area: 'Finanzas', workedWell: 'Control digital exacto de cada venta y dinero ingresado sin faltantes.', hadDifficulties: 'Registro imprevisto de hielo adicional.', toImprove: 'Contemplar un rubro de imprevistos del 5% en el presupuesto.' },
      { area: 'Trabajo en equipo', workedWell: 'Excelente compañerismo, respeto y apoyo mutuo entre los 7 socios.', hadDifficulties: 'Cansancio físico acumulado tras varias horas de pie.', toImprove: 'Programar turnos de descanso rotativos de 10 minutos.' },
    ])
  );
  const [learnings, setLearnings] = useState<ProjectLearnings>(() =>
    loadStored('learnings', {
      productionLearning: 'Aprendimos que la estandarización mediante medidas fijas de insumos garantiza que cada cliente reciba la misma calidad y evita el desperdicio innecesario de materia prima.',
      salesLearning: 'Comprendimos que los combos estratégicos como el Dúo Letal ($4.00) incentivan la compra compartida y aumentan el volumen total de ventas mucho más rápido que los productos individuales.',
      customerLearning: 'Descubrimos que la amabilidad, la sonrisa y una explicación rápida del producto generan confianza y hacen que el cliente recomiende el negocio con sus compañeros.',
      moneyAndProfitsLearning: 'Entendimos la diferencia fundamental entre el ingreso bruto y la ganancia neta líquida, y la vital importancia de registrar cada centavo gastado para que la utilidad sea auténtica.',
      teamworkLearning: 'Valoramos que el éxito de una cooperativa no depende de una sola persona, sino de la sincronización de roles, el respeto mutuo y la ayuda solidaria ante los momentos de mayor afluencia.',
      differenceFromClassroomLearning: 'En el aula de clase los números son teóricos y estáticos; en la práctica real intervienen factores humanos como la velocidad de atención, el calor, la administración del cambio en efectivo y la presión del tiempo.',
    })
  );
  const [decisions, setDecisions] = useState<FutureDecisions>(() =>
    loadStored('decisions', {
      production: 'Estandarizar pre-mezclas en botellas dosificadoras herméticas para acelerar el servicio en un 50%.',
      inventory: 'Negociar precios al por mayor con proveedores locales de vasos domo para reducir el costo unitario.',
      sales: 'Mantener combos fijos y crear una tarjeta de cliente frecuente donde la 5ta bebida tenga 50% de descuento.',
      customerService: 'Entregar números de ficha plastificados para evitar cualquier confusión en la fila de entrega.',
      advertising: 'Crear videos cortos en TikTok mostrando la preparación llamativa de Blue Sharks y La Tóxica.',
      socialMedia: 'Habilitar pedidos anticipados por WhatsApp Business para entregar en horas específicas de receso.',
      boothOrganization: 'Diseñar un flujo en "L" con estación exclusiva de cobro y barra separada de despacho para evitar aglomeraciones.',
    })
  );
  const [metadata, setMetadata] = useState<ProjectMetadata>(() => loadStored('metadata', INITIAL_METADATA));
  const [selectedOrderForTicket, setSelectedOrderForTicket] = useState<SaleOrder | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
      localStorage.setItem(`${STORAGE_KEY}_production`, JSON.stringify(production));
      localStorage.setItem(`${STORAGE_KEY}_losses`, JSON.stringify(losses));
      localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
      localStorage.setItem(`${STORAGE_KEY}_partners`, JSON.stringify(partners));
      localStorage.setItem(`${STORAGE_KEY}_serviceRating`, JSON.stringify(serviceRating));
      localStorage.setItem(`${STORAGE_KEY}_problems`, JSON.stringify(problems));
      localStorage.setItem(`${STORAGE_KEY}_assessments`, JSON.stringify(assessments));
      localStorage.setItem(`${STORAGE_KEY}_learnings`, JSON.stringify(learnings));
      localStorage.setItem(`${STORAGE_KEY}_decisions`, JSON.stringify(decisions));
      localStorage.setItem(`${STORAGE_KEY}_metadata`, JSON.stringify(metadata));
    } catch {
      // ignore
    }
  }, [orders, production, losses, expenses, partners, serviceRating, problems, assessments, learnings, decisions, metadata]);

  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCouponState('none');
  };

  const setActiveCoupon = (coupon: CouponType) => {
    setActiveCouponState(coupon);
  };

  const generateProductionWhatsAppUrl = (order: SaleOrder): string => {
    const rawPhone = (metadata.productionPhone || '').replace(/[^0-9]/g, '');
    const phone = rawPhone.length === 8 ? `503${rawPhone}` : rawPhone;

    const itemsText = order.items
      .map((i) => `➡️ *${i.quantity}x ${i.productName}* ${i.type === 'combo' ? '(COMBO)' : ''}`)
      .join('\n');

    const msg = `🚨 *NUEVA ORDEN DE PRODUCCIÓN - BOOM DRINKS* ⚡
*Ticket N.°:* ORD-${String(order.orderNumber).padStart(4, '0')}
*Cliente / Aula:* ${order.customerName || 'Ventanilla'}
*Hora:* ${order.timestamp}
----------------------------------------
*ITEMS A PREPARAR:*
${itemsText}
----------------------------------------
¡Despachar de inmediato a ventanilla de entrega! 🦈🧪`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const completeSale = (cashReceived: number, customerName: string = 'Cliente en Feria'): SaleOrder => {
    const couponRule = COUPON_RULES.find((c) => c.id === activeCoupon) || COUPON_RULES[0];

    let rawSubtotal = 0;
    let discountTotal = 0;

    const items = cart.map((cartItem) => {
      const itemSubtotal = cartItem.product.price * cartItem.quantity;
      rawSubtotal += itemSubtotal;

      const eligibleForCoupon =
        cartItem.product.type !== 'combo' && couponRule.discountPercent > 0;

      let discountAmount = 0;
      if (eligibleForCoupon) {
        discountAmount = (itemSubtotal * couponRule.discountPercent) / 100;
        discountTotal += discountAmount;
      }

      const finalPrice = itemSubtotal - discountAmount;

      return {
        productId: cartItem.product.id,
        productName: cartItem.product.name,
        unitPrice: cartItem.product.price,
        quantity: cartItem.quantity,
        type: cartItem.product.type,
        itemSubtotal,
        eligibleForCoupon,
        discountAmount,
        finalPrice,
      };
    });

    const unroundedTotal = Math.max(0, rawSubtotal - discountTotal);
    const roundedTotal = roundCommercial(unroundedTotal);
    const effectiveCash = cashReceived >= roundedTotal ? cashReceived : roundedTotal;
    const cashChange = Math.max(0, effectiveCash - roundedTotal);

    const newOrder: SaleOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orders.length + 1,
      timestamp: new Date().toLocaleTimeString('es-SV', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }) + ` (${new Date().toLocaleDateString('es-SV')})`,
      customerName: customerName.trim() || `Cliente #${orders.length + 1}`,
      items,
      couponApplied: activeCoupon,
      couponLabel: couponRule.label,
      rawSubtotal: Number(rawSubtotal.toFixed(2)),
      discountTotal: Number(discountTotal.toFixed(2)),
      unroundedTotal: Number(unroundedTotal.toFixed(2)),
      total: Number(roundedTotal.toFixed(2)),
      cashReceived: Number(effectiveCash.toFixed(2)),
      cashChange: Number(cashChange.toFixed(2)),
      paymentMethod: 'efectivo',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setSelectedOrderForTicket(newOrder);

    // Disparador de confeti
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#10b981', '#6366f1'],
      });
    } catch {
      // ignore
    }

    return newOrder;
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrderForTicket?.id === orderId) {
      setSelectedOrderForTicket(null);
    }
  };

  const updateProduction = (data: Partial<ProductionData>) => setProduction((prev) => ({ ...prev, ...data }));
  const addLoss = (loss: Omit<LossItem, 'id'>) => setLosses((prev) => [...prev, { ...loss, id: `loss-${Date.now()}` }]);
  const deleteLoss = (id: string) => setLosses((prev) => prev.filter((l) => l.id !== id));
  const addExpense = (expense: Omit<ExpenseItem, 'id'>) => setExpenses((prev) => [...prev, { ...expense, id: `exp-${Date.now()}` }]);
  const deleteExpense = (id: string) => setExpenses((prev) => prev.filter((e) => e.id !== id));
  const updatePartner = (id: string, updated: Partial<Partner>) => setPartners((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  const updateServiceRating = (rating: Partial<CustomerServiceRating>) => setServiceRating((prev) => ({ ...prev, ...rating }));
  const updateProblems = (probs: Partial<ProjectProblems>) => setProblems((prev) => ({ ...prev, ...probs }));
  const updateAssessments = (newAssessments: AreaAssessment[]) => setAssessments(newAssessments);
  const updateLearnings = (newLearnings: Partial<ProjectLearnings>) => setLearnings((prev) => ({ ...prev, ...newLearnings }));
  const updateDecisions = (newDecisions: Partial<FutureDecisions>) => setDecisions((prev) => ({ ...prev, ...newDecisions }));
  const updateMetadata = (newMeta: Partial<ProjectMetadata>) => setMetadata((prev) => ({ ...prev, ...newMeta }));

  const resetToCleanFair = () => {
    setOrders([]);
    setLosses([]);
    setExpenses([]);
    clearCart();
    setProduction({
      plannedBlueSharks: 50,
      plannedLaToxica: 50,
      manualDamagedBlueSharks: 0,
      manualDamagedLaToxica: 0,
      explanationPlannedAchieved: 'Planificado: 50 unidades de Blue Sharks y 50 de La Tóxica. Elaboración bajo demanda en la feria.',
    });
  };

  // Computations
  let totalSales = 0;
  let blueSharksSold = 0;
  let laToxicaSold = 0;
  let duoLetalSold = 0;
  let doblePeligroSold = 0;
  let totalUnitsSold = 0;

  orders.forEach((order) => {
    totalSales += order.total;
    order.items.forEach((item) => {
      totalUnitsSold += item.quantity;
      if (item.productId === 'blue-sharks') blueSharksSold += item.quantity;
      else if (item.productId === 'la-toxica') laToxicaSold += item.quantity;
      else if (item.productId === 'duo-letal') duoLetalSold += item.quantity;
      else if (item.productId === 'doble-peligro') doblePeligroSold += item.quantity;
    });
  });

  const equivalentBlueSharksTotal = blueSharksSold + duoLetalSold * 1 + doblePeligroSold * 2;
  const equivalentLaToxicaTotal = laToxicaSold + duoLetalSold * 1 + doblePeligroSold * 2;
  const madeBlueSharks = equivalentBlueSharksTotal;
  const madeLaToxica = equivalentLaToxicaTotal;

  const totalCosts = expenses.reduce((sum, e) => sum + e.amount, 0);
  const initialCapitalContributed = partners.reduce((sum, p) => sum + p.capitalContributed, 0); // 7 * $20 = $140
  const netProfit = totalSales - totalCosts;

  let status: 'Ganancia' | 'Pérdida' | 'Recuperado sin ganancia' = 'Recuperado sin ganancia';
  if (netProfit > 0.009) status = 'Ganancia';
  else if (netProfit < -0.009) status = 'Pérdida';

  const capitalRecovered = Math.min(initialCapitalContributed, totalSales);
  const capitalPending = Math.max(0, initialCapitalContributed - totalSales);
  const isCapitalFullyRecovered = totalSales >= initialCapitalContributed && initialCapitalContributed > 0;

  let capitalStatus: 'Se recuperó totalmente' | 'Se recuperó parcialmente' | 'No se recuperó' = 'No se recuperó';
  if (isCapitalFullyRecovered) {
    capitalStatus = 'Se recuperó totalmente';
  } else if (totalSales > 0) {
    capitalStatus = 'Se recuperó parcialmente';
  }

  const totalLossesValue = losses.reduce((sum, l) => sum + l.estimatedValue, 0);
  const numPartners = 7;
  const profitPerPartner = netProfit > 0 ? netProfit / numPartners : 0;
  const totalReceivedPerPartner = capitalRecovered / numPartners + (netProfit > 0 ? profitPerPartner : 0);

  const totals = {
    totalSales: Number(totalSales.toFixed(2)),
    totalOrdersCount: orders.length,
    totalUnitsSold,
    blueSharksSold,
    laToxicaSold,
    duoLetalSold,
    doblePeligroSold,
    equivalentBlueSharksTotal,
    equivalentLaToxicaTotal,
    madeBlueSharks,
    madeLaToxica,
    totalCosts: Number(totalCosts.toFixed(2)),
    initialCapitalContributed: Number(initialCapitalContributed.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    capitalRecovered: Number(capitalRecovered.toFixed(2)),
    capitalPending: Number(capitalPending.toFixed(2)),
    isCapitalFullyRecovered,
    totalLossesValue: Number(totalLossesValue.toFixed(2)),
    profitPerPartner: Number(profitPerPartner.toFixed(2)),
    totalReceivedPerPartner: Number(totalReceivedPerPartner.toFixed(2)),
    status,
    capitalStatus,
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        activeCoupon,
        orders,
        production,
        losses,
        expenses,
        partners,
        serviceRating,
        problems,
        assessments,
        learnings,
        decisions,
        metadata,
        selectedOrderForTicket,
        setSelectedOrderForTicket,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setActiveCoupon,
        completeSale,
        deleteOrder,
        generateProductionWhatsAppUrl,
        updateProduction,
        addLoss,
        deleteLoss,
        addExpense,
        deleteExpense,
        updatePartner,
        updateServiceRating,
        updateProblems,
        updateAssessments,
        updateLearnings,
        updateDecisions,
        updateMetadata,
        resetToCleanFair,
        totals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

/* ==========================================================================
   4. TICKET MODAL COMPONENT (Con Comanda a Producción)
   ========================================================================== */

export const TicketModal: React.FC = () => {
  const { selectedOrderForTicket, setSelectedOrderForTicket, generateProductionWhatsAppUrl, metadata, deleteOrder } = useApp();

  if (!selectedOrderForTicket) return null;
  const order = selectedOrderForTicket;
  const productionUrl = generateProductionWhatsAppUrl(order);

  const handleDeleteThisTestOrder = () => {
    if (confirm(`¿Eliminar la orden ORD-${order.orderNumber}? Al ser una prueba, se descontará de las ventas, inventario y del reporte final.`)) {
      deleteOrder(order.id);
      setSelectedOrderForTicket(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden my-auto border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera de Confirmación */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-white/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-tight">¡Venta Registrada con Éxito!</h3>
              <p className="text-[11px] text-emerald-100 font-mono">
                Orden: ORD-{String(order.orderNumber).padStart(4, '0')} • Solo Efectivo
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedOrderForTicket(null)}
            className="rounded-xl p-1.5 text-emerald-100 hover:bg-white/20 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resumen Interno de la Venta para Caja y Despacho */}
        <div className="p-5 space-y-4 text-xs">
          {/* Despacho a Producción por WhatsApp */}
          <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                <ChefHat className="h-4 w-4 text-indigo-600" />
                Comanda de Cocina / Producción
              </span>
              <span className="text-[10px] bg-indigo-200/80 text-indigo-900 font-extrabold px-2 py-0.5 rounded-full font-mono">
                {metadata.productionPhone ? `Tel: ${metadata.productionPhone}` : 'Sin número'}
              </span>
            </div>
            <p className="text-[11px] text-indigo-800">
              Presiona para avisar al equipo de producción por WhatsApp para que preparen el pedido:
            </p>
            <a
              href={productionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs transition shadow-xs"
            >
              <ChefHat className="h-4 w-4" />
              <span>Enviar Pedido a Producción por WhatsApp</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-80 ml-auto" />
            </a>
          </div>

          {/* Detalle de Bebidas Preparadas */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex justify-between">
              <span>Bebidas Despachadas</span>
              <span className="font-mono text-slate-500">Cliente: {order.customerName}</span>
            </div>
            <div className="space-y-1.5 divide-y divide-slate-200/60 pt-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pt-1.5 text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-cyan-800 font-mono bg-cyan-100 px-2 py-0.5 rounded-md text-xs">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold text-slate-900">{item.productName}</span>
                    {item.type === 'combo' && (
                      <span className="text-[9px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded">
                        Combo
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold">${item.itemSubtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cuadro de Cobro y Vuelto */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex justify-between items-center text-slate-700">
              <span>Subtotal:</span>
              <span className="font-mono">${order.rawSubtotal.toFixed(2)}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between items-center text-emerald-800 font-semibold">
                <span>Descuento aplicado ({order.couponLabel}):</span>
                <span className="font-mono">-${order.discountTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-slate-900 font-extrabold text-sm pt-1 border-t border-emerald-200">
              <span>TOTAL COBRADO (EFECTIVO):</span>
              <span className="font-mono text-emerald-800 text-base">${order.total.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/60 text-[11px]">
              <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                <span className="text-slate-500 block text-[10px]">Efectivo Recibido:</span>
                <span className="font-mono font-bold text-slate-900 text-xs">${order.cashReceived.toFixed(2)}</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                <span className="text-slate-500 block text-[10px]">Cambio / Vuelto:</span>
                <span className="font-mono font-extrabold text-emerald-700 text-xs">${order.cashChange.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botón para Borrar Orden si fue de Prueba */}
          <div className="pt-1">
            <button
              onClick={handleDeleteThisTestOrder}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>¿Fue una orden de prueba? Haz clic para borrarla del sistema</span>
            </button>
          </div>
        </div>

        {/* Barra Inferior: Solo botón de Cerrar / Siguiente Venta (SIN botón de imprimir) */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setSelectedOrderForTicket(null)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 font-extrabold text-xs text-white transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>Listo • Registrar Siguiente Venta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   5. POS VIEW COMPONENT
   ========================================================================== */

export const PosView: React.FC = () => {
  const {
    products,
    cart,
    activeCoupon,
    addToCart,
    updateQuantity,
    clearCart,
    setActiveCoupon,
    completeSale,
    metadata,
    updateMetadata,
    totals,
    generateProductionWhatsAppUrl,
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [cashReceivedInput, setCashReceivedInput] = useState('');
  const [showPhoneConfig, setShowPhoneConfig] = useState(false);
  const [autoSendToKitchen, setAutoSendToKitchen] = useState(true);

  const currentCoupon = COUPON_RULES.find((c) => c.id === activeCoupon) || COUPON_RULES[0];

  let rawSubtotal = 0;
  let discountTotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.product.price * item.quantity;
    rawSubtotal += itemTotal;
    const isEligible = item.product.type !== 'combo' && currentCoupon.discountPercent > 0;
    if (isEligible) {
      discountTotal += (itemTotal * currentCoupon.discountPercent) / 100;
    }
  });

  const unroundedTotal = Math.max(0, rawSubtotal - discountTotal);
  const finalTotal = roundCommercial(unroundedTotal);
  const cashNum = parseFloat(cashReceivedInput) || 0;
  const changeToReturn = cashNum >= finalTotal ? cashNum - finalTotal : 0;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const effectiveCash = cashNum > 0 ? cashNum : finalTotal;
    const newOrder = completeSale(effectiveCash, customerName || undefined);

    // Envío automático al número de WhatsApp de producción
    if (autoSendToKitchen && metadata.productionPhone?.trim()) {
      const prodUrl = generateProductionWhatsAppUrl(newOrder);
      window.open(prodUrl, '_blank');
    }

    setCashReceivedInput('');
    setCustomerName('');
  };

  return (
    <div className="space-y-6">
      {/* Alerta de Capital Recuperado */}
      {totals.isCapitalFullyRecovered ? (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between border-2 border-emerald-300 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <PartyPopper className="h-6 w-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
                ¡ALERTA: CAPITAL RECUPERADO AL 100%! 🎉
              </h3>
              <p className="text-xs text-emerald-100">
                Se han recuperado con éxito los <strong>${totals.initialCapitalContributed.toFixed(2)}</strong> de los 7 socios ($20.00 c/u). ¡Todas las ventas a partir de ahora generan <strong>GANANCIA NETA</strong>!
              </p>
            </div>
          </div>
          <div className="text-right font-mono hidden sm:block">
            <span className="text-[10px] text-emerald-200 block uppercase">Recaudado</span>
            <span className="font-extrabold text-lg text-white">${totals.totalSales.toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xs border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <span className="font-bold text-slate-200">
                Progreso de Recuperación:
              </span>{' '}
              <span className="text-cyan-300 font-mono font-bold">
                ${totals.totalSales.toFixed(2)} de ${totals.initialCapitalContributed.toFixed(2)}
              </span>{' '}
              <span className="text-slate-400">(7 socios x $20.00 c/u)</span>
            </div>
          </div>
          <div className="w-full sm:w-48 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-2.5 transition-all duration-300"
              style={{
                width: `${Math.min(100, totals.initialCapitalContributed > 0 ? (totals.totalSales / totals.initialCapitalContributed) * 100 : 0)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* POS Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Menu (Col 1-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Waves className="h-4 w-4 text-cyan-600" />
                Bebidas Individuales
              </h3>
              <span className="text-xs text-slate-500 font-medium">Aceptan cupones de 10%, 15% y 20%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products
                .filter((p) => p.type === 'drink')
                .map((product) => {
                  const isBlueShark = product.id === 'blue-sharks';
                  return (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${
                        isBlueShark
                          ? 'bg-gradient-to-br from-cyan-50 via-blue-50 to-white border-cyan-300 hover:border-cyan-500'
                          : 'bg-gradient-to-br from-emerald-50 via-lime-50 to-white border-emerald-300 hover:border-emerald-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isBlueShark ? 'bg-cyan-100 text-cyan-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {product.badge}
                        </span>
                        <span className="text-xl font-extrabold text-slate-900 font-mono">${product.price.toFixed(2)}</span>
                      </div>
                      <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-cyan-700 transition">{product.name}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                      <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-500 flex items-center gap-1"><Tag className="h-3 w-3 text-cyan-600" /> Cupón OK</span>
                        <span className="inline-flex items-center gap-1 text-cyan-700 font-bold"><Plus className="h-3.5 w-3.5" /> Agregar</span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-500" />
                Combos Promocionales
              </h3>
              <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Precio fijo promocional • No aplican cupones
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products
                .filter((p) => p.type === 'combo')
                .map((product) => {
                  const isDuo = product.id === 'duo-letal';
                  return (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${
                        isDuo
                          ? 'bg-gradient-to-br from-purple-50 via-indigo-50 to-white border-purple-300 hover:border-purple-500'
                          : 'bg-gradient-to-br from-rose-50 via-amber-50 to-white border-rose-300 hover:border-rose-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isDuo ? 'bg-purple-100 text-purple-800' : 'bg-rose-100 text-rose-800'}`}>
                          {product.badge}
                        </span>
                        <span className="text-xl font-extrabold text-slate-900 font-mono">${product.price.toFixed(2)}</span>
                      </div>
                      <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-purple-700 transition">{product.name}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                      <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold">
                        <span className="text-amber-700 font-medium">⚡ {isDuo ? '1 BS + 1 Tóxica' : '2 BS + 2 Tóxica'}</span>
                        <span className="inline-flex items-center gap-1 text-purple-700 font-bold"><Plus className="h-3.5 w-3.5" /> Agregar</span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Configuration del Número de Producción */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <ChefHat className="h-4 w-4 text-indigo-600" />
                Número de WhatsApp de Producción (Cocina):
              </span>
              <button
                type="button"
                onClick={() => setShowPhoneConfig(!showPhoneConfig)}
                className="text-[11px] text-indigo-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Settings className="h-3 w-3" />
                {showPhoneConfig ? 'Cerrar' : 'Modificar Número'}
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Ingresa aquí el número de producción (Ej: 70000000 o 50370000000)"
                value={metadata.productionPhone}
                onChange={(e) => updateMetadata({ productionPhone: e.target.value })}
                className="flex-1 p-2 bg-white rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 whitespace-nowrap">
                {metadata.productionPhone ? '✅ Asignado' : '⚠️ Sin número'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Cada venta registrada enviará la orden inmediatamente a este número de WhatsApp para que el equipo prepare el pedido.
            </p>
          </div>
        </div>

        {/* Register Drawer (Col 8-12) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-cyan-400" />
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide">CAJA REGISTRADORA</h3>
                  <p className="text-[10px] text-slate-400">Solo Efectivo • Boom Drinks</p>
                </div>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-300 hover:text-rose-100 flex items-center gap-1 transition px-2 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60"
                >
                  <Trash2 className="h-3 w-3" /> Vaciar
                </button>
              )}
            </div>

            <div className="p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <Boxes className="h-10 w-10 mx-auto stroke-1 text-slate-300" />
                  <p className="text-xs font-medium">No hay bebidas seleccionadas</p>
                  <p className="text-[11px] text-slate-400">Toca las bebidas del menú para agregarlas.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cart.map((item) => {
                    const itemTotal = item.product.price * item.quantity;
                    const isEligible = item.product.type !== 'combo' && currentCoupon.discountPercent > 0;
                    return (
                      <div key={item.product.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                        <div className="flex-1 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{item.product.name}</span>
                            {item.product.type === 'combo' && (
                              <span className="text-[9px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded">Combo</span>
                            )}
                            {isEligible && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">-{currentCoupon.discountPercent}%</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">${item.product.price.toFixed(2)} c/u</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-slate-600 hover:bg-slate-100 transition"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800 font-mono">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-slate-600 hover:bg-slate-100 transition"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-mono font-bold text-xs text-slate-900 min-w-[50px] text-right">${itemTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Cupones con el 20% incluido */}
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5 text-cyan-600" /> Cupones de Descuento</span>
                  <span className="text-[10px] text-slate-500">Solo bebidas individuales</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COUPON_RULES.map((coupon) => {
                    const isSelected = activeCoupon === coupon.id;
                    return (
                      <button
                        key={coupon.id}
                        type="button"
                        onClick={() => setActiveCoupon(coupon.id)}
                        className={`p-2 rounded-xl text-center border transition-all text-xs ${
                          isSelected
                            ? 'border-cyan-600 bg-cyan-50/80 text-cyan-900 font-bold ring-2 ring-cyan-500/20'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-bold">{coupon.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cliente */}
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Nombre del Cliente / Aula (Opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Mario (2° Bachillerato)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>

                <label className="flex items-center gap-2 p-2 bg-indigo-50/60 rounded-xl border border-indigo-200 cursor-pointer text-[11px] text-indigo-950">
                  <input
                    type="checkbox"
                    checked={autoSendToKitchen}
                    onChange={(e) => setAutoSendToKitchen(e.target.checked)}
                    className="h-3.5 w-3.5 text-indigo-600 rounded cursor-pointer"
                  />
                  <span>
                    👨‍🍳 <strong>Enviar automáticamente orden a Producción por WhatsApp</strong>
                  </span>
                </label>
              </div>

              {/* Totales y Redondeo */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium">${rawSubtotal.toFixed(2)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Descuento aplicado:</span>
                    <span className="font-mono">-${discountTotal.toFixed(2)}</span>
                  </div>
                )}
                {finalTotal !== unroundedTotal && discountTotal > 0 && (
                  <div className="flex justify-between text-[11px] text-cyan-800 bg-cyan-100/60 px-2 py-1 rounded">
                    <span>Redondeo ($0.05):</span>
                    <span className="font-mono font-bold">${unroundedTotal.toFixed(2)} → ${finalTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>TOTAL A COBRAR (EFECTIVO):</span>
                  <span className="font-mono text-cyan-700 text-lg">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Vuelto y Billetes Comunes */}
              {finalTotal > 0 && (
                <div className="space-y-2 bg-cyan-50/50 p-3 rounded-2xl border border-cyan-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-950 flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-cyan-700" /> Efectivo y Vuelto:
                    </span>
                    <span className="text-[11px] text-cyan-800">
                      Cambio: <strong className="text-emerald-700 font-mono text-sm">${changeToReturn.toFixed(2)}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      placeholder="Monto recibido $"
                      value={cashReceivedInput}
                      onChange={(e) => setCashReceivedInput(e.target.value)}
                      className="flex-1 text-sm font-mono font-bold p-2 rounded-xl border border-cyan-300 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setCashReceivedInput(finalTotal.toFixed(2))}
                      className="px-3 py-2 text-xs font-bold bg-cyan-200 text-cyan-900 rounded-xl hover:bg-cyan-300 transition"
                    >
                      Exacto
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {[5, 10, 20].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCashReceivedInput(val.toFixed(2))}
                        className="flex-1 py-1.5 text-xs font-extrabold rounded-xl border border-cyan-200 bg-white text-cyan-900 hover:bg-cyan-100 transition shadow-xs"
                      >
                        Billete ${val}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  cart.length > 0
                    ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Zap className="h-4 w-4" />
                REGISTRAR VENTA Y ENVIAR A COCINA (${finalTotal.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   6. SALES HISTORY VIEW
   ========================================================================== */

export const SalesHistoryView: React.FC = () => {
  const { orders, totals, deleteOrder, generateProductionWhatsAppUrl, resetToCleanFair } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((o) =>
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(o.orderNumber).includes(searchTerm) ||
    o.items.some((i) => i.productName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Ticket #', 'Fecha/Hora', 'Cliente', 'Productos', 'Cupón', 'Subtotal', 'Descuento', 'Total Pagado'];
    const rows = orders.map((o) => [
      `ORD-${o.orderNumber}`,
      `"${o.timestamp}"`,
      `"${o.customerName || 'Cliente'}"`,
      `"${o.items.map((i) => `${i.quantity}x ${i.productName}`).join('; ')}"`,
      `"${o.couponLabel}"`,
      o.rawSubtotal.toFixed(2),
      o.discountTotal.toFixed(2),
      o.total.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `BoomDrinks_Ventas_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const handleClearAllTestOrders = () => {
    if (orders.length === 0) return;
    if (confirm('⚠️ ¿Estás seguro de ELIMINAR TODAS las ventas registradas hasta ahora?\n\nEsta opción borrará todas las órdenes de prueba para dejar la caja en $0.00 exactos para la feria real.')) {
      resetToCleanFair();
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de ayuda para pruebas */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-amber-900">
          <span className="p-1.5 bg-amber-100 rounded-lg text-amber-800 font-bold">🧪</span>
          <div>
            <span className="font-bold">Control de Ventas y Pruebas:</span> Puedes borrar cualquier orden de prueba individualmente en la tabla. Las órdenes eliminadas <strong>no saldrán en el informe final</strong> ni afectarán las estadísticas.
          </div>
        </div>
        {orders.length > 0 && (
          <button
            onClick={handleClearAllTestOrders}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-300 rounded-xl transition shadow-xs whitespace-nowrap cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Borrar TODAS las pruebas ({orders.length})</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold uppercase text-slate-500">Total Ventas</span>
          <div className="text-2xl font-black text-slate-900 font-mono">${totals.totalSales.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold uppercase text-slate-500">Órdenes Registradas</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totals.totalOrdersCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold uppercase text-slate-500">Ticket Promedio</span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ${orders.length > 0 ? (totals.totalSales / orders.length).toFixed(2) : '0.00'}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold uppercase text-slate-500">Bebidas Despachadas</span>
          <div className="text-2xl font-black text-cyan-700 font-mono">
            {totals.equivalentBlueSharksTotal + totals.equivalentLaToxicaTotal}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente o número de orden..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={orders.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50 cursor-pointer"
          >
            <Download className="h-4 w-4" /> Exportar a Excel (CSV)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            {orders.length === 0 ? 'No hay ventas registradas aún. Todas las pruebas han sido eliminadas o la caja está lista para la feria.' : 'No se encontraron resultados.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Orden #</th>
                  <th className="py-3 px-4">Fecha y Hora</th>
                  <th className="py-3 px-4">Cliente / Aula</th>
                  <th className="py-3 px-4">Detalle de Bebidas</th>
                  <th className="py-3 px-4">Cupón</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Acciones (WhatsApp y Borrar)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      ORD-{String(order.orderNumber).padStart(4, '0')}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{order.timestamp}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{order.customerName}</td>
                    <td className="py-3 px-4">
                      {order.items.map((i, idx) => (
                        <div key={idx} className="text-[11px] text-slate-700">
                          <span className="font-bold text-cyan-800 font-mono">{i.quantity}x</span> {i.productName}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4">
                      {order.discountTotal > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {order.couponLabel} (-${order.discountTotal.toFixed(2)})
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Sin descuento</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-sm text-slate-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={generateProductionWhatsAppUrl(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Enviar o Re-enviar Comanda a Producción por WhatsApp"
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
                        >
                          <ChefHat className="h-3.5 w-3.5 text-indigo-600" />
                          <span className="text-[11px]">Cocina</span>
                        </a>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la orden de prueba ORD-${String(order.orderNumber).padStart(4, '0')}?\n\nAl borrarla, se descontará automáticamente del dinero total, inventario y no aparecerá en el reporte final.`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          title="Borrar venta de prueba"
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Borrar prueba</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   7. PRODUCTION & INVENTORY VIEW
   ========================================================================== */

export const ProductionInventoryView: React.FC = () => {
  const { production, updateProduction, losses, addLoss, deleteLoss, totals, metadata, updateMetadata } = useApp();
  const [lossType, setLossType] = useState<'Merma de materia prima' | 'Producto dañado' | 'Producto no vendido' | 'Desperdicio' | 'Otros'>('Producto dañado');
  const [lossDesc, setLossDesc] = useState('');
  const [lossQty, setLossQty] = useState('1');
  const [lossCause, setLossCause] = useState('');
  const [lossVal, setLossVal] = useState('2.00');

  const totalPlanned = 100; // 50 BS + 50 LT
  const totalMade = totals.madeBlueSharks + totals.madeLaToxica;
  const damagedTotal = (production.manualDamagedBlueSharks || 0) + (production.manualDamagedLaToxica || 0);
  const remainingTotal = Math.max(0, 100 - totalMade - damagedTotal);

  const handleAddLoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lossDesc.trim() || !lossCause.trim()) return;
    addLoss({
      lossType,
      description: lossDesc.trim(),
      quantity: parseInt(lossQty) || 1,
      cause: lossCause.trim(),
      estimatedValue: parseFloat(lossVal) || 0,
    });
    setLossDesc('');
    setLossCause('');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold uppercase tracking-wider">
            Sección III del Informe INSAB
          </span>
          <h2 className="text-lg font-extrabold text-slate-900 mt-1">Resultados de Producción</h2>
          <p className="text-xs text-slate-500">Planificados: 50 Blue Sharks y 50 La Tóxica. Elaborados y vendidos sincronizados con la Caja.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
            <h4 className="font-bold text-sm text-blue-900">🦈 Blue Sharks ($2.50) - Meta: 50</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl text-center"><span className="text-[10px] text-slate-400 block">Planificados</span><strong>50</strong></div>
              <div className="bg-emerald-50 p-2 rounded-xl text-center text-emerald-800"><span className="text-[10px] block">Elaborados</span><strong className="text-sm">{totals.madeBlueSharks}</strong></div>
              <div className="bg-white p-2 rounded-xl text-center text-rose-700">
                <span className="text-[10px] block">Dañados (Manual)</span>
                <input
                  type="number"
                  min="0"
                  value={production.manualDamagedBlueSharks}
                  onChange={(e) => updateProduction({ manualDamagedBlueSharks: parseInt(e.target.value) || 0 })}
                  className="w-full text-center font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <h4 className="font-bold text-sm text-emerald-900">🧪 La Tóxica ($2.00) - Meta: 50</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl text-center"><span className="text-[10px] text-slate-400 block">Planificados</span><strong>50</strong></div>
              <div className="bg-emerald-50 p-2 rounded-xl text-center text-emerald-800"><span className="text-[10px] block">Elaborados</span><strong className="text-sm">{totals.madeLaToxica}</strong></div>
              <div className="bg-white p-2 rounded-xl text-center text-rose-700">
                <span className="text-[10px] block">Dañados (Manual)</span>
                <input
                  type="number"
                  min="0"
                  value={production.manualDamagedLaToxica}
                  onChange={(e) => updateProduction({ manualDamagedLaToxica: parseInt(e.target.value) || 0 })}
                  className="w-full text-center font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-4">CONCEPTO</th>
                <th className="py-2.5 px-4 text-center">Blue Sharks</th>
                <th className="py-2.5 px-4 text-center">La Tóxica</th>
                <th className="py-2.5 px-4 text-center font-extrabold bg-slate-200/50">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-4 font-medium">Productos planificados</td>
                <td className="py-2 px-4 text-center font-mono">50</td>
                <td className="py-2 px-4 text-center font-mono">50</td>
                <td className="py-2 px-4 text-center font-bold font-mono bg-slate-50">100</td>
              </tr>
              <tr className="bg-emerald-50/40">
                <td className="py-2 px-4 font-bold text-emerald-950">Productos elaborados (en ventas)</td>
                <td className="py-2 px-4 text-center font-mono font-bold text-blue-700">{totals.madeBlueSharks}</td>
                <td className="py-2 px-4 text-center font-mono font-bold text-emerald-700">{totals.madeLaToxica}</td>
                <td className="py-2 px-4 text-center font-mono font-extrabold text-emerald-950 bg-emerald-100/50">{totalMade}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium">Productos entregados a Ventas</td>
                <td className="py-2 px-4 text-center font-mono">{totals.madeBlueSharks}</td>
                <td className="py-2 px-4 text-center font-mono">{totals.madeLaToxica}</td>
                <td className="py-2 px-4 text-center font-bold font-mono bg-slate-50">{totalMade}</td>
              </tr>
              <tr className="bg-emerald-50/60">
                <td className="py-2 px-4 font-bold text-emerald-950">Productos vendidos (Total equivalente)</td>
                <td className="py-2 px-4 text-center font-mono font-bold text-blue-800">{totals.equivalentBlueSharksTotal}</td>
                <td className="py-2 px-4 text-center font-mono font-bold text-emerald-800">{totals.equivalentLaToxicaTotal}</td>
                <td className="py-2 px-4 text-center font-mono font-black text-emerald-950 bg-emerald-100/60">{totalMade}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium text-rose-800">Productos dañados o perdidos</td>
                <td className="py-2 px-4 text-center font-mono text-rose-700">{production.manualDamagedBlueSharks || 0}</td>
                <td className="py-2 px-4 text-center font-mono text-rose-700">{production.manualDamagedLaToxica || 0}</td>
                <td className="py-2 px-4 text-center font-mono font-bold bg-rose-50 text-rose-800">{damagedTotal}</td>
              </tr>
              <tr className="bg-slate-100 font-bold">
                <td className="py-2 px-4 text-slate-900">Productos restantes (meta)</td>
                <td className="py-2 px-4 text-center font-mono">{Math.max(0, 50 - totals.madeBlueSharks - (production.manualDamagedBlueSharks || 0))}</td>
                <td className="py-2 px-4 text-center font-mono">{Math.max(0, 50 - totals.madeLaToxica - (production.manualDamagedLaToxica || 0))}</td>
                <td className="py-2 px-4 text-center font-mono font-black bg-slate-200">{remainingTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mermas */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold uppercase tracking-wider">
            Sección V: Mermas y Desperdicios
          </span>
          <span className="text-xs font-bold text-rose-700 font-mono">Total Mermas: ${totals.totalLossesValue.toFixed(2)}</span>
        </div>

        <form onSubmit={handleAddLoss} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
          <select value={lossType} onChange={(e) => setLossType(e.target.value as any)} className="p-2 bg-white rounded-lg border border-slate-300">
            <option value="Merma de materia prima">Merma materia prima</option>
            <option value="Producto dañado">Producto dañado</option>
            <option value="Producto no vendido">Producto no vendido</option>
            <option value="Desperdicio">Desperdicio</option>
            <option value="Otros">Otros</option>
          </select>
          <input type="text" placeholder="Descripción..." value={lossDesc} onChange={(e) => setLossDesc(e.target.value)} className="p-2 bg-white rounded-lg border border-slate-300" />
          <input type="number" min="1" value={lossQty} onChange={(e) => setLossQty(e.target.value)} className="p-2 bg-white rounded-lg border border-slate-300 text-center font-mono" />
          <input type="text" placeholder="Causa..." value={lossCause} onChange={(e) => setLossCause(e.target.value)} className="p-2 bg-white rounded-lg border border-slate-300" />
          <div className="flex gap-1">
            <input type="number" step="0.05" value={lossVal} onChange={(e) => setLossVal(e.target.value)} className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono font-bold" />
            <button type="submit" className="px-3 bg-cyan-600 text-white rounded-lg font-bold">Agregar</button>
          </div>
        </form>

        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          {losses.length === 0 ? (
            <div className="py-6 text-center text-slate-400">Sin pérdidas registradas actualmente.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 font-bold border-b border-slate-200">
                <tr><th className="p-2.5">Tipo</th><th className="p-2.5">Descripción</th><th className="p-2.5 text-center">Cant.</th><th className="p-2.5">Causa</th><th className="p-2.5 text-right">Valor</th><th className="p-2.5 text-center"></th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {losses.map((l) => (
                  <tr key={l.id}>
                    <td className="p-2.5 font-bold">{l.lossType}</td><td className="p-2.5">{l.description}</td><td className="p-2.5 text-center font-mono">{l.quantity}</td><td className="p-2.5">{l.cause}</td><td className="p-2.5 text-right font-mono font-bold text-rose-700">${l.estimatedValue.toFixed(2)}</td>
                    <td className="p-2.5 text-center"><button onClick={() => deleteLoss(l.id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   8. FINANCES & 7 PARTNERS VIEW
   ========================================================================== */

export const FinancesPartnersView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, partners, updatePartner, totals } = useApp();
  const [expenseCat, setExpenseCat] = useState<'Materia prima' | 'Vasos y empaques' | 'Hielo y conservación' | 'Publicidad y estand' | 'Transporte' | 'Otros'>('Materia prima');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('10.00');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc.trim()) return;
    addExpense({ category: expenseCat, description: expenseDesc.trim(), amount: parseFloat(expenseAmount) || 0 });
    setExpenseDesc('');
  };

  return (
    <div className="space-y-8">
      {/* Alerta de Capital Recuperado */}
      {totals.isCapitalFullyRecovered ? (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white p-5 rounded-3xl shadow-xl flex items-center justify-between border-2 border-emerald-300">
          <div className="flex items-center gap-3">
            <PartyPopper className="h-7 w-7 text-yellow-300" />
            <div>
              <h3 className="font-black text-sm uppercase">¡ALERTA: CAPITAL RECUPERADO AL 100%! ($140.00) 🎉</h3>
              <p className="text-xs text-emerald-100">Se han recuperado los $140.00 aportados por los 7 socios ($20.00 cada uno). Todas las ventas a partir de ahora son ganancias netas.</p>
            </div>
          </div>
          <span className="text-xl font-black font-mono">${totals.totalSales.toFixed(2)}</span>
        </div>
      ) : (
        <div className="bg-amber-500/10 border-2 border-amber-500/30 text-amber-950 p-4 rounded-3xl flex items-center justify-between text-xs">
          <div>
            <strong>Capital Pendiente de Recuperar: ${totals.capitalPending.toFixed(2)} de ${totals.initialCapitalContributed.toFixed(2)}</strong>
            <p className="text-[11px] text-amber-800">Al alcanzar los $140.00 de ventas se activará la alerta oficial de recuperación.</p>
          </div>
          <span className="font-mono font-bold text-sm">
            {totals.initialCapitalContributed > 0 ? Math.round((totals.totalSales / totals.initialCapitalContributed) * 100) : 0}%
          </span>
        </div>
      )}

      {/* Resumen Final */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div>
            <span className="text-xs font-bold uppercase text-cyan-300">Sección XVIII: Cierre Contable</span>
            <h2 className="text-lg font-black">Resultado Final del Negocio (7 Socios)</h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-white/10 text-emerald-300">Estado: {totals.status}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/5 p-3 rounded-2xl"><span className="text-slate-400 block">CAPITAL INVERTIDO</span><strong className="text-base font-mono">${totals.initialCapitalContributed.toFixed(2)}</strong></div>
          <div className="bg-white/5 p-3 rounded-2xl"><span className="text-slate-400 block">TOTAL VENDIDO</span><strong className="text-base font-mono text-cyan-400">${totals.totalSales.toFixed(2)}</strong></div>
          <div className="bg-white/5 p-3 rounded-2xl"><span className="text-slate-400 block">COSTOS TOTALES</span><strong className="text-base font-mono text-amber-300">${totals.totalCosts.toFixed(2)}</strong></div>
          <div className="bg-white/5 p-3 rounded-2xl"><span className="text-slate-400 block">GANANCIA NETA</span><strong className="text-base font-mono text-emerald-400">${totals.netProfit.toFixed(2)}</strong></div>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
          <span>Ganancia por cada uno de los 7 socios: <strong className="text-cyan-300 font-mono text-sm">${totals.profitPerPartner.toFixed(2)}</strong></span>
          <span className="bg-emerald-500/20 px-3 py-1 rounded-xl text-emerald-300 font-bold">
            Total a recibir por socio: ${totals.totalReceivedPerPartner.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tabla 7 Socios */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-lg text-xs font-bold uppercase tracking-wider">
            Sección VIII: Distribución entre los 7 Socios ($20.00 aportados c/u)
          </span>
          <span className="text-xs font-bold font-mono text-teal-800">Total: $140.00</span>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">N.º</th>
                <th className="p-3">SOCIO</th>
                <th className="p-3">ROL</th>
                <th className="p-3 text-right">APORTE</th>
                <th className="p-3 text-right">GANANCIA</th>
                <th className="p-3 text-right font-extrabold bg-teal-50">TOTAL RECIBIDO</th>
                <th className="p-3 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {partners.map((p, idx) => {
                const isEditing = editingId === p.id;
                const gain = totals.netProfit > 0 ? totals.netProfit / 7 : 0;
                const totalPayout = p.capitalContributed + gain;

                if (isEditing) {
                  return (
                    <tr key={p.id} className="bg-teal-50/50">
                      <td className="p-3 font-mono">{idx + 1}</td>
                      <td className="p-3"><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="p-1 bg-white border border-teal-300 rounded w-full font-bold" /></td>
                      <td className="p-3"><input type="text" value={editRole} onChange={(e) => setEditRole(e.target.value)} className="p-1 bg-white border border-teal-300 rounded w-full" /></td>
                      <td className="p-3 text-right font-mono">${p.capitalContributed.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono">${gain.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold">${totalPayout.toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <button onClick={() => { updatePartner(p.id, { name: editName, role: editRole }); setEditingId(null); }} className="px-2 py-1 bg-emerald-600 text-white rounded font-bold">Guardar</button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3 text-slate-600">{p.role}</td>
                    <td className="p-3 text-right font-mono font-bold">${p.capitalContributed.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600">${gain.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-extrabold text-teal-900 bg-teal-50/50">${totalPayout.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => { setEditingId(p.id); setEditName(p.name); setEditRole(p.role); }} className="p-1 text-slate-400 hover:text-cyan-700">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   9. QUALITATIVE ASSESSMENT VIEW
   ========================================================================== */

export const QualitativeAssessmentView: React.FC = () => {
  const { serviceRating, updateServiceRating, problems, updateProblems, learnings, updateLearnings, metadata, updateMetadata } = useApp();

  return (
    <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-200 text-xs">
      <div className="border-b border-slate-100 pb-3">
        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold uppercase tracking-wider">
          Sección X: Valoración de la Atención al Cliente
        </span>
        <h3 className="text-base font-extrabold text-slate-900 mt-1">Evaluación del Servicio y Experiencia</h3>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 font-bold border-b border-slate-200">
            <tr><th className="p-2.5">ASPECTO</th><th className="p-2.5 text-center">SÍ</th><th className="p-2.5 text-center">NO</th><th className="p-2.5 text-center">DEBE MEJORARSE</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { k: 'saludoCordial', l: 'Se saludó cordialmente' },
              { k: 'explicoProducto', l: 'Se explicó el producto (Blue Sharks / La Tóxica)' },
              { k: 'informoPrecio', l: 'Se informó el precio' },
              { k: 'atendioDudas', l: 'Se atendieron dudas' },
              { k: 'ofrecioAlternativas', l: 'Se ofrecieron alternativas (Combos)' },
              { k: 'realizoCobro', l: 'Se realizó correctamente el cobro' },
              { k: 'entregoProducto', l: 'Se entregó correctamente el producto' },
              { k: 'agradecioCompra', l: 'Se agradeció la compra' },
            ].map(({ k, l }) => (
              <tr key={k}>
                <td className="p-2.5 font-medium">{l}</td>
                <td className="p-2.5 text-center"><input type="radio" checked={(serviceRating as any)[k] === 'SI'} onChange={() => updateServiceRating({ [k]: 'SI' })} /></td>
                <td className="p-2.5 text-center"><input type="radio" checked={(serviceRating as any)[k] === 'NO'} onChange={() => updateServiceRating({ [k]: 'NO' })} /></td>
                <td className="p-2.5 text-center"><input type="radio" checked={(serviceRating as any)[k] === 'DEBE_MEJORARSE'} onChange={() => updateServiceRating({ [k]: 'DEBE_MEJORARSE' })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <label className="block font-bold mb-1">Comentarios recibidos de clientes:</label>
        <textarea rows={2} value={serviceRating.customerComments} onChange={(e) => updateServiceRating({ customerComments: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50" />
      </div>
    </div>
  );
};

/* ==========================================================================
   10. EVIDENCE & CHECKLIST VIEW
   ========================================================================== */

export const EvidencePortfolioView: React.FC = () => {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'Datos generales del negocio': true,
    'Resultados de producción': true,
    'Unidades vendidas': true,
    'Ingresos por ventas': true,
    'Mermas': true,
    'Desperdicios': true,
    'Capital de inversión': true,
    'Capital recuperado': true,
    'Ganancia o pérdida': true,
    'Distribución entre socios': true,
    'Fotografías de la Gira Publicitaria': true,
    'Fotografías del estand': true,
    'Fotografías de clientes/interacción': true,
    'Capturas de redes sociales': true,
    'Material publicitario': true,
    'Conclusión final': true,
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 text-xs">
      <div className="border-b border-slate-100 pb-3">
        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold uppercase tracking-wider">
          Sección XVI: Checklist Oficial de Entrega
        </span>
        <h3 className="text-base font-extrabold text-slate-900 mt-1">Verificación de Requisitos Previos a Canva</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {Object.entries(checklist).map(([item, checked]) => (
          <label key={item} onClick={() => setChecklist((prev) => ({ ...prev, [item]: !prev[item] }))} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${checked ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            <input type="checkbox" checked={checked} onChange={() => {}} className="h-4 w-4 text-emerald-600 rounded" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

/* ==========================================================================
   11. OFFICIAL INSAB REPORT VIEW (Con Logo del Instituto logo.jpg y Exportador Word/Canva)
   ========================================================================== */

export const OfficialInsabReportView: React.FC = () => {
  const {
    metadata,
    updateMetadata,
    totals,
    production,
    losses,
    expenses,
    partners,
    serviceRating,
    problems,
    assessments,
    learnings,
    decisions,
    orders,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Promedio de venta por orden emitida
  const averageTicket = totals.totalOrdersCount > 0 ? totals.totalSales / totals.totalOrdersCount : 0;
  // Margen de ganancia sobre ventas
  const profitMarginPercent = totals.totalSales > 0 ? Math.max(0, (totals.netProfit / totals.totalSales) * 100) : 0;
  // Retorno sobre la inversión (ROI)
  const roiPercent = totals.initialCapitalContributed > 0 ? (totals.netProfit / totals.initialCapitalContributed) * 100 : 0;
  // Porcentaje de mermas sobre ventas
  const lossPercentOverSales = totals.totalSales > 0 ? (totals.totalLossesValue / totals.totalSales) * 100 : 0;

  // Manejo de carga de logo personalizado
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateMetadata({ customLogoUrl: event.target.result as string });
          setLogoError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Exportar a HTML Autónomo (Abre en cualquier navegador con 100% el diseño idéntico y sin depender de internet)
  const handleDownloadHtmlReport = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Informe Oficial INSAB - Boom Drinks</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background-color: #f8fafc;
      padding: 30px 15px;
      line-height: 1.5;
      font-size: 13px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
    }
    .header-box {
      text-align: center;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .logo-img {
      width: 80px;
      height: 80px;
      object-fit: contain;
      margin: 0 auto 10px;
      border-radius: 50%;
      border: 1px solid #cbd5e1;
      display: block;
    }
    h1 { font-size: 18px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 4px; letter-spacing: -0.01em; }
    h2 { font-size: 13px; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 3px; }
    h3 { font-size: 12px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
    .subtitle { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 6px; }
    .motto { font-size: 12px; font-style: italic; color: #64748b; }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      border-left: 4px solid #0284c7;
      padding-left: 10px;
      margin: 28px 0 12px;
    }
    .box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .font-bold { font-weight: 700; }
    .badge-green { background: #dcfce7; color: #166534; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
    .badge-blue { background: #e0f2fe; color: #075985; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 10px 0; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 10px 0; }
    .stat-card { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; text-align: center; }
    .stat-card .val { font-size: 16px; font-weight: 800; font-family: monospace; color: #0369a1; }
    .stat-card .lbl { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-top: 2px; }
    .formula-banner {
      background: #f0fdf4;
      border: 2px solid #22c55e;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      margin: 16px 0;
    }
    .formula-title { font-size: 11px; font-weight: 800; color: #15803d; text-transform: uppercase; }
    .formula-math { font-size: 16px; font-weight: 900; font-family: monospace; color: #0f172a; margin: 6px 0; }
    .partner-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; }
    .partner-name { font-weight: 700; color: #0f172a; }
    .partner-role { font-size: 11px; color: #64748b; }
    @media print {
      body { background: #ffffff; padding: 0; font-size: 10pt; }
      .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .page-break { page-break-before: always; }
      .avoid-break { page-break-inside: avoid; break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-box">
      <img src="logo.jpg" alt="Logo INSAB" class="logo-img" onerror="this.style.display='none'">
      <h1>${metadata.schoolName}</h1>
      <h2>${metadata.moduleName}</h2>
      <h3>${metadata.eventName}</h3>
      <div class="subtitle">INFORME FINAL DE EVALUACIÓN Y CIERRE DEL PROYECTO</div>
      <div class="motto">"De la Idea a la Puesta en Marcha y Evaluación de los Resultados"</div>
    </div>

    <!-- SECCIÓN I -->
    <div class="section-title">I. DATOS GENERALES DEL PROYECTO (PORTADA)</div>
    <div class="box avoid-break">
      <p style="margin-bottom: 6px;"><strong>Nombre del negocio:</strong> <span style="font-size: 14px; font-weight: 900; color: #0284c7; text-transform: uppercase;">${metadata.businessName}</span></p>
      <p style="margin-bottom: 6px;"><strong>Lema / Slogan:</strong> <em>"${metadata.slogan || '¡Sabor explosivo que despierta tus sentidos!'}"</em></p>
      <p style="margin-bottom: 6px;"><strong>Nombre de los productos:</strong> ${metadata.productName}</p>
      <p style="margin-bottom: 10px;"><strong>Nómina de los 7 Socios Cooperativistas:</strong></p>
      <div class="grid-2">
        ${partners.map((p, idx) => `
          <div class="partner-card">
            <div class="partner-name">${idx + 1}. ${p.name}</div>
            <div class="partner-role">${p.role} • Aporte: $${p.capitalContributed.toFixed(2)}</div>
          </div>
        `).join('')}
      </div>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 10px;" class="grid-2">
        <div><strong>Docente Facilitadora:</strong> ${metadata.teacherName}</div>
        <div><strong>Fecha de la Feria:</strong> ${metadata.fairDate}</div>
      </div>
    </div>

    <!-- SECCIÓN II -->
    <div class="section-title">II. PROPÓSITO DEL INFORME FINAL Y MARCO COOPERATIVO</div>
    <div class="box avoid-break">
      <p style="margin-bottom: 8px;">
        Una vez finalizada la Feria de Emprendimiento escolar en el INSAB, el equipo de <strong>${metadata.businessName}</strong> consolida este informe oficial demostrando con datos reales y transparentes el desempeño de la microempresa. Se integran los resultados de producción, comercialización en caja, control de mermas, recuperación íntegra de la inversión cooperativa de <strong>$140.00</strong> ($20.00 aportados por cada uno de los 7 socios) y la distribución equitativa de los excedentes generados.
      </p>
      <div class="grid-2" style="margin-top: 10px;">
        <div style="background: #ffffff; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1;">
          <strong style="color: #0369a1; display: block; margin-bottom: 4px;">🎯 Misión Cooperativa:</strong>
          <span style="font-size: 11px; color: #334155;">${metadata.mission}</span>
        </div>
        <div style="background: #ffffff; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1;">
          <strong style="color: #0369a1; display: block; margin-bottom: 4px;">🔭 Visión Estratégica:</strong>
          <span style="font-size: 11px; color: #334155;">${metadata.vision}</span>
        </div>
      </div>
    </div>

    <!-- SECCIÓN III -->
    <div class="section-title">III. RESULTADOS DE PRODUCCIÓN</div>
    <div class="avoid-break">
      <table>
        <thead>
          <tr>
            <th>CONCEPTO</th>
            <th class="text-center">Blue Sharks ($2.50)</th>
            <th class="text-center">La Tóxica ($2.00)</th>
            <th class="text-center" style="background: #e2e8f0;">TOTAL GENERAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Productos planificados (Meta inicial)</td>
            <td class="text-center font-mono">50</td>
            <td class="text-center font-mono">50</td>
            <td class="text-center font-mono font-bold">100</td>
          </tr>
          <tr style="background: #f0fdf4;">
            <td class="font-bold">Productos elaborados (en ventas)</td>
            <td class="text-center font-mono font-bold" style="color: #0369a1;">${totals.madeBlueSharks}</td>
            <td class="text-center font-mono font-bold" style="color: #15803d;">${totals.madeLaToxica}</td>
            <td class="text-center font-mono font-bold" style="background: #dcfce7;">${totals.madeBlueSharks + totals.madeLaToxica}</td>
          </tr>
          <tr>
            <td>Productos entregados a Ventas</td>
            <td class="text-center font-mono">${totals.madeBlueSharks}</td>
            <td class="text-center font-mono">${totals.madeLaToxica}</td>
            <td class="text-center font-mono font-bold">${totals.madeBlueSharks + totals.madeLaToxica}</td>
          </tr>
          <tr style="background: #f0fdf4;">
            <td class="font-bold">Productos vendidos (Equivalente total)</td>
            <td class="text-center font-mono font-bold">${totals.equivalentBlueSharksTotal}</td>
            <td class="text-center font-mono font-bold">${totals.equivalentLaToxicaTotal}</td>
            <td class="text-center font-mono font-bold" style="background: #dcfce7;">${totals.equivalentBlueSharksTotal + totals.equivalentLaToxicaTotal}</td>
          </tr>
          <tr>
            <td style="color: #b91c1c;">Productos dañados o perdidos (Manual)</td>
            <td class="text-center font-mono" style="color: #b91c1c;">${production.manualDamagedBlueSharks || 0}</td>
            <td class="text-center font-mono" style="color: #b91c1c;">${production.manualDamagedLaToxica || 0}</td>
            <td class="text-center font-mono font-bold" style="color: #b91c1c; background: #fee2e2;">${(production.manualDamagedBlueSharks || 0) + (production.manualDamagedLaToxica || 0)}</td>
          </tr>
          <tr style="background: #f8fafc; font-weight: bold;">
            <td>Productos restantes (meta no alcanzada)</td>
            <td class="text-center font-mono">${Math.max(0, 50 - totals.madeBlueSharks - (production.manualDamagedBlueSharks || 0))}</td>
            <td class="text-center font-mono">${Math.max(0, 50 - totals.madeLaToxica - (production.manualDamagedLaToxica || 0))}</td>
            <td class="text-center font-mono">${Math.max(0, 100 - (totals.madeBlueSharks + totals.madeLaToxica) - ((production.manualDamagedBlueSharks || 0) + (production.manualDamagedLaToxica || 0)))}</td>
          </tr>
        </tbody>
      </table>
      <p style="font-size: 11px; color: #475569; margin-top: 6px;">
        <strong>¿Se logró producir la cantidad planificada? Justificación:</strong> ${production.explanationPlannedAchieved}
      </p>
    </div>

    <!-- SECCIÓN IV -->
    <div class="section-title">IV. RESULTADOS DE VENTAS Y FACTURACIÓN</div>
    <div class="avoid-break">
      <table>
        <thead>
          <tr>
            <th>PRODUCTO / PRESENTACIÓN</th>
            <th class="text-center">PRECIO</th>
            <th class="text-center">UNIDADES VENDIDAS</th>
            <th class="text-right">TOTAL INGRESOS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Blue Sharks</strong> (Individual con gomita de tiburón)</td>
            <td class="text-center font-mono">$2.50</td>
            <td class="text-center font-mono">${totals.blueSharksSold}</td>
            <td class="text-right font-mono">$${(totals.blueSharksSold * 2.50).toFixed(2)}</td>
          </tr>
          <tr>
            <td><strong>La Tóxica</strong> (Individual escarchada con chamoy y tajín)</td>
            <td class="text-center font-mono">$2.00</td>
            <td class="text-center font-mono">${totals.laToxicaSold}</td>
            <td class="text-right font-mono">$${(totals.laToxicaSold * 2.00).toFixed(2)}</td>
          </tr>
          <tr>
            <td><strong>Dúo Letal</strong> (Combo Pareja: 1 Blue Shark + 1 La Tóxica)</td>
            <td class="text-center font-mono">$4.00</td>
            <td class="text-center font-mono">${totals.duoLetalSold}</td>
            <td class="text-right font-mono">$${(totals.duoLetalSold * 4.00).toFixed(2)}</td>
          </tr>
          <tr>
            <td><strong>Doble Peligro</strong> (Mega Combo: 2 Blue Sharks + 2 La Tóxica)</td>
            <td class="text-center font-mono">$7.50</td>
            <td class="text-center font-mono">${totals.doblePeligroSold}</td>
            <td class="text-right font-mono">$${(totals.doblePeligroSold * 7.50).toFixed(2)}</td>
          </tr>
          <tr style="background: #f1f5f9; font-weight: 800;">
            <td colspan="2">TOTAL CONSOLIDADO DE VENTAS:</td>
            <td class="text-center font-mono">${totals.totalUnitsSold} unidades</td>
            <td class="text-right font-mono" style="color: #0369a1; font-size: 14px;">$${totals.totalSales.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div class="grid-3" style="margin-top: 10px;">
        <div class="stat-card">
          <div class="val">$${totals.totalSales.toFixed(2)}</div>
          <div class="lbl">Ingresos Brutos</div>
        </div>
        <div class="stat-card">
          <div class="val">${totals.totalOrdersCount}</div>
          <div class="lbl">Tickets / Órdenes</div>
        </div>
        <div class="stat-card">
          <div class="val">$${averageTicket.toFixed(2)}</div>
          <div class="lbl">Ticket Promedio</div>
        </div>
      </div>
      <p style="font-size: 11px; color: #64748b; margin-top: 6px;">
        * Política comercial: Cupones del 10%, 15% y 20% aplicables exclusivamente a bebidas individuales (no combos), con redondeo comercial hacia arriba al cuarto de dólar ($0.25) para flujo en caja.
      </p>
    </div>

    <!-- SECCIÓN V -->
    <div class="section-title">V. MERMAS Y DESPERDICIOS</div>
    <div class="avoid-break">
      <table>
        <thead>
          <tr>
            <th>TIPO DE PÉRDIDA</th>
            <th>DESCRIPCIÓN</th>
            <th class="text-center">CANTIDAD</th>
            <th>CAUSA</th>
            <th class="text-right">VALOR ESTIMADO</th>
          </tr>
        </thead>
        <tbody>
          ${losses.length === 0 ? `
            <tr><td colspan="5" class="text-center" style="color: #94a3b8; padding: 16px;">Sin mermas ni desperdicios reportados durante la jornada.</td></tr>
          ` : losses.map((l) => `
            <tr>
              <td><strong>${l.lossType}</strong></td>
              <td>${l.description}</td>
              <td class="text-center font-mono">${l.quantity}</td>
              <td>${l.cause}</td>
              <td class="text-right font-mono font-bold" style="color: #b91c1c;">$${l.estimatedValue.toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr style="background: #f1f5f9; font-weight: 700;">
            <td colspan="4">TOTAL MERMAS Y DESPERDICIOS:</td>
            <td class="text-right font-mono font-bold" style="color: #b91c1c;">$${totals.totalLossesValue.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div class="box" style="margin-top: 8px;">
        <p style="margin-bottom: 4px;"><strong>Índice de merma sobre ventas:</strong> <span class="font-mono">${lossPercentOverSales.toFixed(1)}%</span></p>
        <p style="margin-bottom: 4px;"><strong>Principal causa de pérdidas:</strong> ${metadata.mainLossCause}</p>
        <p><strong>¿Cómo evitarlo en una próxima producción?:</strong> ${metadata.howToAvoidLosses}</p>
      </div>
    </div>

    <!-- SECCIÓN VI & VII -->
    <div class="section-title">VI. RESULTADO ECONÓMICO Y ESTADO DE RESULTADOS</div>
    <div class="avoid-break">
      <div class="grid-3">
        <div class="stat-card">
          <div class="val">$${totals.initialCapitalContributed.toFixed(2)}</div>
          <div class="lbl">Capital Invertido (7 x $20)</div>
        </div>
        <div class="stat-card">
          <div class="val">$${totals.totalSales.toFixed(2)}</div>
          <div class="lbl">Total Vendido</div>
        </div>
        <div class="stat-card">
          <div class="val">$${totals.totalCosts.toFixed(2)}</div>
          <div class="lbl">Costos Totales</div>
        </div>
      </div>

      <div class="formula-banner">
        <div class="formula-title">Fórmula Contable Oficial INSAB</div>
        <div class="formula-math">GANANCIA = INGRESOS POR VENTAS – COSTOS TOTALES</div>
        <div class="formula-math" style="color: #15803d;">
          $${totals.totalSales.toFixed(2)} – $${totals.totalCosts.toFixed(2)} = $${totals.netProfit.toFixed(2)}
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #166534; margin-top: 6px;">
          Resultado del Negocio: <span class="badge-green">${totals.status}</span>
        </div>
      </div>

      <div class="grid-2">
        <div class="stat-card">
          <div class="val">${profitMarginPercent.toFixed(1)}%</div>
          <div class="lbl">Margen de Ganancia Neta</div>
        </div>
        <div class="stat-card">
          <div class="val">${roiPercent.toFixed(1)}%</div>
          <div class="lbl">Retorno de Inversión (ROI)</div>
        </div>
      </div>
    </div>

    <div class="section-title">VII. RECUPERACIÓN DEL CAPITAL DE INVERSIÓN</div>
    <div class="box avoid-break">
      <div class="grid-3" style="margin-bottom: 10px;">
        <div class="stat-card">
          <div class="val">$${totals.initialCapitalContributed.toFixed(2)}</div>
          <div class="lbl">Capital Aportado</div>
        </div>
        <div class="stat-card">
          <div class="val" style="color: #16a34a;">$${totals.capitalRecovered.toFixed(2)}</div>
          <div class="lbl">Capital Recuperado</div>
        </div>
        <div class="stat-card">
          <div class="val" style="color: #dc2626;">$${totals.capitalPending.toFixed(2)}</div>
          <div class="lbl">Pendiente de Recuperar</div>
        </div>
      </div>
      <p style="margin-bottom: 4px;"><strong>Estado Oficial:</strong> <span class="badge-green">☑ ${totals.capitalStatus}</span></p>
      <p><strong>Explicación:</strong> ${metadata.capitalRecoveryExplanation}</p>
    </div>

    <!-- SECCIÓN VIII -->
    <div class="section-title">VIII. DISTRIBUCIÓN COOPERATIVA ENTRE LOS 7 SOCIOS</div>
    <div class="avoid-break">
      <table>
        <thead>
          <tr>
            <th class="text-center">N.º</th>
            <th>NOMBRE DEL SOCIO</th>
            <th>CARGO / ROL</th>
            <th class="text-right">APORTE</th>
            <th class="text-right">DEVOLUCIÓN</th>
            <th class="text-right">GANANCIA (1/7)</th>
            <th class="text-right" style="background: #e0f2fe;">TOTAL LÍQUIDO</th>
          </tr>
        </thead>
        <tbody>
          ${partners.map((p, idx) => {
            const gain = totals.netProfit > 0 ? totals.netProfit / 7 : 0;
            const payout = p.capitalContributed + gain;
            return `
              <tr>
                <td class="text-center font-mono">${idx + 1}</td>
                <td><strong>${p.name}</strong></td>
                <td>${p.role}</td>
                <td class="text-right font-mono">$${p.capitalContributed.toFixed(2)}</td>
                <td class="text-right font-mono">$${p.capitalContributed.toFixed(2)}</td>
                <td class="text-right font-mono font-bold" style="color: #15803d;">$${gain.toFixed(2)}</td>
                <td class="text-right font-mono font-bold" style="background: #e0f2fe; color: #0369a1;">$${payout.toFixed(2)}</td>
              </tr>
            `;
          }).join('')}
          <tr style="background: #f1f5f9; font-weight: 800;">
            <td colspan="3">TOTALES DISTRIBUIDOS:</td>
            <td class="text-right font-mono">$${totals.initialCapitalContributed.toFixed(2)}</td>
            <td class="text-right font-mono">$${totals.initialCapitalContributed.toFixed(2)}</td>
            <td class="text-right font-mono" style="color: #15803d;">$${(totals.netProfit > 0 ? totals.netProfit : 0).toFixed(2)}</td>
            <td class="text-right font-mono" style="background: #bae6fd; font-size: 13px;">$${(totals.initialCapitalContributed + (totals.netProfit > 0 ? totals.netProfit : 0)).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div class="box" style="margin-top: 8px;">
        <p style="margin-bottom: 4px;"><strong>¿La distribución se realizó de acuerdo con lo establecido inicialmente por los socios?:</strong> [X] SÍ  [ ] NO</p>
        <p><strong>Explicación:</strong> ${metadata.distributionExplanation}</p>
      </div>
    </div>

    <!-- SECCIÓN IX -->
    <div class="section-title">IX. PROBLEMAS PRESENTADOS Y SOLUCIONES APLICADAS</div>
    <div class="grid-2 avoid-break">
      <div class="box">
        <strong style="color: #0f172a; display: block; margin-bottom: 4px;">1. Producción</strong>
        <p style="color: #b91c1c; font-size: 11px; margin-bottom: 2px;"><strong>Problema:</strong> ${problems.production.problem}</p>
        <p style="color: #15803d; font-size: 11px;"><strong>Solución:</strong> ${problems.production.solution}</p>
      </div>
      <div class="box">
        <strong style="color: #0f172a; display: block; margin-bottom: 4px;">2. Inventario</strong>
        <p style="color: #b91c1c; font-size: 11px; margin-bottom: 2px;"><strong>Problema:</strong> ${problems.inventory.problem}</p>
        <p style="color: #15803d; font-size: 11px;"><strong>Solución:</strong> ${problems.inventory.solution}</p>
      </div>
      <div class="box">
        <strong style="color: #0f172a; display: block; margin-bottom: 4px;">3. Ventas y Caja</strong>
        <p style="color: #b91c1c; font-size: 11px; margin-bottom: 2px;"><strong>Problema:</strong> ${problems.sales.problem}</p>
        <p style="color: #15803d; font-size: 11px;"><strong>Solución:</strong> ${problems.sales.solution}</p>
      </div>
      <div class="box">
        <strong style="color: #0f172a; display: block; margin-bottom: 4px;">4. Atención al Cliente</strong>
        <p style="color: #b91c1c; font-size: 11px; margin-bottom: 2px;"><strong>Problema:</strong> ${problems.customerService.problem}</p>
        <p style="color: #15803d; font-size: 11px;"><strong>Solución:</strong> ${problems.customerService.solution}</p>
      </div>
      <div class="box">
        <strong style="color: #0f172a; display: block; margin-bottom: 4px;">5. Trabajo en Equipo</strong>
        <p style="color: #b91c1c; font-size: 11px; margin-bottom: 2px;"><strong>Problema:</strong> ${problems.teamwork.problem}</p>
        <p style="color: #15803d; font-size: 11px;"><strong>Solución:</strong> ${problems.teamwork.solution}</p>
      </div>
      <div class="box">
        <strong style="color: #0f172a; display: block; margin-bottom: 4px;">6. Logística y Otros</strong>
        <p style="color: #b91c1c; font-size: 11px; margin-bottom: 2px;"><strong>Problema:</strong> ${problems.others.problem}</p>
        <p style="color: #15803d; font-size: 11px;"><strong>Solución:</strong> ${problems.others.solution}</p>
      </div>
    </div>

    <!-- SECCIÓN X -->
    <div class="section-title">X. VALORACIÓN DE LA ATENCIÓN AL CLIENTE</div>
    <div class="avoid-break">
      <table>
        <thead>
          <tr>
            <th>CRITERIO DE SERVICIO AL CLIENTE</th>
            <th class="text-center" style="width: 50px;">SÍ</th>
            <th class="text-center" style="width: 50px;">NO</th>
            <th class="text-center" style="width: 120px;">DEBE MEJORARSE</th>
          </tr>
        </thead>
        <tbody>
          ${[
            { k: 'saludoCordial', l: '1. Se saludó cordialmente al cliente al llegar' },
            { k: 'explicoProducto', l: '2. Se explicó la temática de Blue Sharks y La Tóxica' },
            { k: 'informoPrecio', l: '3. Se informó con claridad el precio y promociones' },
            { k: 'atendioDudas', l: '4. Se atendieron dudas con paciencia y amabilidad' },
            { k: 'ofrecioAlternativas', l: '5. Se ofrecieron combos (Dúo Letal / Doble Peligro)' },
            { k: 'realizoCobro', l: '6. Se cobró de forma ágil y se entregó el cambio exacto' },
            { k: 'entregoProducto', l: '7. Se entregó la bebida con presentación impecable' },
            { k: 'agradecioCompra', l: '8. Se agradeció la compra y se despidió con cordialidad' },
          ].map(({ k, l }) => `
            <tr>
              <td>${l}</td>
              <td class="text-center font-bold font-mono">${(serviceRating as any)[k] === 'SI' ? 'X' : ''}</td>
              <td class="text-center font-bold font-mono">${(serviceRating as any)[k] === 'NO' ? 'X' : ''}</td>
              <td class="text-center font-bold font-mono">${(serviceRating as any)[k] === 'DEBE_MEJORARSE' ? 'X' : ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="box" style="margin-top: 8px;">
        <strong>Comentarios y testimonios recibidos de clientes:</strong>
        <p style="font-style: italic; color: #475569; margin-top: 4px;">"${serviceRating.customerComments}"</p>
      </div>
    </div>

    <!-- SECCIÓN XI & XII -->
    <div class="section-title">XI & XII. EVALUACIÓN DEL DESEMPEÑO POR ÁREAS DE TRABAJO</div>
    <div class="avoid-break">
      <table>
        <thead>
          <tr>
            <th>ÁREA DE TRABAJO</th>
            <th>QUÉ FUNCIONÓ BIEN</th>
            <th>DIFICULTADES PRESENTADAS</th>
            <th>ASPECTOS A MEJORAR</th>
          </tr>
        </thead>
        <tbody>
          ${assessments.map((a) => `
            <tr>
              <td><strong>${a.area}</strong></td>
              <td style="color: #15803d;">${a.workedWell}</td>
              <td style="color: #b91c1c;">${a.hadDifficulties}</td>
              <td style="color: #0369a1;">${a.toImprove}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- SECCIÓN XIII -->
    <div class="section-title">XIII. PRINCIPALES APRENDIZAJES DEL EQUIPO COOPERATIVO</div>
    <div class="box avoid-break" style="font-size: 12px; line-height: 1.6;">
      <p style="margin-bottom: 6px;"><strong>1. ¿Qué aprendimos al producir?:</strong> ${learnings.productionLearning}</p>
      <p style="margin-bottom: 6px;"><strong>2. ¿Qué aprendimos al vender?:</strong> ${learnings.salesLearning}</p>
      <p style="margin-bottom: 6px;"><strong>3. ¿Qué aprendimos sobre el cliente?:</strong> ${learnings.customerLearning}</p>
      <p style="margin-bottom: 6px;"><strong>4. ¿Qué aprendimos sobre el dinero y las ganancias?:</strong> ${learnings.moneyAndProfitsLearning}</p>
      <p style="margin-bottom: 6px;"><strong>5. ¿Qué aprendimos sobre trabajar en equipo?:</strong> ${learnings.teamworkLearning}</p>
      <p><strong>6. ¿Qué aprendimos que no habíamos comprendido en el aula?:</strong> ${learnings.differenceFromClassroomLearning}</p>
    </div>

    <!-- SECCIÓN XIV -->
    <div class="section-title">XIV. DECISIONES Y PROYECCIONES ESTRATÉGICAS FUTURAS</div>
    <div class="grid-2 avoid-break">
      <div class="box">
        <strong>Producción:</strong> <span style="color: #334155;">${decisions.production}</span>
      </div>
      <div class="box">
        <strong>Inventario:</strong> <span style="color: #334155;">${decisions.inventory}</span>
      </div>
      <div class="box">
        <strong>Ventas:</strong> <span style="color: #334155;">${decisions.sales}</span>
      </div>
      <div class="box">
        <strong>Atención al cliente:</strong> <span style="color: #334155;">${decisions.customerService}</span>
      </div>
      <div class="box">
        <strong>Publicidad y Redes:</strong> <span style="color: #334155;">${decisions.advertising}</span>
      </div>
      <div class="box">
        <strong>Organización del Estand:</strong> <span style="color: #334155;">${decisions.boothOrganization}</span>
      </div>
    </div>

    <!-- SECCIÓN XV -->
    <div class="section-title">XV. CONCLUSIÓN OFICIAL DEL EQUIPO (8 A 12 LÍNEAS)</div>
    <div class="box avoid-break" style="background: #ffffff; border: 2px solid #0284c7; padding: 20px;">
      <p style="font-style: italic; line-height: 1.7; text-align: justify; color: #1e293b;">
        "${metadata.teamConclusion}"
      </p>
    </div>

    <!-- SECCIÓN XVI -->
    <div class="section-title">XVI. LISTA DE VERIFICACIÓN (CHECKLIST) DE ENTREGABLES Y EVIDENCIAS DE EVALUACIÓN INSAB</div>
    <div class="avoid-break">
      <table>
        <thead>
          <tr>
            <th class="text-center" style="width: 40px;">N.º</th>
            <th>CRITERIO / ENTREGABLE OFICIAL EVALUADO</th>
            <th>ÁREA RESPONSABLE</th>
            <th class="text-center" style="width: 120px;">ESTADO</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="text-center font-mono">1</td><td><strong>Marca, Logotipo y Lema Oficial</strong> (Identidad visual Boom Drinks)</td><td>Marketing</td><td class="text-center"><span class="badge-green">☑ CUMPLIDO</span></td></tr>
          <tr><td class="text-center font-mono">2</td><td><strong>Fichas Técnicas Estandarizadas</strong> (Receta oficial con medidas exactas de Blue Sharks y La Tóxica)</td><td>Producción</td><td class="text-center"><span class="badge-green">☑ CUMPLIDO</span></td></tr>
          <tr><td class="text-center font-mono">3</td><td><strong>Presupuesto y Aportes Cooperativos</strong> ($140.00 aportados por los 7 socios cooperativistas, $20.00 c/u)</td><td>Finanzas</td><td class="text-center"><span class="badge-green">☑ CUMPLIDO</span></td></tr>
          <tr><td class="text-center font-mono">4</td><td><strong>Protocolo de Inocuidad y Sanidad Alimentaria</strong> (Uso de redecillas, guantes de nitrilo y cadena de frío de hielo)</td><td>Producción</td><td class="text-center"><span class="badge-green">☑ CUMPLIDO</span></td></tr>
          <tr><td class="text-center font-mono">5</td><td><strong>Sistema Digital de Registro de Ventas en Caja</strong> (Cobro en efectivo, cálculo de vuelto y cupones)</td><td>Caja / Ventas</td><td class="text-center"><span class="badge-green">☑ CUMPLIDO</span></td></tr>
          <tr><td class="text-center font-mono">6</td><td><strong>Despacho en Tiempo Real a Cocina por WhatsApp</strong> (Comandas digitales de pedidos a producción)</td><td>Logística</td><td class="text-center"><span class="badge-green">☑ CUMPLIDO</span></td></tr>
          <tr><td class="text-center font-mono">7</td><td><strong>Registro Diario de Mermas y Desperdicios</strong> (Causas, cantidades y valor monetario)</td><td>Inventario</td><td class="text-center"><span class="badge-green">☑ CUMPLIDO</span></td></tr>
          <tr><td class="text-center font-mono">8</td><td><strong>Arqueo de Caja y Estado de Resultados Contable</strong> (Ventas – Costos = Ganancia Neta)</td><td>Finanzas</td><td class="text-center"><span class="badge-green">☑ CUMPLIDO</span></td></tr>
          <tr><td class="text-center font-mono">9</td><td><strong>Acta de Recuperación de Capital y Liquidación</strong> (Reembolso de los $20.00 de cada socio + utilidades)</td><td>Gerencia</td><td class="text-center"><span class="badge-green">☑ CUMPLIDO</span></td></tr>
          <tr><td class="text-center font-mono">10</td><td><strong>Encuesta de Calidad en Atención al Cliente</strong> (8 criterios evaluados y testimonios)</td><td>Atención al Cliente</td><td class="text-center"><span class="badge-green">☑ CUMPLIDO</span></td></tr>
          <tr><td class="text-center font-mono">11</td><td><strong>Evaluación Multidimensional por Áreas de Trabajo</strong> (Desempeño en 9 áreas funcionales)</td><td>Gerencia General</td><td class="text-center"><span class="badge-green">☑ CUMPLIDO</span></td></tr>
          <tr><td class="text-center font-mono">12</td><td><strong>Portafolio Fotográfico y Montaje de Estand</strong> (Decoración temática neón y menú visible)</td><td>Logística / Estand</td><td class="text-center"><span class="badge-green">☑ CUMPLIDO</span></td></tr>
        </tbody>
      </table>
    </div>

    <!-- SECCIÓN XVII -->
    <div class="section-title">XVII. HOJA OFICIAL DE FIRMAS Y VISTO BUENO DOCENTE</div>
    <div class="avoid-break">
      <table>
        <thead>
          <tr>
            <th class="text-center" style="width: 40px;">N.º</th>
            <th>NOMBRE DEL INTEGRANTE</th>
            <th>CARGO ASIGNADO</th>
            <th class="text-center" style="width: 200px;">FIRMA OFICIAL</th>
          </tr>
        </thead>
        <tbody>
          ${partners.map((p, idx) => `
            <tr>
              <td class="text-center font-mono">${idx + 1}</td>
              <td><strong>${p.name}</strong></td>
              <td>${p.role}</td>
              <td class="text-center" style="font-family: cursive; color: #94a3b8; padding: 14px 0;">_____________________________</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="box" style="margin-top: 14px;">
        <strong>OBSERVACIONES Y CALIFICACIÓN DE LA DOCENTE:</strong>
        <p style="font-size: 11px; color: #64748b; margin-top: 2px;">(Profesora Ángela Marisol Osegueda — Docente facilitadora Módulo 3.7)</p>
        <div style="height: 60px; border-bottom: 1px dashed #94a3b8; margin-top: 10px;"></div>
      </div>
    </div>

    <!-- SECCIÓN XVIII -->
    <div class="section-title">XVIII. RESULTADO FINAL DEL NEGOCIO (CIERRE FORMAL DE PROYECTO)</div>
    <div class="box avoid-break" style="background: #0f172a; color: #ffffff; border-radius: 14px;">
      <div class="grid-2" style="gap: 14px; font-size: 12px;">
        <div style="border-bottom: 1px solid #334155; padding-bottom: 6px;">CAPITAL INVERTIDO: <strong class="font-mono" style="float: right;">$${totals.initialCapitalContributed.toFixed(2)}</strong></div>
        <div style="border-bottom: 1px solid #334155; padding-bottom: 6px;">TOTAL VENDIDO: <strong class="font-mono" style="color: #38bdf8; float: right;">$${totals.totalSales.toFixed(2)}</strong></div>
        <div style="border-bottom: 1px solid #334155; padding-bottom: 6px;">COSTOS TOTALES: <strong class="font-mono" style="color: #fde047; float: right;">$${totals.totalCosts.toFixed(2)}</strong></div>
        <div style="border-bottom: 1px solid #334155; padding-bottom: 6px;">CAPITAL RECUPERADO: <strong class="font-mono" style="color: #4ade80; float: right;">$${totals.capitalRecovered.toFixed(2)}</strong></div>
        <div style="border-bottom: 1px solid #334155; padding-bottom: 6px;">MERMA Y DESPERDICIO: <strong class="font-mono" style="color: #f87171; float: right;">$${totals.totalLossesValue.toFixed(2)}</strong></div>
        <div style="border-bottom: 1px solid #334155; padding-bottom: 6px;">GANANCIA O PÉRDIDA: <strong class="font-mono" style="color: #4ade80; float: right;">$${totals.netProfit.toFixed(2)} (${totals.status})</strong></div>
        <div>NÚMERO DE SOCIOS: <strong style="float: right;">7 Socios Cooperativistas</strong></div>
        <div>GANANCIA POR SOCIO: <strong class="font-mono" style="color: #38bdf8; float: right;">$${totals.profitPerPartner.toFixed(2)}</strong></div>
      </div>
      <div style="margin-top: 14px; padding: 12px; background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; border-radius: 8px; text-align: center; font-size: 14px; font-weight: 800;">
        TOTAL LÍQUIDO A RECIBIR POR CADA UNO DE LOS 7 SOCIOS:
        <span class="font-mono" style="color: #4ade80; font-size: 18px; margin-left: 8px;">$${totals.totalReceivedPerPartner.toFixed(2)}</span>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Informe_Oficial_INSAB_BoomDrinks_Modulo_3_7_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Descargar Word (.doc) completo con las 18 secciones
  const handleDownloadWordDoc = () => {
    const reportHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Informe Final INSAB - Boom Drinks</title>
        <style>
          @page WordSection1 { size: 612.0pt 792.0pt; margin: 54.0pt 54.0pt 54.0pt 54.0pt; }
          div.WordSection1 { page: WordSection1; }
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #0f172a; line-height: 1.4; }
          h1 { font-size: 15pt; font-weight: bold; text-align: center; color: #0f172a; margin-bottom: 2px; text-transform: uppercase; }
          h2 { font-size: 12pt; font-weight: bold; text-align: center; color: #334155; margin-top: 0; text-transform: uppercase; }
          h3 { font-size: 11pt; font-weight: bold; text-align: center; color: #0284c7; margin-top: 0; text-transform: uppercase; }
          .title-box { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #0284c7; padding-bottom: 12px; }
          .section-title { font-size: 12pt; font-weight: bold; color: #0f172a; margin-top: 24px; margin-bottom: 8px; border-left: 4px solid #0284c7; padding-left: 8px; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10pt; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .box { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; margin-bottom: 15px; border-radius: 6px; }
          .formula-box { background-color: #f0fdf4; border: 2px solid #22c55e; padding: 12px; text-align: center; font-size: 12pt; font-weight: bold; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="WordSection1">
          <div class="title-box">
            <h1>${metadata.schoolName}</h1>
            <h2>${metadata.moduleName}</h2>
            <h3>${metadata.eventName}</h3>
            <p style="font-size: 13pt; font-weight: bold; margin: 10px 0;">INFORME FINAL DE EVALUACIÓN Y CIERRE DEL PROYECTO</p>
            <p style="font-style: italic; color: #475569; margin: 0;">"DE LA IDEA A LA PUESTA EN MARCHA Y EVALUACIÓN DE LOS RESULTADOS"</p>
          </div>

          <div class="section-title">I. DATOS GENERALES DEL PROYECTO (PORTADA)</div>
          <div class="box">
            <p><strong>Nombre del negocio:</strong> ${metadata.businessName}</p>
            <p><strong>Lema / Slogan:</strong> "${metadata.slogan || '¡Sabor explosivo que despierta tus sentidos!'}"</p>
            <p><strong>Nombre de los productos:</strong> ${metadata.productName}</p>
            <p><strong>Integrantes del equipo (7 Socios Cooperativistas):</strong></p>
            <ul>
              ${partners.map((p, idx) => `<li><strong>${idx + 1}. ${p.name}</strong> — ${p.role} (Capital aportado: $${p.capitalContributed.toFixed(2)})</li>`).join('')}
            </ul>
            <p><strong>Docente Facilitadora:</strong> ${metadata.teacherName}</p>
            <p><strong>Fecha de la Feria:</strong> ${metadata.fairDate}</p>
          </div>

          <div class="section-title">II. PROPÓSITO DEL INFORME FINAL Y MARCO COOPERATIVO</div>
          <p>Una vez finalizada la Feria de Emprendimiento escolar, el equipo de <strong>${metadata.businessName}</strong> consolida este informe oficial demostrando con datos reales el desempeño del negocio. Se analizan producción, ventas en caja, mermas, el capital total invertido de <strong>$140.00</strong> por los 7 socios ($20.00 cada uno), la recuperación íntegra del capital y la distribución cooperativa equitativa de las ganancias.</p>
          <p><strong>Misión:</strong> ${metadata.mission}</p>
          <p><strong>Visión:</strong> ${metadata.vision}</p>

          <div class="section-title">III. RESULTADOS DE PRODUCCIÓN</div>
          <table>
            <tr><th>CONCEPTO</th><th class="text-center">Blue Sharks ($2.50)</th><th class="text-center">La Tóxica ($2.00)</th><th class="text-center">CANTIDAD TOTAL</th></tr>
            <tr><td>Productos planificados</td><td class="text-center">50</td><td class="text-center">50</td><td class="text-center"><strong>100</strong></td></tr>
            <tr><td>Productos elaborados (en ventas)</td><td class="text-center">${totals.madeBlueSharks}</td><td class="text-center">${totals.madeLaToxica}</td><td class="text-center"><strong>${totals.madeBlueSharks + totals.madeLaToxica}</strong></td></tr>
            <tr><td>Productos entregados a Ventas</td><td class="text-center">${totals.madeBlueSharks}</td><td class="text-center">${totals.madeLaToxica}</td><td class="text-center"><strong>${totals.madeBlueSharks + totals.madeLaToxica}</strong></td></tr>
            <tr><td>Productos vendidos (Equivalente)</td><td class="text-center">${totals.equivalentBlueSharksTotal}</td><td class="text-center">${totals.equivalentLaToxicaTotal}</td><td class="text-center"><strong>${totals.madeBlueSharks + totals.madeLaToxica}</strong></td></tr>
            <tr><td>Productos dañados o perdidos</td><td class="text-center">${production.manualDamagedBlueSharks || 0}</td><td class="text-center">${production.manualDamagedLaToxica || 0}</td><td class="text-center"><strong>${(production.manualDamagedBlueSharks || 0) + (production.manualDamagedLaToxica || 0)}</strong></td></tr>
            <tr><td>Productos restantes</td><td class="text-center">${Math.max(0, 50 - totals.madeBlueSharks - (production.manualDamagedBlueSharks || 0))}</td><td class="text-center">${Math.max(0, 50 - totals.madeLaToxica - (production.manualDamagedLaToxica || 0))}</td><td class="text-center"><strong>${Math.max(0, 100 - (totals.madeBlueSharks + totals.madeLaToxica) - ((production.manualDamagedBlueSharks || 0) + (production.manualDamagedLaToxica || 0)))}</strong></td></tr>
          </table>
          <p><strong>¿Se logró producir la cantidad planificada? Justificación:</strong> ${production.explanationPlannedAchieved}</p>

          <div class="section-title">IV. RESULTADOS DE VENTAS</div>
          <table>
            <tr><th>PRODUCTO / PRESENTACIÓN</th><th class="text-center">PRECIO</th><th class="text-center">UNIDADES VENDIDAS</th><th class="text-right">TOTAL</th></tr>
            <tr><td>Blue Sharks (Individual)</td><td class="text-center">$2.50</td><td class="text-center">${totals.blueSharksSold}</td><td class="text-right">$${(totals.blueSharksSold * 2.50).toFixed(2)}</td></tr>
            <tr><td>La Tóxica (Individual)</td><td class="text-center">$2.00</td><td class="text-center">${totals.laToxicaSold}</td><td class="text-right">$${(totals.laToxicaSold * 2.00).toFixed(2)}</td></tr>
            <tr><td>Dúo Letal (Combo: 1 Blue Shark + 1 Tóxica)</td><td class="text-center">$4.00</td><td class="text-center">${totals.duoLetalSold}</td><td class="text-right">$${(totals.duoLetalSold * 4.00).toFixed(2)}</td></tr>
            <tr><td>Doble Peligro (Combo: 2 Blue Sharks + 2 Tóxica)</td><td class="text-center">$7.50</td><td class="text-center">${totals.doblePeligroSold}</td><td class="text-right">$${(totals.doblePeligroSold * 7.50).toFixed(2)}</td></tr>
            <tr style="background-color: #f1f5f9; font-weight: bold;"><td>TOTALES CONSOLIDADOS:</td><td></td><td class="text-center">${totals.totalUnitsSold}</td><td class="text-right">$${totals.totalSales.toFixed(2)}</td></tr>
          </table>
          <p><strong>TOTAL DE INGRESOS POR VENTAS:</strong> $${totals.totalSales.toFixed(2)} | <strong>Tickets emitidos:</strong> ${totals.totalOrdersCount} | <strong>Ticket promedio:</strong> $${averageTicket.toFixed(2)}</p>

          <div class="section-title">V. MERMAS Y DESPERDICIOS</div>
          <table>
            <tr><th>TIPO</th><th>DESCRIPCIÓN</th><th class="text-center">CANT.</th><th>CAUSA</th><th class="text-right">VALOR</th></tr>
            ${losses.length === 0 ? '<tr><td colspan="5" class="text-center">Sin mermas registradas.</td></tr>' : losses.map((l) => `<tr><td>${l.lossType}</td><td>${l.description}</td><td class="text-center">${l.quantity}</td><td>${l.cause}</td><td class="text-right">$${l.estimatedValue.toFixed(2)}</td></tr>`).join('')}
            <tr style="background-color: #f1f5f9; font-weight: bold;"><td colspan="4">TOTAL MERMAS:</td><td class="text-right">$${totals.totalLossesValue.toFixed(2)}</td></tr>
          </table>
          <p><strong>Causa principal:</strong> ${metadata.mainLossCause} | <strong>Prevención futura:</strong> ${metadata.howToAvoidLosses}</p>

          <div class="section-title">VI. RESULTADO ECONÓMICO</div>
          <div class="formula-box">
            GANANCIA = INGRESOS POR VENTAS – COSTOS TOTALES<br>
            $${totals.totalSales.toFixed(2)} – $${totals.totalCosts.toFixed(2)} = $${totals.netProfit.toFixed(2)} (${totals.status})
          </div>

          <div class="section-title">VII. RECUPERACIÓN DEL CAPITAL DE INVERSIÓN</div>
          <p><strong>Capital inicialmente aportado:</strong> $${totals.initialCapitalContributed.toFixed(2)} (7 socios x $20.00)</p>
          <p><strong>Capital recuperado:</strong> $${totals.capitalRecovered.toFixed(2)}</p>
          <p><strong>Capital pendiente de recuperar:</strong> $${totals.capitalPending.toFixed(2)}</p>
          <p><strong>Resultado oficial:</strong> ${totals.capitalStatus}</p>

          <div class="section-title">VIII. DISTRIBUCIÓN ENTRE LOS 7 SOCIOS COOPERATIVISTAS</div>
          <table>
            <tr><th>N.º</th><th>SOCIO</th><th>ROL</th><th class="text-right">APORTE</th><th class="text-right">DEVOLUCIÓN</th><th class="text-right">GANANCIA (1/7)</th><th class="text-right">TOTAL A RECIBIR</th></tr>
            ${partners.map((p, idx) => {
              const gain = totals.netProfit > 0 ? totals.netProfit / 7 : 0;
              return `<tr><td class="text-center">${idx + 1}</td><td><strong>${p.name}</strong></td><td>${p.role}</td><td class="text-right">$${p.capitalContributed.toFixed(2)}</td><td class="text-right">$${p.capitalContributed.toFixed(2)}</td><td class="text-right">$${gain.toFixed(2)}</td><td class="text-right"><strong>$${(p.capitalContributed + gain).toFixed(2)}</strong></td></tr>`;
            }).join('')}
            <tr style="background-color: #f1f5f9; font-weight: bold;"><td colspan="3">TOTAL DISTRIBUIDO:</td><td class="text-right">$${totals.initialCapitalContributed.toFixed(2)}</td><td class="text-right">$${totals.initialCapitalContributed.toFixed(2)}</td><td class="text-right">$${(totals.netProfit > 0 ? totals.netProfit : 0).toFixed(2)}</td><td class="text-right">$${(totals.initialCapitalContributed + (totals.netProfit > 0 ? totals.netProfit : 0)).toFixed(2)}</td></tr>
          </table>

          <div class="section-title">IX. PROBLEMAS Y SOLUCIONES</div>
          <ul>
            <li><strong>Producción:</strong> ${problems.production.problem} -> ${problems.production.solution}</li>
            <li><strong>Inventario:</strong> ${problems.inventory.problem} -> ${problems.inventory.solution}</li>
            <li><strong>Ventas y Caja:</strong> ${problems.sales.problem} -> ${problems.sales.solution}</li>
            <li><strong>Atención al cliente:</strong> ${problems.customerService.problem} -> ${problems.customerService.solution}</li>
            <li><strong>Trabajo en equipo:</strong> ${problems.teamwork.problem} -> ${problems.teamwork.solution}</li>
            <li><strong>Logística:</strong> ${problems.others.problem} -> ${problems.others.solution}</li>
          </ul>

          <div class="section-title">X. VALORACIÓN DE LA ATENCIÓN AL CLIENTE</div>
          <table>
            <tr><th>CRITERIO</th><th class="text-center">CALIFICACIÓN</th></tr>
            <tr><td>1. Se saludó cordialmente al cliente al llegar</td><td class="text-center">${serviceRating.saludoCordial}</td></tr>
            <tr><td>2. Se explicó la temática de Blue Sharks y La Tóxica</td><td class="text-center">${serviceRating.explicoProducto}</td></tr>
            <tr><td>3. Se informó con claridad el precio y promociones</td><td class="text-center">${serviceRating.informoPrecio}</td></tr>
            <tr><td>4. Se atendieron dudas con paciencia y amabilidad</td><td class="text-center">${serviceRating.atendioDudas}</td></tr>
            <tr><td>5. Se ofrecieron combos (Dúo Letal / Doble Peligro)</td><td class="text-center">${serviceRating.ofrecioAlternativas}</td></tr>
            <tr><td>6. Se cobró de forma ágil y se entregó el cambio exacto</td><td class="text-center">${serviceRating.realizoCobro}</td></tr>
            <tr><td>7. Se entregó la bebida con presentación impecable</td><td class="text-center">${serviceRating.entregoProducto}</td></tr>
            <tr><td>8. Se agradeció la compra y se despidió con cordialidad</td><td class="text-center">${serviceRating.agradecioCompra}</td></tr>
          </table>
          <p><strong>Testimonios de Clientes:</strong> "${serviceRating.customerComments}"</p>

          <div class="section-title">XI & XII. EVALUACIÓN DEL DESEMPEÑO POR ÁREAS DE TRABAJO</div>
          <table>
            <tr><th>ÁREA</th><th>QUÉ FUNCIONÓ BIEN</th><th>DIFICULTADES</th><th>A MEJORAR</th></tr>
            ${assessments.map((a) => `<tr><td><strong>${a.area}</strong></td><td>${a.workedWell}</td><td>${a.hadDifficulties}</td><td>${a.toImprove}</td></tr>`).join('')}
          </table>

          <div class="section-title">XIII. PRINCIPALES APRENDIZAJES</div>
          <p><strong>Al producir:</strong> ${learnings.productionLearning}</p>
          <p><strong>Al vender:</strong> ${learnings.salesLearning}</p>
          <p><strong>Sobre el cliente:</strong> ${learnings.customerLearning}</p>
          <p><strong>Sobre el dinero y ganancias:</strong> ${learnings.moneyAndProfitsLearning}</p>
          <p><strong>Sobre trabajo en equipo:</strong> ${learnings.teamworkLearning}</p>
          <p><strong>Aula vs Práctica real:</strong> ${learnings.differenceFromClassroomLearning}</p>

          <div class="section-title">XIV. DECISIONES Y PROYECCIONES ESTRATÉGICAS FUTURAS</div>
          <ul>
            <li><strong>Producción:</strong> ${decisions.production}</li>
            <li><strong>Inventario:</strong> ${decisions.inventory}</li>
            <li><strong>Ventas:</strong> ${decisions.sales}</li>
            <li><strong>Atención al cliente:</strong> ${decisions.customerService}</li>
            <li><strong>Publicidad:</strong> ${decisions.advertising}</li>
            <li><strong>Organización del Estand:</strong> ${decisions.boothOrganization}</li>
          </ul>

          <div class="section-title">XV. CONCLUSIÓN DEL EQUIPO</div>
          <p style="font-style: italic;">"${metadata.teamConclusion}"</p>

          <div class="section-title">XVI. LISTA DE VERIFICACIÓN (CHECKLIST) DE ENTREGABLES INSAB</div>
          <table>
            <tr><th>N.º</th><th>ENTREGABLE EVALUADO</th><th>RESPONSABLE</th><th class="text-center">ESTADO</th></tr>
            <tr><td class="text-center">1</td><td>Marca, Logotipo y Lema Oficial (Boom Drinks)</td><td>Marketing</td><td class="text-center">CUMPLIDO</td></tr>
            <tr><td class="text-center">2</td><td>Fichas Técnicas Estandarizadas de Blue Sharks y La Tóxica</td><td>Producción</td><td class="text-center">CUMPLIDO</td></tr>
            <tr><td class="text-center">3</td><td>Presupuesto Inicial ($140.00 aportados por los 7 socios)</td><td>Finanzas</td><td class="text-center">CUMPLIDO</td></tr>
            <tr><td class="text-center">4</td><td>Control de Inocuidad y Sanidad Alimentaria</td><td>Producción</td><td class="text-center">CUMPLIDO</td></tr>
            <tr><td class="text-center">5</td><td>Sistema Digital de Control de Ventas y Caja en Efectivo</td><td>Caja / Ventas</td><td class="text-center">CUMPLIDO</td></tr>
            <tr><td class="text-center">6</td><td>Comandas Digitales Enviadas a Cocina por WhatsApp</td><td>Logística</td><td class="text-center">CUMPLIDO</td></tr>
            <tr><td class="text-center">7</td><td>Registro de Mermas, Causas y Valoración Monetaria</td><td>Inventario</td><td class="text-center">CUMPLIDO</td></tr>
            <tr><td class="text-center">8</td><td>Arqueo Contable de Caja y Estado de Resultados Oficial</td><td>Finanzas</td><td class="text-center">CUMPLIDO</td></tr>
            <tr><td class="text-center">9</td><td>Acta de Liquidación y Reparto Equitativo entre 7 Socios</td><td>Gerencia</td><td class="text-center">CUMPLIDO</td></tr>
            <tr><td class="text-center">10</td><td>Evaluación Cualitativa de Satisfacción del Cliente</td><td>Atención</td><td class="text-center">CUMPLIDO</td></tr>
            <tr><td class="text-center">11</td><td>Evaluación Multidimensional de Desempeño por Áreas</td><td>Gerencia</td><td class="text-center">CUMPLIDO</td></tr>
            <tr><td class="text-center">12</td><td>Portafolio de Evidencias y Montaje Temático de Estand</td><td>Logística</td><td class="text-center">CUMPLIDO</td></tr>
          </table>

          <div class="section-title">XVII. FIRMAS DE LOS 7 INTEGRANTES</div>
          <table>
            <tr><th class="text-center">N.º</th><th>NOMBRE DEL SOCIO</th><th>ROL</th><th class="text-center">FIRMA</th></tr>
            ${partners.map((p, idx) => `<tr><td class="text-center">${idx + 1}</td><td><strong>${p.name}</strong></td><td>${p.role}</td><td class="text-center" style="font-family: cursive; color: #64748b;">_______________________</td></tr>`).join('')}
          </table>

          <div class="section-title">XVIII. RESULTADO FINAL DEL NEGOCIO (CIERRE FORMAL)</div>
          <div class="box">
            <p><strong>CAPITAL INVERTIDO (7 socios x $20.00):</strong> $${totals.initialCapitalContributed.toFixed(2)}</p>
            <p><strong>TOTAL VENDIDO:</strong> $${totals.totalSales.toFixed(2)}</p>
            <p><strong>COSTOS TOTALES:</strong> $${totals.totalCosts.toFixed(2)}</p>
            <p><strong>CAPITAL RECUPERADO:</strong> $${totals.capitalRecovered.toFixed(2)}</p>
            <p><strong>GANANCIA TOTAL:</strong> $${totals.netProfit.toFixed(2)} (${totals.status})</p>
            <p><strong>GANANCIA POR SOCIO:</strong> $${totals.profitPerPartner.toFixed(2)}</p>
            <p style="font-size: 12pt; font-weight: bold; color: #0284c7;">TOTAL RECIBIDO POR CADA UNO DE LOS 7 SOCIOS: $${totals.totalReceivedPerPartner.toFixed(2)}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', reportHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Informe_Final_INSAB_BoomDrinks_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyTextForCanva = () => {
    const text = `
INSTITUTO NACIONAL DE SAN BARTOLO – INSAB
MÓDULO 3.7: PUESTA EN MARCHA DE LA MICROEMPRESA COOPERATIVA
FERIA DE EMPRENDIMIENTO
INFORME FINAL DE EVALUACIÓN Y CIERRE DEL PROYECTO (EN CANVA)
"DE LA IDEA A LA PUESTA EN MARCHA Y EVALUACIÓN DE LOS RESULTADOS"

I. DATOS GENERALES DEL PROYECTO (PORTADA)
Nombre del negocio: ${metadata.businessName}
Lema / Slogan: "${metadata.slogan || '¡Sabor explosivo que despierta tus sentidos!'}"
Nombre del producto: ${metadata.productName}
Nómina Oficial de los 7 Socios Cooperativistas:
${partners.map((p, idx) => `${idx + 1}. ${p.name} — ${p.role} (Aporte: $${p.capitalContributed.toFixed(2)})`).join('\n')}
Docente Facilitadora: ${metadata.teacherName}
Fecha de la Feria: ${metadata.fairDate}

============================================================
II. PROPÓSITO DEL INFORME FINAL Y MARCO COOPERATIVO
Evaluación integral y objetiva de los resultados obtenidos por Boom Drinks durante la Feria de Emprendimiento INSAB, analizando producción, inventario, ventas, ingresos, mermas, desperdicios, capital invertido ($140.00), capital recuperado, ganancia/pérdida y distribución equitativa entre los 7 socios cooperativistas.
Misión: ${metadata.mission}
Visión: ${metadata.vision}

============================================================
III. RESULTADOS DE PRODUCCIÓN
- Productos planificados: 100 unidades (50 Blue Sharks + 50 La Tóxica)
- Productos elaborados (sincronizado con ventas): ${totals.madeBlueSharks + totals.madeLaToxica} unidades
- Productos entregados a Ventas: ${totals.madeBlueSharks + totals.madeLaToxica} unidades
- Productos vendidos (Equivalente total): ${totals.equivalentBlueSharksTotal + totals.equivalentLaToxicaTotal} unidades (Blue Sharks: ${totals.equivalentBlueSharksTotal}, La Tóxica: ${totals.equivalentLaToxicaTotal})
- Productos no vendidos: ${Math.max(0, 100 - (totals.madeBlueSharks + totals.madeLaToxica))}
- Productos dañados o perdidos: ${(production.manualDamagedBlueSharks || 0) + (production.manualDamagedLaToxica || 0)}
- Productos restantes: ${Math.max(0, 100 - (totals.madeBlueSharks + totals.madeLaToxica))}
¿Se logró producir la cantidad planificada?: ${production.explanationPlannedAchieved}

============================================================
IV. RESULTADOS DE VENTAS
- Blue Sharks ($2.50): ${totals.blueSharksSold} unidades ($${(totals.blueSharksSold * 2.50).toFixed(2)})
- La Tóxica ($2.00): ${totals.laToxicaSold} unidades ($${(totals.laToxicaSold * 2.00).toFixed(2)})
- Dúo Letal ($4.00): ${totals.duoLetalSold} combos ($${(totals.duoLetalSold * 4.00).toFixed(2)})
- Doble Peligro ($7.50): ${totals.doblePeligroSold} combos ($${(totals.doblePeligroSold * 7.50).toFixed(2)})
TOTAL UNIDADES VENDIDAS: ${totals.totalUnitsSold}
TOTAL DE INGRESOS POR VENTAS: $${totals.totalSales.toFixed(2)}
TICKETS EMITIDOS: ${totals.totalOrdersCount}
TICKET PROMEDIO: $${averageTicket.toFixed(2)}

============================================================
V. MERMAS Y DESPERDICIOS
${losses.length === 0 ? 'Sin pérdidas ni mermas registradas.' : losses.map((l) => `- ${l.lossType}: ${l.description} | Cant: ${l.quantity} | Causa: ${l.cause} | Valor: $${l.estimatedValue.toFixed(2)}`).join('\n')}
TOTAL MERMAS: $${totals.totalLossesValue.toFixed(2)} (${lossPercentOverSales.toFixed(1)}% de las ventas)
Principal causa de pérdidas: ${metadata.mainLossCause}
¿Cómo evitarlo?: ${metadata.howToAvoidLosses}

============================================================
VI. RESULTADO ECONÓMICO
Capital invertido (7 socios x $20.00): $${totals.initialCapitalContributed.toFixed(2)}
Total de ventas: $${totals.totalSales.toFixed(2)}
Costos totales de insumos: $${totals.totalCosts.toFixed(2)}
GANANCIA = INGRESOS – COSTOS: $${totals.totalSales.toFixed(2)} – $${totals.totalCosts.toFixed(2)} = $${totals.netProfit.toFixed(2)} (${totals.status})
Margen neto: ${profitMarginPercent.toFixed(1)}% | ROI: ${roiPercent.toFixed(1)}%

============================================================
VII. RECUPERACIÓN DEL CAPITAL DE INVERSIÓN
Capital inicialmente aportado: $${totals.initialCapitalContributed.toFixed(2)}
Capital recuperado: $${totals.capitalRecovered.toFixed(2)}
Capital pendiente de recuperar: $${totals.capitalPending.toFixed(2)}
Resultado: ${totals.capitalStatus}
Explicación: ${metadata.capitalRecoveryExplanation}

============================================================
VIII. DISTRIBUCIÓN ENTRE LOS 7 SOCIOS COOPERATIVISTAS
${partners.map((p, idx) => `${idx + 1}. ${p.name} (${p.role}): Aporte $20.00 + Devolución $20.00 + Ganancia $${totals.profitPerPartner.toFixed(2)} = Total Líquido $${totals.totalReceivedPerPartner.toFixed(2)}`).join('\n')}
TOTAL DISTRIBUIDO: $${(totals.initialCapitalContributed + (totals.netProfit > 0 ? totals.netProfit : 0)).toFixed(2)}

============================================================
IX. PROBLEMAS Y SOLUCIONES
1. Producción: ${problems.production.problem} -> ${problems.production.solution}
2. Inventario: ${problems.inventory.problem} -> ${problems.inventory.solution}
3. Ventas y Caja: ${problems.sales.problem} -> ${problems.sales.solution}
4. Atención al cliente: ${problems.customerService.problem} -> ${problems.customerService.solution}
5. Trabajo en equipo: ${problems.teamwork.problem} -> ${problems.teamwork.solution}
6. Logística y Otros: ${problems.others.problem} -> ${problems.others.solution}

============================================================
X. VALORACIÓN DE ATENCIÓN AL CLIENTE
- Saludo cordial: ${serviceRating.saludoCordial}
- Explicó producto: ${serviceRating.explicoProducto}
- Informó precio: ${serviceRating.informoPrecio}
- Atendió dudas: ${serviceRating.atendioDudas}
- Ofreció alternativas: ${serviceRating.ofrecioAlternativas}
- Cobro correcto: ${serviceRating.realizoCobro}
- Entrega correcta: ${serviceRating.entregoProducto}
- Agradeció compra: ${serviceRating.agradecioCompra}
Comentarios clientes: "${serviceRating.customerComments}"

============================================================
XI & XII. EVALUACIÓN DEL DESEMPEÑO POR ÁREAS DE TRABAJO
${assessments.map((a) => `- ${a.area}: Funcionó bien: ${a.workedWell} | Dificultad: ${a.hadDifficulties} | A mejorar: ${a.toImprove}`).join('\n')}

============================================================
XIII. PRINCIPALES APRENDIZAJES
- Al producir: ${learnings.productionLearning}
- Al vender: ${learnings.salesLearning}
- Sobre el cliente: ${learnings.customerLearning}
- Sobre el dinero y ganancias: ${learnings.moneyAndProfitsLearning}
- Sobre trabajar en equipo: ${learnings.teamworkLearning}
- Aula vs Práctica real: ${learnings.differenceFromClassroomLearning}

============================================================
XIV. DECISIONES Y PROYECCIONES ESTRATÉGICAS FUTURAS
- Producción: ${decisions.production}
- Inventario: ${decisions.inventory}
- Ventas: ${decisions.sales}
- Atención al cliente: ${decisions.customerService}
- Publicidad: ${decisions.advertising}
- Organización del estand: ${decisions.boothOrganization}

============================================================
XV. CONCLUSIÓN DEL EQUIPO
"${metadata.teamConclusion}"

============================================================
XVI. LISTA DE VERIFICACIÓN (CHECKLIST) DE ENTREGABLES INSAB
1. Marca, Logotipo y Lema Oficial (Boom Drinks) [CUMPLIDO]
2. Fichas Técnicas Estandarizadas de Blue Sharks y La Tóxica [CUMPLIDO]
3. Presupuesto Inicial ($140.00 aportados por 7 socios) [CUMPLIDO]
4. Control de Inocuidad y Sanidad Alimentaria [CUMPLIDO]
5. Sistema Digital de Control de Ventas y Caja en Efectivo [CUMPLIDO]
6. Comandas Digitales Enviadas a Cocina por WhatsApp [CUMPLIDO]
7. Registro de Mermas, Causas y Valoración Monetaria [CUMPLIDO]
8. Arqueo Contable de Caja y Estado de Resultados Oficial [CUMPLIDO]
9. Acta de Liquidación y Reparto Equitativo entre 7 Socios [CUMPLIDO]
10. Evaluación Cualitativa de Satisfacción del Cliente [CUMPLIDO]
11. Evaluación Multidimensional de Desempeño por Áreas [CUMPLIDO]
12. Portafolio de Evidencias y Montaje Temático de Estand [CUMPLIDO]

============================================================
XVII. FIRMAS DE LOS 7 INTEGRANTES
${partners.map((p, idx) => `${idx + 1}. ${p.name} (${p.role}): _______________________`).join('\n')}

============================================================
XVIII. RESULTADO FINAL DEL NEGOCIO (CIERRE FORMAL)
CAPITAL INVERTIDO: $${totals.initialCapitalContributed.toFixed(2)}
TOTAL VENDIDO: $${totals.totalSales.toFixed(2)}
COSTOS TOTALES: $${totals.totalCosts.toFixed(2)}
CAPITAL RECUPERADO: $${totals.capitalRecovered.toFixed(2)}
MERMA Y DESPERDICIO: $${totals.totalLossesValue.toFixed(2)}
GANANCIA O PÉRDIDA: $${totals.netProfit.toFixed(2)} (${totals.status})
NÚMERO DE SOCIOS: 7 Socios Cooperativistas
GANANCIA POR CADA SOCIO: $${totals.profitPerPartner.toFixed(2)}
TOTAL RECIBIDO POR CADA SOCIO: $${totals.totalReceivedPerPartner.toFixed(2)}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const logoSrc = metadata.customLogoUrl || '/logo.jpg';

  return (
    <div className="space-y-6">
      {/* Action Bar (Oculto en Impresión) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-100 text-cyan-800">
              <FileText className="h-5 w-5" />
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              Informe Oficial INSAB • Boom Drinks (18 Secciones Académicas)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Exporta manteniendo al 100% el diseño visual, tablas oficiales, logo institucional y nómina de los 7 socios cooperativistas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Botón Editar Portada & Logo */}
          <button
            onClick={() => setIsEditingMeta(!isEditingMeta)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
          >
            <Edit2 className="h-3.5 w-3.5" />
            {isEditingMeta ? 'Ocultar Editor' : 'Editar Portada & Logo'}
          </button>

          {/* Botón Descargar HTML Autónomo */}
          <button
            onClick={handleDownloadHtmlReport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition shadow-xs"
            title="Descargar documento HTML autónomo con 100% los estilos y tablas integradas"
          >
            <Globe className="h-4 w-4 text-emerald-700" />
            Exportar HTML (.html)
          </button>

          {/* Botón Descargar Word .doc con Formato Exacto */}
          <button
            onClick={handleDownloadWordDoc}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 transition shadow-xs"
            title="Descargar documento estructurado con formato para abrir en Microsoft Word"
          >
            <FileDown className="h-4 w-4 text-blue-700" />
            Descargar Word (.doc)
          </button>

          {/* Botón Copiar para Canva */}
          <button
            onClick={handleCopyTextForCanva}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 transition"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? '¡Copiado para Canva!' : 'Copiar para Canva'}
          </button>

          {/* Botón Imprimir a PDF */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white transition shadow-sm"
          >
            <Printer className="h-4 w-4" />
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* Editor Desplegable de Metadatos y Logo */}
      {isEditingMeta && (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4 print:hidden text-xs">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h4 className="font-extrabold text-slate-900 text-sm">
              Editar Datos Generales de la Portada y Logo del Instituto:
            </h4>
            <span className="text-[11px] text-slate-500">Se guardan automáticamente en memoria local</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Nombre de la Microempresa:</label>
              <input
                type="text"
                value={metadata.businessName}
                onChange={(e) => updateMetadata({ businessName: e.target.value })}
                className="w-full p-2 bg-white rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Slogan del Emprendimiento:</label>
              <input
                type="text"
                value={metadata.slogan || ''}
                onChange={(e) => updateMetadata({ slogan: e.target.value })}
                className="w-full p-2 bg-white rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Docente Facilitadora:</label>
              <input
                type="text"
                value={metadata.teacherName}
                onChange={(e) => updateMetadata({ teacherName: e.target.value })}
                className="w-full p-2 bg-white rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Fecha Oficial de la Feria:</label>
              <input
                type="text"
                value={metadata.fairDate}
                onChange={(e) => updateMetadata({ fairDate: e.target.value })}
                className="w-full p-2 bg-white rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Institución Educativa:</label>
              <input
                type="text"
                value={metadata.schoolName}
                onChange={(e) => updateMetadata({ schoolName: e.target.value })}
                className="w-full p-2 bg-white rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Cargar Logo del Instituto (logo.jpg):</label>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full p-1.5 bg-white rounded-xl border border-slate-300 text-[11px]"
                />
                {metadata.customLogoUrl && (
                  <button
                    onClick={() => updateMetadata({ customLogoUrl: '/logo.jpg' })}
                    className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px] whitespace-nowrap"
                  >
                    Restablecer
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Misión Cooperativa:</label>
              <textarea
                rows={2}
                value={metadata.mission || ''}
                onChange={(e) => updateMetadata({ mission: e.target.value })}
                className="w-full p-2 bg-white rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Visión Estratégica:</label>
              <textarea
                rows={2}
                value={metadata.vision || ''}
                onChange={(e) => updateMetadata({ vision: e.target.value })}
                className="w-full p-2 bg-white rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT BODY: Formato Académico Oficial con logo.jpg */}
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-md font-sans text-slate-900 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Encabezado Institucional con logo.jpg */}
        <div className="text-center space-y-2 border-b-2 border-slate-300 pb-6 print-avoid-break">
          <div className="flex items-center justify-center gap-4 mb-2">
            {!logoError ? (
              <img
                src={logoSrc}
                alt="Logo Instituto Nacional de San Bartolo"
                className="h-24 w-24 object-contain mx-auto rounded-full border border-slate-200 shadow-xs"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="h-20 w-20 mx-auto rounded-full bg-cyan-100 border-2 border-cyan-400 flex items-center justify-center text-cyan-800 font-extrabold text-2xl shadow-xs">
                INSAB
              </div>
            )}
          </div>
          <h1 className="text-base md:text-lg font-bold tracking-tight uppercase text-slate-950">
            {metadata.schoolName}
          </h1>
          <h2 className="text-xs md:text-sm font-semibold text-slate-700 uppercase">
            {metadata.moduleName}
          </h2>
          <h3 className="text-xs font-bold text-cyan-800 uppercase tracking-widest">
            {metadata.eventName}
          </h3>
          <p className="text-sm md:text-base font-extrabold text-slate-900 pt-1">
            INFORME FINAL DE EVALUACIÓN Y CIERRE DEL PROYECTO (EN CANVA)
          </p>
          <p className="text-xs italic text-slate-600">
            "DE LA IDEA A LA PUESTA EN MARCHA Y EVALUACIÓN DE LOS RESULTADOS"
          </p>
        </div>

        {/* Sección I: Portada y Ficha Técnica */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 text-xs print-avoid-break">
          <div className="font-bold border-b border-slate-200 pb-2 uppercase tracking-wide text-slate-900 flex justify-between items-center">
            <span>I. DATOS GENERALES DEL PROYECTO (PORTADA)</span>
            <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full font-bold">Microempresa Escolar</span>
          </div>
          <div className="space-y-2 text-slate-800">
            <div><strong>Nombre del negocio:</strong> <span className="font-extrabold uppercase text-cyan-900 ml-1 text-sm">{metadata.businessName}</span></div>
            <div><strong>Lema / Slogan:</strong> <span className="italic ml-1 text-slate-700">"{metadata.slogan || '¡Sabor explosivo que despierta tus sentidos!'}"</span></div>
            <div><strong>Nombre de los productos:</strong> <span className="ml-1 font-semibold">{metadata.productName}</span></div>
            <div>
              <strong>Integrantes del equipo (7 Socios Cooperativistas):</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 pl-2">
                {partners.map((p, idx) => (
                  <div key={p.id} className="bg-white p-2.5 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{idx + 1}. {p.name}</span>
                      <span className="text-slate-500 text-[10px]">{p.role}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                      ${p.capitalContributed.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 pt-3 border-t border-slate-200 text-xs">
              <div><strong>Docente Facilitadora:</strong> {metadata.teacherName}</div>
              <div><strong>Fecha Oficial de la Feria:</strong> {metadata.fairDate}</div>
            </div>
          </div>
        </div>

        {/* Sección II: Propósito */}
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed border-b border-slate-200 pb-6 print-avoid-break">
          <div className="font-bold text-slate-900 uppercase">II. PROPÓSITO DEL INFORME FINAL Y MARCO COOPERATIVO</div>
          <p>
            Una vez finalizada la Feria de Emprendimiento en el Instituto Nacional de San Bartolo, el equipo cooperativo de <strong>{metadata.businessName}</strong> realiza la evaluación objetiva y real de los resultados obtenidos.
            Este documento consolida la producción, el inventario, las ventas exactas generadas en caja, las mermas registradas, el capital total invertido de <strong>$140.00</strong> por los 7 socios ($20.00 cada uno), la recuperación del capital y la distribución cooperativa equitativa de las ganancias.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-cyan-900 block mb-1">Misión Cooperativa:</strong>
              <p className="text-[11px] text-slate-600">{metadata.mission}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-cyan-900 block mb-1">Visión Estratégica:</strong>
              <p className="text-[11px] text-slate-600">{metadata.vision}</p>
            </div>
          </div>
        </div>

        {/* Sección III: Producción */}
        <div className="space-y-3 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">III. RESULTADOS DE PRODUCCIÓN</div>
          <table className="w-full border border-slate-300 border-collapse">
            <thead className="bg-slate-100 font-bold">
              <tr>
                <th className="p-2.5 border border-slate-300">CONCEPTO</th>
                <th className="p-2.5 border border-slate-300 text-center">Blue Sharks ($2.50)</th>
                <th className="p-2.5 border border-slate-300 text-center">La Tóxica ($2.00)</th>
                <th className="p-2.5 border border-slate-300 text-center bg-slate-200">CANTIDAD TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border border-slate-300">Productos planificados (Meta inicial)</td><td className="p-2 border border-slate-300 text-center font-mono">50</td><td className="p-2 border border-slate-300 text-center font-mono">50</td><td className="p-2 border border-slate-300 text-center font-mono font-bold">100</td></tr>
              <tr className="bg-emerald-50/50"><td className="p-2 border border-slate-300 font-bold">Productos elaborados (en ventas)</td><td className="p-2 border border-slate-300 text-center font-mono font-bold text-blue-700">{totals.madeBlueSharks}</td><td className="p-2 border border-slate-300 text-center font-mono font-bold text-emerald-700">{totals.madeLaToxica}</td><td className="p-2 border border-slate-300 text-center font-mono font-black">{totals.madeBlueSharks + totals.madeLaToxica}</td></tr>
              <tr><td className="p-2 border border-slate-300">Productos entregados a Ventas</td><td className="p-2 border border-slate-300 text-center font-mono">{totals.madeBlueSharks}</td><td className="p-2 border border-slate-300 text-center font-mono">{totals.madeLaToxica}</td><td className="p-2 border border-slate-300 text-center font-mono font-bold">{totals.madeBlueSharks + totals.madeLaToxica}</td></tr>
              <tr className="bg-emerald-50/70"><td className="p-2 border border-slate-300 font-bold">Productos vendidos (Total equivalente)</td><td className="p-2 border border-slate-300 text-center font-mono text-blue-800 font-bold">{totals.equivalentBlueSharksTotal}</td><td className="p-2 border border-slate-300 text-center font-mono text-emerald-800 font-bold">{totals.equivalentLaToxicaTotal}</td><td className="p-2 border border-slate-300 text-center font-mono font-black">{totals.madeBlueSharks + totals.madeLaToxica}</td></tr>
              <tr><td className="p-2 border border-slate-300 text-rose-800">Productos dañados o perdidos (Manual)</td><td className="p-2 border border-slate-300 text-center font-mono text-rose-700">{production.manualDamagedBlueSharks || 0}</td><td className="p-2 border border-slate-300 text-center font-mono text-rose-700">{production.manualDamagedLaToxica || 0}</td><td className="p-2 border border-slate-300 text-center font-mono font-bold text-rose-800">{(production.manualDamagedBlueSharks || 0) + (production.manualDamagedLaToxica || 0)}</td></tr>
              <tr className="bg-slate-100 font-bold"><td className="p-2 border border-slate-300">Productos restantes (meta)</td><td className="p-2 border border-slate-300 text-center font-mono">{Math.max(0, 50 - totals.madeBlueSharks - (production.manualDamagedBlueSharks || 0))}</td><td className="p-2 border border-slate-300 text-center font-mono">{Math.max(0, 50 - totals.madeLaToxica - (production.manualDamagedLaToxica || 0))}</td><td className="p-2 border border-slate-300 text-center font-mono font-black">{Math.max(0, 100 - (totals.madeBlueSharks + totals.madeLaToxica) - ((production.manualDamagedBlueSharks || 0) + (production.manualDamagedLaToxica || 0)))}</td></tr>
            </tbody>
          </table>
          <p className="italic text-slate-700"><strong>¿Se logró producir la cantidad planificada? Justificación:</strong> {production.explanationPlannedAchieved}</p>
        </div>

        {/* Sección IV: Ventas */}
        <div className="space-y-3 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">IV. RESULTADOS DE VENTAS Y FACTURACIÓN</div>
          <table className="w-full border border-slate-300 border-collapse">
            <thead className="bg-slate-100 font-bold">
              <tr><th className="p-2.5 border border-slate-300">PRODUCTO / PRESENTACIÓN</th><th className="p-2.5 border border-slate-300 text-center">PRECIO</th><th className="p-2.5 border border-slate-300 text-center">UNIDADES VENDIDAS</th><th className="p-2.5 border border-slate-300 text-right">TOTAL INGRESOS</th></tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border border-slate-300">Blue Sharks (Individual con gomita de tiburón)</td><td className="p-2 border border-slate-300 text-center font-mono">$2.50</td><td className="p-2 border border-slate-300 text-center font-mono">{totals.blueSharksSold}</td><td className="p-2 border border-slate-300 text-right font-mono">${(totals.blueSharksSold * 2.50).toFixed(2)}</td></tr>
              <tr><td className="p-2 border border-slate-300">La Tóxica (Individual escarchada con chamoy)</td><td className="p-2 border border-slate-300 text-center font-mono">$2.00</td><td className="p-2 border border-slate-300 text-center font-mono">{totals.laToxicaSold}</td><td className="p-2 border border-slate-300 text-right font-mono">${(totals.laToxicaSold * 2.00).toFixed(2)}</td></tr>
              <tr><td className="p-2 border border-slate-300">Dúo Letal (Combo Pareja: 1 Blue Shark + 1 Tóxica)</td><td className="p-2 border border-slate-300 text-center font-mono">$4.00</td><td className="p-2 border border-slate-300 text-center font-mono">{totals.duoLetalSold}</td><td className="p-2 border border-slate-300 text-right font-mono">${(totals.duoLetalSold * 4.00).toFixed(2)}</td></tr>
              <tr><td className="p-2 border border-slate-300">Doble Peligro (Mega Combo: 2 Blue Sharks + 2 Tóxica)</td><td className="p-2 border border-slate-300 text-center font-mono">$7.50</td><td className="p-2 border border-slate-300 text-center font-mono">{totals.doblePeligroSold}</td><td className="p-2 border border-slate-300 text-right font-mono">${(totals.doblePeligroSold * 7.50).toFixed(2)}</td></tr>
              <tr className="bg-slate-100 font-bold"><td colSpan={2} className="p-2.5 border border-slate-300 uppercase">TOTALES:</td><td className="p-2.5 border border-slate-300 text-center font-mono font-black">{totals.totalUnitsSold}</td><td className="p-2.5 border border-slate-300 text-right font-mono font-black text-cyan-900">${totals.totalSales.toFixed(2)}</td></tr>
            </tbody>
          </table>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Ingresos</span>
              <strong className="text-cyan-800 font-mono text-sm">${totals.totalSales.toFixed(2)}</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Tickets Emitidos</span>
              <strong className="text-slate-800 font-mono text-sm">{totals.totalOrdersCount}</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Ticket Promedio</span>
              <strong className="text-slate-800 font-mono text-sm">${averageTicket.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Sección V: Mermas y Desperdicios */}
        <div className="space-y-3 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">V. MERMAS Y DESPERDICIOS</div>
          <table className="w-full border border-slate-300 border-collapse">
            <thead className="bg-slate-100 font-bold">
              <tr><th className="p-2.5 border border-slate-300">TIPO DE PÉRDIDA</th><th className="p-2.5 border border-slate-300 text-center">CANTIDAD</th><th className="p-2.5 border border-slate-300">CAUSA</th><th className="p-2.5 border border-slate-300 text-right">VALOR ESTIMADO</th></tr>
            </thead>
            <tbody>
              {losses.length === 0 ? (
                <tr><td colSpan={4} className="p-2.5 border border-slate-300 text-center text-slate-400">Sin mermas registradas durante la feria.</td></tr>
              ) : (
                losses.map((l) => (
                  <tr key={l.id}>
                    <td className="p-2 border border-slate-300">{l.lossType} ({l.description})</td>
                    <td className="p-2 border border-slate-300 text-center font-mono">{l.quantity}</td>
                    <td className="p-2 border border-slate-300">{l.cause}</td>
                    <td className="p-2 border border-slate-300 text-right font-mono font-bold text-rose-700">${l.estimatedValue.toFixed(2)}</td>
                  </tr>
                ))
              )}
              <tr className="bg-slate-100 font-bold"><td colSpan={3} className="p-2.5 border border-slate-300 uppercase">TOTAL MERMAS:</td><td className="p-2.5 border border-slate-300 text-right font-mono font-black text-rose-800">${totals.totalLossesValue.toFixed(2)}</td></tr>
            </tbody>
          </table>
          <p><strong>Principal causa de las pérdidas:</strong> {metadata.mainLossCause}</p>
          <p><strong>¿Cómo podría evitarse en una próxima producción?:</strong> {metadata.howToAvoidLosses}</p>
        </div>

        {/* Sección VI & VII: Resultado Económico y Recuperación */}
        <div className="space-y-3 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">VI. RESULTADO ECONÓMICO</div>
          <div className="grid grid-cols-3 gap-2 border border-slate-300 p-3 rounded-lg bg-slate-50 font-medium">
            <div>Capital invertido: <strong>${totals.initialCapitalContributed.toFixed(2)}</strong></div>
            <div>Total ventas: <strong>${totals.totalSales.toFixed(2)}</strong></div>
            <div>Total costos: <strong>${totals.totalCosts.toFixed(2)}</strong></div>
          </div>
          <div className="p-4 bg-cyan-50/50 border-2 border-cyan-300 rounded-xl text-center space-y-1 font-semibold">
            <div className="text-[11px] uppercase tracking-wide text-cyan-900 font-bold">Fórmula Contable Oficial:</div>
            <div className="text-sm font-extrabold text-slate-900">GANANCIA = INGRESOS POR VENTAS – COSTOS TOTALES</div>
            <div className="text-base font-black font-mono pt-1 text-slate-950">
              ${totals.totalSales.toFixed(2)} – ${totals.totalCosts.toFixed(2)} = <span className="text-emerald-700">${totals.netProfit.toFixed(2)}</span>
            </div>
            <div className="pt-2 text-xs font-bold text-emerald-800">Resultado Oficial: ☑ {totals.status}</div>
          </div>

          <div className="pt-3 space-y-2">
            <div className="font-bold text-sm uppercase text-slate-900">VII. RECUPERACIÓN DEL CAPITAL DE INVERSIÓN</div>
            <div className="grid grid-cols-3 gap-2 border border-slate-300 p-3 rounded-lg bg-slate-50 font-medium">
              <div>Capital aportado: <strong>${totals.initialCapitalContributed.toFixed(2)}</strong></div>
              <div>Capital recuperado: <strong>${totals.capitalRecovered.toFixed(2)}</strong></div>
              <div>Capital pendiente: <strong>${totals.capitalPending.toFixed(2)}</strong></div>
            </div>
            <div className="font-bold">Resultado Oficial: ☑ {totals.capitalStatus}</div>
            <p className="italic text-slate-700"><strong>Explicación:</strong> {metadata.capitalRecoveryExplanation}</p>
          </div>
        </div>

        {/* Sección VIII: 7 Socios */}
        <div className="space-y-3 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">VIII. DISTRIBUCIÓN ENTRE LOS 7 SOCIOS COOPERATIVISTAS</div>
          <table className="w-full border border-slate-300 border-collapse">
            <thead className="bg-slate-100 font-bold">
              <tr>
                <th className="p-2 border border-slate-300">N.º</th>
                <th className="p-2 border border-slate-300">SOCIO</th>
                <th className="p-2 border border-slate-300">ROL</th>
                <th className="p-2 border border-slate-300 text-right">CAPITAL APORTADO</th>
                <th className="p-2 border border-slate-300 text-right">GANANCIA</th>
                <th className="p-2 border border-slate-300 text-right font-extrabold bg-teal-50">CAPITAL + GANANCIA</th>
              </tr>
            </thead>
            <tbody>
              ${partners.map((p, idx) => {
                const gain = totals.netProfit > 0 ? totals.netProfit / 7 : 0;
                return (
                  <tr key={p.id}>
                    <td className="p-2 border border-slate-300 text-center font-mono">{idx + 1}</td>
                    <td className="p-2 border border-slate-300 font-bold">{p.name}</td>
                    <td className="p-2 border border-slate-300 text-slate-600">{p.role}</td>
                    <td className="p-2 border border-slate-300 text-right font-mono">${p.capitalContributed.toFixed(2)}</td>
                    <td className="p-2 border border-slate-300 text-right font-mono text-emerald-700 font-bold">${gain.toFixed(2)}</td>
                    <td className="p-2 border border-slate-300 text-right font-mono font-black text-teal-950 bg-teal-50/50">${(p.capitalContributed + gain).toFixed(2)}</td>
                  </tr>
                );
              })}
              <tr className="bg-slate-100 font-bold">
                <td colSpan={3} className="p-2 border border-slate-300 uppercase">TOTALES:</td>
                <td className="p-2 border border-slate-300 text-right font-mono font-black">${totals.initialCapitalContributed.toFixed(2)}</td>
                <td className="p-2 border border-slate-300 text-right font-mono font-black text-emerald-800">${(totals.netProfit > 0 ? totals.netProfit : 0).toFixed(2)}</td>
                <td className="p-2 border border-slate-300 text-right font-mono font-black text-teal-950 bg-teal-100">
                  ${(totals.initialCapitalContributed + (totals.netProfit > 0 ? totals.netProfit : 0)).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
          <p><strong>¿La distribución se realizó de acuerdo con lo establecido inicialmente por los socios?:</strong> [X] Sí  [ ] No</p>
          <p className="italic text-slate-700"><strong>Explicación:</strong> {metadata.distributionExplanation}</p>
        </div>

        {/* Sección IX: Problemas y Soluciones */}
        <div className="space-y-3 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">IX. PROBLEMAS PRESENTADOS Y SOLUCIONES APLICADAS</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { t: '1. Producción', p: problems.production.problem, s: problems.production.solution },
              { t: '2. Inventario', p: problems.inventory.problem, s: problems.inventory.solution },
              { t: '3. Ventas y Caja', p: problems.sales.problem, s: problems.sales.solution },
              { t: '4. Atención al cliente', p: problems.customerService.problem, s: problems.customerService.solution },
              { t: '5. Trabajo en equipo', p: problems.teamwork.problem, s: problems.teamwork.solution },
              { t: '6. Otros problemas', p: problems.others.problem, s: problems.others.solution },
            ].map(({ t, p, s }) => (
              <div key={t} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <strong className="text-slate-900 block">{t}</strong>
                <div><span className="text-rose-700 font-bold">Problema:</span> {p}</div>
                <div><span className="text-emerald-700 font-bold">Solución:</span> {s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección X: Atención al Cliente */}
        <div className="space-y-3 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">X. VALORACIÓN DE LA ATENCIÓN AL CLIENTE</div>
          <table className="w-full border border-slate-300 border-collapse">
            <thead className="bg-slate-100 font-bold">
              <tr><th className="p-2 border border-slate-300">ASPECTO</th><th className="p-2 border border-slate-300 text-center w-14">SÍ</th><th className="p-2 border border-slate-300 text-center w-14">NO</th><th className="p-2 border border-slate-300 text-center w-28">DEBE MEJORARSE</th></tr>
            </thead>
            <tbody>
              {[
                { k: 'saludoCordial', l: 'Se saludó cordialmente' },
                { k: 'explicoProducto', l: 'Se explicó el producto (Blue Sharks / La Tóxica)' },
                { k: 'informoPrecio', l: 'Se informó el precio' },
                { k: 'atendioDudas', l: 'Se atendieron dudas' },
                { k: 'ofrecioAlternativas', l: 'Se ofrecieron alternativas (Combos)' },
                { k: 'realizoCobro', l: 'Se realizó correctamente el cobro' },
                { k: 'entregoProducto', l: 'Se entregó correctamente el producto' },
                { k: 'agradecioCompra', l: 'Se agradeció la compra' },
              ].map(({ k, l }) => (
                <tr key={k}>
                  <td className="p-1.5 border border-slate-300 font-medium">{l}</td>
                  <td className="p-1.5 border border-slate-300 text-center font-bold font-mono">{(serviceRating as any)[k] === 'SI' ? 'X' : ''}</td>
                  <td className="p-1.5 border border-slate-300 text-center font-bold font-mono">{(serviceRating as any)[k] === 'NO' ? 'X' : ''}</td>
                  <td className="p-1.5 border border-slate-300 text-center font-bold font-mono">{(serviceRating as any)[k] === 'DEBE_MEJORARSE' ? 'X' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="italic text-slate-700"><strong>Comentarios recibidos de clientes:</strong> {serviceRating.customerComments}</p>
        </div>

        {/* Sección XI & XII: Evaluación de Desempeño por Áreas */}
        <div className="space-y-3 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">XI & XII. EVALUACIÓN DEL DESEMPEÑO POR ÁREAS DE TRABAJO</div>
          <table className="w-full border border-slate-300 border-collapse">
            <thead className="bg-slate-100 font-bold">
              <tr>
                <th className="p-2 border border-slate-300">ÁREA</th>
                <th className="p-2 border border-slate-300">QUÉ FUNCIONÓ BIEN</th>
                <th className="p-2 border border-slate-300">DIFICULTADES</th>
                <th className="p-2 border border-slate-300">ASPECTOS A MEJORAR</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr key={a.area}>
                  <td className="p-2 border border-slate-300 font-bold">{a.area}</td>
                  <td className="p-2 border border-slate-300 text-emerald-800 font-medium">{a.workedWell}</td>
                  <td className="p-2 border border-slate-300 text-rose-800">{a.hadDifficulties}</td>
                  <td className="p-2 border border-slate-300 text-blue-800">{a.toImprove}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sección XIII: Aprendizajes */}
        <div className="space-y-2 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">XIII. PRINCIPALES APRENDIZAJES</div>
          <p><strong>1. ¿Qué aprendimos al producir?:</strong> {learnings.productionLearning}</p>
          <p><strong>2. ¿Qué aprendimos al vender?:</strong> {learnings.salesLearning}</p>
          <p><strong>3. ¿Qué aprendimos sobre el cliente?:</strong> {learnings.customerLearning}</p>
          <p><strong>4. ¿Qué aprendimos sobre el dinero y las ganancias?:</strong> {learnings.moneyAndProfitsLearning}</p>
          <p><strong>5. ¿Qué aprendimos sobre trabajar en equipo?:</strong> {learnings.teamworkLearning}</p>
          <p><strong>6. ¿Qué aprendimos que no habíamos comprendido al realizar solamente los cálculos en el aula?:</strong> {learnings.differenceFromClassroomLearning}</p>
        </div>

        {/* Sección XIV: Decisiones Futuras */}
        <div className="space-y-3 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">XIV. DECISIONES Y PROYECCIONES ESTRATÉGICAS FUTURAS</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200"><strong>Producción:</strong> {decisions.production}</div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200"><strong>Inventario:</strong> {decisions.inventory}</div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200"><strong>Ventas:</strong> {decisions.sales}</div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200"><strong>Atención al cliente:</strong> {decisions.customerService}</div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200"><strong>Publicidad y Redes:</strong> {decisions.advertising}</div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200"><strong>Organización del Estand:</strong> {decisions.boothOrganization}</div>
          </div>
        </div>

        {/* Sección XV: Conclusión */}
        <div className="space-y-2 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">XV. CONCLUSIÓN DEL EQUIPO (8 A 12 LÍNEAS)</div>
          <p className="p-4 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed italic text-justify text-slate-800">
            {metadata.teamConclusion}
          </p>
        </div>

        {/* Sección XVI: Checklist de Entregables Oficiales */}
        <div className="space-y-3 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">
            XVI. LISTA DE VERIFICACIÓN (CHECKLIST) DE ENTREGABLES Y EVIDENCIAS DE EVALUACIÓN INSAB
          </div>
          <table className="w-full border border-slate-300 border-collapse">
            <thead className="bg-slate-100 font-bold">
              <tr>
                <th className="p-2 border border-slate-300 text-center w-10">N.º</th>
                <th className="p-2 border border-slate-300">CRITERIO / ENTREGABLE EVALUADO</th>
                <th className="p-2 border border-slate-300">ÁREA RESPONSABLE</th>
                <th className="p-2 border border-slate-300 text-center w-28">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {[
                { n: 1, c: 'Marca, Logotipo y Lema Oficial (Boom Drinks)', a: 'Marketing' },
                { n: 2, c: 'Fichas Técnicas Estandarizadas de Blue Sharks y La Tóxica con recetas', a: 'Producción' },
                { n: 3, c: 'Presupuesto y Aportes Cooperativos ($140.00 aportados por los 7 socios)', a: 'Finanzas' },
                { n: 4, c: 'Protocolo de Inocuidad y Sanidad Alimentaria (Redecillas, guantes y cadena de frío)', a: 'Producción' },
                { n: 5, c: 'Sistema Digital de Control de Ventas en Caja y Cobro en Efectivo', a: 'Caja / Ventas' },
                { n: 6, c: 'Comandas Digitales Enviadas a Cocina por WhatsApp', a: 'Logística' },
                { n: 7, c: 'Registro Diario de Mermas, Causas y Valoración Monetaria', a: 'Inventario' },
                { n: 8, c: 'Arqueo Contable de Caja y Estado de Resultados Oficial (Ventas – Costos)', a: 'Finanzas' },
                { n: 9, c: 'Acta de Liquidación y Reparto Equitativo entre 7 Socios ($20.00 + ganancia)', a: 'Gerencia' },
                { n: 10, c: 'Evaluación Cualitativa de Satisfacción del Cliente (8 criterios evaluados)', a: 'Atención al Cliente' },
                { n: 11, c: 'Evaluación Multidimensional de Desempeño por Áreas de Trabajo', a: 'Gerencia General' },
                { n: 12, c: 'Portafolio de Evidencias Fotográficas y Montaje Temático de Estand', a: 'Logística / Estand' },
              ].map((item) => (
                <tr key={item.n}>
                  <td className="p-2 border border-slate-300 text-center font-mono">{item.n}</td>
                  <td className="p-2 border border-slate-300 font-semibold">{item.c}</td>
                  <td className="p-2 border border-slate-300 text-slate-600">{item.a}</td>
                  <td className="p-2 border border-slate-300 text-center font-bold text-emerald-800 bg-emerald-50">
                    ☑ CUMPLIDO
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sección XVII: Firmas de los 7 Socios */}
        <div className="space-y-3 border-b border-slate-200 pb-6 text-xs print-avoid-break">
          <div className="font-bold text-sm uppercase text-slate-900">XVII. FIRMAS DE LOS 7 INTEGRANTES COOPERATIVISTAS</div>
          <p className="text-slate-600">Nuestro proyecto pasó por las diferentes etapas cooperativas: <br /><strong>IDEA → PLANIFICACIÓN → PRODUCCIÓN → PUBLICIDAD → GIRA PROMOCIONAL → ESTAND → VENTAS → CONTROL → EVALUACIÓN → APRENDIZAJE</strong></p>
          <table className="w-full border border-slate-300 border-collapse mt-2">
            <thead className="bg-slate-100 font-bold">
              <tr><th className="p-2 border border-slate-300 text-center w-10">N.º</th><th className="p-2 border border-slate-300">NOMBRE DEL SOCIO</th><th className="p-2 border border-slate-300">ROL</th><th className="p-2 border border-slate-300 text-center">FIRMA</th></tr>
            </thead>
            <tbody>
              {partners.map((p, idx) => (
                <tr key={p.id}>
                  <td className="p-2.5 border border-slate-300 text-center font-mono">{idx + 1}</td>
                  <td className="p-2.5 border border-slate-300 font-bold">{p.name}</td>
                  <td className="p-2.5 border border-slate-300 text-slate-600">{p.role}</td>
                  <td className="p-2.5 border border-slate-300 text-center text-slate-400 font-serif italic text-sm">_________________________</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pt-3">
            <strong>OBSERVACIONES DE LA DOCENTE (Profesora Ángela Marisol Osegueda):</strong>
            <div className="h-16 border-b border-dashed border-slate-400 mt-2"></div>
          </div>
        </div>

        {/* Cierre Formal XVIII */}
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-300 text-xs space-y-2 print-avoid-break">
          <div className="font-black text-center uppercase tracking-wider text-sm border-b border-slate-300 pb-2 text-slate-900">
            XVIII. RESULTADO FINAL DEL NEGOCIO (CIERRE FORMAL DE PROYECTO)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800 pt-1">
            <div className="flex justify-between border-b border-slate-200 pb-1"><strong>CAPITAL INVERTIDO (7 x $20):</strong><span className="font-mono font-bold">${totals.initialCapitalContributed.toFixed(2)}</span></div>
            <div className="flex justify-between border-b border-slate-200 pb-1"><strong>TOTAL VENDIDO:</strong><span className="font-mono font-bold text-cyan-800">${totals.totalSales.toFixed(2)}</span></div>
            <div className="flex justify-between border-b border-slate-200 pb-1"><strong>COSTOS TOTALES:</strong><span className="font-mono font-bold">${totals.totalCosts.toFixed(2)}</span></div>
            <div className="flex justify-between border-b border-slate-200 pb-1"><strong>CAPITAL RECUPERADO:</strong><span className="font-mono font-bold text-emerald-800">${totals.capitalRecovered.toFixed(2)}</span></div>
            <div className="flex justify-between border-b border-slate-200 pb-1"><strong>GANANCIA TOTAL:</strong><span className="font-mono font-extrabold text-emerald-900">${totals.netProfit.toFixed(2)}</span></div>
            <div className="flex justify-between border-b border-slate-200 pb-1"><strong>NÚMERO DE SOCIOS:</strong><span className="font-mono font-bold">7 Socios</span></div>
            <div className="flex justify-between border-b border-slate-200 pb-1"><strong>GANANCIA POR SOCIO:</strong><span className="font-mono font-bold text-cyan-800">${totals.profitPerPartner.toFixed(2)}</span></div>
            <div className="flex justify-between bg-emerald-100/60 p-2 rounded font-bold text-emerald-950 sm:col-span-2 text-sm">
              <span>TOTAL RECIBIDO POR CADA UNO DE LOS 7 SOCIOS:</span>
              <span className="font-mono text-base">${totals.totalReceivedPerPartner.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   12. MAIN APP COMPONENT & NAVBAR
   ========================================================================== */

export type ActiveTab = 'pos' | 'sales' | 'production' | 'finances' | 'assessment' | 'evidence' | 'report';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');
  const { totals, orders, resetToCleanFair } = useApp();

  const navItems = [
    { id: 'pos' as ActiveTab, label: 'Caja POS', icon: ShoppingCart },
    { id: 'sales' as ActiveTab, label: `Ventas (${orders.length})`, icon: Receipt },
    { id: 'production' as ActiveTab, label: 'Producción & Mermas', icon: Factory },
    { id: 'finances' as ActiveTab, label: 'Finanzas & 7 Socios', icon: Wallet },
    { id: 'assessment' as ActiveTab, label: 'Evaluación Cualitativa', icon: ClipboardList },
    { id: 'evidence' as ActiveTab, label: 'Checklist INSAB', icon: Camera },
    { id: 'report' as ActiveTab, label: 'Informe INSAB Oficial', icon: FileText, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-cyan-500 selection:text-white flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 print:hidden shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md font-black text-xl">
                💥
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-slate-900 uppercase">BOOM DRINKS</span>
                  <span className="text-[10px] bg-cyan-100 text-cyan-800 font-extrabold px-2 py-0.5 rounded-full border border-cyan-200">
                    INSAB 2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Módulo 3.7 • 7 Socios Cooperativistas</p>
              </div>
            </div>
            <button
              onClick={() => { if (confirm('¿Reiniciar a 0 todas las ventas para la feria en vivo?')) resetToCleanFair(); }}
              className="text-[11px] px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition md:hidden font-semibold"
            >
              Reiniciar
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs w-full md:w-auto overflow-x-auto justify-between md:justify-end">
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">Ventas:</span>
              <span className="font-mono font-extrabold text-cyan-700">${totals.totalSales.toFixed(2)}</span>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">Ganancia:</span>
              <span className={`font-mono font-extrabold ${totals.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ${totals.netProfit.toFixed(2)}
              </span>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">Bebidas:</span>
              <span className="font-mono font-bold text-slate-800">
                {totals.equivalentBlueSharksTotal + totals.equivalentLaToxicaTotal}
              </span>
            </div>
            <button
              onClick={() => { if (confirm('¿Reiniciar a 0 todas las ventas para la feria en vivo?')) resetToCleanFair(); }}
              className="hidden md:block text-[11px] px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition font-semibold"
            >
              Reiniciar a 0 para Feria
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 py-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? item.highlight ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-900 text-white shadow-xs'
                      : item.highlight ? 'text-cyan-700 bg-cyan-50/70 hover:bg-cyan-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0 print:m-0 print:max-w-none">
        {activeTab === 'pos' && <PosView />}
        {activeTab === 'sales' && <SalesHistoryView />}
        {activeTab === 'production' && <ProductionInventoryView />}
        {activeTab === 'finances' && <FinancesPartnersView />}
        {activeTab === 'assessment' && <QualitativeAssessmentView />}
        {activeTab === 'evidence' && <EvidencePortfolioView />}
        {activeTab === 'report' && <OfficialInsabReportView />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div><strong className="text-slate-800">Boom Drinks</strong> • Microempresa Cooperativa Escolar</div>
          <div>Instituto Nacional de San Bartolo (INSAB) • Módulo 3.7 • Profa. Ángela Marisol Osegueda</div>
        </div>
      </footer>

      <TicketModal />

      {/* Estilos autónomos integrados directamente en este archivo */}
      <style>{`
        @media print {
          @page { size: letter portrait; margin: 12mm 14mm 14mm 14mm; }
          body { background-color: #ffffff !important; color: #0f172a !important; font-size: 9.5pt !important; line-height: 1.35 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          header, footer, nav, button, .print\\:hidden { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; width: 100% !important; }
          .print-avoid-break { page-break-inside: avoid !important; break-inside: avoid !important; }
          table { page-break-inside: avoid !important; break-inside: avoid !important; border-collapse: collapse !important; width: 100% !important; font-size: 8.5pt !important; }
          th, td { border-color: #cbd5e1 !important; padding: 4px 6px !important; }
          th { background-color: #f1f5f9 !important; color: #0f172a !important; font-weight: bold !important; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}

