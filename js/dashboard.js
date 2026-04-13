// ====================== DASHBOARD ======================
function renderDashboard() {
  const total     = laudos.length;
  const andamento = laudos.filter(l => ['entrada','diagnostico','aguardando','em_reparo'].includes(l.status)).length;
  const concluido = laudos.filter(l => ['concluido','entregue'].includes(l.status)).length;
  document.getElementById('stat-total').textContent     = total;
  document.getElementById('stat-andamento').textContent = andamento;
  document.getElementById('stat-concluido').textContent = concluido;

  let fat = 0;
  orcamentos.forEach(o => {
    const v = parseFloat((o.total || '').replace('R$ ','').replace('.','').replace(',','.')) || 0;
    fat += v;
  });
  document.getElementById('stat-faturamento').textContent = 'R$' + fat.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const container = document.getElementById('dashboard-list');
  if (!laudos.length) {
    container.innerHTML = `<div class="empty-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
      <p>Nenhum laudo cadastrado.<br>Clique em <strong>Novo Laudo</strong> para começar.</p>
    </div>`;
    return;
  }

  const recentes = laudos.slice(0, 10);
  const isMobile = window.innerWidth < 700;

  if (isMobile) {
    // Card list for mobile — no horizontal scroll table
    container.innerHTML = recentes.map(l => `
      <div class="history-item" onclick="verLaudo(${l.id})">
        <div class="history-item-icon" style="background:var(--surface3)">🔧</div>
        <div class="history-item-info">
          <h4>${l.cliente.nome} <span style="color:var(--text3);font-weight:400;font-size:12px">— ${l.num}</span></h4>
          <p>${l.equipamento.marca} ${l.equipamento.modelo || ''} · ${formatarData(l.data)}</p>
          <div style="margin-top:6px">${badgeStatus(l.status)}</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text3);flex-shrink:0"><polyline points="9 18 15 12 9 6"/></svg>
      </div>`).join('');
  } else {
    container.innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th>Nº</th><th>Cliente</th><th>Equipamento</th><th>Data</th><th>Status</th><th>Ações</th></tr></thead>
      <tbody>${recentes.map(l => `<tr>
        <td class="highlight" style="font-family:var(--mono)">${l.num}</td>
        <td class="highlight">${l.cliente.nome}</td>
        <td>${l.equipamento.marca} ${l.equipamento.modelo || ''}</td>
        <td>${formatarData(l.data)}</td>
        <td>${badgeStatus(l.status)}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="verLaudo(${l.id})">Ver</button></td>
      </tr>`).join('')}</tbody>
    </table></div>`;
  }
}
