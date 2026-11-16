(() => {
  const D = window.NORTON_DATA, C = window.NORTON_CONTENT;
  const app = document.getElementById('app');
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = Object.fromEntries(D.produtos.map(p => [p.id, p]));

  const ESP = {
    orto: { nome: 'Ortopedia e Traumatologia', curto: 'Ortopedia',
      desc: 'Trauma de mão ao fêmur, artroplastia, fixadores externos, biomateriais e partes moles.' },
    neuro: { nome: 'Coluna e Neurocirurgia', curto: 'Coluna e Neuro',
      desc: 'Bloqueio de nervos e dor, discectomia e discografia, endoscopia de coluna e apoio à microdissecção.' }
  };

  /* ---------- icons ---------- */
  const I = {
    bone: '<svg viewBox="0 0 24 24"><path d="M17 3.5a2.5 2.5 0 0 1 3.5 3.5 2.5 2.5 0 0 1-2.2 3.9L10.9 18.3A2.5 2.5 0 0 1 7 20.5 2.5 2.5 0 0 1 3.5 17a2.5 2.5 0 0 1 2.2-3.9L13.1 5.7A2.5 2.5 0 0 1 17 3.5z"/></svg>',
    spine: '<svg viewBox="0 0 24 24"><rect x="8" y="2.5" width="8" height="3.5" rx="1.2"/><rect x="7.5" y="7.5" width="9" height="3.5" rx="1.2"/><rect x="7" y="12.5" width="10" height="3.5" rx="1.2"/><rect x="7.5" y="17.5" width="9" height="4" rx="1.4"/><path d="M5 4.2h3M16 4.2h3M4.5 9.2h3M16.5 9.2h3M4 14.2h3M17 14.2h3"/></svg>',
    building: '<svg viewBox="0 0 24 24"><path d="M4 21V5l8-3 8 3v16"/><path d="M9 21v-5h6v5M8 8h2M14 8h2M8 12h2M14 12h2"/></svg>',
    grid: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    zoom: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M8 11h6M11 8v6"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/></svg>',
    cat: {
      'mao-punho': '<svg viewBox="0 0 24 24"><path d="M8 13V5a1.5 1.5 0 0 1 3 0v6M11 10V3.5a1.5 1.5 0 0 1 3 0V10M14 10V5a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7h-.5a6 6 0 0 1-5-2.7L3 14.5a1.6 1.6 0 0 1 2.6-1.8L8 15"/></svg>',
      'membro-superior': '<svg viewBox="0 0 24 24"><circle cx="7" cy="5" r="2.5"/><path d="M9 7l5 6 5 1M14 13l-2 8"/></svg>',
      'pe-tornozelo': '<svg viewBox="0 0 24 24"><path d="M8 3v9c0 3-3 4-3 6.5S7 22 10 22h8c1.5 0 2-1.5 1-2.5l-5-3.5c-1.2-.8-2-2-2-3.5V3"/></svg>',
      'parafusos': '<svg viewBox="0 0 24 24"><path d="M9 3h6v3H9zM10 6h4v13l-2 3-2-3zM10 9l4 1.5M10 12l4 1.5M10 15l4 1.5"/></svg>',
      'hastes': '<svg viewBox="0 0 24 24"><path d="M14 2l1.5 1.5-1.5 2v16.5h-3V5.5L6 9 5 7.5 12.5 2z"/><path d="M11 14h3M11 18h3"/></svg>',
      'artroplastia': '<svg viewBox="0 0 24 24"><circle cx="9" cy="6" r="3.5"/><path d="M11.5 8.5L16 13l-2 9h-3l1-7.5L8 10.5"/></svg>',
      'fixadores': '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="8" ry="2.5"/><ellipse cx="12" cy="18" rx="8" ry="2.5"/><path d="M6 7.5v9M18 7.5v9M12 3v18"/></svg>',
      'biomateriais': '<svg viewBox="0 0 24 24"><circle cx="8" cy="9" r="3"/><circle cx="16" cy="8" r="2.5"/><circle cx="13" cy="15.5" r="3.5"/><circle cx="6" cy="17" r="1.8"/></svg>',
      'artroscopia': '<svg viewBox="0 0 24 24"><path d="M3 21l9-9M12 12l3-3 6-6M15 9l-1.5-1.5M8.5 15.5L7 14"/><circle cx="19" cy="5" r="1.5"/></svg>',
      'dor-orto': '<svg viewBox="0 0 24 24"><path d="M3 21l7-7M10 14l7.5-7.5 2 2L12 16zM17 4l3 3M14 17l-1.5 1.5"/></svg>',
      'dor': '<svg viewBox="0 0 24 24"><path d="M3 21l7-7M10 14l7.5-7.5 2 2L12 16zM17 4l3 3M14 17l-1.5 1.5"/></svg>',
      'disco': '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="5" rx="1.5"/><rect x="5" y="16" width="14" height="5" rx="1.5"/><ellipse cx="12" cy="12" rx="6" ry="2"/></svg>',
      'endoscopia': '<svg viewBox="0 0 24 24"><circle cx="17" cy="7" r="3.5"/><path d="M14.5 9.5L3 21M17 5.5v3M15.5 7h3"/></svg>',
      'apoio-neuro': '<svg viewBox="0 0 24 24"><path d="M12 3c-4 0-7 2.7-7 6.5 0 2 1 3.5 2 4.5v4h10v-4c1-1 2-2.5 2-4.5C19 5.7 16 3 12 3zM9 21h6"/><path d="M12 7v6M9.5 10h5"/></svg>'
    }
  };

  /* ---------- router ---------- */
  const parse = () => {
    const h = decodeURIComponent(location.hash.slice(1) || '/');
    const [path, qs] = h.split('?');
    return { parts: path.split('/').filter(Boolean), q: new URLSearchParams(qs || '') };
  };
  const go = h => { location.hash = h; };

  function render() {
    const { parts, q } = parse();
    closeSheet(); closeLB();
    let v;
    if (!parts.length) v = vHome();
    else if (parts[0] === 'empresa') v = vEmpresa();
    else if (parts[0] === 'produtos') v = vProdutos();
    else if (parts[0] === 'e' && parts[2] === 'c') v = vCategoria(parts[1], parts[3], q);
    else if (parts[0] === 'e') v = vEspecialidade(parts[1], q);
    else if (parts[0] === 'p') v = vProduto(parts[1], q);
    else if (parts[0] === 'busca') v = vBusca(q.get('q') || '');
    else v = vHome();
    app.innerHTML = v.html;
    document.getElementById('topbar').hidden = !!v.bare;
    document.getElementById('fab-contato').hidden = !!v.bare;
    setCrumbs(v.crumbs || []);
    document.title = (v.title ? v.title + ' · ' : '') + 'Norton Hospitalar';
    const si = $('#search-input'); if (parts[0] !== 'busca') si.value = '';
    window.scrollTo(0, 0);
    v.after && v.after();
  }

  function setCrumbs(list) {
    $('#crumbs').innerHTML = list.map((c, i) => i === list.length - 1
      ? `<b>${esc(c[0])}</b>` : `<a href="${c[1]}">${esc(c[0])}</a><span class="sep">/</span>`).join('');
  }

  /* ---------- views ---------- */
  function vHome() {
    const nO = D.produtos.filter(p => p.esp.includes('orto')).length;
    const nN = D.produtos.filter(p => p.esp.includes('neuro')).length;
    return { bare: true, html: `
    <section class="home fade">
      <div class="home-inner">
        <div class="logo-card"><img src="img/logo-norton.png" alt="Norton Hospitalar"></div>
        <p class="since">Distribuidora de OPME em Macapá · desde ${esc(C.empresa.desde)}</p>
        <h1>Portfólio de OPME para <em>ortopedia</em>, <em>coluna</em> e neurocirurgia.</h1>
        <p class="sub">Escolha por onde começar: conheça a Norton ou vá direto aos materiais, medidas e especificações técnicas.</p>
        <div class="choices">
          <a class="choice" href="#/empresa"><span class="ic">${I.building}</span><span><b>Conhecer a Norton</b><span>Estrutura, fornecedores e diferenciais</span></span></a>
          <a class="choice primary" href="#/produtos"><span class="ic">${I.grid}</span><span><b>Ir direto aos produtos</b><span>${D.produtos.length} sistemas e kits</span></span></a>
        </div>
        <div class="quick">
          <a href="#/e/orto">${ESP.orto.curto} · ${nO}</a>
          <a href="#/e/neuro">${ESP.neuro.curto} · ${nN}</a>
          ${D.categorias.orto.slice(0, 4).map(c => `<a href="#/e/orto/c/${c.id}">${esc(c.nome)}</a>`).join('')}
        </div>
      </div>
      <div class="home-foot">${esc(C.aviso)}</div>
    </section>` };
  }

  function vEmpresa() {
    const E = C.empresa;
    const anos = new Date().getFullYear() - (+E.desde || 2010);
    const fotos = E.fotos || [];
    return {
      title: 'A empresa', crumbs: [['Início', '#/'], ['A empresa']],
      html: `<section class="emp-hero fade" style="--bg:url('${fotos[0] ? fotos[0].src : ''}')">
        <div class="emp-hero-in">
          <p class="eyebrow light">A empresa · desde ${esc(E.desde)}</p>
          <h1>${esc(E.titulo)}</h1>
          <p>${esc(E.chamada)}</p>
          <div class="emp-stats">
            <div><b>${anos}+</b><span>anos de mercado</span></div>
            <div><b>${E.fornecedores.length}</b><span>fornecedores</span></div>
            <div><b>${D.produtos.length}</b><span>sistemas no portfólio</span></div>
            <div><b>${E.segmentos.length === 2 ? 'Público e privado' : esc(E.segmentos.join(', '))}</b><span>segmentos</span></div>
          </div>
        </div>
      </section>
      <div class="wrap fade">
      <div class="about">
        <div>
          <div class="section-h" style="margin-top:0"><h2>Quem somos</h2></div>
          ${E.paragrafos.map(p => `<p>${esc(p)}</p>`).join('')}
          <div class="section-h"><h2>Áreas de atuação</h2></div>
          <div class="fab-list">${E.areas.map(a => `<span>${esc(a)}</span>`).join('')}${E.linhasAdicionais.map(a => `<span class="alt">${esc(a)}</span>`).join('')}</div>
        </div>
        <aside class="about-side">
          <h3>Pronto para ver os materiais?</h3>
          <p>Navegue por especialidade, região anatômica ou busque por nome e medida.</p>
          <a class="btn pri" href="#/e/orto">${I.bone} ${ESP.orto.curto}</a>
          <a class="btn sec" href="#/e/neuro">${I.spine} ${ESP.neuro.curto}</a>
        </aside>
      </div>

      <div class="section-h"><h2>Nossa estrutura</h2><span class="muted">${fotos.length} fotos · toque para ampliar</span></div>
      <div class="gallery">${fotos.map((f, i) => `<button class="g-item ${i === 0 ? 'big' : ''}" data-foto="${i}"><img src="${f.src}" alt="${esc(f.legenda)}" loading="lazy"><span>${esc(f.legenda)}</span></button>`).join('')}</div>

      <div class="section-h"><h2>Por que trabalhar com a Norton?</h2></div>
      <div class="pilares four">${E.diferenciais.map((p, i) => `<div class="pilar"><i>${String(i + 1).padStart(2, '0')}</i><b>${esc(p.titulo)}</b><span>${esc(p.texto)}</span></div>`).join('')}</div>

      <div class="section-h"><h2>Fornecedores</h2></div>
      <div class="fab-list">${E.fornecedores.map(f => `<span>${esc(f)}</span>`).join('')}</div>

      <div class="section-h"><h2>Localização</h2></div>
      <div class="loc">
        <div class="loc-ic">${I.pin}</div>
        <div><b>${esc(E.endereco)}</b><span>Localizada em uma das principais avenidas da cidade, o que facilita a logística e a entrega de materiais cirúrgicos.</span></div>
        ${E.mapa ? `<a class="btn sec" href="${E.mapa}" target="_blank" rel="noopener">${I.pin} Abrir no mapa</a>` : ''}
      </div>
      <p class="note">${esc(E.razaoSocial)} · CNPJ ${esc(E.cnpj)}</p>
      </div>`,
      after() {
        const list = fotos.map(f => f.src);
        app.querySelectorAll('[data-foto]').forEach(b => b.onclick = () => openLB(list, +b.dataset.foto));
      }
    };
  }

  function vProdutos() {
    const tile = k => {
      const n = D.produtos.filter(p => p.esp.includes(k)).length;
      return `<a class="spec ${k}" href="#/e/${k}"><div class="art">${k === 'orto' ? I.bone : I.spine}</div>
        <h2>${ESP[k].nome}</h2><p>${ESP[k].desc}</p>
        <div class="meta"><span class="pill">${n} produtos</span><span class="pill">${D.categorias[k].length} categorias</span></div></a>`;
    };
    return {
      title: 'Produtos', crumbs: [['Início', '#/'], ['Produtos']],
      html: `<div class="wrap fade"><p class="eyebrow">Portfólio</p><h1 class="title">Qual é a sua especialidade?</h1>
      <p class="lead">Escolha a área para ver os materiais organizados por região e tipo de procedimento.</p>
      <div class="spec-grid">${tile('orto')}${tile('neuro')}</div>
      <div class="section-h"><h2>Destaques</h2><a class="btn sec" href="#/busca?q=">Ver todos</a></div>
      <div class="prod-grid">${['neo-hip', 'fixnail', 'r-evolution', 'endoscopia'].map(id => card(byId[id])).join('')}</div></div>`
    };
  }

  function vEspecialidade(k, q) {
    if (!ESP[k]) return vProdutos();
    const prods = D.produtos.filter(p => p.esp.includes(k));
    const cats = D.categorias[k].filter(c => c.n > 0);
    return {
      title: ESP[k].nome, crumbs: [['Início', '#/'], ['Produtos', '#/produtos'], [ESP[k].curto]],
      html: `<div class="wrap fade"><p class="eyebrow">${ESP[k].curto}</p><h1 class="title">${ESP[k].nome}</h1>
      <p class="lead">${ESP[k].desc}</p>
      <div class="cat-grid">${cats.map(c => {
        const ps = prods.filter(p => p.cat.includes(c.id)).slice(0, 4);
        return `<a class="cat" href="#/e/${k}/c/${c.id}"><span class="n">${c.n}</span><span class="cat-ic">${I.cat[c.id] || I.grid}</span>
        <h3>${esc(c.nome)}</h3><p>${esc(c.desc)}</p><div class="thumbs-row">${ps.map(p => `<img src="${p.img}" alt="" loading="lazy">`).join('')}</div></a>`;
      }).join('')}</div>
      <div class="section-h"><h2>Todos os produtos de ${ESP[k].curto}</h2></div>
      ${fabFilter(prods, q, `#/e/${k}`)}
      <div class="prod-grid">${filterFab(prods, q).map(p => card(p, k)).join('')}</div></div>`
    };
  }

  function vCategoria(k, cid, q) {
    const c = (D.categorias[k] || []).find(x => x.id === cid);
    if (!c) return vEspecialidade(k, q);
    const prods = D.produtos.filter(p => p.esp.includes(k) && p.cat.includes(cid));
    return {
      title: c.nome, crumbs: [['Início', '#/'], [ESP[k].curto, `#/e/${k}`], [c.nome]],
      html: `<div class="wrap fade"><p class="eyebrow">${ESP[k].curto}</p><h1 class="title">${esc(c.nome)}</h1>
      <p class="lead">${esc(c.desc)}</p>
      ${fabFilter(prods, q, `#/e/${k}/c/${cid}`)}
      <div class="prod-grid">${filterFab(prods, q).map(p => card(p, k)).join('')}</div></div>`
    };
  }

  function fabFilter(prods, q, base) {
    const fabs = [...new Set(prods.map(p => p.fab))];
    if (fabs.length < 2) return '';
    const cur = q.get('fab') || '';
    return `<div class="filters"><a class="chip ${cur ? '' : 'on'}" href="${base}">Todos</a>${fabs.map(f =>
      `<a class="chip ${cur === f ? 'on' : ''}" href="${base}?fab=${encodeURIComponent(f)}">${esc(f)}</a>`).join('')}</div>`;
  }
  const filterFab = (prods, q) => q.get('fab') ? prods.filter(p => p.fab === q.get('fab')) : prods;

  function card(p, k) {
    if (!p) return '';
    return `<a class="prod" href="#/p/${p.id}${k ? '?e=' + k : ''}"><div class="ph"><img src="${p.img}" alt="${esc(p.nome)}" loading="lazy"></div>
      <div class="bd"><span class="fab-tag">${esc(p.fab)}</span><h3>${esc(p.nome)}</h3><span class="s">${esc(p.sub || '')}</span>
      <span class="r">${esc(p.resumo || '')}</span></div></a>`;
  }

  function vProduto(id, q) {
    const p = byId[id];
    if (!p) return vProdutos();
    const k = q.get('e') && p.esp.includes(q.get('e')) ? q.get('e') : p.esp[0];
    const cat = D.categorias[k].find(c => p.cat.includes(c.id));
    const gal = p.galeria;
    const start = Math.max(0, gal.indexOf(p.imgFull));
    const list = a => `<ul class="list">${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    const isShort = a => a.every(x => x.length <= 24);

    const spec = [];
    if (p.material) spec.push(`<h4>Material</h4><div class="mat">${esc(p.material)}</div>`);
    if (p.medidas) spec.push(`<h4>Tamanhos e medidas</h4>${isShort(p.medidas) ? `<ul class="sizes">${p.medidas.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : list(p.medidas)}`);
    if (p.tabela) spec.push(`<h4>Tabela de referência</h4><div class="tbl-wrap"><table><thead><tr>${p.tabela.cab.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>${p.tabela.lin.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
    if (p.especificacoes) spec.push(`<h4>Especificações</h4>${list(p.especificacoes)}`);
    if (p.caracteristicas) spec.push(`<h4>Características e diferenciais</h4>${list(p.caracteristicas)}`);
    const tabs = [];
    if (spec.length) tabs.push(['spec', 'Especificações', spec.join('')]);
    if (p.composicao) tabs.push(['comp', 'Composição', list(p.composicao)]);
    if (p.indicacoes) tabs.push(['ind', 'Indicações', list(p.indicacoes)]);
    tabs.push(['reg', 'Registro', p.anvisa ? `<h4>Registro ANVISA</h4><div class="anvisa">${p.anvisa.map(a => `<span>${esc(a)}</span>`).join('')}</div>
      <h4>Fabricante</h4><div class="mat" style="background:#EEF2FA;color:var(--navy)">${esc(p.fab)}</div>`
      : `<h4>Fabricante</h4><div class="mat" style="background:#EEF2FA;color:var(--navy)">${esc(p.fab)}</div><p class="note" style="margin-top:14px;border:0;padding:0">Registro ANVISA disponível com o representante.</p>`]);

    const rel = D.produtos.filter(x => x.id !== p.id && x.esp.includes(k) && x.cat.some(c => p.cat.includes(c))).slice(0, 4);
    const nPages = p.galeria.length;
    return {
      title: p.nome,
      crumbs: [['Início', '#/'], [ESP[k].curto, `#/e/${k}`], ...(cat ? [[cat.nome, `#/e/${k}/c/${cat.id}`]] : []), [p.nome]],
      html: `<div class="wrap fade"><div class="detail">
        <div class="hero-img">
          <div class="main" data-lb="${start}"><img src="${p.imgFull}" alt="${esc(p.nome)}"><span class="zoom-hint">${I.zoom} Toque para ampliar</span></div>
          ${nPages > 1 ? `<div class="strip-label"><span>Catálogo do fabricante · ${nPages} páginas</span><button data-lb="0">${I.book} Abrir</button></div>
          <div class="strip">${gal.map((g, i) => `<button data-lb="${i}" class="${i === start ? 'cur' : ''}" aria-label="Página ${i + 1}"><img src="${g}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
        </div>
        <div>
          <div class="d-head"><span class="fab-tag">${esc(p.fab)}</span><h1>${esc(p.nome)}</h1>
            ${p.sub ? `<p class="s">${esc(p.sub)}</p>` : ''}<p class="r">${esc(p.resumo || '')}</p></div>
          <div class="tags">${p.esp.map(e => `<a class="tag" href="#/e/${e}">${ESP[e].curto}</a>`).join('')}
            ${p.cat.map(c => { const cc = [...D.categorias.orto, ...D.categorias.neuro].find(x => x.id === c); const e = D.categorias.orto.includes(cc) ? 'orto' : 'neuro';
              return cc && p.esp.includes(e) ? `<a class="tag g" href="#/e/${e}/c/${c}">${esc(cc.nome)}</a>` : ''; }).join('')}</div>
          <div class="tabs" role="tablist">${tabs.map((t, i) => `<button role="tab" data-tab="${t[0]}" class="${i ? '' : 'on'}">${t[1]}</button>`).join('')}</div>
          ${tabs.map((t, i) => `<div class="panel" data-panel="${t[0]}" ${i ? 'hidden' : ''}>${t[2]}</div>`).join('')}
          <div class="cta-row"><button class="btn pri" data-contato="${esc(p.nome)}">${I.chat} Solicitar este material</button>
            ${nPages > 1 ? `<button class="btn sec" data-lb="0">${I.book} Ver catálogo completo</button>` : ''}</div>
        </div></div>
        ${rel.length ? `<div class="related"><div class="section-h"><h2>Relacionados</h2></div><div class="prod-grid">${rel.map(x => card(x, k)).join('')}</div></div>` : ''}
        <p class="note">${esc(C.aviso)}</p></div>`,
      after() {
        app.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => {
          app.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('on', x === b));
          app.querySelectorAll('[data-panel]').forEach(x => x.hidden = x.dataset.panel !== b.dataset.tab);
        });
        app.querySelectorAll('[data-lb]').forEach(b => b.onclick = () => openLB(gal, +b.dataset.lb));
      }
    };
  }

  const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  function vBusca(term) {
    const t = norm(term.trim());
    const words = t.split(/\s+/).filter(Boolean);
    const res = D.produtos.filter(p => {
      const hay = norm([p.nome, p.sub, p.fab, p.resumo, p.material, ...(p.medidas || []), ...(p.indicacoes || []),
        ...(p.composicao || []), ...(p.caracteristicas || []), ...(p.anvisa || []), ...p.cat].join(' '));
      return words.every(w => hay.includes(w));
    });
    return {
      title: 'Busca', crumbs: [['Início', '#/'], [term ? `Busca: ${term}` : 'Todos os produtos']],
      html: `<div class="wrap fade"><p class="eyebrow">${term ? 'Resultado da busca' : 'Catálogo completo'}</p>
      <h1 class="title">${term ? `“${esc(term)}”` : 'Todos os produtos'}</h1>
      <p class="lead">${res.length} ${res.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</p>
      ${res.length ? `<div class="prod-grid">${res.map(p => card(p)).join('')}</div>` : `<div class="empty">Nenhum produto encontrado. Tente outro termo, como “haste”, “3.5”, “bloqueio” ou o nome do fabricante.</div>`}</div>`,
      after() { $('#search-input').value = term; }
    };
  }

  /* ---------- search ---------- */
  let st;
  $('#search-form').onsubmit = e => { e.preventDefault(); go('#/busca?q=' + encodeURIComponent($('#search-input').value)); };
  $('#search-input').oninput = e => { clearTimeout(st); const v = e.target.value; if (v.length >= 2) st = setTimeout(() => {
    history.replaceState(null, '', '#/busca?q=' + encodeURIComponent(v)); render(); const si = $('#search-input'); si.focus(); si.setSelectionRange(v.length, v.length);
  }, 350); };
  $('#btn-back').onclick = () => { if (history.length > 1) history.back(); else go('#/'); };

  /* ---------- contato ---------- */
  const K = C.contato;
  const hasContact = Object.values(K).some(Boolean);
  const fab = $('#fab-contato');
  fab.hidden = false;
  fab.onclick = () => openContato();
  app.addEventListener('click', e => { const b = e.target.closest('[data-contato]'); if (b) openContato(b.dataset.contato); });

  function openContato(produto) {
    const msg = `Olá! Gostaria de mais informações${produto ? ` sobre ${produto}` : ''} (portfólio Norton Hospitalar).`;
    const items = [];
    if (K.whatsapp) items.push(`<a href="https://wa.me/${K.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${I.chat} WhatsApp</a>`);
    if (K.telefone) items.push(`<a href="tel:${K.telefone.replace(/[^\d+]/g, '')}">${I.phone} ${esc(K.telefone)}</a>`);
    if (K.email) items.push(`<a href="mailto:${K.email}?subject=${encodeURIComponent('Portfólio Norton' + (produto ? ' — ' + produto : ''))}&body=${encodeURIComponent(msg)}">${I.mail} ${esc(K.email)}</a>`);
    if (K.instagram) items.push(`<a href="https://instagram.com/${K.instagram.replace('@', '')}" target="_blank" rel="noopener">${I.chat} @${esc(K.instagram.replace('@', ''))}</a>`);
    if (K.endereco) items.push(`<div>${I.pin} ${esc(K.endereco)}</div>`);
    $('#sheet-body').innerHTML = `<h3 id="sheet-title">${produto ? esc(produto) : 'Fale com a Norton'}</h3>
      <p>${K.representante ? esc(K.representante) : 'Representante Norton Hospitalar'}${produto ? ' · solicite disponibilidade, medidas e caixa cirúrgica.' : ''}</p>
      <div class="contact-list">${hasContact ? items.join('') : `<div>${I.chat} Contatos em atualização. Fale com o representante que apresentou este portfólio.</div>`}</div>`;
    $('#sheet').hidden = false;
  }
  function closeSheet() { $('#sheet').hidden = true; }
  $('#sheet').onclick = e => { if (e.target.id === 'sheet' || e.target.closest('[data-close]')) closeSheet(); };

  /* ---------- lightbox ---------- */
  let LB = { list: [], i: 0 };
  const lb = $('#lightbox'), lbImg = $('#lb-img'), lbStage = $('#lb-stage');
  function openLB(list, i) { LB = { list, i }; lb.hidden = false; showLB(); document.body.style.overflow = 'hidden'; }
  function closeLB() { lb.hidden = true; document.body.style.overflow = ''; lbStage.classList.remove('zoom'); }
  function showLB() {
    LB.i = (LB.i + LB.list.length) % LB.list.length;
    lbStage.classList.remove('zoom'); lbImg.src = LB.list[LB.i];
    $('#lb-count').textContent = `${LB.i + 1} / ${LB.list.length}`;
    $('#lb-prev').hidden = $('#lb-next').hidden = LB.list.length < 2;
    [LB.i + 1, LB.i - 1].forEach(j => { const s = LB.list[(j + LB.list.length) % LB.list.length]; if (s) new Image().src = s; });
  }
  $('#lb-close').onclick = closeLB;
  $('#lb-prev').onclick = () => { LB.i--; showLB(); };
  $('#lb-next').onclick = () => { LB.i++; showLB(); };
  $('#lb-zoom').onclick = () => lbStage.classList.toggle('zoom');
  lbImg.ondblclick = () => lbStage.classList.toggle('zoom');
  let tx = null;
  lbStage.addEventListener('touchstart', e => { tx = e.touches.length === 1 && !lbStage.classList.contains('zoom') ? e.touches[0].clientX : null; }, { passive: true });
  lbStage.addEventListener('touchend', e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) { LB.i += dx < 0 ? 1 : -1; showLB(); } tx = null; });
  document.addEventListener('keydown', e => {
    if (!lb.hidden) { if (e.key === 'Escape') closeLB(); if (e.key === 'ArrowRight') { LB.i++; showLB(); } if (e.key === 'ArrowLeft') { LB.i--; showLB(); } }
    else if (e.key === 'Escape') closeSheet();
  });

  window.addEventListener('hashchange', render);
  render();

  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
