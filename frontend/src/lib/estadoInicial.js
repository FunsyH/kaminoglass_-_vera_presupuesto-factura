// estadoInicial.js
// Datos de arranque del presupuesto y "fábricas" de secciones/items vacíos.
// Sin React, sin UI: solo devuelve objetos planos.

// Contador simple para generar ids únicos de secciones nuevas.
// Por qué un contador y no Date.now(): si el usuario pulsa "añadir" dos veces
// muy rápido, Date.now() podría repetir el mismo milisegundo y dar ids iguales.
// Un contador que solo sube nunca repite dentro de la misma sesión.
let contadorSecciones = 0;

// Devuelve un item (línea) vacío, listo para que el usuario lo rellene.
// qty y amount empiezan en null (no 0) para distinguir "sin valor" de "vale 0".
export function crearItemVacio() {
  // unitPrice = precio por unidad. El importe total de la línea se calcula
  // como cantidad × unitPrice (ver lib/calculos.js -> importeLinea).
  return { description: '', note: '', qty: null, unitPrice: null };
}

// Devuelve una sección vacía con un id dado y una primera línea vacía dentro.
// Si no pasan id, generamos uno con el contador (p.ej. 's3', 's4'...).
export function crearSeccionVacia(id) {
  contadorSecciones += 1;
  const seccionId = id || 's' + contadorSecciones;
  return { id: seccionId, title: '', showSubtotal: false, items: [crearItemVacio()] };
}

// Fecha de hoy en formato español dd/mm/aaaa (para la fecha de emisión).
export function fechaHoy() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// Número siguiente sugerido por marca. Editable a mano en el formulario.
const NUMEROS_INICIALES = {
  kng:  'KNG-2026-0039',
  vera: 'VERA-2026-0015',
};

export function numeroInicialPara(brand) {
  return NUMEROS_INICIALES[brand] || NUMEROS_INICIALES.kng;
}

// Devuelve un presupuesto VACÍO listo para rellenar (campos en blanco; el
// formulario muestra ejemplos como placeholder gris). Arranca con 2 secciones
// vacías (estructura tipo Staff / Material) y la fecha de emisión = hoy.
export function crearQuoteInicial() {
  return {
    brand: 'kng',
    lang: 'es',
    event: {
      title: '',
      dateText: '',
      place: '',
      serviceText: '',
      docNumber: numeroInicialPara('kng'),
      issueDate: fechaHoy(),
      validityDays: '15',
    },
    sections: [
      { id: 's1', title: '', showSubtotal: false, items: [crearItemVacio()] },
      { id: 's2', title: '', showSubtotal: false, items: [crearItemVacio()] },
    ],
    totalMode: 'auto',
    manualTotal: null,
    manualBase: null,
    ivaRate: 0.21,
  };
}

// Presupuesto "Open Bar July · Villa Los Olivos" migrado del formato viejo (PDF
// en inglés). Total a mano SIN IVA = 11.140 €. Secciones con su total en el
// título (en modo sin IVA no se muestran columnas de importe).
// Para usarlo: en App.jsx, useState(crearQuoteOpenBarLosOlivos) en vez de crearQuoteInicial.
export function crearQuoteOpenBarLosOlivos() {
  const linea = (description, note) => ({ description, note: note || '', qty: null, unitPrice: null });
  return {
    brand: 'kng',
    lang: 'en',
    event: {
      title: 'Open Bar July with Limo · 30/50 pax · Villa Los Olivos',
      dateText: '16:00 till 03:00am',
      place: 'Villa Los Olivos',
      serviceText: '11 h of service + 4 h closing and set up · Option 1',
      docNumber: numeroInicialPara('kng'),
      issueDate: fechaHoy(),
      validityDays: '15',
    },
    sections: [
      {
        id: 's1', title: 'Staff (15 hours service) — approx 3.000 €', showSubtotal: false,
        items: [
          linea('1 Bar Manager', '40 €/h'),
          linea('2 Barman', '35 €/h'),
          linea('2 Waiter', '30 €/h'),
          linea('1 Cleaner', '30 €/h'),
        ],
      },
      {
        id: 's2', title: 'Rentals — 1.740 €', showSubtotal: false,
        items: [
          linea('2 Master bar'),
          linea('2 Bar back'),
          linea('4 Trash bins'),
          linea('Equipment for cocktails and event'),
          linea('Glassware'),
          linea('10 Ashtrays'),
        ],
      },
      {
        id: 's3', title: 'Extras — 1.900 €', showSubtotal: false,
        items: [
          linea('Ice delivery with freezer'),
          linea('Rubbish collection'),
          linea('Transport and collection'),
          linea('Organization fee and bar consulting'),
          linea('Fruit shopping for cocktails'),
        ],
      },
      {
        id: 's4', title: 'Open Bar — 4.500 €', showSubtotal: false,
        items: [
          linea('3/4 cocktails of choice, signature or classics'),
          linea('Full open bar with wine, rosé, red & champagne', 'White Albariño Mar de Frades · Côte de Provence Mirabal · Rivera del Duero Pago de Capellanes · Non Dosé Perpetuelle'),
          linea('Full open bar with spirits', 'Tequila Don Julio Reposado · Mezcal Cómplice · Ron Diplomático Reserva Exclusiva · Vodka Grey Goose · Gin Monkey 47'),
          linea('Full selection of soft drinks', 'Pink grapefruit soda, ginger beer, coconut water, Coca-Cola, Sprite, etc.'),
          linea('Water station', 'Homemade lemonade, pink grapefruit lemonade with blue spirulina, ice water'),
        ],
      },
    ],
    totalMode: 'manualSinIva',
    manualTotal: 11140,
    manualBase: null,
    ivaRate: 0.21,
  };
}
