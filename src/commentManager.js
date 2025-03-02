const { sanitize, escapeHtml } = require('./utilities');

class CommentManager {
  static validateInput(name, text) {
    if (!name || !text || name.length > 50 || text.length > 500) {
      return false;
    }
    return true;
  }

  static sanitizeComment({ name, text, ip }) {
    return {
      name: sanitize(name).substring(0, 50),
      text: sanitize(text).substring(0, 500),
      timestamp: Date.now(),
      ip: ip.replace(/[^\d.:]/g, '')
    };
  }

  static toHTML(comment) {
    return `
      <div class="comment">
        <strong>${escapeHtml(comment.name)}</strong>
        <small>${new Date(comment.timestamp).toLocaleString()}</small>
        <p>${escapeHtml(comment.text)}</p>
      </div>
    `;
  }

  static async handlePostComment(request, kv) {
    const ip = request.headers.get('CF-Connecting-IP');

    if (await kv.checkRateLimit(ip)) {
      return new Response('Rate limited', { status: 429 });
    }

    const { name, text } = await request.json();

    if (!this.validateInput(name, text)) {
      return new Response('Invalid input', { status: 400 });
    }

    const comment = this.sanitizeComment({
      name,
      text,
      ip
    });

    await Promise.all([
      kv.addComment(comment),
      kv.setRateLimit(ip)
    ]);

    return new Response(JSON.stringify(comment), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  static async handleGetComments(kv) {
    const comments = await kv.getComments();
    return new Response(JSON.stringify(comments), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

module.exports = CommentManager;
