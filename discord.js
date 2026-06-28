window.GuildDiscord = {
  async notifyOrder(order, settings){
    const url = settings && settings.discordWebhookUrl;
    if(!url) return {ok:false, skipped:true};
    const lines = order.items.map(i => `・${i.name} ×${i.qty} = ${i.price*i.qty}G`).join("\\n");
    const body = {
      content: `⚔️ 新規受注\\n冒険者: ${order.name}\\n合計: ${order.total}G\\n${lines}`
    };
    try{
      const res = await fetch(url, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});
      return {ok:res.ok};
    }catch(e){ return {ok:false, error:String(e)}; }
  }
};
