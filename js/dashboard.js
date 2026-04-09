// ====================== HISTÓRICO ======================
function renderHistorico(busca='', statusFiltro='') {
  const container = document.getElementById('historico-list');
  let filtrados = laudos;
  if (busca) filtrados = filtrados.filter(l => l.cliente.nome.toLowerCase().includes(busca.toLowerCase()) || l.num.toLowerCase().includes(busca.toLowerCase()));
  if (statusFiltro) filtrados = filtrados.filter(l => l.status === statusFiltro);

  if (!filtrados.length) {
    container.innerHTML = `<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg><p>Nenhum laudo encontrado.</p></div>`;
    return;
  }

  const icons = { notebook:'💻', 'desktop / pc':'🖥️', servidor:'🗄️', impressora:'🖨️', tablet:'📱' };
  container.innerHTML = filtrados.map(l => `
    <div class="history-item" onclick="verLaudo(${l.id})">
      <div class="history-item-icon" style="background:var(--surface3)">
        ${icons[(l.equipamento.tipo||'').toLowerCase()] || '🔧'}
      </div>
      <div class="history-item-info">
        <h4>${l.cliente.nome} <span style="color:var(--text3); font-weight:400; font-size:12px">— ${l.num}</span></h4>
        <p>${l.equipamento.tipo} ${l.equipamento.marca} ${l.equipamento.modelo || ''} · ${formatarData(l.data)}</p>
      </div>
      ${badgeStatus(l.status)}
      <div style="display:flex; gap:6px; margin-left:8px">
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); editarLaudo(${l.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deletarLaudo(${l.id})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function filtrarHistorico() {
  const busca = document.getElementById('hist-busca').value;
  const status = document.getElementById('hist-filtro-status').value;
  renderHistorico(busca, status);
}

function verLaudo(id) {
  const l = laudos.find(l => l.id === id);
  if (!l) return;
  laudoAtivo = l;
  const statusMap = { entrada:'Entrada', diagnostico:'Em Diagnóstico', aguardando:'Aguardando Aprovação', em_reparo:'Em Reparo', concluido:'Concluído', entregue:'Entregue', cancelado:'Cancelado' };
  document.getElementById('modal-content').innerHTML = `
    <div class="form-grid" style="margin-bottom:16px">
      <div><label>Nº Laudo</label><div style="font-family:var(--mono); color:var(--accent)">${l.num}</div></div>
      <div><label>Data</label><div>${formatarData(l.data)}</div></div>
      <div><label>Status</label><div>${badgeStatus(l.status)}</div></div>
      <div><label>Previsão</label><div>${l.entrega ? formatarData(l.entrega) : '—'}</div></div>
    </div>
    <div class="divider"></div>
    <div style="font-size:13px; display:grid; grid-template-columns:1fr 1fr; gap:8px 16px; margin-bottom:12px">
      <div><b style="color:var(--text2)">Cliente:</b> ${l.cliente.nome}</div>
      <div><b style="color:var(--text2)">Telefone:</b> ${l.cliente.tel || '—'}</div>
      <div><b style="color:var(--text2)">Equipamento:</b> ${l.equipamento.tipo} ${l.equipamento.marca} ${l.equipamento.modelo || ''}</div>
      <div><b style="color:var(--text2)">S.O.:</b> ${l.equipamento.so}</div>
      <div><b style="color:var(--text2)">CPU:</b> ${l.hardware.cpu || '—'}</div>
      <div><b style="color:var(--text2)">RAM:</b> ${l.hardware.ram || '—'}</div>
    </div>
    <div class="divider"></div>
    <div style="margin-bottom:10px"><b style="font-size:12px; color:var(--text3); text-transform:uppercase; letter-spacing:1px">Análise Técnica</b>
      <p style="font-size:13px; margin-top:6px; color:var(--text2); line-height:1.6">${l.diagnostico.analise || '—'}</p>
    </div>
    ${l.diagnostico.servicos ? `<div style="margin-bottom:10px"><b style="font-size:12px; color:var(--text3); text-transform:uppercase; letter-spacing:1px">Serviços</b>
      <p style="font-size:13px; margin-top:6px; color:var(--text2); line-height:1.6">${l.diagnostico.servicos}</p></div>` : ''}
    ${l.diagnostico.obs ? `<div style="margin-bottom:10px"><b style="font-size:12px; color:var(--text3); text-transform:uppercase; letter-spacing:1px">Observações</b>
      <p style="font-size:13px; margin-top:6px; color:var(--text2); line-height:1.6">${l.diagnostico.obs}</p></div>` : ''}
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
  // Preenche os campos
  document.getElementById('cli-nome').value = l.cliente.nome || '';
  document.getElementById('cli-doc').value = l.cliente.doc || '';
  document.getElementById('cli-tel').value = l.cliente.tel || '';
  document.getElementById('cli-email').value = l.cliente.email || '';
  document.getElementById('cli-end').value = l.cliente.end || '';
  document.getElementById('laudo-num').value = l.num || '';
  document.getElementById('laudo-data').value = l.data || '';
  document.getElementById('laudo-entrega').value = l.entrega || '';
  document.getElementById('laudo-status').value = l.status || 'entrada';
  document.getElementById('eq-tipo').value = l.equipamento.tipo;
  document.getElementById('eq-marca').value = l.equipamento.marca || '';
  document.getElementById('eq-modelo').value = l.equipamento.modelo || '';
  document.getElementById('eq-serie').value = l.equipamento.serie || '';
  document.getElementById('eq-pat').value = l.equipamento.pat || '';
  document.getElementById('eq-so').value = l.equipamento.so;
  document.getElementById('eq-acess').value = l.equipamento.acess || '';
  document.getElementById('eq-cond').value = l.equipamento.cond || '';
  document.getElementById('hw-cpu').value = l.hardware.cpu || '';
  document.getElementById('hw-ram').value = l.hardware.ram || '';
  document.getElementById('hw-hd').value = l.hardware.hd || '';
  document.getElementById('hw-gpu').value = l.hardware.gpu || '';
  document.getElementById('hw-fonte').value = l.hardware.fonte || '';
  document.getElementById('hw-mb').value = l.hardware.mb || '';
  document.getElementById('diag-recl').value = l.diagnostico.reclamacao || '';
  document.getElementById('diag-analise').value = l.diagnostico.analise || '';
  document.getElementById('diag-servicos').value = l.diagnostico.servicos || '';
  document.getElementById('diag-causa').value = l.diagnostico.causa || '';
  document.getElementById('diag-urgencia').value = l.diagnostico.urgencia || 'normal';
  document.getElementById('diag-obs').value = l.diagnostico.obs || '';
  document.getElementById('diag-tecnico').value = l.diagnostico.tecnico || '';
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
  // Preencher dados do cliente
  const nome = document.getElementById('cli-nome')?.value || '';
  document.getElementById('orc-cliente').value = nome;
  document.getElementById('orc-data').value = hoje();
  // Preencher referência do laudo
  const numLaudo = document.getElementById('laudo-num')?.value || '';
  document.getElementById('orc-laudo').value = numLaudo;
  // Preencher descrição do equipamento no campo obs
  const marca = document.getElementById('eq-marca')?.value || '';
  const modelo = document.getElementById('eq-modelo')?.value || '';
  const tipo = document.getElementById('eq-tipo')?.value || '';
  const recl = document.getElementById('diag-recl')?.value || '';
  const servicos = document.getElementById('diag-servicos')?.value || '';
  const cfg = getConfigs();
  const garantia = cfg.garantia || '90';
  let obsText = '';
  if (tipo || marca || modelo) obsText += `Equipamento: ${tipo} ${marca} ${modelo}\n`;
  if (recl) obsText += `Problema relatado: ${recl}\n`;
  if (servicos) obsText += `\nServiços a realizar:\n${servicos}`;
  obsText += `\n\nGarantia dos serviços: ${garantia} dias.`;
  document.getElementById('orc-obs').value = obsText.trim();
  // Pré-popular itens com serviços sugeridos do diagnóstico
  if (!document.getElementById('orc-items').children.length) adicionarItem();
  if (servicos) {
    const linhas = servicos.split('\n').filter(l => l.trim());
    linhas.forEach(linha => {
      if (linha.trim()) adicionarItem(linha.trim(), 1, 0);
    });
  }
  toast('✅ Orçamento pré-preenchido com dados do laudo!');
}

