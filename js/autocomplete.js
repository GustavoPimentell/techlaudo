// ====================== AUTOCOMPLETE CLIENTE (ORÇAMENTO) ======================
let _autocompleteClientesCache = [];

function autocompleteCliente(query) {
  const list = document.getElementById('orc-cliente-list');
  if (!list) return;
  const q = (query || '').toLowerCase().trim();
  const vistos = new Set();
  _autocompleteClientesCache = [];
  laudos.forEach(l => {
    const nome = l.cliente.nome;
    const key = nome.toLowerCase();
    if (!vistos.has(key) && (!q || key.includes(q))) {
      vistos.add(key);
      _autocompleteClientesCache.push({ nome, tel: l.cliente.tel || '', email: l.cliente.email || '' });
    }
  });
  if (!_autocompleteClientesCache.length) { list.classList.remove('open'); return; }
  list.innerHTML = _autocompleteClientesCache.slice(0, 8).map((c, i) => `
    <div class="autocomplete-item" ontouchend="selecionarClienteOrc(${i})" onmousedown="selecionarClienteOrc(${i})">
      <div class="autocomplete-item-name">${c.nome}</div>
      <div class="autocomplete-item-detail">${[c.tel, c.email].filter(Boolean).join(' · ') || 'Sem contato'}</div>
    </div>
  `).join('');
  list.classList.add('open');
}

function selecionarClienteOrc(idx) {
  const c = _autocompleteClientesCache[idx];
  if (!c) return;
  document.getElementById('orc-cliente').value = c.nome;
  document.getElementById('orc-cliente-list').classList.remove('open');
  toast(`✅ Cliente "${c.nome}" selecionado.`);
}

// Fechar autocomplete ao clicar/tocar fora
document.addEventListener('click', function(e) {
  const list = document.getElementById('orc-cliente-list');
  const input = document.getElementById('orc-cliente');
  if (list && input && !list.contains(e.target) && e.target !== input) {
    list.classList.remove('open');
  }
});
