export function gerenciarNavbarAtiva() {
    // 1. Pega o nome do arquivo atual (ex: "dashboard.html" ou "tokens.html")
    const paginaAtual = window.location.pathname.split('/').pop();

    // 2. Seleciona todos os links da sua lista
    const linksNav = document.querySelectorAll('.nav-links a');

    linksNav.forEach(link => {
        // Limpa qualquer classe 'ativo' que possa estar chumbada no HTML
        link.classList.remove('ativo');

        const hrefLink = link.getAttribute('href');

        if (hrefLink && hrefLink !== '#') {
            // 3. Extrai apenas o nome do arquivo do link (ex: "tokens.html")
            const nomeArquivoLink = hrefLink.split('/').pop();

            // 4. Se bater o arquivo da URL com o do link, ativa!
            if (paginaAtual === nomeArquivoLink) {
                link.classList.add('ativo');
            }
        }
    });
}

export function iniciarDropdownMaisOpcoesMobile() {
    const btnMaisOpcoes = document.querySelector('.btn-mais-opcoes');
    const navLinksContainer = document.querySelector('.nav-links');

    if (!btnMaisOpcoes || !navLinksContainer) return;

    if (window.innerWidth > 767) {
        const menuExistente = navLinksContainer.querySelector('.dropdown-mais-opcoes-mobile');
        if (menuExistente) menuExistente.remove();
        return;
    }

    if (navLinksContainer.querySelector('.dropdown-mais-opcoes-mobile')) return;

    const dropdownMobile = document.createElement('ul');
    dropdownMobile.className = 'dropdown-mais-opcoes-mobile';

    const todosItens = navLinksContainer.querySelectorAll('li');

    for (let i = 6; i < todosItens.length - 1; i++) {
        const itemClonado = todosItens[i].cloneNode(true);
        itemClonado.style.display = 'block';
        dropdownMobile.appendChild(itemClonado);
    }

    btnMaisOpcoes.parentElement.appendChild(dropdownMobile);

    btnMaisOpcoes.replaceWith(btnMaisOpcoes.cloneNode(true));
    const novoBtnMaisOpcoes = document.querySelector('.btn-mais-opcoes');

    novoBtnMaisOpcoes.addEventListener('click', (evento) => {
        evento.preventDefault();
        evento.stopPropagation();
        dropdownMobile.classList.toggle('mostrar-dropdown');
    });

    document.addEventListener('click', () => {
        dropdownMobile.classList.remove('mostrar-dropdown');
    });
}