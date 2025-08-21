// Usage:
// node scripts/reviews.js create <token> <activityId> <rating> <comment>
// node scripts/reviews.js update <token> <reviewId> <rating> <comment>
// node scripts/reviews.js delete <token> <reviewId>
// node scripts/reviews.js getUser <token>

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';

async function main() {
  const [cmd, token, a, b, c] = process.argv.slice(2);
  if (!cmd || !token) {
    console.error('Missing args');
    process.exit(1);
  }
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  try {
    if (cmd === 'create') {
      const actividadId = Number(a);
      const rating = Number(b);
      const comment = c || '';
      const res = await fetch(`${API_BASE}/reviews/activities`, {
        method: 'POST', headers, body: JSON.stringify({ actividadturistica_id: actividadId, rating, comment })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      process.stdout.write(String(json.review?.id || ''));
      return;
    }
    if (cmd === 'update') {
      const reviewId = Number(a);
      const rating = Number(b);
      const comment = c || '';
      const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: 'PUT', headers, body: JSON.stringify({ rating, comment })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      process.stdout.write('OK');
      return;
    }
    if (cmd === 'delete') {
      const reviewId = Number(a);
      const res = await fetch(`${API_BASE}/reviews/${reviewId}`, { method: 'DELETE', headers });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      process.stdout.write('OK');
      return;
    }
    if (cmd === 'getUser') {
      const res = await fetch(`${API_BASE}/reviews/user`, { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      process.stdout.write(String(json.reviews?.[0]?.id || ''));
      return;
    }
    console.error('Unknown cmd');
    process.exit(1);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

main();


