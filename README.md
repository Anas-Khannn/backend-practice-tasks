<div align="center">

```
╔═══════════════════════════════════════════╗
║              ALGO-BACKEND                 ║
║       Native Node.js Task Series          ║
╚═══════════════════════════════════════════╝
```

![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen?style=for-the-badge)
![Tasks](https://img.shields.io/badge/Tasks-5-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20Progress-orange?style=for-the-badge)

</div>

---

## 📁 Project Structure

```
ALGO-BACKEND/
│
├── 📂 Task-1/
│   ├── 📄 Server.js        ← Raw body validator (POST /email stream parsing)
│   └── 📄 test.js          ← Sends test POST request with email payload
│
├── 📂 Task-2/
│   ├── 📄 Server.js        ← Config reader (native --env-file, PORT=5000)
│   └── 📄 test.js          ← Verifies server boots on correct port
│
├── 📂 Task-3/
│   ├── 📄 Server.js        ← Native fetcher (GET /api → external API)
│   └── 📄 test.js          ← Hits /api and logs the external response
│
├── 📂 Task-4/
│   ├── 📄 Server.js        ← CSV appender (POST /log-user?name=Anas)
│   └── 📄 test.js          ← Sends multiple name requests, checks users.csv
│
├── 📂 Task-5/
│   ├── 📄 Server.js        ← Content-type router (/ → HTML, /json → JSON)
│   └── 📄 test.js          ← Requests both routes, logs headers + body
│
└── 📖 README.md            ← You are here
```

---

## 📂 Task Breakdown

---

### 📌 Task-1 — The Raw Body Validator
> *Stream handling & data validation*

| File | Role |
|------|------|
| `Server.js` | Native `http` server · listens on `POST /email` · reads raw stream chunks via `req.on('data')` & `req.on('end')` · validates `@` symbol · returns `400` or `200` |
| `test.js` | Sends a programmatic POST request with valid and invalid email payloads · logs server response |

```bash
node Task-1/Server.js      # terminal 1
node Task-1/test.js        # terminal 2
```

---

### 📌 Task-2 — The Core Config Reader
> *Zero-dependency configuration*

| File | Role |
|------|------|
| `Server.js` | Reads `PORT` from `.env` using Node.js v20+ native `--env-file` flag · starts server on `process.env.PORT` · logs port on boot |
| `test.js` | Confirms server responds on the configured port |

```bash
node --env-file=.env Task-2/Server.js    # terminal 1
node Task-2/test.js                      # terminal 2
```

> Requires a `.env` file at the project root with `PORT=5000`

---

### 📌 Task-3 — The Native Fetcher
> *External API communication*

| File | Role |
|------|------|
| `Server.js` | Native `http` server · `GET /api` route · uses built-in global `fetch()` (Node v18+) · awaits external API · parses and returns JSON |
| `test.js` | Hits `GET /api` and pretty-prints the external API response |

```bash
node Task-3/Server.js      # terminal 1
node Task-3/test.js        # terminal 2
```

---

### 📌 Task-4 — The CSV Appender
> *Local file persistence*

| File | Role |
|------|------|
| `Server.js` | `POST /log-user?name=Anas` · extracts name from query string · appends `name,\n` to `users.csv` using native `fs.appendFile` |
| `test.js` | Fires multiple POST requests with different names · reads and prints `users.csv` to verify entries |

```bash
node Task-4/Server.js      # terminal 1
node Task-4/test.js        # terminal 2
```

> `users.csv` is auto-generated in `Task-4/` on first run

---

### 📌 Task-5 — The Content-Type Router
> *Manual routing & response headers*

| File | Role |
|------|------|
| `Server.js` | Inspects `req.url` manually · `/` → `Content-Type: text/html` · `/json` → `Content-Type: application/json` · no framework, no router library |
| `test.js` | Requests both routes · logs status code, content-type header, and response body for each |

```bash
node Task-5/Server.js      # terminal 1
node Task-5/test.js        # terminal 2
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/algo-backend.git
cd algo-backend

# Run any task (no npm install needed)
node Task-1/Server.js

# Task 2 needs the env flag
node --env-file=.env Task-2/Server.js
```

**Requirements:**
- Node.js `v20+`
- No `node_modules`, no `package.json`, no installs

---

## 🧠 Concepts at a Glance

| Task | Core Concept | Key Native API |
|------|-------------|----------------|
| Task-1 | HTTP stream parsing | `req.on('data')` · `req.on('end')` |
| Task-2 | Zero-dependency config | `process.env` · `--env-file` |
| Task-3 | External API calls | Global `fetch()` |
| Task-4 | File system persistence | `fs.appendFile()` |
| Task-5 | Content-type routing | `req.url` · `res.writeHead()` |

---

## 📌 Notes

- Every `Task-*/` folder is **self-contained** — `Server.js` runs the server, `test.js` verifies it
- All servers use the **native `http` module only** — no Express, no Fastify, no frameworks
- Each task is a standalone unit — run them independently

---

<div align="center">

```
Zero dependencies. Maximum understanding.
```

⭐ **Star this repo** if it helped you understand Node.js from the ground up

</div>