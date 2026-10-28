const MENU = [
  {id:'deal',name:'Veejay Meal Deal',description:'Jollof rice, grilled chicken, meat pie and chilled zobo.',price:5500,category:'Combos',badge:'LUNCH FAVOURITE'},
  {id:'jollof',name:'Smoky Jollof Rice',description:'Party-style jollof slow-cooked with tomatoes and peppers.',price:2000,category:'Rice & meals',badge:'BESTSELLER'},
  {id:'chicken',name:'Grilled Chicken',description:'Flame-grilled chicken with our signature pepper marinade.',price:2500,category:'Rice & meals'},
  {id:'fried',name:'Garden Fried Rice',description:'Fluffy rice tossed with vegetables and fragrant spices.',price:2200,category:'Rice & meals'},
  {id:'egusi',name:'Egusi & Pounded Yam',description:'Melon-seed soup, leafy greens and soft pounded yam.',price:3500,category:'Soups & swallow'},
  {id:'pie',name:'Freshly Baked Meat Pie',description:'Golden pastry filled with seasoned beef and vegetables.',price:800,category:'Pastries'},
  {id:'zobo',name:'Hibiscus Zobo',description:'Chilled house brew with ginger and pineapple.',price:700,category:'Drinks'},
  {id:'puff',name:'Golden Puff Puff',description:'Six soft, golden bites made fresh today.',price:1000,category:'Pastries'},
  {id:'banga',name:'Banga Soup & Starch',description:'Delta palm-fruit soup with catfish, native spices and starch.',price:4500,category:'Delta & Isoko',badge:'DELTA FAVOURITE'},
  {id:'owo',name:'Owo Soup & Starch',description:'Isoko and Urhobo palm-oil soup with fish and crayfish.',price:4000,category:'Delta & Isoko'},
  {id:'ukodo',name:'Ukodo — Yam & Goat Meat',description:'Delta pepper soup with yam, goat meat and native spices.',price:4500,category:'Delta & Isoko'},
  {id:'ogbono',name:'Ogbono Soup & Eba',description:'Silky draw soup with assorted meat, stockfish and eba.',price:3800,category:'Soups & swallow'},
  {id:'efo',name:'Efo Riro & Pounded Yam',description:'Vegetable soup with assorted meat and pounded yam.',price:4200,category:'Soups & swallow'},
  {id:'okra',name:'Okra Soup & Semo',description:'Fresh okra with fish, assorted meat and soft semovita.',price:3500,category:'Soups & swallow'},
  {id:'edikaikong',name:'Edikang Ikong & Fufu',description:'Waterleaf and pumpkin-leaf soup with assorted meat.',price:4500,category:'Soups & swallow'},
  {id:'moi',name:'Moi Moi',description:'Steamed bean pudding with peppers and egg.',price:1200,category:'Rice & meals'},
  {id:'ofada',name:'Ofada Rice & Ayamase',description:'Local rice with green-pepper sauce and assorted meat.',price:3800,category:'Rice & meals'},
  {id:'yam',name:'Yam Porridge — Asaro',description:'Tender yam in a palm-oil pepper sauce with fish and greens.',price:2800,category:'Rice & meals'}
];

