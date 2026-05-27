import { formatarDataAtual } from '../../scripts/commons/utils.js';
import { gerenciarNavbarAtiva } from '../../scripts/commons/navbar.js';

import { garantirLogoffESeguranca } from '../../scripts/commons/seguranca.js';
garantirLogoffESeguranca("../../index.html");

function gerenciarSegurancaNavegacao() {
    if (!localStorage.getItem('conta')) {
        window.location.replace("../../index.html"); // Ajuste o caminho para a sua index se necessário
        return;
    }

    window.history.pushState({ logoff: true }, document.title, window.location.href);

    window.addEventListener('popstate', function (evento) {
        // Mostra a caixa de diálogo nativa do navegador para confirmação segura
        const desejaSair = confirm("Atenção: Voltar para a página anterior irá encerrar sua sessão atual de forma segura. Deseja mesmo deslogar?");
        
        if (desejaSair) {
            // 🔥 LOGOFF TOTAL: Limpa a sessão simulada antes de redirecionar
            localStorage.clear(); 
            window.location.replace("../../index.html"); // Substitua pelo caminho correto do seu login
        } else {
            // Se ele cancelar, reintroduzimos o estado para manter os botões ativos para a próxima tentativa
            window.history.pushState({ logoff: true }, document.title, window.location.href);
        }
    });

    const btnSair = document.querySelector('.btn-sair');
    if (btnSair) {
        btnSair.addEventListener('click', function (e) {
            e.preventDefault();
            if (confirm("Deseja realmente sair da sua conta com segurança?")) {
                localStorage.clear(); // Limpa as credenciais gravadas
                window.location.replace("../../index.html");
            }
        });
    }
}

function iniciarDropdownMaisOpcoesMobile() {
    const btnMaisOpcoes = document.querySelector('.btn-mais-opcoes');
    const navLinksContainer = document.querySelector('.nav-links');

    if (!btnMaisOpcoes || !navLinksContainer) return;

    if (window.innerWidth > 767) {
        const menuExistente = navLinksContainer.querySelector('.dropdown-mais-opcoes-mobile');
        if (menuExistente) menuExistente.remove();
        return;
    }

    // Evita a criação duplicada do menu se a função rodar mais de uma vez
    if (navLinksContainer.querySelector('.dropdown-mais-opcoes-mobile')) return;

    // 1. Cria o container do menu flutuante (UL)
    const dropdownMobile = document.createElement('ul');
    dropdownMobile.className = 'dropdown-mais-opcoes-mobile';

    const todosItens = navLinksContainer.querySelectorAll('li');
    

    for (let i = 6; i < todosItens.length - 1; i++) {
        const itemClonado = todosItens[i].cloneNode(true);
        itemClonado.style.display = 'block'; // Força a exibição vertical dentro do box branco
        dropdownMobile.appendChild(itemClonado);
    }

    // 3. Injeta o dropdown estruturado como irmão direto do link pai do botão
    btnMaisOpcoes.parentElement.appendChild(dropdownMobile);

    // 4. Limpa e reconstrói o evento de Clique para evitar acúmulos na memória
    btnMaisOpcoes.replaceWith(btnMaisOpcoes.cloneNode(true));
    const novoBtnMaisOpcoes = document.querySelector('.btn-mais-opcoes');

    novoBtnMaisOpcoes.addEventListener('click', (evento) => {
        evento.preventDefault();
        evento.stopPropagation();
        dropdownMobile.classList.toggle('mostrar-dropdown');
    });

    // 5. Fecha o menu se clicar fora
    document.addEventListener('click', () => {
        dropdownMobile.classList.remove('mostrar-dropdown');
    });
}

// Escuta a mudança de tamanho da janela (redimensionamento ao vivo no navegador)
window.addEventListener('resize', iniciarDropdownMaisOpcoesMobile);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('data-atual').textContent = formatarDataAtual();
    gerenciarNavbarAtiva();

    gerenciarSegurancaNavegacao();
    // Mobile
    iniciarDropdownMaisOpcoesMobile();
});