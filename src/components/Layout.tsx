import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Wrench, Car, Users, Menu, X, ChevronRight, Sparkles, Bell, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { id: 'autopartes', label: 'Autopartes', icon: Package, gradient: 'from-teal-500 to-cyan-500', shadow: 'shadow-teal-500/25' },
    { id: 'marcas', label: 'Marcas y Modelos', icon: Car, gradient: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/25' },
    { id: 'piezas', label: 'Catálogo de Piezas', icon: Wrench, gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/25' },
    { id: 'clientes', label: 'Clientes', icon: Users, gradient: 'from-rose-500 to-pink-500', shadow: 'shadow-rose-500/25' },
  ];

  const handleViewChange = (view: string) => {
    onViewChange(view);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Efectos de fondo decorativos */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900 z-50 border-b border-slate-700/50">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Left side - Logo & Mobile menu */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6 text-slate-300" />
              ) : (
                <Menu className="h-6 w-6 text-slate-300" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  AutoParts Pro
                  <Sparkles className="h-4 w-4 text-teal-400" />
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">Sistema de Gestión de Autopartes</p>
              </div>
            </div>
          </div>
          
          {/* Center - Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm cursor-pointer
                    ${isActive 
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-md` 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile view indicator */}
            <div className="lg:hidden">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                {navItems.find(item => item.id === currentView)?.label}
              </span>
            </div>
            
            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-2">
              <a
                href="/shop"
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all font-medium text-sm"
              >
                Ir a Tienda
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all font-medium text-sm"
              >
                Cerrar Sesión
              </button>
              <button className="p-2.5 rounded-xl hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full"></span>
              </button>
              <button className="p-2.5 rounded-xl hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="w-px h-8 bg-slate-700/50 mx-2"></div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  JP
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-72 pt-16 glass z-40
        transform transition-transform duration-300 ease-out lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 h-full flex flex-col">
          {/* Navigation */}
          <div className="flex-1 space-y-2 mt-4">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Navegación
            </p>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 animate-slide-in group
                    ${isActive 
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg ${item.shadow}` 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}
                  `}
                >
                  <div className={`
                    p-2 rounded-lg transition-all duration-300
                    ${isActive ? 'bg-white/20' : 'bg-slate-700/50 group-hover:bg-slate-600/50'}
                  `}>
                    <Icon className="h-5 w-5 shrink-0" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 ml-auto animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer del sidebar */}
          <div className="border-t border-slate-700/50 pt-4 mt-4">
            <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-700/50">
              <p className="text-xs text-slate-500">Versión</p>
              <p className="text-sm font-medium text-slate-300">v2.0.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="pt-16 min-h-screen relative z-10">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
