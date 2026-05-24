function dataAtual() {
    // 1. Captura a data atual do sistema
    const hoje = new Date();

    // 2. Define as opções de formatação para o dia da semana
    const opcoesSemana = { weekday: 'long' };

    // 3. Pega o dia da semana por extenso (ex: "segunda-feira")
    // O método localLowerCase() garante que fique tudo em minúsculo se preferir
    let diaSemana = hoje.toLocaleDateString('pt-BR', opcoesSemana);

    // Opcional: Deixar a primeira letra do dia da semana maiúscula (ex: "Segunda-feira")
    diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

    // 4. Pega a data no formato DD/MM/YYYY
    const dataFormatada = hoje.toLocaleDateString('pt-BR');

    // 5. Junta tudo no formato "Dia da semana, DD/MM/YYYY"
    const textoFinal = `${diaSemana}, ${dataFormatada}`;

    // 6. Insere o texto automaticamente no span usando o ID
    document.getElementById('data-atual').textContent = textoFinal;
}

function loadingLogica() {
    const statusLoading = document.querySelector('.bloco-loading-status');
    const mensagemSucesso = document.getElementById('mensagem-sucesso');

    // Configuração dos tempos (em milissegundos)
    const TEMPO_CARREGAMENTO = 3000; // 3 segundos simulando o carregamento
    const TEMPO_REDIRECIONAMENTO = 1500; // 1.5 segundo para o usuário ler o sucesso

    // 1. Simula o carregamento inicial
    setTimeout(() => {
        // Esconde o status de carregamento
        statusLoading.classList.add('estado-oculto');

        // Revela a mensagem de sucesso
        mensagemSucesso.classList.remove('estado-oculto');

        // 2. Após a mensagem aparecer, redireciona para o Dashboard
        setTimeout(() => {
            // Ajuste o caminho conforme a estrutura real da sua pasta
            window.location.href = '../dashboard/dashboard.html';
        }, TEMPO_REDIRECIONAMENTO);

    }, TEMPO_CARREGAMENTO);
}

function recuperarDadosUsuario() {
    // Busca os dados do localStorage
const agencia = localStorage.getItem('agencia') || "0000"; // Se for nulo, mostra 0000
    const conta = localStorage.getItem('conta') || "00000-0";
    const nome = localStorage.getItem('nomeUsuario') || "Cliente"; // Se for nulo, mostra Cliente

    // Preenche nos elementos HTML se eles existirem na página
    if (document.getElementById('lbl-agencia')) {
        document.getElementById('lbl-agencia').textContent = agencia;
    }
    if (document.getElementById('lbl-conta')) {
        document.getElementById('lbl-conta').textContent = conta;
    }
    if (document.querySelector('.saudacao-usuario')) {
        document.querySelector('.saudacao-usuario').textContent = "Olá, " + nome;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    dataAtual();
    recuperarDadosUsuario();
    loadingLogica();
});