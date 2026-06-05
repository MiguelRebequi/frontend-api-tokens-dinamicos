/**
 * Inicia os comportamentos do menu de acessibilidade (Abre/Fecha)
 */
export function iniciarMenuAcessibilidade() {
    const btnAbrir = document.getElementById('btn-abrir-acessibilidade');
    const menuAcessibilidade = document.getElementById('menu-acessibilidade');
    const btnFechar = document.getElementById('btn-fechar-acessibilidade');

    if (btnAbrir && menuAcessibilidade && btnFechar) {
        btnAbrir.addEventListener('click', function (evento) {
            evento.preventDefault();
            evento.stopPropagation();

            const estaAberto = menuAcessibilidade.classList.toggle('mostrar');
            btnAbrir.setAttribute('aria-expanded', estaAberto ? 'true' : 'false');

            if (estaAberto) {
                btnFechar.focus();
            }
        });

        btnFechar.addEventListener('click', function (evento) {
            evento.stopPropagation();
            menuAcessibilidade.classList.remove('mostrar');
            btnAbrir.setAttribute('aria-expanded', 'false');
            btnAbrir.focus();
        });
        
        document.addEventListener('click', function(evento) {
            if (!menuAcessibilidade.contains(evento.target) && !btnAbrir.contains(evento.target)) {
                menuAcessibilidade.classList.remove('mostrar');
                btnAbrir.setAttribute('aria-expanded', 'false');
            }
        });
    }
}