const PHOTOS = {
  deal:'jollof.jpeg',jollof:'jollof.jpeg',chicken:'chicken.jpg',fried:'fried-rice.jpg',egusi:'egusi.jpg',pie:'meat-pie.jpeg',
  zobo:'zobo.jpg',puff:'puff-puff.jpeg',banga:'banga.jpeg',owo:'owo.webp',ukodo:'ukodo.webp',ogbono:'ogbono.jpg',
  efo:'efo.jpeg',okra:'mixed-okra.jpeg',edikaikong:'edikaikong.jpeg',moi:'moi-moi.jpg',ofada:'ofada-rice.jpeg',yam:'yam-porridge.jpeg'
};
const CATEGORIES = ['All','Combos','Delta & Isoko','Rice & meals','Soups & swallow','Pastries','Drinks'];
const STATUS = ['Placed','Preparing','Ready','Collected'];
const STORE_KEY = 'veejay-sales-demo-v3';
const money = value => `₦${Number(value).toLocaleString('en-NG')}`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`).replaceAll('-','');
const item = (id, qty=1) => ({id, qty, name:MENU.find(x=>x.id===id).name, price:MENU.find(x=>x.id===id).price});

function seedState() {
  const now = Date.now();
  return {
    version:3, started:false, role:'customer', customer:null, outlet:'Wuse II', cart:{}, overrides:{}, notifications:[],
    orders:[
      {id:'seed-ready',code:'VF2048',status:2,customer:'Amina Bello',phone:'0803 123 4567',outlet:'Wuse II',day:'Today',slot:'13:30',payment:'Bank transfer',paymentRef:'PAY-DEMO-2048',note:'Please make the chicken mild.',items:[item('deal'),item('puff')],total:6500,createdAt:now-35*60000,paidAt:now-34*60000},
      {id:'seed-preparing',code:'VF3712',status:1,customer:'Chidi Okafor',phone:'0805 882 1100',outlet:'Wuse II',day:'Today',slot:'14:00',payment:'Card',paymentRef:'PAY-DEMO-3712',note:'Extra pepper, please.',items:[item('banga'),item('zobo',2)],total:5900,createdAt:now-20*60000,paidAt:now-19*60000},
      {id:'seed-collected',code:'VF1093',status:3,customer:'Zainab Musa',phone:'0706 345 1200',outlet:'Garki',day:'Today',slot:'12:30',payment:'USSD',paymentRef:'PAY-DEMO-1093',note:'',items:[item('jollof',2),item('chicken',2)],total:9000,createdAt:now-120*60000,paidAt:now-118*60000,collectedAt:now-70*60000}
    ],
    complaints:[
      {id:'CMP-104',orderCode:'VF1093',customer:'Zainab Musa',reason:'Food temperature',details:'Meal was cooler than expected at pickup.',status:'Open',amount:9000},
      {id:'CMP-091',orderCode:'VF0871',customer:'Emeka John',reason:'Missing item',details:'Zobo was missing from the bag.',status:'Resolved',amount:700}
    ],
    settings:{chime:true,slotCapacity:12,slotMinutes:30}
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved?.version === 3) return saved;
  } catch (_) {}
  return seedState();
}

let state = loadState();
let view = 'menu';
let filter = 'All';
let query = '';
let kitchenOutlet = 'Wuse II';
let ownerView = 'overview';
let checkoutState = {day:'Today',slot:'13:30',payment:'Card',note:''};
let authStep = 1;
let authDraft = {name:'Amina Bello',phone:'0803 123 4567'};
const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
if (location.protocol === 'file:') document.documentElement.classList.add('native-app');
const showModal = () => { if (!modal.open) modal.showModal(); };

function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function menuItem(id) {
  const base = MENU.find(x=>x.id===id);
  const override = state.overrides[id] || {};
  return {...base, price:override.price ?? base.price, available:override.available !== false};
}
function cartCount() { return Object.values(state.cart).reduce((a,b)=>a+b,0); }
function cartTotal() { return Object.entries(state.cart).reduce((sum,[id,qty])=>sum+menuItem(id).price*qty,0); }
function customerOrders() { return state.customer ? state.orders.filter(o => o.phone === state.customer.phone) : []; }
function activeOrders(outlet=null) { return state.orders.filter(o=>o.status<3 && (!outlet || o.outlet===outlet)); }
function pickupSlots() {
  const slots=[];
  for(let mins=12*60+30;mins<=15*60;mins+=state.settings.slotMinutes) slots.push(`${String(Math.floor(mins/60)).padStart(2,'0')}:${String(mins%60).padStart(2,'0')}`);
  return slots;
}
function slotIsFull(day, slot) {
  return state.orders.filter(o=>o.outlet===state.outlet&&o.day===day&&o.slot===slot&&o.status<3).length>=state.settings.slotCapacity;
}
function addNotification(title, body, orderId) {
  state.notifications.unshift({id:uid(),title,body,orderId,read:false,time:Date.now()});
  state.notifications = state.notifications.slice(0,20);
}
function toast(message) {
  const el = document.querySelector('#toast');
  el.textContent = message; el.classList.add('visible');
  clearTimeout(toast.timer); toast.timer = setTimeout(()=>el.classList.remove('visible'),3200);
}
function roleLabel() { return state.role==='customer'?'Customer':state.role==='kitchen'?'Kitchen staff':'Owner'; }
function orderingStatus(now=new Date()) {
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Lagos',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
  const day=parts.weekday,hour=Number(parts.hour),minute=Number(parts.minute),current=hour*60+minute;
  const sunday=day==='Sun',open=sunday?10*60:8*60,close=sunday?18*60:20*60,isOpen=current>=open&&current<close;
  if(isOpen)return {open:true,label:`Open · Orders until ${sunday?'6':'8'} PM`,detail:sunday?'Sunday pickup: 10 AM–6 PM':'Pickup orders: 8 AM–8 PM'};
  const next=sunday&&current<open?'10 AM today':!sunday&&current<open?'8 AM today':sunday?'8 AM Monday':day==='Sat'?'10 AM Sunday':'8 AM tomorrow';
  return {open:false,label:`Closed · Opens ${next}`,detail:'Pickup orders are unavailable outside operating hours'};
}

function shell(content, options={}) {
  const unread = state.notifications.filter(n=>!n.read).length;
  return `<header class="topbar">
    <button class="brand-button" data-home aria-label="Veejay Foods home"><img src="assets/veejay-logo.png" alt=""><span>Veejay <b>Foods</b></span></button>
    <div class="role-context"><small>VIEWING AS</small><button data-open-role>${roleLabel()}⌄</button></div>
    ${state.role==='customer'?`<div class="location-pill"><span>⌖</span><div><small>PICKUP AT</small><select id="outlet-select">${['Wuse II','Garki','Jabi'].map(x=>`<option ${x===state.outlet?'selected':''}>${x}</option>`).join('')}</select></div></div><div class="global-search"><span>⌕</span><input id="search" value="${esc(query)}" placeholder="Search meals" aria-label="Search meals"></div><button class="bag-button" data-scroll-basket>Bag <b>${cartCount()}</b></button>`:''}
    ${state.role!=='customer'?`<div class="top-spacer"></div><button class="outline-button" data-guide>▶ Guided demo</button>`:''}
    <button class="icon-button" data-notifications aria-label="Notifications">♢${unread?`<i>${unread}</i>`:''}</button>
  </header>
  <div class="demo-ribbon"><span><i></i> INTERACTIVE CLIENT DEMO</span></div>
  ${content}
  <footer><div><b>Veejay Foods</b></div><span>Pick it. Pay it. Collect it.</span><span>Full business demo · Offline-ready</span></footer>`;
}

function render() {
  if (!state.started) return renderWelcome();
  if (state.role==='customer') renderCustomer();
  if (state.role==='kitchen') renderKitchen();
  if (state.role==='owner') renderOwner();
  drawCodes();
}

function renderWelcome() {
  app.innerHTML = `<main class="welcome-screen">
    <div class="welcome-card">
      <img src="assets/veejay-logo.png" alt="Veejay Foods">
      <span class="demo-tag">FULL BUSINESS DEMO</span>
      <h1>One order.<br><em>Three connected views.</em></h1>
      <p>Experience the customer app, kitchen workflow and owner dashboard—all working together on this device.</p>
      <div class="welcome-roles">
        <button data-start-role="customer"><b>Customer</b><span>Browse, pay and track</span></button>
        <button data-start-role="kitchen"><b>Kitchen</b><span>Prepare and hand over</span></button>
        <button data-start-role="owner"><b>Owner</b><span>Control and understand</span></button>
      </div>
      <button class="primary large" data-start-role="customer">Start the guided customer journey →</button>
      <small>Everything is simulated. No payment, SMS or customer data leaves this device.</small>
    </div>
  </main>`;
}

function customerNav() {
  return `<nav class="section-nav">
    ${[['menu','Menu'],['orders',`My orders (${customerOrders().length})`],['profile','Account']].map(([id,label])=>`<button class="${view===id?'active':''}" data-view="${id}">${label}</button>`).join('')}
  </nav>`;
}

function renderCustomer() {
  let content = '';
  if (view==='menu') content = customerMenu();
  if (view==='orders') content = ordersPage();
  if (view==='profile') content = profilePage();
  app.innerHTML = shell(`${customerNav()}${content}`);
}

function customerMenu() {
  const products = MENU.map(x=>menuItem(x.id)).filter(p=>(filter==='All'||p.category===filter)&&(!query||`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(query.toLowerCase())));
  const hours=orderingStatus();
  return `<main class="customer-main">
    <section class="hero"><div><span>FRESHLY MADE · FULL OF FLAVOUR</span><h1>Your favourites.<br>Your kind of <em>lunch.</em></h1><p>Order ahead. Skip the queue.</p><button class="light-button" data-filter-jump="Delta & Isoko">Explore Delta favourites →</button></div><img src="assets/food/jollof.jpeg" alt="Jollof rice with chicken and plantain"></section>
    <section class="restaurant-strip"><div><div><h2>Veejay Foods</h2><span class="open-chip ${hours.open?'':'closed'}">● ${hours.label}</span></div><p>Nigerian favourites · Delta & Isoko · Pastries · Drinks</p><small>⌖ Abuja Municipal &nbsp; ◷ ${hours.detail} &nbsp; · &nbsp; Mon–Sat 8 AM–8 PM · Sun 10 AM–6 PM</small></div><span>✓ Pickup only</span></section>
    <div class="shop-layout"><section><div class="section-heading"><div><h2>Explore the menu</h2><p>Real flavours, ready on your schedule.</p></div><span>${products.length} choices</span></div>
      <div class="chips">${CATEGORIES.map(c=>`<button class="${filter===c?'selected':''}" data-filter="${esc(c)}">${c}</button>`).join('')}</div>
      <div class="product-grid">${products.map(productCard).join('')}</div>
      ${products.length?'':'<div class="empty-state"><b>No meals found</b><p>Try another search or category.</p><button data-clear-search>Clear search</button></div>'}
    </section>${basket()}</div>
  </main>`;
}

