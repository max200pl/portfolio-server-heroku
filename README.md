# Portfolio Backend

## 📌 Description

This backend is responsible for handling authentication, user session management, and API endpoints for my portfolio project. It integrates with **Firebase Authentication** to verify users and manages stored portfolio data using **MongoDB**.

---

## 🛠 Technology Stack

- **Backend**: Node.js, Express.js  
- **Authentication**: Firebase Authentication (Google, GitHub)  
- **Database**: MongoDB  
- **Session Management**: JSON Web Tokens (JWT)  

---

## 🔄 Authentication Flow

```mermaid
sequenceDiagram
    autonumber

    actor User
    participant Browser (React)
    participant Firebase
    participant Backend

    rect rgb(240, 240, 240)
        Note left of User: 🚀 **Step 1**<br>User visits the website or refreshes the page
        User->>Browser (React): 🌐 Opens the page (App starts loading)
    end

    rect rgb(235, 235, 235)
        Note over Browser (React): 🔄 **Step 2**<br>Trying to restore user session from localStorage
        Browser (React)->>Browser (React): 📦 localStorage.getItem("user")
    end

    rect rgb(230, 230, 230)
        Note over Browser (React): 🔍 **Step 3**<br>Checking if the user is authenticated with Firebase
        Browser (React)->>Firebase: 🔑 onAuthStateChanged(auth)
        Firebase-->>Browser (React): 🔄 Returns firebaseUser (or `null`)
    end

    alt firebaseUser == null
        Note over Browser (React): ⚠️ No authenticated user found
        Browser (React)->>Browser (React): ❌ setUser(null)
        Browser (React)->>Browser (React): 🗑 localStorage.removeItem("user")
    else firebaseUser != null
        Note over Browser (React): ✅ User detected! Requesting ID token...
        Browser (React)->>Firebase: 🔑 getIdToken()
        Firebase-->>Browser (React): 🔐 idToken

        Note over Browser (React): 🔄 **Step 4**<br>Verifying token & fetching profile from backend
        Browser (React)->>Backend: 🔍 fetchUserProfile(idToken)
        Backend->>Backend: 🔎 Verify token (Admin SDK / verifyIdToken)
        alt Token is valid
            Backend-->>Browser (React): 🎉 userProfile (role, email, etc.)
            Browser (React)->>Browser (React): ✅ setUser(userProfile)
            Browser (React)->>Browser (React): 💾 localStorage.setItem("user", userProfile)
        else Token expired / error
            Backend-->>Browser (React): ⛔ 401 Unauthorized (or error)
            Browser (React)->>Firebase: 🔄 firebaseSignOut(auth)
            Browser (React)->>Browser (React): ❌ setUser(null), 🗑 localStorage.removeItem("user")
        end
    end

    Note right of Browser (React): 🎨 **Step 5**<br>UI updates based on authentication state
```

---

## 📂 Project Structure

```
/backend
│── config/
│   ├── firebase.js  # Firebase Admin SDK setup
│   ├── database.js  # MongoDB connection
│── routes/
│   ├── auth.js      # Authentication routes (login, logout)
│   ├── user.js      # User profile management
│── models/
│   ├── User.js      # Mongoose schema for user data
│── middleware/
│   ├── authMiddleware.js  # Middleware to verify JWT tokens
│── server.js        # Main Express server entry point
│── package.json     # Dependencies and scripts
```

---

## 🚀 API Endpoints

### 🔐 Authentication

#### ✅ Verify Token
**POST** `/api/auth/verify`  
Verifies the Firebase ID token and returns user data.  

**Request:**  
```json
{
  "idToken": "eyJhbGciOiJI..."
}
```
**Response:**  
```json
{
  "user": {
    "id": "123456",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

---

### 👤 User Profile

#### 📄 Get User Profile
**GET** `/api/user/profile`  
Returns the logged-in user's profile information.  

**Headers:**  
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```
**Response:**  
```json
{
  "id": "123456",
  "name": "John Doe",
  "email": "user@example.com",
  "role": "admin"
}
```

---

## 📜 Installation & Setup

1️⃣ **Clone the repository**  
```bash
git clone https://github.com/yourusername/portfolio-backend.git
cd portfolio-backend
```

2️⃣ **Install dependencies**  
```bash
npm install
```

3️⃣ **Set up environment variables** (`.env`)  
```
PORT=5000
MONGO_URI=mongodb+srv://your_mongo_url
FIREBASE_CREDENTIALS=path/to/serviceAccountKey.json
JWT_SECRET=your_jwt_secret
```

4️⃣ **Run the server**  
```bash
npm start
```

Server will be running on **http://localhost:5000** 🚀  

---

## 🔗 Useful Links

1. 🔗 [Firebase Authentication Docs](https://firebase.google.com/docs/auth)  
2. 🛠 [Express.js Docs](https://expressjs.com/)  
3. 🛢 [MongoDB Mongoose Docs](https://mongoosejs.com/docs/)  
4. 🔑 [JWT Token Guide](https://jwt.io/)  
