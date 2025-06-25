export class Gateway {
  constructor(client) {
    this.client = client;
    this.ws = null;
    this.heartbeatInterval = null;
    this.sequence = null;
    this.sessionId = null;
  }

  async connect() {
    const { url } = await this.client.rest.request('GET', '/gateway/bot');
    this.ws = new WebSocket(`${url}?v=10&encoding=json`);
    this.ws.onopen = () => this.onOpen();
    this.ws.onmessage = (msg) => this.onMessage(msg);
    this.ws.onclose = () => this.onClose();
    this.ws.onerror = (err) => console.error('WebSocket error:', err);
  }

  onOpen() {
    console.log('Gateway connected');
  }

  onMessage({ data }) {
    const payload = JSON.parse(data);
    const { op, d, s, t } = payload;
    this.sequence = s;

    switch (op) {
      case 10: // Hello
        this.startHeartbeat(d.heartbeat_interval);
        this.identify();
        break;
      case 0: // Dispatch
        this.handleEvent(t, d);
        break;
      case 11: // Heartbeat ACK
        break;
      default:
        console.log('Unknown opcode:', op, d);
    }
  }

  onClose() {
    clearInterval(this.heartbeatInterval);
    console.log('Gateway disconnected, reconnecting...');
    setTimeout(() => this.connect(), 5000);
  }

  startHeartbeat(interval) {
    this.heartbeatInterval = setInterval(() => {
      this.ws.send(JSON.stringify({ op: 1, d: this.sequence }));
    }, interval);
  }

  identify() {
    this.ws.send(
      JSON.stringify({
        op: 2,
        d: {
          token: this.client.token,
          intents: 33281, // GUILDS + GUILD_MESSAGES + MESSAGE_CONTENT
          properties: {
            os: process.platform,
            browser: 'volytejs',
            device: 'volytejs',
          },
        },
      })
    );
  }

  handleEvent(type, data) {
    switch (type) {
      case 'READY':
        this.sessionId = data.session_id;
        this.client.user = data.user;
        this.client.emit('ready', data.user);
        break;
      case 'MESSAGE_CREATE':
        this.client.emit('messageCreate', data);
        break;
      case 'GUILD_CREATE':
        this.client.guilds.set(data.id, data);
        break;
    }
  }
}