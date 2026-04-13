// ====================== IMPRIMIR ======================
function imprimirOrcamento() {
  const cfg = getConfigs();
  const items = [];
  let subtotal = 0;
  document.querySelectorAll('#orc-items .item-row').forEach(row => {
    const descInput = row.querySelector('input[type=text]');
    const numInputs = row.querySelectorAll('input[type=number]');
    const qtd  = parseFloat(numInputs[0]?.value) || 0;
    const unit = parseFloat(numInputs[1]?.value) || 0;
    const total = qtd * unit;
    subtotal += total;
    if (descInput && descInput.value.trim()) items.push({ desc: descInput.value, qtd, unit, total });
  });
  const totalFinal = document.getElementById('orc-total').textContent;
  const desc = parseFloat(document.getElementById('orc-desconto').value) || 0;
  const tipo = document.getElementById('orc-desc-tipo').value;
  const descValor = tipo === 'pct' ? subtotal * (desc / 100) : desc;
  const obs = document.getElementById('orc-obs').value || '';
  const laudoRef = document.getElementById('orc-laudo').value || '';
  const garantia = cfg.garantia || '90';

  // Tentar puxar dados do equipamento do laudo ativo ou da tela de laudo
  const marca = document.getElementById('eq-marca')?.value || '';
  const modelo = document.getElementById('eq-modelo')?.value || '';
  const tipo_eq = document.getElementById('eq-tipo')?.value || '';
  const serie = document.getElementById('eq-serie')?.value || '';
  const cpu = document.getElementById('hw-cpu')?.value || '';
  const ram = document.getElementById('hw-ram')?.value || '';
  const hd = document.getElementById('hw-hd')?.value || '';
  const gpu = document.getElementById('hw-gpu')?.value || '';
  const so = document.getElementById('eq-so')?.value || '';
  const recl = document.getElementById('diag-recl')?.value || '';
  const analise = document.getElementById('diag-analise')?.value || '';
  const servicosDiag = document.getElementById('diag-servicos')?.value || '';
  const tecnico = document.getElementById('diag-tecnico')?.value || cfg.tecnico || '';

  const equipHtml = (marca || modelo) ? `
    <div class="print-section">
      <h3>Equipamento</h3>
      <div class="print-grid">
        ${tipo_eq ? `<div><span>Tipo:</span> ${tipo_eq}</div>` : ''}
        ${marca ? `<div><span>Marca:</span> ${marca}</div>` : ''}
        ${modelo ? `<div><span>Modelo:</span> ${modelo}</div>` : ''}
        ${serie ? `<div><span>Nº de Série:</span> ${serie}</div>` : ''}
        ${so ? `<div><span>Sistema Operacional:</span> ${so}</div>` : ''}
        ${cpu ? `<div><span>Processador:</span> ${cpu}</div>` : ''}
        ${ram ? `<div><span>Memória RAM:</span> ${ram}</div>` : ''}
        ${hd ? `<div><span>Armazenamento:</span> ${hd}</div>` : ''}
        ${gpu ? `<div><span>Placa de Vídeo:</span> ${gpu}</div>` : ''}
      </div>
    </div>` : '';

  const diagnHtml = (recl || analise || servicosDiag) ? `
    <div class="print-section">
      <h3>Descrição do Serviço</h3>
      ${recl ? `<div style="margin-bottom:6px"><strong>Problema relatado:</strong> ${recl}</div>` : ''}
      ${analise ? `<div style="margin-bottom:6px"><strong>Análise técnica:</strong> ${analise}</div>` : ''}
      ${servicosDiag ? `<div><strong>Serviços a realizar:</strong><br>${servicosDiag.split('\n').map(l => l.trim() ? '• ' + l : '').join('<br>')}</div>` : ''}
    </div>` : '';

  const html = `
    <div class="print-header">
      <div>
        <div class="print-logo">${cfg.empresa || 'Assistência Técnica'}</div>
        <div style="font-size:12px; margin-top:4px">${cfg.cnpj || ''}</div>
        <div style="font-size:12px">${cfg.tel || ''} ${cfg.email ? '| ' + cfg.email : ''}</div>
        <div style="font-size:12px">${cfg.end || ''}</div>
      </div>
      <div class="print-meta">
        <strong style="font-size:16px">ORÇAMENTO DE SERVIÇOS</strong><br>
        Nº ${gerarNumeroOrc()}<br>
        Data: ${formatarData(document.getElementById('orc-data').value)}<br>
        Validade: ${document.getElementById('orc-validade').value}<br>
        ${laudoRef ? `Laudo: ${laudoRef}` : ''}
      </div>
    </div>
    <div class="print-section">
      <h3>Cliente</h3>
      <div><strong>Nome:</strong> ${document.getElementById('orc-cliente').value}</div>
    </div>
    ${equipHtml}
    ${diagnHtml}
    <div class="print-section">
      <h3>Itens do Orçamento</h3>
      <table class="print-table">
        <tr><th>Descrição</th><th style="width:60px;text-align:center">Qtd</th><th style="width:100px;text-align:right">Unit. (R$)</th><th style="width:100px;text-align:right">Total (R$)</th></tr>
        ${items.map(i => `<tr><td>${i.desc}</td><td style="text-align:center">${i.qtd}</td><td style="text-align:right">${i.unit.toFixed(2).replace('.',',')}</td><td style="text-align:right">${i.total.toFixed(2).replace('.',',')}</td></tr>`).join('')}
      </table>
      <div class="print-total">
        Subtotal: R$ ${subtotal.toFixed(2).replace('.',',')}
        ${descValor > 0 ? `<br><span style="color:#c00; font-size:13px">Desconto (${desc}${tipo === 'pct' ? '%' : ' R$'}): − R$ ${descValor.toFixed(2).replace('.',',')}</span>` : ''}
        <br><span style="font-size:19px; border-top:2px solid #333; padding-top:6px; display:inline-block; margin-top:4px">TOTAL: ${totalFinal}</span>
      </div>
    </div>
    <div class="print-section">
      <h3>Condições</h3>
      <div><strong>Forma de Pagamento:</strong> ${document.getElementById('orc-pgto').value}</div>
      <div style="margin-top:6px"><strong>Garantia dos serviços:</strong> ${garantia} dias após a entrega</div>
      ${obs ? `<div style="margin-top:8px; background:#f5f5f5; padding:10px; border-radius:4px; font-size:12px; white-space:pre-line">${obs}</div>` : ''}
      ${cfg.rodape ? `<div style="margin-top:12px; font-size:11px; color:#666; border-top:1px solid #ccc; padding-top:8px">${cfg.rodape}</div>` : ''}
    </div>
    <div style="margin-top:16px; background:#f9f9f9; border:1px solid #ddd; border-radius:6px; padding:12px; font-size:12px">
      <strong>⚠ IMPORTANTE:</strong> Este orçamento é válido pelo período indicado. Os serviços só serão iniciados após aprovação formal do cliente.
    </div>
    <div class="print-sign">
      <div>${cfg.empresa || 'Assistência Técnica'}${tecnico ? '<br>' + tecnico : ''}<br>Assinatura / Carimbo</div>
      <div>Cliente: ${document.getElementById('orc-cliente').value}<br>Assinatura e data</div>
    </div>
  `;
  document.getElementById('print-area').innerHTML = html;
  window.print();
}


