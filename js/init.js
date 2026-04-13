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

  // Fechar catálogo ao clicar fora
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('catalogo-panel');
    const btn = document.getElementById('btn-catalogo');
    if (panel && panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btn) {
      panel.classList.remove('open');
    }
  });

  // Prevent body scroll when modal open on iOS
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('touchmove', (e) => {
      if (e.target === overlay) e.preventDefault();
    }, { passive: false });
  });

  // Handle iOS safe area — update CSS var dynamically
  function updateSafeArea() {
    const val = getComputedStyle(document.documentElement).getPropertyValue('--safe-bottom') || '0px';
    document.documentElement.style.setProperty('--safe-bottom', val);
  }
  window.addEventListener('resize', updateSafeArea);
  updateSafeArea();
});
