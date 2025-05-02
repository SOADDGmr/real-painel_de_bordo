$(document).ready(function(){
    var o1=$('#data-output-area-1');
    if(!o1.length){
        o1=$('<div>').attr('id','data-output-area-1').css({
            'margin-bottom':'10px',
            'padding':'10px',
            'border':'1px solid #ccc',
            'color':'white',
            'text-align':'center',
            'font-size':'20pt'
        });
        $('nav.navbar').after(o1);
    }

    var o2=$('#data-output-area-2');
    if(!o2.length){
        o2=$('<div>').attr('id','data-output-area-2').css({
            'margin-top':'20px',
            'padding':'10px',
            'border':'1px solid #ccc',
            'background-color':'#f9f9f9'
        });
        $('#tabela-de-dados-clientes').after(o2);
    }

    if($.fn.DataTable && $('#tabela-de-dados-clientes').length){
        var t=$('#tabela-de-dados-clientes').DataTable();
        if(t){
            var hc=[5,8,9,10,12,13,14,15,16,17,20,21,22,23,24];
            if(hc.length){try{t.columns(hc).visible(false);}catch(e){console.error(e);}}
            var se=document.createElement('style');
            se.textContent=`
    body{margin:0;padding:0;overflow-x:hidden;}
    .container-principal-da-tabela{overflow-x:auto;max-width:100vw;}
    #tabela-de-dados-clientes{width:100%!important;min-width:0;table-layout:fixed;}
    #data-output-area-2{display:flex;flex-wrap:wrap;gap:10px;}
    #data-output-area-2 pre.info-card{
        width:calc(20% - 8px) !important;
        box-sizing:border-box;
        padding:10px;
        border:1px solid #ddd;
        background-color:#fff;
        margin:0;
        white-space:pre-wrap;
        word-wrap:break-word;
    }
   `;
      document.head.appendChild(se);
      var fi=$('#tabela-de-dados-clientes_filter input');
      var tm="real";
      if(fi.length){try{fi.val(tm);fi.get(0).dispatchEvent(new Event('input',{bubbles:true}));}catch(e){console.error(e);}}

      t.on('draw.dt',function(){
          o1.empty();
          o2.empty();
          var nl=100
          var fh=false;
          var as={};
          t.rows({search:'applied'}).every(function(){
              var rd=this.data();
              var sn=rd.nmb||'N/A';
              var nt=rd.ncl;
              var nn=parseInt(nt,10);
              if(!as[sn]){
                  as[sn]={
                      nmb:sn,
                      nclSum:isNaN(nn)?0:nn,
                      chiSum:parseInt(rd.qch,10)||0,
                      tpeSum:parseInt(rd.tpe,10)||0,
                      tipS:rd.tip||'MA',
                      nar:rd.nar||'N/A',
                      vcv:rd.vcv||'N/A',
                      status:rd.sta||'Pendente',
                      numV:rd.nve||'Nenhum',
                      mun:rd.nmu||'N/A',
                      trafoRef:rd.trr||'N/A',
                      pol:rd.rag||'N/A',
                      loc:rd.cdl||'N/A'
                  };
              }else{
                  as[sn].nclSum+=isNaN(nn)?0:nn;
                  as[sn].chiSum+=parseInt(rd.qch,10)||0;
                  as[sn].tpeSum+=parseInt(rd.tpe,10)||0;
              }
          });

          for(var sn in as){
              if(as.hasOwnProperty(sn)){
                  var ad=as[sn];
                  if(ad.nclSum > nl){
                      fh=true;
                      var status=ad.status;
                      if(!status||status.trim()==='P'){
                          status="Pendente";
                      }else if(status.trim()==='D'){
                          status="Designado";
                      }else if(status.trim()==='E'){
                          status="Em Execução";
                      }else if(status.trim()==='A'){
                          status="Acionado";
                      }else{
                          status="Pendente";
                      }
                      var s1=`O servico ${ad.tipS} ${ad.nmb}, tem ${ad.nclSum} clientes interrompidos ha ${ad.tpeSum}h, resultando em um CHI de ${ad.chiSum} no alimentador (${ad.nar}) de ${ad.mun}.`;
                      var e1=$('<p>').text(s1);
                      o1.append(e1);
                      var s2=`*INFORMATIVO EMERGENCIAL ❗*\n\n*Polo:* ${ad.pol}\n*Local:* ${ad.loc}\n*Tipo/Numero:* ${ad.tipS} ${ad.nmb}\n*Alimentador:* ${ad.nar}\n*Clientes interrompidos:* ${ad.nclSum}\n*Equipe:* ${ad.numV}\n*Situacao:* ${status}\n*Observacao:*`;
                      var e2=$('<pre>').addClass('info-card').text(s2);
                      o2.append(e2);
                  }
              }
          }

          o1.css('background-color',fh?'red':'green');
      });
  }
 }
});

setInterval(function(){location.reload();},120000);
