import { ReactNode } from 'react';
import ShopNavbar from './ShopNavbar';

interface ShopLayoutProps {
  children: ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <ShopNavbar />
      <main className="pt-20">
        {children}
      </main>
      <footer className="mt-16 border-t border-slate-700/50 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400 text-sm">
            <p>© 2024 AutoParts Pro. Todos los derechos reservados.</p>
            <p className="mt-2">
              <a href="/" className="hover:text-teal-400 transition-colors">
                Modo Administrativo
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
