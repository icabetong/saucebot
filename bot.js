import { Client } from 'discord.js';
import fetch from "node-fetch";

require('dotenv').config();

const TOKEN = process.env.TOKEN;
const DEBUG = process.env.debug;
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
	member.guild.systemChannel.send(`Welcome **${member.user.tag}**. The Führer is expecting you.`)
})

client.on('guildMemberRemove', member => {
	member.guild.systemChannel.send(`**${member.user.tag}** just left, they were probably a Commie anyway.`);
})

client.on('message', message => {
	if (message.author.bot) return;

	
	if (message.channel.type == "dm") {
		let guildId = DEBUG ? data.guild.debug : data.guild.production;
		let roleId = DEBUG ? data.role.debug : data.role.production;
		
		message.channel.messages.fetch({ limit: 2 })
			.then(messages => {
				const question = messages.last();
				const answer = messages.first();
				
				if (question.content === data.verification.question) {
					if (data.verification.answers.includes(answer.content)) {

						let guild = client.guilds.cache.get(guildId);
						let role = guild.roles.cache.get(roleId);
						if (guild && role) {
							guild.members.cache.get(message.author.id).roles.add(role);
							message.author.send("Congratulations! You are now verified.");
						} else { message.author.send("An error has occurred."); }
					} else {
						message.author.send("Wrong answer! Try again later.");
					}
				}
			}).catch(error => {
				console.error(error);
			})
	}
		 
	// Verification
	if (message.content.startsWith("!verify")) {

		if (message.content !== "!verify") {
			message.reply("There should be no more text after verify.");
		} else {
			message.author.send(data.verification.question);
		}
	} else if (message.content.startsWith("!find")) {

		
	}
})