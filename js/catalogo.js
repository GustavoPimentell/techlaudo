// ====================== CATÁLOGO DE SERVIÇOS ======================
const catalogoServicos = [
  { categoria: '🔧 Manutenção Geral', itens: [
    { nome: 'Diagnóstico técnico completo' },
    { nome: 'Manutenção preventiva completa' },
    { nome: 'Manutenção corretiva (mão de obra)' },
    { nome: 'Formatação e reinstalação do SO' },
    { nome: 'Configuração pós-formatação' },
  ]},
  { categoria: '🧹 Limpeza', itens: [
    { nome: 'Limpeza de hardware (notebook)' },
    { nome: 'Limpeza de hardware (desktop)' },
    { nome: 'Limpeza interna + soprador de ar' },
    { nome: 'Limpeza de teclado e periféricos' },
  ]},
  { categoria: '🌡️ Pasta Térmica', itens: [
    { nome: 'Aplicação de pasta térmica (notebook)' },
    { nome: 'Aplicação de pasta térmica (desktop)' },
    { nome: 'Troca de pasta térmica + limpeza' },
  ]},
  { categoria: '💾 Armazenamento', itens: [
    { nome: 'Instalação de SSD' },
    { nome: 'Clonagem de HD para SSD' },
    { nome: 'Recuperação de dados (HD)' },
    { nome: 'Formatação de HD / SSD' },
  ]},
  { categoria: '🖥️ Hardware', itens: [
    { nome: 'Instalação de memória RAM' },
    { nome: 'Troca de fonte de alimentação' },
    { nome: 'Substituição de tela (notebook)' },
    { nome: 'Reparo de placa-mãe' },
    { nome: 'Troca de bateria (notebook)' },
    { nome: 'Reparo de conector de carga' },
  ]},
  { categoria: '🌐 Rede e Sistema', itens: [
    { nome: 'Configuração de rede e Wi-Fi' },
    { nome: 'Remoção de vírus / malware' },
    { nome: 'Instalação de antivírus' },
    { nome: 'Atualização do sistema operacional' },
    { nome: 'Backup de dados' },
  ]},
];

let catalogoAberto = false;

// ====================== CATÁLOGO DE EQUIPAMENTOS ======================
function getEquipCatalogo() {
  const custom = JSON.parse(localStorage.getItem('equipCatalogo') || '[]');
  return [...equipamentosBase, ...custom];
}

function buscarModelo(query) {
  const sugestoesEl = document.getElementById('eq-sugestoes');
  if (!query || query.length < 2) { sugestoesEl.style.display = 'none'; return; }
  const q = query.toLowerCase();
  const todos = getEquipCatalogo();
  const resultados = todos.filter(e =>
    e.marca.toLowerCase().includes(q) ||
    e.modelo.toLowerCase().includes(q) ||
    (e.marca + ' ' + e.modelo).toLowerCase().includes(q)
  ).slice(0, 8);

  if (!resultados.length) {
    sugestoesEl.innerHTML = `<div style="padding:14px 16px; font-size:13px; color:var(--text3); text-align:center">Nenhum modelo encontrado. Preencha manualmente ou <button onclick="abrirModalNovoEquip()" style="background:none; border:none; color:var(--accent); cursor:pointer; font-size:13px; text-decoration:underline">cadastre um novo</button>.</div>`;
    sugestoesEl.style.display = 'block';
    return;
  }

  sugestoesEl.innerHTML = resultados.map((e, i) => `
    <div class="eq-sugestao-item" onclick="selecionarModelo(${getEquipCatalogo().indexOf(e)})">
      <div class="eq-sugestao-icon">${EQUIP_ICONS[e.tipo] || '💡'}</div>
      <div class="eq-sugestao-info">
        <div class="eq-sugestao-nome">${e.marca} ${e.modelo}</div>
        <div class="eq-sugestao-specs">${[e.cpu, e.ram, e.hd].filter(Boolean).join(' · ')}</div>
      </div>
      <div class="eq-sugestao-badge">${e.tipo}</div>
    </div>
  `).join('');
  sugestoesEl.style.display = 'block';
}

