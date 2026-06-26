# Paginación fiable del PDF — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el PDF de presupuestos se pagine de forma fiable — el pie nunca tapa contenido y los totales nunca quedan sueltos — manteniendo `window.print()` nativo.

**Architecture:** El pie de la página 1 pasa de `position: fixed` a un `<tfoot>` real de la tabla maestra (`table-footer-group`), que el navegador repite en cada hoja reservando su altura. La página 2 (condiciones) recibe su propio pie en el flujo. Se elimina el pie global fijo. Diseño visual idéntico.

**Tech Stack:** React + Vite, CSS de impresión nativo (`@media print`, `@page`). Sin librerías nuevas.

## Global Constraints

- Sin dependencias nuevas: el motor sigue siendo `window.print()`.
- Diseño visual idéntico: colores, fuentes, cabecera de marca, marca de agua, filete lateral de acento — no cambian.
- Medidas en milímetros (A4 fiel), siguiendo el patrón del CSS existente.
- No tocar `lib/calculos.js` ni los datos.
- **Verificación es visual, no por tests automatizados.** No existe test unitario práctico para paginación de PDF; cada tarea se verifica imprimiendo en el navegador (Cmd+P → "Guardar como PDF", desactivar encabezados/pies del navegador) y mirando el resultado. El servidor dev corre en el **puerto 5174** (5173 está ocupado por otra app).
- Las pruebas deben cubrir: ambas marcas (KNG dorado / VERA azul) y ambos idiomas (ES/EN), con pocas y con muchas líneas.

---

## Cómo arrancar el entorno (una vez, antes de empezar)

- [ ] **Paso 0: Levantar el servidor dev**

```bash
cd frontend && npm run dev -- --port 5174
```

Abrir `http://localhost:5174`. Cargar un presupuesto y añadir ~25 líneas (como en los PDFs de ejemplo) para reproducir el problema antes de tocar nada. Imprimir (Cmd+P) y confirmar que se ve: (a) el pie tapando una fila, (b) los totales sueltos en hoja nueva. Esto es el "estado roto" de referencia.

---

### Task 1: Pie de la página 1 vía `<tfoot>` (deja de tapar contenido)

**Files:**
- Modify: `frontend/src/components/Documento/DocumentoPresupuesto.jsx` (tabla maestra `.doc-table`, líneas ~34-94; footer global líneas 26-31)
- Modify: `frontend/src/styles/documento.css` (`@media print`, reglas `.foot-fijo`, líneas ~541-547; reglas `.doc-table > tfoot`, líneas ~428-431)

**Interfaces:**
- Consumes: `empresa.footerNombre`, `empresa.web` (ya disponibles vía `datosEmpresa[brand][lang]`).
- Produces: un `<tfoot>` en `.doc-table` que el navegador repite por hoja. La página 2 dejará de depender del pie global (Task 2).

- [ ] **Paso 1: Añadir `<tfoot>` a la tabla maestra**

En `DocumentoPresupuesto.jsx`, dentro de `<table className="doc-table">`, después de cerrar `</tbody>` (línea ~93) y antes de `</table>`, añadir:

```jsx
        {/* Pie de la página 1: <tfoot> con table-footer-group repite el pie
            abajo de CADA hoja y RESERVA su altura, así nunca tapa contenido. */}
        <tfoot>
          <tr>
            <td>
              <footer className="foot">
                <span>{empresa.footerNombre}</span>
                <span className="web">{empresa.web}</span>
              </footer>
            </td>
          </tr>
        </tfoot>
```

- [ ] **Paso 2: Eliminar el `<footer foot-fijo>` global**

En `DocumentoPresupuesto.jsx`, borrar el bloque de las líneas 26-31 (el comentario "Pie de página FIJO…" y su `<footer className="foot foot-fijo">…</footer>`). Ese pie global fijo desaparece; la página 1 ya lo tiene en `<tfoot>` y la página 2 tendrá el suyo (Task 2).

- [ ] **Paso 3: Ajustar el CSS de impresión del pie**

En `documento.css`, dentro de `@media print`:

1. Eliminar todo el bloque `.documento .foot-fijo { position: fixed; … }` (líneas ~541-547, incluido su comentario "--- PIE DE PÁGINA FIJO… ---").

