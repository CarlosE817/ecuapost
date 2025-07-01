import React from 'react';
import { User, Bell, Shield, Palette, Globe, HelpCircle, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

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
        { 
          icon: isDark ? Moon : Sun, 
          label: 'Tema', 
          description: `Modo ${isDark ? 'oscuro' : 'claro'} activado`,
          action: toggleTheme,
          isThemeToggle: true
        },
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
    <div className="border-l border-r border-gray-200 dark:border-gray-800 min-h-screen bg-white dark:bg-gray-900">
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Configuración</h1>
      </div>
      
      <div className="p-4">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{group.title}</h2>
            <div className="space-y-2">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={item.action}
                    className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left group"
                  >
                    <Icon className={`h-6 w-6 text-gray-600 dark:text-gray-400 ${item.isThemeToggle ? 'group-hover:text-blue-500' : ''}`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                    {item.isThemeToggle && (
                      <div className="flex items-center space-x-2">
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-blue-500' : 'bg-gray-300'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <button className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left text-red-600">
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