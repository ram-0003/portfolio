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

// Dynamic Seeding Module: Seeds the data on-demand if collections are empty.
// This guarantees that the portfolio displays content out-of-the-box, but
// is completely CMS-editable.
// Checking all collections concurrently saves massive loading roundtrip latency.
export async function seedDatabaseIfEmpty() {
  try {
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

    if (servicesSnap.empty) {
      defaultServices.forEach(service => {
        writePromises.push(
          addDoc(collection(db, "services"), service)
        );
      });
      console.log("Seeding Schedule: services loaded into Firestore queue.");
    }

    if (projectsSnap.empty) {
      defaultProjects.forEach(project => {
        writePromises.push(
          addDoc(collection(db, "projects"), project)
        );
      });
      console.log("Seeding Schedule: projects loaded into Firestore queue.");
    }

    if (caseStudiesSnap.empty) {
      defaultCaseStudies.forEach(study => {
        writePromises.push(
          addDoc(collection(db, "caseStudies"), study)
        );
      });
      console.log("Seeding Schedule: caseStudies loaded into Firestore queue.");
    }

    if (blogSnap.empty) {
      defaultBlogPosts.forEach(post => {
        writePromises.push(
          addDoc(collection(db, "blogPosts"), post)
        );
      });
      console.log("Seeding Schedule: blogPosts loaded into Firestore queue.");
    }

    if (skillsSnap.empty) {
      defaultSkills.forEach(skill => {
        writePromises.push(
          addDoc(collection(db, "skills"), skill)
        );
      });
      console.log("Seeding Schedule: skills loaded into Firestore queue.");
    }

    if (writePromises.length > 0) {
      await Promise.all(writePromises);
      console.log("All collections seeded successfully.");
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
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
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
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
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
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
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
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as CaseStudy));
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
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill));
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
