import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Placeholder from './components/Placeholder';
import { Servicios } from './components/Servicios';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'services':
        return <Servicios />;
      case 'customers':
        return (
          <Placeholder
            title="Clientes"
            description="Base de datos de clientes y su historial"
            icon="👥"
          />
        );
      case 'inventory':
        return (
          <Placeholder
            title="Inventario"
            description="Control de repuestos y materiales"
            icon="📦"
          />
        );
      case 'appointments':
        return (
          <Placeholder
            title="Citas"
            description="Programación y gestión de citas"
            icon="📅"
          />
        );
      case 'reports':
        return (
          <Placeholder
            title="Reportes"
            description="Análisis detallado y reportes financieros"
            icon="📈"
          />
        );
      case 'settings':
        return (
          <Placeholder
            title="Configuración"
            description="Configuración del sistema y preferencias"
            icon="⚙️"
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
