# Airline Project - Bug Fixes & Features Summary

## Issues Fixed

### 1. ✅ City Search Suggestions
**Problem**: Users couldn't get city suggestions while typing in "from" and "to" fields.

**Solution**:
- Added a new endpoint `/api/cities/search?query=<partial_city_name>` that returns matching cities
- Returns up to 10 results that start with the query (case-insensitive)
- Removes duplicates automatically

**Frontend Usage**:
```javascript
// When user types in the search field
const searchCities = async (query) => {
  const response = await fetch(`/api/cities/search?query=${query}`);
  const cities = await response.json();
  // Display suggestions
};
```

### 2. ✅ Recent Searches
**Problem**: Recent searches were not tracked or displayed.

**Solution**:
- Added `recentSearches` field to Passenger model
- Each search stores `from`, `to`, and `searchDate`
- Stores up to 10 most recent unique searches
- Removes duplicate searches automatically

**New Endpoints**:
- **POST** `/api/searches/recent?username=<username>&from=<city>&to=<city>` - Save a search
- **GET** `/api/searches/recent?username=<username>` - Get recent searches
- **DELETE** `/api/searches/recent?username=<username>` - Clear recent searches

**Frontend Usage**:
```javascript
// Save a search
const saveSearch = async (username, from, to) => {
  const response = await fetch('/api/searches/recent', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokenFromLogin}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
};

// Get recent searches
const getRecentSearches = async (username) => {
  const response = await fetch(`/api/searches/recent?username=${username}`, {
    headers: {
      'Authorization': `Bearer ${tokenFromLogin}`
    }
  });
  const searches = await response.json();
};
```

### 3. ✅ Auto-Logout Issue (Session Management)
**Problem**: Users were automatically logged out when navigating between screens.

**Solution**: 
- Implemented JWT (JSON Web Token) authentication
- Tokens are valid for 7 days
- Tokens must be sent in the `Authorization` header as `Bearer <token>`
- Added authentication middleware to protect routes from unauthorized access

**Updated Authentication Endpoints**:
- **Admin Login**: `GET /api/admin/authenticate?username=<>&password=<>`
  - Returns: `{ isAuthenticated: true, token: "...", username: "...", role: "admin" }`
  
- **Passenger Login**: `GET /api/passenger/authenticate?username=<>&password=<>`
  - Returns: `{ isAuthenticated: true, token: "...", username: "...", role: "passenger", name: "...", email: "..." }`

**Frontend Implementation**:
```javascript
// On login
const login = async (username, password) => {
  const response = await fetch(`/api/passenger/authenticate?username=${username}&password=${password}`);
  const data = await response.json();
  
  if (data.isAuthenticated) {
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    // User remains logged in across page navigation
  }
};

// For all subsequent requests
const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};
```

## Installation Instructions

1. **Install JWT package**:
   ```bash
   npm install jsonwebtoken
   ```

2. **Set JWT Secret** (Optional - add to `.env`):
   ```
   JWT_SECRET=your_super_secret_key_here
   ```
   If not set, it will use a default key (secure it in production!)

3. **Restart the server**:
   ```bash
   npm run dev
   ```

## Protected Routes (Require JWT Token)

These endpoints now require authentication:
- All `/passengers/:id` endpoints
- `/bookings/confirmed/:id`
- `/bookings/completed/:id`
- `/bookings/cancelled/:id`
- `/searches/recent` (all methods)

## Frontend Changes Needed

### 1. Update Console/Terminal
After login, store and use the token:
```javascript
// After successful login
const token = data.token;
sessionStorage.setItem('token', token);

// Use it in all protected requests
fetch('/api/bookings/confirmed/userId', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 2. Handle Expired Tokens
```javascript
// If 401 response, redirect to login
if (response.status === 401) {
  sessionStorage.clear();
  window.location.href = '/login'; // Redirect to login page
}
```

## Testing with cURL

```bash
# Login
curl "http://localhost:3000/api/passenger/authenticate?username=user1&password=pass123"

# Use token in request
curl -H "Authorization: Bearer <token_from_login>" \
  "http://localhost:3000/api/searches/recent?username=user1"

# Search cities
curl "http://localhost:3000/api/cities/search?query=new"
```

## Files Modified

1. ✅ `airline.model.js` - Added recentSearches to Passenger schema
2. ✅ `airline.controller.js` - Added city search and recent search functions, JWT auth
3. ✅ `airline.route.js` - Added routes and authentication middleware
4. ✅ `package.json` - Added jsonwebtoken dependency
5. ✨ `authMiddleware.js` - New file with JWT verification middleware

---

**Note**: Update your frontend to use the Bearer token in the Authorization header to prevent auto-logout on navigation!
