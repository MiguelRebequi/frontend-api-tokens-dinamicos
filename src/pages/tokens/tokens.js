import {gerenciarNavbarAtiva} from '../../scripts/commons/navbar.js';
import {formatarDataAtual} from '../../scripts/commons/utils.js';

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

    // CHAMADA ADICIONADA: Carrega os dados reais do banco ao abrir a página
    carregarHistoricoTokens();
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

        const nomeMes = dataCalculada.toLocaleDateString('pt-BR', {month: 'long'});
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

async function processarVerificacao() {
    // Pega o valor digitado e remove espaços em branco
    const valorInput = inputCodigo.value.trim();

    // Validação visual de tamanho
    if (valorInput.length < 6) {
        alert('Por favor, insira o código completo de 6 dígitos.');
        return;
    }

    // Mostra um feedback de que está pensando (opcional, mas recomendado)
    const btnVerificar = document.getElementById('btn-verificar');
    const textoOriginal = btnVerificar.innerText;
    btnVerificar.innerText = 'Validando...';
    btnVerificar.disabled = true;

    try {
        // Agora ehValido recebe um objeto com os dados
        const dadosValidacao = await window.validarTokenA3(valorInput);

        if (dadosValidacao) {
            // Passamos o canal que veio da API para a função da tabela
            atualizarDataHoraSucesso(dadosValidacao.tipoCanal);
            exibirSubTela('sucesso');

            // Opcional: Recarrega o histórico após validar para manter a tela atualizada
            carregarHistoricoTokens();
        } else {
            exibirSubTela('alerta');
        }
    } finally {
        // Devolve o botão ao normal independente de sucesso ou erro
        btnVerificar.innerText = textoOriginal;
        btnVerificar.disabled = false;
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

function atualizarDataHoraSucesso(canalDaApi) {
    const tbodySucesso = document.getElementById('linha-dados-sucesso');

    if (tbodySucesso) {
        // Pega o código digitado
        const codigoDigitado = inputCodigo.value.trim();

        // Formata o código para ficar bonito na tabela (ex: "123 456")
        const codigoFormatado = codigoDigitado.length === 6
            ? `${codigoDigitado.slice(0, 3)} ${codigoDigitado.slice(3, 6)}`
            : codigoDigitado;

        const agora = new Date();
        const dataStr = agora.toLocaleDateString('pt-BR');
        const horaStr = agora.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});

        // Usa o canal que veio da API. Se por algum motivo vier vazio, mostra "Desconhecido"
        const tipoCanal = canalDaApi || "Desconhecido";

        // Injeta a linha completa de HTML dentro do tbody
        tbodySucesso.innerHTML = `
            <tr>
                <td class="col-codigo">${codigoFormatado}</td>
                <td>${tipoCanal}</td>
                <td>${dataStr}</td>
                <td>${horaStr}</td>
                <td><span class="tag-status autenticado">Autenticado</span></td>
            </tr>
        `;
    }
}

// ==========================================
// NOVA FUNÇÃO: RENDERIZAR HISTÓRICO DINÂMICO
// ==========================================
async function carregarHistoricoTokens() {
    const tbody = document.getElementById('corpo-tabela-historico');
    if (!tbody) return;

    // Feedback visual enquanto a API pensa
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Carregando histórico seguro...</td></tr>';

    const historico = await window.buscarHistoricoA3();

    if (!historico || historico.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Nenhum token gerado nos últimos 90 dias.</td></tr>';
        return;
    }

    tbody.innerHTML = ''; // Limpa a mensagem de carregamento e as linhas estáticas antigas

    historico.forEach(item => {
        // 1. Formata o código (123456 -> 123 456)
        const cod = item.codigo;
        const codigoFormatado = cod.length === 6 ? `${cod.slice(0, 3)} ${cod.slice(3, 6)}` : cod;

        // 2. Formata Data e Hora para o padrão brasileiro
        const dataObj = new Date(item.dataGeracao);
        const dataStr = dataObj.toLocaleDateString('pt-BR');
        const horaStr = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        // 3. Mapeia os Status do Java para as classes CSS do seu Figma
        let classeCSS = '';
        let textoStatus = '';

        if (item.status === 'USADO') {
            classeCSS = 'autenticado';
            textoStatus = 'Autenticado';
        } else if (item.status === 'ATIVO' || item.status === 'EXPIRADO') {
            classeCSS = 'pendente';
            textoStatus = 'Pendente/Expirado';
        } else {
            classeCSS = 'bloqueado';
            textoStatus = 'Alerta/Bloqueado';
        }

        // 4. Corrige a capitalização do Canal (LIGACAO -> Ligação)
        const canalFormatado = item.canal === 'LIGACAO' ? 'Ligação'
            : item.canal === 'EMAIL' ? 'Email'
                : 'SMS';

        // 5. Injeta a linha na tabela
        tbody.innerHTML += `
            <tr>
                <td class="col-codigo">${codigoFormatado}</td>
                <td>${canalFormatado}</td>
                <td>${dataStr}</td>
                <td>${horaStr}</td>
                <td><span class="tag-status ${classeCSS}">${textoStatus}</span></td>
            </tr>
        `;
    });
}