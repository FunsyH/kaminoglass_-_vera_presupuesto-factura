# Vista previa paginada A4 — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el documento se vea en pantalla EXACTAMENTE como el PDF: hojas A4 fijas, ítems repartidos por medición real, cabeceras repetidas y total único al fondo de la última hoja.

**Architecture:** Tres piezas con responsabilidad única — `paginar.js` (lógica pura de reparto, testeable), `useMedidasDocumento` (mide alturas reales en px), `HojaA4` (pinta una hoja). `DocumentoPresupuesto` orquesta: medir → paginar → pintar N hojas.

**Tech Stack:** React 19 + Vite 8. Vitest para tests unitarios (dependencia de desarrollo, no va al bundle). Sin librerías de runtime nuevas; sigue usando `window.print()`.

## Global Constraints

- **Sin librerías de runtime nuevas:** el motor del PDF sigue siendo `window.print()`. (Vitest es solo devDependency para tests, no entra al bundle.)
- **Diseño visual idéntico:** colores, fuentes, cabecera de marca, marca de agua, filete lateral de acento — no cambian.
- **Medidas en milímetros** (A4 fiel) siguiendo el patrón del CSS existente. A4 = 210×297 mm.
- **No tocar** `lib/calculos.js` ni `lib/formato.js` ni el contenido de `PaginaCondiciones`.
- **Un solo total**, suma de todos los artículos; nunca doble.
- **Comportamiento del total:** clavado al fondo de la última hoja (`margin-top:auto`), footer debajo.
- **Hoja 2+** repite: cabecera de marca + cabecera de tabla. Título de evento y fecha solo en hoja 1.
- **Servidor dev en puerto 5174** (5173 ocupado por otra app). Verificación visual la hace el usuario.
- El proyecto usa **oxlint**; el código debe pasar `npm run lint` sin warnings.

---

### Task 1: Instalar Vitest y dejar el primer test corriendo

**Files:**
- Modify: `frontend/package.json` (scripts + devDependencies)
- Create: `frontend/vitest.config.js`
- Create: `frontend/src/lib/paginar.test.js`
- Create: `frontend/src/lib/paginar.js`

**Interfaces:**
- Produces: el script `npm test` operativo y el módulo `paginar.js` con `paginarBloques` exportado (firma definida en Task 2; aquí solo el esqueleto que hace pasar un test trivial).

- [ ] **Step 1: Instalar Vitest**

```bash
cd frontend && npm install -D vitest
```

- [ ] **Step 2: Añadir el script de test a package.json**

En `frontend/package.json`, dentro de `"scripts"`, añadir:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 3: Crear la config de Vitest**

Crear `frontend/vitest.config.js`:

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
```

- [ ] **Step 4: Escribir un test trivial que falle**

Crear `frontend/src/lib/paginar.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { paginarBloques } from './paginar'

describe('paginarBloques', () => {
  it('existe y devuelve un array', () => {
    expect(Array.isArray(paginarBloques([], 100, 100))).toBe(true)
  })
})
```

- [ ] **Step 5: Ejecutar y verificar que falla (módulo no existe)**

Run: `cd frontend && npm test`
Expected: FAIL — `paginar.js` no existe o no exporta `paginarBloques`.

- [ ] **Step 6: Crear el esqueleto mínimo**

Crear `frontend/src/lib/paginar.js`:

```js
// paginar.js
// Reparte una lista de "bloques" (titulo de seccion, fila de item, subtotal)
// en hojas A4 segun el alto util disponible. Logica pura: recibe numeros,
// devuelve estructura. Sin React, sin DOM.

// Reparte los bloques en hojas. (Implementacion completa en Task 2.)
export function paginarBloques(bloques, altoUtilPrimera, altoUtilSiguientes) {
  return []
}
```

- [ ] **Step 7: Ejecutar y verificar que pasa**

Run: `cd frontend && npm test`
Expected: PASS (1 test).

- [ ] **Step 8: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/vitest.config.js frontend/src/lib/paginar.js frontend/src/lib/paginar.test.js
git commit -m "test: instalar Vitest y esqueleto de paginar.js"
```

---

### Task 2: Lógica de paginación (`paginarBloques`) — TDD completo

**Files:**
- Modify: `frontend/src/lib/paginar.js`
- Modify: `frontend/src/lib/paginar.test.js`

