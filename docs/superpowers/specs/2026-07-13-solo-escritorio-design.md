# Diseño: app solo escritorio (eliminar versión móvil)

**Fecha:** 2026-07-13
**Estado:** aprobado por el usuario

## Objetivo

La app de presupuestos/facturas KNG & VERA solo se usará desde ordenador.
En móvil (pantallas < 768px) se muestra únicamente un aviso; se elimina el
código responsive que adaptaba la interfaz a pantallas pequeñas.

## Decisiones

- **Puerta por CSS, sin JavaScript**: se usa el breakpoint `md` (768px) de
  Tailwind, el mismo que ya usa toda la app. Nada de detección por
  userAgent/matchMedia (frágil e innecesaria).
- **El bloque `@media print` NO se toca.** Incluye los arreglos de Safari iOS
  (hojas fantasma, cortes por la derecha) de los que depende el PDF aprobado
  (commit fb8ec51 y posteriores). Son inofensivos en escritorio y varios
  también protegen a Chrome. Quitarlos sería riesgo sin beneficio.
- **El documento (hoja A4) no cambia** ni en pantalla ni impreso.

## Cambios

1. **Nuevo componente `AvisoSoloEscritorio`** (`frontend/src/components/ui/`):
   mensaje centrado, estilo de la app, texto tipo «Esta herramienta está
   pensada para ordenador. Ábrela desde un ordenador para generar presupuestos
   y facturas.» Clases: visible solo bajo `md` (`md:hidden`) y `no-print`.

2. **`App.jsx`**: renderiza `AvisoSoloEscritorio` y oculta el contenido de la
   app en móvil (`hidden md:flex` en el contenedor raíz). Se simplifican las
   clases con variante móvil a su valor de escritorio:
   - `h-auto md:h-screen` → `h-screen` (vía `md:flex` + clases fijas)
   - `overflow-visible md:overflow-hidden` → `overflow-hidden`
   - `flex-col md:flex-row` → `flex-row`
   - `md:h-full` → `h-full`, etc.

3. **`FormularioPresupuesto.jsx` y `FormularioFactura.jsx`**: el contenedor
   `w-full md:w-[480px] md:shrink-0 h-auto md:h-full overflow-visible
   md:overflow-y-auto` pasa a `w-[480px] shrink-0 h-full overflow-y-auto`.

4. **`documento.css`**: se elimina el bloque
   `@media screen and (max-width: 860px)` (líneas ~526-542), que escalaba la
   vista previa con `zoom` para móvil, junto con su comentario.

## Comportamiento resultante

- Escritorio (≥ 768px): idéntico a hoy.
- Móvil / ventana estrecha (< 768px): solo el aviso. Una ventana de
  escritorio muy estrecha también lo muestra; se resuelve ensanchando
  (comportamiento estándar de este patrón, aceptado).
- Imprimir: sin cambios; el aviso lleva `no-print`.

## Verificación

1. `npm run build` limpio.
2. En local: escritorio se ve igual que hoy (presupuesto y factura).
3. Vista previa de impresión intacta.
4. Ventana < 768px: solo se ve el aviso; ≥ 768px: app completa.
