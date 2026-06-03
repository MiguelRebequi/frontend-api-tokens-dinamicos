import { formatarDataAtual } from '../../scripts/commons/utils.js';
import { gerenciarNavbarAtiva, iniciarDropdownMaisOpcoesMobile } from '../../scripts/commons/navbar.js';
import { garantirLogoffESeguranca } from '../../scripts/commons/seguranca.js';

import { gerenciarTemporizadorSessao } from '../../scripts/commons/sessao.js';

import { inicializarDropdownExtrato } from '../../scripts/commons/cabecalho_saldo.js';

let valoresOcultados = false; // Inicia mascarado por padrão conforme pedido
let saldosDaConta = { poupanca: 0, entrada: 0, saida: 0 };

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



function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function inicializarValoresPersistentes() {
    // Garante que o saldo mude ou se mantenha com base na conta que fez o login
    const contaAtual = localStorage.getItem('conta') || "generica";
    const chaveLocalStorage = `saldos_mockados_conta_${contaAtual}`;

    const dadosExistentes = localStorage.getItem(chaveLocalStorage);

    if (dadosExistentes) {
        // Puxa o saldo gerado no acesso anterior deste dispositivo
        saldosDaConta = JSON.parse(dadosExistentes);
    } else {
        // Se for o primeiro login desta conta, gera valores randômicos e lógicos
        const poupancaRandom = Math.floor(Math.random() * (12000 - 1500 + 1)) + 1500 + Math.random();
        const entradaRandom = Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000 + Math.random();
        const saidaRandom = Math.floor(Math.random() * (1800 - 150 + 1)) + 150 + Math.random();

        saldosDaConta = {
            poupanca: parseFloat(poupancaRandom.toFixed(2)),
            entrada: parseFloat(entradaRandom.toFixed(2)),
            saida: parseFloat(saidaRandom.toFixed(2))
        };

        // Salva localmente para persistir nos próximos F5
        localStorage.setItem(chaveLocalStorage, JSON.stringify(saldosDaConta));
    }

    localStorage.setItem(`saldo_topo_atual_${contaAtual}`, saldosDaConta.poupanca);
}

function renderizarValoresInterface() {
    const txtBtn = document.getElementById('texto-btn-olho');

    // Captura todos os espaços sensíveis do HTML
    const valTopo = document.getElementById('val-topo-saldo');
    const valPoupanca = document.getElementById('val-poupanca');
    const valTotal = document.getElementById('val-total');
    const valEntrada = document.getElementById('val-entrada');
    const valSaida = document.getElementById('val-saida');
    const valResumoPoupanca = document.getElementById('val-resumo-poupanca');
    const transacoesLista = document.querySelectorAll('.val-transacao');
    const elNomePix = document.getElementById('txt-nome-cliente-pix');
    const miniCorrente = document.querySelector('.val-mini-corrente');
    const miniPoupanca = document.querySelector('.val-mini-poupanca');
    const miniLancamentosValores = document.querySelectorAll('.lista-mini-lancamentos strong');

    if (valoresOcultados) {
        // Aplica as máscaras padrão do Bradesco
        if (valTopo) valTopo.textContent = "R$ *****";
        if (valPoupanca) valPoupanca.textContent = "R$ *****";
        if (valTotal) valTotal.textContent = "R$ *****";
        if (valEntrada) valEntrada.textContent = "R$ *****";
        if (valSaida) valSaida.textContent = "R$ *****";
        if (valResumoPoupanca) valResumoPoupanca.textContent = "R$ *****";
        if (elNomePix) elNomePix.textContent = "Rem: ***** re 11/05";
        if (miniCorrente) miniCorrente.textContent = "R$ *****";
        if (miniPoupanca) miniPoupanca.textContent = "R$ *****";
        miniLancamentosValores.forEach(l => l.textContent = "R$ *****");

        transacoesLista.forEach(t => t.textContent = "R$ *****");
        if (txtBtn) txtBtn.textContent = "Mostrar valores";
    } else {
        // Exibe os saldos mockados e calculados
        const formatadoPoupanca = formatarMoeda(saldosDaConta.poupanca);

        if (valTopo) valTopo.textContent = formatadoPoupanca;
        if (valPoupanca) valPoupanca.textContent = formatadoPoupanca;
        if (valTotal) valTotal.textContent = formatadoPoupanca;
        if (valResumoPoupanca) valResumoPoupanca.textContent = formatadoPoupanca;

        if (valEntrada) valEntrada.textContent = formatarMoeda(saldosDaConta.entrada);
        if (valSaida) valSaida.textContent = formatarMoeda(saldosDaConta.saida);
        const nomeUsuario = localStorage.getItem('nomeUsuario') || "José Silva";
        if (elNomePix) elNomePix.textContent = `Rem: ${nomeUsuario} re 11/05`;

        // Alimenta a lista de últimas transações de forma lógica
        transacoesLista.forEach((item, idx) => {
            const particao = parseFloat((saldosDaConta.saida / (idx + 2.5)).toFixed(2));
            item.textContent = formatarMoeda(particao);
        });

        if (typeof atualizarDadosMiniExtrato === "function") {
            atualizarDadosMiniExtrato();
        }

        if (txtBtn) txtBtn.textContent = "Ocultar valores";
    }
}

function ativarToggleValores() {
    inicializarValoresPersistentes();

    const checkboxSwitch = document.getElementById('btn-toggle-valores');
    if (checkboxSwitch) {
        checkboxSwitch.checked = valoresOcultados;
    }

    renderizarValoresInterface();

    // Escuta o movimento de arrastar/clicar do Toggle Switch
    if (checkboxSwitch) {
        checkboxSwitch.addEventListener('change', (evento) => {
            valoresOcultados = evento.target.checked;
            renderizarValoresInterface();
        });
    }
}

// Escuta a mudança de tamanho da janela (redimensionamento ao vivo no navegador)
window.addEventListener('resize', iniciarDropdownMaisOpcoesMobile);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('data-atual').textContent = formatarDataAtual();
    gerenciarNavbarAtiva();
    iniciarDropdownMaisOpcoesMobile();
    
    window.addEventListener('resize', iniciarDropdownMaisOpcoesMobile);
    ativarToggleValores();

    garantirLogoffESeguranca({
        mensagemVoltar: "Atenção: Voltar para a página anterior irá encerrar sua sessão do Dashboard. Deseja deslogar?",
        mensagemBotaoSair: "Deseja realmente sair da sua conta do Dashboard com segurança?",
        caminhoIndex: "../../index.html"
    });
    
    gerenciarTemporizadorSessao();
    inicializarDropdownExtrato();
    // Mobile
    iniciarDropdownMaisOpcoesMobile();


});