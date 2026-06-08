/**
 * Garante o logoff seguro e gerencia a segurança de navegação (Bloqueio do botão Voltar)
 * @param {Object} configuracao - Objeto contendo os textos, caminhos e seletores da página atual.
 */
export function garantirLogoffESeguranca(configuracao) {
    const {
        mensagemVoltar = "Atenção: Voltar para a página anterior irá encerrar sua sessão atual de forma segura. Deseja mesmo deslogar?",
        mensagemBotaoSair = "Deseja realmente sair da sua conta com segurança?",
        caminhoIndex = "../../index.html",
        seletorBotaoSair = ".btn-sair" // 🌟 NOVO: Seletor genérico configurável
    } = configuracao;

    // 1. BARREIRA DE ENTRADA: Se não houver dados de conta salvos, expulsa para a Home imediatamente
    if (!localStorage.getItem('conta')) {
        window.location.replace(caminhoIndex);
        return;
    }

    // 2. INJEÇÃO DE HISTÓRICO: Cria um estado "fantasma" para interceptar o primeiro clique de voltar
    window.history.pushState({ logoff: true }, document.title, window.location.href);

    // 3. CAPTURA DO BOTÃO VOLTAR
    window.addEventListener('popstate', function (evento) {
        const desejaSair = confirm(mensagemVoltar);

        if (desejaSair) {
            localStorage.clear();
            window.location.replace(caminhoIndex);
        } else {
            window.history.pushState({ logoff: true }, document.title, window.location.href);
        }
    });

    // 4. VÍNCULO DO BOTÃO FÍSICO (Usando o seletor dinâmico)
    const btnSair = document.querySelector(seletorBotaoSair);
    if (btnSair) {
        btnSair.addEventListener('click', function (e) {
            e.preventDefault();
            if (confirm(mensagemBotaoSair)) {
                localStorage.clear();
                window.location.replace(caminhoIndex);
            }
        });
    }
}