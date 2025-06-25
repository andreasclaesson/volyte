import { Rest } from './rest.js';
import { Gateway } from './gateway.js';

export class Client {
  constructor(options = {}) {
    if (!options.token) throw new Error('Token is required');
    this.token = options.token;
    this.rest = new Rest(this.token);
    this.gateway = new Gateway(this);
    this.events = new Map();
    this.user = null;
    this.guilds = new Map();
  }

  on(event, callback) {
    this.events.set(event, callback);
    return this;
  }

  emit(event, ...args) {
    const callback = this.events.get(event);
    if (callback) callback(...args);
  }

  async login() {
    this.user = await this.rest.getCurrentUser();
    await this.gateway.connect();
    this.emit('ready', this.user);
  }

  async sendMessage(channelId, content) {
    return this.rest.createMessage(channelId, { content });
  }
}