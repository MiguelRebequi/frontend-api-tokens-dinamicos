import { garantirLogoffESeguranca } from '../../scripts/commons/seguranca.js';

import { iniciarMenuAcessibilidade } from '../../scripts/commons/acessibilidade.js'; 

let senhaDigitada = "";
const TAMANHO_SENHA = 4;

let ultimoBotaoClicado = null;
let indiceCaractereAtual = 0;
let temporizadorConsolidacao = null;
let caractereProvisorio = "";

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

function inicializarTeclado() {
    const tecladoContainer = document.getElementById('teclado-virtual');
    if (!tecladoContainer) return;

    // Array contém apenas os números isolados, sem nenhuma letra acoplada
    const números = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

    // Embaralha os botões numerados aleatoriamente a cada carregamento (Padrão Bradesco)
    números.sort(() => Math.random() - 0.5);

    tecladoContainer.innerHTML = "";

    números.forEach(num => {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "teclado-btn";
        btn.textContent = num;

        // Como não há mais grupos de letras, o clique insere o número puro instantaneamente
        btn.addEventListener('click', () => tratarCliqueVirtualNumérico(num));
        tecladoContainer.appendChild(btn);
    });

    const btnLimpar = document.createElement('button');
    btnLimpar.type = "button";
    btnLimpar.className = "teclado-btn btn-limpar";
    btnLimpar.textContent = "Limpar";
    btnLimpar.addEventListener('click', limparSenha);
    tecladoContainer.appendChild(btnLimpar);

    document.removeEventListener('keydown', capturarTecladoFisico);
    document.addEventListener('keydown', capturarTecladoFisico);
}

function tratarCliqueVirtualNumérico(numero) {
    // Bloqueia se a senha já atingiu o teto de dígitos
    if (senhaDigitada.length >= TAMANHO_SENHA) return;

    // Adiciona o número digitado diretamente na string da senha
    senhaDigitada += numero;
    atualizarDisplaySenha();
}

function consolidarCaractere() {
    if (caractereProvisorio !== "") {
        senhaDigitada += caractereProvisorio;
        caractereProvisorio = "";
        ultimoBotaoClicado = null;
        atualizarDisplaySenha();
    }
}

function atualizarDisplayProvisorio() {
    const pontos = document.querySelectorAll('.ponto-senha');

    const tamanhoVisual = senhaDigitada.length + (caractereProvisorio ? 1 : 0);

    pontos.forEach((ponto, index) => {
        if (index < tamanhoVisual) {
            ponto.classList.add('preenchido');
        } else {
            ponto.classList.remove('preenchido');
        }
    });
}

function pressionarTeclaFisica(caractere) {
    clearTimeout(temporizadorConsolidacao);
    caractereProvisorio = "";
    ultimoBotaoClicado = null;

    if (senhaDigitada.length < TAMANHO_SENHA) {
        senhaDigitada += caractere.toLowerCase();
        atualizarDisplaySenha();
    }
}

function limparSenha() {
    clearTimeout(temporizadorConsolidacao);
    senhaDigitada = "";
    caractereProvisorio = "";
    ultimoBotaoClicado = null;
    atualizarDisplaySenha();
}

function atualizarDisplaySenha() {
    const pontos = document.querySelectorAll('.ponto-senha');
    pontos.forEach((ponto, index) => {
        if (index < senhaDigitada.length) {
            ponto.classList.add('preenchido');
        } else {
            ponto.classList.remove('preenchido');
        }
    });

    const btnAcessar = document.getElementById('btn-acessar');
    if (btnAcessar) {
        btnAcessar.disabled = (senhaDigitada.length !== TAMANHO_SENHA);
    }
}

function capturarTecladoFisico(evento) {
    const tecla = evento.key;

    if (tecla === "Backspace" || tecla === "Delete") {
        limparSenha();
        return;
    }

    if (tecla === "Enter" && senhaDigitada.length === TAMANHO_SENHA) {
        loadingLogica();
        return;
    }

    // A expressão regular agora aceita estritamente apenas números (0-9)
    const ehApenasNumero = /^[0-9]$/.test(tecla);

    if (ehApenasNumero) {
        pressionarTeclaFisica(tecla);
    }
}

