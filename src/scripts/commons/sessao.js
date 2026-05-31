// src/scripts/commons/sessao.js

/**
 * Gerencia o temporizador regressivo de 20 minutos compartilhado entre as telas logadas.
 * Se o tempo expirar, limpa o localStorage e desloga o usuário.
 */
export function gerenciarTemporizadorSessao() {
    const elementoTimer = document.querySelector('.timer-circulo');
    if (!elementoTimer) return;

    // 1. Tenta recuperar se já existe uma contagem em andamento nesta sessão
    let minutosRestantes = localStorage.getItem('tempo_sessao');

    if (minutosRestantes === null) {
        // Se for o primeiro carregamento após o login, inicia com 20 minutos
        minutosRestantes = 45;
        localStorage.setItem('tempo_sessao', minutosRestantes);
    } else {
        minutosRestantes = parseInt(minutosRestantes);
    }

    // 2. Renderiza o valor inicial na bolinha branca do cabeçalho
    elementoTimer.textContent = `${minutosRestantes} MIN`;

    // 3. Cria o intervalo que roda de 1 in 1 minuto (60000ms)
    const intervaloTimer = setInterval(() => {
        minutosRestantes--;

        if (minutosRestantes <= 0) {
            clearInterval(intervaloTimer);
            elementoTimer.textContent = `0 MIN`;

            // Derruba a sessão por inatividade
            alert("🔒 Sua sessão expirou por inatividade. Para sua segurança, faça o login novamente.");
            localStorage.clear();
            
            // Como esse script roda de forma genérica, o caminho relativo abaixo 
            // deve apontar corretamente para onde está a sua index de login
            window.location.replace("../../index.html");
        } else {
            elementoTimer.textContent = `${minutosRestantes} MIN`;
            localStorage.setItem('tempo_sessao', minutosRestantes);
        }

    }, 60000);
}