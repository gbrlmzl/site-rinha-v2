<div align="center">

# 🎮 Rinha do Campus IV — Site Oficial

> Site desenvolvido para auxiliar no gerenciamento do torneio de League of Legends **Rinha do Campus IV**, realizado por estudantes do Campus IV da UFPB.

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![MUI](https://img.shields.io/badge/MUI-7.3.8-007FFF?style=for-the-badge&logo=mui)
![Docker](https://img.shields.io/badge/Docker-alpine-2496ED?style=for-the-badge&logo=docker)
![Cypress](https://img.shields.io/badge/Cypress-15.14.2-69D3A7?style=for-the-badge&logo=cypress)
![License](https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-v2%20estável%20%7C%20v3%20planejada-blue?style=for-the-badge)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Status do Projeto](#-status-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Acesso ao Projeto](#-acesso-ao-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Testes](#-testes)
- [Pessoas Contribuidoras](#-pessoas-contribuidoras)
- [Desenvolvedores](#-desenvolvedores)
- [Licença](#-licença)

---

## 📖 Sobre o Projeto

O **site-rinha-v2** é o frontend da plataforma de gerenciamento da **Rinha do Campus IV** — um torneio de League of Legends organizado por estudantes do Campus IV da UFPB. A plataforma centraliza inscrições, pagamentos e o gerenciamento administrativo do torneio em uma interface moderna e responsiva.

O projeto se comunica com a [`api-rinha-v2`](https://github.com/gbrlmzl/api-rinha-v2) como backend.

---

## 🚀 Status do Projeto

O projeto encontra-se atualmente na **v2**, em estado estável. A **v3** está em fase de planejamento, com novas funcionalidades sendo mapeadas.

---

## ✨ Funcionalidades

### 🏆 Módulo de Inscrição em Torneios
- Visualização dos torneios disponíveis
- Inscrição individual ou por equipe em torneios ativos
- Acompanhamento do status de inscrição do participante

### 💳 Módulo de Pagamento
- Integração com a **API do Mercado Pago**
- Geração de cobrança para confirmação da inscrição
- Acompanhamento em tempo real do status do pagamento via **WebSocket (STOMP/SockJS)**

### 🛠️ Módulo Administrativo
- Painel admin para criação, gerenciamento e cancelamento de torneios
- Listagem e controle de inscrições
- Visualização de status de pagamentos por participante

### 📡 Tempo Real
- Atualizações de status de pagamento via WebSocket com **STOMP** sobre **SockJS**, sem necessidade de reload de página

---

## 🔗 Acesso ao Projeto



```
https://rinhacampusiv.org
```

Repositório: [github.com/gbrlmzl/site-rinha-v2](https://github.com/gbrlmzl/site-rinha-v2)

---

## 🛠️ Tecnologias Utilizadas

### Core

| Tecnologia | Versão | Descrição |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.1.6 | Framework React com SSR/SSG e otimizações de build |
| [React](https://react.dev/) | 19.2.3 | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org/) | ^5 | Tipagem estática |

### UI & Estilo

| Tecnologia | Versão | Descrição |
|---|---|---|
| [MUI (Material UI)](https://mui.com/) | ^7.3.8 | Componentes de interface |
| [MUI X Date Pickers](https://mui.com/x/react-date-pickers/) | ^7.29.4 | Seleção de datas |
| [MUI Icons Material](https://mui.com/material-ui/material-icons/) | ^7.3.8 | Biblioteca de ícones |
| [Emotion](https://emotion.sh/) | ^11.14.x | CSS-in-JS (dependência do MUI) |

### Formulários & Validação

| Tecnologia | Versão | Descrição |
|---|---|---|
| [React Hook Form](https://react-hook-form.com/) | ^7.74.0 | Gerenciamento de formulários performático |
| [Zod](https://zod.dev/) | ^4.3.6 | Validação de schemas |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | ^5.2.2 | Integração do Zod com React Hook Form |

### Comunicação em Tempo Real

| Tecnologia | Versão | Descrição |
|---|---|---|
| [@stomp/stompjs](https://stomp-js.github.io/) | ^7.3.0 | Cliente STOMP para WebSocket |
| [SockJS-client](https://github.com/sockjs/sockjs-client) | ^1.6.1 | Fallback de WebSocket para ambientes restritos |

### DevOps & Tooling

| Tecnologia | Versão | Descrição |
|---|---|---|
| [Docker](https://www.docker.com/) | node:22-alpine | Build multi-stage para produção |
| [Cypress](https://www.cypress.io/) | ^15.14.2 | Testes E2E |
| [ESLint](https://eslint.org/) | ^9 | Linting de código |
| [Prettier](https://prettier.io/) | — | Formatação de código |
| [next-sitemap](https://github.com/iamvishnusankar/next-sitemap) | ^4.2.3 | Geração automática de sitemap |

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos
- Node.js >= 22
- npm

### Passos

```bash
# Clone o repositório
git clone https://github.com/gbrlmzl/site-rinha-v2.git
cd site-rinha-v2

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`.

### Com Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws \
  --build-arg INTERNAL_API_URL=http://localhost:8080 \
  -t site-rinha-v2 .

docker run -p 3000:3000 site-rinha-v2
```

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# URL do WebSocket da API (inlinada no bundle em build-time)
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws

# URL interna da API (usada nos rewrites do next.config.ts)
INTERNAL_API_URL=http://localhost:8080
```

> ℹ️ As variáveis com prefixo `NEXT_PUBLIC_` são incorporadas no bundle do cliente em tempo de build.

---

## 🧪 Testes

O projeto usa **Cypress** para testes end-to-end.

```bash
# Abre a interface visual do Cypress
npm run cypress:open

# Roda todos os testes no terminal
npm run cypress:run

# Roda apenas os testes com stubs (sem backend real)
npm run e2e:stub

# Roda os testes com dados reais (requer API rodando)
npm run e2e:real
```

Configure o arquivo `cypress.env.json` com base no `cypress.env.example.json`.

---

## 🤝 Pessoas Contribuidoras

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ryanpsouzaa">
        <img src="https://github.com/ryanpsouzaa.png" width="80px;" alt="ryanpsouzaa"/><br/>
        <sub><b>ryanpsouzaa</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 👨‍💻 Desenvolvedores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/gbrlmzl">
        <img src="https://github.com/gbrlmzl.png" width="80px;" alt="gbrlmzl"/><br/>
        <sub><b>gbrlmzl</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/victorhugosalv">
        <img src="https://github.com/victorhugosalv.png" width="80px;" alt="victorhugosalv"/><br/>
        <sub><b>victorhugosalv</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  Feito com ☕ e 🎮 por estudantes do Campus IV da UFPB
</div>
