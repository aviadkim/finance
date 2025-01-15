import React from 'react';
import TestDeployment from './components/TestDeployment';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Finance System - Testing Deployment
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <TestDeployment />
        </div>
      </main>
    </div>
  );
}

export default App;