**Interfaces:**
- Consumes: nada externo.
- Produces:
  - `paginarBloques(bloques, altoUtilPrimera, altoUtilSiguientes): Hoja[]`
  - `bloque = { tipo: 'titulo'|'item'|'subtotal', alto: number, ref: any }`
  - `Hoja = { bloques: bloque[] }`
  - Regla: un `titulo` cuyo primer `item` siguiente no cabe en la misma hoja se mueve a la hoja siguiente junto con ese item (no títulos huérfanos).
  - Regla: un bloque cuyo `alto` excede el alto útil se coloca solo en su hoja (no bucle).

- [ ] **Step 1: Escribir los tests (todos a la vez, fallan)**

Reemplazar el contenido de `frontend/src/lib/paginar.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { paginarBloques } from './paginar'

const item = (alto, ref) => ({ tipo: 'item', alto, ref })
const titulo = (alto, ref) => ({ tipo: 'titulo', alto, ref })

describe('paginarBloques', () => {
  it('mete todo en una hoja cuando cabe', () => {
    const bloques = [item(10, 'a'), item(10, 'b'), item(10, 'c')]
    const hojas = paginarBloques(bloques, 100, 100)
    expect(hojas).toHaveLength(1)
    expect(hojas[0].bloques.map(b => b.ref)).toEqual(['a', 'b', 'c'])
  })

  it('abre una segunda hoja cuando se desborda', () => {
    const bloques = [item(40, 'a'), item(40, 'b'), item(40, 'c')]
    // alto util 100: caben a(40)+b(40)=80; c(40) desborda -> hoja 2
    const hojas = paginarBloques(bloques, 100, 100)
    expect(hojas).toHaveLength(2)
    expect(hojas[0].bloques.map(b => b.ref)).toEqual(['a', 'b'])
    expect(hojas[1].bloques.map(b => b.ref)).toEqual(['c'])
  })

  it('usa altoUtilSiguientes distinto en hojas 2+', () => {
    const bloques = [item(60, 'a'), item(60, 'b'), item(30, 'c')]
    // hoja 1 util 100: a(60) cabe; b(60) desborda -> hoja 2
    // hoja 2 util 50: b(60) excede pero va solo; c(30) -> hoja 3
    const hojas = paginarBloques(bloques, 100, 50)
    expect(hojas).toHaveLength(3)
    expect(hojas[0].bloques.map(b => b.ref)).toEqual(['a'])
    expect(hojas[1].bloques.map(b => b.ref)).toEqual(['b'])
    expect(hojas[2].bloques.map(b => b.ref)).toEqual(['c'])
  })

  it('no deja un titulo huerfano al pie: lo baja con su primer item', () => {
    const bloques = [item(70, 'a'), titulo(10, 'T'), item(40, 'b')]
    // hoja 1 util 100: a(70) cabe (70). titulo(10) cabria (80) pero su item
    // siguiente b(40) no cabe (120>100): el titulo NO se queda solo -> baja con b.
    const hojas = paginarBloques(bloques, 100, 100)
    expect(hojas).toHaveLength(2)
    expect(hojas[0].bloques.map(b => b.ref)).toEqual(['a'])
    expect(hojas[1].bloques.map(b => b.ref)).toEqual(['T', 'b'])
  })

  it('coloca un bloque gigante solo en su hoja sin bucle', () => {
    const bloques = [item(200, 'grande'), item(10, 'a')]
    const hojas = paginarBloques(bloques, 100, 100)
    expect(hojas).toHaveLength(2)
    expect(hojas[0].bloques.map(b => b.ref)).toEqual(['grande'])
    expect(hojas[1].bloques.map(b => b.ref)).toEqual(['a'])
  })

  it('devuelve una hoja vacia cuando no hay bloques', () => {
    const hojas = paginarBloques([], 100, 100)
    expect(hojas).toHaveLength(1)
    expect(hojas[0].bloques).toEqual([])
  })
})
```

- [ ] **Step 2: Ejecutar y verificar que fallan**

Run: `cd frontend && npm test`
Expected: FAIL — varios tests rojos (la función devuelve `[]`).

- [ ] **Step 3: Implementar la lógica completa**

Reemplazar el cuerpo de `paginarBloques` en `frontend/src/lib/paginar.js`:

```js
// paginar.js
// Reparte una lista de "bloques" (titulo de seccion, fila de item, subtotal)
// en hojas A4 segun el alto util disponible. Logica pura: recibe numeros,
// devuelve estructura. Sin React, sin DOM.
//
// bloque = { tipo: 'titulo'|'item'|'subtotal', alto: number, ref: any }
// Hoja   = { bloques: bloque[] }

// Mira hacia delante: ¿el bloque en la posicion i es un 'titulo' que se
// quedaria huerfano? (es titulo y su siguiente bloque NO cabe con el en la hoja)
function tituloQuedariaHuerfano(bloques, i, usado, altoUtil) {
  const actual = bloques[i]
  if (actual.tipo !== 'titulo') return false
  const siguiente = bloques[i + 1]
  if (!siguiente) return false
  // ¿caben titulo + siguiente juntos en lo que queda de hoja?
  return usado + actual.alto + siguiente.alto > altoUtil
}

export function paginarBloques(bloques, altoUtilPrimera, altoUtilSiguientes) {
  const hojas = []
  let actual = { bloques: [] }
  let usado = 0
  let esPrimera = true
  const altoDe = () => (esPrimera ? altoUtilPrimera : altoUtilSiguientes)

  // Cierra la hoja actual y empieza una nueva.
  const cerrarHoja = () => {
    hojas.push(actual)
    actual = { bloques: [] }
    usado = 0
    esPrimera = false
  }

  for (let i = 0; i < bloques.length; i++) {
    const b = bloques[i]
    const altoUtil = altoDe()

    // Caso titulo huerfano: si el titulo se quedaria solo al pie, cerramos
    // hoja para que titulo + su item bajen juntos a la siguiente.
    if (actual.bloques.length > 0 && tituloQuedariaHuerfano(bloques, i, usado, altoUtil)) {
      cerrarHoja()
    }

    // ¿Cabe el bloque en lo que queda de hoja?
    if (actual.bloques.length > 0 && usado + b.alto > altoDe()) {
      cerrarHoja()
    }

    // Tras posibles cierres, colocamos el bloque (aunque sea gigante: va solo).
    actual.bloques.push(b)
    usado += b.alto
  }

  // Siempre cerramos la ultima hoja (incluso si quedo vacia -> 1 hoja vacia).
  hojas.push(actual)
  return hojas
}
```

- [ ] **Step 4: Ejecutar y verificar que pasan todos**

Run: `cd frontend && npm test`
Expected: PASS (todos los tests de `paginarBloques`).

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/paginar.js frontend/src/lib/paginar.test.js
git commit -m "feat: logica de paginacion paginarBloques con TDD"
```

---

### Task 3: Hook de medición (`useMedidasDocumento`)

**Files:**
- Create: `frontend/src/hooks/useMedidasDocumento.js`

**Interfaces:**
- Consumes: `quote` (el objeto de presupuesto).
- Produces: `useMedidasDocumento(quote) → { medidas, listo }`
  - `medidas = { bloques: [{ tipo, alto, ref }], cabeceraMarca: number, cabeceraTabla: number, metaEvento: number, totalFooter: number }`
  - `listo: boolean`
  - `bloques` es la lista lineal en orden: por cada sección, un `titulo` (si tiene título) seguido de un `item` por cada línea, y un `subtotal` si `showSubtotal`.
  - `ref` de cada item = `{ tipoRef: 'item', item, sectionId }`; de titulo = `{ tipoRef: 'titulo', section }`; de subtotal = `{ tipoRef: 'subtotal', section }`.

- [ ] **Step 1: Implementar el hook de medición**

Crear `frontend/src/hooks/useMedidasDocumento.js`:

```js
import { useState, useLayoutEffect, useRef } from 'react'

// Mide en px el alto real de cada bloque del documento, renderizandolos en un
// contenedor invisible fuera de pantalla. Asi paginar.js puede repartir con
// medidas reales (una nota larga ocupa mas, un titulo ocupa lo suyo, etc.).
//
// Devuelve { medidas, listo }. Mientras listo===false, el llamador pinta una
// hoja provisional para evitar parpadeo.
export function useMedidasDocumento(quote) {
  const [medidas, setMedidas] = useState(null)
  const ref = useRef(null)

  useLayoutEffect(() => {
    const cont = ref.current
    if (!cont) return

    // Cada bloque medible lleva data-medir="<indice>"; los fijos, data-fijo="<clave>".
    const altoDe = (sel) => {
      const el = cont.querySelector(sel)
      return el ? el.getBoundingClientRect().height : 0
    }

    const nodosBloque = cont.querySelectorAll('[data-medir]')
    const bloques = Array.from(nodosBloque).map((el) => ({
      tipo: el.getAttribute('data-tipo'),
      alto: el.getBoundingClientRect().height,
      indice: Number(el.getAttribute('data-medir')),
    }))

    setMedidas({
      bloques,
      cabeceraMarca: altoDe('[data-fijo="cabeceraMarca"]'),
      cabeceraTabla: altoDe('[data-fijo="cabeceraTabla"]'),
      metaEvento: altoDe('[data-fijo="metaEvento"]'),
      totalFooter: altoDe('[data-fijo="totalFooter"]'),
    })
  }, [quote])

  return { medidas, listo: medidas !== null, refMedicion: ref }
}
```

- [ ] **Step 2: Verificar que compila (build)**

Run: `cd frontend && npm run build`
Expected: build OK (el hook aún no se usa, pero no debe romper la compilación).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/hooks/useMedidasDocumento.js
git commit -m "feat: hook useMedidasDocumento para medir alturas reales"
```

