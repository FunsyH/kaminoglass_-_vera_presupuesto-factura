# Diseño · Vista previa paginada A4 (pantalla = PDF)

**Fecha:** 2026-06-27
**Proyecto:** KNG & Vera · Presupuesto & Factura (frontend React + Vite)
**Estado:** Aprobado para implementar

---

## 1. Problema

Hoy el documento "fluye" y el navegador lo pagina al imprimir. Eso causa que:

- La vista en pantalla NO coincide con el PDF descargado.
- Al añadir muchos ítems, el footer y el total no quedan donde se espera.
- No hay una noción real de "hoja A4 llena → siguiente hoja".

El usuario quiere que la **simulación en pantalla se vea EXACTAMENTE como el PDF**:
hojas A4 de tamaño fijo; los ítems llenan una hoja y, al superarla, nace la hoja 2
donde continúa la lista; la cabecera de marca y la cabecera de tabla se repiten como
referencia; el total va una sola vez, clavado al fondo de la última hoja, con el footer
debajo.

## 2. Decisiones acordadas con el usuario

1. **Paginación por medición automática del alto real** (no por nº fijo de filas).
2. **El total va clavado al fondo de la última hoja** (no flotando tras el último ítem);
   se acepta el hueco elegante entre el último ítem y el total.
3. **El footer va debajo del total**, ambos al fondo. El footer se repite en todas las hojas.
4. **En hoja 2+** se repiten: cabecera de marca (logo + datos empresa) + cabecera de tabla
   (Concepto · Cant. · P.Unit · Importe). El título del evento y la fecha solo en hoja 1.
5. **Enfoque:** vista previa paginada propia con JS + CSS. Sin librerías nuevas. Mantiene
   `window.print()`.
6. **La página 2 de condiciones (`PaginaCondiciones`) no cambia** su contenido; solo se
   asegura que siga en hoja aparte.

## 3. Arquitectura

```
quote.sections[].items[]
        │
        ▼
[useMedidasDocumento]  ← mide alturas reales en contenedor invisible (px)
        │  alturas de: cada fila de ítem, cada título de sección, subtotal,
        │  cabecera de marca, cabecera de tabla, bloque total+footer
        ▼
[paginar.js]  ← reparte ítems en hojas según alto útil A4 disponible
        │  devuelve: [{ bloques: [...] }, ...]  (una entrada por hoja)
        ▼
[DocumentoPresupuesto]  ← pinta una <HojaA4> por hoja + <PaginaCondiciones>
        │
        ▼
N × <HojaA4>  +  <PaginaCondiciones>
```

## 4. Componentes / archivos

### 4.1 `frontend/src/lib/paginar.js` (NUEVO) — lógica pura, testeable
- **Qué hace:** reparte una lista lineal de "bloques" (título de sección, fila de ítem,
  subtotal) en hojas, según el alto útil de cada hoja.
- **Interfaz:**
  - `paginarBloques(bloques, altoUtilPrimera, altoUtilSiguientes)` → `Hoja[]`
  - `bloques`: `[{ tipo: 'titulo'|'item'|'subtotal', alto: number, ref: any }]`
    (`ref` es el dato original para pintarlo después; `alto` viene de la medición).
  - `altoUtilPrimera`: alto disponible para contenido en la hoja 1 (menos cabeceras +
    bloque meta del evento).
  - `altoUtilSiguientes`: alto disponible en hojas 2+ (menos cabeceras, sin meta).
  - Devuelve `Hoja[]` donde `Hoja = { bloques: Bloque[] }`.
- **Reglas:**
  - Un `titulo` que no va seguido de al menos su primer `item` en la misma hoja se
    pasa a la hoja siguiente junto con ese item (no títulos huérfanos al pie).
  - Si un solo bloque excede el alto útil (caso extremo improbable), se coloca igual en
    su propia hoja para no entrar en bucle infinito.
- **Sin React, sin DOM.** Solo recibe números y devuelve estructura.

### 4.2 `frontend/src/hooks/useMedidasDocumento.js` (NUEVO) — medición
- **Qué hace:** renderiza los bloques en un contenedor invisible (`position:absolute;
  visibility:hidden; ancho = ancho de columna real`) y mide su alto en px con
  `getBoundingClientRect()`.
