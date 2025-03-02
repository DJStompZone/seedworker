const { SEEDS_KEY, COMMENT_PREFIX, RATE_LIMIT_PREFIX } = require('./constants');

class KVManager {
  constructor(kvNamespace) {
    this.kv = kvNamespace;
  }

  async getSeeds() {
    const seeds = await this.kv.get(SEEDS_KEY, 'json');
    return seeds || [];
  }

  async getComments() {
    const { keys } = await this.kv.list({ prefix: COMMENT_PREFIX });
    const comments = await Promise.all(
      keys.map(async ({ name }) => {
        return this.kv.get(name, 'json');
      })
    );
    return comments.sort((a, b) => b.timestamp - a.timestamp);
  }

  async addComment(comment) {
    const commentKey = `${COMMENT_PREFIX}${comment.timestamp}_${comment.ip}`;
    await this.kv.put(commentKey, JSON.stringify(comment));
  }

  async checkRateLimit(ip) {
    const lastSubmission = await this.kv.get(`${RATE_LIMIT_PREFIX}${ip}`);
    return lastSubmission && Date.now() - parseInt(lastSubmission) < 60000;
  }

  async setRateLimit(ip) {
    await this.kv.put(
      `${RATE_LIMIT_PREFIX}${ip}`,
      Date.now().toString(),
      { expirationTtl: 60 }
    );
  }
}

module.exports = KVManager;
