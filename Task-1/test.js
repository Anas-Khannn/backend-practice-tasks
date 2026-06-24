// ============================================
// TEST CLIENT - Send requests to server
// ============================================

const http = require('http');

// LOGIC: Helper function to send requests
// This function will be called 5 times with different data
function makeRequest(data, description) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST: ${description}`);
  console.log(`Sending: ${JSON.stringify(data)}`);
  console.log('='.repeat(60));

  // LOGIC: Configure the request
  // This tells Node.js where and how to send the data
  const options = {
    hostname: 'localhost',        // Connect to your computer
    port: 3000,                   // Use port 3000 (where server is listening)
    path: '/email',               // Send to /email route
    method: 'POST',               // Send as POST request
    headers: {
      'Content-Type': 'application/json',  // We're sending JSON
      'Content-Length': JSON.stringify(data).length  // How many bytes we're sending
    }
  };

  // LOGIC: Make the request
  // Callback fires when response is received
  const req = http.request(options, (res) => {
    let responseData = '';
    
    // LOGIC: Listen for response data chunks
    // Response also comes in chunks, accumulate them
    res.on('data', (chunk) => {
      responseData += chunk;  // Add chunk to responseData string
    });

    // LOGIC: When response is complete
    // Check the status code to see if test passed
    res.on('end', () => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Response: ${responseData}`);
      
      // LOGIC: Check result
      // 200 = server accepted the email as valid
      // Anything else = server rejected it
      if (res.statusCode === 200) {
        console.log('✅ PASS');
      } else {
        console.log('❌ FAIL');
      }
    });
  });

  // LOGIC: Error handling
  // If request fails, catch the error
  req.on('error', (error) => {
    console.error('Request error:', error);
  });

  // LOGIC: Send the data to server
  // JSON.stringify() converts object to JSON string
  // req.write() sends it
  // req.end() finishes the request
  req.write(JSON.stringify(data));
  req.end();
}

// LOGIC: Run all tests with delays
// setTimeout delays execution so server has time between requests
// Each test waits a bit longer (500ms apart)

setTimeout(() => {
  console.log('\n\n📊 RUNNING TEST SUITE\n');
  
  // TEST 1: Valid email with @ symbol
  // Expected: 200 OK ✅
  makeRequest(
    { email: 'anas@gmail.com' },
    'Valid Email (should return 200)'
  );

  // TEST 2: Invalid email missing @ symbol
  // Expected: 400 Bad Request ❌
  setTimeout(() => {
    makeRequest(
      { email: 'anasgmail.com' },
      'Invalid Email - Missing @ (should return 400)'
    );
  }, 500);

  // TEST 3: Invalid email empty string
  // Expected: 400 Bad Request ❌
  setTimeout(() => {
    makeRequest(
      { email: '' },
      'Invalid Email - Empty (should return 400)'
    );
  }, 1000);

  // TEST 4: Valid email with multiple @ symbols
  // Expected: 200 OK ✅ (has @ symbol)
  setTimeout(() => {
    makeRequest(
      { email: 'john@@example.com' },
      'Email with Multiple @ (should return 200)'
    );
  }, 1500);

  // TEST 5: No email field at all
  // Expected: 400 Bad Request ❌
  setTimeout(() => {
    makeRequest(
      { name: 'John' },
      'No Email Field (should return 400)'
    );
  }, 2000);

}, 1000);  // Wait 1 second before starting tests