---

### Task 4: Componente `HojaA4` (pinta una hoja)

**Files:**
- Create: `frontend/src/components/Documento/HojaA4.jsx`

**Interfaces:**
- Consumes: `formatEuro` de `../../lib/formato`, `importeLinea`/`subtotalSeccion` de `../../lib/calculos`.
- Produces: `<HojaA4 brand lang empresa t bloques esPrimera esUltima metaEvento totales />`
  - `brand`, `lang`: marca e idioma.
  - `empresa`: objeto de `datosEmpresa[brand][lang]`.
  - `t`: etiquetas de idioma.
  - `bloques`: array de `{ tipo, ref }` ya paginados para ESTA hoja (ref como definido en Task 3).
  - `esPrimera`, `esUltima`: booleanos.
  - `metaEvento`: el objeto `quote.event` (solo se pinta si `esPrimera`).
  - `totales`: `{ base, iva, total }` (solo se pinta si `esUltima`).

- [ ] **Step 1: Implementar HojaA4**

Crear `frontend/src/components/Documento/HojaA4.jsx`:

```jsx
import { formatEuro } from '../../lib/formato'
import { importeLinea, subtotalSeccion } from '../../lib/calculos'

// Pinta UNA hoja A4 de alto fijo. Cabecera de marca siempre; meta del evento
// solo en la primera; cabecera de tabla siempre (referencia de columnas);
// los bloques de esta hoja; y en la ultima, el total clavado al fondo + footer.
function HojaA4({ brand, lang, empresa, t, bloques, esPrimera, esUltima, metaEvento, totales }) {
  return (
    <div className="hoja-a4" data-brand={brand} data-lang={lang}>
      <MarcaDeAgua brand={brand} />

      {/* Cabecera de marca (se repite en cada hoja) */}
      <CabeceraMarca empresa={empresa} brand={brand} />

      {/* Meta del evento: SOLO en la primera hoja */}
      {esPrimera ? (
        <>
          <div className="doc-meta">
            <div>
              <div className="doc-kind">{t.presupuesto}</div>
              <div className="event-title display">{metaEvento.title}</div>
            </div>
            <div className="doc-ref">
              {t.num} <b>{metaEvento.docNumber}</b><br />
              {t.fecha} <b>{metaEvento.issueDate}</b><br />
              {t.validez} <b>{metaEvento.validityDays} {t.dias}</b>
            </div>
          </div>
          <div className="event-sub">
            <span>{metaEvento.dateText}</span>
            <span className="dot">•</span>
            <span>{metaEvento.place}</span>
            <span className="dot">•</span>
            <span>{metaEvento.serviceText}</span>
          </div>
        </>
      ) : null}

      {/* Cabecera de tabla (columnas) — referencia repetida en cada hoja */}
      <table className="lineas hoja-lineas">
        <thead>
          <tr>
            <th>{t.concepto}</th>
            <th className="qty">{t.cant}</th>
            <th className="num unit">{t.precioUnit}</th>
            <th className="num amt">{t.importe}</th>
          </tr>
        </thead>
        <tbody>
          {bloques.map((b, i) => <FilaBloque key={i} bloque={b} t={t} />)}
        </tbody>
      </table>

      {/* Total clavado al fondo (solo ultima hoja) */}
      {esUltima ? (
        <div className="totals hoja-total">
          <div className="totals-box">
            <div className="totals-row">
              <span>{t.baseImponible}</span><span>{formatEuro(totales.base)}</span>
            </div>
            <div className="totals-row">
              <span>{t.iva}</span><span>{formatEuro(totales.iva)}</span>
            </div>
            <div className="totals-row grand">
              <span className="label">{t.total}</span>
              <span className="value">{formatEuro(totales.total)}</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Footer (se repite en cada hoja, al fondo) */}
      <footer className="foot hoja-foot">
        <span>{empresa.footerNombre}</span>
        <span className="web">{empresa.web}</span>
      </footer>
    </div>
  )
}

// Pinta un bloque segun su tipo (titulo de seccion, fila de item, subtotal).
function FilaBloque({ bloque, t }) {
  const { tipo, ref } = bloque
  if (tipo === 'titulo') {
    return (
      <tr className="fila-titulo">
        <td colSpan={4}>
          <div className="section-title">
            <h3>{ref.section.title}</h3>
            <div className="rule" />
          </div>
        </td>
      </tr>
    )
  }
  if (tipo === 'subtotal') {
    return (
      <tr className="subtotal">
        <td>{t.baseImponible}</td>
        <td className="qty" />
        <td className="num unit" />
        <td className="num amt">{formatEuro(subtotalSeccion(ref.section))}</td>
      </tr>
    )
  }
  // item
  const item = ref.item
  const tienePrecio = typeof item.unitPrice === 'number'
  return (
    <tr>
      <td>
        <div className="desc-main">{item.description}</div>
        {item.note ? <div className="desc-note">{item.note}</div> : null}
      </td>
      <td className="qty">{item.qty ?? ''}</td>
      <td className="num unit">{tienePrecio ? formatEuro(item.unitPrice) : ''}</td>
      <td className="num amt">{tienePrecio ? formatEuro(importeLinea(item)) : ''}</td>
    </tr>
  )
}

function CabeceraMarca({ empresa, brand }) {
  return (
    <div className="head">
      <div className="brandmark">
        {brand === 'kng' ? (
          <img className="logo-kng" src="/assets/logo-kng.png" alt="Kami No Glass" />
        ) : (
          <div className="logo-vera">
            <div className="wordmark">VERA</div>
            <div className="tag">Equipment &amp; Rentals</div>
          </div>
        )}
      </div>
      <div className="company">
        <div className="name">{empresa.nombre}</div>
        <div className="cif">{empresa.cifLabel} · {empresa.cif}</div>
        {empresa.contacto.map((linea, i) => (
          <span key={i}>{linea}<br /></span>
        ))}
      </div>
    </div>
  )
}

function MarcaDeAgua({ brand }) {
  if (brand === 'kng') {
    return <img className="marca-agua marca-agua-kng" src="/assets/logo-kng.png" alt="" aria-hidden="true" />
  }
  return <div className="marca-agua marca-agua-vera" aria-hidden="true">VERA</div>
}

export default HojaA4
```

