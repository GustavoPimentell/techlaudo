// ====================== BACKUP ======================
function exportarDados() {
  const data = { laudos, orcamentos, configs, checklistPadrao, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `techlaudo-backup-${hoje()}.json`;
  a.click();
  toast('✅ Backup exportado!');
}

function importarDados(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.laudos) { laudos = data.laudos; localStorage.setItem('laudos', JSON.stringify(laudos)); }
      if (data.orcamentos) { orcamentos = data.orcamentos; localStorage.setItem('orcamentos', JSON.stringify(orcamentos)); }
      if (data.configs) { configs = data.configs; localStorage.setItem('configs', JSON.stringify(configs)); }
      if (data.checklistPadrao) { checklistPadrao = data.checklistPadrao; localStorage.setItem('checklistPadrao', JSON.stringify(checklistPadrao)); }
      toast('✅ Dados importados com sucesso!');
      renderDashboard();
    } catch { toast('Erro ao importar o arquivo!', 'error'); }
  };
  reader.readAsText(file);
}

// ====================== UTILS ======================
function hoje() { return new Date().toISOString().split('T')[0]; }
function formatarData(d) { if (!d) return '—'; const [y,m,dd] = d.split('-'); return `${dd}/${m}/${y}`; }
function gerarNumero() { return 'L-' + String(laudos.length + 1).padStart(4, '0'); }
function gerarNumeroOrc() { return 'O-' + String(orcamentos.length + 1).padStart(4, '0'); }

function badgeStatus(s) {
  const map = {
    entrada: ['blue','Entrada'], diagnostico: ['yellow','Diagnóstico'],
    aguardando: ['yellow','Aguardando'], em_reparo: ['purple','Em Reparo'],
    concluido: ['green','Concluído'], entregue: ['green','Entregue'],
    cancelado: ['red','Cancelado']
  };
  const [cls, label] = map[s] || ['blue', s];
  return `<span class="badge badge-${cls}">${label}</span>`;
}

function toast(msg, type='') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'error' ? ' error' : '');
  el.innerHTML = `<span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transform='translateX(100%)'; el.style.transition='.3s'; setTimeout(()=>el.remove(), 300); }, 3000);
}

