# Presupuestos KNG &amp; VERA — Plantilla (Fase 1)

Plantilla de presupuesto **profesional y premium** para las dos empresas del grupo:

- **KNG** · Kami No Glass Group SL — servicio de bar / catering en eventos (Ibiza).
- **VERA** · Venue Equipment &amp; Rental Accessories SL — alquiler de material.

Una sola plantilla sirve para las dos marcas (cambia color y logo) y en dos idiomas
(español / inglés). El objetivo es que el cliente reciba algo limpio, formal y bonito
—no como los presupuestos de Canva— y eso ayude a cerrar la contratación.

> **Por qué empezamos solo por la plantilla:** primero acordamos el diseño bonito y lo
> apruebas. Después, sobre esta misma base, construiremos la app web (donde 3 personas
> rellenan y guardan presupuestos). Así no invertimos en backend/login/hosting hasta
> tener el diseño validado.

---

## Cómo se ve

En `ejemplos/` tienes 4 PDF de muestra ya generados (mismo evento de prueba,
"Roca Lisa · 40 pax"):

| Archivo | Marca | Idioma |
|---|---|---|
| `EJEMPLO_KNG_ES.pdf`  | Kami No Glass | Español |
| `EJEMPLO_KNG_EN.pdf`  | Kami No Glass | Inglés  |
| `EJEMPLO_VERA_ES.pdf` | VERA          | Español |
| `EJEMPLO_VERA_EN.pdf` | VERA          | Inglés  |

---

## Cómo usarla (paso a paso)

1. Abre **`templates/presupuesto.html`** con doble clic (se abre en tu navegador:
   Chrome recomendado).
2. Arriba a la derecha hay un **panel de control** (solo se ve en pantalla, no sale en
   el PDF). Elige:
   - **Empresa**: KNG o VERA.
   - **Idioma**: ES o EN.
3. Cuando se vea como quieres: **Archivo → Imprimir** (o `Cmd + P`).
   - **Destino**: "Guardar como PDF".
   - **Tamaño de papel**: A4.
   - **Márgenes**: Ninguno.
   - **Gráficos de fondo / Background graphics**: ACTIVADO (importante, si no se pierde
     el color del TOTAL y el filete lateral).
4. Guarda. Ya tienes el PDF listo para enviar al cliente.

> El panel de control y el menú de imprimir **no** aparecen en el PDF: están marcados
> para ocultarse al imprimir.

---

## Cómo cambiar el contenido de cada presupuesto

Por ahora se edita a mano en `templates/presupuesto.html` (en la futura app esto será
un formulario). Lo que cambia en cada presupuesto:

- **Título del evento**: busca `class="event-title"` → "Roca Lisa · 40 pax".
- **Fecha, lugar, horas**: bloque `class="event-sub"`.
- **Número / fecha / validez**: bloque `class="doc-ref"` (ej. `KNG-2026-0042`).
- **Líneas de Personal y Alquiler**: dentro de las dos `<table>`. Cada fila es un
  concepto, con su cantidad e importe.
- **Totales**: bloque `class="totals"`. **Importante**: la base, el IVA y el total se
  escriben a mano por ahora; revisa que cuadren:
  - Base imponible = suma de todos los importes.
  - IVA 21% = base × 0,21.
  - TOTAL = base + IVA.

  En el ejemplo: Personal 665 € + Alquiler 760 € = **1.425,00 €** de base;
  IVA 21% = **299,25 €**; TOTAL = **1.724,25 €**.

> Los textos en español/inglés conviven en el archivo con etiquetas
> `data-i18n="es"` / `data-i18n="en"`. Si añades una línea nueva y la quieres bilingüe,
> copia ese patrón. Si te da igual, escríbela en un solo idioma.

---

## Condiciones y Términos y Condiciones

Cada presupuesto tiene ahora **dos páginas**:

1. **Página 1** — el presupuesto en sí (productos, totales) y, al pie, las
   **Condiciones de contratación**: depósito del 50% para confirmar + saldo antes
   del evento. (Bloque `class="terms"`.)
2. **Página 2** — los **Términos y Condiciones** completos (10 cláusulas), maquetados
   en dos columnas. Son el texto real que ya usabais, igual para ambas marcas; lo que
   cambia por marca es el subtítulo:
   - **KNG** → "Servicios de Bar y Catering".
   - **VERA** → "Alquiler de Material para Eventos".

   Estos textos vienen **por defecto** (no tienes que reescribirlos cada vez). Si en un
   presupuesto concreto necesitas ajustar una cláusula (otro depósito, otra fecha),
   editas ese párrafo en el bloque `class="clauses"` y listo. En la futura app esto
   será un texto por defecto que solo se toca cuando haga falta.

---

## Detalles de diseño (para referencia)

- **Tamaño**: A4 (210 × 297 mm), pensado para imprimir / PDF.
- **Tipografía** (Adobe Fonts, se cargan por internet): *Utopia Std Headline* para los
  títulos (serif elegante) y *Acumin Pro* para el cuerpo y las tablas (sans legible).
  Necesitas conexión a internet al abrir/imprimir para que se vean estas fuentes; si no,
  el navegador usa una alternativa.
- **Colores**:
  - KNG: tinta `#1a1714`, oro `#b8954a`, fondo crema `#faf6ec`.
  - VERA: azul marino `#1e3a5f`, fondo hueso `#f5f6f8`.

### Logo de VERA (provisional)

VERA todavía no tiene un archivo de logo. De momento usamos un **logotipo "VERA"
tipográfico minimal** (texto + "EQUIPMENT &amp; RENTALS"), pensado como propuesta de
dirección: limpio, sobrio, de empresa de materiales premium — sin la estética japonesa
de KNG. Cuando tengas el logo definitivo de VERA, se sustituye en un minuto.
La referencia del logo antiguo está en `templates/assets/logo-vera-ORIGINAL-referencia.png`.

---

## Estructura de archivos

```
kaminoglass_&_vera_presupuesto&factura/
├── README.md                     ← este archivo
├── templates/
│   ├── presupuesto.html          ← la plantilla (se abre y se imprime a PDF)
│   └── assets/
│       ├── logo-kng.png          ← logo Kami No Glass
│       └── logo-vera-ORIGINAL-referencia.png  ← logo viejo de Vera (referencia)
└── ejemplos/                     ← 4 PDF de muestra (KNG/VERA × ES/EN)
```

---

## Próximas fases (acordadas, aún no hechas)

1. **Formulario local**: rellenas un formulario y se genera el PDF (sin tocar HTML).
2. **App con login + base de datos**: las 3 personas crean, guardan y reeditan
   presupuestos; numeración automática por empresa; catálogo de items reutilizables.
3. **Google Drive + hosting (Replit)**: el PDF se guarda solo en la carpeta del evento
   en Drive, y la app vive online para que entren desde cualquier sitio.
4. **Facturas**: un presupuesto aceptado se convierte en factura (con numeración fiscal),
   o se crean facturas independientes.

### Pendientes que aportará Adrián
- Logo definitivo de VERA y su azul exacto.
- Confirmar dirección/datos de contacto de VERA si difieren.
