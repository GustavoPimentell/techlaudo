// ====================== ORÇAMENTO ======================
function adicionarItem(desc='', qtd=1, unit=0) {
  const id = ++itemCounter;
  const container = document.getElementById('orc-items');
  const div = document.createElement('div');
  div.className = 'item-row';
  div.id = 'item-' + id;

  // Mobile-friendly layout: description full width, sub-row for qty/unit/total
  div.innerHTML = `
    <input type="text" placeholder="Descrição do serviço ou peça" value="${desc}"
      oninput="calcularTotal()" style="grid-column:1/-1">
    <div class="item-row-sub" style="display:flex;gap:8px;align-items:center;width:100%">
      <div style="display:flex;flex-direction:column;gap:3px;flex:1">
        <span style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px">Qtd</span>
        <input type="number" inputmode="decimal" min="1" value="${qtd}" oninput="calcularTotal()" style="text-align:center">
      </div>
      <div style="display:flex;flex-direction:column;gap:3px;flex:2">
        <span style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px">Unit (R$)</span>
        <input type="number" inputmode="decimal" min="0" step="0.01" placeholder="0,00" value="${unit > 0 ? unit : ''}" oninput="calcularTotal()">
      </div>
      <div style="display:flex;flex-direction:column;gap:3px;flex:2;align-items:flex-end">
        <span style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px">Total</span>
        <span class="item-total" id="total-${id}">R$ 0,00</span>
      </div>
      <button class="remove-btn" onclick="removerItem(${id})" title="Remover">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `;
  // Remove the explicit grid layout; use flex column instead
  div.style.cssText = 'display:flex;flex-direction:column;gap:8px;background:var(--surface2);padding:14px;border-radius:8px;border:1px solid var(--border)';
  container.appendChild(div);
  calcularTotal();
}

function removerItem(id) {
  const el = document.getElementById('item-' + id);
  if (el) el.remove();
  calcularTotal();
}

function calcularTotal() {
  let subtotal = 0;
  document.querySelectorAll('#orc-items .item-row').forEach(row => {
    const inputs = row.querySelectorAll('input[type=number]');
    const qtd  = parseFloat(inputs[0]?.value) || 0;
    const unit = parseFloat(inputs[1]?.value) || 0;
    const total = qtd * unit;
    const id = row.id.replace('item-', '');
    const el = document.getElementById('total-' + id);
    if (el) el.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    subtotal += total;
  });
  document.getElementById('orc-subtotal').textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');

  const desc = parseFloat(document.getElementById('orc-desconto').value) || 0;
  const tipo = document.getElementById('orc-desc-tipo').value;
  const descValor = tipo === 'pct' ? subtotal * (desc / 100) : desc;
  const total = Math.max(0, subtotal - descValor);
  document.getElementById('orc-total').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

function limparOrcamento() {
  document.getElementById('orc-items').innerHTML = '';
  ['orc-cliente','orc-laudo','orc-obs'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('orc-data').value = hoje();
  document.getElementById('orc-desconto').value = '0';
  document.getElementById('orc-pgto').value = 'PIX';
  document.querySelectorAll('.pgto-btn').forEach(b => b.classList.remove('selected'));
  const def = document.querySelector('.pgto-btn[data-val="PIX"]');
  if (def) def.classList.add('selected');
  document.getElementById('orc-edit-id').value = '';
  itemCounter = 0;
  adicionarItem();
  calcularTotal();
}

function salvarOrcamento() {
  const cliente = document.getElementById('orc-cliente').value.trim();
  if (!cliente) { toast('Informe o nome do cliente!', 'error'); return; }
  const items = [];
  document.querySelectorAll('#orc-items .item-row').forEach(row => {
    const descInput = row.querySelector('input[type=text]');
    const numInputs = row.querySelectorAll('input[type=number]');
    if (descInput && descInput.value.trim()) {
      items.push({
        desc: descInput.value,
        qtd:  numInputs[0]?.value || 1,
        unit: numInputs[1]?.value || 0
      });
    }
  });
  const editId = document.getElementById('orc-edit-id').value;
  const orc = {
    id: editId ? parseInt(editId) : Date.now(),
    num: editId ? (orcamentos.find(o => o.id === parseInt(editId))?.num || gerarNumeroOrc()) : gerarNumeroOrc(),
    cliente,
    laudoRef: document.getElementById('orc-laudo').value,
    data:     document.getElementById('orc-data').value,
    validade: document.getElementById('orc-validade').value,
    pgto:     document.getElementById('orc-pgto').value,
    obs:      document.getElementById('orc-obs').value,
    desconto: document.getElementById('orc-desconto').value,
    descTipo: document.getElementById('orc-desc-tipo').value,
    items,
    total: document.getElementById('orc-total').textContent
  };
  if (editId) {
    const idx = orcamentos.findIndex(o => o.id === parseInt(editId));
    if (idx > -1) orcamentos[idx] = orc; else orcamentos.unshift(orc);
    document.getElementById('orc-edit-id').value = '';
    toast('✅ Orçamento atualizado!');
  } else {
    orcamentos.unshift(orc);
    toast('✅ Orçamento salvo!');
  }
  localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
  renderDashboard();
}
