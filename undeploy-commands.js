const { REST, Routes } = require('discord.js');
const env = require('dotenv').config();
const token = process.env.token;
const clientId = process.env.clientId;
const guildId = process.env.guildId;

const rest = new REST().setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);