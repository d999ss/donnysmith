export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Donny Smith AI Assistant</h1>
        <div className="bg-slate-800 rounded-lg p-8 max-w-4xl mx-auto">
          <p className="text-xl mb-6">Chat with my AI assistant (Coming Soon)</p>
          <div className="bg-slate-700 rounded p-4 mb-4">
            <p className="text-green-400">✅ Site deployed successfully!</p>
            <p className="text-blue-400">🤖 AI assistant loading...</p>
          </div>
          <p className="text-gray-400">
            This is a test page to verify the deployment is working. 
            The full AI chat interface will be restored once we confirm this loads properly.
          </p>
        </div>
      </div>
    </div>
  )
}