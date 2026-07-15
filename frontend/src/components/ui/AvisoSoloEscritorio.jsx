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
