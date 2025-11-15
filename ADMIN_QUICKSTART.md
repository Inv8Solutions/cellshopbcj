# Admin Authentication - Quick Start Guide

## What Was Added

### 1. Admin Login Page (`/admin/login`)
- Located at: `src/app/admin/login/page.tsx`
- Features:
  - Email and password authentication
  - Firebase integration
  - Role verification (admin only)
  - Password visibility toggle
  - Error handling
  - Redirect to `/admin` on success

### 2. Protected Admin Route (`/admin`)
- Updated: `src/app/admin/page.tsx`
- Features:
  - Authentication check on page load
  - Automatic redirect to `/admin/login` if not authenticated
  - Automatic redirect if user is not an admin
  - Loading state while checking auth
  - Logout functionality

### 3. Admin Setup Page (`/setup-admin`)
- Located at: `src/app/setup-admin/page.tsx`
- **⚠️ DELETE THIS PAGE AFTER CREATING YOUR ADMIN USER**
- Use this to create your first admin user

### 4. Helper Files
- `src/firebase/createAdmin.ts` - Utility function for creating admin users
- `src/middleware/adminAuth.ts` - Authentication helper
- `ADMIN_SETUP.md` - Detailed setup instructions

## Quick Setup (5 minutes)

### Step 1: Create Your First Admin
Visit: `http://localhost:3000/setup-admin`

Enter:
- Name: `Admin User`
- Email: `admin@cellshopbcj.com` (or your preferred email)
- Password: Your secure password (min 6 characters)

Click "Create Admin User"

### Step 2: Login
**Multiple ways to access admin login:**

1. **Keyboard Shortcut** (Fastest): Press `Ctrl + Shift + A` (or `Cmd + Shift + A` on Mac)
2. **Footer Clicks** (Hidden): Click the copyright text in footer 5 times rapidly
3. **Secret URL**: Visit `http://localhost:3000/bjmp-admin-portal`
4. **Direct URL**: Visit `http://localhost:3000/admin/login`

Use the credentials you just created to login.

### Step 3: Delete Setup Page
**IMPORTANT:** Delete the file:
```
src/app/setup-admin/page.tsx
```

This is a security measure to prevent unauthorized admin creation.

---

## 🔐 Hidden Access Methods

The admin login is intentionally hidden from public view. Here are the ways to access it:

### Method 1: Keyboard Shortcut ⌨️
**Press:** `Ctrl + Shift + A` (Windows/Linux) or `Cmd + Shift + A` (Mac)
- Works on any page
- Instant access
- **Recommended for daily use**

### Method 2: Secret Footer Click 👆
**Click:** The copyright text in the footer **5 times** rapidly (within 2 seconds)
- Look for: "© 2025 Bureau of Jail Management and Penology..."
- Hover to see remaining clicks
- Fun and discreet

### Method 3: Secret URL 🔗
**Visit:** `/bjmp-admin-portal`
- Full URL: `http://localhost:3000/bjmp-admin-portal`
- Redirects to admin login
- Easy to bookmark and share

### Method 4: Direct URL 🎯
**Visit:** `/admin/login`
- Full URL: `http://localhost:3000/admin/login`
- Direct access if you know the URL

**See full details:** Check `ADMIN_HIDDEN_ACCESS.md` for complete documentation

---

## How It Works

1. **Login Flow:**
   - User enters email/password at `/admin/login`
   - Firebase authenticates the user
   - System checks Firestore for user document
   - Verifies `role` field equals "admin"
   - Redirects to `/admin` if verified
   - Shows error if not admin

2. **Route Protection:**
   - `/admin` checks authentication on every visit
   - Uses Firebase `onAuthStateChanged` listener
   - Verifies admin role from Firestore
   - Redirects to login if not authenticated or not admin
   - Shows loading spinner during verification

3. **Logout:**
   - Click "Logout" button in sidebar
   - Signs out from Firebase
   - Clears local storage
   - Redirects to `/admin/login`

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx          # Admin login page
│   │   └── page.tsx               # Protected admin dashboard
│   └── setup-admin/
│       └── page.tsx               # Setup page (DELETE AFTER USE)
├── firebase/
│   ├── config.js                  # Firebase configuration
│   └── createAdmin.ts             # Admin creation utility
└── middleware/
    └── adminAuth.ts               # Auth helper functions
```

## Testing

1. **Test Login:**
   ```
   URL: http://localhost:3000/admin/login
   Email: (your admin email)
   Password: (your admin password)
   ```

2. **Test Protection:**
   - Try visiting `/admin` without logging in → Should redirect to `/admin/login`
   - Login with regular user (non-admin) → Should show error
   - Login with admin user → Should access dashboard

3. **Test Logout:**
   - Login as admin
   - Click "Logout" button
   - Should redirect to login page
   - Try accessing `/admin` → Should redirect to login

## Security Best Practices

✅ **Implemented:**
- Firebase Authentication
- Role-based access control (RBAC)
- Firestore role verification
- Secure password requirements (min 6 chars)
- Automatic session handling

📋 **Recommended Next Steps:**
1. Add Firestore Security Rules (see ADMIN_SETUP.md)
2. Delete `/setup-admin` page after use
3. Use strong passwords for admin accounts
4. Consider adding 2FA in the future
5. Monitor admin access logs

## Troubleshooting

**Problem:** Can't login
- **Solution:** Check Firebase console → Authentication for user
- Verify user has document in Firestore `users` collection
- Ensure `role: "admin"` is set

**Problem:** Redirects to login immediately
- **Solution:** User doesn't have admin role
- Go to Firestore → users → [user UID] → set role to "admin"

**Problem:** Page shows loading forever
- **Solution:** Check browser console for errors
- Verify Firebase config is correct
- Check network tab for failed requests

## Need Help?

Check the detailed guide: `ADMIN_SETUP.md`

## Summary

✅ Admin login page created
✅ Admin route protected
✅ Role-based access control implemented
✅ Logout functionality added
✅ Setup utility page created

**Next:** Visit `/setup-admin` to create your first admin user!
