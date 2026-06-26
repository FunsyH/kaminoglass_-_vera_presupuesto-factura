import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El puerto 5173 lo ocupa otra app del usuario, así que usamos el 5174.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
  },
})
