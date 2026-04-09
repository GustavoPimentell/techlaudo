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

// ====================== INIT ======================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('laudo-data').value = hoje();
  document.getElementById('orc-data').value = hoje();
  renderChecklist();
  renderDashboard();
  initPgtoButtons();

  // Fechar modal ao clicar fora
  document.getElementById('modal-detalhes').addEventListener('click', function(e) {
    if (e.target === this) fecharModal();
  });

  // Fechar modal equipamento ao clicar fora
  document.getElementById('modal-equip').addEventListener('click', function(e) {
    if (e.target === this) fecharModalEquip();
  });

  // Carregar tecnico padrão
  const cfg = getConfigs();
  if (cfg.tecnico) document.getElementById('diag-tecnico').value = cfg.tecnico;
});
