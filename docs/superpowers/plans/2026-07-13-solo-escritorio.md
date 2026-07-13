# App Solo Escritorio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** En pantallas < 768px la app muestra solo un aviso "usa un ordenador"; se elimina el código responsive móvil que queda muerto.

**Architecture:** Puerta 100% CSS con el breakpoint `md` (768px) de Tailwind: un componente de aviso visible solo bajo `md`, y el contenedor de la app oculto bajo `md`. Sin JavaScript de detección. El bloque `@media print` de `documento.css` NO se toca (el PDF aprobado depende de él).

**Tech Stack:** React 18 + Vite + Tailwind (solo UI del formulario; el documento usa `documento.css` en mm).

**Spec:** `docs/superpowers/specs/2026-07-13-solo-escritorio-design.md`

## Global Constraints

- NO tocar el bloque `@media print` de `frontend/src/styles/documento.css` (líneas ~598 en adelante) ni `@page`. Incluye los arreglos Safari iOS: se quedan.
- NO tocar la hoja A4 (`.hoja-a4`, `.doc-table`) ni nada del documento en pantalla ≥ 768px.
- Texto del aviso, copiado literal: «Esta herramienta está pensada para ordenador. Ábrela desde un ordenador para generar presupuestos y facturas.»
- Breakpoint: `md` (768px), el mismo que ya usa la app. No inventar otros.
- Comandos se ejecutan desde `frontend/` (`npm run build`, `npm run test`). No hay tests de componentes ni infraestructura para ellos (solo tests de `lib/` con vitest); la verificación de UI es build + inspección visual.
- Mensajes de commit en español, estilo del repo (`feat:`, `fix:`, `refactor:`), con `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Componente de aviso + puerta en App.jsx

**Files:**
- Create: `frontend/src/components/ui/AvisoSoloEscritorio.jsx`
- Modify: `frontend/src/App.jsx:27-46`

**Interfaces:**
- Consumes: tokens Tailwind ya definidos en `frontend/tailwind.config.js` (`kng-ink`, `kng-cream`).
- Produces: componente `AvisoSoloEscritorio` (sin props, export default). Ningún task posterior lo consume; es hoja final.

- [ ] **Step 1: Crear el componente de aviso**

Contenido completo de `frontend/src/components/ui/AvisoSoloEscritorio.jsx`:

```jsx
// Aviso que se muestra SOLO en pantallas estrechas (< 768px, breakpoint md).
// La app es solo de escritorio: generar el PDF desde móvil no es fiable,
// así que en vez de una versión recortada mostramos este aviso a pantalla
// completa. Es la pareja del "hidden md:flex" del contenedor en App.jsx:
// bajo 768px se ve esto y nada más; desde 768px se ve la app y esto no.
function AvisoSoloEscritorio() {
  return (
    <div className="no-print md:hidden flex min-h-screen flex-col items-center justify-center bg-kng-cream px-8 text-center">
      <h1 className="text-xl font-semibold text-kng-ink">
        Presupuestos y Facturas · KNG &amp; VERA
      </h1>
      <p className="mt-3 max-w-sm text-sm text-gray-600">
        Esta herramienta está pensada para ordenador. Ábrela desde un
        ordenador para generar presupuestos y facturas.
      </p>
    </div>
  )
}

export default AvisoSoloEscritorio
```

- [ ] **Step 2: Conectarlo en App.jsx y ocultar la app en móvil**

En `frontend/src/App.jsx`, añadir el import (junto a los demás imports de componentes):

```jsx
import AvisoSoloEscritorio from './components/ui/AvisoSoloEscritorio'
```

Y reemplazar el `return` completo (líneas 27-46 actuales) por:

```jsx
  return (
    <>
      <AvisoSoloEscritorio />
      <div className="app-layout hidden h-screen md:flex flex-col">
        <TabsPrincipales tabActivo={tabActivo} setTabActivo={setTabActivo} />

        {tabActivo === 'presupuesto' ? (
          <div className="flex flex-1 flex-row overflow-hidden">
            <FormularioPresupuesto quote={quote} setQuote={setQuote} />
            <div className="zona-documento flex-1 h-full overflow-y-auto py-8 flex justify-center">
              <DocumentoPresupuesto quote={quote} />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-row overflow-hidden">
            <FormularioFactura factura={factura} setFactura={setFactura} />
            <div className="zona-documento flex-1 h-full overflow-y-auto py-8 flex justify-center">
              <DocumentoFactura factura={factura} />
            </div>
          </div>
        )}
      </div>
    </>
  )
```

Por qué no se rompe la impresión: `hidden` pone `display:none`, pero en
`documento.css` (@media print) ya existe `.app-layout { display: block !important; }`,
que gana por el `!important`. El aviso lleva `no-print`, que en print es
`display:none !important`. Resultado al imprimir: idéntico a hoy.

- [ ] **Step 3: Build para verificar que compila**

Run: `cd frontend && npm run build`
Expected: `✓ built in ...` sin errores.

- [ ] **Step 4: Verificación visual**

Run: `cd frontend && npm run dev -- --host --port 5174` (en background)
Abrir `http://localhost:5174`:
- Ventana ancha (≥ 768px): la app se ve exactamente igual que antes (tabs, formulario a la izquierda, documento a la derecha, scroll interno).
- Estrechar la ventana por debajo de 768px: desaparece la app y se ve SOLO el aviso centrado sobre fondo crema.
- Con ventana ancha, Cmd+P: la vista previa de impresión muestra el documento igual que antes (sin el aviso).

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ui/AvisoSoloEscritorio.jsx frontend/src/App.jsx
git commit -m "feat: app solo escritorio — aviso a pantalla completa en móvil (<768px)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Limpiar clases responsive muertas en los formularios

