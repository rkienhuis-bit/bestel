(() => {
  const $ = id => document.getElementById(id);
  const cfg = window.ISNEX_CONFIG || {};
  const menus = window.ISNEX_MENUS || {};
  let client = null, session = null, orders = [], role = null;
  const restaurantName = id => menus[id]?.name || ({specht:'De Specht',bie:'Bie Immink',kebab:'Kebab van Erhan'}[id] || id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(Number(n||0));
  const toast = msg => { const el=$('manager-toast'); el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2600); };
  const selectedDate = () => $('order-date').value;
  const filtered = () => orders.filter(o => (!selectedDate() || new Date(o.created_at).toLocaleDateString('en-CA')===selectedDate()) && ($('restaurant-filter').value==='all'||o.restaurant_id===$('restaurant-filter').value));
  function dayStart(){ const d=new Date(); d.setHours(0,0,0,0); return d.toLocaleDateString('en-CA'); }
  async function init(){
    if(!cfg.supabaseUrl || !cfg.supabaseAnonKey || !window.supabase){ $('login-error').textContent='Supabase is nog niet ingesteld. Vul eerst config.js in.'; return; }
    client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
    const {data}=await client.auth.getSession();
    if(data.session) await verifyManager(data.session);
  }
  async function verifyManager(s){
    session=s;
    const {data,error}=await client.from('user_roles').select('role').eq('user_id',s.user.id).maybeSingle();
    if(error || !data || !['manager','admin'].includes(data.role)){
      await client.auth.signOut(); session=null;
      $('login-error').textContent='Dit account heeft geen managerrechten. Voeg het account toe aan user_roles in Supabase.';
      return false;
    }
    role=data.role; $('manager-login').classList.add('hidden'); $('manager-dashboard').classList.remove('hidden');
    $('manager-welcome').textContent=`Ingelogd als ${s.user.email || 'manager'} · ${role}`;
    await loadOrders(); return true;
  }
  async function loadOrders(){
    $('orders-caption').textContent='Bestellingen ophalen…';
    const {data,error}=await client.from('orders').select('*').order('created_at',{ascending:false}).limit(1000);
    if(error){$('orders-caption').textContent='Kon bestellingen niet ophalen: '+error.message;return;}
    orders=(data||[]).map(o=>({...o,restaurant_name:restaurantName(o.restaurant_id)}));
    render();
  }
  function render(){
    const list=filtered();
    $('stat-orders').textContent=list.length;
    $('stat-people').textContent=new Set(list.map(o=>o.employee_name)).size;
    const known=list.reduce((sum,o)=>sum+(Number(o.total)||0),0); $('stat-total').textContent=money(known);
    $('orders-caption').textContent=`${list.length} bestelling(en) · ${selectedDate()?new Date(selectedDate()+'T12:00:00').toLocaleDateString('nl-NL'):'alle datums'}`;
    $('manager-orders').innerHTML=list.length?list.map(o=>{
      const lines=(o.items||[]).map(i=>`<div>${esc(i.qty)}${esc(i.unit==='kg'?' kg':i.unit==='100 g'?' × 100 g':'×')} ${esc(i.name||i.display_name||'Artikel')}${i.line_total!=null?` <span>(${money(i.line_total)})</span>`:''}</div>`).join('');
      return `<article class="manager-order"><div class="manager-order-main"><div class="manager-order-title"><strong>${esc(o.employee_name)}</strong><span class="status-pill">${esc(o.status||'new')}</span></div><div class="manager-order-meta">${esc(o.restaurant_name)} · ${new Date(o.created_at).toLocaleString('nl-NL')} · ${o.total==null?'Prijs volgt':money(o.total)}</div><div class="manager-order-items">${lines}</div>${o.note?`<div class="manager-order-note">Bericht: ${esc(o.note)}</div>`:''}</div><div class="manager-order-controls"><select data-status="${esc(o.id)}" aria-label="Status voor ${esc(o.employee_name)}"><option value="new" ${o.status==='new'?'selected':''}>Nieuw</option><option value="accepted" ${o.status==='accepted'?'selected':''}>Geaccepteerd</option><option value="completed" ${o.status==='completed'?'selected':''}>Afgerond</option><option value="cancelled" ${o.status==='cancelled'?'selected':''}>Geannuleerd</option><option value="locked" ${o.status==='locked'?'selected':''}>Vergrendeld</option></select></div></article>`;
    }).join(''):'<div class="manager-empty">Geen bestellingen gevonden voor deze selectie.</div>';
    document.querySelectorAll('[data-status]').forEach(el=>el.onchange=()=>updateStatus(el.dataset.status,el.value));
  }
  async function updateStatus(id,status){
    const {error}=await client.from('orders').update({status,locked_at:status==='locked'?new Date().toISOString():null,updated_at:new Date().toISOString()}).eq('id',id);
    if(error){toast('Status niet bijgewerkt: '+error.message);await loadOrders();return;}
    const o=orders.find(x=>x.id===id); if(o)o.status=status; render(); toast('Bestelstatus bijgewerkt.');
  }
  function pdfFor(restaurantId){
    if(!window.jspdf?.jsPDF){toast('PDF-module niet geladen. Controleer je internetverbinding.');return;}
    const batch=filtered().filter(o=>o.restaurant_id===restaurantId && o.status!=='cancelled');
    if(!batch.length){toast('Geen bestellingen voor '+restaurantName(restaurantId)+'.');return;}
    const {jsPDF}=window.jspdf; const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    const pageW=doc.internal.pageSize.getWidth();
    const day=selectedDate()||dayStart();
    doc.setFont('helvetica','bold');doc.setFontSize(21);doc.text('i-SNEX',14,17);
    doc.setFontSize(15);doc.text(restaurantName(restaurantId).toUpperCase(),14,27);
    doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text(`IPEX FOOD CLUB  |  ${new Date(day+'T12:00:00').toLocaleDateString('nl-NL')}  |  Gegenereerd ${new Date().toLocaleString('nl-NL')}`,14,34);
    doc.setDrawColor(225,225,225);doc.line(14,39,pageW-14,39);
    const itemRows=[]; let knownTotal=0, unknownCount=0, itemCount=0;
    batch.sort((a,b)=>String(a.employee_name).localeCompare(String(b.employee_name),'nl'));
    batch.forEach(o=>{
      (o.items||[]).forEach(i=>{
        const qty=Number(i.qty)||1; itemCount+=1;
        const qtyText=i.unit==='kg'?`${qty.toLocaleString('nl-NL')} kg`:i.unit==='100 g'?`${qty*100} g`:`${qty}×`;
        const options=(i.options||[]).map(x=>`${x.label}: ${Array.isArray(x.value)?x.value.join(', '):x.value}`).join(' · ');
        const details=[options,i.note?`Opmerking: ${i.note}`:''].filter(Boolean).join(' | ');
        const price=i.line_total==null?(i.unit_price==null?null:Number(i.unit_price)*qty):Number(i.line_total);
        if(price==null)unknownCount++;else knownTotal+=price;
        itemRows.push([o.employee_name,qtyText,i.name||i.display_name||'Artikel',details||'—',price==null?'—':money(price)]);
      });
      if(o.note)itemRows.push([o.employee_name,'','BERICHT BIJ BESTELLING',o.note,'']);
    });
    doc.setFontSize(10);doc.setFont('helvetica','bold');doc.text(`${batch.length} bestellingen  ·  ${itemCount} bestelregels`,14,46);
    doc.autoTable({startY:51,head:[['Medewerker','Aantal','Product / keuze','Opties en opmerkingen','Regeltotaal']],body:itemRows,theme:'grid',margin:{left:14,right:14,bottom:18},styles:{font:'helvetica',fontSize:8,cellPadding:2.3,overflow:'linebreak',valign:'top',lineColor:[225,225,225],lineWidth:.15},headStyles:{fillColor:[27,42,57],textColor:255,fontStyle:'bold'},columnStyles:{0:{cellWidth:27},1:{cellWidth:17},2:{cellWidth:48},3:{cellWidth:'auto'},4:{cellWidth:24,halign:'right'}},didParseCell:data=>{if(data.row.raw?.[2]==='BERICHT BIJ BESTELLING'){data.cell.styles.fontStyle='italic';data.cell.styles.textColor=[150,85,40];}}});
    let y=doc.lastAutoTable.finalY+9;if(y>265){doc.addPage();y=20;}
    doc.setDrawColor(210,210,210);doc.line(14,y-4,pageW-14,y-4);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text(`Bekende regeltotalen: ${money(knownTotal)}`,14,y+2);
    doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text(`${unknownCount?`${unknownCount} regel(s) zonder definitieve prijs. `:''}Gewichtsartikelen kunnen op basis van werkelijk gewicht afwijken.`,14,y+8,{maxWidth:pageW-28});
    const pages=doc.getNumberOfPages();for(let p=1;p<=pages;p++){doc.setPage(p);doc.setFontSize(8);doc.setTextColor(120);doc.text(`i-Snex · ${restaurantName(restaurantId)} · pagina ${p}/${pages}`,14,289);}
    doc.save(`i-Snex-${restaurantId}-${day}.pdf`);toast('PDF aangemaakt: '+restaurantName(restaurantId));
  }
  $('login-form').addEventListener('submit',async e=>{e.preventDefault();$('login-error').textContent='';const email=$('manager-email').value.trim(),password=$('manager-password').value;const {data,error}=await client.auth.signInWithPassword({email,password});if(error){$('login-error').textContent='Inloggen mislukt: '+error.message;return;}await verifyManager(data.session);});
  $('logout-btn').onclick=async()=>{await client.auth.signOut();location.reload();};
  $('refresh-orders').onclick=loadOrders;$('order-date').onchange=render;$('restaurant-filter').onchange=render;
  document.querySelectorAll('[data-pdf]').forEach(b=>b.onclick=()=>pdfFor(b.dataset.pdf));
  $('order-date').value=dayStart(); init();
})();
