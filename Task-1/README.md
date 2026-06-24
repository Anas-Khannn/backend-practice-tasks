<div align="center">

```
╔══════════════════════════════════════════════════════╗
║         BACKEND MICRO-TASKS                          ║
║         Native Node.js & Git Workflow                ║
╚══════════════════════════════════════════════════════╝
```

![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen?style=for-the-badge)
![Tasks](https://img.shields.io/badge/Tasks-5%20Completed-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Raw. Native. No shortcuts.**

*Five backend micro-tasks built with pure Node.js — no Express, no dotenv, no npm install.*

[View Tasks](#-tasks) · [Git Workflow](#-git-workflow-strategy) · [How to Run](#-how-to-run) · [Project Structure](#-project-structure)

</div>

---

## ⚡ What is this?

This repository is a curated set of **backend micro-tasks** designed to build deep, first-principles understanding of how Node.js actually works under the hood. Every task deliberately strips away popular abstractions to expose the raw platform.

```bash
# The entire setup process
git clone https://github.com/YOUR_USERNAME/backend-practice-tasks.git
cd backend-practice-tasks

# That's it. No npm install. No package.json. Just Node.
node task1-validator.js
```

> **Why zero dependencies?** Because understanding `req.on('data', ...)` makes you a better developer than using `express.json()` forever without knowing what it does.

---

## 🧭 Git Workflow Strategy

For every task, the following steps are followed to maintain a clean, granular commit history — an essential engineering standard.

```
1. ✏️  Create the designated file
2. 🧪  Write and test the code locally
3. 📦  Stage and commit with a meaningful message
4. 🚀  Push to the remote repository
```

### Commit Convention

```bash
git commit -m "feat(task-1): add raw body validator with stream handling"
git commit -m "feat(task-2): add native env config reader using --env-file flag"
git commit -m "feat(task-3): add native fetcher using built-in global fetch"
git commit -m "feat(task-4): add CSV appender with fs.appendFile"
git commit -m "feat(task-5): add content-type router with manual URL inspection"
```

---

## 📋 Tasks

---

### ✅ Task 1 — The Raw Body Validator
> *Data Validation*

**Goal:** Understand low-level stream handling by parsing and validating incoming data **without** `express.json()` or any middleware abstraction.

<details>
<summary><strong>📂 View task details</strong></summary>

**File:** `task1-validator.js`

**What it does:**
- Creates an HTTP server using the native `http` module
- Listens for `POST /email` requests
- Reads raw stream chunks using `req.on('data', ...)` and `req.on('end', ...)`
- Assembles chunks → parses JSON → validates email
- `400 "Invalid Email"` if no `@` symbol, otherwise `200 OK`

**Code Snapshot:**
```js
const http = require('http');

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/email') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const { email } = JSON.parse(body);
      if (!email.includes('@')) {
        res.writeHead(400);
        res.end('Invalid Email');
      } else {
        res.writeHead(200);
        res.end('OK');
      }
    });
  }
}).listen(3000);
```

**Test it:**
```bash
# Valid
curl -X POST http://localhost:3000/email \
  -H "Content-Type: application/json" \
  -d '{"email": "anas@example.com"}'
# → 200 OK

# Invalid
curl -X POST http://localhost:3000/email \
  -H "Content-Type: application/json" \
  -d '{"email": "notvalid"}'
# → 400 Invalid Email
```

</details>

---

### ✅ Task 2 — The Core Config Reader
> *Configuration*

**Goal:** Read environment configurations **natively** using Node.js v20+'s built-in `.env` file support — no `dotenv` package.

<details>
<summary><strong>📂 View task details</strong></summary>

**Files:** `task2-config.js` · `.env`

**`.env` file:**
```env
PORT=5000
```

**What it does:**
- Uses the `--env-file` flag (Node.js v20+ native)
- Reads `PORT` via `process.env.PORT`
- Logs the port on server initialization

**Code Snapshot:**
```js
const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Server is running!');
}).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Run it:**
```bash
node --env-file=.env task2-config.js
# → Server running on port 5000
```

</details>

---

### ✅ Task 3 — The Native Fetcher
> *Third-Party APIs*

**Goal:** Communicate with external services using Node's **native global `fetch`** — available without any import since Node.js v18+.

<details>
<summary><strong>📂 View task details</strong></summary>

**File:** `task3-fetcher.js`

**What it does:**
- Creates a native `http` server
- Exposes `GET /api`
- Uses the built-in global `fetch()` to call a free external API
- Awaits, parses, and returns the JSON response

**Code Snapshot:**
```js
const http = require('http');
const EXTERNAL_API = 'https://api.freeapi.app/api/v1/public/randomjokes/joke/random';

http.createServer(async (req, res) => {
  if (req.url === '/api' && req.method === 'GET') {
    const response = await fetch(EXTERNAL_API);
    const data = await response.json();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }
}).listen(3000);
```

**Test it:**
```bash
node task3-fetcher.js

curl http://localhost:3000/api
# → { "data": { ... } }
```

</details>

---

### ✅ Task 4 — The CSV Appender
> *Data Persistence*

**Goal:** Persist text-based data locally using the **native `fs` module**, maintaining a product mindset toward simple data storage.

<details>
<summary><strong>📂 View task details</strong></summary>

**File:** `task4-csv.js` · **Output:** `users.csv`

**What it does:**
- Handles `POST /log-user`
- Extracts `name` from query string (e.g. `/log-user?name=Anas`)
- Appends `name,\n` to `users.csv` using `fs.appendFile`

**Code Snapshot:**
```js
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'POST' && url.pathname === '/log-user') {
    const name = url.searchParams.get('name');
    fs.appendFile('users.csv', `${name},\n`, err => {
      if (err) throw err;
      res.writeHead(200);
      res.end(`Logged: ${name}`);
    });
  }
}).listen(3000);
```

**Test it:**
```bash
curl -X POST "http://localhost:3000/log-user?name=Anas"
curl -X POST "http://localhost:3000/log-user?name=Sara"