**Files:**
- Modify: `frontend/src/components/Formulario/FormularioPresupuesto.jsx:11`
- Modify: `frontend/src/components/Formulario/FormularioFactura.jsx:38`

**Interfaces:**
- Consumes: nada de Task 1 (solo depende de que la app ya esté oculta bajo `md`, hecho en Task 1).
- Produces: nada consumido por otros tasks.

Contexto: con la app oculta bajo 768px (Task 1), las variantes móviles
(`w-full`, `h-auto`, `overflow-visible`) de estos contenedores nunca se
renderizan; se simplifican a su valor de escritorio.

- [ ] **Step 1: Simplificar el contenedor del formulario de presupuesto**

En `frontend/src/components/Formulario/FormularioPresupuesto.jsx` (línea 11), reemplazar:

```jsx
    <div className="no-print w-full md:w-[480px] md:shrink-0 h-auto md:h-full overflow-visible md:overflow-y-auto bg-white border-r border-gray-200 p-5">
```

por:

```jsx
    <div className="no-print w-[480px] shrink-0 h-full overflow-y-auto bg-white border-r border-gray-200 p-5">
```

- [ ] **Step 2: Simplificar el contenedor del formulario de factura**

En `frontend/src/components/Formulario/FormularioFactura.jsx` (línea 38), aplicar exactamente el mismo reemplazo que en Step 1 (la className actual es idéntica):

```jsx
    <div className="no-print w-[480px] shrink-0 h-full overflow-y-auto bg-white border-r border-gray-200 p-5">
```

- [ ] **Step 3: Build**

Run: `cd frontend && npm run build`
Expected: `✓ built in ...` sin errores.

- [ ] **Step 4: Verificación visual rápida**

Con el dev server de Task 1 (o `npm run dev -- --host --port 5174`):
- Pestañas Presupuesto y Factura: el panel del formulario sigue midiendo 480px, con su scroll propio, sin cambios visibles.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/Formulario/FormularioPresupuesto.jsx frontend/src/components/Formulario/FormularioFactura.jsx
git commit -m "refactor: quitar variantes móviles muertas de los formularios

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Quitar el escalado móvil de la vista previa + verificación final

**Files:**
- Modify: `frontend/src/styles/documento.css:526-542`

**Interfaces:**
- Consumes: nada.
- Produces: nada.

- [ ] **Step 1: Eliminar el bloque de zoom móvil**

En `frontend/src/styles/documento.css`, borrar ÍNTEGRAMENTE este bloque (comentario incluido, líneas ~526-542). No tocar nada más del archivo:

```css
/* ===========================================================
   VISTA PREVIA RESPONSIVE (pantallas más estrechas que una A4)
   ---
   El documento siempre mide 210mm de ancho (fiel al PDF). En móvil eso no
   cabe en el viewport, así que se ESCALA visualmente con zoom (a diferencia
   de transform:scale, "zoom" SÍ reduce el espacio real que el elemento
   ocupa en el layout, así que no deja huecos en blanco debajo). Esto solo
   afecta a @media screen — el PDF real depende únicamente de @media print
   y no se ve afectado.
   Safari e iOS Safari soportan zoom de forma nativa desde siempre (viene de
   ahí); Chrome y Firefox modernos también. */
@media screen and (max-width: 860px) {
  .zona-documento { display: block; }
  .documento {
    zoom: calc((100vw - 12mm) / 210mm);
  }
}
```

- [ ] **Step 2: Build + tests de lib**

Run: `cd frontend && npm run build && npm run test`
Expected: build `✓` y los 3 archivos de test de `src/lib/` (calculos, numeracionFactura, paginar) en verde. Estos tests no tocan UI; se corren para confirmar que nada se rompió de rebote.

- [ ] **Step 3: Verificación final completa**

Con el dev server:
1. ≥ 768px: presupuesto y factura idénticos a antes (hoja A4 con sombra, formulario 480px).
2. < 768px: solo el aviso.
3. Cmd+P en escritorio (presupuesto y factura): vista previa idéntica a antes — cabecera, filete dorado, total al fondo, pie fijo. El PDF aprobado (commit fb8ec51/1e97dc3) no debe cambiar.
4. `grep -n "max-width: 860px" frontend/src/styles/documento.css` no devuelve nada; `grep -n "md:" frontend/src/App.jsx frontend/src/components/Formulario/*.jsx` solo debe encontrar el `md:flex` de la puerta en App.jsx (el `md:hidden` vive en AvisoSoloEscritorio.jsx y también es de la puerta); los formularios, cero.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/styles/documento.css
git commit -m "refactor: quitar escalado móvil de la vista previa (app solo escritorio)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
