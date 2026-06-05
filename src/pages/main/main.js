import { iniciarMenuAcessibilidade } from '../../scripts/commons/acessibilidade.js';

function iniciarValidacaoNumerica() {
    const inputs = document.querySelectorAll('.somente-numeros');

    inputs.forEach(input => {
        // 1. Bloqueia a digitação ao vivo (Tecla por tecla)
        input.addEventListener('keypress', function (e) {
            // Se o que foi digitado NÃO for um número de 0 a 9...
            const isNumber = /^[0-9]$/.test(e.key);

            // Verifica se a tecla é "Enter"
            const isEnter = e.key === 'Enter';

            if (!isNumber && !isEnter) {
                e.preventDefault();
                alert("Favor digitar somente caracteres numéricos");
            }
        });

        // 2. Proteção contra o "Copiar e Colar" (Ctrl+V)
        input.addEventListener('input', function (e) {
            // Pega o valor e arranca tudo que não for número (usando Regex)
            const valorLimpo = this.value.replace(/\D/g, '');

            // Se o valor mudou (ou seja, tinha letra misturada no meio)
            if (this.value !== valorLimpo) {
                this.value = valorLimpo; // Devolve só os números pro campo
                alert("Favor digitar somente caracteres numéricos");
            }
        });
    });
}







function iniciarDropdownsHeader() {
    const botoesPerfil = document.querySelectorAll('.btn-perfil');

    botoesPerfil.forEach(botao => {
        botao.addEventListener('click', function (evento) {
            evento.preventDefault();
            const menu = this.nextElementSibling;

            document.querySelectorAll('.dropdown-escondido').forEach(outroMenu => {
                if (outroMenu !== menu) {
                    outroMenu.classList.remove('mostrar-dropdown');
                    outroMenu.previousElementSibling.setAttribute('aria-expanded', 'false');
                }
            });

            const estaAberto = menu.classList.toggle('mostrar-dropdown');

            this.setAttribute('aria-expanded', estaAberto ? 'true' : 'false');
        });
    });

    document.addEventListener('click', function (evento) {
        if (!evento.target.closest('.dropdown-perfil')) {
            document.querySelectorAll('.dropdown-escondido').forEach(menu => {
                menu.classList.remove('mostrar-dropdown');
                menu.previousElementSibling.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

function iniciarMenuLateral() {
    const btnProdutos = document.getElementById('btn-produtos');
    const btnCanais = document.getElementById('btn-canais');
    const painelProdutos = document.getElementById('painel-produtos');
    const painelCanais = document.getElementById('painel-canais');

    if (!btnProdutos || !painelProdutos || !btnCanais || !painelCanais) return;

    // 📱 Lógica de movimentação adaptativa para Mobile (Accordion)
    if (window.innerWidth <= 767) {
        // Move os painéis para ficarem logo abaixo dos seus respectivos botões na lista
        btnProdutos.after(painelProdutos);
        btnCanais.after(painelCanais);
    }

    // Clique em Produtos e Serviços
    btnProdutos.addEventListener('click', function (evento) {
        evento.preventDefault();
        evento.stopPropagation();

        // Fecha o outro painel
        painelCanais.classList.remove('mostrar');
        btnCanais.setAttribute('aria-expanded', 'false');

        // Alterna o atual
        const estaAberto = painelProdutos.classList.toggle('mostrar');
        this.setAttribute('aria-expanded', estaAberto ? 'true' : 'false');
    });

    // Clique em Canais
    btnCanais.addEventListener('click', function (evento) {
        evento.preventDefault();
        evento.stopPropagation();

        // Fecha o outro painel
        painelProdutos.classList.remove('mostrar');
        btnProdutos.setAttribute('aria-expanded', 'false');

        // Alterna o atual
        const estaAberto = painelCanais.classList.toggle('mostrar');
        this.setAttribute('aria-expanded', estaAberto ? 'true' : 'false');
    });
}



function iniciarPainelBusca() {
    const btnAbrirBusca = document.querySelector('.btn-busca-topo');
    const painelBusca = document.getElementById('painel-busca-global');
    const btnFecharBusca = document.querySelector('.btn-fechar-busca');


    if (btnAbrirBusca && painelBusca) {
        btnAbrirBusca.addEventListener('click', function () {

            painelBusca.classList.remove('esconder-busca');
        });
    }


    if (btnFecharBusca && painelBusca) {
        btnFecharBusca.addEventListener('click', function () {
            painelBusca.classList.add('esconder-busca');
        });
    }

    const inputBusca = document.getElementById('campo-busca');
    const estadoVazio = document.getElementById('estado-vazio-busca');
    const estadoDigitando = document.getElementById('estado-digitando-busca');
    const btnLimpar = document.getElementById('btn-limpar-busca');

    inputBusca.addEventListener('input', function () {
        if (this.value.trim().length > 0) {
            estadoVazio.classList.add('estado-oculto');
            estadoDigitando.classList.remove('estado-oculto');
            if (btnLimpar) btnLimpar.classList.remove('estado-oculto');
        } else {
            estadoVazio.classList.remove('estado-oculto');
            estadoDigitando.classList.add('estado-oculto');
            if (btnLimpar) btnLimpar.classList.add('estado-oculto');
        }
    });

    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            inputBusca.value = '';
            inputBusca.focus();
            inputBusca.dispatchEvent(new Event('input'));
        });
    }
}


function iniciarCarrossel() {
    const slides = document.querySelectorAll('.banner .slide');
    const dots = document.querySelectorAll('.banner .dot');
    let slideAtual = 0;
    const tempoDeTroca = 5000;

    if (slides.length === 0) return;

    let temporizador;

    function mostrarSlide(index) {
        slides.forEach(slide => slide.classList.remove('ativa'));
        dots.forEach(dot => dot.classList.remove('ativa'));


        slides[index].classList.add('ativa');
        dots[index].classList.add('ativa');
        const pictureAtivo = slides[index].querySelector('picture');
        if (pictureAtivo) {
            const imgInterna = pictureAtivo.querySelector('img');
            // Forçar o re-carregamento do fluxo do source resetando o src momentaneamente
            if (imgInterna) {
                const srcAtual = imgInterna.src;
                imgInterna.src = srcAtual;
            }
        }

    }

    function proximoSlide() {
        slideAtual = (slideAtual + 1) % slides.length;
        mostrarSlide(slideAtual);

        // ✅ Reagenda sempre do zero, sem acúmulo de atraso
        temporizador = setTimeout(proximoSlide, tempoDeTroca);
    }

    mostrarSlide(0);
    temporizador = setTimeout(proximoSlide, tempoDeTroca);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index === slideAtual) return;
            clearTimeout(temporizador);
            slideAtual = index;
            mostrarSlide(slideAtual);
            temporizador = setTimeout(proximoSlide, tempoDeTroca);
        });
    });
}


