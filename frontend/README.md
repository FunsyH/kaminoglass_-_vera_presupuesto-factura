# App de Presupuestos · KNG & VERA (Fase 2)

App local para crear presupuestos rellenando un formulario y generar el PDF.
Sin login, sin base de datos, sin Google Drive (eso es la Fase 3). El PDF se
genera en el navegador y se descarga a tu ordenador.

## Cómo arrancarla

```bash
cd frontend
npm install      # solo la primera vez
npm run dev
```

Luego abre **http://localhost:5174** en Chrome.

> El puerto es el 5174 (el 5173 lo ocupa otra app tuya).

## Cómo se usa

1. **Izquierda (formulario):**
   - Elige **empresa** (KNG / VERA) e **idioma** (ES / EN) — el documento de la
     derecha cambia al instante.
   - Rellena los **datos del evento** (título, fecha, lugar, nº, etc.).
   - Añade **secciones** y **líneas** con los botones «+ Añadir línea» / «+ Añadir
     sección». El importe de cada línea es **opcional** (déjalo vacío para una
     línea solo descriptiva). Marca «Subtotal» en una sección si quieres que
     muestre su subtotal.
   - **Total:** elige «Automático» (suma de líneas + IVA 21%) o «Total a mano»
     (escribes el total final con IVA y se desglosa solo).
2. **Derecha (documento):** es el PDF en vivo. Se actualiza mientras escribes.
3. Pulsa **Generar PDF**. En el diálogo de impresión:
   - Destino: **Guardar como PDF**
   - Tamaño: **A4**
   - Márgenes: **Ninguno**
   - **Gráficos de fondo: ACTIVADO** (importante: si no, se pierde el color del
     TOTAL, el filete lateral y la marca de agua).

## Notas

- Las **condiciones de contratación** y los **10 Términos y Condiciones** vienen
  por defecto según la marca; no se editan en el formulario (Fase 2).
- Los presupuestos largos (20-30+ líneas) se reparten en varias hojas A4
  automáticamente, sin cortar filas ni separar el TOTAL.
- La **marca de agua** de fondo (logo tenue) necesita «Gráficos de fondo» activado.

## Estructura

```
frontend/src/
├── App.jsx                      layout 2 columnas (formulario | documento)
├── styles/documento.css         estilos del PDF (mm) + reglas de impresión
├── data/                        textos fijos y datos de empresa (por marca/idioma)
├── lib/                         cálculos (totales/IVA), formato €, estado inicial
└── components/
    ├── Formulario/              el formulario y sus controles
    ├── Documento/               el PDF en vivo (documento, tablas, totales, términos)
    └── ui/                      botón Generar PDF
```
