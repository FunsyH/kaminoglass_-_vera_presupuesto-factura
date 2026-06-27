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
function fechaHoy() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// Número de presupuesto inicial SUGERIDO. Es editable a mano en el formulario.
// TODO: cuando definas la numeración real (ya habéis emitido varios), cambia
// este valor por el siguiente que toque. Cuando haya base de datos, este número
// pasará a ser un contador automático compartido.
const NUMERO_INICIAL = 'KNG-2026-0055';

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
      docNumber: NUMERO_INICIAL,
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
