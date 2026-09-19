/* NPCAT! — Català / English toggle.
   The dictionary is keyed by the English markup of each element; toggling swaps innerHTML and restores it on the way back.
   Activate with the nav button, ?lang=ca, or a saved preference. */
(function () {
  'use strict';
  const CA = new Map([
    // nav + controls
    ['Lore', 'Història'], ['Quest', 'Missió'], ['Pair', 'Parell'], ['Buy', 'Compra'], ['FAQ', 'Preguntes'],
    ['Buy on StonkFun', 'Compra a StonkFun'], ['Sound off', 'So apagat'], ['Sound on', 'So encès'], ['Skip to content', 'Ves al contingut'],
    // hero chapters
    ['01 / 04 — the crowd', '01 / 04 — la multitud'],
    ['Ten thousand NPCs. One <em>cat.</em>', 'Deu mil NPC. Un <em>gat.</em>'],
    ['Every dot is a non-playable character. Move your cursor through them. They part. They come back. They always come back.', 'Cada punt és un personatge no jugable. Passa-hi el cursor. S’aparten. Tornen. Sempre tornen.'],
    ['02 / 04 — quest available', '02 / 04 — missió disponible'],
    ['The quest is simple. Hold $NPCAT, get <em>$NPC.</em>', 'La missió és senzilla. Guarda $NPCAT, rep <em>$NPC.</em>'],
    ['The yellow mark means an NPC has a quest for you. This one has exactly one step.', 'El senyal groc vol dir que un NPC té una missió per a tu. Aquesta només té un pas.'],
    ['Read the quest', 'Llegeix la missió'],
    ['03 / 04 — the ticker', '03 / 04 — el tíquer'],
    ['$NPCAT, paired with $NPC.', '$NPCAT, aparellat amb $NPC.'],
    ['Launched on StonkFun on Solana, quoted in Non-Playable Coin instead of SOL. Two grey faces, one chart.', 'Llançat a StonkFun, a Solana, cotitzat en Non-Playable Coin en lloc de SOL. Dues cares grises, un sol gràfic.'],
    ['Buy $NPCAT with $NPC', 'Compra $NPCAT amb $NPC'],
    ['04 / 04 — the heart', '04 / 04 — el cor'],
    ['It has a heart. Somewhere in there.', 'Té un cor. En algun lloc, allà dins.'],
    ['No roadmap. No utility. Just a cat made of everyone, holding the line.', 'Sense full de ruta. Sense utilitat. Només un gat fet de tothom, aguantant la línia.'],
    ['Move · the crowd parts', 'Mou · la multitud s’aparta'], ['Click · it scatters', 'Clica · es dispersa'], ['Scroll · it changes shape', 'Desplaça · canvia de forma'],
    // marquee
    ['<b>!</b> Quest is simple <b>!</b> Hold $NPCAT <b>!</b> Get $NPC <b>!</b> We are all NPCAT <b>!</b> No roadmap <b>!</b> It just sits there', '<b>!</b> La missió és senzilla <b>!</b> Guarda $NPCAT <b>!</b> Rep $NPC <b>!</b> Tots som NPCAT <b>!</b> Sense full de ruta <b>!</b> Només s’està allà assegut'],
    // lore
    ['The lore', 'La història'],
    ['Eight billion people. Most of them are NPCs. One of them is a cat.', 'Vuit mil milions de persones. La majoria són NPC. Una d’elles és un gat.'],
    ['It sat on the same rug for four hundred years. It supported the current thing. It answered every question with <b>“...”</b>. Then somebody paired it with $NPC on StonkFun and, for the first time in recorded history, it looked up.', 'Va seure a la mateixa catifa durant quatre-cents anys. Donava suport a la cosa del moment. Responia a totes les preguntes amb <b>«...»</b>. Fins que algú el va aparellar amb $NPC a StonkFun i, per primera vegada a la història, va alçar la vista.'],
    ['“I support the current cat.”', '«Dono suport al gat del moment.»'], ['verified', 'verificat'],
    ['“Is this the line for the airdrop?”', '«És aquí la cua de l’airdrop?»'],
    ['“...”', '«...»'], ['relatable', 'molt jo'],
    ['“It looked at me. It actually looked at me.”', '«M’ha mirat. M’ha mirat de veritat.»'], ['alert', 'alerta'],
    // quest
    ['Quest available', 'Missió disponible'],
    ['The quest is simple.<br>Hold $NPCAT, get <em>$NPC.</em>', 'La missió és senzilla.<br>Guarda $NPCAT, rep <em>$NPC.</em>'],
    ['NPCAT launches on StonkFun as a <b>reward coin</b>: a small transfer tax on every trade collects into a pot, and StonkFun splits that pot across holders in the coin\'s paired asset. The paired asset is <b>$NPC</b>. Nothing to claim, nothing to stake. The exact tax rate and payout threshold are fixed at launch and will be quoted here from the token page.', 'NPCAT es llança a StonkFun com a <b>moneda de recompensa</b>: una petita taxa de transferència en cada operació s’acumula en un pot, i StonkFun reparteix aquest pot entre els posseïdors en l’actiu amb què la moneda està aparellada. L’actiu aparellat és <b>$NPC</b>. Res a reclamar, res a bloquejar. La taxa exacta i el llindar de pagament es fixen al llançament i es citaran aquí des de la pàgina del token.'],
    ['Hold $NPCAT', 'Guarda $NPCAT'], ['Keep it in your wallet. That is the whole quest.', 'Tingues-lo al moneder. Aquesta és tota la missió.'], ['Reward: $NPC', 'Recompensa: $NPC'],
    ['Every trade feeds the pot', 'Cada operació alimenta el pot'], ['A transfer tax built into the token (1% or 3%, chosen at launch) is what gets shared out.', 'Una taxa de transferència integrada al token (1% o 3%, triada al llançament) és el que es reparteix.'], ['Rate: TBA', 'Taxa: pendent'],
    ['Payouts arrive on their own', 'Els pagaments arriben sols'], ['When the pot is worth paying out, StonkFun splits it across holders. It keeps going after the coin graduates to Raydium.', 'Quan el pot val la pena de repartir, StonkFun el divideix entre els posseïdors. Continua després que la moneda es graduï a Raydium.'], ['Automatic', 'Automàtic'],
    ['Check the numbers on StonkFun', 'Consulta les xifres a StonkFun'], ['The official token page shows tokens distributed, payouts and holder count. Link lands here at launch.', 'La pàgina oficial del token mostra tokens distribuïts, pagaments i nombre de posseïdors. L’enllaç apareixerà aquí al llançament.'], ['TBA', 'Pendent'],
    ['Mechanism as described on stonkfun.xyz/rewards. This page will only ever quote the figures shown on the official NPCAT token page.', 'Mecanisme tal com es descriu a stonkfun.xyz/rewards. Aquesta pàgina només citarà les xifres que mostri la pàgina oficial del token NPCAT.'],
    // pair
    ['The pair', 'El parell'], ['Not priced in SOL. Priced in NPC.', 'No cotitza en SOL. Cotitza en NPC.'],
    ['StonkFun lets a coin launch paired with anything. NPCAT launches paired with <b>$NPC</b>: every NPCAT trade is an NPC trade, and the chart reads in NPC.', 'StonkFun permet llançar una moneda aparellada amb qualsevol actiu. NPCAT es llança aparellat amb <b>$NPC</b>: cada operació d’NPCAT és una operació d’NPC, i el gràfic es llegeix en NPC.'],
    ['Quote asset · Non-Playable Coin', 'Actiu de cotització · Non-Playable Coin'], ['Base asset · Non-Playable Cat', 'Actiu base · Non-Playable Cat'],
    ['CHAIN', 'CADENA'], ['Launched on StonkFun', 'Llançat a StonkFun'], ['PAIR', 'PARELL'], ['Quoted in $NPC, not SOL', 'Cotitzat en $NPC, no en SOL'],
    ['SUPPLY', 'OFERTA'], ['Set at launch, verifiable on-chain', 'Es fixa al llançament, verificable a la cadena'], ['CONTRACT', 'CONTRACTE'], ['Copy it from here at launch', 'Copia’l des d’aquí al llançament'], ['Copy', 'Copia'],
    // buy
    ['How to buy', 'Com comprar'], ['Four steps. Zero thoughts required.', 'Quatre passos. Zero pensaments.'],
    ['Get a Solana wallet', 'Tingues un moneder de Solana'], ['Phantom or Solflare. Put a little SOL in it for fees.', 'Phantom o Solflare. Posa-hi una mica de SOL per a les comissions.'],
    ['Swap SOL for $NPC', 'Canvia SOL per $NPC'], ['NPCAT is bought with NPC, so the quote asset comes first.', 'NPCAT es compra amb NPC, així que primer cal l’actiu de cotització.'],
    ['Open NPCAT on StonkFun', 'Obre NPCAT a StonkFun'], ['Only ever use the official link from this page or the X profile. Check it twice.', 'Fes servir només l’enllaç oficial d’aquesta pàgina o del perfil d’X. Comprova’l dues vegades.'],
    ['Swap NPC for $NPCAT', 'Canvia NPC per $NPCAT'], ['Confirm. Sit. Stare. You are now one of the crowd.', 'Confirma. Seu. Mira fixament. Ara ets un més de la multitud.'],
    // faq
    ['No dumb questions', 'No hi ha preguntes tontes'], ['Questions NPCs ask.', 'Preguntes que fan els NPC.'],
    ['What is $NPCAT?', 'Què és $NPCAT?'], ['A meme coin on Solana about a non-playable cat. It launched on StonkFun paired with $NPC, the Non-Playable Coin. It has no utility and no roadmap.', 'Una moneda meme a Solana sobre un gat no jugable. Es va llançar a StonkFun aparellada amb $NPC, la Non-Playable Coin. No té utilitat ni full de ruta.'],
    ['What does “paired with $NPC” mean?', 'Què vol dir «aparellat amb $NPC»?'], ['On StonkFun a coin can trade against any asset instead of SOL. NPCAT trades against NPC, so you buy it with NPC and the price is shown in NPC.', 'A StonkFun una moneda pot negociar-se contra qualsevol actiu en lloc de SOL. NPCAT es negocia contra NPC: el compres amb NPC i el preu es mostra en NPC.'],
    ['How do I get $NPC by holding?', 'Com rebo $NPC només per tenir-ne?'], ['NPCAT is a StonkFun reward coin. A transfer tax on every trade collects into a pot, and when the pot is worth paying out StonkFun splits it across holders in the paired asset, $NPC. There is no claim button and no staking; it lands in the wallet that holds NPCAT. The tax rate and threshold are fixed at launch and shown on the token page.', 'NPCAT és una moneda de recompensa de StonkFun. Una taxa de transferència en cada operació s’acumula en un pot i, quan val la pena de repartir, StonkFun el divideix entre els posseïdors en l’actiu aparellat, $NPC. No hi ha botó de reclamació ni staking; arriba al moneder que té NPCAT. La taxa i el llindar es fixen al llançament i es mostren a la pàgina del token.'],
    ['Is there a roadmap?', 'Hi ha full de ruta?'], ['No.', 'No.'],
    ['Is this financial advice?', 'Això és assessorament financer?'], ['No. It just sits there.', 'No. Només s’està allà assegut.'],
    ['Is NPCAT affiliated with npc.com or StonkFun?', 'NPCAT està afiliat amb npc.com o StonkFun?'], ['No. NPCAT is a community meme coin that uses StonkFun as its launchpad and $NPC as its quote asset. It is not endorsed by either.', 'No. NPCAT és una moneda meme comunitària que fa servir StonkFun com a plataforma de llançament i $NPC com a actiu de cotització. Cap dels dos l’avala.'],
    // community + footer
    ['Community', 'Comunitat'], ['We are<br>all <span>NPCAT.</span>', 'Tots<br>som <span>NPCAT.</span>'], ['StonkFun page', 'Pàgina de StonkFun'],
    ['$NPCAT is a meme coin. No utility, no roadmap, no promises. Not affiliated with npc.com, StonkFun, or any cat. Nothing here is financial advice. Only trust links from this page and <a href="https://x.com/npcatnpc" rel="noopener" target="_blank">x.com/npcatnpc</a>.', '$NPCAT és una moneda meme. Sense utilitat, sense full de ruta, sense promeses. No està afiliada amb npc.com, StonkFun ni cap gat. Res d’això és assessorament financer. Confia només en els enllaços d’aquesta pàgina i de <a href="https://x.com/npcatnpc" rel="noopener" target="_blank">x.com/npcatnpc</a>.'],
  ]);
  const SOON = { 'link at launch': 'enllaç al llançament' };
  const SEL = '.skip, .nav__links a, .btn, .snd span, .ch small, .ch h1, .ch h2, .ch p, .hint span, .marquee__track span, .label, h2.t, .lead, .npc small, .npc em, .npc b, .q b, .q__desc, .q em, .fine, .tok small, .fact small, .fact span, .fact button, .step h3, .step p, summary, .faq p, .big, footer p';
  const norm = s => s.replace(/\s+/g, ' ').trim();
  const saved = new WeakMap();
  let lang = 'en';
  function apply(to) {
    lang = to; document.documentElement.lang = to;
    document.querySelectorAll(SEL).forEach(el => {
      if (to === 'ca') {
        const key = norm(el.innerHTML); const ca = CA.get(key);
        if (ca) { if (!saved.has(el)) saved.set(el, el.innerHTML); el.innerHTML = ca; }
      } else if (saved.has(el)) { el.innerHTML = saved.get(el); }
    });
    document.querySelectorAll('[data-soon]').forEach(el => { const v = el.getAttribute('data-soon'); if (to === 'ca' && SOON[v]) { el.setAttribute('data-soon-en', v); el.setAttribute('data-soon', SOON[v]); } else if (to === 'en' && el.getAttribute('data-soon-en')) { el.setAttribute('data-soon', el.getAttribute('data-soon-en')); } });
    document.querySelectorAll('.lang').forEach(b => { b.textContent = to === 'ca' ? 'EN' : 'CA'; b.setAttribute('aria-label', to === 'ca' ? 'Switch to English' : 'Canvia al català'); b.setAttribute('title', b.getAttribute('aria-label')); });
    try { localStorage.setItem('npcat-lang', to); } catch (e) {}
    const url = new URL(location.href); if (to === 'ca') url.searchParams.set('lang', 'ca'); else url.searchParams.delete('lang'); history.replaceState(null, '', url);
  }
  document.querySelectorAll('.lang').forEach(b => b.addEventListener('click', () => apply(lang === 'ca' ? 'en' : 'ca')));
  let want = new URLSearchParams(location.search).get('lang'); if (!want) { try { want = localStorage.getItem('npcat-lang'); } catch (e) {} }
  if (want === 'ca') apply('ca');
})();
