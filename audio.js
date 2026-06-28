window.GuildAudio = {
  play(type){
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      const f = type === "bad" ? 120 : type === "hit" ? 180 : type === "defeat" ? 440 : 660;
      osc.frequency.value = f; gain.gain.value = 0.035;
      osc.start(); osc.stop(ctx.currentTime + 0.08);
    }catch(e){}
  }
};
