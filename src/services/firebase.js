import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtytAFpYlxyRKK7-FkVE1HlyzIgyNLfVo",
  authDomain: "sistema-fg.firebaseapp.com",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Contexto de autenticação
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Serviços para eventos
export const eventosService = {
  // Obter todos os eventos
  getEventos: async () => {
    try {
      const eventosRef = collection(db, 'eventos');
      const q = query(eventosRef, orderBy('data', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      throw error;
    }
  },

  // Obter eventos por status
  getEventosPorStatus: async (status) => {
    try {
      const eventosRef = collection(db, 'eventos');
      const q = query(eventosRef, where('status', '==', status), orderBy('data', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Erro ao buscar eventos com status ${status}:`, error);
      throw error;
    }
  },

  // Adicionar novo evento
  addEvento: async (evento) => {
    try {
      const eventosRef = collection(db, 'eventos');
      const docRef = await addDoc(eventosRef, evento);
      return { id: docRef.id, ...evento };
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
      throw error;
    }
  },

  // Atualizar evento existente
  updateEvento: async (id, evento) => {
    try {
      const eventoRef = doc(db, 'eventos', id);
      await updateDoc(eventoRef, evento);
      return { id, ...evento };
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      throw error;
    }
  },

  // Excluir evento
  deleteEvento: async (id) => {
    try {
      const eventoRef = doc(db, 'eventos', id);
      await deleteDoc(eventoRef);
      return id;
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      throw error;
    }
  }
};

// Serviços para usuários/monitores
export const usuariosService = {
  // Obter todos os usuários/monitores
  getUsuarios: async () => {
    try {
      const usuariosRef = collection(db, 'usuarios');
      const snapshot = await getDocs(usuariosRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  },

  // Adicionar novo usuário/monitor
  addUsuario: async (usuario) => {
    try {
      // Criar usuário de autenticação se for necessário
      let uid = null;
      if (usuario.email && usuario.senha) {
        const userCredential = await createUserWithEmailAndPassword(auth, usuario.email, usuario.senha);
        uid = userCredential.user.uid;
        delete usuario.senha; // Não armazenar senha no Firestore
      }

      const usuariosRef = collection(db, 'usuarios');
      const docRef = await addDoc(usuariosRef, { ...usuario, uid });
      return { id: docRef.id, ...usuario, uid };
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      throw error;
    }
  },

  // Atualizar usuário/monitor existente
  updateUsuario: async (id, usuario) => {
    try {
      const usuarioRef = doc(db, 'usuarios', id);
      await updateDoc(usuarioRef, usuario);
      return { id, ...usuario };
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  },

  // Excluir usuário/monitor
  deleteUsuario: async (id) => {
    try {
      const usuarioRef = doc(db, 'usuarios', id);
      await deleteDoc(usuarioRef);
      return id;
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      throw error;
    }
  }
};

// Serviços para upload de imagens
export const imagensService = {
  // Upload de imagem
  uploadImagem: async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Erro ao fazer upload de imagem:", error);
      throw error;
    }
  },

  // Obter URL de imagem
  getImagemURL: async (path) => {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Erro ao obter URL da imagem:", error);
      throw error;
    }
  }
};

// Serviços para relatórios
export const relatoriosService = {
  // Obter dados para relatório financeiro
  getRelatorioFinanceiro: async (periodo) => {
    try {
      // Implementação real buscaria dados do Firestore com filtros de período
      // Esta é uma implementação de exemplo
      const eventosRef = collection(db, 'eventos');
      const snapshot = await getDocs(eventosRef);
      const eventos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Processar dados para o formato do relatório
      // Exemplo: agrupar por mês, calcular receitas, etc.
      
      return eventos;
    } catch (error) {
      console.error("Erro ao gerar relatório financeiro:", error);
      throw error;
    }
  },

  // Obter dados para relatório de eventos
  getRelatorioEventos: async (periodo) => {
    try {
      // Implementação similar ao relatório financeiro
      const eventosRef = collection(db, 'eventos');
      const snapshot = await getDocs(eventosRef);
      const eventos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      return eventos;
    } catch (error) {
      console.error("Erro ao gerar relatório de eventos:", error);
      throw error;
    }
  }
};

export default {
  app,
  db,
  auth,
  storage,
  eventosService,
  usuariosService,
  imagensService,
  relatoriosService
};
