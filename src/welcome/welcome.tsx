import { useState } from 'react';
import Layout from '../components/Layout';
import ClientesView from '../components/ClientView';

export function Welcome() {
  const [currentView, setCurrentView] = useState('autopartes');

  const renderView = () => {
    switch (currentView) {
      default:
        return <ClientesView />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default Welcome;
