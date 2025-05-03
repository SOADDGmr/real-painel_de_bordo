// Criando uma div para mostrar os serviços e uma para mostrar os informativos
$(document).ready(function() {
    // Referência para a primeira área de saída
    var outputArea1 = $('#data-output-area-1');
    // Verifica se area 1 ja existe, se não ele cria
    if (!outputArea1.length) {
        outputArea1 = $('<div>').attr('id', 'data-output-area-1').css({
			// Estilo da área
            'margin-bottom': '10px',
            'padding': '10px',
            'border': '1px solid #ccc',
            'color': 'white',
            'text-align': 'center',
            'font-size': '0.5vw'
        });
        // Insere a área 1 abaixo da navbar
        $('nav.navbar').after(outputArea1);
    }

    // Referência para a segunda área de saída
    var outputArea2 = $('#data-output-area-2');
    // Se a área 2 não existe, cria e estiliza
    if (!outputArea2.length) {
        outputArea2 = $('<div>').attr('id', 'data-output-area-2').css({
            'margin-top': '20px',
            'padding': '10px',
            'border': '1px solid #ccc',
            'background-color': '#f9f9f9'
        });
        // Insere a área 2 após a tabela de dados dos clientes
        $('#tabela-de-dados-clientes').after(outputArea2);
    }

    // As variáveis outputArea1 e outputArea2 agora referenciam as divs,
    // estejam elas recém-criadas ou já existentes no HTML.
    // Elas serão usadas por outros scripts.
});

// Script 2: Inicializa o DataTables na tabela e oculta colunas específicas.
$(document).ready(function() {
    // Verifica se a biblioteca DataTables está disponível e se a tabela existe
    if ($.fn.DataTable && $('#tabela-de-dados-clientes').length) {
        // Inicializa o DataTables na tabela
        var table = $('#tabela-de-dados-clientes').DataTable();

        // Verifica se a inicialização foi bem sucedida
        if (table) {
            // Define os índices das colunas a serem ocultadas (baseado em 0)
            var columnsToHide = [5, 8, 9, 10, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24];

            // Oculta as colunas especificadas
            if (columnsToHide.length) {
                try {
                    table.columns(columnsToHide).visible(false);
                } catch (e) {
                    console.error("Erro ao ocultar colunas do DataTables:", e);
                }
            }

            // A instância do DataTables (variável 'table') é crucial e será usada por outros scripts.
            // Certifique-se de que este script é carregado antes dos que dependem dela.
        }
    }
});

// Script 3: Injeta estilos CSS dinamicamente na seção <head> da página.
$(document).ready(function() {
    // Cria um novo elemento <style>
    var styleElement = document.createElement('style');

    // Define o conteúdo CSS do elemento style
    styleElement.textContent = `
        body {
            margin: 0;
            padding: 0;
            overflow-x: hidden; /* Impede scroll horizontal no body */
        }
        .container-principal-da-tabela {
            overflow-x: auto; /* Permite scroll horizontal dentro do container da tabela */
            max-width: 100vw; /* Garante que o container não exceda a largura da viewport */
        }
        #tabela-de-dados-clientes {
            width: 100% !important; /* Força a largura da tabela para 100% */
            min-width: 0; /* Permite que a tabela diminua até 0, se necessário (ajustar se precisar de largura mínima) */
            table-layout: fixed; /* Ajuda a manter a largura das colunas */
        }
        #data-output-area-2 {
            display: flex; /* Usa flexbox para layout dos cards */
            flex-wrap: wrap; /* Permite que os cards quebrem linha */
            gap: 10px; /* Espaço entre os cards */
        }
        #data-output-area-2 pre.info-card {
            width: calc(20% - 8px) !important; /* Define a largura de cada card (ajustado para 5 cards por linha com gap) */
            box-sizing: border-box; /* Inclui padding e border na largura */
            padding: 10px;
            border: 1px solid #ddd;
            background-color: #fff;
            margin: 0;
            white-space: pre-wrap; /* Preserva quebras de linha e espaços */
            word-wrap: break-word; /* Quebra palavras longas */
        }
    `;

    // Adiciona o elemento style ao cabeçalho do documento
    document.head.appendChild(styleElement);
});

