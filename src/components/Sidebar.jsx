import React, { useState } from 'react';
import { Home, Calendar, Package, DollarSign, BarChart2, Users, CheckSquare, PieChart, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: <Home className="h-5 w-5" />, path: '/' },
    { name: 'Eventos', icon: <Calendar className="h-5 w-5" />, path: '/eventos' },
    { name: 'Brinquedos', icon: <Package className="h-5 w-5" />, path: '/brinquedos' },
    { name: 'Estações de Comida', icon: <PieChart className="h-5 w-5" />, path: '/estacoes-comida' },
    { name: 'Combos', icon: <Package className="h-5 w-5" />, path: '/combos' },
    { name: 'Monitores', icon: <Users className="h-5 w-5" />, path: '/usuarios' },
    { name: 'Checklist', icon: <CheckSquare className="h-5 w-5" />, path: '/checklist' },
    { name: 'Pagamentos', icon: <DollarSign className="h-5 w-5" />, path: '/pagamentos' },
    { name: 'Relatórios', icon: <BarChart2 className="h-5 w-5" />, path: '/relatorios' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className={`bg-purple-600 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} min-h-screen flex flex-col z-40`}>
      <div className="flex items-center justify-between p-4 border-b border-purple-500">
        <div className="flex items-center">
          <img 
            src="/assets/FG.jpg" 
            alt="FG Logo" 
            className="h-8 w-8 rounded-full object-cover"
          />
          {isOpen && (
            <h2 className="ml-3 text-lg font-bold">F&G</h2>
          )}
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md text-purple-200 hover:text-white hover:bg-purple-700 lg:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-purple-700 text-white'
                  : 'text-purple-100 hover:bg-purple-700 hover:text-white'
              }`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {isOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-purple-500">
        <div className="flex items-center">
          {isOpen ? (
            <>
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-purple-800 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-200" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">F&G Diversão</p>
                <p className="text-xs text-purple-200">© 2025</p>
              </div>
            </>
          ) : (
            <div className="h-8 w-8 rounded-full bg-purple-800 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-200" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
