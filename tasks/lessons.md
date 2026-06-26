# Lecciones — App de presupuestos KNG & VERA

## Paginación A4 al imprimir desde el navegador

**Problema:** el documento generaba una hoja "fantasma" (3 páginas en vez de 2),
con una hoja casi vacía que solo contenía el pie de la página 1.

**Causa raíz:** un elemento con `position: fixed; height: 100vh` (que usábamos para
repetir el filete de acento en cada hoja) **rompe el cálculo de paginación** de Chrome
al imprimir. El `100vh` en contexto de impresión se interpreta de forma que añade una
página extra.

**Solución:** NO usar `position: fixed` para decoraciones que deben repetirse por hoja.
En su lugar, pintar la franja de acento con un **gradiente de fondo** en cada `.page`
(`background-image: linear-gradient(...)`). Vive dentro del flujo, así que el navegador
lo repite por hoja sin romper la paginación.

**Regla:** evitar `position: fixed` en documentos pensados para imprimir a PDF.

## Holgura de altura en la página 1

**Problema:** aun con el gradiente, el contenido + pie de la página 1 rozaba los 297mm
y el pie saltaba a una hoja nueva.

**Solución:** en `@media print`, usar un padding vertical algo menor (12mm arriba /
10mm abajo) que en pantalla (18mm), dando holgura para que todo quepa en una hoja.
El navegador pagina el resto del contenido (términos) con `.page + .page { break-before: page }`.

**Regla:** para documentos de canvas fijo, dejar margen de seguridad vertical en print;
no ajustar al milímetro exacto de A4.

## Cabecera y pie repetidos en cada hoja al imprimir

**Problema:** con un presupuesto largo (varias hojas), las hojas nuevas empezaban
a media página, sin cabecera ni pie. Intentar `position:fixed` + márgenes negativos
de @page fue frágil y descuadraba (la cabecera caía abajo, solapaba el contenido).

**Solución correcta (nativa y robusta):** estructurar la página como UNA tabla
(`.doc-table`) con `<thead>` = cabecera de marca y `<tfoot>` = pie. Con
`thead { display: table-header-group }` y `tfoot { display: table-footer-group }`,
el navegador REPITE cabecera y pie en cada hoja automáticamente al imprimir, y el
`<tbody>` fluye. Es la técnica estándar para documentos imprimibles multipágina.

Detalle: acotar los selectores de las tablas internas de líneas a `.lineas` para
que NO afecten a la tabla maestra (que también tiene thead/tbody/tfoot). En pantalla,
darle a `.doc-table` `display:block` y aspecto de hoja con @media screen.

**Generar el PDF respetando @page:** en CDP usar `printToPDF` con
`preferCSSPageSize: true` (sin pasar márgenes manuales), para que respete el @page del CSS.

## Cálculo cantidad × precio unitario

El importe de línea = `qty × unitPrice` (antes `amount` ignoraba la cantidad).
3 columnas: Cant. · P. unit. · Importe. El total general suma los importes de línea.
`importeLinea(item)` en calculos.js; si no hay qty se asume 1.

## Verificación de PDFs

Para verificar de verdad (no "debería funcionar"): renderizar con Chrome headless
`--print-to-pdf` y contar páginas + convertir a PNG con pymupdf (fitz) para revisar
visualmente. Aislar problemas con un HTML estático mínimo cargando el mismo CSS.
