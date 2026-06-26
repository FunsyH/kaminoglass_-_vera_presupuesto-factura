import SelectorMarcaIdioma from './SelectorMarcaIdioma'
import DatosEvento from './DatosEvento'
import EditorSecciones from './EditorSecciones'
import ControlTotales from './ControlTotales'
import BotonGenerarPDF from '../ui/BotonGenerarPDF'

// Panel de formulario completo: reúne todos los controles para rellenar el
// presupuesto. Recibe el quote y la función para actualizarlo desde App.
function FormularioPresupuesto({ quote, setQuote }) {
  return (
    <div className="no-print w-[480px] shrink-0 h-screen overflow-y-auto bg-white border-r border-gray-200 p-5">
      <h1 className="text-lg font-semibold text-kng-ink mb-4">
        Presupuestos · KNG &amp; VERA
      </h1>

      <SelectorMarcaIdioma quote={quote} setQuote={setQuote} />
      <DatosEvento quote={quote} setQuote={setQuote} />
      <EditorSecciones quote={quote} setQuote={setQuote} />
      <ControlTotales quote={quote} setQuote={setQuote} />
      <BotonGenerarPDF />
    </div>
  )
}

export default FormularioPresupuesto
