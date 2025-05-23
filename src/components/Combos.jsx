import React, { useState } from 'react';
import { Package, Tag, Plus, Search } from 'lucide-react';

const Combos = () => {
  const [combos, setCombos] = useState([
    { 
      id: 1, 
      nome: 'Combo Festa Completa', 
      descricao: 'Pula-pula grande, Totó, Área baby completa, Crepe e Algodão doce',
      brinquedos: ['Pula-pula grande', 'Totó', 'Área baby completa'],
      comidas: ['Crepe', 'Algodão doce'],
      monitores: 2,
      valor: 1500
    },
    { 
      id: 2, 
      nome: 'Combo Brinquedos', 
      descricao: 'Pula-pula grande, Totó e Gangorra',
      brinquedos: ['Pula-pula grande', 'Totó', 'Gangorra'],
      comidas: [],
      monitores: 1,
      valor: 800
    },
    { 
      id: 3, 
      nome: 'Combo Comidas', 
      descricao: 'Crepe, Pipoca, Algodão doce e Fondue de chocolate',
      brinquedos: [],
      comidas: ['Crepe', 'Pipoca', 'Algodão doce', 'Fondue de chocolate'],
      monitores: 1,
      valor: 900
    },
    { 
      id: 4, 
      nome: 'Combo Corporativo Premium', 
      descricao: 'Totó (2 unidades), Pula-pula grande, Crepe, Pipoca, Fondue de chocolate e frutas',
      brinquedos: ['Totó (2 unidades)', 'Pula-pula grande'],
      comidas: ['Crepe', 'Pipoca', 'Fondue de chocolate e frutas'],
      monitores: 4,
      valor: 3500
    },
  ]);

  const [modalAberto, setModalAberto] = useState(false);
  const [comboAtual, setComboAtual] = useState(null);
  const [filtro, setFiltro] = useState('');

  const abrirModal = (combo = null) => {
    setComboAtual(combo);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setComboAtual(null);
  };

  const filtrarCombos = () => {
    if (!filtro) return combos;
    return combos.filter(combo => 
      combo.nome.toLowerCase().includes(filtro.toLowerCase()) || 
      combo.descricao.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      {/* Marca d'água com logo FG */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-10">
        <div className="w-1/2 h-1/2 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/assets/FG.jpg')" }}></div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestão de Combos</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar combos..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <button 
            onClick={() => abrirModal()}
            className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Combo
          </button>
        </div>
      </div>
      
      {/* Lista de combos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrarCombos().map((combo) => (
          <div 
            key={combo.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{combo.nome}</h3>
                  <p className="text-sm text-gray-600 mt-1">{combo.descricao}</p>
                </div>
                <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  R$ {combo.valor.toFixed(2)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Package className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Brinquedos:</p>
                    <p className="text-sm text-gray-600">
                      {combo.brinquedos.length > 0 
                        ? combo.brinquedos.join(', ') 
                        : 'Nenhum brinquedo incluído'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Comidas:</p>
                    <p className="text-sm text-gray-600">
                      {combo.comidas.length > 0 
                        ? combo.comidas.join(', ') 
                        : 'Nenhuma comida incluída'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {combo.monitores} {combo.monitores === 1 ? 'monitor' : 'monitores'}
                  </div>
                </div>
              </div>
              
              <div className="mt-5 flex justify-end">
                <button 
                  onClick={() => abrirModal(combo)}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal de Cadastro/Edição */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {comboAtual ? 'Editar Combo' : 'Novo Combo'}
                </h2>
                <button onClick={fecharModal} className="text-gray-500 hover:text-gray-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Combo
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue={comboAtual?.nome || ''}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-20"
                    defaultValue={comboAtual?.descricao || ''}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      defaultValue={comboAtual?.valor || ''}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade de Monitores
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      defaultValue={comboAtual?.monitores || '1'}
                      min="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brinquedos Incluídos
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 h-40 overflow-y-auto">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="pula-pula-g" className="mr-2" />
                        <label htmlFor="pula-pula-g" className="text-sm">Pula-pula grande</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="pula-pula-p" className="mr-2" />
                        <label htmlFor="pula-pula-p" className="text-sm">Pula-pula pequeno</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="toto" className="mr-2" />
                        <label htmlFor="toto" className="text-sm">Totó</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="area-baby" className="mr-2" />
                        <label htmlFor="area-baby" className="text-sm">Área baby completa</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="gangorra" className="mr-2" />
                        <label htmlFor="gangorra" className="text-sm">Gangorra</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="escorregador" className="mr-2" />
                        <label htmlFor="escorregador" className="text-sm">Escorregador</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="casa-bolinhas" className="mr-2" />
                        <label htmlFor="casa-bolinhas" className="text-sm">Casa de bolinhas</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estações de Comida Incluídas
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 h-40 overflow-y-auto">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="crepe" className="mr-2" />
                        <label htmlFor="crepe" className="text-sm">Crepe</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="pipoca" className="mr-2" />
                        <label htmlFor="pipoca" className="text-sm">Pipoca</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="fondue" className="mr-2" />
                        <label htmlFor="fondue" className="text-sm">Fondue de chocolate e frutas</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="algodao" className="mr-2" />
                        <label htmlFor="algodao" className="text-sm">Algodão doce</label>
                      </div>
                    </div>
                  </div>
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
                    {comboAtual ? 'Atualizar' : 'Cadastrar'}
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

export default Combos;
