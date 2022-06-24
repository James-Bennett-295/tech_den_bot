export default {
  name: "messageCreate",
  once: false,
  exe: function (cfg, client, db, msg) {

    if (msg.guild === null) return;

    client.modules.bumpReminder.onMessageCreate(cfg, client, db, msg);
    client.modules.crosspost.onMessageCreate(cfg, client, db, msg);

    if (msg.author.bot || msg.webhookId) return;

    client.modules.cmds.onMessageCreate(cfg, client, db, msg);
    client.modules.msgRewards.onMessageCreate(cfg, client, db, msg);
    client.modules.strReact.onMessageCreate(cfg, client, db, msg);

  }
}