// Script 4: Aplica o filtro "real" na caixa de pesquisa global do DataTables.
$(document).ready(function() {
    // Encontra o input da caixa de pesquisa global do DataTables usando seu ID gerado.
    // O ID é geralmente o ID da tabela + '_filter' + ' input'.
    var filterInput = $('#tabela-de-dados-clientes_filter input');
    var filterTerm = "real"; // O termo de filtro desejado

    // Verifica se o input de filtro foi encontrado
    if (filterInput.length) {
        try {
            // Define o valor do input de filtro
            filterInput.val(filterTerm);

            // Dispara um evento 'input' no elemento DOM nativo para simular a digitação
            // e acionar o mecanismo de filtro do DataTables.
            if (filterInput.get(0)) { // Verifica se o elemento DOM nativo existe
                filterInput.get(0).dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                console.warn("Elemento DOM do input de filtro não encontrado.");
            }

            console.log("Filtro '" + filterTerm + "' injetado e evento 'input' disparado.");

        } catch (e) {
            console.error("Erro ao aplicar filtro 'real' na caixa de pesquisa:", e);
        }
    } else {
        console.warn("Input da caixa de pesquisa do DataTables (#tabela-de-dados-clientes_filter input) não encontrado.");
    }
});

// Script 5: Ouve o evento 'draw.dt' do DataTables, processa os dados filtrados,
// agrega por número de serviço, calcula o CHI (Clientes * Horas Interrompidas)
// e popula as áreas de saída 1 e 2.
$(document).ready(function() {
    // Verifica se DataTables e a tabela existem
    if ($.fn.DataTable && $('#tabela-de-dados-clientes').length) {
        // Obtém a instância do DataTables (assumindo que já foi inicializada pelo Script 2)
        var table = $('#tabela-de-dados-clientes').DataTable();

        // Verifica se a instância da tabela foi obtida
        if (table) {
            // Obtém as referências para as áreas de saída (assumindo que foram criadas pelo Script 1)
            var outputArea1 = $('#data-output-area-1');
            var outputArea2 = $('#data-output-area-2');

            // Limite de clientes interrompidos para destaque na área 1
            var clientLimit = 50; // nl no seu código original

            // Adiciona um listener para o evento 'draw.dt' (quando a tabela é redesenhada, ex: após filtro)
            table.on('draw.dt', function() {
                // Limpa o conteúdo atual das áreas de saída
                outputArea1.empty();
                outputArea2.empty();

                // Flag para verificar se há algum serviço acima do limite de clientes
                var hasHighInterruptionServices = false;

                // Objeto para agregar os dados por número de serviço (nmb)
                var aggregatedData = {};

                // Itera sobre as linhas *visíveis e filtradas* da tabela
                table.rows({ search: 'applied' }).every(function() {
                    var rowData = this.data(); // Dados da linha atual

                    // Obtém as propriedades relevantes, usando fallback para 'N/A' ou 0
                    var serviceNumber = rowData.nmb || 'N/A';
                    var interruptedClients = parseInt(rowData.ncl, 10) || 0;
                    var timeElapsed = parseInt(rowData.tpe, 10) || 0; // Tempo Pendência (em horas)
                    // O CHI original (qch) não será somado diretamente, mas usado para o novo cálculo.
                    // var chiOriginal = parseInt(rowData.qch, 10) || 0;

                    var serviceType = rowData.tip || 'MA'; // Tipo Serviço (MA no seu código)
                    var feeder = rowData.nar || 'N/A'; // Alimentador
                    var voltage = rowData.vcv || 'N/A'; // VCV
                    var statusRaw = rowData.sta || 'Pendente'; // Status (sta no seu código)
                    var teamNumber = rowData.nve || 'Nenhum'; // Número da Equipe (nve no seu código)
                    var municipality = rowData.nmu || 'N/A'; // Município (nmu no seu código)
                    var trafoRef = rowData.trr || 'N/A'; // Trafo Referência
                    var polo = rowData.rag || 'N/A'; // Polo (rag no seu código)
                    var locationCode = rowData.cdl || 'N/A'; // Código Local (cdl no seu código)


                    // Agrega os dados pelo número de serviço
                    if (!aggregatedData[serviceNumber]) {
                        aggregatedData[serviceNumber] = {
                            nmb: serviceNumber,
                            nclSum: interruptedClients,
                            // Inicializa chiSum para ser calculado depois
                            chiSum: 0, // Será calculado após a agregação
                            tpeSum: timeElapsed,
                            tipS: serviceType,
                            nar: feeder,
                            vcv: voltage,
                            status: statusRaw, // Mantém o status original por enquanto
                            numV: teamNumber,
                            mun: municipality,
                            trafoRef: trafoRef,
                            pol: polo,
                            loc: locationCode
                            // Adicione outras propriedades que deseja manter ou unificar
                        };
                    } else {
                        // Soma os valores de clientes e tempo para serviços com o mesmo número
                        aggregatedData[serviceNumber].nclSum += interruptedClients;
                        aggregatedData[serviceNumber].tpeSum += timeElapsed;
                        // O CHI não é somado aqui, será calculado no final.
                    }
                });

                // --- NOVO PASSO: Calcular o CHI (Clientes * Horas Interrompidas) após a agregação ---
                for (var serviceNum in aggregatedData) {
                     if (aggregatedData.hasOwnProperty(serviceNum)) {
                         var aggregatedServiceData = aggregatedData[serviceNum];
                         // Calcula o CHI como Clientes Interrompidos * Tempo Pendência
                         aggregatedServiceData.chiSum = aggregatedServiceData.nclSum * aggregatedServiceData.tpeSum;
                     }
                }
                // --- FIM DO NOVO PASSO ---


                // Itera sobre os dados agregados para popular as áreas de saída
                for (var serviceNum in aggregatedData) {
                    // Verifica se a propriedade pertence ao objeto (evita propriedades herdadas)
                    if (aggregatedData.hasOwnProperty(serviceNum)) {
                        var aggregatedServiceData = aggregatedData[serviceNum];

                        // Verifica se o número total de clientes interrompidos excede o limite
                        if (aggregatedServiceData.nclSum > clientLimit) {
                            hasHighInterruptionServices = true;

                            // Determina o texto do status com base no valor bruto
                            var statusText = aggregatedServiceData.status; // Começa com o valor bruto
                            if (!statusText || statusText.trim() === 'P') {
                                statusText = "Pendente";
                            } else if (statusText.trim() === 'D') {
                                statusText = "Designado";
                            } else if (statusText.trim() === 'E') {
                                statusText = "Em Execução";
                            } else if (statusText.trim() === 'A') {
                                statusText = "Acionado";
                            } else {
                                statusText = "Pendente"; // Fallback para outros valores
                            }


                            // Cria a string para a primeira área de saída (resumo)
                            // Agora usando o chiSum calculado
                            var outputString1 = `O servico ${aggregatedServiceData.tipS} ${aggregatedServiceData.nmb}, tem ${aggregatedServiceData.nclSum} clientes interrompidos ha ${aggregatedServiceData.tpeSum}h, resultando em um CHI de ${aggregatedServiceData.chiSum} no alimentador (${aggregatedServiceData.nar}) de ${aggregatedServiceData.mun}.`;

                            // Cria um elemento <p> e adiciona à área de saída 1
                            var element1 = $('<p>').text(outputString1);
                            outputArea1.append(element1);

                            // Cria a string para a segunda área de saída (card de informações)
                            // Agora usando o chiSum calculado
                            var outputString2 = `*INFORMATIVO EMERGENCIAL ❗*\n\n*Polo:* ${aggregatedServiceData.pol}\n*Local:* ${aggregatedServiceData.loc}\n*Tipo/Numero:* ${aggregatedServiceData.tipS} ${aggregatedServiceData.nmb}\n*Alimentador:* ${aggregatedServiceData.nar}\n*Clientes interrompidos:* ${aggregatedServiceData.nclSum}\n*Equipe:* ${aggregatedServiceData.numV}\n*Situacao:* ${statusText}\n*Observacao:*`;

                            // Cria um elemento <pre> com a classe 'info-card' e adiciona à área de saída 2
                            var element2 = $('<pre>').addClass('info-card').text(outputString2);
                            outputArea2.append(element2);
                        }
                    }
                }

                // Define a cor de fundo da área de saída 1 com base na flag
                outputArea1.css('background-color', hasHighInterruptionServices ? 'red' : 'green');
            });
        }
    }
});

