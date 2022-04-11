import axios from "axios";
import logger from "@james-bennett-295/logger";
import discord from "discord.js";

let subredditLs = [
	"memes", "programmerhumor", "shitposting", "comedyheaven", "195", "me_irl", "meme", "speedoflobsters", "tumblr", "skamtebord", "youngpeopleyoutube",
	"holup", "ihadastroke", "engrish", "greentext", "okmatewanker", "clevercomebacks", "dankmemes"
];

export default {
	name: "meme",
	minArgs: 0,
	usage: "<subreddit/\"ListSubreddits\"> <post num/\"\">",
	cooldown: 3500,
	description: "Get a meme from Reddit!",
	category: "Fun",
	botOwnerOnly: false,
	staffOnly: false,
	execute: function(cfg, client, db, msg, args) {

		let subreddit;
		if (args[0]) {
			if (args[0].toLowerCase() == "listsubreddits") return msg.reply("**Subreddits:**\n\t`r/" + subredditLs.join("`\n\t`r/") + "`");
			subreddit = args[0];
			if (subreddit.startsWith("r/")) subreddit = subreddit.slice(2);
			if (!subredditLs.includes(subreddit)) return msg.reply("That subreddit is not an option! Run `!meme ListSubreddits` to see which subreddits you can choose.");
		} else {
			subreddit = subredditLs[Math.floor(Math.random() * (subredditLs.length - 1))];
		}

		axios.get("https://www.reddit.com/r/" + subreddit + "/hot.json")
			.then(res => {

				let postNum;
				if (args[1]) {
					if (isNaN(args[1]) || !(1 <= parseInt(args[1]) && parseInt(args[1]) <= res.data.data.dist)) return msg.reply("That post number is not an option! It must be a number between 1 and " + res.data.data.dist + ".");
					postNum = parseInt(args[1]) - 1;
				} else {
					postNum = Math.floor(Math.random() * res.data.data.dist);
				}

				let post = res.data.data.children[postNum].data;

				if (post.over_18 && !msg.channel.nsfw) return msg.reply("Sorry, but the meme I was going to send is marked as NSFW and this channel is not.");

				let embed = new discord.MessageEmbed()
					.setColor("AQUA")
					.setTitle(post.title.slice(0, 256))
					.setURL("https://reddit.com" + post.permalink)
					.setFooter({ text: "Posted in " + post.subreddit_name_prefixed + " by " + post.author });

				if (post.thumbnail.startsWith("https://")) {
					if (post.url.endsWith(".gif") || post.url.endsWith(".jpg") || post.url.endsWith(".jpeg") || post.url.endsWith(".png")) {
						embed.setImage(post.url);
					} else if (post.url.startsWith("https://www.reddit.com/gallery/")) {

						let imgs = [];
						let mediaMetadataKeys = [];
						for (let i in post.gallery_data.items) { // getting keys arr from post.gallery_data.items[i].media_id as post.media_metadata keys aren't always in display order
							mediaMetadataKeys.push(post.gallery_data.items[i].media_id);
						}
						for (let i in mediaMetadataKeys) {
							imgs.push({
								"img": "https://i.redd.it/" + post.media_metadata[mediaMetadataKeys[i]]["s"]["u"].split('?')[0].slice(24),
								"caption": (post.gallery_data.items[i].caption || null)
							});
						}

						const btnPrevId = (client.btnId++).toString();
						let btnPrev = new discord.MessageButton()
							.setCustomId(btnPrevId)
							.setStyle("PRIMARY")
							.setEmoji(cfg.guildEmojis.arrowPrev)
							.setDisabled(true);
						const btnNextId = (client.btnId++).toString();
						let btnNext = new discord.MessageButton()
							.setCustomId(btnNextId)
							.setStyle("PRIMARY")
							.setEmoji(cfg.guildEmojis.arrowNext)
							.setDisabled(false);
						let row = new discord.MessageActionRow()
							.addComponents(
								btnPrev,
								btnNext
							);

						embed
							.setImage(imgs[0].img)
							.setFooter({ text: "Image 1/" + imgs.length + "\nPosted in " + post.subreddit_name_prefixed + " by " + post.author });
						if (imgs[0].caption !== null) embed.setDescription(imgs[0].caption);

						const filter = i => (i.customId === btnPrevId || i.customId === btnNextId) && i.user.id === msg.author.id && i.message.createdTimestamp > client.processStartTime;
						const collector = msg.channel.createMessageComponentCollector({ filter, time: 300000 }); // 5 minutes

						let imgNum = 0;

						collector.on("collect", (i) => {
							if (i.customId === btnPrevId) {
								if (imgNum !== 0) imgNum--;
								if (imgNum === imgs.length - 2) btnNext.setDisabled(false);
								if (imgNum === 0) btnPrev.setDisabled(true);
							} else if (i.customId === btnNextId) {
								if (imgNum !== imgs.length - 1) imgNum++;
								if (imgNum === 1) btnPrev.setDisabled(false);
								if (imgNum === imgs.length - 1) btnNext.setDisabled(true);
							}
							row = new discord.MessageActionRow()
								.addComponents(
									btnPrev,
									btnNext
								);

							embed
								.setImage(imgs[imgNum].img)
								.setFooter({ text: "Image " + (imgNum + 1) + "/" + imgs.length + "\nPosted in " + post.subreddit_name_prefixed + " by " + post.author });
							if (imgs[imgNum].caption !== null) embed.setDescription(imgs[imgNum].caption);
							i.update({ components: [row], embeds: [embed] });

						});

						return msg.reply({ embeds: [embed], components: [row] })
							.then((message) => {
								collector.on("end", (collected) => {
									message.edit({ components: [] });
								});
							});

					} else if (post.secure_media && post.secure_media.type && post.secure_media.type === "imgur.com") {
						embed.setImage(post.secure_media.oembed.thumbnail_url.split('?')[0]);
					} else {
						embed.setImage(post.thumbnail);
					}
				}

				msg.reply({ embeds: [embed] });

			})
			.catch(err => {
				logger.error("[meme command]: An error occured trying to fetch data from https://www.reddit.com/r/" + subreddit + "/hot.json\nERROR: " + err);
			});

	}
}
