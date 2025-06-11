import { Sidebar } from '@components'

const Home = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Chat area */}
      <main className="flex flex-1 flex-col">
        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="flex">
            <div className="max-w-xl rounded bg-white p-4 shadow">
              <p className="text-sm text-gray-800">
                Hello! How can I help you today?
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-xl rounded bg-blue-100 p-4 shadow">
              <p className="text-sm text-gray-900">
                What is the capital of France?
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="max-w-xl rounded bg-white p-4 shadow">
              <p className="text-sm text-gray-800">
                The capital of France is Paris.
              </p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4">
          <div className="mx-auto flex max-w-3xl items-center space-x-2">
            <textarea
              className="flex-1 resize-none rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Send a message..."
              rows={1}
            ></textarea>
            <button className="rounded-lg bg-blue-500 p-3 text-white hover:bg-blue-600">
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