function productPhoto(p) {
  if (p.id==='deal') return `<div class="combo-grid">${['jollof','chicken','pie','zobo'].map(id=>`<img src="assets/food/${PHOTOS[id]}" alt="${esc(menuItem(id).name)}">`).join('')}</div>`;
  return `<img src="assets/food/${PHOTOS[p.id]}" alt="Representative photo of ${esc(p.name)}">`;
}
function productCard(p) {
  const qty = state.cart[p.id] || 0;
  return `<article class="product-card ${p.available?'':'sold-out'}"><button class="product-photo" data-item="${p.id}">${p.badge?`<span>${p.badge}</span>`:''}${productPhoto(p)}${p.available?'':'<b class="sold-label">SOLD OUT</b>'}</button><div class="product-body"><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div><b>${money(p.price)}</b>${p.available?(qty?stepper(p.id,qty):`<button class="add-button" data-add="${p.id}">+ Add</button>`):'<button class="add-button" disabled>Unavailable</button>'}</div></div></article>`;
}
function stepper(id, qty) { const name=esc(menuItem(id).name);return `<div class="stepper"><button data-qty="${id}" data-delta="-1" aria-label="Remove one ${name}">−</button><span>${qty}</span><button data-qty="${id}" data-delta="1" aria-label="Add one ${name}">+</button></div>`; }
function basket() {
  const entries = Object.entries(state.cart).filter(([,qty])=>qty>0);
  return `<aside id="basket"><div class="basket-card"><div class="basket-head"><h3>Your basket</h3><span>${cartCount()} items</span></div>${entries.length?entries.map(([id,qty])=>{const p=menuItem(id);return `<div class="basket-row"><div><b>${esc(p.name)}</b><small>${money(p.price)} each</small></div>${stepper(id,qty)}<strong>${money(p.price*qty)}</strong></div>`}).join(''):`<div class="basket-empty"><span>🛍️</span><b>Something delicious belongs here.</b><p>Add your favourites and we’ll take care of the cooking.</p></div>`}${entries.length?`<div class="basket-total"><span>Total</span><b>${money(cartTotal())}</b></div><button class="primary" data-checkout>Choose pickup time →</button><small class="basket-caption">Pickup at ${esc(state.outlet)} · No delivery fees</small>`:''}</div><div class="promo-card"><b>Lunch plans? Sorted.</b><p>Try the Veejay Meal Deal for a complete lunch in one tap.</p></div></aside>`;
}

function ordersPage() {
  const orders = customerOrders();
  return `<main class="page"><div class="page-title"><div><span>CUSTOMER APP</span><h1>My orders</h1><p>Every update, from payment to pickup.</p></div><button class="outline-button" data-view="menu">+ New order</button></div>${orders.length?`<div class="order-list">${orders.map(orderCard).join('')}</div>`:'<div class="empty-state"><b>No orders yet</b><p>Your first meal is waiting on the menu.</p></div>'}</main>`;
}
function orderCard(order) {
  const status = STATUS[order.status];
  return `<article class="customer-order"><div class="order-top"><div><span>ORDER #${esc(order.code)}</span><h3>${status==='Ready'?'Your food is ready!':status==='Collected'?'Collected — enjoy your meal':status==='Preparing'?'The kitchen is cooking':'Payment received'}</h3><p>${esc(order.outlet)} · ${esc(order.day)} at ${esc(order.slot)}</p></div><span class="status status-${order.status}">${status}</span></div>
    <div class="timeline">${STATUS.map((s,i)=>`<div class="${order.status>=i?'done':''}"><i>${order.status>=i?'✓':i+1}</i><span>${s}</span></div>`).join('')}</div>
    <div class="order-detail"><div>${order.items.map(x=>`<p><span>${x.qty} × ${esc(x.name)}</span><b>${money(x.price*x.qty)}</b></p>`).join('')}<p class="grand"><span>Total · ${esc(order.payment)}</span><b>${money(order.total)}</b></p></div>${order.status===2?`<div class="collection-code"><canvas data-code="${esc(order.code)}" width="124" height="124"></canvas><div><small>SHOW AT THE COUNTER</small><strong>${esc(order.code)}</strong><span>Secure demo collection code</span></div></div>`:''}</div>
    <div class="order-actions"><button data-receipt="${order.id}">View receipt</button>${order.status===3?`<button data-complaint="${order.id}">Report a problem</button>`:''}${order.status<3?'<span>Updates appear here automatically</span>':''}</div>
  </article>`;
}

function profilePage() {
  const customer = state.customer || {name:'Guest',phone:'Not signed in'};
  return `<main class="page narrow"><div class="page-title"><div><span>YOUR ACCOUNT</span><h1>Hello, ${esc(customer.name.split(' ')[0])}</h1><p>Your demo profile and preferences.</p></div></div><div class="profile-card"><div class="avatar">${esc(customer.name[0])}</div><div><h2>${esc(customer.name)}</h2><p>${esc(customer.phone)}</p></div><button data-edit-profile>Edit</button></div><div class="settings-list"><div><span>♢</span><div><b>Notifications</b><p>Order updates are enabled for this demo.</p></div><strong>On</strong></div><div><span>⌖</span><div><b>Preferred pickup</b><p>${esc(state.outlet)}, Abuja Municipal</p></div><strong>Change above</strong></div><div><span>▤</span><div><b>Receipts</b><p>${customerOrders().length} demo orders saved on this device.</p></div><strong data-view="orders">View</strong></div></div><div class="demo-danger"><div><b>Presentation controls</b><p>Reset orders, menu changes and customer data to the original demo state.</p></div><button data-reset>Reset demo</button></div></main>`;
}

