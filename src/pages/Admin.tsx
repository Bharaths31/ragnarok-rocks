import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Access Denied: Invalid Coordinates");
    }
  };

  const addHandle = async (platform: string, username: string) => {
    // Auto-fetch logic happens on the frontend display, we just save the ID
    await addDoc(collection(db, "handles"), { platform, username });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 p-8 rounded-2xl bg-gray-200 dark:bg-gray-800">
          <h2 className="text-2xl font-bold">System Override // Login</h2>
          <input type="email" placeholder="Admin Email" onChange={e => setEmail(e.target.value)} className="p-3 rounded-lg" />
          <input type="password" placeholder="Passcode" onChange={e => setPassword(e.target.value)} className="p-3 rounded-lg" />
          <button type="submit" className="bg-accent-cyan text-black font-bold p-3 rounded-lg hover:scale-105 transition">Authenticate</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">Command Center</h1>
      {/* Add Tabs for: Projects, News Topics, Handles, Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-xl mb-4">Manage Handles</h3>
          {/* Form to add handle goes here */}
        </div>
        {/* Repeat for other sections */}
      </div>
    </div>
  );
}