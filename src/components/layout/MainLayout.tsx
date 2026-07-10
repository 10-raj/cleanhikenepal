import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer  } from './Footer';
import { AIChatbox } from '../chat/AIChatbox';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AIChatbox />
    </div>
  );
}