- **Interfaz:** `useMedidasDocumento(quote)` → `{ medidas, listo }`
  - `medidas`: `{ bloques: [{ tipo, alto, ref }], cabeceraMarca, cabeceraTabla,
    metaEvento, totalFooter }` (todos los altos en px).
  - `listo`: boolean — `false` hasta que la medición termina (primer render).
- **Re-mide** cuando cambian `quote.sections`, `quote.brand` o `quote.lang`.

### 4.3 `frontend/src/components/Documento/HojaA4.jsx` (NUEVO) — una hoja
- **Qué hace:** pinta una hoja A4 de alto fijo con:
  - cabecera de marca (siempre),
  - meta del evento (solo si es la hoja 1, vía prop `esPrimera`),
  - cabecera de tabla (columnas),
  - sus bloques (títulos de sección + filas de ítems + subtotales),
  - si es la última (`esUltima`): bloque total anclado al fondo (`margin-top:auto`),
  - footer (siempre, al fondo).
- **Interfaz:** `<HojaA4 quote empresa t esPrimera esUltima bloques totales />`

### 4.4 `frontend/src/components/Documento/DocumentoPresupuesto.jsx` (SE REESCRIBE)
- **Qué hace:** orquesta. Usa `useMedidasDocumento` para medir, `paginarBloques` para
  repartir, y pinta `N × <HojaA4>` seguido de `<PaginaCondiciones>`.
- Mientras `listo === false`: pinta una hoja provisional con todo el contenido (evita
  parpadeo); al estar `listo`, repagina.
- Los subcomponentes auxiliares de pintado (cabecera de marca, fila de ítem, marca de
  agua) se **mueven a `HojaA4`** (que es quien pinta una hoja). `DocumentoPresupuesto`
  queda solo como orquestador: medir → paginar → pintar N hojas. No conserva lógica de
  pintado de ítems propia.

### 4.5 `frontend/src/styles/documento.css` (SE AJUSTA)
- Hojas A4 de **alto fijo también en impresión** (`.hoja-a4 { height: 297mm; }` con
  `break-after: page` entre hojas).
- Se retira la maquinaria actual de `<tfoot>` espaciador + footer `position:fixed` +
  espaciador de página 2: ya no hace falta porque cada `HojaA4` es una unidad cerrada
  que incluye su propio footer en el flujo.
- El total recupera su sitio al fondo de la última hoja vía `margin-top:auto` dentro de
  la `.hoja-a4` (que es flex column).
- `PaginaCondiciones` mantiene su `break-before: page`.

## 5. Casos límite contemplados

1. **Título de sección al final de hoja:** baja a la hoja siguiente con su primer ítem.
2. **Nota larga en un ítem:** se mide el alto real, se cuenta correctamente.
3. **Total clavado al fondo:** última hoja con ítems arriba, total al fondo
   (`margin-top:auto`), footer debajo.
4. **Subtotal de sección activado:** cuenta como un bloque más en la medición.
5. **Cambio de marca/idioma:** dispara nueva medición y repaginación.
6. **Items vacíos:** una sola hoja con cabecera + total a cero.
7. **Bloque más alto que la hoja (extremo):** se coloca solo en su hoja (sin bucle).

## 6. Manejo de errores

- Medición no lista (primer render) → hoja provisional con todo, repagina al medir.
- `quote` o `sections` ausentes → degradan a documento vacío (cabecera + total cero),
  reusando las protecciones ya presentes en `lib/calculos.js`.

## 7. Verificación

- **Tests unitarios** de `paginar.js`: dadas alturas conocidas, comprobar el reparto
  (1 hoja cuando cabe, 2 cuando desborda, título no huérfano, bloque gigante).
- **Verificación visual** (usuario, servidor :5174): pantalla === PDF descargado, con
  pocos ítems (1 hoja) y muchos (~30, 2-3 hojas); cabeceras repetidas; total único al
  fondo de la última hoja; ambas marcas (KNG/VERA) y ambos idiomas (ES/EN).

## 8. Qué NO cambia

- `window.print()` sigue siendo el motor (sin librerías).
- Diseño visual: colores, fuentes, cabecera de marca, marca de agua, filete lateral.
- `lib/calculos.js` y `lib/formato.js` intactos.
- `PaginaCondiciones` (contenido de los Términos y Condiciones) intacto.
- El total suma una sola vez todos los artículos (nunca doble).
