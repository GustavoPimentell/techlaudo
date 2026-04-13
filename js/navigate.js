// ====================== NAVIGATE ======================
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const sideBtn = document.querySelector(`[onclick*="navigate('${page}')"]`);
  if (sideBtn && sideBtn.classList.contains('nav-btn')) sideBtn.classList.add('active');
  const titles = {
    dashboard: 'Dashboard',
    'novo-laudo': 'Novo Laudo',
    orcamento: 'Orçamento',
    historico: 'Histórico',
    configuracoes: 'Configurações'
  };
  document.getElementById('page-title').textContent = titles[page] || page;
  if (page === 'dashboard') renderDashboard();
  if (page === 'historico') renderHistorico();
  if (page === 'novo-laudo') { renderChecklist(); if (typeof navegarTab === 'function') navegarTab(0); }
  if (page === 'configuracoes') { carregarConfigs(); renderCfgChecklist(); }
  if (page === 'orcamento') {
    popularSelectLaudos();
    document.getElementById('orc-data').value = hoje();
    if (!document.getElementById('orc-items').children.length) adicionarItem();
  }
  // Close sidebar on mobile after navigation
  closeSidebar();
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====================== SIDEBAR TOGGLE (mobile) ======================
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const isOpen = sidebar.classList.contains('open');
  if (isOpen) {
    closeSidebar();
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ====================== BOTTOM NAV ACTIVE ======================
function setBottomActive(btn) {
  document.querySelectorAll('.bottom-nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ====================== TABS ======================
function switchTab(btn, tabId) {
  btn.closest('.page').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.closest('.page').querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

const tabIds = ['tab-cliente', 'tab-equipamento', 'tab-diagnostico', 'tab-checklist'];

function navegarTab(idx) {
  if (idx < 0 || idx >= tabIds.length) return;
  const page = document.getElementById('page-novo-laudo');
  page.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  page.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  page.querySelectorAll('.tab-btn')[idx].classList.add('active');
  document.getElementById(tabIds[idx]).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close sidebar on swipe left
(function() {
  let startX = 0;
  document.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const sidebar = document.getElementById('sidebar');
    // Swipe left to close
    if (dx < -60 && sidebar.classList.contains('open')) closeSidebar();
    // Swipe right from left edge to open
    if (dx > 60 && startX < 30 && !sidebar.classList.contains('open')) toggleSidebar();
  }, { passive: true });
})();