- [ ] **Step 2: Verificar que compila**

Run: `cd frontend && npm run build`
Expected: build OK.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Documento/HojaA4.jsx
git commit -m "feat: componente HojaA4 que pinta una hoja A4 paginada"
```

---

### Task 5: Reescribir `DocumentoPresupuesto` como orquestador

**Files:**
- Modify: `frontend/src/components/Documento/DocumentoPresupuesto.jsx` (reescritura completa)

**Interfaces:**
- Consumes: `useMedidasDocumento` (Task 3), `paginarBloques` (Task 2), `HojaA4` (Task 4), `PaginaCondiciones` (existente), `datosEmpresa`, `etiquetas`, `calcularTotales`.
- Produces: el documento completo paginado.

- [ ] **Step 1: Construir la lista lineal de bloques desde quote**

Reemplazar `frontend/src/components/Documento/DocumentoPresupuesto.jsx` por:

```jsx
import { useMemo } from 'react'
import '../../styles/documento.css'
import { datosEmpresa } from '../../data/datosEmpresa'
import { etiquetas } from '../../data/textosFijos'
import { calcularTotales } from '../../lib/calculos'
import { paginarBloques } from '../../lib/paginar'
import { useMedidasDocumento } from '../../hooks/useMedidasDocumento'
import HojaA4 from './HojaA4'
import PaginaCondiciones from './PaginaCondiciones'

// Alto util de una hoja A4 para CONTENIDO, en px. Se calcula a partir de las
// medidas reales: alto de hoja menos margenes, cabeceras y (en la ultima) total.
// A4 = 297mm. Asumimos 1mm ≈ 3.78px (96dpi). Margenes verticales 18mm arriba +
// 18mm abajo. El resto lo descuentan las cabeceras medidas.
const MM_TO_PX = 3.7795
const ALTO_HOJA_PX = 297 * MM_TO_PX
const MARGEN_VERTICAL_PX = 2 * 18 * MM_TO_PX

