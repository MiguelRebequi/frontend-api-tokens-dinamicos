/**
 * Injeta o Widget Flutuante idêntico ao original do Bradesco
 */
function injetarPainelAvancadoDOM() {
    if (document.getElementById('painel-acessibilidade-avancada')) return;

    const URLAtual = window.location.pathname;
    const ehIndex = URLAtual.endsWith('index.html') || URLAtual === '/' || !URLAtual.includes('/pages/');

    // Se for index, busca direto da raiz. Se for subpágina, volta duas pastas com ../../
    const caminhoLogo = ehIndex 
        ? "assets/images/logo/logo-bradesco.svg" 
        : "../../assets/images/logo/logo-bradesco.svg";

    const painelHTML = `
        <div class="painel-acesso-container">
            
            <div class="painel-acesso-topo">
                <div class="topo-icones-esq">
                    <img src="${caminhoLogo}" alt="Bradesco">
                    <svg viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,19.93C7.05,19.43 4,16.04 4,12C4,7.96 7.05,4.57 11,4.07V19.93M13,4.07C16.95,4.57 20,7.96 20,12C20,16.04 16.95,19.43 13,19.93V4.07Z" /></svg>
                    <svg viewBox="0 0 24 24"><path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z" /></svg>
                </div>
                <div class="topo-icones-dir">
                    <svg viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
                    <svg viewBox="0 0 24 24"><path d="M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z" /></svg>
                    <svg id="btn-fechar-painel-avancado" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
                </div>
            </div>

            <button class="btn-ajuda-acesso">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7C10.89,7 10,7.89 10,9H8C8,6.79 9.79,5 12,5C14.21,5 16,6.79 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" /></svg>
                Preciso de ajuda. Como usar?
            </button>

            <div class="painel-acesso-corpo">
                
                <div class="box-grupo-cores">
                    <div class="acesso-grid-cores">
                        <button class="btn-acesso-pequeno" id="btn-contraste-escuro">
                            <span class="icon-help-hover">?</span>
                            <svg class="ryb-ignore" viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/png">
                                <path d="M10.433 0.412014C13.7142 -0.401392 16.8851 0.0397771 19.5735 1.29435C20.056 1.51494 20.1387 2.17669 19.7113 2.47999C16.1268 4.96157 13.7831 9.09753 13.7831 13.785C13.7831 18.4724 16.1268 22.6083 19.7113 25.0899C20.1525 25.3932 20.0698 26.055 19.5873 26.2756C17.8226 27.1027 15.8511 27.5715 13.7831 27.5715C5.44227 27.5715 -1.17527 20.1543 0.175815 11.5791C1.01679 6.17478 5.12518 1.70795 10.433 0.412014Z"></path>
                            </svg>
                            <span class="txt">Contraste escuro</span>
                        </button>
                        
                        <button class="btn-acesso-pequeno" id="btn-monocromatico">
                            <span class="icon-help-hover">?</span>
                            <svg viewBox="0 0 24 24"><path d="M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22M12,4V20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/></svg>
                            <span class="txt">Saturação<br>Monocromática</span>
                        </button>
                    </div>
                </div>

                <div class="acesso-grid-ferramentas">
                    <button class="btn-acesso-grande" id="btn-cursor-grande">
                        <span class="icon-help-hover">?</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="ryb-ignore" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="40" viewBox="0 0 24 24">
                            <defs>
                            <clipPath id="clip-path">
                                <rect id="Retângulo_21956" data-name="Retângulo 21956" width="24" height="24" transform="translate(0 0)"></rect>
                            </clipPath>
                            </defs>
                            <g id="Grupo_7395" data-name="Grupo 7395" transform="translate(0 0)" clip-path="url(#clip-path)">
                            <path id="Caminho_16201" data-name="Caminho 16201" d="M25.122,18.046a3.477,3.477,0,0,1-1.212.973,12.128,12.128,0,0,0-4.57,4.312c-.163.25-.282.528-.43.787a3.122,3.122,0,0,1-.953,1.068,1.793,1.793,0,0,1-2.258-.15,3.5,3.5,0,0,1-.915-1.361q-1.34-3.34-2.673-6.681-.647-1.607-1.286-3.218a3.738,3.738,0,0,1-.3-1.367,1.779,1.779,0,0,1,1.656-1.9,1.656,1.656,0,0,1,.3,0,3.781,3.781,0,0,1,1.354.313l9.827,3.936a3.485,3.485,0,0,1,1.377.922,1.8,1.8,0,0,1,.08,2.36Z" transform="translate(-6.022 -6.012)"></path>
                            </g>
                        </svg>
                        <span class="txt">Cursor grande</span>
                    </button>

                    <button class="btn-acesso-grande" id="btn-zoom-texto">
                        <span class="icon-help-hover">?</span>
                        <svg viewBox="0 0 24 24"><path d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z" /></svg>
                        <span class="txt">Zoom</span>
                    </button>
                </div>

            </div>
        </div>
    `;

    const divPai = document.createElement('div');
    divPai.id = 'painel-acessibilidade-avancada';
    divPai.className = 'painel-acesso-escondido';
    divPai.setAttribute('role', 'dialog');
    divPai.innerHTML = painelHTML;

    document.body.appendChild(divPai);
}

