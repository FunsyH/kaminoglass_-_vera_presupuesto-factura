// formato.js
// Funciones para mostrar números de forma bonita (sin lógica de negocio).

// Formatea un número como euros en formato español: 1234.5 -> "1.234,50 €"
//
// Por qué formateamos a mano y no con Intl.NumberFormat:
// Intl depende de los datos de idioma (ICU) del navegador. En algunos entornos
// (p.ej. Chrome "headless" al generar el PDF) esos datos están recortados y el
// punto de los miles desaparece ("1425,00 €" en vez de "1.425,00 €"). Formatear
// a mano garantiza el MISMO resultado en todos los navegadores.
export function formatEuro(n) {
  // Protección: si no es un número de verdad (null, undefined, texto, NaN),
  // devolvemos cadena vacía en vez de mostrar "NaN €".
  if (typeof n !== 'number' || Number.isNaN(n)) {
    return '';
  }

  // Trabajamos con el valor absoluto y guardamos el signo aparte.
  const negativo = n < 0;
  const valor = Math.abs(n);

  // Separamos parte entera y decimales (siempre 2 decimales).
  const partes = valor.toFixed(2).split('.');
  const entera = partes[0];
  const decimales = partes[1];

  // Añadimos el punto de los miles a la parte entera (de 3 en 3 desde la derecha).
  const enteraConMiles = entera.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const signo = negativo ? '-' : '';
  return `${signo}${enteraConMiles},${decimales} €`;
}
