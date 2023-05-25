const express = require('express');
const session = require('express-session');
const app = express();

// Configure session middleware
app.use(
  session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
  })
);

// Define a route for the home page
app.get('/', (req, res) => {
  let licensePlates = [];
  const prefix = 'TEA-';

  // Generate license plates from TEA-001 to TEA-999
  for (let i = 1; i <= 999; i++) {
    let licensePlateNumber = i.toString().padStart(3, '0');
    licensePlates.push({ plate: prefix + licensePlateNumber, isOwned: false });
  }

  // Get the user input from the query parameters
  const userInput = req.query.license || '';

  // Get the ownership information from the session
  const ownedPlates = req.session.ownedPlates || [];

  // Mark the user's plate as owned
  if (userInput && !ownedPlates.includes(userInput.toLowerCase())) {
    ownedPlates.push(userInput.toLowerCase());
    req.session.ownedPlates = ownedPlates;
  }

  // Set the ownership status for license plates
  licensePlates.forEach((plate) => {
    plate.isOwned = ownedPlates.includes(plate.plate.toLowerCase());
  });

  // Render the license plates as tokens in rows
  const platesPerRow = 10; // Number of plates per row
  const tokenRows = [];
  for (let i = 0; i < licensePlates.length; i += platesPerRow) {
    const row = licensePlates.slice(i, i + platesPerRow);
    const tokenList = row
      .map((plate) => {
        // Determine the token's color based on ownership
        const tokenColor = plate.isOwned ? '#9aff9a' : '#ffcccc';
        return `<li class="token" style="background-color: ${tokenColor};">${plate.plate}</li>`;
      })
      .join('');
    tokenRows.push(`<ul class="token-row">${tokenList}</ul>`);
  }

  // Construct the HTML response
  const html = `
    <html>
      <head>
        <style>
          .token {
            display: inline-block;
            padding: 10px 15px;
            margin: 5px;
            border-radius: 20px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
          }
          
          .token-row {
            list-style-type: none;
            margin: 0;
            padding: 0;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>License Plates</h1>
        <form action="/" method="GET">
          <label for="license">License Plate:</label>
          <input type="text" id="license" name="license" value="${userInput}" pattern="[a-zA-Z]{3}-[0-9]{3}" title="Enter a license plate in the format abc-123" required>
          <button type="submit">Submit</button>
        </form>
        <br>
        ${tokenRows.join('<br>')}
      </body>
    </html>
  `;

  res.send(html);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});