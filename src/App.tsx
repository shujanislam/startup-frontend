import { BrowserRouter, useRoutes } from 'react-router-dom'
import generatedRoutes from '~react-pages'

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

function AppShell() {
  return useRoutes(generatedRoutes)
}

export default App
