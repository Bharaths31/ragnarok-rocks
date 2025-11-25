import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import type { Project, Handle, NewsTopic, Guide, ContactInfo } from '../types';

// Collections
const COLLECTIONS = {
  PROJECTS: 'projects',
  HANDLES: 'handles',
  TOPICS: 'news_topics',
  GUIDES: 'guides',
  CONTACT: 'contact_info'
};

// Generic Fetcher
export const fetchData = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};

// Specific Actions
export const addProject = async (project: Omit<Project, 'id'>) => addDoc(collection(db, COLLECTIONS.PROJECTS), project);
export const deleteProject = async (id: string) => deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));

export const addHandle = async (handle: Omit<Handle, 'id'>) => addDoc(collection(db, COLLECTIONS.HANDLES), handle);
export const deleteHandle = async (id: string) => deleteDoc(doc(db, COLLECTIONS.HANDLES, id));

export const addTopic = async (topic: Omit<NewsTopic, 'id'>) => addDoc(collection(db, COLLECTIONS.TOPICS), topic);
export const deleteTopic = async (id: string) => deleteDoc(doc(db, COLLECTIONS.TOPICS, id));

export const addGuide = async (guide: Omit<Guide, 'id'>) => addDoc(collection(db, COLLECTIONS.GUIDES), guide);
export const deleteGuide = async (id: string) => deleteDoc(doc(db, COLLECTIONS.GUIDES, id));

export const updateContactInfo = async (info: ContactInfo) => {
    // We'll store contact info in a single doc 'main' in 'contact_info' collection
    return setDoc(doc(db, COLLECTIONS.CONTACT, 'main'), info);
};

export const getContactInfo = async (): Promise<ContactInfo | null> => {
    try {
        const snapshot = await getDocs(collection(db, COLLECTIONS.CONTACT));
        if (!snapshot.empty) {
            return snapshot.docs[0].data() as ContactInfo;
        }
        return null;
    } catch (e) {
        return null;
    }
};
