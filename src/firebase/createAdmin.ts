// Admin Setup Utility
// This script helps you create an admin user in Firebase

import { auth, db } from './config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Creates an admin user in Firebase Authentication and Firestore
 * 
 * @param email - Admin email address
 * @param password - Admin password (minimum 6 characters)
 * @param name - Admin display name
 */
export async function createAdminUser(email: string, password: string, name: string) {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✓ User created in Authentication');

    // Create admin user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      name: name,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✓ Admin user document created in Firestore');
    console.log('\nAdmin user created successfully!');
    console.log('Email:', email);
    console.log('UID:', user.uid);
    console.log('\nYou can now login at: /admin/login');

    return { success: true, uid: user.uid };
  } catch (error: any) {
    console.error('Error creating admin user:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\nThis email is already registered. If you need to make this user an admin, update their role in Firestore.');
    } else if (error.code === 'auth/weak-password') {
      console.log('\nPassword should be at least 6 characters.');
    }
    
    return { success: false, error: error.message };
  }
}

// Example usage (uncomment and modify these values):
// createAdminUser('admin@cellshopbcj.com', 'admin123456', 'Admin User');
