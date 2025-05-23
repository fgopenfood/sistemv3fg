# Sistema de Gestão FG - Diversão e Open Food

Sistema completo para gerenciamento de locação de brinquedos, estações de comida e eventos para a empresa FG.

## Funcionalidades

- ✅ Interface gráfica moderna e totalmente responsiva
- ✅ Gestão completa de eventos/festas
- ✅ Agenda e calendário até 2030
- ✅ Precificador automático
- ✅ Gestão de combos personalizados
- ✅ Gestão de pagamentos
- ✅ Relatórios financeiros
- ✅ Painel administrativo
- ✅ Gerenciamento de freelancers (monitores)

## Requisitos

- Node.js 16+ 
- NPM ou Yarn

## Instalação

1. Descompacte o arquivo ZIP
2. Abra o terminal na pasta do projeto
3. Execute o comando para instalar as dependências:

```bash
npm install
```

ou

```bash
yarn install
```

## Execução em ambiente de desenvolvimento

```bash
npm run dev
```

ou

```bash
yarn dev
```

## Build para produção

```bash
npm run build
```

ou

```bash
yarn build
```

## Deploy

### Deploy na Netlify

#### Método 1: Deploy direto pelo site da Netlify

1. Acesse [netlify.com](https://www.netlify.com/) e faça login (ou crie uma conta gratuita)
2. Na dashboard, clique em "Add new site" > "Import an existing project"
3. Escolha seu provedor Git (GitHub, GitLab, Bitbucket) e autorize a Netlify
4. Selecione o repositório do projeto FG (caso tenha subido para o Git)
5. Configure as opções de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Clique em "Deploy site"

#### Método 2: Deploy usando a linha de comando (CLI)

1. Instale a CLI da Netlify globalmente:
   ```
   npm install -g netlify-cli
   ```

2. Faça login na sua conta Netlify:
   ```
   netlify login
   ```

3. Navegue até a pasta do projeto FG e execute o build:
   ```
   cd caminho/para/fg_sistema_melhorado
   npm run build
   ```

4. Inicie o deploy:
   ```
   netlify deploy
   ```

5. Siga as instruções na tela:
   - Escolha "Create & configure a new site"
   - Selecione seu time
   - Opcionalmente, defina um nome personalizado para o site
   - Quando perguntado pelo diretório de publicação, digite `dist`

6. Após verificar o preview, faça o deploy para produção:
   ```
   netlify deploy --prod
   ```

## Configuração do Firebase

O sistema já está configurado com as credenciais do Firebase fornecidas:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDtytAFpYlxyRKK7-FkVE1HlyzIgyNLfVo",
  authDomain: "sistema-fg.firebaseapp.com",
};
```

## Solução de problemas

### Erro de build relacionado ao TypeScript

Se encontrar erros relacionados ao TypeScript durante o build, você pode:

1. Modificar o arquivo `tsconfig.json` para remover a referência ao `tsconfig.node.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "useDefineForClassFields": true,
       "lib": ["ES2020", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "skipLibCheck": true,
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": true,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "noEmit": true,
       "jsx": "react-jsx",
       "strict": false,
       "noUnusedLocals": false,
       "noUnusedParameters": false,
       "noFallthroughCasesInSwitch": true,
       "allowJs": true,
       "esModuleInterop": true
     },
     "include": ["src"]
   }
   ```

2. Ou executar o build com a flag `--skipTypeCheck`:
   ```bash
   npm run build -- --skipTypeCheck
   ```

## Estrutura do Projeto

- `src/components/`: Componentes React
- `src/services/`: Serviços de integração (Firebase)
- `src/styles/`: Estilos globais
- `public/assets/`: Imagens e recursos estáticos

## Contato

Para suporte ou dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento.
