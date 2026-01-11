import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ClientView from '../components/ClientView';
import PiezasView from '../components/PiezaView';
import MarcasYModelosView from '../components/MarcasYModelosView';
import AutoparteView from '../components/AutoparteView';

export default function Home() {
  const [currentView, setCurrentView] = useState('autopartes');

  useEffect(() => {
    // Update currentView from localStorage only on the client side after hydration
    if (typeof window !== 'undefined') {
      const storedView = localStorage.getItem('lastView');
      if (storedView) {
        setCurrentView(storedView);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastView', currentView);
    }
  }, [currentView]);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'clientes':
        return <ClientView />;
      case 'piezas':
        return <PiezasView />;
      case 'marcas':
        return <MarcasYModelosView />;
      case 'autopartes':
        return <AutoparteView />;
      default:
        return <AutoparteView />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={handleViewChange}>
      {renderView()}
    </Layout>
  );
}
