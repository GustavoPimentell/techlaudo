// ====================== NAVIGATE ======================
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`[onclick="navigate('${page}')"]`).classList.add('active');
  const titles = { dashboard:'Dashboard', 'novo-laudo':'Novo Laudo', orcamento:'Orçamento', historico:'Histórico', configuracoes:'Configurações' };
  document.getElementById('page-title').textContent = titles[page] || page;
  if (page === 'dashboard') renderDashboard();
  if (page === 'historico') renderHistorico();
  if (page === 'novo-laudo') renderChecklist();
  if (page === 'configuracoes') { carregarConfigs(); renderCfgChecklist(); }
  if (page === 'orcamento') { document.getElementById('orc-data').value = hoje(); if (!document.getElementById('orc-items').children.length) adicionarItem(); }
}

function switchTab(btn, tabId) {
  btn.closest('.page').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.closest('.page').querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// ====================== CHECKLIST ======================
function renderChecklist() {
  const container = document.getElementById('checklist-items');
  container.innerHTML = '';
  checklistPadrao.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'check-item' + (checklistAtual[i] ? ' checked' : '');
    div.innerHTML = `
      <input type="checkbox" id="chk${i}" ${checklistAtual[i] ? 'checked' : ''} onchange="toggleCheck(${i}, this)">
      <span>${item}</span>
      <select onchange="checklistAtual['${i}_status'] = this.value" style="width:120px">
        <option value="ok" ${checklistAtual[i+'_status']==='ok'?'selected':''}>✅ OK</option>
        <option value="defeito" ${checklistAtual[i+'_status']==='defeito'?'selected':''}>❌ Defeito</option>
        <option value="na" ${checklistAtual[i+'_status']==='na'?'selected':''}>— N/A</option>
      </select>
    `;
    container.appendChild(div);
  });
}

function toggleCheck(idx, el) {
  checklistAtual[idx] = el.checked;
  el.closest('.check-item').classList.toggle('checked', el.checked);
}

// ====================== SALVAR LAUDO ======================
function salvarLaudo() {
  const nome = document.getElementById('cli-nome').value.trim();
  if (!nome) { toast('Informe o nome do cliente!', 'error'); navigate('novo-laudo'); switchTab(document.querySelector('.tab-btn'), 'tab-cliente'); return; }

  const num = document.getElementById('laudo-num').value || gerarNumero();
  const laudo = {
    id: laudoAtivo ? laudoAtivo.id : Date.now(),
    num,
    data: document.getElementById('laudo-data').value || hoje(),
    entrega: document.getElementById('laudo-entrega').value,
    status: document.getElementById('laudo-status').value,
    cliente: { nome, doc: v('cli-doc'), tel: v('cli-tel'), email: v('cli-email'), end: v('cli-end') },
    equipamento: {
      tipo: v('eq-tipo'), marca: v('eq-marca'), modelo: v('eq-modelo'),
      serie: v('eq-serie'), pat: v('eq-pat'), so: v('eq-so'),
      acess: v('eq-acess'), cond: v('eq-cond')
    },
    hardware: { cpu: v('hw-cpu'), ram: v('hw-ram'), hd: v('hw-hd'), gpu: v('hw-gpu'), fonte: v('hw-fonte'), mb: v('hw-mb') },
    diagnostico: {
      reclamacao: v('diag-recl'), analise: v('diag-analise'),
      servicos: v('diag-servicos'), causa: v('diag-causa'),
      urgencia: v('diag-urgencia'), obs: v('diag-obs'), tecnico: v('diag-tecnico')
    },
    checklist: { ...checklistAtual }
  };

  if (laudoAtivo) {
    const idx = laudos.findIndex(l => l.id === laudoAtivo.id);
    if (idx > -1) laudos[idx] = laudo;
  } else {
    laudos.unshift(laudo);
  }

  localStorage.setItem('laudos', JSON.stringify(laudos));
  laudoAtivo = null;
  checklistAtual = {};
  toast('✅ Laudo salvo com sucesso!');
  limparFormulario();
  navigate('historico');
}

function v(id) { const el = document.getElementById(id); return el ? el.value : ''; }

function limparFormulario() {
  ['cli-nome','cli-doc','cli-tel','cli-email','cli-end','laudo-num','laudo-entrega',
   'eq-marca','eq-modelo','eq-serie','eq-pat','eq-acess','eq-cond',
   'hw-cpu','hw-ram','hw-hd','hw-gpu','hw-fonte','hw-mb',
   'diag-recl','diag-analise','diag-servicos','diag-obs','diag-tecnico'
  ].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
  document.getElementById('laudo-data').value = hoje();
  document.getElementById('laudo-status').value = 'entrada';
  checklistAtual = {};
  laudoAtivo = null;
  renderChecklist();
}