// Construye la lista lineal de bloques (titulo, item, subtotal) desde quote.
function construirBloques(quote) {
  const bloques = []
  for (const section of quote.sections) {
    if (section.title) {
      bloques.push({ tipo: 'titulo', ref: { tipoRef: 'titulo', section } })
    }
    section.items.forEach((item) => {
      bloques.push({ tipo: 'item', ref: { tipoRef: 'item', item, sectionId: section.id } })
    })
    if (section.showSubtotal) {
      bloques.push({ tipo: 'subtotal', ref: { tipoRef: 'subtotal', section } })
    }
  }
  return bloques
}

function DocumentoPresupuesto({ quote }) {
  const empresa = datosEmpresa[quote.brand][quote.lang]
  const t = etiquetas[quote.lang]
  const totales = calcularTotales(quote)

  const bloquesBase = useMemo(() => construirBloques(quote), [quote])
  const { medidas, listo, refMedicion } = useMedidasDocumento(quote)

  // Combina bloques + sus alturas medidas (por indice) para paginar.
  const hojas = useMemo(() => {
    if (!listo) return null
    const conAlto = bloquesBase.map((b, i) => ({
      ...b,
      alto: medidas.bloques[i] ? medidas.bloques[i].alto : 0,
    }))
    const altoCabeceras = medidas.cabeceraMarca + medidas.cabeceraTabla
    const altoUtilPrimera = ALTO_HOJA_PX - MARGEN_VERTICAL_PX - altoCabeceras - medidas.metaEvento
    const altoUtilSiguientes = ALTO_HOJA_PX - MARGEN_VERTICAL_PX - altoCabeceras
    return paginarBloques(conAlto, altoUtilPrimera, altoUtilSiguientes)
  }, [listo, bloquesBase, medidas])

  return (
    <div className="documento" data-brand={quote.brand} data-lang={quote.lang}>
      {/* Contenedor invisible de medicion (Task 3 lo lee por data-attrs) */}
      <ContenedorMedicion refMedicion={refMedicion} quote={quote} empresa={empresa} t={t} bloques={bloquesBase} />

      {!listo || !hojas ? (
        // Hoja provisional mientras se mide (evita parpadeo)
        <HojaA4 brand={quote.brand} lang={quote.lang} empresa={empresa} t={t}
          bloques={bloquesBase} esPrimera esUltima metaEvento={quote.event} totales={totales} />
      ) : (
        hojas.map((hoja, i) => (
          <HojaA4 key={i} brand={quote.brand} lang={quote.lang} empresa={empresa} t={t}
            bloques={hoja.bloques} esPrimera={i === 0} esUltima={i === hojas.length - 1}
            metaEvento={quote.event} totales={totales} />
        ))
      )}

      <PaginaCondiciones brand={quote.brand} lang={quote.lang} />
    </div>
  )
}

export default DocumentoPresupuesto
```

- [ ] **Step 2: Añadir el ContenedorMedicion al mismo archivo**

Antes de `export default DocumentoPresupuesto`, añadir el componente que renderiza los bloques invisibles con los `data-attrs` que el hook (Task 3) lee:

```jsx
// Render invisible para medir: cada bloque lleva data-medir/data-tipo; los
// elementos fijos llevan data-fijo. position:absolute + visibility:hidden para
// que no se vea ni ocupe sitio en el layout real.
function ContenedorMedicion({ refMedicion, quote, empresa, t, bloques }) {
  return (
    <div ref={refMedicion} aria-hidden="true"
      style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none',
        width: '174mm', left: '-9999px', top: 0 }}>
      <div className="documento" data-brand={quote.brand} data-lang={quote.lang}>
        <div data-fijo="cabeceraMarca" className="head">{empresa.nombre}</div>
        <div data-fijo="metaEvento" className="doc-meta">{quote.event.title}</div>
        <table className="lineas"><thead data-fijo="cabeceraTabla"><tr>
          <th>{t.concepto}</th><th>{t.cant}</th><th>{t.precioUnit}</th><th>{t.importe}</th>
        </tr></thead><tbody>
          {bloques.map((b, i) => (
            <tr key={i} data-medir={i} data-tipo={b.tipo}>
              <td colSpan={4}>{rotuloMedicion(b)}</td>
            </tr>
          ))}
        </tbody></table>
        <div data-fijo="totalFooter" className="totals">{t.total}</div>
      </div>
    </div>
  )
}

