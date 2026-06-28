window.GuildStorage = (() => {
  const keys = {
    settings:"otakuba.v3.settings",
    menu:"otakuba.v3.menu",
    monsters:"otakuba.v3.monsters",
    state:"otakuba.v3.state",
    battle:"otakuba.v3.battle"
  };
  async function fetchJson(path, fallback){
    try{
      const res = await fetch(path + "?v=" + Date.now(), {cache:"no-store"});
      if(!res.ok) throw new Error(path);
      return await res.json();
    }catch(e){ return fallback; }
  }
  function get(key, fallback){
    try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch(e){ return fallback; }
  }
  function set(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  async function init(){
    const settings = get(keys.settings, await fetchJson("settings.json", {}));
    const menu = get(keys.menu, await fetchJson("menu.json", []));
    const monsters = get(keys.monsters, await fetchJson("monsters.json", []));
    set(keys.settings, settings); set(keys.menu, menu); set(keys.monsters, monsters);
    return {settings, menu, monsters};
  }
  return {keys, get, set, init};
})();
