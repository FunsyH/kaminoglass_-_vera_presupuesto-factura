# TODO — Ampliar plantilla con Condiciones + Términos y Condiciones

Contexto: el usuario pidió que el presupuesto no sea solo la lista de productos,
sino que incluya **condiciones de contratación** y **términos y condiciones**,
y que sea **fácil y rápido de rellenar**. Textos reales sacados del Drive KNG&VERA.

## Hallazgos del Drive (texto real)
- Términos largos (10 cláusulas) = IGUALES para KNG y VERA. KNG los tiene ES+EN; VERA solo ES.
- Condición corta de 1ª página = depósito 50% (común a ambas).
- Decisión usuario: 1ª pág solo depósito 50% (ambas); rotura/limpieza dentro de términos largos.
- Decisión usuario: título términos KNG = "Servicios de Bar y Catering"; VERA = "Alquiler de Material".

## Qué cambia
- [x] 1ª página: renombrar bloque a "Condiciones de contratación / Booking conditions" (depósito 50%).
- [x] 2ª página A4 nueva: "Términos y Condiciones" con las 10 cláusulas (bilingüe ES/EN).
- [x] Título de los términos adaptado por marca (KNG catering / VERA alquiler) vía brand-block.
- [x] Mantener panel de control, filete de acento, pie y numeración de página.
- [x] Regenerar los 4 PDF de ejemplo (KNG/VERA × ES/EN) y verificar 2 páginas.

## Qué NO cambia
- Tablas de productos, totales, cabecera, logos, tokens de color, fuentes.
- Lógica JS de marca/idioma (se reutiliza tal cual).

## Review
- Hecho: 1ª pág renombrada a "Condiciones de contratación"; 2ª pág nueva con 10
  cláusulas en 2 columnas, justificadas, números en color de acento.
- Subtítulo por marca: KNG "Servicios de Bar y Catering" / VERA "Alquiler de Material".
- Textos = los reales del Drive (KNG trae ES+EN; VERA solo ES → reusé el EN de KNG).
- Verificado por render: las 4 variantes salen a 2 páginas, idioma y marca correctos,
  sin solapes. PDFs copiados a ejemplos/.

## Ronda 2 de ajustes (feedback del usuario) — HECHO
- [x] Fuentes de tablas más grandes (conceptos/cant 4mm, importes 4.2mm bold).
- [x] Título del evento a la mitad (11mm → 6mm).
- [x] Logo KNG más pequeño (34mm → 26mm), alineado con los datos.
- [x] Condiciones de contratación movidas al INICIO de la página 2 (antes ocupaban
      la 1ª pág y se solapaban con totales al crecer la tabla).
- [x] Footer KNG: quitado "VERA" → "Kami No Glass Group SL · Ibiza".
- [x] Footer VERA: "VERA · Equipment and Rental Accessories SL" + @verarentalaccessories
      (quitada la web de KNG que no corresponde; web propia de VERA pendiente).
- [x] Refactor: brand-block ahora usa clase .is-on + CSS por contexto (block/inline),
      en vez de el.style.display='block'. Más limpio y soporta el pie en línea.

## Decisión: PASAR A FASE 2 (app/formulario)
Motivo: presupuestos de 20-30 ítems no caben en 1 página; paginar bien + "fácil y
rápido de ingresar" se resuelve en la app, no en HTML manual. Falta PLANIFICAR Fase 2
y confirmarla con el usuario antes de construir (cambio grande, 3+ pasos).
