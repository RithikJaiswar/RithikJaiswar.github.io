import { Navbar } from './components/Navbar/Navbar'
import { Footer } from './components/Footer/Footer'
import { Home } from './pages/Home'

export default function App() {
  return (
    <div className="relative min-h-screen bg-ink text-fg">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to main content
      </a>

      <Navbar />
      <Home />
      <Footer />
    </div>
  )
}
