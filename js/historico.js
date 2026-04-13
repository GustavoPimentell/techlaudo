// ====================== HISTÓRICO ======================
let histTabAtual = 'laudos';

function switchHistTab(tab) {
  histTabAtual = tab;
  const isLaudos = tab === 'laudos';
  document.getElementById('hist-tab-laudos').className    = isLaudos ? 'btn btn-primary btn-sm'  : 'btn btn-ghost btn-sm';
  document.getElementById('hist-tab-orcamentos').className = isLaudos ? 'btn btn-ghost btn-sm'   : 'btn btn-primary btn-sm';
  document.getElementById('hist-filtros-laudos').style.display      = isLaudos ? 'flex' : 'none';
  document.getElementById('hist-filtros-orcamentos').style.display  = isLaudos ? 'none' : 'flex';
  document.getElementById('historico-list').style.display           = isLaudos ? 'block' : 'none';
  document.getElementById('historico-orc-list').style.display       = isLaudos ? 'none'  : 'block';
  if (isLaudos) renderHistorico(); else renderHistoricoOrc();
}

function renderHistorico(busca='', statusFiltro='') {
  const container = document.getElementById('historico-list');
  let filtrados = laudos;
  if (busca)        filtrados = filtrados.filter(l => l.cliente.nome.toLowerCase().includes(busca.toLowerCase()) || l.num.toLowerCase().includes(busca.toLowerCase()));
  if (statusFiltro) filtrados = filtrados.filter(l => l.status === statusFiltro);

  if (!filtrados.length) {
    container.innerHTML = `<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg><p>Nenhum laudo encontrado.</p></div>`;
    return;
  }

  const icons = { notebook:'💻', 'desktop / pc':'🖥️', servidor:'🗄️', impressora:'🖨️', tablet:'📱' };
  container.innerHTML = filtrados.map(l => {
    const orcsVinc = orcamentos.filter(o => o.laudoRef === l.num);
    const orcsTag  = orcsVinc.length
      ? `<span style="font-size:11px;background:rgba(124,77,255,0.15);color:var(--accent2);border:1px solid rgba(124,77,255,0.25);border-radius:12px;padding:2px 8px;font-family:var(--mono);white-space:nowrap">💰 ${orcsVinc.length} orç.</span>`
      : '';
    return `
    <div class="history-item" onclick="verLaudo(${l.id})">
      <div class="history-item-icon" style="background:var(--surface3)">
        ${icons[(l.equipamento.tipo||'').toLowerCase()] || '🔧'}
      </div>
      <div class="history-item-info">
        <h4>${l.cliente.nome} <span style="color:var(--text3);font-weight:400;font-size:12px">— ${l.num}</span></h4>
        <p>${l.equipamento.tipo} ${l.equipamento.marca} ${l.equipamento.modelo || ''} · ${formatarData(l.data)}</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;align-items:center">
          ${badgeStatus(l.status)}
          ${orcsTag}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;align-items:flex-end">
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); editarLaudo(${l.id})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Editar
        </button>
        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deletarLaudo(${l.id})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');
}

function renderHistoricoOrc(busca='') {
  const container = document.getElementById('historico-orc-list');
  let filtrados = orcamentos;
  if (busca) filtrados = filtrados.filter(o =>
    o.cliente.toLowerCase().includes(busca.toLowerCase()) ||
    o.num.toLowerCase().includes(busca.toLowerCase())
  );

  if (!filtrados.length) {
    container.innerHTML = `<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg><p>Nenhum orçamento salvo ainda.</p></div>`;
    return;
  }

  container.innerHTML = filtrados.map(o => {
    const laudoVinc = o.laudoRef ? laudos.find(l => l.num === o.laudoRef) : null;
    const laudoTag  = laudoVinc
      ? `<span style="font-size:11px;background:rgba(0,229,255,0.1);color:var(--accent);border:1px solid rgba(0,229,255,0.2);border-radius:12px;padding:2px 8px;font-family:var(--mono);white-space:nowrap;cursor:pointer" ontouchend="event.stopPropagation();verLaudo(${laudoVinc.id})" onclick="event.stopPropagation();verLaudo(${laudoVinc.id})">📋 ${o.laudoRef}</span>`
      : (o.laudoRef ? `<span style="font-size:11px;color:var(--text3);font-family:var(--mono)">📋 ${o.laudoRef}</span>` : '');
    return `
    <div class="history-item">
      <div class="history-item-icon" style="background:rgba(124,77,255,0.15)">💰</div>
      <div class="history-item-info">
        <h4>${o.cliente} <span style="color:var(--text3);font-weight:400;font-size:12px">— ${o.num}</span></h4>
        <p>${formatarData(o.data)} · Pgto: ${o.pgto || '—'}</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;align-items:center">
          ${laudoTag}
          <span class="history-item-value">${o.total}</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;align-items:flex-end">
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();editarOrcamento(${o.id})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Editar
        </button>
        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deletarOrcamento(${o.id})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');
}

function filtrarHistorico() {
  const busca  = document.getElementById('hist-busca').value;
  const status = document.getElementById('hist-filtro-status').value;
  renderHistorico(busca, status);
}

function filtrarHistoricoOrc() {
  const busca = document.getElementById('hist-busca-orc').value;
  renderHistoricoOrc(busca);
}

function limparHistoricoOrc() {
  if (!confirm('Tem certeza que deseja excluir TODOS os orçamentos?')) return;
  orcamentos = [];
  localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
  renderHistoricoOrc();
  renderDashboard();
  toast('Orçamentos limpos.');
}

function deletarOrcamento(id) {
  if (!confirm('Excluir este orçamento?')) return;
  orcamentos = orcamentos.filter(o => o.id !== id);
  localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
  renderHistoricoOrc();
  renderDashboard();
  toast('Orçamento removido.');
}

function editarOrcamento(id) {
  const o = orcamentos.find(o => o.id === id);
  if (!o) return;
  navigate('orcamento');
  popularSelectLaudos();
  document.getElementById('orc-cliente').value    = o.cliente  || '';
  document.getElementById('orc-laudo').value      = o.laudoRef || '';
  document.getElementById('orc-data').value       = o.data     || hoje();
  document.getElementById('orc-validade').value   = o.validade || '7 dias';
  document.getElementById('orc-desconto').value   = o.desconto || 0;
  document.getElementById('orc-desc-tipo').value  = o.descTipo || 'pct';
  document.getElementById('orc-obs').value        = o.obs      || '';
  document.getElementById('orc-pgto').value       = o.pgto     || 'PIX';
  document.querySelectorAll('.pgto-btn').forEach(b => b.classList.toggle('selected', b.dataset.val === o.pgto));
  document.getElementById('orc-items').innerHTML  = '';
  itemCounter = 0;
  (o.items || []).forEach(i => adicionarItem(i.desc, i.qtd, i.unit));
  if (!o.items || !o.items.length) adicionarItem();
  document.getElementById('orc-edit-id').value = o.id;
  calcularTotal();
  toast('Orçamento carregado para edição.');
}

function popularSelectLaudos() {
  const sel = document.getElementById('orc-laudo');
  const valorAtual = sel.value;
  sel.innerHTML = '<option value="">— Selecionar Laudo —</option>';
  laudos.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.num;
    opt.textContent = `${l.num} — ${l.cliente.nome} (${l.equipamento.marca} ${l.equipamento.modelo || ''})`;
    sel.appendChild(opt);
  });
  sel.value = valorAtual;
}

