const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Seed Checklist</title>
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
