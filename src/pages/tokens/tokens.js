import { gerenciarNavbarAtiva } from '../../scripts/commons/navbar.js';
import { formatarDataAtual } from '../../scripts/commons/utils.js';
import { garantirLogoffESeguranca } from '../../scripts/commons/seguranca.js';


// Variáveis de escopo global do arquivo
let inputCodigo, telaInicial, telaSucesso, telaAlerta;
let painelValidacao, painelHistorico, abaValidacao, abaHistorico;
let filtroBusca, btnResetarFiltros, segmentosFiltro, secaoFiltrosContainer, btnToggleFiltros, btnFecharFiltros;

// Guarda o offset do mês selecionado (-1 significa que nenhum mês foi filtrado ainda)
let mesOffsetSelecionado = -1;

document.addEventListener('DOMContentLoaded', () => {
    gerenciarNavbarAtiva();
    inicializarValidacaoToken();
    inicializarNavegacaoAbas();
    inicializarFiltrosEAvancados();
    document.getElementById('data-atual').textContent = formatarDataAtual();
});

function inicializarValidacaoToken() {
    const btnVerificar = document.getElementById('btn-verificar');
    const botoesVoltar = document.querySelectorAll('.btn-voltar-token');

    inputCodigo = document.getElementById('input-token-codigo');
    telaInicial = document.getElementById('tela-validacao-inicial');
    telaSucesso = document.getElementById('tela-resultado-sucesso');
    telaAlerta = document.getElementById('tela-resultado-alerta');

    painelValidacao = document.getElementById('painel-validacao-aba');
    painelHistorico = document.getElementById('painel-historico-aba');
    abaValidacao = document.getElementById('aba-validacao');
    abaHistorico = document.getElementById('aba-historico');

    if (btnVerificar && inputCodigo) {
        btnVerificar.addEventListener('click', processarVerificacao);
    }

    botoesVoltar.forEach(botao => {
        botao.addEventListener('click', resetarFormularioValidacao);
    });
}

function inicializarNavegacaoAbas() {
    if (abaValidacao && abaHistorico) {
        abaValidacao.addEventListener('click', (e) => {
            e.preventDefault();
            abaHistorico.classList.remove('ativa');
            abaValidacao.classList.add('ativa');
            painelHistorico.classList.add('estado-oculto');
            painelValidacao.classList.remove('estado-oculto');
        });

        abaHistorico.addEventListener('click', (e) => {
            e.preventDefault();
            abaValidacao.classList.remove('ativa');
            abaHistorico.classList.add('ativa');
            painelValidacao.classList.add('estado-oculto');
            painelHistorico.classList.remove('estado-oculto');
        });
    }
}

/**
 * Inicializa os controles de visualização e filtros da aba de histórico
 */
function inicializarFiltrosEAvancados() {
    filtroBusca = document.getElementById('filtro-busca');
    btnResetarFiltros = document.getElementById('btn-resetar-filtros');
    segmentosFiltro = document.querySelectorAll('.btn-segmento');
    secaoFiltrosContainer = document.getElementById('secao-filtros-container');
    btnToggleFiltros = document.getElementById('btn-toggle-filtros');
    btnFecharFiltros = document.getElementById('btn-fechar-filtros');

    // Abre os filtros avançados
    if (btnToggleFiltros && secaoFiltrosContainer) {
        btnToggleFiltros.addEventListener('click', () => {
            secaoFiltrosContainer.classList.remove('recolhido');
            btnToggleFiltros.classList.add('btn-oculto');      
        });
    }

    // Fecha os filtros avançados no "X"
    if (btnFecharFiltros && secaoFiltrosContainer && btnToggleFiltros) {
        btnFecharFiltros.addEventListener('click', () => {
            secaoFiltrosContainer.classList.add('recolhido');   
            btnToggleFiltros.classList.remove('btn-oculto');    
        });
    }

    // Escuta cliques nas pílulas padrões (TODOS, 7 dias, 30 dias, Canais)
    segmentosFiltro.forEach(botao => {
        if (botao.classList.contains('btn-dropdown-toggle')) return;

        botao.addEventListener('click', (e) => {
            const containerPai = e.target.parentElement;
            containerPai.querySelectorAll('.btn-segmento').forEach(b => b.classList.remove('ativo'));
            e.target.classList.add('ativo');

            // Se clicou em TODOS, Últimos 7 ou 30 dias, limpamos a busca por mês específico
            if (containerPai.getAttribute('data-filtro-tipo') !== 'canal') {
                mesOffsetSelecionado = -1;
                const btnDropdownToggle = document.querySelector('.btn-dropdown-toggle');
                if (btnDropdownToggle) {
                    btnDropdownToggle.innerHTML = `📅 Selecionar Mês <span class="seta-dropdown">▼</span>`;
                }
                document.querySelectorAll('.opcao-mes').forEach(o => o.classList.remove('selecionado'));
            }

            filtrarTabelaHistorico();
        });
    });

    if (filtroBusca) {
        filtroBusca.addEventListener('input', filtrarTabelaHistorico);
    }

    if (btnResetarFiltros) {
        btnResetarFiltros.addEventListener('click', resetarTodosOsFiltros);
    }

    configurarDropdownMes();
}

