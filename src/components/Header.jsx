import React, { useState } from 'react';
import { Menu, X, Bell, User, ChevronDown, LogOut } from 'lucide-react';

const Header = ({ user, onLogout, toggleSidebar }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (profileMenuOpen) setProfileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="ml-4 md:ml-6">
            <h1 className="text-lg font-semibold text-purple-600">F&G Diversão e Open Food</h1>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            <button 
              onClick={toggleNotifications}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Notificações</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Novo evento confirmado</p>
                    <p className="text-xs text-gray-500 mt-1">Festa de aniversário - Maria Silva</p>
                    <p className="text-xs text-gray-400 mt-1">Há 2 horas</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Pagamento recebido</p>
                    <p className="text-xs text-gray-500 mt-1">R$ 750,00 - João Pereira</p>
                    <p className="text-xs text-gray-400 mt-1">Há 5 horas</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">Evento amanhã</p>
                    <p className="text-xs text-gray-500 mt-1">Lembrete: Festa Empresa XYZ</p>
                    <p className="text-xs text-gray-400 mt-1">Há 1 dia</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <a href="#" className="text-xs text-purple-600 hover:text-purple-800">Ver todas as notificações</a>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative ml-3">
            <div>
              <button 
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 p-1"
              >
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <User className="h-5 w-5" />
                </div>
                <div className="hidden md:flex md:items-center">
                  <span className="text-sm text-gray-700">{user?.email || 'Usuário'}</span>
                  <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
                </div>
              </button>
            </div>
            
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Perfil</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'usuario@exemplo.com'}</p>
                </div>
                <a 
                  href="#" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configurações
                </a>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
