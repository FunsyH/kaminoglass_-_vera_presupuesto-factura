// textosFijos.js
// ----------------------------------------------------------------------------
// Textos FIJOS del presupuesto/factura: condiciones de contratación, títulos
// de la página de términos, las 10 cláusulas de Términos y Condiciones y las
// etiquetas de interfaz que se repiten (Concepto/Item, Cant./Qty, etc.).
//
// Se llaman "fijos" porque NO se escriben en el formulario: vienen por defecto
// según la marca (kng/vera) y el idioma (es/en). El usuario no los edita; la
// app simplemente los lee de aquí. Así no repetimos los mismos textos largos
// en cada componente y mantenemos un único sitio donde corregirlos.
//
// Todo el contenido está copiado LITERALMENTE de la plantilla
// templates/presupuesto.html (bloque .terms, cabecera .terms-head y .clauses).
// ----------------------------------------------------------------------------

// --- Condiciones de contratación (resumen corto, va ANTES de los términos largos) ---
// Origen: bloque .terms de la página 2.
export const condicionesContratacion = {
  es: 'Para formalizar la reserva del evento se abonará un depósito del 50% del total presupuestado. El saldo restante deberá liquidarse íntegramente antes de la fecha del evento. El pago del depósito garantiza la disponibilidad y confirmación de los servicios acordados.',
  en: 'To formalize the event booking, a deposit of 50% of the total quoted amount is required. The remaining balance must be paid in full before the event date. The deposit payment guarantees the availability and confirmation of the agreed services.',
}

// --- Título grande + subtítulo de ámbito, distinto por marca ---
// Origen: cabecera .terms-head (título .tt-title + subtítulo .tt-brand).
// El título es igual para ambas marcas; el subtítulo cambia el ámbito.
export const titulosTerminos = {
  kng: {
    es: { h2: 'Términos y Condiciones', sub: 'Servicios de Bar y Catering' },
    en: { h2: 'Terms & Conditions', sub: 'Bar & Catering Services' },
  },
  vera: {
    es: { h2: 'Términos y Condiciones', sub: 'Alquiler de Material para Eventos' },
    en: { h2: 'Terms & Conditions', sub: 'Event Material Rental' },
  },
}

