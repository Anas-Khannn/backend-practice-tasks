// ============================================
// HTTP SERVER - Raw Body Validator
// ============================================

const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`\n📨 New Request Received`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  
  // LOGIC: Check if this is a POST request to /email route
  // If NOT, return 404 error
  if (req.method !== 'POST' || req.url !== '/email') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
    return;
  }

  // LOGIC: Create array to store incoming data chunks
  // Data comes in pieces, we collect all pieces here
  const chunks = [];
  
  // LOGIC: Listen for 'data' events
  // This fires EVERY TIME a chunk arrives from client
  // We push (add) each chunk to the chunks array
  req.on('data', (chunk) => {
    console.log(`📥 Data chunk received: ${chunk.length} bytes`);
    chunks.push(chunk);
  });

  // LOGIC: Listen for 'end' event
  // This fires ONCE when ALL chunks have been received
  // NOW it's safe to process the data
  req.on('end', () => {
    console.log(`✅ All data received`);
    
    try {
      // LOGIC: Merge all chunks into one Buffer
      // chunks = [chunk1, chunk2, chunk3]
      // Buffer.concat(chunks) = one big chunk
      const rawData = Buffer.concat(chunks);
      
      // LOGIC: Convert Buffer (raw bytes) to readable string
      // Buffer looks like: <Buffer 7b 22 65...>
      // String looks like: '{"email":"anas@gmail.com"}'
      const dataString = rawData.toString('utf8');
      console.log(`📄 Raw string data: ${dataString}`);
      
      // LOGIC: Convert JSON string to JavaScript object
      // Before: '{"email":"anas@gmail.com"}' (string)
      // After: { email: 'anas@gmail.com' } (object)
      // Now we can access: data.email
      const data = JSON.parse(dataString);
      console.log(`🔍 Parsed object:`, data);
      
      // LOGIC: Validate email
      // Check 1: Does email field exist?
      // Check 2: Does email contain @ symbol?
      // If EITHER check fails, email is INVALID
      if (!data.email || !data.email.includes('@')) {
        console.log(`❌ Validation failed: Invalid email`);
        
        // Send 400 status (Bad Request)
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid Email');
        return;
      }
      
      // LOGIC: Email is VALID (has @ symbol)
      // Send 200 status (Success)
      console.log(`✅ Validation passed: Email is valid`);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Email is valid');
      
    } catch (error) {
      // LOGIC: If JSON.parse() fails (malformed JSON)
      // Don't crash! Just send 400 error
      console.error(`⚠️  Error processing request:`, error.message);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON format');
    }
  });

  // LOGIC: Handle stream errors
  req.on('error', (error) => {
    console.error(`❌ Request error:`, error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  });
});

// LOGIC: Start the server on port 3000
// Port = like an apartment number on your computer
// localhost = your computer (127.0.0.1)
// Access it at: http://localhost:3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📍 Listening on port ${PORT}`);
  console.log(`\n💡 Test with: curl -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com"}' http://localhost:3000/email`);
});