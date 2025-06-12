import React from 'react';
import { Sidebar } from '@components';
import { Layout } from '@layouts';

const Home: React.FC = () => {
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const MAX_HEIGHT = 200; // Maximum height in pixels

    // Reset height to allow shrinking
    target.style.height = 'auto';

    // If scroll height exceeds maximum, fix height and show scrollbar; otherwise, adjust height accordingly
    if (target.scrollHeight > MAX_HEIGHT) {
      target.style.height = `${MAX_HEIGHT}px`;
      target.style.overflowY = 'scroll';
    } else {
      target.style.height = `${target.scrollHeight}px`;
      target.style.overflowY = 'hidden';
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Layout>
        <div className="flex flex-1 bg-gray-100">
          {/* Sidebar */}
          <Sidebar />
          {/* Chat area */}
          <main className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-3">
              SAFI (Model Name)
            </h1>
            <p className="text-gray-600 mb-6">
              Student Assistant for Facility Information
            </p>
            {/* Centered input box */}
            <div className="w-full flex justify-center px-6">
              <div className="w-full max-w-2xl bg-white text-gray-800 rounded-2xl px-4 py-3 flex items-center">
                {/* Left icons */}
                <div className="flex items-center gap-3"></div>
                {/* Textarea */}
                <textarea
                  rows={1}
                  placeholder="Ask about RMIT facilities"
                  onInput={handleInput}
                  style={{ overflow: 'hidden' }}
                  className="flex-1 mx-4 resize-none bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-left"
                />
                {/* Right icons */}
                <div className="flex items-center gap-3">
                  <button className="text-gray-400 hover:text-white">
                    {/* Add icon here */}
                  </button>
                  <button className="rounded-full bg-cyan-blue p-2 hover:bg-cyan-blue-hover transition">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 19V5m-7 7l7-7 7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </div>
  );
};

export default Home;