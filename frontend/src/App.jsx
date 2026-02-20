import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import ExpertListing from './pages/ExpertListing';
import ExpertDetail from './pages/ExpertDetail';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <SocketProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary-500/30">
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #334155',
                borderRadius: '12px',
              },
            }}
          />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<ExpertListing />} />
              <Route path="/experts/:id" element={<ExpertDetail />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="py-12 border-t border-slate-900 mt-20">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} ExpertConnect. All rights reserved. Built with MERN Stack.
              </p>
            </div>
          </footer>
        </div>
      </SocketProvider>
    </Router>
  );
}

export default App;