/**
 * Varre a tabela combinando todos os filtros ativos (Busca + Canal + Período por Dias / Meses)
 */
function filtrarTabelaHistorico() {
    const termoBusca = filtroBusca.value.toLowerCase().replace(/\s/g, '');

    // Captura qual pílula de canal está ativa
    const pilulaCanalAtiva = document.querySelector('.grupo-botoes-segmentados[data-filtro-tipo="canal"] .btn-segmento.ativo');
    const filtroCanal = pilulaCanalAtiva ? pilulaCanalAtiva.getAttribute('data-value') : 'todos';

    // Captura qual pílula de período (Dias) está ativa
    const pilulaPeriodoAtiva = document.querySelector('.grupo-botoes-segmentados[data-filtro-tipo="periodo"] .btn-segmento.ativo');
    const filtroPeriodo = pilulaPeriodoAtiva ? pilulaPeriodoAtiva.getAttribute('data-value') : 'todos';

    const linesTabela = document.querySelectorAll('#corpo-tabela-historico tr');
    const dataAtual = new Date();

    linesTabela.forEach(linha => {
        const colunaCodigo = linha.querySelector('.col-codigo').innerText.toLowerCase().replace(/\s/g, '');
        const colunaCanal = linha.cells[1].innerText.toLowerCase();

        // Conversão da data da tabela (DD/MM/AAAA) para objeto Date real
        const textoData = linha.cells[2].innerText;
        const [dia, mes, ano] = textoData.split('/').map(Number);
        const dataLinha = new Date(ano, mes - 1, dia);

        // MATEMÁTICA DAS DATAS (Diferença convertida para dias inteiros)
        const diferencaTempo = dataAtual.getTime() - dataLinha.getTime();
        const diferencaDias = Math.floor(diferencaTempo / (1000 * 60 * 60 * 24));

        // Diferença em meses (para o seletor dropdown)
        const diferencaMeses = (dataAtual.getFullYear() - dataLinha.getFullYear()) * 12 + (dataAtual.getMonth() - dataLinha.getMonth());

        // Validações combinadas de texto e Canal
        const bateuBusca = colunaCodigo.includes(termoBusca);
        const bateuCanal = (filtroCanal === 'todos' || colunaCanal.includes(filtroCanal.toLowerCase()));

        // VALIDAÇÃO LOGICA DE PERÍODO (7 dias, 30 dias, Mês específico ou Todos)
        let bateuPeriodo = false;

        if (mesOffsetSelecionado !== -1) {
            bateuPeriodo = (diferencaMeses === mesOffsetSelecionado);
        } else {
            if (filtroPeriodo === 'todos') bateuPeriodo = true;
            if (filtroPeriodo === '7days') bateuPeriodo = (diferencaDias >= 0 && diferencaDias <= 7);
            if (filtroPeriodo === '30days') bateuPeriodo = (diferencaDias >= 0 && diferencaDias <= 30);
        }

        if (bateuBusca && bateuCanal && bateuPeriodo) {
            linha.style.display = '';
        } else {
            linha.style.display = 'none';
        }
    });
}

/**
 * Lógica Inteligente: Constrói os botões de meses dinamicamente baseado na data de hoje
 */