function iniciarBarraFlutuante() {
    const barra = document.getElementById('abra-conta-link');

    if (!barra) return;

    window.addEventListener('scroll', () => {
        const scrollAtual = window.scrollY;

        const limiteMaximoRolagem = document.documentElement.scrollHeight - window.innerHeight;

        const zonaDoRodape = 150;


        if (scrollAtual > 300 && scrollAtual < (limiteMaximoRolagem - zonaDoRodape)) {
            barra.classList.add('mostrar');
        } else {
            barra.classList.remove('mostrar');
        }
    });
}

function iniciarInteracaoBia() {
    const estadoDescanso = document.getElementById('bia-estado-descanso');
    const estadoAtivo = document.getElementById('bia-estado-ativo');
    const btnAbrir = document.getElementById('btn-abrir-bia');
    const btnFechar = document.getElementById('btn-fechar-bia-retangulo');

    if (!estadoDescanso || !estadoAtivo || !btnAbrir || !btnFechar) return;

    btnAbrir.addEventListener('click', () => {
        estadoDescanso.classList.add('esconde-bia');
        estadoAtivo.classList.remove('esconde-bia');

        btnAbrir.setAttribute('aria-expanded', 'true');
        estadoAtivo.setAttribute('aria-hidden', 'false');
        btnFechar.focus();
    });

    btnFechar.addEventListener('click', () => {
        estadoAtivo.classList.add('esconde-bia');
        estadoDescanso.classList.remove('esconde-bia');

        btnAbrir.setAttribute('aria-expanded', 'false');
        estadoAtivo.setAttribute('aria-hidden', 'true');
        btnAbrir.focus();
    });
}

