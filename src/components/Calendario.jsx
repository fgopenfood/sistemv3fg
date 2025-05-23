import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, Search } from 'lucide-react';

const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoAtual, setEventoAtual] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    carregarEventos();
  }, []);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      const eventosRef = collection(db, 'eventos');
      const q = query(eventosRef, orderBy('data', 'asc'));
      const snapshot = await getDocs(q);
      
      const eventosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setEvents(eventosData);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funções para navegação no calendário
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Função para gerar os dias do mês atual
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Dias do mês anterior para preencher o início do calendário
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }
    
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Dias do próximo mês para preencher o final do calendário
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  // Função para verificar se um dia tem eventos
  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      // Verificar se o evento tem uma data e se ela corresponde à data fornecida
      return event.data && event.data.substring(0, 10) === dateString;
    });
  };

  // Função para formatar a data
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('pt-BR', options);
  };

  // Função para selecionar uma data
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const abrirModal = (evento = null) => {
    setEventoAtual(evento);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEventoAtual(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const novoEvento = {
      cliente: formData.get('cliente'),
      data: formData.get('data'),
      horario: formData.get('horario'),
      local: formData.get('local'),
      status: formData.get('status'),
      observacoes: formData.get('observacoes'),
      valorTotal: parseFloat(formData.get('valorTotal')),
      valorPago: parseFloat(formData.get('valorPago')),
      brinquedos: [],
      comidas: [],
      combos: [],
      monitores: []
    };
    
    try {
      if (eventoAtual) {
        // Atualizar evento existente
        await updateDoc(doc(db, 'eventos', eventoAtual.id), novoEvento);
      } else {
        // Adicionar novo evento
        await addDoc(collection(db, 'eventos'), novoEvento);
      }
      
      fecharModal();
      carregarEventos();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
    }
  };

  // Renderizar os dias da semana
  const renderWeekdays = () => {
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return (
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((day, index) => (
          <div 
            key={index} 
            className="text-center py-2 text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  // Renderizar os dias do mês
  const renderDays = () => {
    const days = getDaysInMonth();
    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          const isToday = day.date.toDateString() === new Date().toDateString();
          const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
          
          return (
            <div 
              key={index} 
              className={`min-h-[100px] p-1 border rounded-md transition-colors ${
                day.isCurrentMonth 
                  ? isToday 
                    ? 'bg-blue-50 border-blue-200' 
                    : isSelected 
                      ? 'bg-purple-50 border-purple-200' 
                      : 'bg-white border-gray-200'
                  : 'bg-gray-50 border-gray-100 text-gray-400'
              }`}
              onClick={() => handleDateClick(day.date)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium ${
                  isToday ? 'text-blue-600' : isSelected ? 'text-purple-600' : ''
                }`}>
                  {day.date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-xs bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {dayEvents.length}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event, idx) => (
                  <div 
                    key={idx} 
                    className={`text-xs p-1 rounded truncate ${
                      event.status === 'confirmado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                    title={`${event.cliente} - ${event.horario}`}
                  >
                    {event.horario} {event.cliente.substring(0, 10)}...
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayEvents.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizar detalhes do dia selecionado
  const renderSelectedDateDetails = () => {
    if (!selectedDate) return null;
    
    const dayEvents = getEventsForDate(selectedDate);
    const formattedDate = selectedDate.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return (
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Eventos para {formattedDate}
          </h3>
          
          <button 
            onClick={() => {
              const newEvent = {
                data: selectedDate.toISOString().split('T')[0]
              };
              abrirModal(newEvent);
            }}
            className="flex items-center px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo Evento
          </button>
        </div>
        
        {dayEvents.length === 0 ? (
          <p className="text-gray-500">Nenhum evento agendado para esta data.</p>
        ) : (
          <div className="space-y-3">
            {dayEvents.map((event) => (
              <div 
                key={event.id} 
                className={`p-3 rounded-md ${
                  event.status === 'confirmado' 
                    ? 'bg-green-50 border-l-4 border-green-500' 
                    : 'bg-yellow-50 border-l-4 border-yellow-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{event.cliente}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Horário:</span> {event.horario}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Local:</span> {event.local}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === 'confirmado' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                  </span>
                </div>
                <div className="mt-2 flex justify-end space-x-2">
                  <button 
                    onClick={() => abrirModal(event)}
                    className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Marca d'água com logo FG */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-10">
        <div className="w-1/2 h-1/2 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/assets/FG.jpg')" }}></div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Agenda e Calendário</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex">
            <button 
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded-l-md ${viewMode === 'month' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Mês
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm ${viewMode === 'week' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Semana
            </button>
            <button 
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-sm rounded-r-md ${viewMode === 'day' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Dia
            </button>
          </div>
          
          <button 
            onClick={goToToday}
            className="flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Hoje
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-gray-800">{formatDate(currentDate)}</h2>
            <div className="flex space-x-2">
              <button 
                onClick={prevMonth}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {renderWeekdays()}
          {renderDays()}
        </div>
      )}
      
      {renderSelectedDateDetails()}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Legenda</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-700">Evento confirmado</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm text-gray-700">Evento pendente</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-700">Hoje</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-sm text-gray-700">Data selecionada</span>
          </div>
        </div>
      </div>
      
      {/* Modal de Cadastro/Edição */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {eventoAtual?.id ? 'Editar Evento' : 'Novo Evento'}
                </h2>
                <button onClick={fecharModal} className="text-gray-500 hover:text-gray-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cliente
                    </label>
                    <input
                      type="text"
                      name="cliente"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      defaultValue={eventoAtual?.cliente || ''}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Local
                    </label>
                    <input
                      type="text"
                      name="local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      defaultValue={eventoAtual?.local || ''}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data
                    </label>
                    <input
                      type="date"
                      name="data"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      defaultValue={eventoAtual?.data || (selectedDate ? selectedDate.toISOString().split('T')[0] : '')}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário
                    </label>
                    <input
                      type="time"
                      name="horario"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      defaultValue={eventoAtual?.horario || ''}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      defaultValue={eventoAtual?.status || 'pendente'}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Total (R$)
                    </label>
                    <input
                      type="number"
                      name="valorTotal"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      defaultValue={eventoAtual?.valorTotal || '0.00'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Pago (R$)
                    </label>
                    <input
                      type="number"
                      name="valorPago"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      defaultValue={eventoAtual?.valorPago || '0.00'}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    name="observacoes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
                    defaultValue={eventoAtual?.observacoes || ''}
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={fecharModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    {eventoAtual?.id ? 'Atualizar' : 'Cadastrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
