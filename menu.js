window.GuildMenu = (() => {
  let settings, menu, activeCategory = "all";
  let order = [];
  let confirmedTotal = 0;

  const $ = id => document.getElementById(id);

  function money(n){ return `${Number(n||0).toLocaleString()}${settings.currency || "G"}`; }
  function total(){ return order.reduce((s,i)=>s+i.price*i.qty,0); }
  function toast(msg){
    $("toastText").textContent = msg;
    $("toast").classList.add("show");
    setTimeout(()=>$("toast").classList.remove("show"),1600);
  }

  function renderTabs(){
    const tabs = $("tabs");
    tabs.innerHTML = "";
    (settings.categories || []).forEach(c => {
      const b = document.createElement("button");
      b.className = "tab" + (activeCategory === c.id ? " active" : "");
      b.textContent = c.name;
      b.onclick = () => { activeCategory = c.id; renderMenu(); renderTabs(); };
      tabs.appendChild(b);
    });
  }

  function renderMenu(){
    const list = $("menuList");
    const items = activeCategory === "all" ? menu : menu.filter(i => i.category === activeCategory);
    list.innerHTML = "";
    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "product";
      const img = item.image ? `<img src="${item.image}" alt="">` : item.icon || "🍽️";
      card.innerHTML = `
        <div class="product-img">${img}</div>
        <div class="product-title">${item.name}</div>
        <div class="product-desc">${item.desc || ""}</div>
        <div class="product-price">${money(item.price)}</div>
        <button class="btn gold">追加</button>
      `;
      card.querySelector("button").onclick = () => add(item.id);
      list.appendChild(card);
    });
  }

  function add(id){
    const item = menu.find(i => i.id === id);
    if(!item) return;
    const found = order.find(i => i.id === id);
    if(found) found.qty++;
    else order.push({...item, qty:1});
    GuildAudio.play("ok");
    toast(`${item.name}を受注一覧に追加`);
  }

  function renderOrders(){
    const list = $("orderList");
    if(!order.length){
      list.innerHTML = `<div class="empty">まだ受注がありません。</div>`;
    }else{
      list.innerHTML = "";
      order.forEach((item, idx) => {
        const row = document.createElement("div");
        row.className = "order-item";
        row.innerHTML = `
          <div>
            <div class="product-title">${item.name}</div>
            <div class="tiny">${money(item.price)} × ${item.qty}</div>
          </div>
          <div class="qty">
            <button class="btn small">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="btn small">＋</button>
          </div>
        `;
        const [minus, plus] = row.querySelectorAll("button");
        minus.onclick = () => { item.qty--; if(item.qty<=0) order.splice(idx,1); renderOrders(); };
        plus.onclick = () => { item.qty++; renderOrders(); };
        list.appendChild(row);
      });
    }
    $("orderTotal").textContent = `合計 ${money(total())}`;
  }

  async function confirm(){
    if(!order.length){ toast("受注がありません"); GuildAudio.play("bad"); return; }
    const damage = Math.max(0, total() - confirmedTotal);
    confirmedTotal = total();

    await GuildDiscord.notifyOrder({
      name: GuildApp.getName(),
      items: order,
      total: total()
    }, settings);

    GuildApp.show("screenBattle");
    await GuildBattle.attack(damage);
    toast("注文をギルドへ送信しました");
    GuildApp.show("screenMenu");
  }

  function checkout(){
    order = [];
    confirmedTotal = 0;
    renderOrders();
    GuildApp.show("screenComplete");
  }

  function init(data){
    settings = data.settings; menu = data.menu;
    renderTabs(); renderMenu();
    $("btnOrders").onclick = () => { renderOrders(); GuildApp.show("screenOrders"); };
    $("btnBackMenu").onclick = () => GuildApp.show("screenMenu");
    $("btnConfirmOrder").onclick = confirm;
    $("btnCheckout").onclick = checkout;
  }
  return {init, renderOrders, total};
})();
