const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="icon" href="https://seeds.stomp.zone/favicon.ico">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#000000">
  <meta name="description" content="Checklist for Minecraft exploration">
  <meta property="og:title" content="Seed Checklist">
  <meta property="og:description" content="Checklist for Minecraft exploration">
  <meta property="og:image" content="https://seeds.stomp.zone/logo512.png">
  <meta property="og:url" content="https://seed.stomp.zone">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Seed Checklist">
  <meta name="twitter:description" content="Checklist for Minecraft exploration">
  <meta name="twitter:image" content="https://seeds.stomp.zone/logo512.png">
  <link rel="apple-touch-icon" href="https://seeds.stomp.zone/logo192.png">
  <link rel="manifest" href="https://seeds.stomp.zone/manifest.json">
  <title>Seed Checklist</title>
  <style>@import url(https://fonts.googleapis.com/css2?family=Allison&family=Merienda:wght@300..900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Zen+Dots&display=swap);body{align-items:center;background:linear-gradient(90deg,#38b2ac,#68d391);display:flex;font-family:Space Mono,serif;font-style:normal;font-weight:700;justify-content:center;margin:0;min-height:100vh;overflow:hidden;padding:0}@keyframes panBackground{0%{background-position:0 0}to{background-position:-10000px 0}}body:before{image-resolution:from-image 300dpi;animation:panBackground 400s linear infinite;background:url(/static/media/mcpan3.11243124ab150bb92d66.png) repeat-x;background-size:cover;content:"";height:100%;left:0;position:absolute;top:0;width:200%;z-index:-1}.container{align-content:space-evenly;background:#fff;border-radius:10px;border-bottom-right-radius:6px;border-top-right-radius:6px;box-shadow:0 4px 6px #0000001a;display:grid;margin:2em 0;max-height:calc(80vh - 4em);outline:6px solid #fff;overflow-y:scroll;padding:.5em 2.5em;place-items:center;text-align:center}.container::-webkit-scrollbar{width:6px}.container::-webkit-scrollbar-track{background:#e0fdf8;border-radius:10px}.container::-webkit-scrollbar-thumb{background:#38b2ac;border-radius:6px}.container::-webkit-scrollbar-thumb:hover{background:#2c7a7b}.heading{font-family:Allison,serif;font-size:4rem;font-style:normal;font-weight:700;height:1em;margin-bottom:.4em;margin-top:.1em;max-width:100%;white-space:nowrap}@media (max-width:768px){.heading{font-size:4rem}}@media (max-width:480px){.heading{font-size:3rem}}.progress-container{background:#e2e8f0;border-radius:8px;height:calc(.5vh + 1.2vw);overflow:hidden}.progress-bar{background:#38b2ac;height:100%;margin:0!important;transition:width .3s}.checkbox-container{display:block;font-size:.95em;margin:5px 0 5px 10px;text-align:left}input[type=checkbox]{margin-right:1em;transform:scale(1.2) translatey(2px)}.checklist label{font-size:.9em}.checklist label.checked{color:#a0aec0;text-decoration:line-through}.card p{font-size:1.25em;font-weight:800;margin-bottom:1.25em;margin-top:.5em}.checklist{align-items:stretch;display:flex;flex-direction:column;flex-wrap:nowrap;justify-self:center;margin-bottom:1em}.card{padding-bottom:1em}</style>

  <style>
    body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 1rem; }
    .checkbox-container { display: block; margin: 0.5rem 0; }
    .comments-section { margin: 2rem 0; border-top: 1px solid #ccc; padding-top: 1rem; }
    #commentsList { margin: 1rem 0; }
    .comment { padding: 1rem; background: #f5f5f5; border-radius: 4px; margin-bottom: 1rem; }
    #commentForm { display: flex; flex-direction: column; gap: 1rem; max-width: 500px; }
    input, textarea { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 0.5rem 1rem; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer; }
  </style>
  </head>
<body>
  <div class="container">
    <h1 class="heading">Seed Checklist</h1>
    <div class="card">
      <div class="checklist">
        {{SEEDS_LIST}}
      </div>

      <div class="comments-section">
        <h2>Public Comments</h2>
        <form id="commentForm">
          <input type="text" id="name" placeholder="Your name" required>
          <textarea id="comment" placeholder="Your comment" required rows="4"></textarea>
          <button type="submit">Post Comment</button>
        </form>
        <div id="commentsList">
          {{COMMENTS}}
        </div>
      </div>
    </div>
  </div>

  <script>
    document.getElementById('commentForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        name: document.getElementById('name').value,
        text: document.getElementById('comment').value
      };

      try {
        const response = await fetch('/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          location.reload();
        } else {
          alert('Error submitting comment');
        }
      } catch (error) {
        alert('Network error');
      }
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      const seedText = checkbox.parentElement.textContent.trim();
      const savedState = localStorage.getItem(seedText);
      if (savedState) checkbox.checked = JSON.parse(savedState);

      checkbox.addEventListener('change', (e) => {
        const seed = e.target.parentElement.textContent.trim();
        localStorage.setItem(seed, e.target.checked);
      });
    });
  </script>
</body>
</html>`;

module.exports = HTML_TEMPLATE;