function renderKitchen() {
  const visible = state.orders.filter(o=>o.outlet===kitchenOutlet && o.status<3);
  const content = `<main class="workspace"><div class="workspace-head"><div><span>KITCHEN & COUNTER</span><h1>Live orders</h1><p>Paid orders, sorted by pickup time.</p></div><div class="workspace-controls"><label>Outlet<select id="kitchen-outlet">${['Wuse II','Garki','Jabi'].map(x=>`<option ${x===kitchenOutlet?'selected':''}>${x}</option>`).join('')}</select></label><button class="primary compact" data-scan>▣ Scan / enter code</button></div></div>
    <div class="metric-row"><div><span>New</span><b>${visible.filter(o=>o.status===0).length}</b><small>Awaiting kitchen</small></div><div><span>Preparing</span><b>${visible.filter(o=>o.status===1).length}</b><small>Being cooked</small></div><div><span>Ready</span><b>${visible.filter(o=>o.status===2).length}</b><small>Awaiting pickup</small></div><div><span>Next pickup</span><b>${visible.sort((a,b)=>a.slot.localeCompare(b.slot))[0]?.slot||'—'}</b><small>${kitchenOutlet}</small></div></div>
    <div class="kitchen-board">${[0,1,2].map(status=>kitchenColumn(status,visible.filter(o=>o.status===status))).join('')}</div>
  </main>`;
  app.innerHTML = shell(content);
}
function kitchenColumn(status, orders) {
  return `<section class="kitchen-column"><header><div><i class="dot-${status}"></i><b>${STATUS[status]}</b></div><span>${orders.length}</span></header><div>${orders.length?orders.map(kitchenCard).join(''):'<p class="column-empty">No orders here</p>'}</div></section>`;
}
function kitchenCard(o) {
  const action = o.status<2 ? `<button class="primary compact" data-advance="${o.id}">${o.status===0?'Start order':'Mark ready'}</button>` : `<button class="primary compact" data-collect-code="${o.code}">Verify code</button>`;
  return `<article class="kitchen-order"><div class="ticket-top"><div><span>${esc(o.slot)}</span><b>#${esc(o.code)}</b></div><small>${timeAgo(o.createdAt)}</small></div><h3>${esc(o.customer)}</h3>${o.items.map(x=>`<p><b>${x.qty}×</b> ${esc(x.name)}</p>`).join('')}${o.note?`<div class="customer-note"><b>NOTE</b> ${esc(o.note)}</div>`:''}<div class="ticket-actions"><button data-kitchen-detail="${o.id}">Details</button>${action}</div></article>`;
}

