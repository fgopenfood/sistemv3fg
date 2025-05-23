import React, { useState } from 'react';
import { BarChart2, Download, FileText, Calendar, DollarSign, PieChart } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const Relatorios = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');
  const [tipoRelatorio, setTipoRelatorio] = useState('financeiro');
  
  // Dados de exemplo para os gráficos
  const dadosFinanceiros = [
    { mes: 'Jan', receita: 12500, despesas: 8200, lucro: 4300 },
    { mes: 'Fev', receita: 15000, despesas: 9500, lucro: 5500 },
    { mes: 'Mar', receita: 18000, despesas: 10200, lucro: 7800 },
    { mes: 'Abr', receita: 16500, despesas: 9800, lucro: 6700 },
    { mes: 'Mai', receita: 21000, despesas: 12000, lucro: 9000 },
    { mes: 'Jun', receita: 19500, despesas: 11500, lucro: 8000 },
  ];
  
  const dadosEventos = [
    { mes: 'Jan', quantidade: 8 },
    { mes: 'Fev', quantidade: 12 },
    { mes: 'Mar', quantidade: 15 },
    { mes: 'Abr', quantidade: 10 },
    { mes: 'Mai', quantidade: 18 },
    { mes: 'Jun', quantidade: 14 },
  ];
  
  const dadosCombos = [
    { nome: 'Combo Festa Completa', valor: 45 },
    { nome: 'Combo Brinquedos', valor: 25 },
    { nome: 'Combo Comidas', valor: 15 },
    { nome: 'Personalizado', valor: 15 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const renderRelatorioFinanceiro = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Receita x Despesas</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosFinanceiros}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Bar dataKey="receita" name="Receita" fill="#4ade80" />
              <Bar dataKey="despesas" name="Despesas" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Lucro Mensal</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dadosFinanceiros}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Line type="monotone" dataKey="lucro" name="Lucro" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Resumo Financeiro</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-gray-500">Receita Total</p>
            <p className="text-2xl font-semibold text-green-600">
              R$ {dadosFinanceiros.reduce((acc, item) => acc + item.receita, 0).toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-green-600 mt-2">
              +15% em relação ao período anterior
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <p className="text-sm text-gray-500">Despesas Totais</p>
            <p className="text-2xl font-semibold text-red-600">
              R$ {dadosFinanceiros.reduce((acc, item) => acc + item.despesas, 0).toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-red-600 mt-2">
              +8% em relação ao período anterior
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-500">Lucro Total</p>
            <p className="text-2xl font-semibold text-blue-600">
              R$ {dadosFinanceiros.reduce((acc, item) => acc + item.lucro, 0).toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              +22% em relação ao período anterior
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderRelatorioEventos = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Quantidade de Eventos por Mês</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosEventos}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" name="Eventos" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Combos Mais Contratados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={dadosCombos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dadosCombos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Detalhamento</h4>
            <div className="space-y-4">
              {dadosCombos.map((combo, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-gray-700">{combo.nome}</span>
                  </div>
                  <span className="text-sm font-medium">{combo.valor}%</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">Análise</h4>
              <p className="text-sm text-gray-600">
                O combo "Festa Completa" continua sendo o mais popular, representando 45% das contratações.
                Houve um aumento de 5% na escolha de combos personalizados em relação ao período anterior.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Resumo de Eventos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-500">Total de Eventos</p>
            <p className="text-2xl font-semibold text-blue-600">
              {dadosEventos.reduce((acc, item) => acc + item.quantidade, 0)}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              +12% em relação ao período anterior
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-gray-500">Média Mensal</p>
            <p className="text-2xl font-semibold text-green-600">
              {Math.round(dadosEventos.reduce((acc, item) => acc + item.quantidade, 0) / dadosEventos.length)}
            </p>
            <p className="text-xs text-green-600 mt-2">
              +2 eventos em relação ao período anterior
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p className="text-sm text-gray-500">Mês com Mais Eventos</p>
            <p className="text-2xl font-semibold text-purple-600">
              {dadosEventos.reduce((max, item) => item.quantidade > max.quantidade ? item : max, dadosEventos[0]).mes}
            </p>
            <p className="text-xs text-purple-600 mt-2">
              Com {dadosEventos.reduce((max, item) => item.quantidade > max.quantidade ? item : max, dadosEventos[0]).quantidade} eventos
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Marca d'água com logo FG */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-5">
        <div className="w-1/2 h-1/2 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/assets/FG.jpg')" }}></div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Relatórios e Estatísticas</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex">
            <button 
              onClick={() => setPeriodoSelecionado('mes')}
              className={`px-3 py-1 text-sm rounded-l-md ${periodoSelecionado === 'mes' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Mensal
            </button>
            <button 
              onClick={() => setPeriodoSelecionado('trimestre')}
              className={`px-3 py-1 text-sm ${periodoSelecionado === 'trimestre' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Trimestral
            </button>
            <button 
              onClick={() => setPeriodoSelecionado('ano')}
              className={`px-3 py-1 text-sm rounded-r-md ${periodoSelecionado === 'ano' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Anual
            </button>
          </div>
          
          <div className="flex">
            <button 
              onClick={() => setTipoRelatorio('financeiro')}
              className={`px-3 py-1 text-sm rounded-l-md flex items-center ${tipoRelatorio === 'financeiro' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              <DollarSign className="h-4 w-4 mr-1" /> Financeiro
            </button>
            <button 
              onClick={() => setTipoRelatorio('eventos')}
              className={`px-3 py-1 text-sm rounded-r-md flex items-center ${tipoRelatorio === 'eventos' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              <Calendar className="h-4 w-4 mr-1" /> Eventos
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            {tipoRelatorio === 'financeiro' ? (
              <>
                <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                Relatório Financeiro - {periodoSelecionado === 'mes' ? 'Mensal' : periodoSelecionado === 'trimestre' ? 'Trimestral' : 'Anual'}
              </>
            ) : (
              <>
                <PieChart className="h-5 w-5 mr-2 text-blue-500" />
                Relatório de Eventos - {periodoSelecionado === 'mes' ? 'Mensal' : periodoSelecionado === 'trimestre' ? 'Trimestral' : 'Anual'}
              </>
            )}
          </h2>
          
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </button>
            <button className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              <Download className="h-4 w-4 mr-1" />
              Excel
            </button>
          </div>
        </div>
        
        {tipoRelatorio === 'financeiro' ? renderRelatorioFinanceiro() : renderRelatorioEventos()}
      </div>
    </div>
  );
};

export default Relatorios;
