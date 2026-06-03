// src/scripts/commons/cabecalho.js

/**
 * Alimenta dinamicamente os valores de dentro do painel flutuante do Header.
 * Mantém consistência absoluta com os centavos e fórmulas calculados no dashboard.js!
 */
export function atualizarDadosMiniExtrato() {
    const gatilho = document.getElementById('dropdown-saldo-gatilho');
    const contaLogada = localStorage.getItem('conta') || "generica";
    
    // Busca o objeto completo de saldos gerados para esta conta no localStorage
    const chaveLocalStorage = `saldos_mockados_conta_${contaLogada}`;
    const dadosExistentes = localStorage.getItem(chaveLocalStorage);

    if (!gatilho || !dadosExistentes) return;

    const saldosDaConta = JSON.parse(dadosExistentes);
    
    const txtMiniPoupanca = gatilho.querySelector('.val-mini-poupanca');
    const txtMiniCorrente = gatilho.querySelector('.val-mini-corrente');
    const containerListaLancamentos = gatilho.querySelector('.lista-mini-lancamentos');

    // 1. Alimenta as sub-contas do Dropdown
    if (txtMiniPoupanca) {
        txtMiniPoupanca.textContent = saldosDaConta.poupanca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (txtMiniCorrente) {
        // Mantém a simulação da conta corrente casada (15% do saldo)
        txtMiniCorrente.textContent = (saldosDaConta.poupanca * 0.15).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (containerListaLancamentos) {
        // Simulamos os dois primeiros lançamentos mais recentes idênticos aos calculados no corpo
        const valorLancamento1 = parseFloat((saldosDaConta.saida / 2.5).toFixed(2)); // Corresponde ao index 0 (Pagto Cobrança)
        const valorLancamento2 = parseFloat((saldosDaConta.saida / 3.5).toFixed(2)); // Corresponde ao index 1 (Transfe Pix)

        containerListaLancamentos.innerHTML = `
            <li>
                <span>Pagto Cobrança</span> 
                <strong style="color: #cc0000; font-weight: bold;">- ${valorLancamento1.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
            </li>
            <li>
                <span>Transfe Pix</span> 
                <strong style="color: #cc0000; font-weight: bold;">- ${valorLancamento2.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
            </li>
        `;
    }
}

/**
 * Inicializa a abertura por clique do Mini-Extrato e alimenta as paridades monetárias de forma idêntica.
 * Mantém os valores perfeitamente casados com as transações do corpo da página.
 */
export function inicializarDropdownExtrato() {
    const gatilho = document.getElementById('dropdown-saldo-gatilho');
    if (!gatilho) return;

    // Remove qualquer ouvinte de clique antigo duplicado reinjetando o elemento limpo no DOM
    const novoGatilho = gatilho.cloneNode(true);
    gatilho.parentNode.replaceChild(novoGatilho, gatilho);

    // Renderiza os dados numéricos iniciais da conta logada
    atualizarDadosMiniExtrato();

    // 3. Controla o abre e fecha do menu flutuante por clique
    novoGatilho.addEventListener('click', (evento) => {
        evento.stopPropagation();
        novoGatilho.classList.toggle('ativo');
    });

    // 4. Fecha a caixinha automaticamente se clicar em qualquer outra parte da tela
    document.addEventListener('click', () => {
        novoGatilho.classList.remove('ativo');
    });
}