cat users.csv
# Anas,
# Sara,
```

</details>

---

### ✅ Task 5 — The Content-Type Router
> *Basic Routing*

**Goal:** Deliver different content types using **only native methods**, reinforcing how browsers interpret varying payload formats.

<details>
<summary><strong>📂 View task details</strong></summary>

**File:** `task5-router.js`

**What it does:**
- Manually inspects `req.url`
- `/` → `Content-Type: text/html` → returns `<h1>Hello</h1>`
- `/json` → `Content-Type: application/json` → returns `{ "message": "hello world" }`

**Code Snapshot:**
```js
const http = require('http');

http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Hello</h1>');
  } else if (req.url === '/json') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'hello world' }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
}).listen(3000);
```

**Test it:**
```bash
curl -i http://localhost:3000/
# Content-Type: text/html → <h1>Hello</h1>

curl -i http://localhost:3000/json
# Content-Type: application/json → {"message":"hello world"}
```

</details>

---

## 📁 Project Structure

```
backend-practice-tasks/
│
├── 📄  task1-validator.js      ← stream parsing & email validation
├── 📄  task2-config.js         ← native .env with --env-file flag
├── 📄  task3-fetcher.js        ← global fetch() external API call
├── 📄  task4-csv.js            ← file persistence with fs.appendFile
├── 📄  task5-router.js         ← content-type routing via req.url
│
├── 🔐  .env                    ← PORT=5000
├── 📊  users.csv               ← auto-generated by task 4
└── 📖  README.md
```

> ⚠️ `.env` is tracked here for learning purposes. In production, always add `.env` to `.gitignore`.

---

## 🚀 How to Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/backend-practice-tasks.git
cd backend-practice-tasks

# Run any task (no npm install required)
node task1-validator.js
node --env-file=.env task2-config.js
node task3-fetcher.js
node task4-csv.js
node task5-router.js
```

**Requirements:**
- Node.js `v20+`
- No other dependencies

---

## 🧠 Concepts Covered

| Task | Concept | Native API Used |
|------|---------|----------------|
| Task 1 | HTTP stream parsing | `req.on('data')` · `req.on('end')` |
| Task 2 | Zero-dependency config | `process.env` · `--env-file` flag |
| Task 3 | External API calls | Global `fetch()` (Node v18+) |
| Task 4 | File system persistence | `fs.appendFile()` |
| Task 5 | Content-type routing | `req.url` · `res.writeHead()` |

---

<div align="center">

```
Built with native Node.js
Zero dependencies. Maximum understanding.
```

⭐ **Star this repo** if it helped you understand Node.js fundamentals

</div>
