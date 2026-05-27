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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('data-atual').textContent = formatarDataAtual();
    gerenciarNavbarAtiva();

    gerenciarSegurancaNavegacao();
});