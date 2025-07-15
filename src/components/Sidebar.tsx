import React from 'react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'services', name: 'Servicios', icon: '🔧' },
    { id: 'worksheets', name: 'Hojas de Trabajo', icon: '📋' },
    { id: 'gastos', name: 'Gastos', icon: '📉' },
    { id: 'ingresos', name: 'Ingresos', icon: '💰' },
    { id: 'cierre-caja', name: 'Cierre de Caja', icon: '🏦' },
  ];

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen flex flex-col">
      {/* Logo y título */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <span className="text-xl">🔧</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Taller ABC</h1>
            <p className="text-slate-400 text-sm">Sistema Administrativo</p>
          </div>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Usuario */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-700 p-2 rounded-full">
            <span className="text-sm">👤</span>
          </div>
          <div>
            <p className="font-medium">Admin Usuario</p>
            <p className="text-slate-400 text-sm">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
