const $ = id => document.getElementById(id);
let currentTab = "menu";

function toast(msg){
  $("toastText").textContent = msg;
  $("toast").classList.add("show");
  setTimeout(()=>$("toast").classList.remove("show"),1500);
}
function getData(){
  return {
    settings: GuildStorage.get(GuildStorage.keys.settings, {}),
    menu: GuildStorage.get(GuildStorage.keys.menu, []),
    monsters: GuildStorage.get(GuildStorage.keys.monsters, [])
  };
}
function saveJson(key, value){
  try{
    GuildStorage.set(key, JSON.parse(value));
    toast("保存しました");
    render();
  }catch(e){ toast("JSONエラー"); }
}
function render(){
  const d = getData();
  const c = $("adminContent");
  if(currentTab === "menu"){
    c.innerHTML = `<div class="admin-item"><div class="admin-title">menu.json</div><textarea class="json-box" id="jsonEdit">${JSON.stringify(d.menu,null,2)}</textarea><button class="btn gold mt" id="saveJson">保存</button></div>`;
    $("saveJson").onclick = () => saveJson(GuildStorage.keys.menu, $("jsonEdit").value);
  }
  if(currentTab === "battle"){
    c.innerHTML = `<div class="admin-item"><div class="admin-title">monsters.json</div><textarea class="json-box" id="jsonEdit">${JSON.stringify(d.monsters,null,2)}</textarea><button class="btn gold mt" id="saveJson">保存</button></div>`;
    $("saveJson").onclick = () => saveJson(GuildStorage.keys.monsters, $("jsonEdit").value);
  }
  if(currentTab === "settings"){
    c.innerHTML = `<div class="admin-item"><div class="admin-title">settings.json</div><textarea class="json-box" id="jsonEdit">${JSON.stringify(d.settings,null,2)}</textarea><button class="btn gold mt" id="saveJson">保存</button></div>`;
    $("saveJson").onclick = () => saveJson(GuildStorage.keys.settings, $("jsonEdit").value);
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  await GuildStorage.init();
  document.querySelectorAll("[data-admin-tab]").forEach(b => {
    b.onclick = () => {
      document.querySelectorAll("[data-admin-tab]").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      currentTab = b.dataset.adminTab;
      render();
    };
  });
  render();
});
