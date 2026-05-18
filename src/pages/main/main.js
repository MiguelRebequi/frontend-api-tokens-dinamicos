function iniciarValidacaoNumerica() {
    const inputs = document.querySelectorAll('.somente-numeros');

    inputs.forEach(input => {
        // 1. Bloqueia a digitação ao vivo (Tecla por tecla)
        input.addEventListener('keypress', function(e) {
            // Se o que foi digitado NÃO for um número de 0 a 9...
            if (!/^[0-9]$/.test(e.key)) {
                e.preventDefault(); // Impede a letra de aparecer no campo!
                alert("Favor digitar somente caracteres numéricos");
            }
        });

        // 2. Proteção contra o "Copiar e Colar" (Ctrl+V)
        input.addEventListener('input', function(e) {
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

function iniciarMenuAcessibilidade() {
    const btnAbrir = document.querySelector('.header-acessibilidade a');
    const menuAcessibilidade = document.getElementById('menu-acessibilidade');
    const btnFechar = document.getElementById('btn-fechar-acessibilidade');

    // Validação de segurança: Só roda se os elementos existirem na tela
    if (btnAbrir && menuAcessibilidade && btnFechar) {
        btnAbrir.addEventListener('click', function (evento) {
            evento.preventDefault();
            menuAcessibilidade.classList.toggle('mostrar');
        });

        btnFechar.addEventListener('click', function () {
            menuAcessibilidade.classList.remove('mostrar');
        });
    }
}

function iniciarMenuLateral() {
    const btnProdutos = document.getElementById('btn-produtos');
    const btnCanais = document.getElementById('btn-canais');
    const painelProdutos = document.getElementById('painel-produtos');
    const painelCanais = document.getElementById('painel-canais');

    if (btnProdutos && painelProdutos) {
        btnProdutos.addEventListener('click', function () {
            if (painelCanais) painelCanais.classList.remove('mostrar');
            painelProdutos.classList.toggle('mostrar');
        });
    }

    if (btnCanais && painelCanais) {
        btnCanais.addEventListener('click', function () {
            if (painelProdutos) painelProdutos.classList.remove('mostrar');
            painelCanais.classList.toggle('mostrar');
        });
    }
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

        void document.body.offsetWidth;

        slides[index].classList.add('ativa');
        dots[index].classList.add('ativa');
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
    });

    btnFechar.addEventListener('click', () => {
        estadoAtivo.classList.add('esconde-bia');
        estadoDescanso.classList.remove('esconde-bia');
    });
}


document.addEventListener('DOMContentLoaded', function () {
    iniciarValidacaoNumerica();
    iniciarMenuAcessibilidade();
    iniciarMenuLateral();
    iniciarPainelBusca();
    iniciarCarrossel();
    iniciarBarraFlutuante();
    iniciarInteracaoBia();
});
