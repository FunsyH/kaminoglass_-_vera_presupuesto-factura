// calculos.js
// Reglas de negocio para los totales del presupuesto (sin React, sin UI).
//
// Reglas confirmadas con el usuario:
// - Los importes por línea (amount) son SIN IVA (base).
// - El IVA del 21 % se suma ENCIMA de la base.
// - Modo 'auto':   base = suma de líneas;  iva = base * 0.21;  total = base + iva.
// - Modo 'manual': el usuario teclea un total que YA incluye IVA;
//                  entonces base = total / 1.21;  iva = total - base;  total = total.
// - Una línea sin importe (amount null/undefined) se ignora en la suma.

// Redondea un número a 2 decimales (céntimos).
// Por qué existe: el dinero solo tiene 2 decimales; trabajar con más
// (p.ej. 299.2500001 por errores de coma flotante) descuadra los totales.
function redondear2(n) {
  return Math.round(n * 100) / 100;
}

// Comprueba si un valor es un número usable como importe.
// Por qué: amount puede venir como null, undefined o '' desde el formulario,
// y no queremos sumar esos casos.
function esNumeroValido(n) {
  return typeof n === 'number' && !Number.isNaN(n);
}

// Suma los importes (amount) de todas las líneas de todas las secciones.
// Ignora las líneas que no tengan un número válido.
export function sumarImportes(sections) {
  // Protección: si sections no es un array, no hay nada que sumar -> 0.
  if (!Array.isArray(sections)) {
    return 0;
  }

  let total = 0;
  for (const section of sections) {
    // Reutilizamos subtotalSeccion para no repetir la lógica de recorrer items.
    total += subtotalSeccion(section);
  }
  return redondear2(total);
}

// Importe TOTAL de una línea = cantidad × precio unitario.
// - unitPrice es el precio por unidad (puede faltar -> línea solo descriptiva, 0).
// - qty es la cantidad; si no se indica, se asume 1 (una unidad).
export function importeLinea(item) {
  if (!item || !esNumeroValido(item.unitPrice)) {
    return 0; // sin precio unitario, la línea no suma (solo describe)
  }
  const cantidad = esNumeroValido(item.qty) ? item.qty : 1;
  return redondear2(item.unitPrice * cantidad);
}

// Subtotal de UNA sección: suma de los importes (cant × unitario) de sus items.
// Sirve para el subtotal opcional que se muestra por sección.
export function subtotalSeccion(section) {
  // Protección: si la sección o sus items no existen, el subtotal es 0.
  if (!section || !Array.isArray(section.items)) {
    return 0;
  }

  let total = 0;
  for (const item of section.items) {
    total += importeLinea(item);
  }
  return redondear2(total);
}

// Devuelve { base, iva, total } SIEMPRE consistentes: base + iva === total.
// quote = { sections, totalMode, manualTotal?, manualBase?, ivaRate (p.ej 0.21) }
// totalMode:
//   'auto'       -> base = suma de líneas; iva encima.
//   'manual'     -> el usuario teclea el TOTAL final (con IVA); se desglosa atrás.
//   'manualBase' -> el usuario teclea la BASE (sin IVA); se le suma el IVA encima.
export function calcularTotales(quote) {
  // Protección: si no llega un quote válido, devolvemos todo a cero.
  if (!quote || typeof quote !== 'object') {
    return { base: 0, iva: 0, total: 0 };
  }

  // Si no nos dan ivaRate, usamos 0.21 (21 %) por defecto.
  const ivaRate = esNumeroValido(quote.ivaRate) ? quote.ivaRate : 0.21;

  if (quote.totalMode === 'manual') {
    return calcularManual(quote.manualTotal, ivaRate);
  }

  if (quote.totalMode === 'manualBase') {
    return calcularManualBase(quote.manualBase, ivaRate);
  }

  // Por defecto (y para 'auto') calculamos desde las líneas.
  return calcularAuto(quote.sections, ivaRate);
}

// Modo 'auto': partimos de la base (suma de líneas) y añadimos el IVA encima.
function calcularAuto(sections, ivaRate) {
  const base = sumarImportes(sections); // ya viene redondeado a 2 decimales
  const iva = redondear2(base * ivaRate);

  // IMPORTANTE: calculamos total = base + iva con base e iva YA redondeados.
  // Así base + iva === total exactamente y nunca aparece un céntimo "fantasma".
  const total = redondear2(base + iva);

  return { base, iva, total };
}

// Modo 'manual': el total ya incluye IVA; sacamos base e iva hacia atrás.
function calcularManual(manualTotal, ivaRate) {
  // Protección: si el total manual no es válido, devolvemos ceros.
  if (!esNumeroValido(manualTotal)) {
    return { base: 0, iva: 0, total: 0 };
  }

  const total = redondear2(manualTotal);

  // base = total / (1 + ivaRate). Con IVA 21 % -> total / 1.21.
  const base = redondear2(total / (1 + ivaRate));

  // IMPORTANTE: el iva lo calculamos como (total - base) en vez de (base * ivaRate).
  // Por qué: al redondear base puede perderse un céntimo; restando garantizamos
  // que base + iva === total EXACTAMENTE, sin descuadres.
  const iva = redondear2(total - base);

  return { base, iva, total };
}

// Modo 'manualBase': el usuario teclea la BASE (sin IVA); sumamos el IVA encima.
function calcularManualBase(manualBase, ivaRate) {
  // Protección: si la base manual no es válida, devolvemos ceros.
  if (!esNumeroValido(manualBase)) {
    return { base: 0, iva: 0, total: 0 };
  }

  const base = redondear2(manualBase);
  const iva = redondear2(base * ivaRate);
  // total = base + iva con ambos YA redondeados, para que base + iva === total.
  const total = redondear2(base + iva);

  return { base, iva, total };
}
