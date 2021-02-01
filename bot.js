import { Client } from 'discord.js';
import fetch from "node-fetch";

require('dotenv').config();

const TOKEN = process.env.TOKEN;
const client = new Client();

let url = "https://api.jsonbin.io/b/6017a79cabdf9c556795cb06/2";
let data;
fetch(url)
	.then(data => data.json())
	.then(output => data = output)
	.catch(err => data = err);

client.login(TOKEN);

client.on('ready', () => {
	console.info(`Logged in as ${client.user.tag}`);
});

client.on('guildMemberAdd', member => {
	member.guild.systemChannel.send(`Welcome **${member.user.tag}**. The Fuhrer is expecting you.`)
})

client.on('guildMemberRemove', member => {
	member.guild.systemChannel.send(`**${member.user.tag}** just left, they were probably a Commie anyway.`);
})

client.on('message', message => {
	if (message.author.bot) return;

	if (message.channel.type == "dm") {
		
		message.channel.messages.fetch({ limit: 2 })
			.then(messages => {
				const question = messages.last();
				const answer = messages.first();
				
				if (question.content === data.verification.question) {
					if (data.verification.answers.indexOf(answer.content) > -1) {

						let guild = client.guilds.cache.get(data.guild.debug);
						if (guild) {
							let role = guild.roles.cache.get(data.role.debug);
							if (role) {
								guild.members.cache.get(message.author.id).roles.add(role);
								message.author.send("Congratulations! You are now verified.");
							}
						}
					}	
				}
			}).catch(error => {
				console.error(error);
			})
	}
               
	if (message.content.startsWith("!verify")) {

		if (message.content !== "!verify") {
			message.reply("There should be no more text after verify");
		} else {
			message.author.send(data.verification.question);
		}
	}
})