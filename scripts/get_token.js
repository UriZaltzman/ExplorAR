// Usage: node scripts/get_token.js [email] [password]
const email = process.argv[2] || 'testuser@gmail.com';
const password = process.argv[3] || 'password123';

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';

async function run() {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) {
      console.error('Login failed:', json);
      process.exit(1);
    }
    if (!json.token) {
      console.error('No token in response');
      process.exit(1);
    }
    process.stdout.write(json.token);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

run();