// Texto representativo para medir el alto de cada bloque (mismo contenido real
// que determina su altura: descripcion + nota para items).
function rotuloMedicion(b) {
  if (b.tipo === 'titulo') return b.ref.section.title
  if (b.tipo === 'subtotal') return 'subtotal'
  const item = b.ref.item
  return item.note ? `${item.description} ${item.note}` : item.description
}
```

- [ ] **Step 3: Verificar que compila y arranca**

Run: `cd frontend && npm run build`
Expected: build OK.

- [ ] **Step 4: Verificación visual rápida (servidor :5174)**

Run: `cd frontend && npm run dev -- --port 5174`
Abrir y confirmar que el documento se ve (puede no estar perfecto de medidas aún; el ajuste fino es Task 6). Confirmar que NO hay errores en consola y que aparece UNA hoja con el ejemplo por defecto.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/Documento/DocumentoPresupuesto.jsx
git commit -m "feat: DocumentoPresupuesto orquesta medicion + paginacion + HojaA4"
```

---

### Task 6: CSS de hojas A4 fijas (pantalla y print) + retirar maquinaria vieja

**Files:**
- Modify: `frontend/src/styles/documento.css`

**Interfaces:**
- Consumes: las clases que pinta `HojaA4` (`.hoja-a4`, `.hoja-lineas`, `.hoja-total`, `.hoja-foot`).
- Produces: hojas A4 de alto fijo idénticas en pantalla y PDF.

- [ ] **Step 1: Añadir estilos de `.hoja-a4`**

En `frontend/src/styles/documento.css`, añadir (al final, antes del `@media print`):

```css
/* ===========================================================
   HOJA A4 PAGINADA — alto fijo, identica en pantalla y PDF
   =========================================================== */
.documento .hoja-a4 {
  position: relative;
  width: 210mm;
  height: 297mm;
  margin: 0 auto 8mm;
  padding: 18mm;
  padding-left: 23mm;            /* hueco para el filete de acento */
  background-image: linear-gradient(
    to right, var(--accent) 0, var(--accent) 5mm, var(--bg) 5mm, var(--bg) 100%
  );
  box-shadow: 0 6px 30px rgba(0,0,0,.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
/* La cabecera de tabla y las filas ocupan su alto natural; el total se va al
   fondo (margin-top:auto) y el footer cierra debajo. */
.documento .hoja-a4 .hoja-lineas { width: 100%; }
/* En la ULTIMA hoja: el total se va al fondo (margin-top:auto) y el footer
   queda justo debajo. En hojas INTERMEDIAS no hay total, asi que es el footer
   quien toma margin-top:auto y baja al fondo. Ambos casos cubiertos abajo. */
.documento .hoja-a4 .hoja-total { margin-top: auto; }
.documento .hoja-a4 .hoja-foot { margin-top: 3mm; }
.documento .hoja-a4 > .hoja-foot:last-child { margin-top: auto; }
.documento .hoja-a4 .fila-titulo td { padding-top: 4mm; }
```

- [ ] **Step 2: Retirar la maquinaria vieja (tfoot espaciador, footer fixed, espaciadores)**

En `frontend/src/styles/documento.css`, dentro de `@media print`, eliminar las reglas que ya no aplican: `.foot-fijo` (fixed), `.foot-espaciador`, `.foot-espaciador-pagina`, y las reglas de `.doc-table > tfoot`. Reemplazar el bloque `@media print` para que solo conserve lo necesario:

```css
@media print {
  .no-print { display: none !important; }
  html, body, #root { height: auto !important; overflow: visible !important; }
  .app-layout { display: block !important; }
  .zona-documento { height: auto !important; overflow: visible !important; padding: 0 !important; display: block !important; }

  /* Cada hoja A4 ocupa exactamente una pagina fisica. */
  .documento .hoja-a4 { margin: 0; box-shadow: none; break-after: page; }
  .documento .hoja-a4:last-of-type { break-after: auto; }

  /* La pagina 2 de condiciones empieza en hoja nueva. */
  .documento .pagina-condiciones { break-before: page; }

  /* No partir filas ni clausulas. */
  .documento .lineas tr, .documento .clause { break-inside: avoid; }
}

@page { size: A4; margin: 0; }
```

- [ ] **Step 3: Quitar reglas de `.doc-table` y de `.page` que ya no se usan**