// --- Las 10 cláusulas de Términos y Condiciones (iguales para ambas marcas) ---
// Origen: bloques .clause de la página 2. Cada cláusula tiene número, título y texto.
export const clausulas = {
  es: [
    {
      n: 1,
      titulo: 'Confirmación de Reserva y Depósito',
      texto: 'Para asegurar la fecha de tu evento, se requiere un depósito no reembolsable del 50% del importe total presupuestado al momento de la reserva. El 50% restante deberá abonarse por adelantado dentro del plazo acordado, para garantizar una correcta planificación y ejecución. El pago total deberá completarse antes de la entrega del material. El pago implica la aceptación de estos Términos y Condiciones. En caso de cancelación por parte del cliente, el depósito no será reembolsado. Entendemos que pueden surgir imprevistos y estamos disponibles para gestionar cambios de fecha o solicitudes especiales con la mayor flexibilidad posible.',
    },
    {
      n: 2,
      titulo: 'Duración del Alquiler y Entrega',
      texto: 'El servicio incluye una entrega y una recogida en la fecha, hora y lugar previamente acordados. Cualquier modificación en el horario deberá comunicarse con al menos 72 horas de antelación. Retrasos o entregas adicionales causados por la ausencia del cliente podrán generar costes adicionales.',
    },
    {
      n: 3,
      titulo: 'Responsabilidad del Cliente y Daños',
      texto: 'El cliente es plenamente responsable de todos los materiales desde la entrega hasta su recogida. Cualquier pérdida, daño o alteración implicará costes de reparación o sustitución, que se descontarán del depósito o se facturarán por separado. En caso de pérdida o daño irreparable, se cobrará el valor total de compra original del artículo.',
    },
    {
      n: 4,
      titulo: 'Empaque y Devolución',
      texto: 'Todo el material deberá devolverse limpio, en su estado original y correctamente empaquetado en los contenedores proporcionados. Los artículos deberán estar listos para su recogida en el horario pactado. El incumplimiento podrá conllevar costes adicionales de manipulación o reposición.',
    },
    {
      n: 5,
      titulo: 'Depósito de Garantía',
      texto: 'Se requiere un depósito reembolsable por daños para todos los alquileres, que cubre posibles roturas, pérdidas o gastos de limpieza. El importe restante (si lo hubiera) se reembolsará en un plazo de 7 días hábiles, tras la inspección y devolución de todos los artículos en buenas condiciones. El cliente será informado de cualquier deducción antes de aplicarla.',
    },
    {
      n: 6,
      titulo: 'Condiciones Climáticas y Medioambientales',
      texto: 'Los materiales deben protegerse en todo momento frente a condiciones climáticas adversas. Si se dejan artículos al aire libre durante la noche o se exponen a la humedad, el cliente asumirá la responsabilidad total por cualquier daño, incluyendo el reemplazo completo si fuese necesario.',
    },
    {
      n: 7,
      titulo: 'Acceso y Condiciones del Lugar',
      texto: 'El cliente deberá garantizar un acceso claro y seguro al lugar de entrega, proporcionando todos los datos necesarios con precisión. Si el lugar no es accesible o representa un riesgo, la entrega podrá reprogramarse y podrán aplicarse cargos adicionales.',
    },
    {
      n: 8,
      titulo: 'Cambios y Adiciones Fuera de Plazo',
      texto: 'Todos los pedidos se considerarán definitivos 5 días antes del evento. Las solicitudes de artículos adicionales o cambios posteriores estarán sujetas a disponibilidad y podrán implicar costes adicionales de logística o personal. Haremos todo lo posible por adaptarnos a cambios de último momento, aunque no se garantiza la disponibilidad.',
    },
    {
      n: 9,
      titulo: 'Limitaciones de Responsabilidad',
      texto: 'No nos hacemos responsables de lesiones, accidentes o daños causados por el mal uso de los materiales. Tampoco asumimos responsabilidad por interrupciones derivadas de proveedores externos, restricciones del lugar o causas de fuerza mayor, como condiciones climáticas, restricciones gubernamentales o retrasos logísticos.',
    },
    {
      n: 10,
      titulo: 'Uso de Imágenes y Datos',
      texto: 'Salvo indicación contraria por escrito, el cliente autoriza el uso de imágenes del evento o del montaje con fines promocionales o en redes sociales. Todos los datos personales se tratarán de forma segura y confidencial, y se usarán exclusivamente para la prestación del servicio y la facturación.',
    },
  ],
  en: [
    {
      n: 1,
      titulo: 'Booking Confirmation and Deposit',
      texto: 'To secure your event date, a 50% non-refundable deposit of the total quoted amount is required at the time of booking. The remaining 50% must be paid in advance within the agreed timeframe to ensure proper planning and execution. Full payment must be completed prior to delivery. Payment implies acceptance of these Terms and Conditions. In case of cancellation by the client, the deposit will not be refunded. We understand that unforeseen circumstances may arise, and we are available to manage date changes or special requests with as much flexibility as possible.',
    },
    {
      n: 2,
      titulo: 'Rental Duration and Delivery',
      texto: 'The service includes one delivery and one collection at the pre-agreed date, time and location. Any change to the schedule must be communicated at least 72 hours in advance. Delays or additional delivery attempts caused by client absence may incur extra charges.',
    },
    {
      n: 3,
      titulo: 'Client Responsibility and Material Damage',
      texto: 'The client is fully responsible for all materials from delivery until collection. Any loss, damage or alteration will result in repair or replacement costs, deducted from the deposit or invoiced separately. In the event of loss or irreparable damage, the full original purchase value of the item will be charged.',
    },
    {
      n: 4,
      titulo: 'Packaging and Return Conditions',
      texto: 'All items must be returned clean, in their original condition and properly packaged in the provided containers. Items must be ready for pickup at the scheduled time. Failure to comply may result in additional handling or replacement fees.',
    },
    {
      n: 5,
      titulo: 'Security Deposit Policy',
      texto: 'A refundable damage deposit is required for all rentals, covering potential breakage, loss or cleaning fees. Any remaining balance (if applicable) will be refunded within 7 business days after inspection and return of all items in good condition. The client will be informed of any deductions before they are made.',
    },
    {
      n: 6,
      titulo: 'Weather and Environmental Conditions',
      texto: 'Materials must be protected from weather exposure at all times. If items are left outdoors overnight or exposed to moisture, the client assumes full responsibility for any resulting damage, including full replacement if necessary.',
    },
    {
      n: 7,
      titulo: 'Access and Site Conditions',
      texto: 'The client must ensure clear and safe access to the delivery site and provide accurate location details. If the site is inaccessible or unsafe, delivery may be delayed or rescheduled and additional charges may apply.',
    },
    {
      n: 8,
      titulo: 'Late Changes and Additions',
      texto: 'All orders are considered final 5 days prior to the event. Requests for additional items or changes after this period are subject to availability and may incur extra logistics or labour fees. We will do our best to accommodate last-minute changes, but cannot guarantee availability.',
    },
    {
      n: 9,
      titulo: 'Liability Limitations',
      texto: 'We are not liable for injuries, accidents or damage caused by misuse of the materials. We also assume no responsibility for disruptions caused by third-party vendors, venue restrictions or force majeure, such as weather, government restrictions or transport delays.',
    },
    {
      n: 10,
      titulo: 'Marketing Consent and Photo Use',
      texto: 'Unless otherwise stated in writing, the client authorizes the use of event or setup images for promotional and social media purposes. All personal data will be handled securely and confidentially, and used solely for service provision and invoicing.',
    },
  ],
}

// --- Etiquetas de interfaz repetidas (para no duplicar traducciones en los componentes) ---
// Origen: textos data-i18n del documento (cabecera, tablas, totales, condiciones).
export const etiquetas = {
  es: {
    presupuesto: 'Presupuesto',
    concepto: 'Concepto',
    cant: 'Cant.',
    precioUnit: 'P. unit.',
    importe: 'Importe',
    baseImponible: 'Base imponible',
    iva: 'IVA 21%',
    total: 'TOTAL',
    num: 'Nº',
    fecha: 'Fecha',
    validez: 'Validez',
    dias: 'días',
    condiciones: 'Condiciones de contratación',
    personal: 'Personal',
    alquiler: 'Alquiler de material',
  },
  en: {
    presupuesto: 'Quotation',
    concepto: 'Item',
    cant: 'Qty',
    precioUnit: 'Unit price',
    importe: 'Amount',
    baseImponible: 'Subtotal',
    iva: 'VAT 21%',
    total: 'TOTAL',
    num: 'No.',
    fecha: 'Date',
    validez: 'Valid for',
    dias: 'days',
    condiciones: 'Booking conditions',
    personal: 'Staff',
    alquiler: 'Rentals',
  },
}