function iniciarAbasRodape() {
    const botoesAba = document.querySelectorAll('.btn-aba');

    botoesAba.forEach(botao => {
        botao.addEventListener('click', () => {
            // 🌟 A TRAVA DEFINITIVA: Se a aba clicada já está aberta, 
            // interrompemos a função imediatamente. Não fecha nada, apenas ignora.
            if (botao.classList.contains('ativo')) {
                return;
            }

            // Comportamento normal: Se clicou em uma aba DIFERENTE da atual,
            // limpa o estado ativo de todas as outras para abrir a nova.
            document.querySelectorAll('.btn-aba').forEach(b => {
                b.classList.remove('ativo');
                b.setAttribute('aria-expanded', 'false');
            });
            document.querySelectorAll('.painel-conteudo').forEach(p => p.classList.remove('ativo'));

            // Ativa milimetricamente a nova aba clicada e o seu respectivo painel
            botao.classList.add('ativo');
            botao.setAttribute('aria-expanded', 'true');
            const painelAlvo = document.getElementById(botao.getAttribute('aria-controls'));
            if (painelAlvo) {
                painelAlvo.classList.add('ativo');
            }
        });
    });
}

function iniciarAutoTabLogin() {
    const campoAgencia = document.getElementById('campo-agencia');
    const campoConta = document.getElementById('campo-conta');
    const campoDigito = document.getElementById('campo-digito');

    if (!campoAgencia || !campoConta || !campoDigito) return;

    function configurarAutoTab(campoAtual, proximoCampo) {
        campoAtual.addEventListener('input', function () {
            const limiteMaximo = parseInt(this.getAttribute('maxlength'), 10);

            if (this.value.length >= limiteMaximo) {
                proximoCampo.focus();
            }
        });
    }

    // Configura o fluxo contínuo dos campos:
    // 1. Terminou a Agência (4 dígitos) -> Vai para a Conta
    configurarAutoTab(campoAgencia, campoConta);

    // 2. Terminou a Conta (5 dígitos) -> Vai para o Dígito
    configurarAutoTab(campoConta, campoDigito);
}
function iniciarPainelLoginMobile() {
    const btn = document.getElementById('btn-acessar-mobile');
    const painel = document.getElementById('painel-login-mobile');

    if (!btn || !painel) return;

    // Controla unicamente a abertura e fechamento visual do card no celular
    btn.addEventListener('click', function () {
        const aberto = painel.classList.toggle('aberto');
        btn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
        painel.setAttribute('aria-hidden', aberto ? 'false' : 'true');
    });
}

function iniciarMenuHamburguerMobile() {
    const btnHamburguer = document.getElementById('btn-menu-hamburguer');
    const menuLateral = document.getElementById('menu-lateral-bradesco');

    if (btnHamburguer && menuLateral) {
        btnHamburguer.addEventListener('click', function (e) {
            e.stopPropagation();
            menuLateral.classList.toggle('menu-aberto-fullscreen');
        });

        // Fecha o menu se clicar na parte escura (fora da área branca do menu)
        menuLateral.addEventListener('click', function (e) {
            if (e.target === menuLateral) {
                menuLateral.classList.remove('menu-aberto-fullscreen');
            }
        });
    }
}


function desativarAvisosNativosRequired() {
    // Seleciona todos os inputs que possuem o atributo required
    const camposObrigatorios = document.querySelectorAll('input[required]');

    camposObrigatorios.forEach(campo => {
        campo.addEventListener('invalid', function (evento) {
            // remove COMPLETAMENTE o balão de "Preencha este campo"
            evento.preventDefault();
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarValidacaoNumerica();
    iniciarDropdownsHeader();
    iniciarMenuLateral();
    iniciarPainelBusca();
    iniciarCarrossel();
    iniciarBarraFlutuante();
    iniciarInteracaoBia();
    iniciarAbasRodape();

    // Acessibilidade
    iniciarMenuAcessibilidade();

    desativarAvisosNativosRequired();

    // Auto Tab
    iniciarAutoTabLogin();
    // Mobile
    iniciarPainelLoginMobile();
    iniciarMenuHamburguerMobile();
});