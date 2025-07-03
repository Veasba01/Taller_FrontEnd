import React from 'react';

interface PlaceholderProps {
  title: string;
  description: string;
  icon: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, description, icon }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600 text-lg mb-8">{description}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 font-medium">Esta sección está en desarrollo</p>
            <p className="text-blue-600 text-sm mt-2">
              Aquí se mostrará la funcionalidad completa de {title.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Placeholder;
