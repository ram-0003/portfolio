import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  getDocFromServer,
  where
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  defaultSiteSettings, 
  defaultServices, 
  defaultProjects, 
  defaultCaseStudies, 
  defaultBlogPosts, 
  defaultSkills 
} from "../data/defaultData";
import { Project, Service, Skill, BlogPost, CaseStudy, SiteSettings, ContactMessage } from "../types";

import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);

// Uploads a standard File or Blob to Firebase Storage and returns the permanent secure download URL
export async function uploadImage(file: File | Blob, filePath: string): Promise<string> {
  const storageRef = ref(storage, filePath);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

// Helper to race a Firestore promise against a timeout.
// This prevents slow network connections or offline status from blocking page rendering.
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      console.warn(`Firestore operation timed out after ${timeoutMs}ms, using offline fallback defaults.`);
      resolve(fallback);
    }, timeoutMs);
  });
  
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer);
    return result;
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}

// Critical constraint checking connection, run non-blocking in background
function testConnection() {
  setTimeout(async () => {
    try {
      await getDocFromServer(doc(db, "test", "connection"));
    } catch (error) {
      if (error instanceof Error && error.message.includes("offline")) {
        console.warn("Please check your Firebase configuration: Firestore client reports offline.");
      } else {
        console.log("Firebase connection responds ok.");
      }
    }
  }, 100);
}
testConnection();

// Helper to create clean, human-readable slugified string IDs for Firestore documents
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")           // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars except -
    .replace(/\-\-+/g, "-")         // Replace multiple - with single -
    .trim();
}

// Active Database Duplicate Purge Module
async function cleanDuplicateDocs(collectionName: string, identityField: string): Promise<void> {
  try {
    const snap = await getDocs(collection(db, collectionName));
    if (snap.empty) return;
    
    const seen = new Map<string, string>(); // key -> docId
    const deletePromises: Promise<any>[] = [];
    
    // Sort so we can keep older or deterministic entries if available, or just standard processing
    snap.docs.forEach(docSnap => {
      const data = docSnap.data();
      const identityValue = (data[identityField] || "").toString().toLowerCase().trim();
      if (!identityValue) return;
      
      if (seen.has(identityValue)) {
        // Delete redundant duplicate document matching on title/name
        deletePromises.push(deleteDoc(doc(db, collectionName, docSnap.id)));
        console.log(`[Self-Healing] Deleting duplicate in collection "${collectionName}": ID is "${docSnap.id}"`);
      } else {
        seen.set(identityValue, docSnap.id);
      }
    });
    
    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
      console.log(`[Self-Healing] Successfully purged ${deletePromises.length} duplicates from Firestore folder "${collectionName}".`);
    }
  } catch (err) {
    console.warn(`[Self-Healing] Duplicates check skipped or restricted for "${collectionName}":`, err);
  }
}

// Dynamic Idempotent Seeding Module: Seeds the data on-demand if collections are empty,
// and heals existing collection tables by purging any duplicate copies of default data.
export async function seedDatabaseIfEmpty() {
  try {
    // 1. Run automatic de-duplication first to cleanse redundant random-id copies
    await Promise.all([
      cleanDuplicateDocs("services", "title"),
      cleanDuplicateDocs("projects", "title"),
      cleanDuplicateDocs("caseStudies", "title"),
      cleanDuplicateDocs("blogPosts", "title"),
      cleanDuplicateDocs("skills", "name")
    ]);

    const siteSettingsRef = doc(db, "siteSettings", "default");
    
    const [
      siteSettingsSnap,
      servicesSnap,
      projectsSnap,
      caseStudiesSnap,
      blogSnap,
      skillsSnap
    ] = await Promise.all([
      getDoc(siteSettingsRef),
      getDocs(collection(db, "services")),
      getDocs(collection(db, "projects")),
      getDocs(collection(db, "caseStudies")),
      getDocs(collection(db, "blogPosts")),
      getDocs(collection(db, "skills"))
    ]);

    const writePromises: Promise<any>[] = [];

    if (!siteSettingsSnap.exists()) {
      writePromises.push(
        setDoc(siteSettingsRef, defaultSiteSettings).then(() => {
          console.log("Seeding Success: siteSettings loaded into Firestore.");
        })
      );
    }

    // 2. Load and create using Idempotent write keys (setDoc with Deterministic Slug IDs)
    // This perfectly prevents race condition duplicates of standard items in future boots.
    if (servicesSnap.empty) {
      defaultServices.forEach(service => {
        const docId = slugify(service.title);
        writePromises.push(
          setDoc(doc(db, "services", docId), service)
        );
      });
      console.log("Seeding Schedule: services loaded into Firestore.");
    }

    if (projectsSnap.empty) {
      defaultProjects.forEach(project => {
        const docId = slugify(project.title);
        writePromises.push(
          setDoc(doc(db, "projects", docId), project)
        );
      });
      console.log("Seeding Schedule: projects loaded into Firestore.");
    }

    if (caseStudiesSnap.empty) {
      defaultCaseStudies.forEach(study => {
        const docId = slugify(study.title);
        writePromises.push(
          setDoc(doc(db, "caseStudies", docId), study)
        );
      });
      console.log("Seeding Schedule: caseStudies loaded into Firestore.");
    }

    if (blogSnap.empty) {
      defaultBlogPosts.forEach(post => {
        const docId = slugify(post.title);
        writePromises.push(
          setDoc(doc(db, "blogPosts", docId), post)
        );
      });
      console.log("Seeding Schedule: blogPosts loaded into Firestore.");
    }

    if (skillsSnap.empty) {
      defaultSkills.forEach(skill => {
        const docId = slugify(skill.name);
        writePromises.push(
          setDoc(doc(db, "skills", docId), skill)
        );
      });
      console.log("Seeding Schedule: skills loaded into Firestore.");
    }

    if (writePromises.length > 0) {
      await Promise.all(writePromises);
      console.log("All missing collections seeded with deterministic IDs successfully.");
    }

  } catch (e) {
    console.warn("Seeding skipped or restricted (normal when rules are active or offline):", e);
  }
}

