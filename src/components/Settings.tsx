import React from 'react';
import { User, Bell, Shield, Palette, Globe, HelpCircle, LogOut } from 'lucide-react';

const Settings: React.FC = () => {
  const settingsGroups = [
    {
      title: 'Tu cuenta',
      items: [
        { icon: User, label: 'Información de la cuenta', description: 'Ver tu información de cuenta' },
        { icon: Shield, label: 'Privacidad y seguridad', description: 'Controla tu privacidad' },
        { icon: Bell, label: 'Notificaciones', description: 'Selecciona las notificaciones que recibes' }
      ]
    },
    {
      title: 'Personalización',
      items: [
        { icon: Palette, label: 'Pantalla', description: 'Gestiona tu tamaño de fuente, color y fondo' },
        { icon: Globe, label: 'Idioma', description: 'Cambia el idioma de la interfaz' }
      ]
    },
    {
      title: 'Ayuda',
      items: [
        { icon: HelpCircle, label: 'Centro de ayuda', description: 'Obtén ayuda usando EcuaPost' }
      ]
    }
  ];

  return (
    <div className="border-l border-r border-gray-200 min-h-screen">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900">Configuración</h1>
      </div>
      
      <div className="p-4">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{group.title}</h2>
            <div className="space-y-2">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <Icon className="h-6 w-6 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="border-t border-gray-200 pt-6">
          <button className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 rounded-lg transition-colors text-left text-red-600">
            <LogOut className="h-6 w-6" />
            <div>
              <p className="font-medium">Cerrar sesión</p>
              <p className="text-sm text-red-500">Salir de tu cuenta</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;