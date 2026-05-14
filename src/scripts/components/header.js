function carregarCabecalho() {
    // 1. Procura a âncora no HTML
    const cabecalhoElement = document.getElementById('cabecalho-global');

    // 2. Se a página atual tiver essa âncora, ele injeta o código
    if (cabecalhoElement) {
        cabecalhoElement.innerHTML = `
            <h1>
                <a href="index.html">
                    <img src="assets/images/logo/sizes/Bradesco_H_White_RGB-350x114.png" alt="Logo Horizontal do Bradesco">
                </a>
            </h1>
        `;
    }
}

// 3. Executa a função assim que o script for lido
carregarCabecalho();