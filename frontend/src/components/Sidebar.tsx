const Sidebar = () => {
  return (
    <aside className="hidden w-64 bg-white p-4 shadow-md sm:block">
      <button className="mb-6 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-green-600">
        + New Chat
      </button>
      <div className="text-sm text-gray-600">
        <p className="mb-2">Recent</p>
        <ul className="space-y-2">
          <li className="cursor-pointer rounded p-2 hover:bg-gray-200">
            How do I cook rice?
          </li>
          <li className="cursor-pointer rounded p-2 hover:bg-gray-200">
            Explain quantum physics
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
