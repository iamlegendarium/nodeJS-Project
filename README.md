# Node.js User Registration and Parcel Management API

A RESTful API built with Node.js for user registration and managing parcels. This API provides endpoints for user registration, login, email verification, and parcel management functionalities.

## Features

- **User Registration:** Create a new user account.
- **User Login:** Authenticate users and generate access tokens.
- **Email Verification:** Verify user email addresses.
- **Token Generation:** Generate authentication tokens for secure access.
- **Create Parcel:** Allow users to create new parcel entries.
- **Track Parcel:** Retrieve the status and details of parcels.
- **Update Parcel:** Modify existing parcel information.

## Requirements

- Node.js >= 14.x
- npm (Node Package Manager)
- MongoDB (or any other supported database)
- Postman or similar tool for testing APIs

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/iamlegendarium/nodeJS-Project.git
   cd nodeJS-Project
   ```

2. **Install Dependencies: Make sure you have npm installed, then run:**

   ```bash
   npm install
   ```

3. **Create Environment Variables:**
   ## Create a .env file. Update the environment variables with your configurations. with
   ```bash
   -PORT
   -URI
   -SECRET
   -EMAIL
   -PASSWORD
    ```

4. **Install and Start the Server using nodemon: To start the server, run:**
    ```bash
    npm install -g nodemon 
    npm start
    ```

5. **Testing the API: Use Postman, ThunderClient or a similar tool to test the API endpoints.**
    ````bash
    API Endpoints
    ##User Registration

    Endpoint: POST /api/register
    Description: Register a new user.

    Request Body:
    {
    "firstName": "User Name",
    "lastName": "User Name",
    "email": "user@example.com",
    "password": "password123"
    }

    ##User Login

    Endpoint: POST /api/login
    Description: Log in a user and generate an authentication token.
    Request Body:

    {
  "email": "user@example.com",
  "password": "password123"
    }

    ##Email Verification

    Endpoint: GET '/api/verify?token='
    Description: Verify user email using a verification token.
    Query Params:
    token: The verification token sent to the user's email.

    ##Generate Authentication Token
    Endpoint: POST /api/token
    Description: Generate an authentication token for a logged-in user.

    ##Create Parcel
    Endpoint: POST /api/parcels
    Description: Create a new parcel.
    Request Body:
    
    {
   "origin": "Los Angeles",
   "destination": "New York",
   "senderName": "John Doe",
   "senderPhone": "1234567890",
   "receiverName": "Jane Smith",
   "receiverPhone": "0987654321",
   "receiverAddress": "123 Main Street, New York, NY"
    }

    ##Track Parcel

    Endpoint: GET /api/parcels/:trackingNumber
    Description: Retrieve details and status of a specific parcel.

    ##Update Parcel

    Endpoint: PUT /api/parcels/:id
    Description: Update existing parcel information.
    Request Body:

    {
    "status": "In-Transit",
    "location"" "New-Location"
    }
    ```

**License**
This project is licensed under the MIT License.

**Author**
AREGBESOLA JOHN BELOVED
+2348118870050