function renderOwner() {
  const content = `<main class="workspace owner"><div class="workspace-head"><div><span>OWNER & ADMIN</span><h1>${ownerView==='overview'?'Good afternoon, Ada.':ownerView[0].toUpperCase()+ownerView.slice(1)}</h1><p>${ownerView==='overview'?"Here’s how Veejay Foods is doing today.":'Manage the business demo from one place.'}</p></div><button class="outline-button" data-export>▤ View demo report</button></div>
    <nav class="admin-nav">${[['overview','Overview'],['orders','Orders'],['menu','Menu & stock'],['complaints','Complaints'],['settings','Demo settings']].map(([id,label])=>`<button class="${ownerView===id?'active':''}" data-owner-view="${id}">${label}${id==='complaints'?` <i>${state.complaints.filter(c=>c.status==='Open').length}</i>`:''}</button>`).join('')}</nav>
    ${ownerContent()}</main>`;
  app.innerHTML = shell(content);
}
function ownerContent() {
  if (ownerView==='overview') return overviewPanel();
  if (ownerView==='orders') return ordersPanel();
  if (ownerView==='menu') return menuPanel();
  if (ownerView==='complaints') return complaintsPanel();
  return settingsPanel();
}
function overviewPanel() {
  const paid = state.orders.reduce((sum,o)=>sum+o.total,0);
  const sold = {};
  state.orders.forEach(o=>o.items.forEach(x=>sold[x.name]=(sold[x.name]||0)+x.qty));
  const top = Object.entries(sold).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const outletSales = ['Wuse II','Garki','Jabi'].map(name=>({name,total:state.orders.filter(o=>o.outlet===name).reduce((s,o)=>s+o.total,0)}));
  const max = Math.max(...outletSales.map(x=>x.total),1);
  return `<div class="dashboard-metrics"><div><span>Today’s sales</span><b>${money(paid)}</b><small>↑ 18% demo trend</small></div><div><span>Paid orders</span><b>${state.orders.length}</b><small>${activeOrders().length} active now</small></div><div><span>Average order</span><b>${money(Math.round(paid/state.orders.length))}</b><small>Across all outlets</small></div><div><span>Collection rate</span><b>${Math.round(state.orders.filter(o=>o.status===3).length/state.orders.length*100)}%</b><small>Completed handovers</small></div></div>
  <div class="dashboard-grid"><section class="panel sales-chart"><div class="panel-head"><div><h2>Sales by outlet</h2><p>Demo revenue today</p></div><span>Today</span></div>${outletSales.map(x=>`<div class="bar-row"><span>${x.name}</span><div><i style="width:${Math.max(4,x.total/max*100)}%"></i></div><b>${money(x.total)}</b></div>`).join('')}</section><section class="panel"><div class="panel-head"><div><h2>Popular items</h2><p>Quantity ordered</p></div></div><ol class="popular-list">${top.map(([name,qty],i)=>`<li><span>${i+1}</span><b>${esc(name)}</b><strong>${qty} sold</strong></li>`).join('')}</ol></section></div>
  <section class="panel recent"><div class="panel-head"><div><h2>Recent orders</h2><p>Live across all outlets</p></div><button data-owner-view="orders">View all →</button></div>${orderTable(state.orders.slice(0,5))}</section>`;
}
function orderTable(orders) {
  return `<div class="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Outlet / pickup</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>${orders.map(o=>`<tr><td><b>#${esc(o.code)}</b></td><td>${esc(o.customer)}<small>${esc(o.phone)}</small></td><td>${esc(o.outlet)}<small>${esc(o.slot)}</small></td><td><b>${money(o.total)}</b></td><td><span class="status status-${o.status}">${STATUS[o.status]}</span></td><td><button class="table-action" data-order-detail="${o.id}">View</button></td></tr>`).join('')}</tbody></table></div>`;
}
function ordersPanel() { return `<section class="panel"><div class="panel-head"><div><h2>All demo orders</h2><p>Paid orders across three pickup points</p></div><span>${state.orders.length} orders</span></div>${orderTable(state.orders)}</section>`; }
function menuPanel() {
  return `<section class="panel"><div class="panel-head"><div><h2>Menu and availability</h2><p>Changes immediately update the customer app.</p></div><span>${MENU.filter(x=>menuItem(x.id).available).length} available</span></div><div class="menu-admin">${MENU.map(base=>{const p=menuItem(base.id);return `<div><img src="assets/food/${PHOTOS[p.id]}" alt=""><div><b>${esc(p.name)}</b><small>${esc(p.category)}</small></div><div class="price-control"><button data-price="${p.id}" data-price-delta="-100">−</button><strong>${money(p.price)}</strong><button data-price="${p.id}" data-price-delta="100">+</button></div><label class="switch"><input type="checkbox" data-stock="${p.id}" ${p.available?'checked':''}><span></span><small>${p.available?'Available':'Sold out'}</small></label></div>`}).join('')}</div></section>`;
}
function complaintsPanel() {
  return `<section class="panel"><div class="panel-head"><div><h2>Complaints & refunds</h2><p>Open a case to review its details and refund decision.</p></div></div><div class="complaint-list">${state.complaints.map(c=>`<article><div><span class="status ${c.status==='Open'?'status-2':'status-3'}">${c.status}</span><small>${esc(c.id)} · Order #${esc(c.orderCode)}</small></div><h3>${esc(c.reason)}</h3><p>${esc(c.details)}</p><footer><span>${esc(c.customer)} · Paid ${money(c.amount)}</span><button data-open-case="${c.id}">Open complaint</button></footer></article>`).join('')}</div></section>`;
}
function settingsPanel() {
  return `<div class="settings-grid"><section class="panel"><h2>Kitchen operations</h2><label class="setting-row"><span><b>New-order chime</b><small>Play a sound when a paid order arrives</small></span><input type="checkbox" data-setting="chime" ${state.settings.chime?'checked':''}></label><label class="setting-row"><span><b>Slot capacity</b><small>Maximum demo orders per pickup slot</small></span><input type="number" min="1" max="30" value="${state.settings.slotCapacity}" data-setting-number="slotCapacity"></label><label class="setting-row"><span><b>Slot duration</b><small>Minutes between pickup windows</small></span><select data-setting-select="slotMinutes"><option ${state.settings.slotMinutes===15?'selected':''}>15</option><option ${state.settings.slotMinutes===30?'selected':''}>30</option><option ${state.settings.slotMinutes===60?'selected':''}>60</option></select></label></section><section class="panel reset-panel"><span>CLIENT PRESENTATION</span><h2>Reset the full demo</h2><p>Restore sample orders, customer details, prices, stock and complaints before presenting again.</p><button data-reset>Reset to presentation data</button></section></div>`;
}

