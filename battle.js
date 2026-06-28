window.GuildBattle = (() => {
  let monsters = [];
  let state = null;

  function initial(){
    return {index:0, hp: monsters[0]?.hp || 500, defeated:[], totalDamage:0};
  }
  function load(){
    state = GuildStorage.get(GuildStorage.keys.battle, null);
    if(!state || !Number.isFinite(state.index)) state = initial();
    return state;
  }
  function save(){ GuildStorage.set(GuildStorage.keys.battle, state); }
  function current(){ return monsters[Math.min(state.index, monsters.length - 1)] || monsters[0]; }
  function bgPath(m){ return `images/backgrounds/${m.background}`; }
  function monsterPath(m){ return `images/monsters/${m.image}`; }

  function setBackground(m){
    const bg = document.getElementById("appBg");
    if(bg && m) bg.style.backgroundImage = `linear-gradient(to bottom,rgba(0,0,0,.02),rgba(0,0,0,.12) 50%,rgba(0,0,0,.78) 86%),url("${bgPath(m)}")`;
  }

  function renderBattle(){
    const m = current();
    if(!m) return;
    setBackground(m);
    const img = document.getElementById("battleEnemy");
    const fallback = document.getElementById("battleFallback");
    document.getElementById("battleStage").textContent = m.stage || "";
    document.getElementById("battleEnemyName").textContent = m.name || "敵";
    document.getElementById("battleHpText").textContent = `${Math.max(0,state.hp)} / ${m.hp}`;
    document.getElementById("battleHpFill").style.width = `${Math.max(0,Math.min(100,state.hp/m.hp*100))}%`;
    img.src = monsterPath(m);
    img.classList.remove("hidden","battle-hit","battle-defeat");
    img.onerror = () => { img.classList.add("hidden"); fallback.classList.remove("hidden"); };
    img.onload = () => fallback.classList.add("hidden");
  }

  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  async function attack(amount){
    load();
    const before = current();
    if(!before) return {defeated:false, damage:amount};

    renderBattle();
    const img = document.getElementById("battleEnemy");
    const damagePop = document.getElementById("damagePop");
    const defeatPop = document.getElementById("defeatPop");

    await sleep(250);
    img.classList.add("battle-hit");
    damagePop.textContent = `${amount} DAMAGE!`;
    damagePop.classList.remove("hidden");
    GuildAudio.play("hit");

    let rest = amount;
    let defeated = false;
    while(rest > 0 && state.index < monsters.length){
      const m = current();
      if(rest >= state.hp){
        rest -= state.hp;
        defeated = true;
        state.defeated.push({id:m.id,name:m.name,at:new Date().toISOString()});
        state.index++;
        if(state.index < monsters.length) state.hp = monsters[state.index].hp;
        else state.hp = 0;
      }else{
        state.hp -= rest;
        rest = 0;
      }
    }
    state.totalDamage += amount;
    save();

    await sleep(420);
    damagePop.classList.add("hidden");

    if(defeated){
      img.classList.remove("battle-hit");
      img.classList.add("battle-defeat");
      defeatPop.classList.remove("hidden");
      GuildAudio.play("defeat");
      await sleep(950);
      defeatPop.classList.add("hidden");
    }else{
      await sleep(350);
    }

    renderBattle();
    return {defeated, damage:amount};
  }

  function init(data){
    monsters = data || [];
    load();
    renderBattle();
  }

  return {init, attack, current, setBackground, load};
})();
