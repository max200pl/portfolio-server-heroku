---
config:
  theme: dark
---
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
        Note over Browser (React): 🔍 **Step 3**<br>Checking if the user is already authenticated with Firebase
        Browser (React)->>Firebase: 🔑 onAuthStateChanged(auth)
        Firebase-->>Browser (React): 🔄 Returns firebaseUser (or `null`)
    end
    alt firebaseUser == null
        Note over Browser (React): ⚠️ No authenticated user found in Firebase
        Browser (React)->>Browser (React): ❌ setUser(null)
        Browser (React)->>Browser (React): 🗑 localStorage.removeItem("user")
    else firebaseUser != null
        Note over Browser (React): ✅ User detected!<br>Requesting ID token...
        Browser (React)->>Firebase: 🔑 getIdToken()
        Firebase-->>Browser (React): 🔐 idToken
        Note over Browser (React): 🔄 **Step 4**<br>Validating token and fetching user profile from backend
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
    Note right of Browser (React): 🎨 **Step 5**<br>UI dynamically updates based on the authenticated user (or lack thereof)