function imprimirLaudoAtivo() {
  if (!laudoAtivo) return;
  const l = laudoAtivo;
  const cfg = getConfigs();
  const statusMap = { entrada:'ENTRADA', diagnostico:'EM DIAGNÓSTICO', aguardando:'AGUARD. APROVAÇÃO', em_reparo:'EM REPARO', concluido:'CONCLUÍDO', entregue:'ENTREGUE', cancelado:'CANCELADO' };
  const html = `
    <div class="print-header">
      <div>
        <div class="print-logo">${cfg.empresa || 'Assistência Técnica'}</div>
        <div style="font-size:12px; margin-top:4px">${cfg.cnpj || ''}</div>
        <div style="font-size:12px">${cfg.tel || ''} ${cfg.email ? '| ' + cfg.email : ''}</div>
        <div style="font-size:12px">${cfg.end || ''}</div>
      </div>
      <div class="print-meta">
        <strong>LAUDO TÉCNICO</strong><br>
        Nº ${l.num}<br>
        Data: ${formatarData(l.data)}<br>
        Status: <span class="print-status-badge" style="background:#eee">${statusMap[l.status] || l.status}</span>
      </div>
    </div>
    <div class="print-section">
      <h3>Dados do Cliente</h3>
      <div class="print-grid">
        <div><span>Nome:</span> ${l.cliente.nome}</div>
        <div><span>CPF/CNPJ:</span> ${l.cliente.doc || '—'}</div>
        <div><span>Telefone:</span> ${l.cliente.tel || '—'}</div>
        <div><span>E-mail:</span> ${l.cliente.email || '—'}</div>
        <div style="grid-column:1/-1"><span>Endereço:</span> ${l.cliente.end || '—'}</div>
      </div>
    </div>
    <div class="print-section">
      <h3>Equipamento</h3>
      <div class="print-grid">
        <div><span>Tipo:</span> ${l.equipamento.tipo}</div>
        <div><span>Marca:</span> ${l.equipamento.marca}</div>
        <div><span>Modelo:</span> ${l.equipamento.modelo || '—'}</div>
        <div><span>Série:</span> ${l.equipamento.serie || '—'}</div>
        <div><span>SO:</span> ${l.equipamento.so}</div>
        <div><span>Patrimônio:</span> ${l.equipamento.pat || '—'}</div>
      </div>
    </div>
    <div class="print-section">
      <h3>Hardware</h3>
      <div class="print-grid">
        <div><span>CPU:</span> ${l.hardware.cpu || '—'}</div>
        <div><span>RAM:</span> ${l.hardware.ram || '—'}</div>
        <div><span>Armazenamento:</span> ${l.hardware.hd || '—'}</div>
        <div><span>GPU:</span> ${l.hardware.gpu || '—'}</div>
        <div><span>Fonte:</span> ${l.hardware.fonte || '—'}</div>
        <div><span>Placa-Mãe:</span> ${l.hardware.mb || '—'}</div>
      </div>
    </div>
    <div class="print-section">
      <h3>Diagnóstico</h3>
      <p class="print-obs"><strong>Reclamação:</strong> ${l.diagnostico.reclamacao || '—'}</p>
      <p class="print-obs" style="margin-top:6px"><strong>Análise Técnica:</strong> ${l.diagnostico.analise || '—'}</p>
      ${l.diagnostico.servicos ? `<p class="print-obs" style="margin-top:6px"><strong>Serviços:</strong> ${l.diagnostico.servicos}</p>` : ''}
      ${l.diagnostico.obs ? `<p class="print-obs" style="margin-top:6px"><strong>Observações:</strong> ${l.diagnostico.obs}</p>` : ''}
      <div class="print-grid" style="margin-top:8px">
        <div><span>Causa:</span> ${l.diagnostico.causa || '—'}</div>
        <div><span>Técnico:</span> ${l.diagnostico.tecnico || cfg.tecnico || '—'}</div>
        <div><span>Previsão:</span> ${l.entrega ? formatarData(l.entrega) : '—'}</div>
      </div>
    </div>
    <div class="print-section">
      <h3>Checklist de Vistoria</h3>
      <div class="print-checklist">
        ${checklistPadrao.map((item, i) => {
          const status = l.checklist && l.checklist[i+'_status'] || (l.checklist && l.checklist[i] ? 'ok' : 'na');
          const icon = status === 'ok' ? '✅' : status === 'defeito' ? '❌' : '—';
          return `<div class="print-checklist-item"><span>${icon}</span> ${item}</div>`;
        }).join('')}
      </div>
    </div>
    ${cfg.rodape ? `<div style="font-size:11px; color:#666; margin-top:16px; padding-top:12px; border-top:1px solid #ddd">${cfg.rodape}</div>` : ''}
    <div class="print-sign">
      <div>${cfg.empresa || 'Assistência Técnica'}<br>${l.diagnostico.tecnico || cfg.tecnico || 'Técnico Responsável'}</div>
      <div>${l.cliente.nome}<br>Assinatura do Cliente</div>
    </div>
  `;
  document.getElementById('print-area').innerHTML = html;
  window.print();
}

