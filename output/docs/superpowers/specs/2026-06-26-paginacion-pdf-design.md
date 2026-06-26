# Diseño · Paginación fiable del PDF de presupuestos

**Fecha:** 2026-06-26
**Proyecto:** KNG & Vera · Presupuesto & Factura (frontend React + Vite)
**Estado:** Aprobado para implementar

---

## 1. Problema

El PDF se genera con la impresión nativa del navegador (`window.print()`). Al añadir
muchas líneas de producto aparecen dos defectos al guardar el PDF:

1. **El pie de página tapa contenido.** Cuando una fila de líneas cae al final de una
   hoja, el pie ("Kami No Glass Group SL · Ibiza" + web) se superpone y oculta esa fila.
2. **Los totales quedan sueltos.** Si las líneas llenan justo una hoja, la caja de
   totales (Base imponible / IVA / TOTAL) salta sola al principio de la hoja siguiente
   y queda flotando, separada del contenido.

Ambos síntomas tienen la misma raíz: la paginación nativa no está reservando espacio
de forma fiable para el pie, y los totales no están atados al flujo del contenido.

## 2. Causa raíz (análisis del código actual)

### 2.1 El pie es `position: fixed`
En `documento.css` (`@media print`), el pie `.foot-fijo` usa `position: fixed; bottom: 6mm`.
Un elemento fijo flota por encima del contenido y **no reserva su altura** en el flujo.
El `@page` reserva `margin ... 20mm` abajo, pero las filas del `<tbody>` no "saben" que el
pie flota ahí → cuando una fila cae al borde inferior, el pie la tapa.

Origen en código:
- `DocumentoPresupuesto.jsx` → `<footer className="foot foot-fijo">` (pie global, fixed).
- `documento.css` → `.documento .foot-fijo { position: fixed; bottom: 6mm; }` dentro de
  `@media print`.

### 2.2 Los totales son un `<div>` suelto
En `DocumentoPresupuesto.jsx`, los totales viven como un `<div className="totals">`
dentro del `<tbody>`, después del `.map` de secciones. Tienen `break-inside: avoid`
(no se parten), pero **nada impide que se separen de la última fila de líneas**. Con el
pie flotando (2.1), el bloque cabe "visualmente" donde no debería y, al recolocar, salta
solo a la hoja siguiente.

### 2.3 La página 2 (condiciones) NO tiene pie propio
`PaginaCondiciones.jsx` depende del pie global `foot-fijo` para mostrar su pie (ver
comentario en línea 39: "el pie real lo pone el PieFijo global"). Por tanto, el pie global
**no se puede eliminar sin más**: la página 2 lo necesita.

## 3. Decisiones de diseño (acordadas con el usuario)

- **Comportamiento:** flujo natural multi-hoja. Mantener `window.print()`, sin librerías.
- **Totales:** pegados a la última línea. Si no caben, bajan JUNTOS a la siguiente hoja;
  nunca se separan ni quedan flotando solos.

## 4. Solución

### Cambio 1 — El pie de la página 1 vuelve al flujo vía `<tfoot>`

La tabla maestra (`.doc-table`) ya tiene `<thead>` con `display: table-header-group`, que
el navegador repite arriba de cada hoja. Su contraparte natural es `<tfoot>` con
`display: table-footer-group`: el navegador **repite el pie abajo de cada hoja Y reserva
su altura** en el flujo. El contenido del `<tbody>` ya no puede meterse debajo.

Implementación:
- Añadir un `<tfoot>` real a la tabla maestra en `DocumentoPresupuesto.jsx`, con el mismo
  contenido del pie (nombre de empresa + web).
- En `documento.css`, mantener `.doc-table > tfoot { display: table-footer-group; }`
  (ya existe) y darle al pie su padding lateral (18mm) como ya tienen thead/tbody en print.
- El pie deja de necesitar `position: fixed` para la página 1.

### Cambio 2 — Atar los totales al flujo

- Mantener `break-inside: avoid` en `.totals` (ya existe), para que la caja Base/IVA/TOTAL
  no se parta entre dos hojas.
- Regla única y explícita: la caja de totales se trata como un bloque indivisible que
  fluye justo tras la última línea. Con el pie ya reservando espacio (Cambio 1), sólo hay
  dos resultados posibles: cabe tras la última línea en la hoja actual, o baja completa a
  la hoja siguiente. El caso "totales flotando arriba solos" desaparece porque ya no hay un
  pie fijo que falsee el espacio disponible. No se añade `break-before` ni envoltorios
  adicionales: bastan `break-inside: avoid` + el espacio real reservado por el `<tfoot>`.

### Cambio 3 — Resolver el pie de la página 2 sin romperla

Como `PaginaCondiciones` depende del pie global, al quitarle a la página 1 el `foot-fijo`
hay que garantizar que la página 2 siga teniendo pie.

**Decisión (firme):** se elimina el pie global `foot-fijo` y se le da a `PaginaCondiciones`
su propio pie dentro del flujo — un `<footer className="foot">` al final de
`.pagina-condiciones`, con el mismo contenido (nombre de empresa + web). Así cada página es
autónoma: la página 1 lleva su pie en el `<tfoot>` de la tabla maestra (Cambio 1) y la
página 2 lleva el suyo en su propio flujo. No quedan elementos `position: fixed` para el
pie, así que no hay dos pies compitiendo ni riesgo de superposición.

Como la página 2 (condiciones) cabe siempre en una sola hoja, su pie no necesita repetirse;
basta con que cierre el flujo de esa página.

## 5. Qué NO cambia

- `window.print()` sigue siendo el motor (sin dependencias nuevas).
- Diseño visual: colores, fuentes, cabecera de marca, marca de agua, filete lateral de
  acento — todo idéntico.
- Cálculos (`lib/calculos.js`) intactos.
- Página 1 (cabecera repetida vía `<thead>`) y su comportamiento en pantalla, intactos.

## 6. Verificación (cómo probaremos que funciona)

1. Caso pocas líneas (≤ ~10): PDF de 1 hoja de presupuesto + 1 de condiciones; pie abajo,
   totales pegados a la última línea, nada tapado.
2. Caso muchas líneas (~20–30, como en los PDFs de ejemplo): el contenido se reparte en
   varias hojas; el pie aparece abajo de CADA hoja **sin tapar** ninguna fila; los totales
   aparecen pegados a la última línea, nunca solos arriba de una hoja.
3. Caso límite: añadir líneas una a una alrededor del salto de hoja y comprobar que en
   ningún punto el pie tapa una fila ni los totales se separan.
4. Ambas marcas (KNG dorado / VERA azul) y ambos idiomas (ES/EN).

## 7. Archivos afectados

- `frontend/src/components/Documento/DocumentoPresupuesto.jsx` — añadir `<tfoot>` a la
  tabla maestra (pie de la página 1); eliminar el `<footer foot-fijo>` global.
- `frontend/src/components/Documento/PaginaCondiciones.jsx` — añadir su propio
  `<footer className="foot">` al final del flujo (pie de la página 2).
- `frontend/src/styles/documento.css` — en `@media print`: pie de página 1 vía `<tfoot>`
  (`table-footer-group`) en lugar de `position: fixed`; padding lateral 18mm del pie;
  retirar las reglas de `.foot-fijo` fixed; mantener `break-inside: avoid` en `.totals`.
