// src/scripts/services/api.js
const BASE_URL = "http://localhost:8080";

// Colocamos a função no escopo global (window)
window.loginApi = async function (agencia, numeroConta, senha) {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            agencia: agencia,
            numeroConta: numeroConta,
            senha: senha
        })
    });

    if (!response.ok) {
        throw new Error(`Credenciais inválidas: ${response.status}`);
    }

    const token = await response.text();
    return token;
};

/**
 * Função utilitária para decodificar a carga (Payload) de um JWT sem biblioteca externa
 */
window.decodificarJwt = function (token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
    }
};

/**
 * Envia o código do token (6 dígitos) para a API validar.
 * Retorna true (válido) ou false (inválido/fraude).
 */
window.validarTokenA3 = async function (codigoToken) {
    const jwt = localStorage.getItem("token_a3");

    // PEGANDO O ID DA CONTA SALVO NO LOGIN
    const contaIdString = localStorage.getItem("idConta");

    if (!jwt || !contaIdString) {
        console.error("Usuário não está logado ou ID da conta ausente.");
        return false;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/v1/tokens/validar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                codigo: codigoToken,
                contaId: parseInt(contaIdString) // ENVIANDO O ID CONVERTIDO PARA NÚMERO!
            })
        });

        if (response.ok) {
            const dadosToken = await response.json(); // Lê o JSON do Java
            return dadosToken; // Retorna o objeto { mensagem, tipoCanal }
        }

        return null; // Retorna null se der erro 401/400

    } catch (error) {
        console.error("Erro ao comunicar com a API de tokens:", error);
        return false;
    }
};

window.buscarHistoricoA3 = async function() {
    const jwt = localStorage.getItem("token_a3");
    if (!jwt) return [];

    try {
        const response = await fetch(`${BASE_URL}/api/v1/tokens/historico`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        return [];
    }
};