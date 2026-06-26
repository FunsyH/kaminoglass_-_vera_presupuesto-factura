// datosEmpresa.js
// ----------------------------------------------------------------------------
// Datos legales FIJOS de cada empresa (KNG y VERA), en español e inglés.
// Son "fijos" porque NO se editan en el formulario: cambian solo según la
// marca y el idioma que el usuario elija. Aquí guardamos nombre, CIF/VAT,
// datos de contacto, el nombre del pie de página y la web/handle.
//
// Idea sencilla: es como la "tarjeta de visita" de cada empresa. La app
// la consulta por marca (kng/vera) e idioma (es/en) en lugar de escribirla
// a mano en cada componente.
//
// Todos estos textos están copiados LITERALMENTE de la plantilla
// templates/presupuesto.html (bloques .brand-block de la cabecera y del pie).
// ----------------------------------------------------------------------------

export const datosEmpresa = {
  // === KAMI NO GLASS (catering / bar) ===
  kng: {
    es: {
      nombre: 'Kami No Glass Group SL',
      cifLabel: 'CIF',
      cif: 'B70721816',
      contacto: [
        'info@kng-group.com',
        '+34 671 821 215 · Adrián',
        '+34 671 821 213 · Camilla',
        'www.kaminoglasscatering.com',
      ],
      footerNombre: 'Kami No Glass Group SL · Ibiza',
      web: 'www.kaminoglasscatering.com',
    },
    en: {
      nombre: 'Kami No Glass Group SL',
      cifLabel: 'VAT', // en inglés la etiqueta del CIF se muestra como VAT
      cif: 'B70721816',
      contacto: [
        'info@kng-group.com',
        '+34 671 821 215 · Adrián',
        '+34 671 821 213 · Camilla',
        'www.kaminoglasscatering.com',
      ],
      footerNombre: 'Kami No Glass Group SL · Ibiza',
      web: 'www.kaminoglasscatering.com',
    },
  },

  // === VERA (alquiler de material para eventos) ===
  vera: {
    es: {
      nombre: 'Venue Equipment & Rental Accessories SL',
      cifLabel: 'CIF',
      cif: 'B21655550',
      contacto: [
        'verainforental@gmail.com',
        '+34 671 821 215 · Adrián',
        '+34 671 821 213 · Camilla',
      ],
      footerNombre: 'VERA · Equipment and Rental Accessories SL',
      web: '@verarentalaccessories',
    },
    en: {
      nombre: 'Venue Equipment & Rental Accessories SL',
      cifLabel: 'VAT', // en inglés la etiqueta del CIF se muestra como VAT
      cif: 'B21655550',
      contacto: [
        'verainforental@gmail.com',
        '+34 671 821 215 · Adrián',
        '+34 671 821 213 · Camilla',
      ],
      footerNombre: 'VERA · Equipment and Rental Accessories SL',
      web: '@verarentalaccessories',
    },
  },
}