export function iniciarMenuAcessibilidade() {
    injetarPainelAvancadoDOM();

    const btnAbrir = document.getElementById('btn-abrir-acessibilidade');
    const btnFechar = document.getElementById('btn-fechar-acessibilidade');
    const menu = document.getElementById('menu-acessibilidade');
    const painelAvancado = document.getElementById('painel-acessibilidade-avancada');
    const btnFecharPainelAvancado = document.getElementById('btn-fechar-painel-avancado');
    const btnMaisFerramentas = document.querySelector('a[title="Acessar mais Ferramentas"]');

    // Mapeamento dos novos Botões Nativos
    const btnContraste = document.getElementById('btn-contraste-escuro');
    const btnMono = document.getElementById('btn-monocromatico');
    const btnCursor = document.getElementById('btn-cursor-grande');
    const btnZoom = document.getElementById('btn-zoom-texto');

    // --- MINI DROPDOWN ORIGINAL ---
    if (btnAbrir && menu) {
        btnAbrir.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('mostrar');
            btnAbrir.setAttribute('aria-expanded', menu.classList.contains('mostrar'));
        });
    }

    if (btnFechar && menu) {
        btnFechar.addEventListener('click', () => {
            menu.classList.remove('mostrar');
            btnAbrir.setAttribute('aria-expanded', 'false');
        });
    }

    // --- GATILHO DA NOVA GAVETA LATERAL ---
    if (btnMaisFerramentas && painelAvancado && menu) {
        btnMaisFerramentas.addEventListener('click', (e) => {
            e.preventDefault();
            menu.classList.remove('mostrar');
            painelAvancado.classList.remove('painel-acesso-escondido');
        });
    }

    if (btnFecharPainelAvancado && painelAvancado) {
        btnFecharPainelAvancado.addEventListener('click', () => {
            painelAvancado.classList.add('painel-acesso-escondido');
        });
    }

    // --- NOVA LÓGICA DE PERSISTÊNCIA PARA BOTÕES ---
    const ferramentas = [
        { btn: btnContraste, classe: 'modo-contraste-escuro', key: 'acesso-contraste', target: document.body },
        { btn: btnMono, classe: 'modo-monocromatico', key: 'acesso-mono', target: document.body },
        { btn: btnCursor, classe: 'modo-cursor-grande', key: 'acesso-cursor', target: document.body },
        { btn: btnZoom, classe: 'modo-zoom-texto', key: 'acesso-zoom', target: document.documentElement }
    ];

    ferramentas.forEach(item => {
        if (!item.btn) return;
        
        // Carrega o estado inicial do LocalStorage
        const salvo = localStorage.getItem(item.key) === 'true';
        if (salvo) {
            item.target.classList.add(item.classe);
            item.btn.classList.add('ativo'); // Pinta o botão de branco
        }

        // Adiciona evento de clique para ativar/desativar
        item.btn.addEventListener('click', () => {
            // Alterna a classe na página e retorna o novo estado (true/false)
            const estaAtivo = item.target.classList.toggle(item.classe);
            
            // Alterna o estilo visual do botão
            item.btn.classList.toggle('ativo', estaAtivo);
            
            // Salva a decisão no banco do navegador
            localStorage.setItem(item.key, estaAtivo ? 'true' : 'false');
        });
    });

    if (painelAvancado) {
        painelAvancado.addEventListener('click', (e) => {
            if (e.target === painelAvancado) painelAvancado.classList.add('painel-acesso-escondido');
        });
    }
}