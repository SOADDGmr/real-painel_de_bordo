console.log("Custom JS: content.js loaded.");

$(document).ready(function(){
 console.log("Custom JS: DOM is ready.");

 var o1 = $('#data-output-area-1');
 if (o1.length === 0) {
  o1 = $('<div>').attr('id', 'data-output-area-1').css({
   'margin-bottom': '10px',
   'padding': '10px',
   'border': '1px solid #ccc',
   'color': 'white',
   'text-align': 'center',
   'font-size': '20pt'
  });
  $('nav.navbar').after(o1);
  console.log("Custom JS: Output area 1 created and inserted.");
 } else {
     console.log("Custom JS: Output area 1 already exists.");
 }

 var o2 = $('#data-output-area-2');
 if (o2.length === 0) {
  o2 = $('<div>').attr('id', 'data-output-area-2').css({
   'margin-top': '20px',
   'padding': '10px', // Mantemos o padding do container
   'border': '1px solid #ccc', // Mantemos a borda do container
   'background-color': '#f9f9f9' // Mantemos o fundo do container
   // Estilos Flexbox movidos para o bloco <style>
  });
  $('#tabela-de-dados-clientes').after(o2);
   console.log("Custom JS: Output area 2 created and inserted.");
 } else {
     console.log("Custom JS: Output area 2 already exists.");
 }


 if($.fn.DataTable && $('#tabela-de-dados-clientes').length>0){
  console.log("Custom JS: DataTables function and table element found.");
  var t=$('#tabela-de-dados-clientes').DataTable();
  if(t){
   console.log("Custom JS: DataTables instance obtained.");
   var hc=[5,8,9,10,12,13,14,15,16,17,20,21,22,23,24];
   if(hc.length>0){
    try{ t.columns(hc).visible(false); console.log("Custom JS: Columns hidden."); }catch(e){ console.error("Custom JS: Error hiding columns:", e); }
   }
   var se=document.createElement('style');
   se.textContent=`
    body{margin:0;padding:0;overflow-x:hidden;}
    .container-principal-da-tabela{overflow-x:auto;max-width:100vw;}
    #tabela-de-dados-clientes{width:100%!important;min-width:0;table-layout:fixed;}
    /* Estilos para o container dos cartões (movidos para cá) */
    #data-output-area-2 {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    /* Estilo para os cartões individuais na segunda área (mais específico) */
    #data-output-area-2 pre.info-card {
        width: calc(20% - 10px) !important; /* Adicionado !important para forçar */
        box-sizing: border-box;
        padding: 10px;
        border: 1px solid #ddd;
        background-color: #fff;
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
   `;
   document.head.appendChild(se);
   console.log("Custom JS: CSS injected.");

   var fi=$('#tabela-de-dados-clientes_filter input');
   var tm="real";
   if(fi.length>0){
    try{
     fi.val(tm);
     fi.get(0).dispatchEvent(new Event('input',{bubbles:true}));
     console.log("Custom JS: Filter input found and value set.");
    }catch(e){ console.error("Custom JS: Error applying filter:", e); }
   } else {
       console.log("Custom JS: Filter input not found.");
   }


   console.log("Custom JS: Attaching 'draw.dt' listener.");
   t.on('draw.dt', function(){
    console.log("Custom JS: 'draw.dt' event fired. Processing rows.");

    o1.empty();
    o2.empty();
    console.log("Custom JS: Output areas cleared.");

    var nl=50; // Limite de clientes interrompidos
    var fh=false;
    var as={}; // Objeto para dados agregados

    var rows = t.rows({search:'applied'});
    console.log("Custom JS: Number of rows found by {search:'applied'}:", rows.nodes().length); // Log o número de linhas encontradas

    rows.every(function(){
     var rd=this.data();
     var sn=rd.nmb||'N/A';
     var nt=rd.ncl;
     var nn=parseInt(nt,10);

     // --- Logs de depuração dentro do loop every ---
     console.log("--- Processing Row ---");
     console.log("Row Data:", rd);
     console.log("Service Number (nmb):", sn);
     console.log("NCL Text:", nt);
     console.log("NCL Numeric:", nn);
     // --- Fim dos Logs de depuração ---


     if (!as[sn]) {
      as[sn] = {
       nmb: sn,
       nclSum: isNaN(nn) ? 0 : nn,
       chiSum: parseInt(rd.qch, 10) || 0,
       tpeSum: parseInt(rd.tpe, 10) || 0,
       tipS: rd.tip || 'MA',
       nar: rd.nar || 'N/A',
       vcv: rd.vcv || 'N/A',
       status: rd.sta || 'Pendente',
       numV: rd.nve || 'Nenhum',
       mun: rd.nmu || 'N/A',
       trafoRef: rd.trr || 'N/A',
       pol: rd.rag || 'N/A',
       loc: rd.cdl || 'N/A'
      };
      console.log("Custom JS: Created new aggregated entry for service:", sn);
     } else {
      as[sn].nclSum += isNaN(nn) ? 0 : nn;
      as[sn].chiSum += parseInt(rd.qch, 10) || 0;
      as[sn].tpeSum += parseInt(rd.tpe, 10) || 0;
      console.log("Custom JS: Aggregated data for service:", sn, "New nclSum:", as[sn].nclSum);
     }
    });

    console.log("Custom JS: Finished aggregating data. Aggregated Services:", as); // Log objeto agregado completo

    for (var sn in as) {
     if (as.hasOwnProperty(sn)) {
      var ad=as[sn];

      // --- Logs de depuração dentro do loop for...in ---
      console.log("--- Processing Aggregated Service:", sn, "---");
      console.log("Aggregated Data:", ad);
      console.log("Aggregated NCL Sum:", ad.nclSum);
      console.log("Condition: ad.nclSum > nl ?", ad.nclSum > nl);
      // --- Fim dos Logs de depuração ---

      if (ad.nclSum > nl) {
       fh=true;
       console.log("Custom JS: Condition met for aggregated service:", sn);
       var status=ad.status;
       if (!status || status.trim() === 'P') {
            status = "Pendente";
        } else if (status.trim() === 'D') {
            status = "Designado";
        } else if (status.trim() === 'E') {
            status = "Em Execução";
        } else if (status.trim() === 'A') {
            status = "Acionado";
        } else {
            status = "Pendente";
        }

       var s1 = `O servico ${ad.tipS} ${ad.nmb}, tem ${ad.nclSum} clientes interrompidos ha ${ad.tpeSum}h, resultando em um CHI de ${ad.chiSum} no alimentador (${ad.nar}) de ${ad.mun}.`;
       var e1 = $('<p>').text(s1);
       o1.append(e1);
       console.log("Custom JS: String 1 appended for service:", sn);

       var s2 = `*INFORMATIVO EMERGENCIAL ❗*\n\n*Polo:* ${ad.pol}\n*Local:* ${ad.loc}\n*Tipo/Numero:* ${ad.tipS} ${ad.nmb}\n*Alimentador:* ${ad.nar}\n*Clientes interrompidos:* ${ad.nclSum}\n*Equipe:* ${ad.numV}\n*Situacao:* ${status}\n*Observacao:*`;
       var e2 = $('<pre>').addClass('info-card').text(s2);
       o2.append(e2);
       console.log("Custom JS: String 2 (card) appended for service:", sn);
      } else {
          console.log("Custom JS: Condition not met for aggregated service:", sn);
      }
     }
    }

    console.log("Custom JS: Finished processing aggregated data.");
    if (fh) {
        o1.css('background-color', 'red');
        console.log("Custom JS: Set oa1 background to RED.");
    } else {
        o1.css('background-color', 'green');
        console.log("Custom JS: Set oa1 background to GREEN.");
    }
   });
  } else {
      console.log("Custom JS: Could not obtain DataTables instance.");
  }
 } else {
     console.log("Custom JS: DataTables function or table element not found.");
 }
});

setInterval(function() {
    console.log("Custom JS: Reloading page...");
    location.reload();
}, 120000);
