document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login-bradesco");

    if (formLogin) {
        formLogin.addEventListener("submit", async (event) => {
            event.preventDefault();

            const agencia = document.getElementById("campo-agencia").value;
            const conta = document.getElementById("campo-conta").value;
            const digito = document.getElementById("campo-digito").value;

            const contaCompleta = `${conta}${digito}`;

            // ---------------------------------------------------------
            // A MÁGICA REAL ACONTECE AQUI:
            // Em vez de fixar no código, pedimos para o usuário digitar!
            // ---------------------------------------------------------
            const senhaDigitada = prompt("Por favor, digite sua senha de acesso:");

            // Se o usuário clicar em "Cancelar" ou não digitar nada, paramos o login
            if (!senhaDigitada) {
                alert("A senha é obrigatória para acessar a conta.");
                return;
            }

            try {
                // 4. Chama o motor da API enviando os dados do José
                const jwt = await window.loginApi(agencia, contaCompleta, senhaDigitada);

                // Salva o token
                localStorage.setItem("token_a3", jwt);

                // Decodifica o token para pegar as informações do usuário
                const payload = window.decodificarJwt(jwt);

                // SALVANDO O ID DA CONTA PARA USAR NA VALIDAÇÃO DE TOKENS:
                if(payload && payload.id) {
                    localStorage.setItem("idConta", payload.id);
                } else {
                    // Se por acaso o seu JWT não tiver o campo "id", vamos forçar o ID 1 provisoriamente para o teste:
                    localStorage.setItem("idConta", 1);
                }

                // Salva os dados fragmentados que o loading.js vai precisar
                localStorage.setItem("agencia", agencia);
                localStorage.setItem("conta", contaCompleta);

                // Se a sua API insere o nome do usuário no JWT (ex: campo "nome" ou "sub"), pegamos dele.
                // Se o seu JWT só tiver o login, podemos salvar o nome vindo do formulário ou usar um mock dinâmico.
                const nomeParaExibir = (payload && payload.nome) ? payload.nome : "José Silva";
                localStorage.setItem("nomeUsuario", nomeParaExibir);

                console.log("Login validado com o Spring Boot! Dados salvos para o loading.");

                // 6. Libera a navegação para a tela do Miguel
                window.location.href = "pages/loading/loading.html";

            } catch (error) {
                alert("Agência, conta ou senha incorretos.");
                console.error("Erro detalhado:", error);
            }
        });
    }
});