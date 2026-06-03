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