Buscar en `documento.css` las reglas de `.doc-table` (tabla maestra antigua) y de `.page`/`.pagina-condiciones` que dependían del flujo viejo. Conservar solo lo que `PaginaCondiciones` necesita (`.page`, `.terms`, `.clauses`, etc.). Eliminar: `.doc-table` y todas sus subreglas (`> thead`, `> tbody`, `> tfoot`, el bloque `@media screen` de `.doc-table`).

Run para localizar: `grep -n "doc-table\|foot-fijo\|foot-espaciador" frontend/src/styles/documento.css`
Expected tras limpiar: el grep no devuelve nada.

- [ ] **Step 4: Verificar build y lint**

Run: `cd frontend && npm run build && npm run lint`
Expected: build OK, lint sin warnings.

- [ ] **Step 5: Verificación visual (servidor :5174)**

Confirmar en pantalla: hojas A4 de alto fijo; con pocos ítems una hoja; el total al fondo de la última hoja; footer debajo.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/styles/documento.css
git commit -m "feat: CSS de hojas A4 fijas y retiro de la maquinaria de flujo vieja"
```

---

### Task 7: Verificación integral (visual, por el usuario)

**Files:** ninguno.

- [ ] **Step 1: Matriz de pruebas (servidor :5174, imprimir a PDF)**

| Caso | Marca | Idioma | Confirmar |
|------|-------|--------|-----------|
| Pocos ítems (defecto) | KNG | ES | 1 hoja presup. + 1 condiciones; total al fondo; footer debajo |
| Muchos ítems (~30) | KNG | ES | 2-3 hojas; cabecera marca + tabla repetidas; total único al fondo de la última; sin doble total |
| Muchos ítems | VERA | EN | Igual, colores VERA, textos EN |
| Pantalla vs PDF | KNG | ES | La pantalla se ve IGUAL que el PDF descargado |

- [ ] **Step 2: Confirmar que el diseño visual no cambió**

Cabecera de marca, marca de agua, filete lateral, fuentes y colores idénticos a antes.

- [ ] **Step 3: Cierre**

Si todo pasa, la rama está lista para integrar y subir a GitHub.

---

## Riesgo conocido (a verificar en Task 7)

La medición (Task 3/5) usa un render simplificado de cada bloque
(`rotuloMedicion`) en lugar de pintar el bloque idéntico al real. Su alto puede
diferir unos px del real, lo que haría que la paginación corte un poco antes o
después de lo ideal. **Mitigación:** si en Task 7 se observa desajuste, cambiar
`ContenedorMedicion` para que renderice los bloques con el MISMO markup que
`HojaA4.FilaBloque` (misma estructura de `<tr><td>` y clases), de modo que las
alturas medidas coincidan exactamente con las pintadas. Se deja como ajuste
reactivo para no sobre-construir antes de ver el comportamiento real.

## Self-Review (cobertura del spec)

- **Spec §2.1 (medición automática)** → Task 3 (hook) + Task 5 (uso). ✓
- **Spec §2.2 (total clavado al fondo)** → Task 4 (`hoja-total`) + Task 6 (`margin-top:auto`). ✓
- **Spec §2.3 (footer debajo del total)** → Task 4 (orden) + Task 6. ✓
- **Spec §2.4 (hoja 2+ repite marca + tabla, meta solo hoja 1)** → Task 4 (`esPrimera`). ✓
- **Spec §2.5 (sin librerías runtime, window.print)** → Global Constraints. ✓
- **Spec §2.6 (PaginaCondiciones no cambia)** → no se toca; Task 6 conserva sus reglas. ✓
- **Spec §4.1 (paginar.js)** → Task 1-2. ✓
- **Spec §4.2 (useMedidasDocumento)** → Task 3. ✓
- **Spec §4.3 (HojaA4)** → Task 4. ✓
- **Spec §4.4 (DocumentoPresupuesto orquestador)** → Task 5. ✓
- **Spec §4.5 (CSS hojas fijas)** → Task 6. ✓
- **Spec §5 (casos límite)** → Task 2 tests (huérfano, gigante, vacío) + medición real (notas). ✓
- **Spec §6 (errores: hoja provisional)** → Task 5 (`!listo`). ✓
- **Spec §7 (verificación)** → Task 2 (unit) + Task 7 (visual). ✓
- **Spec §8 (qué no cambia)** → Global Constraints + Task 7 Step 2. ✓

Sin placeholders. Nombres consistentes: `paginarBloques`, `useMedidasDocumento`, `HojaA4`, `construirBloques`, props `esPrimera`/`esUltima`/`bloques`/`metaEvento`/`totales` usados igual en Tasks 4 y 5.
