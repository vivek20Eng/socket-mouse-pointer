const fs = require("fs");
const path = require("path");

const url = (process.env.SOCKET_SERVER_URL || "").trim() || null;
const out = path.join(__dirname, "..", "public", "env.js");
const content = `// Generated at build — do not edit manually
window.SOCKET_SERVER_URL = ${url ? JSON.stringify(url) : "null"};
`;

fs.writeFileSync(out, content);
console.log(
  url
    ? `[config] Socket server → ${url}`
    : "[config] Socket server → same origin (localhost / Render)"
);