// Script 7: Contém funções de utilitário, como a recarga automática da página.
setInterval(function() {
    location.reload();
}, 120000);

// Script para modificar o título da página e o texto do título na barra de navegação
// usando JavaScript, pois não há acesso direto ao HTML.
$(document).ready(function() {
    // 1. Modificar a tag <title> no cabeçalho da página
    // Seleciona a tag <title>
    var pageTitleElement = $('head title');
    // Verifica se a tag title foi encontrada
    if (pageTitleElement.length) {
        // Define o novo título da página
        pageTitleElement.text('Painel de Ocorrências Real');
        console.log("Título da tag <title> modificado para 'Painel de Ocorrências Real'.");
    } else {
        console.warn("Tag <title> não encontrada no cabeçalho.");
    }

    // 2. Modificar o texto do título na barra de navegação
    // Seleciona o elemento <a> com o ID 'aTitle'
    var navTitleElement = $('#aTitle');
    // Verifica se o elemento aTitle foi encontrado
    if (navTitleElement.length) {
        // Define o novo texto para o título na barra de navegação
        navTitleElement.text('Painel de Ocorrências Real');
        console.log("Texto do elemento #aTitle modificado para 'Painel de Ocorrências Real'.");
    } else {
        console.warn("Elemento #aTitle não encontrado na barra de navegação.");
    }
});