// ---------------------- FIRESTORE ACCESSORS ----------------------

// Site Settings with 1200ms quick-race timeout
export async function getSiteSettings(): Promise<SiteSettings> {
  const fetchPromise = (async () => {
    try {
      const snap = await getDoc(doc(db, "siteSettings", "default"));
      if (snap.exists()) {
        return snap.data() as SiteSettings;
      }
    } catch (e) {
      console.error("Firestore settings exception:", e);
    }
    return defaultSiteSettings;
  })();
  return withTimeout(fetchPromise, 1200, defaultSiteSettings);
}

export async function updateSiteSettings(settings: SiteSettings): Promise<void> {
  await setDoc(doc(db, "siteSettings", "default"), settings);
}

// Services
export async function getServices(): Promise<Service[]> {
  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(query(collection(db, "services"), orderBy("order", "asc")));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
        const seen = new Set<string>();
        return items.filter(item => {
          const key = item.title?.toLowerCase().trim();
          if (!key) return true;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
    } catch (e) {
      console.error("Firestore service exception:", e);
    }
    return defaultServices;
  })();
  return withTimeout(fetchPromise, 1200, defaultServices);
}

export async function addService(service: Omit<Service, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "services"), service);
  return docRef.id;
}

export async function updateService(id: string, service: Partial<Service>): Promise<void> {
  await updateDoc(doc(db, "services", id), service as any);
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, "services", id));
}

// Projects
export async function getProjects(): Promise<Project[]> {
  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(query(collection(db, "projects"), orderBy("createdAt", "desc")));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        const seen = new Set<string>();
        return items.filter(item => {
          const key = item.title?.toLowerCase().trim();
          if (!key) return true;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
    } catch (e) {
      console.error("Firestore projects exception:", e);
    }
    return defaultProjects;
  })();
  return withTimeout(fetchPromise, 1200, defaultProjects);
}

export async function addProject(project: Omit<Project, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "projects"), project);
  return docRef.id;
}

export async function updateProject(id: string, project: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, "projects", id), project as any);
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(query(collection(db, "blogPosts"), orderBy("createdAt", "desc")));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
        const seen = new Set<string>();
        return items.filter(item => {
          const key = item.title?.toLowerCase().trim();
          if (!key) return true;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
    } catch (e) {
      console.error("Firestore blogs exception:", e);
    }
    return defaultBlogPosts;
  })();
  return withTimeout(fetchPromise, 1200, defaultBlogPosts);
}

export async function addBlogPost(post: Omit<BlogPost, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "blogPosts"), post);
  return docRef.id;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<void> {
  await updateDoc(doc(db, "blogPosts", id), post as any);
}

export async function deleteBlogPost(id: string): Promise<void> {
  await deleteDoc(doc(db, "blogPosts", id));
}

// Case Studies
export async function getCaseStudies(): Promise<CaseStudy[]> {
  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(query(collection(db, "caseStudies"), orderBy("createdAt", "desc")));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as CaseStudy));
        const seen = new Set<string>();
        return items.filter(item => {
          const key = item.title?.toLowerCase().trim();
          if (!key) return true;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
    } catch (e) {
      console.error("Firestore case studies exception:", e);
    }
    return defaultCaseStudies;
  })();
  return withTimeout(fetchPromise, 1200, defaultCaseStudies);
}

export async function addCaseStudy(study: Omit<CaseStudy, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "caseStudies"), study);
  return docRef.id;
}

export async function updateCaseStudy(id: string, study: Partial<CaseStudy>): Promise<void> {
  await updateDoc(doc(db, "caseStudies", id), study as any);
}

export async function deleteCaseStudy(id: string): Promise<void> {
  await deleteDoc(doc(db, "caseStudies", id));
}

// Skills
export async function getSkills(): Promise<Skill[]> {
  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(query(collection(db, "skills"), orderBy("order", "asc")));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill));
        const seen = new Set<string>();
        return items.filter(item => {
          const key = item.name?.toLowerCase().trim();
          if (!key) return true;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
    } catch (e) {
      console.error("Firestore skills exception:", e);
    }
    return defaultSkills;
  })();
  return withTimeout(fetchPromise, 1200, defaultSkills);
}

export async function addSkill(skill: Omit<Skill, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "skills"), skill);
  return docRef.id;
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<void> {
  await updateDoc(doc(db, "skills", id), skill as any);
}

export async function deleteSkill(id: string): Promise<void> {
  await deleteDoc(doc(db, "skills", id));
}

// Contact Messages (Lead submissions)
export async function getContactMessages(): Promise<ContactMessage[]> {
  const snap = await getDocs(query(collection(db, "contactMessages"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
}

export async function addContactMessage(message: Omit<ContactMessage, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "contactMessages"), message);
  return docRef.id;
}

export async function updateContactMessage(id: string, status: "unread" | "read"): Promise<void> {
  await updateDoc(doc(db, "contactMessages", id), { status });
}

export async function deleteContactMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, "contactMessages", id));
}
