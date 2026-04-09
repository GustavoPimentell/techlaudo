// ====================== CONFIGURAÇÕES ======================
function carregarConfigs() {
  const cfg = getConfigs();
  document.getElementById('cfg-empresa').value = cfg.empresa || '';
  document.getElementById('cfg-cnpj').value = cfg.cnpj || '';
  document.getElementById('cfg-tel').value = cfg.tel || '';
  document.getElementById('cfg-email').value = cfg.email || '';
  document.getElementById('cfg-end').value = cfg.end || '';
  document.getElementById('cfg-tecnico').value = cfg.tecnico || '';
  document.getElementById('cfg-garantia').value = cfg.garantia || '90';
  document.getElementById('cfg-rodape').value = cfg.rodape || '';
  renderCfgCatalogo();
  renderCfgEquip();
}

function renderCfgCatalogo() {
  const container = document.getElementById('cfg-catalogo-precos');
  const precos = getPrecosCatalogo();
  container.innerHTML = '';
  catalogoServicos.forEach(cat => {
    const catLabel = document.createElement('div');
    catLabel.style.cssText = 'font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--text3); font-family:var(--mono); padding:10px 0 4px';
    catLabel.textContent = cat.categoria;
    container.appendChild(catLabel);
    cat.itens.forEach(item => {
      const row = document.createElement('div');
      row.style.cssText = 'display:grid; grid-template-columns:1fr 130px; gap:10px; align-items:center; background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:10px 14px;';
      row.innerHTML = `
        <span style="font-size:13px; color:var(--text)">${item.nome}</span>
        <div style="display:flex; align-items:center; gap:4px">
          <span style="font-size:12px; color:var(--text3)">R$</span>
          <input type="number" min="0" step="0.01" placeholder="0,00"
            value="${precos[item.nome] > 0 ? precos[item.nome] : ''}"
            data-servico="${item.nome}"
            style="flex:1; text-align:right; padding:6px 8px; font-size:13px; font-family:var(--mono)">
        </div>
      `;
      container.appendChild(row);
    });
  });
}

function salvarPrecosCatalogo() {
  const precos = {};
  document.querySelectorAll('#cfg-catalogo-precos input[data-servico]').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val) && val >= 0) precos[input.dataset.servico] = val;
  });
  localStorage.setItem('precosCatalogo', JSON.stringify(precos));
  toast('✅ Preços do catálogo salvos!');
}

function salvarConfigs() {
  configs = {
    empresa: v('cfg-empresa'), cnpj: v('cfg-cnpj'),
    tel: v('cfg-tel'), email: v('cfg-email'),
    end: v('cfg-end'), tecnico: v('cfg-tecnico'),
    garantia: v('cfg-garantia'), rodape: v('cfg-rodape')
  };
  localStorage.setItem('configs', JSON.stringify(configs));
  toast('✅ Configurações salvas!');
}

function getConfigs() { return JSON.parse(localStorage.getItem('configs') || '{}'); }

function renderCfgChecklist() {
  const container = document.getElementById('cfg-checklist-items');
  container.innerHTML = '';
  checklistPadrao.forEach((item, i) => {
    const div = document.createElement('div');
    div.style.cssText = 'display:flex; gap:8px; align-items:center';
    div.innerHTML = `
      <input type="text" value="${item}" id="cfg-chk-${i}" style="flex:1">
      <button class="remove-btn" onclick="this.parentElement.remove()" title="Remover">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    container.appendChild(div);
  });
}

function adicionarChecklistItem() {
  const container = document.getElementById('cfg-checklist-items');
  const idx = container.children.length;
  const div = document.createElement('div');
  div.style.cssText = 'display:flex; gap:8px; align-items:center';
  div.innerHTML = `
    <input type="text" placeholder="Novo item de checklist" id="cfg-chk-${idx}" style="flex:1">
    <button class="remove-btn" onclick="this.parentElement.remove()" title="Remover">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;
  container.appendChild(div);
}

function salvarChecklist() {
  const items = [];
  document.querySelectorAll('#cfg-checklist-items input[type=text]').forEach(i => { if(i.value.trim()) items.push(i.value.trim()); });
  checklistPadrao = items;
  localStorage.setItem('checklistPadrao', JSON.stringify(checklistPadrao));
  toast('✅ Checklist atualizado!');
}