// Script para ocultar um elemento específico identificado por um XPath.
$(document).ready(function() {
    // O XPath para o elemento alvo a ser ocultado
    var targetElementXPath = "/html/body/div[2]/div[2]";

    try {
        // Avalia o XPath para encontrar o elemento
        var result = document.evaluate(
            targetElementXPath,
            document, // Contexto de busca: o documento inteiro
            null,     // Namespace resolver (não necessário para este XPath)
            XPathResult.FIRST_ORDERED_NODE_TYPE, // Retorna o primeiro nó que corresponde
            null
        );

        // Obtém o elemento encontrado
        var targetElement = result.singleNodeValue;

        // Verifica se o elemento foi encontrado
        if (targetElement) {
            // Aplica o estilo para ocultar o elemento
            targetElement.style.display = 'none';
            console.log("Elemento com XPath '" + targetElementXPath + "' ocultado.");
        } else {
            console.warn("Elemento com XPath '" + targetElementXPath + "' não encontrado para ocultar.");
        }

    } catch (e) {
        console.error("Erro ao ocultar elemento usando XPath:", e);
    }
});

// Script para mover um elemento de uma posição para outra,
// substituindo e removendo elementos especificados por XPath.
// Também adiciona estilos para posicionar o elemento movido na extrema direita e centralizado verticalmente,
// removendo seu background e borda para exibir apenas o texto.
$(document).ready(function() {
    // XPath do elemento que será movido (a origem)
    var sourceElementXPath = "/html/body/div[2]/div[3]/div[2]";
    // XPath do elemento que será substituído (o destino na barra de navegação)
    var targetElementXPath = "/html/body/nav/div/div[3]";
    // XPath do elemento pai que será removido após a movimentação (o container original da div movida)
    var parentToRemoveXPath = "/html/body/div[2]/div[3]";

    try {
        // 1. Encontrar os elementos usando XPath
        var sourceResult = document.evaluate(sourceElementXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var targetResult = document.evaluate(targetElementXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var parentToRemoveResult = document.evaluate(parentToRemoveXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        var sourceElement = sourceResult.singleNodeValue;
        var targetElement = targetResult.singleNodeValue;
        var parentToRemoveElement = parentToRemoveResult.singleNodeValue;

        // Verifica se todos os elementos necessários foram encontrados
        if (sourceElement && targetElement && parentToRemoveElement) {
            // 2. Mover o elemento de origem para o lugar do elemento de destino
            var targetParent = targetElement.parentNode; // Obtém o pai do elemento de destino (o div.row dentro do nav)

            if (targetParent) {
                // Substitui o elemento de destino pelo elemento de origem na nova posição
                targetParent.replaceChild(sourceElement, targetElement);
                console.log("Elemento '" + sourceElementXPath + "' movido para o lugar de '" + targetElementXPath + "'.");

                // --- Adicionar estilos para posicionar o elemento movido e remover background/borda ---
                // O elemento movido agora é um filho direto do div.row dentro do nav.
                // Para posicioná-lo na extrema direita e centralizado verticalmente:
                // 1. Tornar o pai (div.row) um container flex.
                // 2. Centralizar os itens flex verticalmente.
                // 3. Usar margin-left: auto no elemento movido para empurrá-lo para a direita.
                // 4. Remover background e borda.

                // Aplicar display: flex e align-items: center ao pai (div.row)
                targetParent.style.display = 'flex';
                targetParent.style.alignItems = 'center'; // Centraliza os filhos verticalmente

                // Aplicar margin-left: auto e remover padding ao elemento movido
                sourceElement.style.marginLeft = 'auto'; // Empurra o elemento para a direita na linha flex
                sourceElement.style.padding = '0'; // Remove qualquer padding que possa estar vindo do estilo original

                // Remover background e borda
                sourceElement.style.backgroundColor = 'transparent'; // Define o background como transparente
                sourceElement.style.border = 'none'; // Remove a borda

                // Opcional: Remover estilos de largura fixa ou float se existirem e estiverem causando problemas
                sourceElement.style.width = 'auto'; // Garante que a largura seja automática
                sourceElement.style.float = 'none'; // Garante que não haja float

                console.log("Estilos de posicionamento, remoção de background e borda aplicados ao elemento movido.");
                // --- Fim da adição de estilos ---


                // 3. Remover o elemento pai especificado (o container original da div movida)
                parentToRemoveElement.remove();
                console.log("Elemento '" + parentToRemoveXPath + "' removido.");

            } else {
                console.warn("Elemento pai do destino '" + targetElementXPath + "' não encontrado. Não foi possível mover o elemento.");
            }

        } else {
            // Mensagens de aviso se algum elemento não for encontrado
            if (!sourceElement) console.warn("Elemento de origem '" + sourceElementXPath + "' não encontrado. Não foi possível realizar a operação.");
            if (!targetElement) console.warn("Elemento de destino '" + targetElementXPath + "' não encontrado. Não foi possível realizar a operação.");
            if (!parentToRemoveElement) console.warn("Elemento pai a ser removido '" + parentToRemoveXPath + "' não encontrado. A remoção não será realizada.");
        }

    } catch (e) {
        console.error("Erro ao mover, remover e estilizar elementos usando XPath:", e);
    }
});

// Script para encontrar e remover o elemento container de carregamento
// identificado por XPath. Remover o container também removerá seus filhos.

$(document).ready(function() {
    // XPath da div container da barra de progresso a ser removida.
    // Remover este elemento também removerá a barra de progresso que está dentro dele.
    var progressContainerXPath = "/html/body/div[3]/div/div/div[3]";

    try {
        // Encontrar o elemento container usando XPath
        var progressContainerResult = document.evaluate(
            progressContainerXPath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        var progressContainerElement = progressContainerResult.singleNodeValue;

        // Verifica se o elemento container foi encontrado
        if (progressContainerElement) {
            // Remove o elemento container da barra de progresso do DOM
            progressContainerElement.remove();
            console.log("Elemento container de carregamento ('" + progressContainerXPath + "') removido.");
        } else {
            console.warn("Elemento container de carregamento ('" + progressContainerXPath + "') não encontrado para remover.");
        }

    } catch (e) {
        console.error("Erro ao remover o elemento container de carregamento usando XPath:", e);
    }
});