function selecionarModelo(idx) {
  const todos = getEquipCatalogo();
  const e = todos[idx];
  if (!e) return;
  // Preencher campos
  document.getElementById('eq-tipo').value = e.tipo;
  document.getElementById('eq-marca').value = e.marca;
  document.getElementById('eq-modelo').value = e.modelo;
  document.getElementById('eq-so').value = e.so || 'Windows 11';
  document.getElementById('hw-cpu').value = e.cpu || '';
  document.getElementById('hw-ram').value = e.ram || '';
  document.getElementById('hw-hd').value = e.hd || '';
  document.getElementById('hw-gpu').value = e.gpu || '';
  document.getElementById('hw-fonte').value = e.fonte || '';
  document.getElementById('hw-mb').value = e.mb || '';
  // Mostrar selecionado
  document.getElementById('eq-modelo-nome-sel').textContent = e.marca + ' ' + e.modelo;
  document.getElementById('eq-modelo-selecionado').style.display = 'block';
  document.getElementById('eq-sugestoes').style.display = 'none';
  document.getElementById('eq-busca-modelo').value = e.marca + ' ' + e.modelo;
  toast(`✅ Specs do ${e.marca} ${e.modelo} carregadas!`);
}

function limparModeloSelecionado() {
  document.getElementById('eq-modelo-selecionado').style.display = 'none';
  document.getElementById('eq-busca-modelo').value = '';
  document.getElementById('eq-sugestoes').style.display = 'none';
}

// Fechar sugestões ao clicar fora
document.addEventListener('click', function(e) {
  const sugestoesEl = document.getElementById('eq-sugestoes');
  const buscaEl = document.getElementById('eq-busca-modelo');
  if (sugestoesEl && buscaEl && !sugestoesEl.contains(e.target) && e.target !== buscaEl) {
    sugestoesEl.style.display = 'none';
  }
});

// ====================== MODAL EQUIPAMENTO ======================
function abrirModalNovoEquip(idx) {
  const modal = document.getElementById('modal-equip');
  if (idx !== undefined) {
    const custom = JSON.parse(localStorage.getItem('equipCatalogo') || '[]');
    const e = custom[idx];
    if (!e) return;
    document.getElementById('modal-equip-titulo').textContent = '✏️ Editar Equipamento';
    document.getElementById('modal-equip-idx').value = idx;
    document.getElementById('meq-tipo').value = e.tipo;
    document.getElementById('meq-marca').value = e.marca;
    document.getElementById('meq-modelo').value = e.modelo;
    document.getElementById('meq-so').value = e.so || 'Windows 11';
    document.getElementById('meq-cpu').value = e.cpu || '';
    document.getElementById('meq-ram').value = e.ram || '';
    document.getElementById('meq-hd').value = e.hd || '';
    document.getElementById('meq-gpu').value = e.gpu || '';
    document.getElementById('meq-fonte').value = e.fonte || '';
    document.getElementById('meq-mb').value = e.mb || '';
  } else {
    document.getElementById('modal-equip-titulo').textContent = '➕ Novo Equipamento no Catálogo';
    document.getElementById('modal-equip-idx').value = '';
    ['meq-marca','meq-modelo','meq-cpu','meq-ram','meq-hd','meq-gpu','meq-fonte','meq-mb'].forEach(id => { document.getElementById(id).value = ''; });
    document.getElementById('meq-tipo').value = 'Notebook';
    document.getElementById('meq-so').value = 'Windows 11';
  }
  modal.classList.add('open');
}

function fecharModalEquip() {
  document.getElementById('modal-equip').classList.remove('open');
}

function salvarEquipCatalogo() {
  const marca = document.getElementById('meq-marca').value.trim();
  const modelo = document.getElementById('meq-modelo').value.trim();
  if (!marca || !modelo) { toast('Informe marca e modelo!', 'error'); return; }
  const custom = JSON.parse(localStorage.getItem('equipCatalogo') || '[]');
  const e = {
    tipo: document.getElementById('meq-tipo').value,
    marca, modelo,
    so: document.getElementById('meq-so').value,
    cpu: document.getElementById('meq-cpu').value,
    ram: document.getElementById('meq-ram').value,
    hd: document.getElementById('meq-hd').value,
    gpu: document.getElementById('meq-gpu').value,
    fonte: document.getElementById('meq-fonte').value,
    mb: document.getElementById('meq-mb').value,
  };
  const idxStr = document.getElementById('modal-equip-idx').value;
  if (idxStr !== '') custom[parseInt(idxStr)] = e;
  else custom.push(e);
  localStorage.setItem('equipCatalogo', JSON.stringify(custom));
  fecharModalEquip();
  renderCfgEquip();
  toast('✅ Equipamento salvo no catálogo!');
}

function deletarEquipCatalogo(idx) {
  if (!confirm('Remover este equipamento do catálogo?')) return;
  const custom = JSON.parse(localStorage.getItem('equipCatalogo') || '[]');
  custom.splice(idx, 1);
  localStorage.setItem('equipCatalogo', JSON.stringify(custom));
  renderCfgEquip();
  toast('Equipamento removido.');
}

