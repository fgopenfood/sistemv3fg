import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [period, setPeriod] = useState('month');

  // Dados de exemplo para os gráficos
  const revenueData = [
    { name: 'Jan', valor: 4000 },
    { name: 'Fev', valor: 3000 },
    { name: 'Mar', valor: 5000 },
    { name: 'Abr', valor: 4500 },
    { name: 'Mai', valor: 6000 },
    { name: 'Jun', valor: 5500 },
  ];

  const eventTypeData = [
    { name: 'Aniversários', value: 45 },
    { name: 'Festas Empresariais', value: 20 },
    { name: 'Eventos Escolares', value: 15 },
    { name: 'Outros', value: 20 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const upcomingEvents = [
    { id: 1, client: 'Maria Silva', date: '25/05/2025', location: 'Salão Festas ABC', status: 'confirmado' },
    { id: 2, client: 'João Pereira', date: '28/05/2025', location: 'Residência Cliente', status: 'pendente' },
    { id: 3, client: 'Empresa XYZ', date: '01/06/2025', location: 'Sede Corporativa', status: 'confirmado' },
  ];

  const stats = [
    { title: 'Eventos este mês', value: '12', change: '+20%', changeType: 'positive' },
    { title: 'Receita mensal', value: 'R$ 15.800', change: '+15%', changeType: 'positive' },
    { title: 'Novos clientes', value: '8', change: '+5%', changeType: 'positive' },
    { title: 'Taxa de ocupação', value: '85%', change: '-2%', changeType: 'negative' },
  ];

  return (
    <div className="space-y-6">
      {/* Marca d'água com logo FG */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-5">
        <div className="w-1/2 h-1/2 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/assets/FG.jpg')" }}></div>
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriod('week')}
            className={`px-3 py-1 text-sm rounded-md ${period === 'week' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Semana
          </button>
          <button 
            onClick={() => setPeriod('month')}
            className={`px-3 py-1 text-sm rounded-md ${period === 'month' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Mês
          </button>
          <button 
            onClick={() => setPeriod('year')}
            className={`px-3 py-1 text-sm rounded-md ${period === 'year' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Ano
          </button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{stat.title}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium mb-4">Receita Mensal</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
                <Bar dataKey="valor" fill="#4ade80" name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium mb-4">Tipos de Eventos</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Próximos eventos */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Próximos Eventos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {upcomingEvents.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.status === 'confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
