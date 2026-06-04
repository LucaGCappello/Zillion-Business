/* =========================================================
   ZILLION BUSINESS — Blog
   blog.js  (dados dos artigos + filtros + busca + leitor)
   ========================================================= */
(function () {
  "use strict";
  if (!document.getElementById("postGrid")) return;

  const POSTS = [
    { id:"p1", cat:"strategy", date:"2026-05-20", read:6, featured:true,
      pt:{title:"Crescer não é aparecer mais: é estruturar melhor",
          excerpt:"Por que empresas com bons produtos travam — e o que muda quando estratégia, processos e tecnologia trabalham juntos.",
          body:["Muitas empresas têm bom produto e bom serviço, mas continuam a operar com processos manuais e decisões baseadas em intuição. O resultado é crescimento instável e dependente do dono.",
                "Estruturar melhor significa transformar visão em rotina: indicadores claros, operação previsível e tecnologia conectando marketing, vendas e atendimento. É aí que o crescimento deixa de ser sorte e passa a ser processo."]},
      en:{title:"Growing isn't about showing up more: it's about structuring better",
          excerpt:"Why companies with great products stall — and what changes when strategy, processes and technology work together.",
          body:["Many companies have a good product and good service, yet keep running on manual processes and gut-feel decisions. The result is unstable growth that depends on the owner.",
                "Structuring better means turning vision into routine: clear indicators, a predictable operation and technology connecting marketing, sales and service. That's when growth stops being luck and becomes process."]},
      it:{title:"Crescere non significa farsi notare di più: significa strutturare meglio",
          excerpt:"Perché le aziende con ottimi prodotti si bloccano — e cosa cambia quando strategia, processi e tecnologia lavorano insieme.",
          body:["Molte aziende hanno un buon prodotto e un buon servizio, ma continuano a operare con processi manuali e decisioni basate sull'intuito. Il risultato è una crescita instabile e dipendente dal titolare.",
                "Strutturare meglio significa trasformare la visione in routine: indicatori chiari, un'operazione prevedibile e la tecnologia che collega marketing, vendite e assistenza. È lì che la crescita smette di essere fortuna e diventa processo."]} },

    { id:"p2", cat:"tech", date:"2026-05-08", read:7,
      pt:{title:"Nexus: como a automação vira vantagem competitiva",
          excerpt:"WhatsApp, CRM, ERP e IA num só fluxo — o que muda na operação quando tudo conversa.",
          body:["A automação não é sobre substituir pessoas, e sim sobre tirar tarefas repetitivas do caminho. Quando instâncias, filas e regras vivem num só lugar, o time foca em decisão e relacionamento.",
                "Com a Nexus, eventos disparam fluxos automáticos, a IA apoia o atendimento e os dados aparecem em tempo real. A vantagem competitiva nasce da consistência: a operação roda igual mesmo quando o fundador não está presente."]},
      en:{title:"Nexus: how automation becomes a competitive edge",
          excerpt:"WhatsApp, CRM, ERP and AI in a single flow — what changes when everything talks to each other.",
          body:["Automation isn't about replacing people, it's about getting repetitive tasks out of the way. When instances, queues and rules live in one place, the team focuses on decisions and relationships.",
                "With Nexus, events trigger automatic flows, AI supports service and data shows up in real time. The competitive edge comes from consistency: the operation runs the same even when the founder isn't around."]},
      it:{title:"Nexus: come l'automazione diventa un vantaggio competitivo",
          excerpt:"WhatsApp, CRM, ERP e IA in un unico flusso — cosa cambia quando tutto dialoga.",
          body:["L'automazione non riguarda la sostituzione delle persone, ma il togliere di mezzo le attività ripetitive. Quando istanze, code e regole vivono in un unico posto, il team si concentra su decisioni e relazioni.",
                "Con Nexus gli eventi attivano flussi automatici, l'IA supporta l'assistenza e i dati appaiono in tempo reale. Il vantaggio competitivo nasce dalla coerenza: l'operazione funziona allo stesso modo anche quando il fondatore non c'è."]} },

    { id:"p3", cat:"growth", date:"2026-04-22", read:6,
      pt:{title:"A Máquina de Vendas: do primeiro lead à receita previsível",
          excerpt:"Como conectar marketing, processos e time comercial para transformar potencial em caixa real.",
          body:["Gerar leads não basta se o processo comercial perde oportunidades pelo caminho. A Máquina de Vendas organiza funil, rotinas de atendimento e metas num sistema único.",
                "Quando cada etapa tem dono, indicador e cadência, a receita deixa de ser montanha-russa. Previsibilidade não é vender mais num mês — é vender de forma consistente todos os meses."]},
      en:{title:"The Sales Machine: from the first lead to predictable revenue",
          excerpt:"How to connect marketing, processes and the sales team to turn potential into real cash.",
          body:["Generating leads isn't enough if the sales process loses opportunities along the way. The Sales Machine organizes funnel, service routines and targets into a single system.",
                "When every stage has an owner, an indicator and a cadence, revenue stops being a rollercoaster. Predictability isn't selling more in one month — it's selling consistently every month."]},
      it:{title:"La Macchina di Vendita: dal primo lead ai ricavi prevedibili",
          excerpt:"Come collegare marketing, processi e team commerciale per trasformare il potenziale in cassa reale.",
          body:["Generare lead non basta se il processo commerciale perde opportunità lungo il percorso. La Macchina di Vendita organizza funnel, routine di assistenza e obiettivi in un unico sistema.",
                "Quando ogni fase ha un responsabile, un indicatore e una cadenza, i ricavi smettono di essere montagne russe. La prevedibilità non è vendere di più in un mese — è vendere in modo costante ogni mese."]} },

    { id:"p4", cat:"international", date:"2026-04-05", read:8,
      pt:{title:"Do Brasil a Dubai: o que muda ao internacionalizar",
          excerpt:"Riscos, oportunidades e estrutura para operar em mais de um mercado sem perder o controle.",
          body:["Internacionalizar não é só abrir empresa fora: é entender contexto cultural, fiscal e operacional de cada mercado. O que funciona em São Paulo pode precisar de ajustes em Lisboa ou Dubai.",
                "Com polos em Portugal, Brasil e Emirados, a leitura de riscos e oportunidades vira parte do plano. A expansão sustentável mantém padrão e clareza estratégica em cada operação."]},
      en:{title:"From Brazil to Dubai: what changes when you go international",
          excerpt:"Risks, opportunities and structure to operate in more than one market without losing control.",
          body:["Going international isn't just opening a company abroad: it's understanding the cultural, tax and operational context of each market. What works in São Paulo may need adjusting in Lisbon or Dubai.",
                "With hubs in Portugal, Brazil and the Emirates, reading risks and opportunities becomes part of the plan. Sustainable expansion keeps standards and strategic clarity in every operation."]},
      it:{title:"Dal Brasile a Dubai: cosa cambia quando ti internazionalizzi",
          excerpt:"Rischi, opportunità e struttura per operare in più mercati senza perdere il controllo.",
          body:["Internazionalizzarsi non è solo aprire un'azienda all'estero: è capire il contesto culturale, fiscale e operativo di ogni mercato. Ciò che funziona a San Paolo può richiedere aggiustamenti a Lisbona o Dubai.",
                "Con sedi in Portogallo, Brasile ed Emirati, la lettura di rischi e opportunità diventa parte del piano. L'espansione sostenibile mantiene standard e chiarezza strategica in ogni operazione."]} },

    { id:"p5", cat:"investment", date:"2026-03-18", read:7,
      pt:{title:"Compra e venda de quotas: como avaliar uma empresa com caixa real",
          excerpt:"O que olhar além do faturamento ao analisar um negócio pronto para crescer.",
          body:["Faturamento alto não significa empresa saudável. Caixa, margem, dependência do dono e previsibilidade de receita contam tanto quanto o topo da linha.",
                "Avaliar uma empresa é entender o que sustenta o resultado e o que pode destravá-lo. Na Bolsa Privada, cada oportunidade passa por curadoria para que o investidor decida com contexto, não com achismo."]},
      en:{title:"Buying and selling equity: how to value a company with real cash",
          excerpt:"What to look at beyond revenue when analyzing a business ready to grow.",
          body:["High revenue doesn't mean a healthy company. Cash, margin, owner-dependence and revenue predictability matter as much as the top line.",
                "Valuing a company is understanding what sustains the result and what can unlock it. In the Private Exchange, every opportunity goes through curation so the investor decides with context, not guesswork."]},
      it:{title:"Compravendita di quote: come valutare un'azienda con cassa reale",
          excerpt:"Cosa guardare oltre al fatturato quando analizzi un'azienda pronta a crescere.",
          body:["Un fatturato alto non significa un'azienda sana. Cassa, margine, dipendenza dal titolare e prevedibilità dei ricavi contano quanto il fatturato.",
                "Valutare un'azienda significa capire cosa sostiene il risultato e cosa può sbloccarlo. Nella Borsa Privata ogni opportunità passa per una curatela, così l'investitore decide con contesto, non per intuizione."]} },

    { id:"p6", cat:"strategy", date:"2026-03-02", read:5,
      pt:{title:"Reduzir a dependência do dono: o teste dos 30 dias",
          excerpt:"Se você sumir por um mês, a operação continua? Um exercício simples para medir maturidade.",
          body:["Negócios que dependem do fundador para tudo não escalam — apenas se ocupam. O teste dos 30 dias revela onde estão os gargalos de decisão e conhecimento.",
                "Documentar processos, definir papéis e automatizar rotinas tira a operação das costas de uma pessoa só. O objetivo não é o dono trabalhar menos, é a empresa funcionar melhor."]},
      en:{title:"Reducing owner-dependence: the 30-day test",
          excerpt:"If you disappeared for a month, would the operation keep running? A simple exercise to measure maturity.",
          body:["Businesses that depend on the founder for everything don't scale — they just stay busy. The 30-day test reveals where the decision and knowledge bottlenecks are.",
                "Documenting processes, defining roles and automating routines takes the operation off one person's back. The goal isn't for the owner to work less, it's for the company to work better."]},
      it:{title:"Ridurre la dipendenza dal titolare: il test dei 30 giorni",
          excerpt:"Se sparissi per un mese, l'operazione continuerebbe? Un esercizio semplice per misurare la maturità.",
          body:["Le aziende che dipendono dal fondatore per tutto non scalano — restano solo occupate. Il test dei 30 giorni rivela dove sono i colli di bottiglia di decisione e conoscenza.",
                "Documentare i processi, definire i ruoli e automatizzare le routine toglie l'operazione dalle spalle di una sola persona. L'obiettivo non è che il titolare lavori meno, ma che l'azienda funzioni meglio."]} },

    { id:"p7", cat:"tech", date:"2026-02-14", read:5,
      pt:{title:"IA no atendimento: onde ela ajuda (e onde atrapalha)",
          excerpt:"O equilíbrio entre automação e toque humano que mantém a experiência do cliente.",
          body:["IA é excelente para triagem, respostas rápidas e organização de filas. Mal aplicada, vira muro entre a empresa e o cliente.",
                "O segredo é usar IA para liberar o time das tarefas repetitivas e direcionar o humano para o que importa: relacionamento e decisões complexas. Tecnologia a serviço da experiência, não o contrário."]},
      en:{title:"AI in customer service: where it helps (and where it hurts)",
          excerpt:"The balance between automation and human touch that keeps the customer experience intact.",
          body:["AI is excellent for triage, quick replies and queue organization. Poorly applied, it becomes a wall between the company and the customer.",
                "The trick is using AI to free the team from repetitive tasks and steer humans toward what matters: relationships and complex decisions. Technology in service of the experience, not the other way around."]},
      it:{title:"IA nell'assistenza: dove aiuta (e dove ostacola)",
          excerpt:"L'equilibrio tra automazione e tocco umano che preserva l'esperienza del cliente.",
          body:["L'IA è eccellente per smistamento, risposte rapide e organizzazione delle code. Applicata male, diventa un muro tra azienda e cliente.",
                "Il segreto è usare l'IA per liberare il team dalle attività ripetitive e indirizzare le persone verso ciò che conta: relazioni e decisioni complesse. La tecnologia al servizio dell'esperienza, non il contrario."]} },

    { id:"p8", cat:"growth", date:"2026-01-28", read:4,
      pt:{title:"Métricas de vaidade x performance: o que realmente medir",
          excerpt:"Likes não pagam a conta. Os indicadores que mostram a saúde real do negócio.",
          body:["Seguidores e curtidas alimentam o ego, mas dizem pouco sobre o caixa. Performance real aparece em conversão, custo de aquisição, ticket e retenção.",
                "Medir o que importa muda a conversa: em vez de 'fomos vistos', você passa a perguntar 'quanto isso gerou'. Decisão baseada em dados começa por escolher os dados certos."]},
      en:{title:"Vanity metrics vs performance: what to actually measure",
          excerpt:"Likes don't pay the bills. The indicators that show the real health of the business.",
          body:["Followers and likes feed the ego but say little about cash. Real performance shows up in conversion, acquisition cost, ticket size and retention.",
                "Measuring what matters changes the conversation: instead of 'we got seen', you start asking 'how much did it generate'. Data-driven decisions start by choosing the right data."]},
      it:{title:"Metriche di vanità vs performance: cosa misurare davvero",
          excerpt:"I like non pagano i conti. Gli indicatori che mostrano la vera salute del business.",
          body:["Follower e like nutrono l'ego ma dicono poco sulla cassa. La performance reale si vede in conversione, costo di acquisizione, scontrino medio e retention.",
                "Misurare ciò che conta cambia la conversazione: invece di 'siamo stati visti', inizi a chiederti 'quanto ha generato'. Le decisioni basate sui dati iniziano scegliendo i dati giusti."]} },

    { id:"p9", cat:"investment", date:"2026-01-10", read:6,
      pt:{title:"Trades estratégicos: alocar capital sem queimar caixa",
          excerpt:"Como equilibrar oportunidades de retorno e gestão de risco numa tese clara.",
          body:["Capital parado perde valor, mas capital mal alocado perde mais rápido. A disciplina está em escolher ativos com tese, não com euforia.",
                "Trades estratégicos fazem parte de uma alocação maior, com limites de risco e horizonte definido. O foco é sempre o mesmo: retorno tangível e sustentável ao longo do tempo."]},
      en:{title:"Strategic trades: allocating capital without burning cash",
          excerpt:"How to balance return opportunities and risk management within a clear thesis.",
          body:["Idle capital loses value, but poorly allocated capital loses it faster. The discipline is choosing assets with a thesis, not with euphoria.",
                "Strategic trades are part of a larger allocation, with risk limits and a defined horizon. The focus is always the same: tangible, sustainable returns over time."]},
      it:{title:"Trade strategici: allocare capitale senza bruciare cassa",
          excerpt:"Come bilanciare opportunità di rendimento e gestione del rischio in una tesi chiara.",
          body:["Il capitale fermo perde valore, ma il capitale mal allocato lo perde più in fretta. La disciplina sta nello scegliere asset con una tesi, non con l'euforia.",
                "I trade strategici fanno parte di un'allocazione più ampia, con limiti di rischio e orizzonte definito. Il focus è sempre lo stesso: rendimenti tangibili e sostenibili nel tempo."]} }
  ];

  const CATS = ["all", "strategy", "growth", "tech", "international", "investment"];
  let activeCat = "all", query = "";

  const grid = document.getElementById("postGrid");
  const featuredWrap = document.getElementById("featuredWrap");
  const catBar = document.getElementById("catBar");
  const searchEl = document.getElementById("blogSearch");
  const emptyEl = document.getElementById("blogEmpty");

  const L = () => (POSTS[0][ZB.lang] ? ZB.lang : "pt");
  const fmtDate = (iso) => {
    try { return new Intl.DateTimeFormat(ZB.LOCALES[ZB.lang] || "pt-PT", { day:"numeric", month:"short", year:"numeric" }).format(new Date(iso)); }
    catch (e) { return iso; }
  };
  const esc = (s) => s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

  function buildCats() {
    catBar.innerHTML = "";
    CATS.forEach(c => {
      const b = document.createElement("button");
      b.className = "cat-chip" + (c === activeCat ? " active" : "");
      b.textContent = ZB.t("cat_" + c);
      b.addEventListener("click", () => { activeCat = c; buildCats(); render(); });
      catBar.appendChild(b);
    });
  }

  function cover(post, idx, big) {
    const fig = big ? "" : '<span class="cv-fig">' + String(idx + 1).padStart(2, "0") + "</span>";
    return '<div class="post-cover cat-' + post.cat + (big ? " big" : "") + '">' +
           '<span class="cv-cat">' + esc(ZB.t("cat_" + post.cat)) + "</span>" + fig + "</div>";
  }
  function meta(post) {
    return '<div class="post-meta"><span>' + fmtDate(post.date) + '</span><span class="dot"></span>' +
           '<span>' + post.read + " " + esc(ZB.t("blog_min")) + "</span></div>";
  }

  function postCard(post, idx) {
    const c = post[L()];
    const el = document.createElement("article");
    el.className = "post-card reveal in";
    el.innerHTML = cover(post, idx, false) +
      '<div class="post-body"><h3>' + esc(c.title) + "</h3>" +
      '<p class="excerpt">' + esc(c.excerpt) + "</p>" + meta(post) +
      '<span class="post-read-link">' + esc(ZB.t("blog_read")) +
      ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>';
    el.addEventListener("click", () => openReader(post));
    return el;
  }

  function renderFeatured() {
    const post = POSTS.find(p => p.featured);
    if (!post || activeCat !== "all" || query) { featuredWrap.innerHTML = ""; featuredWrap.style.display = "none"; return; }
    featuredWrap.style.display = "";
    const c = post[L()];
    const card = document.createElement("div");
    card.className = "featured-card reveal in";
    card.innerHTML = cover(post, 0, true) +
      '<div class="featured-body"><span class="feat-badge">★ ' + esc(ZB.t("blog_featured")) + "</span>" +
      "<h2>" + esc(c.title) + "</h2>" +
      '<p class="excerpt">' + esc(c.excerpt) + "</p>" + meta(post) +
      '<span class="post-read-link">' + esc(ZB.t("blog_read")) +
      ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>';
    card.addEventListener("click", () => openReader(post));
    featuredWrap.innerHTML = "";
    featuredWrap.appendChild(card);
  }

  function visiblePosts() {
    const q = query.trim().toLowerCase();
    return POSTS.filter(p => {
      if (activeCat !== "all" && p.cat !== activeCat) return false;
      if (p.featured && activeCat === "all" && !q) return false;
      if (q) {
        const c = p[L()];
        if ((c.title + " " + c.excerpt).toLowerCase().indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function render() {
    renderFeatured();
    const list = visiblePosts();
    grid.innerHTML = "";
    list.forEach(p => grid.appendChild(postCard(p, POSTS.indexOf(p))));
    const featuredShown = POSTS.find(x => x.featured) && activeCat === "all" && !query;
    emptyEl.classList.toggle("show", list.length === 0 && !featuredShown);
  }

  /* ---------- reader ---------- */
  const reader = document.getElementById("reader");
  const readerCard = document.getElementById("readerCard");
  let currentPost = null;

  function openReader(post) { currentPost = post; paintReader(); reader.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeReader() { reader.classList.remove("open"); document.body.style.overflow = ""; currentPost = null; }
  function paintReader() {
    if (!currentPost) return;
    const post = currentPost, c = post[L()];
    readerCard.innerHTML =
      '<button class="reader-x" id="readerX" aria-label="Fechar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
      cover(post, 0, true) +
      '<div class="reader-inner"><span class="cat-chip active" style="cursor:default">' + esc(ZB.t("cat_" + post.cat)) + "</span>" +
      "<h1>" + esc(c.title) + "</h1>" + meta(post) +
      c.body.map(p => "<p>" + esc(p) + "</p>").join("") +
      '<button class="btn btn-ghost reader-back" id="readerBack">' + esc(ZB.t("blog_back")) + "</button></div>";
    document.getElementById("readerX").addEventListener("click", closeReader);
    document.getElementById("readerBack").addEventListener("click", closeReader);
  }
  reader.addEventListener("click", (e) => { if (e.target === reader) closeReader(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && reader.classList.contains("open")) closeReader(); });

  /* ---------- newsletter ---------- */
  const newsBtn = document.getElementById("newsBtn");
  const newsInput = document.getElementById("newsInput");
  const newsOk = document.getElementById("newsOk");
  if (newsBtn) newsBtn.addEventListener("click", () => {
    const v = (newsInput.value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { newsInput.focus(); newsInput.style.borderColor = "var(--accent)"; return; }
    newsInput.value = ""; newsInput.style.borderColor = "";
    newsOk.textContent = ZB.t("news_ok"); newsOk.classList.add("show");
  });

  if (searchEl) searchEl.addEventListener("input", () => { query = searchEl.value; render(); });

  window.addEventListener("zb:langchange", () => {
    buildCats(); render();
    if (searchEl) searchEl.placeholder = ZB.t("blog_search_ph");
    if (newsOk && newsOk.classList.contains("show")) newsOk.textContent = ZB.t("news_ok");
    if (currentPost) paintReader();
  });

  buildCats();
  render();
})();
