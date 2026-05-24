import { formatarDataAtual } from '../../scripts/commons/utils.js';
import { gerenciarNavbarAtiva } from '../../scripts/commons/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('data-atual').textContent = formatarDataAtual();
    gerenciarNavbarAtiva();
});