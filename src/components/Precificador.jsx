import React, { useState } from 'react';
import { Calculator, DollarSign, Users, Package, PieChart, ArrowRight, Check } from 'lucide-react';

const Precificador = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pessoas: 50,
    duracao: 4,
    brinquedos: [],
    comidas: [],
    monitores: 2,
    distancia: 10,
    combos: []
  });
  const [resultado, setResultado] = useState(null);

  // Opções disponíveis
  const brinquedosDisponiveis = [
    { id: 1, nome: 'Pula-pula grande', valor: 300, capacidade: 4 },
    { id: 2, nome: 'Pula-pula pequeno', valor: 200, capacidade: 2 },
    { id: 3, nome: 'Totó', valor: 150, capacidade: 4 },
    { id: 4, nome: 'Área baby completa', valor: 350, capacidade: 8 },
    { id: 5, nome: 'Gangorra', valor: 100, capacidade: 2 },
    { id: 6, nome: 'Escorregador', valor: 120, capacidade: 1 },
    { id: 7, nome: 'Casa de bolinhas', valor: 250, capacidade: 6 }
  ];

  const comidasDisponiveis = [
    { id: 1, nome: 'Crepe', valor: 300, rendimento: 50 },
    { id: 2, nome: 'Pipoca', valor: 200, rendimento: 100 },
    { id: 3, nome: 'Fondue de chocolate e frutas', valor: 400, rendimento: 40 },
    { id: 4, nome: 'Algodão doce', valor: 250, rendimento: 80 }
  ];

  const combosDisponiveis = [
    { 
      id: 1, 
      nome: 'Combo Festa Completa', 
      descricao: 'Pula-pula grande, Totó, Área baby completa, Crepe e Algodão doce',
      brinquedos: [1, 3, 4],
      comidas: [1, 4],
      monitores: 2,
      valor: 1500,
      desconto: 0.15 // 15% de desconto em relação aos itens individuais
    },
    { 
      id: 2, 
      nome: 'Combo Brinquedos', 
      descricao: 'Pula-pula grande, Totó e Gangorra',
      brinquedos: [1, 3, 5],
      comidas: [],
      monitores: 1,
      valor: 800,
      desconto: 0.10 // 10% de desconto
    },
    { 
      id: 3, 
      nome: 'Combo Comidas', 
      descricao: 'Crepe, Pipoca, Algodão doce e Fondue de chocolate',
      brinquedos: [],
      comidas: [1, 2, 3, 4],
      monitores: 1,
      valor: 900,
      desconto: 0.12 // 12% de desconto
    }
  ];

  // Manipuladores de eventos
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const id = parseInt(name.split('-')[1]);
      const category = name.split('-')[0];
      
      if (checked) {
        setFormData({
          ...formData,
          [category]: [...formData[category], id]
        });
      } else {
        setFormData({
          ...formData,
          [category]: formData[category].filter(item => item !== id)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseInt(value) : value
      });
    }
  };

  const handleComboChange = (comboId) => {
    if (formData.combos.includes(comboId)) {
      setFormData({
        ...formData,
        combos: formData.combos.filter(id => id !== comboId)
      });
    } else {
      setFormData({
        ...formData,
        combos: [...formData.combos, comboId]
      });
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const calcularPreco = () => {
    // Cálculo base para monitores
    const valorMonitores = formData.monitores * 150;
    
    // Cálculo para brinquedos selecionados individualmente
    const brinquedosSelecionados = brinquedosDisponiveis.filter(item => 
      formData.brinquedos.includes(item.id)
    );
    const valorBrinquedos = brinquedosSelecionados.reduce((total, item) => total + item.valor, 0);
    
    // Cálculo para comidas selecionadas individualmente
    const comidasSelecionadas = comidasDisponiveis.filter(item => 
      formData.comidas.includes(item.id)
    );
    const valorComidas = comidasSelecionadas.reduce((total, item) => total + item.valor, 0);
    
    // Cálculo para combos selecionados
    const combosSelecionados = combosDisponiveis.filter(item => 
      formData.combos.includes(item.id)
    );
    const valorCombos = combosSelecionados.reduce((total, item) => total + item.valor, 0);
    
    // Cálculo de taxa de distância (R$ 2 por km)
    const taxaDistancia = formData.distancia * 2;
    
    // Cálculo de horas extras (após 4 horas, cada hora adicional é 10% do valor base)
    const horasExtras = Math.max(0, formData.duracao - 4);
    const valorBase = valorMonitores + valorBrinquedos + valorComidas + valorCombos;
    const taxaHorasExtras = horasExtras * (valorBase * 0.1);
    
    // Cálculo do valor total
    const valorTotal = valorBase + taxaDistancia + taxaHorasExtras;
    
    // Cálculo de sugestões de preço
    const precoMinimo = Math.round(valorTotal * 0.9);
    const precoSugerido = Math.round(valorTotal);
    const precoMaximo = Math.round(valorTotal * 1.2);
    
    setResultado({
      detalhamento: {
        monitores: valorMonitores,
        brinquedos: valorBrinquedos,
        comidas: valorComidas,
        combos: valorCombos,
        taxaDistancia,
        taxaHorasExtras
      },
      precoMinimo,
      precoSugerido,
      precoMaximo
    });
    
    nextStep();
  };

  const reiniciar = () => {
    setStep(1);
    setFormData({
      pessoas: 50,
      duracao: 4,
      brinquedos: [],
      comidas: [],
      monitores: 2,
      distancia: 10,
      combos: []
    });
    setResultado(null);
  };

  // Renderização dos passos
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Informações Básicas do Evento</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade de pessoas
                </label>
                <input
                  type="number"
                  name="pessoas"
                  min="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.pessoas}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duração do evento (horas)
                </label>
                <input
                  type="number"
                  name="duracao"
                  min="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.duracao}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade de monitores
                </label>
                <input
                  type="number"
                  name="monitores"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.monitores}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distância (km)
                </label>
                <input
                  type="number"
                  name="distancia"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.distancia}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
              >
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Selecione os Combos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {combosDisponiveis.map((combo) => (
                <div 
                  key={combo.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.combos.includes(combo.id) 
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
                        formData.combos.includes(combo.id) 
                          ? 'bg-green-500 text-white' 
                          : 'border border-gray-300'
                      }`}>
                        {formData.combos.includes(combo.id) && <Check className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Package className="h-3 w-3 mr-1" />
                      <span>{combo.brinquedos.length} brinquedos</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <PieChart className="h-3 w-3 mr-1" />
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
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-700">
              <p>Selecionar combos oferece descontos em relação à seleção individual de itens.</p>
              <p className="mt-1">Você também pode selecionar itens individualmente no próximo passo.</p>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
              >
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Selecione Itens Individuais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Brinquedos</h3>
                <div className="border border-gray-200 rounded-md p-4 space-y-3 max-h-80 overflow-y-auto">
                  {brinquedosDisponiveis.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`brinquedo-${item.id}`}
                          name={`brinquedos-${item.id}`}
                          checked={formData.brinquedos.includes(item.id)}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`brinquedo-${item.id}`} className="ml-2 text-sm text-gray-700">
                          {item.nome}
                        </label>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        R$ {item.valor.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Estações de Comida</h3>
                <div className="border border-gray-200 rounded-md p-4 space-y-3 max-h-80 overflow-y-auto">
                  {comidasDisponiveis.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`comida-${item.id}`}
                          name={`comidas-${item.id}`}
                          checked={formData.comidas.includes(item.id)}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`comida-${item.id}`} className="ml-2 text-sm text-gray-700">
                          {item.nome}
                        </label>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        R$ {item.valor.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={calcularPreco}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
              >
                Calcular Preço
                <Calculator className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Resultado do Cálculo</h2>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Sugestão de Preço</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Baseado nos itens selecionados e parâmetros do evento
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="text-3xl font-bold text-green-600">
                      R$ {resultado.precoSugerido.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500">Preço Mínimo</div>
                    <div className="text-xl font-semibold text-gray-800 mt-1">
                      R$ {resultado.precoMinimo.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md border border-green-100">
                    <div className="text-sm text-green-600">Preço Sugerido</div>
                    <div className="text-xl font-semibold text-green-700 mt-1">
                      R$ {resultado.precoSugerido.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500">Preço Máximo</div>
                    <div className="text-xl font-semibold text-gray-800 mt-1">
                      R$ {resultado.precoMaximo.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Detalhamento dos Custos</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monitores ({formData.monitores})</span>
                      <span className="font-medium">R$ {resultado.detalhamento.monitores.toFixed(2)}</span>
                    </div>
                    {resultado.detalhamento.brinquedos > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Brinquedos ({formData.brinquedos.length})</span>
                        <span className="font-medium">R$ {resultado.detalhamento.brinquedos.toFixed(2)}</span>
                      </div>
                    )}
                    {resultado.detalhamento.comidas > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Estações de Comida ({formData.comidas.length})</span>
                        <span className="font-medium">R$ {resultado.detalhamento.comidas.toFixed(2)}</span>
                      </div>
                    )}
                    {resultado.detalhamento.combos > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Combos ({formData.combos.length})</span>
                        <span className="font-medium">R$ {resultado.detalhamento.combos.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxa de Distância ({formData.distancia} km)</span>
                      <span className="font-medium">R$ {resultado.detalhamento.taxaDistancia.toFixed(2)}</span>
                    </div>
                    {resultado.detalhamento.taxaHorasExtras > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Horas Extras ({formData.duracao - 4} horas)</span>
                        <span className="font-medium">R$ {resultado.detalhamento.taxaHorasExtras.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">R$ {resultado.precoSugerido.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-700">
                  <p>Esta é uma sugestão de preço baseada nos parâmetros informados.</p>
                  <p className="mt-1">Você pode ajustar o valor final de acordo com a negociação com o cliente.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Voltar
              </button>
              <div className="space-x-3">
                <button
                  onClick={reiniciar}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Novo Cálculo
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Criar Orçamento
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Marca d'água com logo FG */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-10">
        <div className="w-1/2 h-1/2 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/assets/FG.jpg')" }}></div>
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Precificador Automático</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* Indicador de progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`h-1 w-12 ${
                step > 1 ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <div className={`h-1 w-12 ${
                step > 2 ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <div className={`h-1 w-12 ${
                step > 3 ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 4 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }">
              4
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <div>Informações Básicas</div>
            <div>Combos</div>
            <div>Itens Individuais</div>
            <div>Resultado</div>
          </div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
};

export default Precificador;
