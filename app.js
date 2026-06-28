window.GuildApp = (() => {
  let data, name = "";

  const $ = id => document.getElementById(id);

  function show(id){
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    $(id).classList.add("active");
  }

  function getName(){ return name || localStorage.getItem("otakuba.v3.name") || "冒険者"; }

  async function init(){
    data = await GuildStorage.init();
    name = localStorage.getItem("otakuba.v3.name") || "";
    GuildBattle.init(data.monsters);
    GuildMenu.init(data);

    $("btnStartYes").onclick = () => {
      GuildAudio.play("ok");
      if(name){ applyName(); show("screenMenu"); }
      else show("screenName");
    };
    $("btnStartNo").onclick = () => {
      GuildAudio.play("bad");
      const t = document.querySelector("#screenStart .subtitle");
      t.textContent = "冷やかしか？さっさとメニューを開け";
    };
    $("btnNameOk").onclick = () => {
      const v = $("nameInput").value.trim();
      if(!v) return;
      name = v; localStorage.setItem("otakuba.v3.name", name);
      applyName();
      GuildAudio.play("ok");
      show("screenMenu");
    };
    $("btnReturn").onclick = () => show("screenStart");
    applyName();
  }

  function applyName(){
    $("adventurerName").textContent = getName();
    const visits = Number(localStorage.getItem("otakuba.v3.visits") || "1");
    $("levelBadge").textContent = `Lv.${Math.max(1, visits)}`;
  }

  return {init, show, getName};
})();
document.addEventListener("DOMContentLoaded", GuildApp.init);
