import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const websocket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    websocket.current = new WebSocket('ws://localhost:8080/ws');

    websocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    websocket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && websocket.current) {
      websocket.current.send(inputMessage);
      setMessages((prevMessages) => [...prevMessages, `You: ${inputMessage}`]);
      setInputMessage('');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 dark:border-gray-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
        <div className="max-w-8xl mx-auto">
          <div className="py-4 border-b border-gray-900/10 lg:px-8 lg:border-0 dark:border-gray-300/10 mx-4 lg:mx-0">
            <div className="relative flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">OsirisAI</h1>
              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <span className="sr-only">{darkMode ? 'Light' : 'Dark'} Mode</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  {darkMode ? (
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-grow overflow-hidden flex flex-col">
        <main className="flex-grow overflow-y-auto">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 py-8">
            <div className="flex flex-col space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg max-w-xs lg:max-w-md ${
                    message.startsWith('You:')
                      ? 'ml-auto bg-sky-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </main>
      </div>
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
          <form onSubmit={handleSubmit} className="flex space-x-4 py-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
