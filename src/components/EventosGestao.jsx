import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { Package, Trash2, Edit, Check, X, Calendar, DollarSign, Users, Plus, Tag } from 'lucide-react';

const EventosGestao = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoAtual, setEventoAtual] = useState(null);
  const [detalhesAberto, setDetalhesAberto] = useState(null);
  const [modoCadastro, setModoCadastro] = useState('individual'); // 'individual' ou 'combo'
  const [combosSelecionados, setCombosSelecionados] = useState([]);
  const [combosDisponiveis, setCombosDisponiveis] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarEventos();
    carregarCombos();
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
      
      setEventos(eventosData);
      setErro(null);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      setErro("Falha ao carregar a lista de eventos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const carregarCombos = async () => {
    try {
      const combosRef = collection(db, 'combos');
      const snapshot = await getDocs(combosRef);
      
      const combosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setCombosDisponiveis(combosData.length > 0 ? combosData : [
        { 
          id: 'combo1', 
          nome: 'Combo Festa Completa', 
          descricao: 'Pula-pula grande, Totó, Área baby completa, Crepe e Algodão doce',
          brinquedos: ['Pula-pula grande', 'Totó', 'Área baby completa'],
          comidas: ['Crepe', 'Algodão doce'],
          monitores: 2,
          valor: 1500
        },
        { 
          id: 'combo2', 
          nome: 'Combo Brinquedos', 
          descricao: 'Pula-pula grande, Totó e Gangorra',
          brinquedos: ['Pula-pula grande', 'Totó', 'Gangorra'],
          comidas: [],
          monitores: 1,
          valor: 800
        },
        { 
          id: 'combo3', 
          nome: 'Combo Comidas', 
          descricao: 'Crepe, Pipoca, Algodão doce e Fondue de chocolate',
          brinquedos: [],
          comidas: ['Crepe', 'Pipoca', 'Algodão doce', 'Fondue de chocolate'],
          monitores: 1,
          valor: 900
        },
        { 
          id: 'combo4', 
          nome: 'Combo Corporativo Premium', 
          descricao: 'Totó (2 unidades), Pula-pula grande, Crepe, Pipoca, Fondue de chocolate e frutas',
          brinquedos: ['Totó (2 unidades)', 'Pula-pula grande'],
          comidas: ['Crepe', 'Pipoca', 'Fondue de chocolate e frutas'],
          monitores: 4,
          valor: 3500
        },
      ]);
    } catch (error) {
      console.error("Erro ao carregar combos:", error);
    }
  };

  const filtrarEventos = () => {
    if (filtroStatus === 'todos') return eventos;
    return eventos.filter(evento => evento.status === filtroStatus);
  };

  const abrirModal = (evento = null) => {
    setEventoAtual(evento);
    setModoCadastro('individual');
    setCombosSelecionados(evento?.combos || []);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEventoAtual(null);
    setModoCadastro('individual');
    setCombosSelecionados([]);
  };

  const toggleDetalhes = (id) => {
    if (detalhesAberto === id) {
      setDetalhesAberto(null);
    } else {
      setDetalhesAberto(id);
    }
  };

  const handleComboChange = (comboId) => {
    if (combosSelecionados.includes(comboId)) {
      setCombosSelecionados(combosSelecionados.filter(id => id !== comboId));
    } else {
      setCombosSelecionados([...combosSelecionados, comboId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Obter brinquedos selecionados
    const brinquedosSelecionados = [];
    document.querySelectorAll('input[name^="brinquedos-"]:checked').forEach(checkbox => {
      brinquedosSelecionados.push(checkbox.nextElementSibling.textContent.trim());
    });
    
    // Obter comidas selecionadas
    const comidasSelecionadas = [];
    document.querySelectorAll('input[name^="comidas-"]:checked').forEach(checkbox => {
      comidasSelecionadas.push(checkbox.nextElementSibling.textContent.trim());
    });
    
    // Obter monitores selecionados
    const monitoresSelecionados = [];
    document.querySelectorAll('input[name^="monitor-"]:checked').forEach(checkbox => {
      monitoresSelecionados.push(checkbox.nextElementSibling.textContent.trim());
    });
    
    // Obter combos selecionados
    const combosSelecionadosNomes = combosSelecionados.map(comboId => {
      const combo = combosDisponiveis.find(c => c.id === comboId);
      return combo ? combo.nome : '';
    }).filter(nome => nome !== '');
    
    const novoEvento = {
      cliente: formData.get('cliente'),
      data: formData.get('data'),
      horario: formData.get('horario'),
      local: formData.get('local'),
      status: formData.get('status'),
      brinquedos: brinquedosSelecionados,
      comidas: comidasSelecionadas,
      combos: combosSelecionadosNomes,
      monitores: monitoresSelecionados,
      valorTotal: parseFloat(formData.get('valorTotal')) || 0,
      valorPago: parseFloat(formData.get('valorPago')) || 0,
      observacoes: formData.get('observacoes') || ''
    };
    
    try {
      if (eventoAtual?.id) {
        // Atualizar evento existente
        await updateDoc(doc(db, 'eventos', eventoAtual.id), novoEvento);
      } else {
        // Adicionar novo evento
        await addDoc(collection(db, 'eventos'), novoEvento);
      }
      
      fecharModal();
      carregarEventos();
      setErro(null);
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      setErro("Falha ao salvar evento. Verifique os dados e tente novamente.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
      try {
        await deleteDoc(doc(db, 'eventos', id));
        carregarEventos();
        setErro(null);
      } catch (error) {
        console.error("Erro ao excluir evento:", error);
        setErro("Falha ao excluir evento. Tente novamente.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Marca d'água com logo FG */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-10">
        <div className="w-1/2 h-1/2 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/assets/FG.jpg')" }}></div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestão de Eventos</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex">
            <button 
              onClick={() => setFiltroStatus('todos')}
              className={`px-3 py-1 text-sm rounded-l-md ${filtroStatus === 'todos' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFiltroStatus('confirmado')}
              className={`px-3 py-1 text-sm ${filtroStatus === 'confirmado' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Confirmados
            </button>
            <button 
              onClick={() => setFiltroStatus('pendente')}
              className={`px-3 py-1 text-sm rounded-r-md ${filtroStatus === 'pendente' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Pendentes
            </button>
          </div>
          <button 
            onClick={() => abrirModal()}
            className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </button>
        </div>
      </div>
      
      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{erro}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setErro(null)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Lista de eventos */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtrarEventos().length > 0 ? (
                  filtrarEventos().map((evento) => (
                    <React.Fragment key={evento.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{evento.cliente}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {evento.data && new Date(evento.data).toLocaleDateString('pt-BR')} às {evento.horario}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{evento.local}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            evento.status === 'confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {evento.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">R$ {evento.valorTotal?.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">
                            Pago: R$ {evento.valorPago?.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => toggleDetalhes(evento.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {detalhesAberto === evento.id ? 'Ocultar' : 'Detalhes'}
                            </button>
                            <button 
                              onClick={() => abrirModal(evento)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(evento.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Linha de detalhes expandida */}
                      {detalhesAberto === evento.id && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            {evento.combos && evento.combos.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                  <Tag className="h-4 w-4 mr-1" /> Combos Selecionados
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                  {evento.combos.map((combo, idx) => (
                                    <li key={idx} className="font-medium text-purple-700">{combo}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {evento.brinquedos && evento.brinquedos.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                    <Package className="h-4 w-4 mr-1" /> Brinquedos
                                  </h4>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {evento.brinquedos.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {evento.comidas && evento.comidas.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1" /> Estações de Comida
                                  </h4>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {evento.comidas.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {evento.monitores && evento.monitores.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                    <Users className="h-4 w-4 mr-1" /> Monitores
                                  </h4>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {evento.monitores.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            
                            {evento.observacoes && (
                              <div className="mt-3">
                                <h4 className="font-medium text-gray-700 mb-1">Observações:</h4>
                                <p className="text-sm text-gray-600">{evento.observacoes}</p>
                              </div>
                            )}
                            
                            <div className="mt-3 flex justify-end">
                              <button className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                                Gerar Checklist
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum evento encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Modal de Cadastro/Edição */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {eventoAtual?.id ? 'Editar Evento' : 'Novo Evento'}
                </h2>
                <button onClick={fecharModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
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
                      defaultValue={eventoAtual?.data || ''}
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
                
                {/* Seleção de modo: Individual ou Combo */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex space-x-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setModoCadastro('individual')}
                      className={`px-4 py-2 rounded-md ${
                        modoCadastro === 'individual' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Seleção Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => setModoCadastro('combo')}
                      className={`px-4 py-2 rounded-md ${
                        modoCadastro === 'combo' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Seleção por Combos
                    </button>
                  </div>
                </div>
                
                {modoCadastro === 'combo' ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700">Combos Disponíveis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {combosDisponiveis.map((combo) => (
                        <div 
                          key={combo.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            combosSelecionados.includes(combo.id) 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handleComboChange(combo.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{combo.nome}</h4>
                              <p className="text-sm text-gray-600 mt-1">{combo.descricao}</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-green-600 font-medium mr-3">
                                R$ {combo.valor.toFixed(2)}
                              </span>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                combosSelecionados.includes(combo.id) 
                                  ? 'bg-green-500 text-white' 
                                  : 'border border-gray-300'
                              }`}>
                                {combosSelecionados.includes(combo.id) && <Check className="h-4 w-4" />}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Package className="h-3 w-3 mr-1" />
                              <span>{combo.brinquedos.length} brinquedos</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <DollarSign className="h-3 w-3 mr-1" />
                              <span>{combo.comidas.length} estações de comida</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{combo.monitores} monitores</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brinquedos
                      </label>
                      <div className="border border-gray-300 rounded-md p-3 h-40 overflow-y-auto">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="pula-pula-g" 
                              name="brinquedos-1" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.brinquedos?.includes('Pula-pula grande')}
                            />
                            <label htmlFor="pula-pula-g" className="text-sm">Pula-pula grande</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="pula-pula-p" 
                              name="brinquedos-2" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.brinquedos?.includes('Pula-pula pequeno')}
                            />
                            <label htmlFor="pula-pula-p" className="text-sm">Pula-pula pequeno</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="toto" 
                              name="brinquedos-3" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.brinquedos?.includes('Totó')}
                            />
                            <label htmlFor="toto" className="text-sm">Totó</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="area-baby" 
                              name="brinquedos-4" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.brinquedos?.includes('Área baby completa')}
                            />
                            <label htmlFor="area-baby" className="text-sm">Área baby completa</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="gangorra" 
                              name="brinquedos-5" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.brinquedos?.includes('Gangorra')}
                            />
                            <label htmlFor="gangorra" className="text-sm">Gangorra</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="escorregador" 
                              name="brinquedos-6" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.brinquedos?.includes('Escorregador')}
                            />
                            <label htmlFor="escorregador" className="text-sm">Escorregador</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="casa-bolinhas" 
                              name="brinquedos-7" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.brinquedos?.includes('Casa de bolinhas')}
                            />
                            <label htmlFor="casa-bolinhas" className="text-sm">Casa de bolinhas</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estações de Comida
                      </label>
                      <div className="border border-gray-300 rounded-md p-3 h-40 overflow-y-auto">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="crepe" 
                              name="comidas-1" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.comidas?.includes('Crepe')}
                            />
                            <label htmlFor="crepe" className="text-sm">Crepe</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="pipoca" 
                              name="comidas-2" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.comidas?.includes('Pipoca')}
                            />
                            <label htmlFor="pipoca" className="text-sm">Pipoca</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="fondue" 
                              name="comidas-3" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.comidas?.includes('Fondue de chocolate e frutas')}
                            />
                            <label htmlFor="fondue" className="text-sm">Fondue de chocolate e frutas</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="algodao" 
                              name="comidas-4" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.comidas?.includes('Algodão doce')}
                            />
                            <label htmlFor="algodao" className="text-sm">Algodão doce</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monitores
                      </label>
                      <div className="border border-gray-300 rounded-md p-3 h-40 overflow-y-auto">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="monitor-joao" 
                              name="monitor-1" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.monitores?.includes('João')}
                            />
                            <label htmlFor="monitor-joao" className="text-sm">João</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="monitor-ana" 
                              name="monitor-2" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.monitores?.includes('Ana')}
                            />
                            <label htmlFor="monitor-ana" className="text-sm">Ana</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="monitor-pedro" 
                              name="monitor-3" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.monitores?.includes('Pedro')}
                            />
                            <label htmlFor="monitor-pedro" className="text-sm">Pedro</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="monitor-carla" 
                              name="monitor-4" 
                              className="mr-2"
                              defaultChecked={eventoAtual?.monitores?.includes('Carla')}
                            />
                            <label htmlFor="monitor-carla" className="text-sm">Carla</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
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

export default EventosGestao;