2. Dar al `<td>` del tfoot el mismo padding lateral que thead/tbody. Localizar la regla existente (líneas ~511-514):

```css
  .documento .doc-table > thead > tr > td,
  .documento .doc-table > tbody > tr > td {
    padding: 0 18mm;
  }
```

y añadir el tfoot:

```css
  .documento .doc-table > thead > tr > td,
  .documento .doc-table > tbody > tr > td,
  .documento .doc-table > tfoot > tr > td {
    padding: 0 18mm;
  }
```

3. Confirmar que sigue existiendo (no tocar) la regla `.documento .doc-table > tfoot { display: table-footer-group; }` (línea ~428). Esa es la que hace que el navegador repita el pie y reserve su espacio.

- [ ] **Paso 4: Quitar el `foot-fijo` también del `@media screen`**

En `documento.css`, dentro del bloque `@media screen` (líneas ~473-480), eliminar la regla `.documento .foot-fijo { position: absolute; … }` y el `.documento { position: relative; }` si ya no lo usa nada más. (El filete y marca de agua usan sus propias reglas; verificar con búsqueda `position: relative` antes de borrar esa línea — si la marca de agua en pantalla la necesita, conservarla.)

- [ ] **Paso 5: Verificación visual (servidor en :5174)**

Con ~25 líneas cargadas, imprimir (Cmd+P → Guardar como PDF, desactivar encabezados/pies del navegador). Comprobar:
- El pie "Kami No Glass Group SL · Ibiza · web" aparece abajo de CADA hoja de presupuesto.
- **Ninguna fila de líneas queda tapada por el pie.**
- La cabecera de marca sigue repitiéndose arriba de cada hoja.
- Repetir con marca VERA y con idioma EN.

- [ ] **Paso 6: Commit**

```bash
git add frontend/src/components/Documento/DocumentoPresupuesto.jsx frontend/src/styles/documento.css
git commit -m "fix: pie de pagina 1 via tfoot para que no tape contenido

El pie era position:fixed y no reservaba espacio, tapaba la ultima
fila cuando caia al borde de la hoja. Ahora va en <tfoot> con
table-footer-group: el navegador lo repite y reserva su altura.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Pie propio para la página 2 (condiciones)

**Files:**
- Modify: `frontend/src/components/Documento/PaginaCondiciones.jsx` (líneas ~7-46; necesita acceso a datos de empresa)

**Interfaces:**
- Consumes: `datosEmpresa[brand][lang]` → `footerNombre`, `web` (mismo origen que usa `DocumentoPresupuesto`).
- Produces: un `<footer className="foot">` al final de `.pagina-condiciones`, cerrando el flujo de la página 2 sin depender de ningún pie fijo global (que ya se eliminó en Task 1).

- [ ] **Paso 1: Importar los datos de empresa**

En `PaginaCondiciones.jsx`, añadir el import al principio (junto a los imports existentes):

```jsx
import { datosEmpresa } from '../../data/datosEmpresa'
```

y dentro del componente, tras `const listaClausulas = clausulas[lang]` (línea ~10):

```jsx
  const empresa = datosEmpresa[brand][lang]
```

- [ ] **Paso 2: Añadir el pie al final del flujo de la página 2**

En `PaginaCondiciones.jsx`, justo después del `<p className="nota-aceptacion">…</p>` (líneas ~40-44) y antes de cerrar `</div>` de `.pagina-condiciones`, añadir:

```jsx
      {/* Pie propio de la página 2 (ya no depende del pie global fijo). */}
      <footer className="foot">
        <span>{empresa.footerNombre}</span>
        <span className="web">{empresa.web}</span>
      </footer>
```

- [ ] **Paso 3: Verificación visual (servidor en :5174)**

Imprimir y comprobar:
- La página 2 (Términos y Condiciones) muestra su pie abajo, igual que la página 1.
- No hay pie duplicado ni superpuesto.
- Probar marca VERA e idioma EN.

- [ ] **Paso 4: Commit**

```bash
git add frontend/src/components/Documento/PaginaCondiciones.jsx
git commit -m "fix: pie propio para la pagina 2 de condiciones

Antes dependia del pie global fijo (eliminado en el cambio anterior).
Ahora cada pagina cierra su flujo con su propio pie.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Totales atados al flujo (no quedan sueltos)