function configurarDropdownMes() {
    const dropdownPai = document.querySelector('.dropdown-segmento');
    const btnDropdownToggle = document.querySelector('.btn-dropdown-toggle');
    const containerMeses = document.getElementById('dropdown-meses-container');

    if (!btnDropdownToggle || !dropdownPai || !containerMeses) return;

    containerMeses.innerHTML = ''; 

    for (let i = 0; i < 3; i++) {
        const dataCalculada = new Date();
        dataCalculada.setMonth(dataCalculada.getMonth() - i);

        const nomeMes = dataCalculada.toLocaleDateString('pt-BR', { month: 'long' });
        const nomeMesCapitalizado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
        const ano = dataCalculada.getFullYear();

        const botaoMes = document.createElement('button');
        botaoMes.type = 'button';
        botaoMes.className = 'opcao-mes';
        botaoMes.innerText = `${nomeMesCapitalizado} / ${ano}`;

        botaoMes.addEventListener('click', (e) => {
            e.stopPropagation();

            containerMeses.querySelectorAll('.opcao-mes').forEach(o => o.classList.remove('selecionado'));
            botaoMes.classList.add('selecionado');

            const containerPeriodo = dropdownPai.parentElement;
            containerPeriodo.querySelectorAll('.btn-segmento').forEach(b => b.classList.remove('ativo'));

            btnDropdownToggle.classList.add('ativo');
            btnDropdownToggle.innerHTML = `📅 ${botaoMes.innerText} <span class="seta-dropdown">▼</span>`;

            dropdownPai.classList.remove('aberto');

            mesOffsetSelecionado = i;
            filtrarTabelaHistorico();
        });

        containerMeses.appendChild(botaoMes);
    }

    btnDropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownPai.classList.toggle('aberto');
    });

    document.addEventListener('click', () => {
        dropdownPai.classList.remove('aberto');
    });
}

function resetarTodosOsFiltros() {
    if (filtroBusca) filtroBusca.value = '';
    mesOffsetSelecionado = -1;

    const grupos = document.querySelectorAll('.grupo-botoes-segmentados');
    grupos.forEach(grupo => {
        grupo.querySelectorAll('.btn-segmento').forEach(b => b.classList.remove('ativo'));
        const btnTodos = grupo.querySelector('.btn-segmento[data-value="todos"]');
        if (btnTodos) btnTodos.classList.add('ativo');
    });

    const btnDropdownToggle = document.querySelector('.btn-dropdown-toggle');
    if (btnDropdownToggle) {
        btnDropdownToggle.innerHTML = `📅 Selecionar Mês <span class="seta-dropdown">▼</span>`;
        btnDropdownToggle.classList.remove('ativo');
    }

    const containerMeses = document.getElementById('dropdown-meses-container');
    if (containerMeses) {
        containerMeses.querySelectorAll('.opcao-mes').forEach(o => o.classList.remove('selecionado'));
    }

    filtrarTabelaHistorico();
}

function processarVerificacao() {
    const valorInput = inputCodigo.value.trim();
    if (valorInput.length < 6) {
        alert('Por favor, insira o código completo de 6 dígitos.');
        return;
    }
    if (valorInput === '111111') {
        atualizarDataHoraSucesso();
        exibirSubTela('sucesso');
    } else {
        exibirSubTela('alerta');
    }
}

function exibirSubTela(estado) {
    telaInicial.classList.add('estado-oculto');
    telaSucesso.classList.add('estado-oculto');
    telaAlerta.classList.add('estado-oculto');
    if (estado === 'inicial') telaInicial.classList.remove('estado-oculto');
    if (estado === 'sucesso') telaSucesso.classList.remove('estado-oculto');
    if (estado === 'alerta') telaAlerta.classList.remove('estado-oculto');
}

function resetarFormularioValidacao() {
    inputCodigo.value = '';
    exibirSubTela('inicial');
    inputCodigo.focus();
}

function atualizarDataHoraSucesso() {
    const campoData = document.getElementById('data-sucesso-tabela');
    const campoHora = document.getElementById('hora-sucesso-tabela');
    if (campoData && campoHora) {
        const agora = new Date();
        campoData.innerText = agora.toLocaleDateString('pt-BR');
        campoHora.innerText = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
}