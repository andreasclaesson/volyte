# Volyte
A lightweight Discord bot library focused on performance and minimal resource usage.
⚠️ **This package is currently in beta and under active development.**

## Installation
```bash
npm install volyte > yarn add volyte
```

## Example
```javascript
import { Client } from 'volyte';

const client = new Client({ token: 'YOUR_BOT_TOKEN' });

client.on('ready', (user) => {
  console.log(`Logged in as ${user.username}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === '!ping') {
    await client.sendMessage(message.channel_id, 'Pong!');
  }
});

client.login();
```
(yes, slash commands are coming)

## Contributing
Contributions are always welcome ❤️ Please open issues or pull requests.