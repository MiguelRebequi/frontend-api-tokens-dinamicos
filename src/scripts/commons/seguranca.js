export function garantirLogoffESeguranca(caminhoLogin = "../../index.html") {
    // 1. BLINDAGEM CONTRA O BOTÃO VOLTAR DO NAVEGADOR (Cache de Histórico)
    window.addEventListener('pageshow', function (evento) {
        if (evento.persisted || !localStorage.getItem('conta')) {
            window.location.replace(caminhoLogin);
        }
    });

    // 2. VERIFICAÇÃO DE SESSÃO ATIVA IMEDIATA
    if (!localStorage.getItem('conta')) {
        window.location.replace(caminhoLogin);
        return;
    }

    // 3. EVENTO DO BOTÃO SAIR (LOGOFF REAL DA SESSÃO)
    const btnSair = document.querySelector('.btn-sair');
    if (btnSair) {
        const novoBtnSair = btnSair.cloneNode(true);
        btnSair.parentNode.replaceChild(novoBtnSair, btnSair);

        novoBtnSair.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.clear();
            window.location.replace(caminhoLogin);
        });
    }
}