function openAuth() {
  authStep = 1;
  modal.innerHTML = `<div class="auth-dialog"><button class="modal-close" data-close>×</button><img src="assets/veejay-logo.png" alt=""><span>CUSTOMER SIGN IN</span><h2>Welcome to Veejay Foods</h2><p>Use the prefilled details for the client demo.</p><label>Your name<input id="auth-name" value="${esc(authDraft.name)}"></label><label>Phone number<input id="auth-phone" inputmode="tel" value="${esc(authDraft.phone)}"></label><button class="primary" data-send-code>Send demo code</button><small>No SMS will be sent. The demo code is shown on the next screen.</small></div>`;
  showModal();
}
function showOtp() {
  authDraft.name = document.querySelector('#auth-name').value.trim() || 'Amina Bello';
  authDraft.phone = document.querySelector('#auth-phone').value.trim() || '0803 123 4567';
  authStep = 2;
  modal.innerHTML = `<div class="auth-dialog"><button class="modal-close" data-close>×</button><img src="assets/veejay-logo.png" alt=""><span>VERIFY NUMBER</span><h2>Enter your code</h2><p>We sent a demo code to <b>${esc(authDraft.phone)}</b>.</p><div class="demo-code">Demo code: <b>123456</b></div><label>6-digit code<input id="otp" inputmode="numeric" maxlength="6" value="123456"></label><button class="primary" data-verify>Verify & continue</button><button class="text-button" data-back-auth>← Change details</button></div>`;
}
function openCheckout() {
  if (!cartCount()) return;
  if (!state.customer) { openAuth(); toast('Sign in before checkout'); return; }
  const slots=pickupSlots();if(!slots.includes(checkoutState.slot))checkoutState.slot=slots[0];
  modal.innerHTML = `<div class="checkout-dialog"><div class="modal-head"><div><span>SECURE DEMO CHECKOUT</span><h2>Pickup and payment</h2></div><button class="modal-close" data-close>×</button></div><div class="checkout-grid"><section><label>Pickup day<div class="choice-row">${['Today','Tomorrow'].map(x=>`<button class="${checkoutState.day===x?'selected':''}" data-checkout-day="${x}">${x}</button>`).join('')}</div></label><label>Pickup time<div class="choice-row wrap">${slots.map(x=>{const full=slotIsFull(checkoutState.day,x);return `<button class="${checkoutState.slot===x?'selected':''}" data-checkout-slot="${x}" ${full?'disabled':''}>${x}${full?' · Full':''}</button>`}).join('')}</div></label><label>Kitchen note<textarea id="checkout-note" placeholder="e.g. A little less pepper">${esc(checkoutState.note)}</textarea></label><label>Payment method<div class="payment-methods">${[['Card','▣'],['Bank transfer','↔'],['USSD','#']].map(([x,icon])=>`<button class="${checkoutState.payment===x?'selected':''}" data-checkout-payment="${x}"><i>${icon}</i><span>${x}</span></button>`).join('')}</div></label><div class="safe-note">🔒 Hosted payment simulation. No card details or money are collected.</div></section><aside><h3>Order summary</h3>${Object.entries(state.cart).filter(([,q])=>q).map(([id,q])=>{const p=menuItem(id);return `<p><span>${q} × ${esc(p.name)}</span><b>${money(q*p.price)}</b></p>`}).join('')}<div class="checkout-total"><span>Total</span><b>${money(cartTotal())}</b></div><button class="primary" data-pay="success" ${slotIsFull(checkoutState.day,checkoutState.slot)?'disabled':''}>Simulate successful payment</button><div class="scenario-buttons"><button data-pay="failed">Test declined payment</button><button data-pay="cancelled">Test cancellation</button></div></aside></div></div>`;
  showModal();
}
function createOrder() {
  if(slotIsFull(checkoutState.day,checkoutState.slot))return toast('That pickup time is full — choose another slot');
  const id = uid(); const code = `VF${String(Math.floor(1000+Math.random()*8999))}`;
  const items = Object.entries(state.cart).filter(([,q])=>q).map(([itemId,qty])=>{const p=menuItem(itemId);return {id:itemId,qty,name:p.name,price:p.price};});
  const order = {id,code,status:0,customer:state.customer.name,phone:state.customer.phone,outlet:state.outlet,day:checkoutState.day,slot:checkoutState.slot,payment:checkoutState.payment,paymentRef:`PAY-${Date.now().toString().slice(-8)}`,note:checkoutState.note,items,total:cartTotal(),createdAt:Date.now(),paidAt:Date.now()};
  state.orders.unshift(order); state.cart={}; addNotification('Order placed','Payment received. The kitchen has your order.',id); save(); modal.close(); view='orders'; render(); toast(`Order #${code} placed successfully`);
}
function openReceipt(id) {
  const o=state.orders.find(x=>x.id===id); if(!o)return;
  modal.innerHTML=`<div class="receipt"><button class="modal-close" data-close>×</button><img src="assets/veejay-logo.png" alt=""><span>PAYMENT RECEIPT</span><h2>${money(o.total)}</h2><p>Paid successfully by ${esc(o.payment)}</p><div><p><span>Order</span><b>#${esc(o.code)}</b></p><p><span>Customer</span><b>${esc(o.customer)}</b></p><p><span>Pickup</span><b>${esc(o.outlet)} · ${esc(o.slot)}</b></p><p><span>Reference</span><b>${esc(o.paymentRef)}</b></p></div>${o.items.map(x=>`<p class="receipt-item"><span>${x.qty} × ${esc(x.name)}</span><b>${money(x.price*x.qty)}</b></p>`).join('')}<button class="primary" data-close>Done</button><small>Demo receipt · No real payment was processed</small></div>`;showModal();
}
function openKitchenDetail(id) {
  const o=state.orders.find(x=>x.id===id);if(!o)return;
  modal.innerHTML=`<div class="receipt"><button class="modal-close" data-close>×</button><span>KITCHEN TICKET</span><h2>Order #${esc(o.code)}</h2><p>${esc(o.customer)} · ${esc(o.phone)}</p><div><p><span>Pickup</span><b>${esc(o.outlet)} · ${esc(o.day)} ${esc(o.slot)}</b></p><p><span>Payment</span><b>Paid · ${esc(o.payment)}</b></p><p><span>Status</span><b>${STATUS[o.status]}</b></p></div>${o.items.map(x=>`<p class="receipt-item"><span>${x.qty} × ${esc(x.name)}</span><b>${money(x.price*x.qty)}</b></p>`).join('')}${o.note?`<div class="customer-note"><b>CUSTOMER NOTE</b> ${esc(o.note)}</div>`:''}<button class="primary" data-close>Back to board</button></div>`;showModal();
}
function openRolePicker() {
  modal.innerHTML=`<div class="role-dialog"><button class="modal-close" data-close>×</button><span>SWITCH EXPERIENCE</span><h2>Choose a demo role</h2><p>All roles share the same orders and business data on this device.</p><div>${[['customer','Customer','Browse, checkout and track orders','◎'],['kitchen','Kitchen staff','Prepare orders and confirm collection','♨'],['owner','Owner / admin','View sales and manage operations','▥']].map(([id,title,desc,icon])=>`<button data-role="${id}"><i>${icon}</i><span><b>${title}</b><small>${desc}</small></span><strong>→</strong></button>`).join('')}</div></div>`;showModal();
}
function openNotifications() {
  state.notifications.forEach(n=>n.read=true);save();
  modal.innerHTML=`<div class="notification-dialog"><div class="modal-head"><div><span>DEMO NOTIFICATIONS</span><h2>Order updates</h2></div><button class="modal-close" data-close>×</button></div>${state.notifications.length?state.notifications.map(n=>`<article><i>✓</i><div><b>${esc(n.title)}</b><p>${esc(n.body)}</p><small>${timeAgo(n.time)}</small></div></article>`).join(''):'<div class="empty-state"><b>No notifications yet</b><p>Place or update an order to see them here.</p></div>'}</div>`;showModal();render();
}
function openScanner() {
  modal.innerHTML=`<div class="scanner-dialog"><button class="modal-close" data-close>×</button><div class="scanner-icon">▣</div><span>COUNTER HANDOVER</span><h2>Scan or enter collection code</h2><p>The camera is represented by code entry in this offline demo.</p><label>6-character code<input id="scan-code" maxlength="6" placeholder="e.g. VF2048"></label><button class="primary" data-confirm-code>Confirm collection</button><small>Try the ready sample order: <b>${state.orders.find(o=>o.status===2)?.code||'No ready orders'}</b></small></div>`;showModal();
}
function openComplaint(orderId) {
  const o=state.orders.find(x=>x.id===orderId);if(!o)return;
  modal.innerHTML=`<div class="complaint-dialog"><button class="modal-close" data-close>×</button><span>AFTER-SALES SUPPORT</span><h2>Report a problem</h2><p>Order #${esc(o.code)} · ${money(o.total)}</p><label>What happened?<select id="complaint-reason"><option>Missing item</option><option>Food temperature</option><option>Wrong order</option><option>Quality issue</option></select></label><label>Tell us more<textarea id="complaint-details" placeholder="Describe the issue"></textarea></label><button class="primary" data-submit-complaint="${o.id}">Submit report</button></div>`;showModal();
}
function openComplaintCase(complaintId) {
  const c=state.complaints.find(item=>item.id===complaintId);if(!c)return;
  modal.innerHTML=`<div class="complaint-dialog"><button class="modal-close" data-close>×</button><span>COMPLAINT CASE · ${esc(c.id)}</span><h2>${esc(c.reason)}</h2><p>Order #${esc(c.orderCode)} · ${esc(c.customer)}</p><div class="case-details"><p><span>Status</span><b>${esc(c.status)}</b></p><p><span>Order value</span><b>${money(c.amount)}</b></p><p class="case-message"><span>Customer report</span><b>${esc(c.details)}</b></p></div>${c.status==='Open'?`<button class="primary" data-resolve="${c.id}">Approve demo refund</button>`:'<div class="case-closed">✓ Refund approved and complaint closed</div>'}</div>`;showModal();
}
function openGuide() {
  modal.innerHTML=`<div class="guide-dialog"><button class="modal-close" data-close>×</button><span>CLIENT PRESENTATION GUIDE</span><h2>Tell one connected story</h2><ol><li><b>Customer</b><span>Sign in, add a meal, choose a slot and simulate payment.</span><button data-role="customer">Open customer</button></li><li><b>Kitchen</b><span>Find the new order, start it and mark it ready.</span><button data-role="kitchen">Open kitchen</button></li><li><b>Customer</b><span>Show the live Ready status and collection code.</span><button data-role="customer" data-orders-after>Show order</button></li><li><b>Kitchen</b><span>Enter the collection code and confirm handover.</span><button data-scan>Open scanner</button></li><li><b>Owner</b><span>Show updated sales, menu controls and complaints.</span><button data-role="owner">Open dashboard</button></li></ol><button class="outline-button full" data-reset>Reset before presentation</button></div>`;showModal();
}
function openReport() {
  const paid=state.orders.reduce((sum,o)=>sum+o.total,0),collected=state.orders.filter(o=>o.status===3).length,open=state.complaints.filter(c=>c.status==='Open').length;
  modal.innerHTML=`<div class="receipt"><button class="modal-close" data-close>×</button><img src="assets/veejay-logo.png" alt="Veejay Foods"><span>OWNER REPORT</span><h2>Today’s demo summary</h2><div><p><span>Sales</span><b>${money(paid)}</b></p><p><span>Paid orders</span><b>${state.orders.length}</b></p><p><span>Collected</span><b>${collected}</b></p><p><span>Open complaints</span><b>${open}</b></p></div><button class="primary" data-close>Done</button><small>Live summary from the data on this device</small></div>`;showModal();
}
function openReset() {
  modal.innerHTML=`<div class="confirm-dialog"><span>RESET PRESENTATION</span><h2>Restore the original demo?</h2><p>This clears customer orders and menu changes made during this presentation, then restores the sample business data.</p><div><button data-close>Cancel</button><button class="danger-button" data-confirm-reset>Reset demo</button></div></div>`;showModal();
}

