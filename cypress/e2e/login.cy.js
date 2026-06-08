describe('Fluxo de Autenticação Bradesco', () => {
  it('Deve preencher os dados de login e redirecionar para o Loading', () => {
    
    // ⚠️ ATENÇÃO: Substitua este link pelo endereço exato que o seu Live Server gera 
    // quando você abre o projeto no navegador (geralmente é porta 5500 ou 3000)
    cy.visit('http://127.0.0.1:5500/src/index.html');

    // 1. O robô encontra os campos pelos IDs e digita os valores
    cy.get('#campo-agencia').type('1234');
    cy.get('#campo-conta').type('56789');
    cy.get('#campo-digito').type('0');

    // 2. O robô localiza e clica no botão de confirmação
    cy.get('.header_submit-button').click();

    // 3. O Teste Real: Verifica se a URL mudou para a página de carregamento
    cy.url().should('include', 'pages/loading/loading.html');
    
    // BÔNUS PARA A BANCA: Verifica se o seu código salvou os dados de forma correta no LocalStorage
    cy.window().then((win) => {
        expect(win.localStorage.getItem('agencia')).to.eq('1234');
        expect(win.localStorage.getItem('conta')).to.eq('567890'); // Junta conta e dígito como o seu código faz
    });
  });
});