async function loadingLogica() {
    const blocoSenha = document.getElementById('bloco-senha');
    const blocoLoading = document.getElementById('bloco-loading');
    const mensagemSucesso = document.getElementById('mensagem-sucesso');

    // Recupera os dados que foram coletados lá na index.html
    const agencia = localStorage.getItem('agencia');
    const contaCompleta = localStorage.getItem('conta'); 

    // Transição visual inicial
    blocoSenha.classList.add('estado-oculto');
    blocoLoading.classList.remove('estado-oculto');

    try {
        // 4. Chama o motor da API enviando os dados (agora com a senha do seu teclado virtual)
        const jwt = await window.loginApi(agencia, contaCompleta, senhaDigitada.toLowerCase());

        // Salva o token
        localStorage.setItem("token_a3", jwt);

        // Decodifica o token para pegar as informações do usuário
        const payload = window.decodificarJwt(jwt);

        // SALVANDO O ID DA CONTA PARA USAR NA VALIDAÇÃO DE TOKENS:
        if(payload && payload.id) {
            localStorage.setItem("idConta", payload.id);
        } else {
            localStorage.setItem("idConta", 1);
        }

        // Define o nome obtido pela API
        const nomeParaExibir = (payload && payload.nome) ? payload.nome : "José Silva";
        localStorage.setItem("nomeUsuario", nomeParaExibir);
        
        if (document.querySelector('.saudacao-usuario')) {
            document.querySelector('.saudacao-usuario').textContent = "Olá, " + nomeParaExibir;
        }

        console.log("Login validado com o Spring Boot! Liberando fluxo de sucesso...");

        // Aguarda um pequeno instante do spinner e mostra a mensagem de sucesso
        setTimeout(() => {
            blocoLoading.classList.add('estado-oculto');
            mensagemSucesso.classList.remove('estado-oculto');

            // Redireciona de fato para o painel logado
            setTimeout(() => {
                window.location.replace('../dashboard/dashboard.html');
            }, 1500);
        }, 2000);

    } catch (error) {
        // Trata o erro exatamente como Renato planejou, mas limpando a interface para nova tentativa
        alert("Agência, conta ou senha incorretos.");
        console.error("Erro detalhado:", error);
        
        limparSenha();
        blocoLoading.classList.add('estado-oculto');
        blocoSenha.classList.remove('estado-oculto');
    }
}

function recuperarDadosUsuario() {
    // Busca os dados do localStorage
    const agencia = localStorage.getItem('agencia') || "0000"; // Se for nulo, mostra 0000
    const conta = localStorage.getItem('conta') || "00000-0"; // Se for nulo, mostra 00000-0
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

    // Acessibilidade
    iniciarMenuAcessibilidade();

    inicializarTeclado();

    garantirLogoffESeguranca({
        mensagemVoltar: "Atenção: Interromper o carregamento cancelará o seu acesso seguro. Deseja voltar para o início?",
        mensagemBotaoSair: "Deseja realmente cancelar o acesso e voltar para a página inicial?",
        caminhoIndex: "../../index.html",
        seletorBotaoSair: ".btn-cancelar"
    });

    const btnAcessar = document.getElementById('btn-acessar');
    if (btnAcessar) {
        btnAcessar.addEventListener('click', loadingLogica);
    }

    const linkEsqueci = document.getElementById('link-esqueci-senha');
    if (linkEsqueci) {
        linkEsqueci.addEventListener('click', function(evento) {
            evento.preventDefault();
            alert("🔒 Redirecionamento de Segurança:\n\nPara sua proteção, a recuperação de senhas de canais internos deve ser efetuada diretamente no aplicativo Bradesco Celular (Menu Segurança > Chave de Segurança) ou em uma Agência Bradesco física.");
        });
    }
});