export function formatarDataAtual() {
    const hoje = new Date();
    const opcoesSemana = { weekday: 'long' };
    let diaSemana = hoje.toLocaleDateString('pt-BR', opcoesSemana);
    diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
    const dataFormatada = hoje.toLocaleDateString('pt-BR');
    
    return `${diaSemana}, ${dataFormatada}`; // Apenas retorna o texto
}

/**
 * Recupera os dados do usuário salvos no login e injeta de forma inteligente e responsiva no cabeçalho
 */
export function sincronizarUsuarioCabecalho() {
    // Puxa as strings que o loading.js guardou localmente de forma segura
    const agencia = localStorage.getItem('agencia') || "0000";
    const contaCompleta = localStorage.getItem('conta') || "0000000";
    const nomeCompleto = localStorage.getItem('nomeUsuario') || "Cliente";

    const elNome = document.getElementById('nome-usuario-topo');
    const elDados = document.getElementById('dados-conta-topo');

    if (elNome && elDados) {
        const nomes = nomeCompleto.split(' ');
        
        // 📱 VERIFICAÇÃO DE DISPOSITIVO (MOBILE vs DESKTOP)
        if (window.innerWidth <= 767) {
            // Celular: Mostra estritamente apenas o primeiro nome (ex: "MIGUEL")
            elNome.textContent = nomes[0]; 

            // Formata a conta inserindo o hífen antes do dígito verificador se não houver
            let contaFormatada = contaCompleta;
            if (contaCompleta.length > 1 && !contaCompleta.includes('-')) {
                contaFormatada = `${contaCompleta.slice(0, -1)}-${contaCompleta.slice(-1)}`;
            }
            // Omite os prefixos textuais "Ag." e "Cta" no celular para economizar pixels
            elDados.textContent = `${agencia} • ${contaFormatada}`;
        } else {
            // Desktop: Mostra o Primeiro e o Segundo nome para manter a elegância
            elNome.textContent = nomes.length > 1 ? `${nomes[0]} ${nomes[1]}` : nomes[0];

            let contaFormatada = contaCompleta;
            if (contaCompleta.length > 1 && !contaCompleta.includes('-')) {
                contaFormatada = `${contaCompleta.slice(0, -1)}-${contaCompleta.slice(-1)}`;
            }
            // Mostra o padrão formal completo no computador
            elDados.textContent = `${agencia} • ${contaFormatada}`;
        }
    }
}