function advanceOrder(id) {
  const o=state.orders.find(x=>x.id===id);if(!o||o.status>=3)return;
  o.status += 1;
  const messages=[null,['Preparing','The kitchen has started your order.'],['Ready for pickup',`Show code ${o.code} at ${o.outlet}.`],['Order collected','Thank you for choosing Veejay Foods.']];
  addNotification(messages[o.status][0],messages[o.status][1],o.id);save();render();toast(messages[o.status][0]);
}
function collectByCode() {
  const code=document.querySelector('#scan-code').value.trim().toUpperCase();const o=state.orders.find(x=>x.code.toUpperCase()===code);
  if(!o)return toast('Order code not found');if(o.status<2)return toast('This order is not ready yet');if(o.status===3)return toast('This order was already collected');
  o.status=3;o.collectedAt=Date.now();addNotification('Order collected','Your pickup was confirmed. Enjoy your meal!',o.id);save();modal.close();render();toast(`Order #${o.code} handed over successfully`);
}
function timeAgo(time) { const mins=Math.max(0,Math.round((Date.now()-time)/60000));return mins<1?'just now':mins<60?`${mins} min ago`:`${Math.floor(mins/60)} hr ago`; }
function drawCodes() {
  document.querySelectorAll('canvas[data-code]').forEach(canvas=>{
    const ctx=canvas.getContext('2d'),code=canvas.dataset.code,size=25,cell=canvas.width/size;ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
    let seed=[...code].reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),7);const bit=()=>{seed=(seed*1664525+1013904223)>>>0;return seed&1};
    const finder=(x,y)=>{ctx.fillStyle='#111';ctx.fillRect(x*cell,y*cell,7*cell,7*cell);ctx.fillStyle='#fff';ctx.fillRect((x+1)*cell,(y+1)*cell,5*cell,5*cell);ctx.fillStyle='#111';ctx.fillRect((x+2)*cell,(y+2)*cell,3*cell,3*cell)};
    ctx.fillStyle='#111';for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(bit())ctx.fillRect(x*cell,y*cell,cell+.3,cell+.3);finder(1,1);finder(17,1);finder(1,17);
  });
}

