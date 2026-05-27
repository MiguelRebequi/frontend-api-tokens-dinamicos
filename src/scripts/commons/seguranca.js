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

    // 3. EVENTO DO BOTÃO SAIR (LOGOFF CONFIRMADO)
    const btnSair = document.querySelector('.btn-sair');
    if (btnSair) {
        const novoBtnSair = btnSair.cloneNode(true);
        btnSair.parentNode.replaceChild(novoBtnSair, btnSair);

        novoBtnSair.addEventListener('click', function (e) {
            e.preventDefault();
            
            // 🎯 O AJUSTE CRÍTICO: Dispara a caixa de diálogo exibida na imagem_f72d8a.png
            const usuarioConfirmouSair = window.confirm("Deseja realmente sair da sua conta com segurança?");
            
            // Se o usuário clicar em "OK" (Botão Azul)
            if (usuarioConfirmouSair) {
                // Limpa absolutamente todas as credenciais gravadas
                localStorage.clear();
                
                // Substitui o histórico e ejeta o usuário para a página de login inicial
                window.location.replace(caminhoLogin);
            }
            
            // Se o usuário clicar em "Cancelar", a função termina aqui e ele continua navegando no Dashboard normalmente!
        });
    }
}