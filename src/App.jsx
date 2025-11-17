import GeneratorUI from './components/GeneratorUI';
import ImageEditor from './components/ImageEditor';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6">
        <header className="max-w-6xl mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-10 h-10"/>
            <div>
              <h1 className="text-2xl font-bold text-white">Creative Studio</h1>
              <p className="text-xs text-blue-200/80">Image generator • Video generator • Image editor</p>
            </div>
          </div>
          <div className="text-blue-200 text-sm">Backend URL: {import.meta.env.VITE_BACKEND_URL || 'not set'}</div>
        </header>

        <main className="max-w-6xl mx-auto grid gap-10">
          <GeneratorUI />
          <ImageEditor />
        </main>

        <footer className="max-w-6xl mx-auto py-8 text-center text-sm text-blue-300/60">
          Built with Flames Blue
        </footer>
      </div>
    </div>
  )
}

export default App