function renderCfgEquip() {
  const container = document.getElementById('cfg-equip-list');
  if (!container) return;
  const custom = JSON.parse(localStorage.getItem('equipCatalogo') || '[]');
  // Mostrar equipamentos base (somente-leitura) e os customizados
  const baseCount = equipamentosBase.length;
  let html = `<div style="font-size:11px; color:var(--text3); font-family:var(--mono); letter-spacing:1px; padding:4px 0; margin-bottom:4px">${baseCount} modelos pré-cadastrados (somente leitura)</div>`;
  if (custom.length === 0) {
    html += `<div style="font-size:13px; color:var(--text3); padding:10px 0">Nenhum equipamento personalizado cadastrado ainda.</div>`;
  } else {
    html += `<div style="font-size:11px; color:var(--accent3); font-family:var(--mono); letter-spacing:1px; padding:8px 0 4px">${custom.length} equipamento(s) personalizado(s)</div>`;
    custom.forEach((e, i) => {
      html += `<div style="display:flex; align-items:center; gap:12px; background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:10px 14px">
        <span style="font-size:18px">${EQUIP_ICONS[e.tipo]||'💡'}</span>
        <div style="flex:1; min-width:0">
          <div style="font-size:13px; font-weight:600; color:var(--text)">${e.marca} ${e.modelo}</div>
          <div style="font-size:11px; color:var(--text3); margin-top:2px">${e.tipo} · ${e.cpu||''}</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="abrirModalNovoEquip(${i})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="deletarEquipCatalogo(${i})">🗑️</button>
      </div>`;
    });
  }
  container.innerHTML = html;
}



function toggleCatalogo() {
  catalogoAberto = !catalogoAberto;
  const panel = document.getElementById('catalogo-panel');
  if (catalogoAberto) {
    panel.classList.add('open');
    renderCatalogo('');
    setTimeout(() => document.getElementById('catalogo-busca').focus(), 50);
    document.addEventListener('click', fecharCatalogoFora);
  } else {
    panel.classList.remove('open');
    document.removeEventListener('click', fecharCatalogoFora);
  }
}

function fecharCatalogoFora(e) {
  const panel = document.getElementById('catalogo-panel');
  const btn = document.getElementById('btn-catalogo');
  if (!panel.contains(e.target) && !btn.contains(e.target)) {
    panel.classList.remove('open');
    catalogoAberto = false;
    document.removeEventListener('click', fecharCatalogoFora);
  }
}

function filtrarCatalogo() {
  const busca = document.getElementById('catalogo-busca').value.toLowerCase();
  renderCatalogo(busca);
}

function getPrecosCatalogo() {
  return JSON.parse(localStorage.getItem('precosCatalogo') || '{}');
}

function renderCatalogo(busca) {
  const list = document.getElementById('catalogo-list');
  const precos = getPrecosCatalogo();
  let html = '';
  catalogoServicos.forEach(cat => {
    const filtrados = cat.itens.filter(i => i.nome.toLowerCase().includes(busca));
    if (!filtrados.length) return;
    html += `<div class="catalogo-category">${cat.categoria}</div>`;
    filtrados.forEach(item => {
      const preco = precos[item.nome] ?? 0;
      const precoLabel = preco > 0
        ? `R$ ${parseFloat(preco).toFixed(2).replace('.',',')}`
        : `<span style="color:var(--warn); font-size:11px">⚠ Sem valor definido</span>`;
      html += `
        <div class="catalogo-item">
          <div class="catalogo-item-info">
            <div class="catalogo-item-name">${item.nome}</div>
            <div class="catalogo-item-price">${precoLabel}</div>
          </div>
          <button class="catalogo-item-add" onclick="adicionarDosCatalogo('${item.nome.replace(/'/g,"\\'")}', ${preco})">+ Add</button>
        </div>`;
    });
  });
  if (!html) html = `<div style="padding:20px; text-align:center; color:var(--text3); font-size:13px">Nenhum serviço encontrado.</div>`;
  list.innerHTML = html;
}

function adicionarDosCatalogo(nome, preco) {
  adicionarItem(nome, 1, preco);
  toast(`✅ "${nome}" adicionado ao orçamento.`);
}

// ====================== PAGAMENTO BUTTONS ======================
function initPgtoButtons() {
  document.querySelectorAll('.pgto-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pgto-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('orc-pgto').value = btn.dataset.val;
    });
  });
  // selecionar PIX por padrão
  const defaultBtn = document.querySelector('.pgto-btn[data-val="PIX"]');
  if (defaultBtn) defaultBtn.classList.add('selected');
}

