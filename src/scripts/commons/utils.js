export function formatarDataAtual() {
    const hoje = new Date();
    const opcoesSemana = { weekday: 'long' };
    let diaSemana = hoje.toLocaleDateString('pt-BR', opcoesSemana);
    diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
    const dataFormatada = hoje.toLocaleDateString('pt-BR');
    
    return `${diaSemana}, ${dataFormatada}`; // Apenas retorna o texto
}