import { Client } from '../src/index.js';

const client = new Client({ token: 'YOUR_BOT_TOKEN' });

client.on('ready', (user) => {
  console.log(`Logged in as ${user.username}`);
});

// Currently, the package does not support slash commands, so we will use a simple message command.
client.on('messageCreate', async (message) => {
  if (message.content === '!ping') {
    await client.sendMessage(message.channel_id, 'Pong!');
  }
});

client.login();