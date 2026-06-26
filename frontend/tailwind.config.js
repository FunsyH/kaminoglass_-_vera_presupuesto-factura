/** @type {import('tailwindcss').Config} */
// Tailwind se usa SOLO para la interfaz del formulario (paneles, inputs, botones).
// El documento/PDF NO usa Tailwind: usa documento.css (en mm) para fidelidad de impresión.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Tokens de marca, reutilizables en la UI para que combine con el documento.
        kng: { ink: '#1a1714', gold: '#b8954a', cream: '#faf6ec' },
        vera: { ink: '#15202e', blue: '#1e3a5f', bone: '#f5f6f8' },
        panel: '#1a1714', // fondo del panel de control (igual que el del template)
      },
    },
  },
  plugins: [],
}
