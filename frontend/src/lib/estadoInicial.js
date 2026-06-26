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

// Devuelve el presupuesto de ejemplo "Roca Lisa · 40 pax".
// Sirve para que la app arranque mostrando datos realistas en vez de un formulario vacío.
//
// Comprobación mental del cálculo (modo 'auto', IVA 21 %):
//   base  = 245 + 220 + 200 + 260 + 200 + 50 + 250 = 1425
//   iva   = 1425 * 0.21 = 299.25
//   total = 1425 + 299.25 = 1724.25
// Por tanto calcularTotales(crearQuoteInicial()) -> { base: 1425, iva: 299.25, total: 1724.25 }.
export function crearQuoteInicial() {
  return {
    brand: 'kng',
    lang: 'es',
    event: {
      title: 'Roca Lisa · 40 pax',
      dateText: '20 de junio, 2026',
      place: 'Roca Lisa, Ibiza',
      serviceText: '4 h de servicio + 3 h montaje y limpieza',
      docNumber: 'KNG-2026-0042',
      issueDate: '20/06/2026',
      validityDays: '15',
    },
    sections: [
      {
        id: 's1',
        title: 'Personal',
        showSubtotal: false,
        items: [
          { description: 'Bartender', note: '4 h servicio + 3 h montaje/cierre', qty: 1, unitPrice: 245 },
          { description: 'Camarero', qty: 1, unitPrice: 220 },
          { description: 'Personal de limpieza', qty: 1, unitPrice: 200 },
        ],
      },
      {
        id: 's2',
        title: 'Alquiler de material',
        showSubtotal: false,
        items: [
          { description: 'Barra pequeña con backbar', qty: 1, unitPrice: 260 },
          { description: 'Cristalería', note: 'Cristal', qty: 1, unitPrice: 200 },
          { description: 'Equipamiento para cócteles', qty: 1, unitPrice: 50 },
          { description: 'Transporte y recogida', qty: 1, unitPrice: 250 },
        ],
      },
    ],
    totalMode: 'auto',
    manualTotal: null,
    ivaRate: 0.21,
  };
}
