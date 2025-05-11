// ==UserScript==
// @name         Painel de Bordo ++
// @namespace    marco.guedes.e259671
// @version      0.0.1
// @description  Implementa funções ao painel de Bordo Cemig
// @author       Marco Guedes
// @match        *https://geo.cemig.com.br/painel_de_bordo/Graficos/ClientesInterrompidos*
// @updateURL    https://raw.githubusercontent.com/SOADDGmr/real-painel_de_bordo/main/clientesInterrompidos.js
// @downloadURL  https://raw.githubusercontent.com/SOADDGmr/real-painel_de_bordo/main/clientesInterrompidos.js
// ==/UserScript==

$(document).ready(function() {
  const selectElement = $('#selGerencia');

  // Certifique-se de que o <select> tem o atributo 'multiple' no HTML.
  if (selectElement.length > 0 && selectElement.prop('multiple')) {
    // Para selecionar "LF-Cons. Lafaiete" (value="LF") e "SJ-São João Del Rei" (value="SJ")
    selectElement.val(['LF', 'SJ']);
    console.log("Opções 'LF' e 'SJ' selecionadas.");

    // Se você precisar disparar o evento 'change' (útil se há outros scripts escutando a mudança)
    // selectElement.trigger('change');

  } else if (selectElement.length > 0 && !selectElement.prop('multiple')) {
    console.log("O elemento select NÃO tem o atributo 'multiple'. Não é possível selecionar múltiplas opções.");
  } else {
    console.log("Elemento select com ID 'selGerencia' não encontrado.");
  }
});