function preencherClienteDoLaudo() {
  const num = document.getElementById('orc-laudo').value;
  if (!num) return;
  const laudo = laudos.find(l => l.num === num);
  if (!laudo) return;
  document.getElementById('orc-cliente').value = laudo.cliente.nome;
  toast(`✅ Cliente preenchido com dados do laudo ${num}`);
}

function verLaudo(id) {
  const l = laudos.find(l => l.id === id);
  if (!l) return;
  laudoAtivo = l;
  document.getElementById('modal-content').innerHTML = `
    <div class="form-grid" style="margin-bottom:16px">
      <div><label>Nº Laudo</label><div style="font-family:var(--mono);color:var(--accent)">${l.num}</div></div>
      <div><label>Data</label><div>${formatarData(l.data)}</div></div>
      <div><label>Status</label><div>${badgeStatus(l.status)}</div></div>
      <div><label>Previsão</label><div>${l.entrega ? formatarData(l.entrega) : '—'}</div></div>
    </div>
    <div class="divider"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-bottom:12px;font-size:13px">
      <div><b style="color:var(--text2)">Cliente:</b> ${l.cliente.nome}</div>
      <div><b style="color:var(--text2)">Telefone:</b> ${l.cliente.tel || '—'}</div>
      <div><b style="color:var(--text2)">Equipamento:</b> ${l.equipamento.tipo} ${l.equipamento.marca} ${l.equipamento.modelo || ''}</div>
      <div><b style="color:var(--text2)">S.O.:</b> ${l.equipamento.so}</div>
      <div><b style="color:var(--text2)">CPU:</b> ${l.hardware.cpu || '—'}</div>
      <div><b style="color:var(--text2)">RAM:</b> ${l.hardware.ram || '—'}</div>
    </div>
    <div class="divider"></div>
    <div style="margin-bottom:10px">
      <b style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:1px">Análise Técnica</b>
      <p style="font-size:13px;margin-top:6px;color:var(--text2);line-height:1.6">${l.diagnostico.analise || '—'}</p>
    </div>
    ${l.diagnostico.servicos ? `<div style="margin-bottom:10px"><b style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:1px">Serviços</b><p style="font-size:13px;margin-top:6px;color:var(--text2);line-height:1.6">${l.diagnostico.servicos}</p></div>` : ''}
    ${l.diagnostico.obs      ? `<div style="margin-bottom:10px"><b style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:1px">Observações</b><p style="font-size:13px;margin-top:6px;color:var(--text2);line-height:1.6">${l.diagnostico.obs}</p></div>` : ''}
  `;
  document.getElementById('modal-detalhes').classList.add('open');
}

function fecharModal() {
  document.getElementById('modal-detalhes').classList.remove('open');
}

function editarLaudo(id) {
  const l = laudos.find(l => l.id === id);
  if (!l) return;
  laudoAtivo = l;
  const fields = {
    'cli-nome': l.cliente.nome,    'cli-doc':   l.cliente.doc,
    'cli-tel':  l.cliente.tel,     'cli-email': l.cliente.email,
    'cli-end':  l.cliente.end,     'laudo-num': l.num,
    'laudo-data': l.data,          'laudo-entrega': l.entrega,
    'eq-marca': l.equipamento.marca, 'eq-modelo': l.equipamento.modelo,
    'eq-serie': l.equipamento.serie, 'eq-pat':   l.equipamento.pat,
    'eq-acess': l.equipamento.acess, 'eq-cond':  l.equipamento.cond,
    'hw-cpu':   l.hardware.cpu,    'hw-ram':    l.hardware.ram,
    'hw-hd':    l.hardware.hd,     'hw-gpu':    l.hardware.gpu,
    'hw-fonte': l.hardware.fonte,  'hw-mb':     l.hardware.mb,
    'diag-recl':     l.diagnostico.reclamacao, 'diag-analise':  l.diagnostico.analise,
    'diag-servicos': l.diagnostico.servicos,   'diag-obs':      l.diagnostico.obs,
    'diag-tecnico':  l.diagnostico.tecnico
  };
  Object.entries(fields).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val || ''; });
  document.getElementById('laudo-status').value   = l.status            || 'entrada';
  document.getElementById('eq-tipo').value        = l.equipamento.tipo  || 'Notebook';
  document.getElementById('eq-so').value          = l.equipamento.so    || 'Windows 11';
  document.getElementById('diag-causa').value     = l.diagnostico.causa || '';
  document.getElementById('diag-urgencia').value  = l.diagnostico.urgencia || 'normal';
  checklistAtual = { ...l.checklist };
  navigate('novo-laudo');
  renderChecklist();
}

function editarLaudoAtivo() {
  fecharModal();
  if (laudoAtivo) editarLaudo(laudoAtivo.id);
}

function deletarLaudo(id) {
  if (!confirm('Tem certeza que deseja excluir este laudo?')) return;
  laudos = laudos.filter(l => l.id !== id);
  localStorage.setItem('laudos', JSON.stringify(laudos));
  renderHistorico();
  renderDashboard();
  toast('Laudo removido.');
}

function limparHistorico() {
  if (!confirm('Tem certeza que deseja excluir TODOS os laudos? Esta ação não pode ser desfeita.')) return;
  laudos = [];
  localStorage.setItem('laudos', JSON.stringify(laudos));
  renderHistorico();
  renderDashboard();
  toast('Histórico limpo.');
}

function gerarOrcamentoDoLaudo() {
  salvarLaudo();
  navigate('orcamento');
  const nome     = document.getElementById('cli-nome')?.value     || '';
  const marca    = document.getElementById('eq-marca')?.value     || '';
  const modelo   = document.getElementById('eq-modelo')?.value    || '';
  const tipo     = document.getElementById('eq-tipo')?.value      || '';
  const recl     = document.getElementById('diag-recl')?.value    || '';
  const servicos = document.getElementById('diag-servicos')?.value || '';
  const cfg      = getConfigs();
  const garantia = cfg.garantia || '90';

  document.getElementById('orc-cliente').value = nome;
  document.getElementById('orc-data').value    = hoje();
  popularSelectLaudos();

  const numLaudo = document.getElementById('laudo-num')?.value || '';
  if (numLaudo) document.getElementById('orc-laudo').value = numLaudo;

  let obsText = '';
  if (tipo || marca || modelo) obsText += `Equipamento: ${tipo} ${marca} ${modelo}\n`;
  if (recl)     obsText += `Problema relatado: ${recl}\n`;
  if (servicos) obsText += `\nServiços a realizar:\n${servicos}`;
  obsText += `\n\nGarantia dos serviços: ${garantia} dias.`;
  document.getElementById('orc-obs').value = obsText.trim();

  if (!document.getElementById('orc-items').children.length) adicionarItem();
  if (servicos) {
    servicos.split('\n').filter(l => l.trim()).forEach(linha => adicionarItem(linha.trim(), 1, 0));
  }
  toast('✅ Orçamento pré-preenchido com dados do laudo!');
}
