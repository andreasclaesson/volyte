const API_BASE = 'https://discord.com/api/v10';

export class Rest {
  constructor(token) {
    this.token = token;
  }

  async request(method, endpoint, body) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    const options = {
      method,
      headers: {
        Authorization: `Bot ${this.token}`,
        'Content-Type': 'application/json',
      },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    return res.status === 204 ? null : res.json();
  }

  getCurrentUser() {
    return this.request('GET', '/users/@me');
  }

  createMessage(channelId, data) {
    return this.request('POST', `/channels/${channelId}/messages`, data);
  }
}