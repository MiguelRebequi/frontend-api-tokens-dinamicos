<a id="readme-top"></a>

<div align="center">
  
<h1>Trust Token - Frontend</h1>
<h6>Interface Bancária e Sistema de Autenticação Ativa de Tokens Dinâmicos</h6>
</div>

***

<div align="center">
  
  [![HTML5](https://img.shields.io/badge/HTML5-%23E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-%231572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
  [![JavaScript ES6](https://img.shields.io/badge/JavaScript-ES6--%23F7DF1E?logo=javascript&logoColor=%23323330)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
  
</div>
<hr>

<div align="center">
  <a href="#readme-top">
    <img src="img/TrustTokenLogoV2.png" alt="Logo" width="800" height="800">
  </a>
</div>

<br>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Guia de conteúdo</summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre o Projeto</a>
      <ul>
        <li><a href="#contextualização">Contextualização</a></li>
        <li><a href="#a-proposta-do-frontend">A Proposta do Frontend</a></li>
      </ul>
    </li>
    <li><a href="#funcionalidades-da-interface">Funcionalidades da Interface</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#pré-requisitos">Pré-requisitos</a></li>
        <li><a href="#configuração-e-execução">Configuração e Execução</a></li>
      </ul>
    </li>
    <li><a href="#tecnologias-utilizadas">Tecnologias Utilizadas</a></li>
    <li><a href="#arquitetura-e-responsividade">Arquitetura e Responsividade (UI/UX)</a></li>
    <li><a href="#contato">Contato</a></li>
  </ol>
</details>

<br>

## Sobre o Projeto
<p>
  Esta é a aplicação Frontend do ecossistema TrustToken. Trata-se de uma interface SPA (Single Page Application) responsiva que simula um Internet Banking moderno baseado na identidade visual do Bradesco. O objetivo principal do portal é fornecer ao correntista um ambiente seguro, intuitivo e acessível para realizar a validação ativa de tokens de comunicação recebidos, além de gerenciar o histórico completo de interações disparadas pelo banco para mitigar com precisão ataques de engenharia social (como fraudes de falsas centrais de atendimento).
</p>

### Contextualização
<p>
  O aumento de fraudes financeiras baseadas em engenharia social representa um dos principais desafios de segurança no setor bancário. Criminosos utilizando da engenharia social exploram fatores como urgência e autoridade para manipular vítimas e obter informações sensíveis.
</p>
<p> 
  Segundo a Federação Brasileira de Bancos (FEBRABAN):
</p>
<ul>
  <li>Em 2024, o golpe da falsa central destacou-se como o mais aplicado contra a população idosa.</li>
  <li>Cerca de 105 mil pessoas já foram vítimas dessa modalidade de fraude no Brasil.</li>
</ul>

### A Proposta do Frontend
<p>Nossa interface materializa o fluxo de validação ativa proposto pela arquitetura de segurança. Através de um painel autenticado conectado à API REST, o usuário consegue verificar em tempo real se o código de 6 dígitos contido em um SMS, e-mail ou ligação recebida possui registro legítimo na base do banco de dados da instituição antes de tomar qualquer ação, transformando o elo mais vulnerável da cadeia de fraude (o usuário humano) em um validador ativo.</p>

<br>

<p align="right">(<a href="#readme-top"> ▲ voltar ao topo ▲ </a>)</p>

## Funcionalidades da Interface
<p>
<ol>
<li><b>Dashboard Unificado:</b> Exibição de saldos de conta-corrente, conta-poupança e investimentos com controle de privacidade (Chave de visibilidade "Olho" para mascarar valores sensíveis).</li>
  <br>
<li><b>Linha do Tempo de Transações:</b> Extrato com representação visual em linha vertical de fluxos de entrada e saída financeira.</li>
  <br>
<li><b>Módulo de Verificação Ativa de Tokens:</b> Input inteligente que aceita apenas caracteres numéricos, com formatação em tempo real para validação síncrona junto à API Backend.</li>
  <br>
<li><b>Feedbacks de Estado de Segurança:</b> Modais informativos que alteram de forma adaptativa a paleta de cores e ícones conforme o resultado da validação:
  <ul>
    <li>🟢 <b>Sucesso:</b> Confirmação de comunicação oficial legítima.</li>
    <li>🔴 <b>Alerta de Fraude:</b> Token inválido ou inexistente com avisos práticos de segurança para o usuário desligar chamadas e não compartilhar dados.</li>
    <li>⚫ <b>Token Expirado:</b> Token não utilizado com a data de validação vencida. </li>
  </ul>
</li>
  <br>
<li><b>Histórico com Filtros Avançados:</b> Listagem responsiva de registros de tokens com recursos de busca textual instantânea e filtragem por chips segmentados de Canal (SMS, E-mail, Ligação) e Período (7 dias, 30 dias e drop-down dos últimos 90 dia).</li>
  <br>
<li><b>Acessibilidade Nativa (WCAG/WAI-ARIA):</b> Menu lateral flutuante responsivo de acessibilidade com suporte a atalhos de leitura de tela, inversão de contraste e suporte adaptado para ferramentas de voz e WebLibras.</li>
</ol>
</p>

<br>

<p align="right">(<a href="#readme-top"> ▲ voltar ao topo ▲ </a>)</p>

## Getting started
<p>Siga estas instruções para clonar e rodar o servidor web da aplicação cliente localmente ou por meio de contêineres de desenvolvimento.</p>
<p>
  
### Pré-requisitos

<p>Antes de começar, certifique-se de possuir em seu ambiente:</p>
<ul>
<li><b>Navegador Web:</b> Qualquer navegador moderno com suporte a ECMAScript 6 (Google Chrome, Microsoft Edge, Firefox ou Safari).</li>

<li><b>Extensão Live Server (VS Code):</b> Para servir as páginas HTML de maneira estática com Live Reloading local.</li>

<li><b>Ambiente Virtualizado Docker (Opcional para Homologação):</b> Caso queira rodar o servidor HTTP em ambiente isolado via Ubuntu Server em máquina virtual.</li>
</ul>
</p>

***

### Configuração e Execução

<ol>
<li>Clone o repositório do projeto Frontend:</li>

```sh
git clone [https://github.com/MachadoCodes/api-tokens-dinamicos.git](https://github.com/MachadoCodes/api-tokens-dinamicos.git)
```

## Tecnologias utilizadas

<div align="center">
  
| Tecnologia | Versão | Função |
| ---------- | ------ | ------ |
| HTML5 | Semântico | Estruturação e acessibilidade arquitetural (Semantic Tags) |
| CSS3 | Custom Properties | Estilização avançada, Grid Layout, Flexbox e animações de transição |
| JavaScript | ES6+ Modules | Injeção dinâmica de metadados, consumo assíncrono de APIs (Fetch) e manipulação do DOM |

</div>

<br>

<p align="right">(<a href="#readme-top"> ▲ voltar ao topo ▲ </a>)</p>

## Arquitetura e Responsividade (UI/UX)
<p>
  A interface foi projetada do zero adotando as melhores práticas de <b>Clean Code UI</b>, com estilos totalmente modulares isolados por escopo (ex: <code>dashboard.css</code>, <code>tokens.css</code>, <code>header-footer.css</code>) para simplificar a manutenção.
</p>
<p>
  A aplicação conta com uma folha de estilos de <b>Media Queries</b> agressiva blindada contra vazamentos de layout (Horizontal Scroll), adaptando-se perfeitamente a dispositivos móveis a partir de <code>320px</code> de largura. No mobile, elementos de alta complexidade sofrem transformações estruturais nativas: as barras laterais estáticas convertem-se automaticamente em menus horizontais por abas, a listagem de pílulas adota quebras fluidas (flex-wrap adaptativo) e as tabelas de dados compactam as colunas proporcionalmente por peso de relevância técnica.
</p>

<br>

<p align="right">(<a href="#readme-top"> ▲ voltar ao topo ▲ </a>)</p>

## Contato

<table align="center">
  <tr>
    <td align="center" valign="top">
      <a href="https://github.com/MachadoCodes">
        <img src="https://avatars.githubusercontent.com/u/142549072" width="200px;" alt="Renato Gonçalves Machado"/>
      </a>
      <br />
      <p><b>Renato Gonçalves Machado</b></p>
      <p>LinkedIn | <a href="https://github.com/MachadoCodes">GitHub</a></p>
    </td>
    <td align="center" valign="top">
      <a href="https://github.com/MiguelRebequi">
        <img src="https://avatars.githubusercontent.com/u/130229587" width="200px;" alt="Miguel Martinho Rebequi"/>
      </a>
      <br />
      <p><b>Miguel Martinho Rebequi</b></p>
      <p>LinkedIn | <a href="https://github.com/MiguelRebequi">GitHub</a></p>
    </td>
    <td align="center" valign="top">
      <a href="https://github.com/GuilhermeChiuchi">
        <img src="https://avatars.githubusercontent.com/u/136472706" width="200px;" alt="Guilherme Chiuchi Pereira"/>
      </a>
      <br />
      <p><b>Guilherme Chiuchi Pereira</b></p>
      <p>LinkedIn | <a href="https://github.com/GuilhermeChiuchi">GitHub</a></p>
    </td>
  </tr>
</table>

<br>

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Para mais detalhes, consulte o arquivo [LICENSE](LICENSE) na raiz do repositório.

Copyright © 2026 - Miguel Martinho Rebequi

<p align="right">(<a href="#readme-top"> ▲ voltar ao topo ▲ </a>)</p>
