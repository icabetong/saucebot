import { Client, MessageEmbed } from 'discord.js';
import { TOKEN } from './config.json';

const client = new Client();

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

	//message.reply(`testing`);
})