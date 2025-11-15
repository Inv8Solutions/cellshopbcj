# Admin Authentication Setup

## Overview
The admin panel at `/admin` is now protected and requires admin authentication. Only users with the `admin` role in Firestore can access the admin dashboard.

## Setting Up Your First Admin User

### Method 1: Using Firebase Console (Recommended)

1. **Create the user in Firebase Authentication:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `cellshopbcj`
   - Navigate to Authentication > Users
   - Click "Add User"
   - Enter email: `admin@cellshopbcj.com` (or your preferred email)
   - Enter password (minimum 6 characters)
   - Copy the UID of the created user

2. **Add admin role in Firestore:**
   - Navigate to Firestore Database
   - Go to the `users` collection
   - Click "Add Document"
   - Document ID: Use the UID from step 1
   - Add fields:
     ```
     uid: [the UID]
     email: admin@cellshopbcj.com
     name: Admin User
     role: admin
     createdAt: [current timestamp]
     updatedAt: [current timestamp]
     ```

### Method 2: Using the Utility Script

1. Open `src/firebase/createAdmin.ts`
2. Uncomment the last line and modify with your admin details:
   ```typescript
   createAdminUser('admin@cellshopbcj.com', 'YourSecurePassword123', 'Admin Name');
   ```
3. Create a temporary page to run this (e.g., `/setup-admin`)
4. Visit the page once to create the admin
5. Delete the page after setup

### Method 3: Manually in Firestore

If you already have a user account:
1. Go to Firestore Database > users collection
2. Find your user document by UID
3. Add or update the field: `role: "admin"`

## Access Control

### Protected Routes
- `/admin` - Admin dashboard (requires admin authentication)
- `/admin/login` - Admin login page (public)

### How It Works
1. User visits `/admin`
2. System checks if user is authenticated with Firebase Auth
3. System verifies the user has `role: "admin"` in Firestore
4. If not authenticated or not admin, redirect to `/admin/login`
5. If authenticated and admin, show admin dashboard

### Login Process
1. Go to `/admin/login`
2. Enter admin email and password
3. System authenticates with Firebase
4. System checks if user has admin role in Firestore
5. If admin, redirect to `/admin` dashboard
6. If not admin, show error message

## Security Features

- ✅ Firebase Authentication integration
- ✅ Role-based access control (RBAC)
- ✅ Firestore security rules (recommended)
- ✅ Session persistence
- ✅ Secure logout functionality

## Recommended Firestore Security Rules

Add these rules to protect your admin data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || isAdmin();
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Public read
      allow write: if isAdmin(); // Only admins can write
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.userId || isAdmin());
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }
  }
}
```

## Troubleshooting

### Can't Access Admin Panel
- Make sure you're logged in
- Verify your user document in Firestore has `role: "admin"`
- Check browser console for error messages
- Try logging out and logging back in

### Login Fails
- Verify email and password are correct
- Check if user exists in Firebase Authentication
- Ensure the user has a document in the `users` collection
- Verify the `role` field is set to "admin"

### Redirects to Login Immediately
- This means you don't have admin privileges
- Check Firestore `users` collection for your user document
- Ensure `role: "admin"` is set correctly

## Testing

Test credentials format:
- Email: `admin@cellshopbcj.com`
- Password: (set your secure password)

## Next Steps

1. Create your admin user using one of the methods above
2. Test login at `/admin/login`
3. Access admin dashboard at `/admin`
4. Set up Firestore security rules
5. Create additional admin users as needed
