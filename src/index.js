const HTML_TEMPLATE = require('./htmlTemplate');
const CommentManager = require('./commentManager');
const KVManager = require('./kvManager');
const { escapeHtml } = require('./utilities');
const { SEEDS, SEEDS_KEY } = require('./constants');
const dotenv = require('dotenv');
dotenv.config();

async function handleMainPage(kv) {
	const [seeds, comments] = await Promise.all([kv.getSeeds(), kv.getComments()]);

	const seedsList = seeds
		.map(
			(seed) => `
    <label class="checkbox-container">
      <input type="checkbox">${escapeHtml(seed)}
    </label>
  `
		)
		.join('');

	const commentsHtml = comments.map(CommentManager.toHTML).join('');

	return HTML_TEMPLATE.replace('{{COMMENTS}}', commentsHtml).replace('{{SEEDS_LIST}}', seedsList);
}

export default {
	async fetch(request, env, ctx) {
		const kv = new KVManager(env.SEEDS_KV);
		const url = new URL(request.url);

		// Initialize seeds if not exists
		const existingSeeds = await kv.getSeeds();
		if (existingSeeds.length === 0) {
			await kv.kv.put(SEEDS_KEY, JSON.stringify(SEEDS));
		}

		if (url.pathname === '/comments') {
			if (request.method === 'POST') {
				return CommentManager.handlePostComment(request, kv);
			}
			if (request.method === 'GET') {
				return CommentManager.handleGetComments(kv);
			}
			return new Response('Method not allowed', { status: 405 });
		}

		const fullHtml = await handleMainPage(kv);
		return new Response(fullHtml, {
			headers: { 'Content-Type': 'text/html' },
		});
	},
};
