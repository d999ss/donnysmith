export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-slate-400 mb-4">The AI assistant should be at the home page.</p>
        <a href="/" className="text-blue-500 hover:text-blue-400">
          Go to AI Assistant →
        </a>
      </div>
    </div>
  )
}