document.addEventListener('click', event => {
  const b=event.target.closest('button,[data-view],[data-owner-view],[data-stock]');if(!b)return;
  if (b.dataset.startRole) { state.started=true;state.role=b.dataset.startRole;save();render();if(state.role==='customer'&&!state.customer)openAuth();return; }
  if (b.dataset.close!==undefined) { modal.close();return; }
  if (b.dataset.openRole!==undefined) return openRolePicker();
  if (b.dataset.role) { state.started=true;state.role=b.dataset.role;if(b.dataset.ordersAfter!==undefined)view='orders';save();modal.close();render();if(state.role==='customer'&&!state.customer)openAuth();return; }
  if (b.dataset.home!==undefined) { if(state.role==='customer')view='menu';else if(state.role==='owner')ownerView='overview';render();return; }
  if (b.dataset.view) { view=b.dataset.view;render();return; }
  if (b.dataset.ownerView) { ownerView=b.dataset.ownerView;render();return; }
  if (b.dataset.filter) { filter=b.dataset.filter;render();return; }
  if (b.dataset.filterJump) { filter=b.dataset.filterJump;render();requestAnimationFrame(()=>document.querySelector('.section-heading')?.scrollIntoView({behavior:'smooth'}));return; }
  if (b.dataset.clearSearch!==undefined) { query='';filter='All';render();return; }
  if (b.dataset.add) { state.cart[b.dataset.add]=(state.cart[b.dataset.add]||0)+1;if(b.dataset.closeAfter!==undefined)modal.close();save();render();toast('Added to your basket');return; }
  if (b.dataset.qty) { state.cart[b.dataset.qty]=Math.max(0,(state.cart[b.dataset.qty]||0)+Number(b.dataset.delta));if(!state.cart[b.dataset.qty])delete state.cart[b.dataset.qty];save();render();return; }
  if (b.dataset.item) { const p=menuItem(b.dataset.item);const photos=p.id==='deal'?`<div class="item-dialog-photos">${['jollof','chicken','pie','zobo'].map(id=>`<img src="assets/food/${PHOTOS[id]}" alt="${esc(menuItem(id).name)}">`).join('')}</div>`:`<img src="assets/food/${PHOTOS[p.id]}" alt="${esc(p.name)}">`;modal.innerHTML=`<div class="item-dialog"><button class="modal-close" data-close>×</button>${photos}<span>${esc(p.category)}</span><h2>${esc(p.name)}</h2><p>${esc(p.description)}</p><div><b>${money(p.price)}</b>${p.available?`<button class="primary" data-add="${p.id}" data-close-after>Add to basket</button>`:'<button class="primary" disabled>Currently sold out</button>'}</div><small>Representative sample photographs · Final presentation should use approved Veejay photography.</small></div>`;showModal();return; }
  if (b.dataset.scrollBasket!==undefined) { document.querySelector('#basket')?.scrollIntoView({behavior:'smooth'});return; }
  if (b.dataset.checkout!==undefined) return openCheckout();
  if (b.dataset.checkoutDay) { checkoutState.day=b.dataset.checkoutDay;checkoutState.note=document.querySelector('#checkout-note')?.value||'';openCheckout();return; }
  if (b.dataset.checkoutSlot) { checkoutState.slot=b.dataset.checkoutSlot;checkoutState.note=document.querySelector('#checkout-note')?.value||'';openCheckout();return; }
  if (b.dataset.checkoutPayment) { checkoutState.payment=b.dataset.checkoutPayment;checkoutState.note=document.querySelector('#checkout-note')?.value||'';openCheckout();return; }
  if (b.dataset.pay) { checkoutState.note=document.querySelector('#checkout-note')?.value||'';if(b.dataset.pay==='success')return createOrder();if(b.dataset.pay==='failed')return toast('Payment declined — try another method');modal.close();toast('Payment cancelled. Your basket is still saved.');return; }
  if (b.dataset.sendCode!==undefined) return showOtp();
  if (b.dataset.backAuth!==undefined) return openAuth();
  if (b.dataset.verify!==undefined) { if(document.querySelector('#otp').value!=='123456')return toast('Use demo code 123456');state.customer={...authDraft};save();modal.close();render();toast(`Welcome, ${state.customer.name.split(' ')[0]}!`);return; }
  if (b.dataset.receipt) return openReceipt(b.dataset.receipt);
  if (b.dataset.orderDetail) return openKitchenDetail(b.dataset.orderDetail);
  if (b.dataset.kitchenDetail) return openKitchenDetail(b.dataset.kitchenDetail);
  if (b.dataset.advance) return advanceOrder(b.dataset.advance);
  if (b.dataset.collectCode) { openScanner();const input=document.querySelector('#scan-code');if(input)input.value=b.dataset.collectCode;return; }
  if (b.dataset.scan!==undefined) return openScanner();
  if (b.dataset.confirmCode!==undefined) return collectByCode();
  if (b.dataset.notifications!==undefined) return openNotifications();
  if (b.dataset.guide!==undefined) return openGuide();
  if (b.dataset.reset!==undefined) return openReset();
  if (b.dataset.confirmReset!==undefined) { const role=state.role;state=seedState();state.started=true;state.role=role;save();modal.close();render();if(role==='customer')openAuth();toast('Demo restored to presentation data');return; }
  if (b.dataset.complaint) return openComplaint(b.dataset.complaint);
  if (b.dataset.openCase) return openComplaintCase(b.dataset.openCase);
  if (b.dataset.submitComplaint) { const o=state.orders.find(x=>x.id===b.dataset.submitComplaint);state.complaints.unshift({id:`CMP-${Math.floor(100+Math.random()*899)}`,orderCode:o.code,customer:o.customer,reason:document.querySelector('#complaint-reason').value,details:document.querySelector('#complaint-details').value||'Customer submitted a demo report.',status:'Open',amount:o.total});save();modal.close();toast('Report sent to the owner dashboard');render();return; }
  if (b.dataset.resolve) { const c=state.complaints.find(x=>x.id===b.dataset.resolve);c.status='Resolved';save();modal.close();render();toast('Demo refund approved and case closed');return; }
  if (b.dataset.price) { const p=menuItem(b.dataset.price);state.overrides[p.id]={...(state.overrides[p.id]||{}),price:Math.max(100,p.price+Number(b.dataset.priceDelta))};save();render();return; }
  if (b.dataset.export!==undefined) return openReport();
  if (b.dataset.editProfile!==undefined) return openAuth();
});

document.addEventListener('change', event=>{
  const el=event.target;
  if(el.id==='outlet-select'){state.outlet=el.value;save();render();toast(`Pickup changed to ${el.value}`);}
  if(el.id==='kitchen-outlet'){kitchenOutlet=el.value;render();}
  if(el.dataset.stock){state.overrides[el.dataset.stock]={...(state.overrides[el.dataset.stock]||{}),available:el.checked};save();render();toast(`${menuItem(el.dataset.stock).name} is ${el.checked?'available':'sold out'}`);}
  if(el.dataset.setting){state.settings[el.dataset.setting]=el.checked;save();}
  if(el.dataset.settingNumber){state.settings[el.dataset.settingNumber]=Math.max(1,Math.min(30,Number(el.value)||1));save();render();toast('Slot capacity updated');}
  if(el.dataset.settingSelect){state.settings[el.dataset.settingSelect]=Number(el.value);save();}
});
document.addEventListener('input',event=>{if(event.target.id==='search'){query=event.target.value;render();document.querySelector('#search')?.focus();}});
modal.addEventListener('cancel',event=>{if(authStep===2&&!state.customer){event.preventDefault();toast('Complete demo sign-in or switch roles');}});

render();

let installPrompt = null;
const installButton = document.querySelector('#install-app');
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
installButton.addEventListener('click', async () => {
  if (!installPrompt) return;
  await installPrompt.prompt();
  installPrompt = null;
  installButton.hidden = true;
});
window.addEventListener('appinstalled', () => toast('Veejay Foods installed'));
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
