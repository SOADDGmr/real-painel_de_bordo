// Script para criar e estilizar as áreas de saída no painel de bordo.

$(document).ready(function() {
    // Cria a primeira área de saída se ela não existir
    var outputArea1 = $('#data-output-area-1');
    if (!outputArea1.length) {
        outputArea1 = $('<div>').attr('id', 'data-output-area-1').css({
            'margin-bottom': '10px',
            'padding': '10px',
            'border': '1px solid #ccc', // Adiciona uma borda leve
            'color': 'white', // Cor do texto branco
            'text-align': 'center', // Centraliza o texto
            'font-size': '20pt', // Tamanho da fonte maior
            'background-color': '#337ab7' // Cor de fundo azul (exemplo, ajuste conforme necessário)
        });
        // Insere a área de saída logo após a barra de navegação
        $('nav.navbar').after(outputArea1);
    }

    // Cria a segunda área de saída se ela não existir
    var outputArea2 = $('#data-output-area-2');
    if (!outputArea2.length) {
        outputArea2 = $('<div>').attr('id', 'data-output-area-2').css({
            'margin-top': '20px',
            'padding': '10px',
            'border': '1px solid #ccc', // Adiciona uma borda leve
            'background-color': '#f9f9f9' // Cor de fundo cinza claro
        });
        // Insere a área de saída após a tabela de dados dos clientes
        $('#tabela-de-dados-clientes').after(outputArea2);
    }
});