**Files:**
- Modify: `frontend/src/styles/documento.css` (`@media print`, regla `.totals` línea ~552)

**Interfaces:**
- Consumes: el `<tfoot>` que ya reserva espacio (Task 1) — es lo que elimina el falso "hay sitio" que provocaba el salto.
- Produces: garantía de que la caja Base/IVA/TOTAL fluye tras la última línea o baja completa a la hoja siguiente, nunca sola arriba.

- [ ] **Paso 1: Confirmar la regla de no partir totales**

En `documento.css`, dentro de `@media print`, verificar que existe (línea ~552):

```css
  .documento .totals { break-inside: avoid; }
```

Si no estuviera, añadirla. (Según el código actual ya existe; este paso es de confirmación.)

- [ ] **Paso 2: Verificación visual del caso límite (servidor en :5174)**

Este es el test clave del bug. Con el servidor levantado:
1. Cargar un presupuesto y añadir líneas **una a una** hasta acercarse al salto de hoja.
2. En cada incremento alrededor del salto, imprimir y comprobar que la caja de totales (Base imponible / IVA / TOTAL):
   - aparece pegada justo tras la última línea, **o**
   - baja **completa** a la hoja siguiente (las tres filas juntas),
   - y **nunca** queda flotando sola arriba de una hoja separada del contenido.
3. Confirmar que el pie sigue abajo de cada hoja sin tapar los totales.
4. Probar con muchas líneas (~30) que generen 2-3 hojas de presupuesto.

- [ ] **Paso 3: Commit (sólo si hubo cambios en el Paso 1)**

```bash
git add frontend/src/styles/documento.css
git commit -m "fix: asegurar que la caja de totales no se parta entre hojas

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

Si el Paso 1 confirmó que la regla ya existía sin cambios, omitir el commit.

---

### Task 4: Verificación integral final

**Files:** ninguno (sólo verificación).

- [ ] **Paso 1: Matriz de pruebas completa (servidor en :5174)**

Imprimir y revisar el PDF en cada combinación:

| Caso | Marca | Idioma | Qué confirmar |
|------|-------|--------|---------------|
| Pocas líneas (≤10) | KNG | ES | 1 hoja presup. + 1 condiciones; pie abajo; totales pegados; nada tapado |
| Muchas líneas (~25-30) | KNG | ES | Varias hojas; pie abajo de CADA hoja sin tapar; totales nunca solos |
| Muchas líneas | VERA | EN | Igual que arriba, colores azul VERA, textos EN |
| Caso límite del salto | KNG | ES | Añadir líneas 1 a 1 cerca del salto: pie nunca tapa, totales nunca solos |

- [ ] **Paso 2: Confirmar que el diseño visual no cambió**

Comparar contra un PDF previo: cabecera de marca, marca de agua tenue, filete dorado/azul a la izquierda, fuentes y colores — todo idéntico. Sólo cambia el comportamiento de paginación.

- [ ] **Paso 3: Cierre**

Si todo pasa, la rama `fix/paginacion-pdf` está lista para integrar (merge a main o PR, según prefiera el usuario).

---

## Self-Review (cobertura del spec)

- **Spec §2.1 (pie fixed tapa contenido)** → Task 1. ✓
- **Spec §2.2 (totales sueltos)** → Task 3 (apoyado en Task 1). ✓
- **Spec §2.3 + Cambio 3 (página 2 sin pie propio)** → Task 2. ✓
- **Spec §4 Cambio 1 (tfoot)** → Task 1. ✓
- **Spec §4 Cambio 2 (totales al flujo)** → Task 3. ✓
- **Spec §4 Cambio 3 (pie página 2 firme)** → Task 2. ✓
- **Spec §5 (qué no cambia)** → Global Constraints + Task 4 Paso 2. ✓
- **Spec §6 (verificación)** → Task 4 matriz. ✓
- **Spec §7 (archivos)** → DocumentoPresupuesto (T1), PaginaCondiciones (T2), documento.css (T1, T3). ✓

Sin placeholders. Nombres de clases (`.foot`, `.foot-fijo`, `.doc-table`, `.totals`, `table-footer-group`) consistentes con el CSS real verificado.
