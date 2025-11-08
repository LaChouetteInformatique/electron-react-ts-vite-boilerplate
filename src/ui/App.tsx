import { ThemeToggle } from "./components/ThemeToggle"

function App() {
  return (
    <div className="container mx-auto p-8 min-h-screen flex flex-col items-center justify-center">
      <nav className="fixed top-4 right-4">
        <ThemeToggle />
      </nav>
      <main className="text-center">
        <h1 className="text-5xl font-bold">Electron + React + TypeScript + Vite Boilerplate</h1>
        <p className="text-lg text-slate-500 mt-4">Votre application est prête. Commencez à construire !</p>
      </main>
    </div>
  )
}

export default App
