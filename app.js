(() => {
  const $ = (id) => document.getElementById(id);
  const requestedRestaurant = new URLSearchParams(location.search).get('restaurant');
  const state = {
    name: localStorage.getItem('isnex_name') || '', restaurant: null, category: 'Alles', query: '',
    cart: [], orders: [], user: null, supabase: null,
    lang: localStorage.getItem('isnex_language') || 'nl',
    requestedRestaurant: ['specht','bie','kebab'].includes(requestedRestaurant) ? requestedRestaurant : null,
    openCustomizer: null
  };
  const copy = {
    nl:{start:'Wie heeft er trek?',sub:'Vul je naam in om te beginnen.',go:"Let's go",restaurants:'Restaurants',search:'Zoek iets lekkers...',add:'Toegevoegd aan je mandje',empty:'Nog niets gekozen.',checkout:'Bestelling afronden',place:'Bestelling plaatsen',sent:'Je bestelling is ontvangen.',myorders:'Mijn bestellingen bekijken',menuMissing:'De actuele menukaart is nog niet bevestigd.',source:'Bekijk originele menukaart ↗',historyEmpty:'Je hebt op dit apparaat nog geen bestellingen geplaatst.'},
    en:{start:'Who is ordering?',sub:'Enter your name to get started.',go:"Let's go",restaurants:'Restaurants',search:'Search the menu...',add:'Added to your basket',empty:'Nothing here yet.',checkout:'Review order',place:'Place order',sent:'Your order has been received.',myorders:'View my orders',menuMissing:'The current menu has not been confirmed yet.',source:'View original menu ↗',historyEmpty:'No orders have been placed on this device yet.'},
    de:{start:'Wer bestellt heute?',sub:'Gib deinen Namen ein, um zu starten.',go:'Los geht’s',restaurants:'Restaurants',search:'Menü durchsuchen...',add:'Zum Warenkorb hinzugefügt',empty:'Noch nichts ausgewählt.',checkout:'Bestellung prüfen',place:'Bestellung aufgeben',sent:'Deine Bestellung ist eingegangen.',myorders:'Meine Bestellungen ansehen',menuMissing:'Die aktuelle Speisekarte wurde noch nicht bestätigt.',source:'Originalkarte ansehen ↗',historyEmpty:'Auf diesem Gerät wurden noch keine Bestellungen aufgegeben.'}
  };
  const t = (k) => copy[state.lang]?.[k] || copy.nl[k] || k;
  const money = (n) => new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(n || 0);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const show = (id) => { document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden')); $(id).classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'}); };
  const toast = (s) => { const el=$('toast'); el.textContent=s; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2200); };
  const hasUnknownPrice = () => state.cart.some(x=>x.price===null || x.price===undefined);
  const total = () => state.cart.reduce((s,x)=>s+(x.price==null?0:x.price*x.qty),0);
  const hasWeightBased = () => state.cart.some(x=>x.unit==='kg' || x.unit==='100 g');
  const totalLabel = () => hasUnknownPrice() ? 'Prijs volgt bij afrekenen' : hasWeightBased() ? `Geschat: ${money(total())}` : money(total());
  const priceLabel = (price) => price==null ? 'Prijs op locatie' : money(price);
  const count = () => state.cart.reduce((s,x)=>s+(['kg','100 g'].includes(x.unit)?1:x.qty),0);
  const formatQty = (x) => x.unit==='kg' ? `${Number(x.qty).toLocaleString('nl-NL',{maximumFractionDigits:2})} kg` : x.unit==='100 g' ? `${x.qty*100} g` : `${x.qty}`;
  const currentRestaurant = () => window.ISNEX_MENUS[state.restaurant];

  async function connect(){
    const c=window.ISNEX_CONFIG||{};
    if(c.supabaseUrl&&c.supabaseAnonKey&&window.supabase){
      state.supabase=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey);
      try {
        let {data,error}=await state.supabase.auth.getSession(); if(error) throw error;
        if(!data.session){const r=await state.supabase.auth.signInAnonymously();if(r.error)throw r.error;data={session:r.data.session};}
        state.user=data.session?.user||null; $('connection-pill').classList.add('online'); $('connection-pill').querySelector('span').textContent='Verbonden met database';
      } catch(e) { console.warn('Supabase connection unavailable; using local preview',e); state.supabase=null; $('connection-pill').querySelector('span').textContent='Lokale testmodus'; }
    }
  }

  function renderRestaurants(){
    const list=[['specht','01'],['bie','02'],['kebab','03']];
    $('restaurant-grid').innerHTML=list.map(([id,n])=>{
      const r=window.ISNEX_MENUS[id];
      const visual=r.heroImage ? `background-image:linear-gradient(0deg,rgba(15,19,22,.58),rgba(15,19,22,.08)),url('${r.heroImage}')` : `background-image:radial-gradient(circle at 72% 20%,#e38c4c 0,transparent 33%),linear-gradient(135deg,#291c1a,#101b1b)`;
      return `<article class="restaurant-card theme-${id}" data-id="${id}" style="--card-accent:${r.accent}"><div class="restaurant-visual" style="${visual}"><span class="card-number">${n} / 03</span><span class="card-arrow">↗</span>${!r.heroImage?'<span class="food-emoji">🥙</span>':''}<span class="visual-brand">${id==='specht'?'CAFETARIA · LUNCHROOM':id==='bie'?'AMBACHT · SMAAK · BELEVING':'VERS GESNEDEN DÖNER'}</span></div><div class="restaurant-info"><span class="town">${esc(r.town)} · IPEX FOOD CLUB</span><h3>${esc(r.name)}</h3><p>${esc(r.description)}</p><div class="card-link"><span>Bekijk menu</span><span>→</span></div></div></article>`;
    }).join('');
    document.querySelectorAll('.restaurant-card').forEach(el=>el.addEventListener('click',()=>openRestaurant(el.dataset.id)));
  }

  function openRestaurant(id){
    state.restaurant=id; state.category='Alles'; state.query=''; state.openCustomizer=null; $('menu-search').value='';
    const r=currentRestaurant(); document.body.classList.remove('theme-specht','theme-bie','theme-kebab'); document.body.classList.add(`theme-${id}`);
    $('menu-title').textContent=r.name; $('menu-description').textContent=r.description;
    $('menu-stamp').innerHTML=id==='bie'?'AMBACHT<br>SMAAK<span>✳</span>':id==='specht'?'CAFETARIA<br>& LUNCH<span>✳</span>':'DÖNER<br>FRESH<span>✳</span>';
    $('menu-hero').style.backgroundImage=r.heroImage?`linear-gradient(90deg,rgba(18,22,24,.92),rgba(18,22,24,.54)),url('${r.heroImage}')`:'';
    $('source-menu').href=r.sourceUrl; $('source-menu').textContent=r.sourceLabel+' ↗';
    $('order-name').textContent=state.name; $('menu-eyebrow').textContent='03 / '+r.town.toUpperCase()+' MENU';
    $('restaurant-social').innerHTML=(r.socialLinks||[]).map((url,i)=>`<a href="${url}" target="_blank" rel="noopener">${i===0?'Instagram':'Facebook'} ↗</a>`).join('');
    renderCategories(); renderMenu(); renderCart(); show('menu-view');
  }

  function renderCategories(){
    const cats=['Alles',...currentRestaurant().categories.map(c=>c.name)];
    $('category-tabs').innerHTML=cats.map(c=>`<button class="category-tab ${state.category===c?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
    document.querySelectorAll('.category-tab').forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;state.openCustomizer=null;renderCategories();renderMenu();});
  }

  function iconFor(cat){
    if(/patat|aardappel/i.test(cat))return '🍟'; if(/vis|rokerij/i.test(cat))return '🐟'; if(/vlees|slagerij|grill/i.test(cat))return '🥩'; if(/saus/i.test(cat))return '🥣'; if(/drinken/i.test(cat))return '🥤'; if(/brood/i.test(cat))return '🥪'; if(/menu|salade/i.test(cat))return '🍽️'; if(/döner|wrap|pizza/i.test(cat))return '🥙'; if(/snack/i.test(cat))return '🍗'; return '✳';
  }

  function renderOptions(item, catIndex, itemIndex){
    const opts=item.options?.options||[]; if(!opts.length&&!item.unit)return '';
    const startQty=item.unit==='kg'?0.5:1, step=item.unit==='kg'?0.25:1;
    return `<div class="product-customizer" data-config="${catIndex}-${itemIndex}" data-qty-step="${step}" data-qty-min="${step}">${opts.map((o,oi)=>{
      const choices=o.choices||[];
      if(o.type==='toggle')return `<div class="option-group"><label>${esc(o.label)}</label><div class="choice-toggle" role="group" aria-label="${esc(o.label)}">${choices.map((c,ci)=>`<button type="button" class="choice-pill ${ci===0?'selected':''}" data-option="${oi}" data-choice="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>`;
      if(o.type==='checks')return `<div class="option-group"><label>${esc(o.label)} <small>optioneel</small></label><div class="choice-checks">${choices.map((c,ci)=>`<label><input type="checkbox" data-option="${oi}" data-choice="${esc(c)}"> ${esc(c)}</label>`).join('')}</div></div>`;
      return `<div class="option-group"><label>${esc(o.label)}${o.required?'':' <small>optioneel</small>'}</label><select data-option="${oi}">${o.required?'':'<option value="">Geen keuze</option>'}${choices.map(c=>`<option>${esc(c)}</option>`).join('')}</select></div>`;
    }).join('')}<div class="option-group"><label>Opmerking <small>optioneel</small></label><input class="item-note" type="text" maxlength="180" placeholder="Bijvoorbeeld: saus apart" /></div><div class="customizer-actions"><div class="custom-qty"><button type="button" data-qty="minus">−</button><b>${startQty.toLocaleString('nl-NL')}</b><button type="button" data-qty="plus">+</button></div><button type="button" class="custom-add" data-add-config="${catIndex}-${itemIndex}">Toevoegen · ${priceLabel(item.price)}</button></div></div>`;
  }

  function renderMenu(){
    const r=currentRestaurant(); const q=state.query.toLowerCase();
    const visible=r.categories.map((cat,ci)=>({...cat,ci,items:cat.items.map((it,ii)=>({...it,ii})).filter(it=>(state.category==='Alles'||state.category===cat.name)&&(`${it.name} ${it.description||''}`).toLowerCase().includes(q))})).filter(c=>(state.category==='Alles'||state.category===c.name)&&c.items.length);
    $('menu-content').innerHTML=(r.disclaimer?`<div class="price-disclaimer">${esc(r.disclaimer)}</div>`:'')+visible.map(c=>`<h3 class="menu-category-heading">${esc(c.name)}</h3>${c.items.map(item=>{
      const key=`${c.ci}-${item.ii}`, open=state.openCustomizer===key;
      const inCart=state.cart.filter(x=>x.productKey===key).reduce((s,x)=>s+x.qty,0);
      const hasOptions=!!item.options?.options?.length || !!item.unit;
      return `<article class="product-card ${open?'is-configuring':''}"><div class="product-mark">${iconFor(c.name)}</div><div class="product-copy"><strong>${esc(item.name)}</strong><span>${priceLabel(item.price)}${item.unit?` · per ${esc(item.unit)}`:''}${inCart?` · ${inCart} in mandje`:''}</span>${item.description?`<small>${esc(item.description)}</small>`:''}</div><button class="add-btn" data-open-config="${key}" aria-label="${hasOptions?'Kies opties voor':'Voeg toe:'} ${esc(item.name)}">${hasOptions?'Kies':'+'}</button>${open?renderOptions(item,c.ci,item.ii):''}</article>`;
    }).join('')}`).join('')||`<div class="menu-empty"><div class="empty-icon">🔎</div><h3>Niets gevonden</h3><p>Probeer een andere zoekterm of categorie.</p></div>`;

    document.querySelectorAll('[data-open-config]').forEach(btn=>btn.onclick=()=>{
      const key=btn.dataset.openConfig; const [ci,ii]=key.split('-').map(Number); const it=currentRestaurant().categories[ci].items[ii];
      if(!it.options?.options?.length&&!it.unit){addToCart(ci,ii,{},1);return;}
      state.openCustomizer=state.openCustomizer===key?null:key; renderMenu();
    });
    document.querySelectorAll('.product-customizer').forEach(panel=>{
      panel.querySelectorAll('.choice-toggle').forEach(group=>group.querySelectorAll('.choice-pill').forEach(b=>b.onclick=()=>{group.querySelectorAll('.choice-pill').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');}));
      panel.querySelectorAll('[data-qty]').forEach(b=>b.onclick=()=>{const n=panel.querySelector('.custom-qty b');const step=Number(panel.dataset.qtyStep||1),min=Number(panel.dataset.qtyMin||1);n.textContent=Number(Math.max(min,Math.min(20,Number(n.textContent)+(b.dataset.qty==='plus'?step:-step))).toFixed(2)).toLocaleString('nl-NL');});
      const add=panel.querySelector('[data-add-config]'); add.onclick=()=>{
        const [ci,ii]=add.dataset.addConfig.split('-').map(Number), item=currentRestaurant().categories[ci].items[ii];
        const selections=[]; let invalid=false;
        panel.querySelectorAll('.option-group').forEach((group,oi)=>{
          const opt=item.options.options[oi]; if(!opt)return;
          if(opt.type==='toggle'){const chosen=group.querySelector('.choice-pill.selected')?.dataset.choice;if(chosen)selections.push({label:opt.label,value:chosen});}
          else if(opt.type==='checks'){const chosen=[...group.querySelectorAll('input:checked')].map(x=>x.dataset.choice);if(chosen.length)selections.push({label:opt.label,value:chosen});}
          else {const chosen=group.querySelector('select')?.value;if(chosen)selections.push({label:opt.label,value:chosen});else if(opt.required)invalid=true;}
        });
        if(invalid){toast('Maak eerst de verplichte keuze.');return;}
        const note=panel.querySelector('.item-note')?.value.trim()||''; const qty=Number(panel.querySelector('.custom-qty b').textContent.replace(',','.'));
        addToCart(ci,ii,{selections,note},qty); state.openCustomizer=null; renderMenu();
      };
    });
  }

  function addToCart(ci,ii,config={},qty=1){
    const cat=currentRestaurant().categories[ci], item=cat.items[ii];
    const selections=config.selections||[]; const details=selections.map(x=>`${x.label}: ${Array.isArray(x.value)?x.value.join(', '):x.value}`).join(' · ');
    const note=config.note||''; const extraCost=selections.flatMap(x=>Array.isArray(x.value)?x.value:[x.value]).reduce((sum,v)=>{const m=String(v).match(/\+\s*€\s*([0-9]+[,\.]?[0-9]*)/i);return sum+(m?Number(m[1].replace(',','.')):0);},0);
    const price=item.price==null?null:Number((item.price+extraCost).toFixed(2));
    const name=item.name+(details?` · ${details}`:'')+(note?` · Opmerking: ${note}`:'');
    const id=`${state.restaurant}:${ci}:${ii}:${JSON.stringify(selections)}:${note}`;
    const line=state.cart.find(x=>x.id===id);
    if(line)line.qty+=qty;else state.cart.push({id,productKey:`${ci}-${ii}`,name,baseName:item.name,details,note,options:selections,price,qty,category:cat.name,unit:item.unit||''});
    renderCart(); toast(t('add'));
  }

  function renderCart(){
    const n=count(); $('cart-count').textContent=n; $('cart-total').textContent=totalLabel(); $('mobile-cart-total').textContent=totalLabel(); $('mobile-cart').classList.toggle('hidden',n===0); $('checkout-btn').disabled=n===0;
    $('cart-lines').innerHTML=state.cart.length?state.cart.map(x=>`<div class="cart-line"><div><strong>${esc(x.baseName||x.name)}</strong><small>${x.details?esc(x.details)+' · ':''}${x.note?`Opmerking: ${esc(x.note)} · `:''}${priceLabel(x.price)}${x.unit?' per '+esc(x.unit):x.price!=null?' per stuk':''}</small></div><div class="qty-controls"><button data-action="minus" data-step="${x.unit==='kg'?0.25:1}" data-id="${esc(x.id)}">−</button><b>${formatQty(x)}</b><button data-action="plus" data-step="${x.unit==='kg'?0.25:1}" data-id="${esc(x.id)}">+</button></div></div>`).join(''):`<div class="empty-cart">${t('empty')}<br><span>Dat kan snel veranderen 😉</span></div>`;
    document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const line=state.cart.find(x=>x.id===b.dataset.id);if(!line)return;const step=Number(b.dataset.step||1);if(b.dataset.action==='plus')line.qty=Number((line.qty+step).toFixed(2));else line.qty=Number((line.qty-step).toFixed(2));state.cart=state.cart.filter(x=>x.qty>0);renderCart();renderMenu();});
  }

  function checkout(){
    if(!state.cart.length)return; $('checkout-name').textContent=state.name; $('summary-name').textContent=state.name; $('checkout-restaurant').textContent=currentRestaurant().name; $('summary-count').textContent=count(); $('summary-total').textContent=totalLabel(); $('order-note').value='';
    $('checkout-lines').innerHTML=state.cart.map(x=>`<div class="checkout-line"><span>${formatQty(x)} × ${esc(x.baseName||x.name)}${x.details?`<small>${esc(x.details)}</small>`:''}${x.note?`<small>Opmerking: ${esc(x.note)}</small>`:''}</span><strong>${x.price==null?'Prijs volgt':money(x.qty*x.price)}</strong></div>`).join(''); show('checkout-view');
  }

  async function placeOrder(){
    const btn=$('place-order'); btn.disabled=true; btn.textContent='Versturen…';
    const order={id:crypto.randomUUID(),user_name:state.name,restaurant_id:state.restaurant,restaurant_name:currentRestaurant().name,items:state.cart.map(x=>({name:x.baseName||x.name,display_name:x.name,category:x.category,qty:x.qty,unit:x.unit,unit_price:x.price,estimated_weight_price:x.unit==='kg'||x.unit==='100 g',line_total:x.price==null?null:x.qty*x.price,options:x.options,note:x.note})),note:$('order-note').value.trim(),total:hasUnknownPrice()?null:Number(total().toFixed(2)),created_at:new Date().toISOString(),status:'new'};
    let saved=false;
    if(state.supabase&&state.user){try{const {error}=await state.supabase.from('orders').insert({id:order.id,owner_id:state.user.id,restaurant_id:order.restaurant_id,employee_name:order.user_name,items:order.items,note:order.note,total:order.total,status:'new'});if(error)throw error;saved=true;}catch(e){console.error(e);toast('Database niet bereikbaar. Bestelling niet verzonden.');btn.disabled=false;btn.innerHTML='Bestelling plaatsen <span>↗</span>';return;}}
    else {const local=JSON.parse(localStorage.getItem('isnex_orders')||'[]');local.unshift(order);localStorage.setItem('isnex_orders',JSON.stringify(local));saved=true;}
    if(saved){state.orders.unshift(order);$('success-message').textContent=`Bedankt ${state.name}! Je bestelling bij ${order.restaurant_name} is ontvangen.`;$('success-ticket').innerHTML=`<strong>${esc(order.restaurant_name)}</strong><br>${esc(order.user_name)} · ${new Date(order.created_at).toLocaleString('nl-NL')}<hr style="border:0;border-top:1px dashed #ddd;margin:9px 0">${order.items.map(x=>`${formatQty(x)} × ${esc(x.display_name)} — ${x.line_total==null?'prijs volgt':money(x.line_total)}`).join('<br>')}${order.note?`<br><em>Bericht: ${esc(order.note)}</em>`:''}<hr style="border:0;border-top:1px dashed #ddd;margin:9px 0"><strong>${hasWeightBased()?'Geschat totaal':'Totaal'}: ${order.total==null?'prijs volgt bij afrekenen':money(order.total)}</strong>`;state.cart=[];renderCart();btn.disabled=false;btn.innerHTML='Bestelling plaatsen <span>↗</span>';show('success-view');}
  }

  async function loadOrders(){
    if(state.supabase&&state.user){const {data,error}=await state.supabase.from('orders').select('*').order('created_at',{ascending:false}).limit(30);if(!error)state.orders=(data||[]).map(o=>({id:o.id,user_name:o.employee_name,restaurant_name:window.ISNEX_MENUS[o.restaurant_id]?.name||o.restaurant_id,items:o.items,total:o.total,created_at:o.created_at,status:o.status}));else console.warn(error);}
    else state.orders=JSON.parse(localStorage.getItem('isnex_orders')||'[]');
  }
  async function showOrders(){await loadOrders();$('orders-list').innerHTML=state.orders.length?state.orders.map(o=>`<article class="order-history-card"><strong>${esc(o.restaurant_name)}</strong><p>${new Date(o.created_at).toLocaleString('nl-NL')} · ${esc(o.status||'Ontvangen')}<br>${(o.items||[]).map(i=>`${i.qty} × ${esc(i.display_name||i.name)}`).join(' · ')}</p><strong>${o.total==null?'Prijs volgt':money(o.total)}</strong></article>`).join(''):`<div class="menu-empty">${t('historyEmpty')}</div>`;show('orders-view');}

  $('start-order').onclick=()=>{const v=$('employee-name').value.trim();if(!v){$('employee-name').focus();toast('Vul eerst je naam in.');return;}state.name=v;localStorage.setItem('isnex_name',v);$('hello-name').textContent=v;$('change-name').textContent='Naam wijzigen ↗';renderRestaurants();if(state.requestedRestaurant){const id=state.requestedRestaurant;state.requestedRestaurant=null;openRestaurant(id);}else show('restaurant-view');};
  $('employee-name').value=state.name; $('employee-name').addEventListener('keydown',e=>{if(e.key==='Enter')$('start-order').click();});
  $('change-name').onclick=()=>{show('name-view');$('employee-name').value=state.name;}; $('back-restaurants').onclick=()=>show('restaurant-view'); $('back-menu').onclick=()=>show('menu-view'); $('checkout-btn').onclick=checkout; $('place-order').onclick=placeOrder; $('new-order').onclick=()=>{document.body.classList.remove('theme-specht','theme-bie','theme-kebab');renderRestaurants();show('restaurant-view');}; $('my-orders').onclick=showOrders; $('orders-back').onclick=()=>show('restaurant-view');
  $('menu-search').addEventListener('input',e=>{state.query=e.target.value;state.openCustomizer=null;renderMenu();}); $('mobile-cart').onclick=()=>$('cart-card').classList.toggle('mobile-open');
  $('language').value=state.lang; $('language').onchange=e=>{state.lang=e.target.value;localStorage.setItem('isnex_language',state.lang);$('employee-name').placeholder=state.lang==='en'?'Your name':state.lang==='de'?'Dein Name':'Jouw naam';};
  $('employee-name').placeholder=state.lang==='en'?'Your name':state.lang==='de'?'Dein Name':'Jouw naam';
  connect().then(()=>{if(state.name){$('hello-name').textContent=state.name;$('employee-name').value=state.name;renderRestaurants();if(state.requestedRestaurant){const id=state.requestedRestaurant;state.requestedRestaurant=null;openRestaurant(id);}else show('restaurant-view');}});
})();
