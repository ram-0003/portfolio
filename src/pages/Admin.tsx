import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { 
  auth, 
  getSiteSettings, 
  updateSiteSettings,
  getProjects, 
  addProject, 
  updateProject, 
  deleteProject, 
  getBlogPosts, 
  addBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  getCaseStudies, 
  addCaseStudy, 
  updateCaseStudy, 
  deleteCaseStudy, 
  getServices, 
  addService, 
  updateService, 
  deleteService, 
  getSkills, 
  addSkill, 
  updateSkill, 
  deleteSkill, 
  getContactMessages, 
  updateContactMessage, 
  deleteContactMessage,
  uploadImage
} from "../services/firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User 
} from "firebase/auth";
import { 
  Project, 
  BlogPost, 
  CaseStudy, 
  Service, 
  Skill, 
  ContactMessage,
  SiteSettings
} from "../types";
import profilePhoto from "../assets/images/profile_photo_1782095816672.jpg";
import { 
  Terminal, 
  Cpu, 
  Workflow, 
  FolderOpen, 
  BookOpen, 
  Settings, 
  MessageSquare, 
  Trash2, 
  Plus, 
  Edit, 
  Check, 
  X, 
  Calendar,
  Lock,
  LogOut,
  Sparkles,
  Layers,
  Award
} from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Login states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authEmail, setAuthEmail] = useState("ramachandran85966@gmail.com");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "blogs" | "studies" | "services" | "skills" | "leads" | "settings">("dashboard");

  // Site Profile Settings edit controls
  const [siteName, setSiteName] = useState("");
  const [siteTitle, setSiteTitle] = useState("");
  const [siteSubtitle, setSiteSubtitle] = useState("");
  const [siteBio, setSiteBio] = useState("");
  const [siteRole, setSiteRole] = useState("");
  const [siteEmail, setSiteEmail] = useState("");
  const [sitePhone, setSitePhone] = useState("");
  const [siteWhatsapp, setSiteWhatsapp] = useState("");
  const [siteLinkedin, setSiteLinkedin] = useState("");
  const [siteGithub, setSiteGithub] = useState("");
  const [siteProfileImg, setSiteProfileImg] = useState("");
  const [siteCompletedProjects, setSiteCompletedProjects] = useState("");
  const [siteProcessesAutomated, setSiteProcessesAutomated] = useState("");
  const [siteTechStackModules, setSiteTechStackModules] = useState("");
  const [siteHoursShaved, setSiteHoursShaved] = useState("");

  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  // Telemetry metrics
  const [metrics, setMetrics] = useState({
    leadsCount: 0,
    unreadLeads: 0,
    projectsCount: 0,
    blogsCount: 0,
    skillsCount: 0,
    servicesCount: 0
  });

  // CMS state grids
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [leads, setLeads] = useState<ContactMessage[]>([]);

  // Editing state toggles / items
  const [editingItemID, setEditingItemID] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Custom Delete Confirm modal layout state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: "project" | "blog" | "case" | "service" | "skill" | "lead" | null;
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: null,
    id: "",
    title: ""
  });

  const requestDeletion = (type: "project" | "blog" | "case" | "service" | "skill" | "lead", id: string, title: string) => {
    setDeleteConfirm({
      isOpen: true,
      type,
      id,
      title
    });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteConfirm;
    if (!id || !type) return;
    try {
      if (type === "project") {
        await deleteProject(id);
      } else if (type === "blog") {
        await deleteBlogPost(id);
      } else if (type === "case") {
        await deleteCaseStudy(id);
      } else if (type === "service") {
        await deleteService(id);
      } else if (type === "skill") {
        await deleteSkill(id);
      } else if (type === "lead") {
        await deleteContactMessage(id);
      }
      loadCmsData();
    } catch (err) {
      console.error("Error executing delete:", err);
    } finally {
      setDeleteConfirm({ isOpen: false, type: null, id: "", title: "" });
    }
  };

  // Forms state variables
  // Uploaded Image base64 caching states / Existing image URL states
  const [projUploadImg, setProjUploadImg] = useState("");
  const [blogUploadImg, setBlogUploadImg] = useState("");
  const [caseUploadImg, setCaseUploadImg] = useState("");

  const [siteProfileFile, setSiteProfileFile] = useState<File | null>(null);
  const [projUploadFile, setProjUploadFile] = useState<File | null>(null);
  const [blogUploadFile, setBlogUploadFile] = useState<File | null>(null);
  const [caseUploadFile, setCaseUploadFile] = useState<File | null>(null);

  // Migration & Self-Healing states
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migResultMsg, setMigResultMsg] = useState<string | null>(null);

  // Project Form
  const [projTitle, setProjTitle] = useState("");
  const [projType, setProjType] = useState("Web Application");
  const [projDesc, setProjDesc] = useState("");
  const [projContent, setProjContent] = useState("");
  const [projFeatures, setProjFeatures] = useState("");
  const [projChallenges, setProjChallenges] = useState("");
  const [projResults, setProjResults] = useState("");
  const [projDemo, setProjDemo] = useState("");
  const [projGit, setProjGit] = useState("");
  const [projStack, setProjStack] = useState("");
  const [projCategory, setProjCategory] = useState("Workflow Automation");
  const [projFeatured, setProjFeatured] = useState(false);

  // Blog Form
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogImage, setBlogImage] = useState("");
  const [blogCat, setBlogCat] = useState("Workflow Automation");
  const [blogTags, setBlogTags] = useState("");
  const [blogReadingTime, setBlogReadingTime] = useState("4 min read");
  const [blogStatus, setBlogStatus] = useState<"draft" | "published">("published");

  // Case Study Form
  const [caseTitle, setCaseTitle] = useState("");
  const [caseSlug, setCaseSlug] = useState("");
  const [caseClient, setCaseClient] = useState("");
  const [caseDesc, setCaseDesc] = useState("");
  const [caseProblem, setCaseProblem] = useState("");
  const [caseSolution, setCaseSolution] = useState("");
  const [caseProcess, setCaseProcess] = useState("");
  const [caseResults, setCaseResults] = useState("");
  const [caseLessons, setCaseLessons] = useState("");
  const [caseStack, setCaseStack] = useState("");

  // Service Form
  const [srvTitle, setSrvTitle] = useState("");
  const [srvDesc, setSrvDesc] = useState("");
  const [srvBenefits, setSrvBenefits] = useState("");
  const [srvStack, setSrvStack] = useState("");
  const [srvCases, setSrvCases] = useState("");
  const [srvOrder, setSrvOrder] = useState(1);

  // Skill Form
  const [skName, setSkName] = useState("");
  const [skCat, setSkCat] = useState<"Workflow Automation" | "AI / Smart Integrations" | "Web Development" | "API / Backend" | "Mobile App Development">("Workflow Automation");
  const [skLevel, setSkLevel] = useState(90);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
      setAuthLoading(false);
      if (u) {
        loadCmsData();
      }
    });
    return () => unsubscribe();
  }, []);

  async function loadCmsData() {
    try {
      const [p, b, c, s, k, l, decodedSettings] = await Promise.all([
        getProjects(),
        getBlogPosts(),
        getCaseStudies(),
        getServices(),
        getSkills(),
        getContactMessages().catch(() => [] as ContactMessage[]), // Fail proof if rules require permission initially
        getSiteSettings().catch(() => null)
      ]);

      setProjects(p);
      setBlogs(b);
      setCaseStudies(c);
      setServices(s);
      setSkills(k);
      setLeads(l);

      if (decodedSettings) {
        setSiteName(decodedSettings.name || "");
        setSiteTitle(decodedSettings.title || "");
        setSiteSubtitle(decodedSettings.subtitle || "");
        setSiteBio(decodedSettings.bio || "");
        setSiteRole(decodedSettings.role || "");
        setSiteEmail(decodedSettings.email || "");
        setSitePhone(decodedSettings.phone || "");
        setSiteWhatsapp(decodedSettings.whatsapp || "");
        setSiteLinkedin(decodedSettings.linkedin || "");
        setSiteGithub(decodedSettings.github || "");
        setSiteProfileImg(decodedSettings.profileImage || "");
        setSiteCompletedProjects(decodedSettings.completedProjects || "");
        setSiteProcessesAutomated(decodedSettings.processesAutomated || "");
        setSiteTechStackModules(decodedSettings.techStackModules || "");
        setSiteHoursShaved(decodedSettings.hoursShaved || "");
      }

      setMetrics({
        leadsCount: l.length,
        unreadLeads: l.filter(m => m.status === "unread").length,
        projectsCount: p.length,
        blogsCount: b.length,
        skillsCount: k.length,
        servicesCount: s.length
      });
    } catch (err) {
      console.warn("CMS retrieval issue. Verify email matches rule authorization:", err);
    }
  }

  // ------------------- SECURITY LOGIN HANDLERS -------------------
  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (authEmail.trim() !== "ramachandran85966@gmail.com") {
      setAuthError("Operation restricted. Only 'ramachandran85966@gmail.com' authorized.");
      return;
    }

    try {
      if (isRegisterMode) {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
    } catch (err: any) {
      setAuthError(err.message || "Credential verification failed.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/portfolio");
  };

  // ------------------- CMS WRITING SUBMISSIONS -------------------
  
  // Project Add / Update
  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!projTitle) return;

    let finalImageUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200";

    if (projUploadFile) {
      try {
        finalImageUrl = await uploadImage(projUploadFile, `projects/${Date.now()}_${projUploadFile.name}`);
      } catch (err) {
        console.error("Storage upload failed for project image:", err);
        alert("Failed to upload image to Firebase Storage. Saving with default placeholder.");
      }
    } else if (projUploadImg) {
      finalImageUrl = projUploadImg;
    }

    const payload: Omit<Project, "id"> = {
      title: projTitle,
      type: projType,
      description: projDesc,
      content: projContent,
      features: projFeatures.split(",").map(f => f.trim()).filter(Boolean),
      challenges: projChallenges,
      results: projResults,
      demoUrl: projDemo,
      githubUrl: projGit,
      images: [finalImageUrl],
      techStack: projStack.split(",").map(t => t.trim()).filter(Boolean),
      category: projCategory,
      featured: projFeatured,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingItemID) {
        await updateProject(editingItemID, payload);
      } else {
        await addProject(payload);
      }
      resetProjectForm();
      loadCmsData();
    } catch (err) {
      alert("Error saving project. Check permissions.");
    }
  };

  const resetProjectForm = () => {
    setProjTitle("");
    setProjType("Web Application");
    setProjDesc("");
    setProjContent("");
    setProjFeatures("");
    setProjChallenges("");
    setProjResults("");
    setProjDemo("");
    setProjGit("");
    setProjStack("");
    setProjCategory("Workflow Automation");
    setProjFeatured(false);
    setProjUploadImg("");
    setProjUploadFile(null);
    setEditingItemID(null);
    setShowCreateForm(false);
  };

  const startEditProject = (p: Project) => {
    setProjTitle(p.title);
    setProjType(p.type);
    setProjDesc(p.description);
    setProjContent(p.content || "");
    setProjFeatures(p.features?.join(", ") || "");
    setProjChallenges(p.challenges || "");
    setProjResults(p.results || "");
    setProjDemo(p.demoUrl || "");
    setProjGit(p.githubUrl || "");
    setProjStack(p.techStack?.join(", ") || "");
    setProjCategory(p.category || "Workflow Automation");
    setProjFeatured(p.featured || false);
    setProjUploadImg(p.images?.[0] || "");
    setEditingItemID(p.id || null);
    setShowCreateForm(true);
  };

  const handleDeleteProj = (id: string) => {
    const item = projects.find(x => x.id === id);
    requestDeletion("project", id, item?.title || "Project Asset");
  };

  // Blog Add / Update
  const handleSaveBlog = async (e: FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogSlug) return;

    let finalImageUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200";

    if (blogUploadFile) {
      try {
        finalImageUrl = await uploadImage(blogUploadFile, `blogs/${Date.now()}_${blogUploadFile.name}`);
      } catch (err) {
        console.error("Storage upload failed for blog image:", err);
        alert("Failed to upload image to Storage. Saving blog with default placeholder.");
      }
    } else if (blogUploadImg) {
      finalImageUrl = blogUploadImg;
    }

    const payload: Omit<BlogPost, "id"> = {
      title: blogTitle,
      slug: blogSlug,
      summary: blogSummary,
      content: blogContent,
      coverImage: finalImageUrl,
      category: blogCat,
      tags: blogTags.split(",").map(t => t.trim()).filter(Boolean),
      readingTime: blogReadingTime,
      status: blogStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingItemID) {
        await updateBlogPost(editingItemID, payload);
      } else {
        await addBlogPost(payload);
      }
      resetBlogForm();
      loadCmsData();
    } catch (err) {
      alert("Error saving post.");
    }
  };

  const resetBlogForm = () => {
    setBlogTitle("");
    setBlogSlug("");
    setBlogSummary("");
    setBlogContent("");
    setBlogImage("");
    setBlogUploadImg("");
    setBlogUploadFile(null);
    setBlogCat("Workflow Automation");
    setBlogTags("");
    setBlogReadingTime("4 min read");
    setBlogStatus("published");
    setEditingItemID(null);
    setShowCreateForm(false);
  };

  const startEditBlog = (b: BlogPost) => {
    setBlogTitle(b.title);
    setBlogSlug(b.slug);
    setBlogSummary(b.summary);
    setBlogContent(b.content);
    setBlogImage(b.coverImage);
    setBlogUploadImg(b.coverImage || "");
    setBlogCat(b.category);
    setBlogTags(b.tags?.join(", ") || "");
    setBlogReadingTime(b.readingTime);
    setBlogStatus(b.status);
    setEditingItemID(b.id || null);
    setShowCreateForm(true);
  };

  const handleDeleteBlog = (id: string) => {
    const item = blogs.find(x => x.id === id);
    requestDeletion("blog", id, item?.title || "Blog Article");
  };

  // Case Study Add / Update
  const handleSaveCase = async (e: FormEvent) => {
    e.preventDefault();
    if (!caseTitle || !caseSlug) return;

    let finalImageUrl = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200";

    if (caseUploadFile) {
      try {
        finalImageUrl = await uploadImage(caseUploadFile, `cases/${Date.now()}_${caseUploadFile.name}`);
      } catch (err) {
        console.error("Storage upload failed for case study image:", err);
        alert("Failed to upload image to Storage. Saving case study with default placeholder.");
      }
    } else if (caseUploadImg) {
      finalImageUrl = caseUploadImg;
    }

    const payload: Omit<CaseStudy, "id"> = {
      title: caseTitle,
      slug: caseSlug,
      client: caseClient,
      description: caseDesc,
      problem: caseProblem,
      solution: caseSolution,
      process: caseProcess,
      results: caseResults,
      lessons: caseLessons,
      coverImage: finalImageUrl,
      images: [],
      techStack: caseStack.split(",").map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    };

    try {
      if (editingItemID) {
        await updateCaseStudy(editingItemID, payload);
      } else {
        await addCaseStudy(payload);
      }
      resetCaseForm();
      loadCmsData();
    } catch (err) {
      alert("Error saving Case Study.");
    }
  };

  const resetCaseForm = () => {
    setCaseTitle("");
    setCaseSlug("");
    setCaseClient("");
    setCaseDesc("");
    setCaseProblem("");
    setCaseSolution("");
    setCaseProcess("");
    setCaseResults("");
    setCaseLessons("");
    setCaseStack("");
    setCaseUploadImg("");
    setCaseUploadFile(null);
    setEditingItemID(null);
    setShowCreateForm(false);
  };

  const startEditCase = (c: CaseStudy) => {
    setCaseTitle(c.title);
    setCaseSlug(c.slug);
    setCaseClient(c.client);
    setCaseDesc(c.description);
    setCaseProblem(c.problem);
    setCaseSolution(c.solution);
    setCaseProcess(c.process);
    setCaseResults(c.results);
    setCaseLessons(c.lessons || "");
    setCaseStack(c.techStack?.join(", ") || "");
    setCaseUploadImg(c.coverImage || "");
    setEditingItemID(c.id || null);
    setShowCreateForm(true);
  };

  const handleDeleteCase = (id: string) => {
    const item = caseStudies.find(x => x.id === id);
    requestDeletion("case", id, item?.title || "Case Log");
  };

  // Service Save
  const handleSaveService = async (e: FormEvent) => {
    e.preventDefault();
    if (!srvTitle) return;

    const payload: Omit<Service, "id"> = {
      title: srvTitle,
      icon: "Code",
      description: srvDesc,
      benefits: srvBenefits.split(",").map(b => b.trim()).filter(Boolean),
      techStack: srvStack.split(",").map(t => t.trim()).filter(Boolean),
      useCases: srvCases.split(",").map(u => u.trim()).filter(Boolean),
      order: Number(srvOrder)
    };

    try {
      if (editingItemID) {
        await updateService(editingItemID, payload);
      } else {
        await addService(payload);
      }
      resetServiceForm();
      loadCmsData();
    } catch (err) {
      alert("Error saving service.");
    }
  };

  const resetServiceForm = () => {
    setSrvTitle("");
    setSrvDesc("");
    setSrvBenefits("");
    setSrvStack("");
    setSrvCases("");
    setSrvOrder(1);
    setEditingItemID(null);
    setShowCreateForm(false);
  };

  const startEditService = (s: Service) => {
    setSrvTitle(s.title);
    setSrvDesc(s.description);
    setSrvBenefits(s.benefits?.join(", ") || "");
    setSrvStack(s.techStack?.join(", ") || "");
    setSrvCases(s.useCases?.join(", ") || "");
    setSrvOrder(s.order || 1);
    setEditingItemID(s.id || null);
    setShowCreateForm(true);
  };

  const handleDeleteService = (id: string) => {
    const item = services.find(x => x.id === id);
    requestDeletion("service", id, item?.title || "Service Struct");
  };

  // Skill Save
  const handleSaveSkill = async (e: FormEvent) => {
    e.preventDefault();
    if (!skName) return;

    const payload: Omit<Skill, "id"> = {
      name: skName,
      category: skCat,
      level: Number(skLevel),
      order: 1
    };

    try {
      if (editingItemID) {
        await updateSkill(editingItemID, payload);
      } else {
        await addSkill(payload);
      }
      resetSkillForm();
      loadCmsData();
    } catch (err) {
      alert("Error saving skill.");
    }
  };

  const resetSkillForm = () => {
    setSkName("");
    setSkCat("Workflow Automation");
    setSkLevel(90);
    setEditingItemID(null);
    setShowCreateForm(false);
  };

  const startEditSkill = (s: Skill) => {
    setSkName(s.name);
    setSkCat(s.category);
    setSkLevel(s.level);
    setEditingItemID(s.id || null);
    setShowCreateForm(true);
  };

  const handleDeleteSkill = (id: string) => {
    const item = skills.find(x => x.id === id);
    requestDeletion("skill", id, item?.name || "Skill Entry");
  };

  // Leads Handlers
  const handleToggleLeadStatus = async (id: string, currentStatus: "read" | "unread") => {
    const nextStatus = currentStatus === "read" ? "unread" : "read";
    await updateContactMessage(id, nextStatus);
    loadCmsData();
  };

  const handleDeleteLead = (id: string) => {
    const item = leads.find(x => x.id === id);
    requestDeletion("lead", id, item ? `${item.name}'s contact message` : "Client Message");
  };

  // Save Site settings
  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsError("");
    setSettingsSuccess(false);

    let finalProfileImg = siteProfileImg;

    if (siteProfileFile) {
      try {
        finalProfileImg = await uploadImage(siteProfileFile, `profiles/${Date.now()}_${siteProfileFile.name}`);
      } catch (err) {
        console.error("Storage upload failed for site profile image:", err);
        setSettingsError("Failed to upload profile photo to storage.");
        setSettingsSaving(false);
        return;
      }
    }

    const payload: SiteSettings = {
      name: siteName,
      title: siteTitle,
      subtitle: siteSubtitle,
      bio: siteBio,
      email: siteEmail,
      phone: sitePhone,
      whatsapp: siteWhatsapp,
      linkedin: siteLinkedin,
      github: siteGithub,
      role: siteRole,
      profileImage: finalProfileImg,
      completedProjects: siteCompletedProjects,
      processesAutomated: siteProcessesAutomated,
      techStackModules: siteTechStackModules,
      hoursShaved: siteHoursShaved
    };

    try {
      await updateSiteSettings(payload);
      setSettingsSuccess(true);
      setSiteProfileFile(null);
      setTimeout(() => setSettingsSuccess(false), 4000);
      loadCmsData();
    } catch (err) {
      console.error("Save settings error:", err);
      setSettingsError("Failed to save settings. Please try again.");
    } finally {
      setSettingsSaving(false);
    }
  };

  const downloadImageAsBlob = async (url: string): Promise<Blob> => {
    if (url.startsWith("data:")) {
      const arr = url.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} when trying to download ${url}`);
    }
    return await res.blob();
  };

  const handleMigrateAssets = async () => {
    setIsMigrating(true);
    setMigrationLogs(["Initializing diagnostics and asset scan..."]);
    setMigResultMsg(null);

    const log = (msg: string) => {
      setMigrationLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    try {
      // 1. Migrate Profile Photo
      log("Analyzing platform site configurations...");
      const sSettings = await getSiteSettings();

      // Check profilePhoto
      const currentProfilePhoto = sSettings.profileImage || "";
      const isProfileOnStorage = currentProfilePhoto.includes("firebasestorage.googleapis.com") || currentProfilePhoto.includes(".appspot.com");
      
      if (!isProfileOnStorage) {
        log(`Profile image is located at source: "${currentProfilePhoto || "None (Default local)"}". Preparing for transfer.`);
        try {
          const urlToFetch = currentProfilePhoto || profilePhoto;
          log(`Fetching profile blob from: ${urlToFetch}`);
          const blob = await downloadImageAsBlob(urlToFetch);
          log("Upload process starting for Profile image...");
          const newUrl = await uploadImage(blob, `profiles/migrated_profile_photo_${Date.now()}.jpg`);
          log(`Success! Profile image synchronized to Storage: ${newUrl}`);
          sSettings.profileImage = newUrl;
          await updateSiteSettings(sSettings);
          setSiteProfileImg(newUrl);
          log("Settings database synced securely with Storage reference.");
        } catch (err: any) {
          log(`⚠️ Profile photo migrate status skipped: ${err.message || err}`);
        }
      } else {
        log("✅ Profile image already securely hosted on Firebase Storage!");
      }

      // 2. Migrate Projects cover images and list images
      log("Scanning projects collections...");
      const loadedProjects = await getProjects();
      for (const project of loadedProjects) {
        if (!project.id) continue;
        let pUpdated = false;
        
        const origImages = project.images || [];
        const newImages: string[] = [];
        
        for (let i = 0; i < origImages.length; i++) {
          const imgUrl = origImages[i];
          const isImgOnStorage = imgUrl.includes("firebasestorage.googleapis.com") || imgUrl.includes(".appspot.com");
          if (!isImgOnStorage) {
            log(`Project "${project.title}" Image [${i+1}] is "${imgUrl}". Fetching...`);
            try {
              const blob = await downloadImageAsBlob(imgUrl);
              const newUrl = await uploadImage(blob, `projects/migrated_${project.id}_img_${i}_${Date.now()}.jpg`);
              newImages.push(newUrl);
              pUpdated = true;
              log(`Uploaded Project Image to Storage.`);
            } catch (err: any) {
              log(`⚠️ Skipped Project image [${i+1}]: ${err.message || err}`);
              newImages.push(imgUrl);
            }
          } else {
            newImages.push(imgUrl);
          }
        }

        if (pUpdated) {
          log(`Saving migrated image references for Project "${project.title}"`);
          await updateProject(project.id, { images: newImages });
        }
      }
      log("✅ Projects scan completed.");

      // 3. Migrate Blog Posts
      log("Scanning blog posts collections...");
      const loadedBlogs = await getBlogPosts();
      for (const blog of loadedBlogs) {
        if (!blog.id) continue;
        const cover = blog.coverImage || "";
        const isCoverOnStorage = cover.includes("firebasestorage.googleapis.com") || cover.includes(".appspot.com");
        
        if (cover && !isCoverOnStorage) {
          log(`Blog Post "${blog.title}" Cover is external: "${cover}". Pulling asset...`);
          try {
            const blob = await downloadImageAsBlob(cover);
            const newUrl = await uploadImage(blob, `blogs/migrated_${blog.id}_${Date.now()}.jpg`);
            log("Saving cover image to Firebase Storage.");
            await updateBlogPost(blog.id, { coverImage: newUrl });
            log(`✅ Synced Blog post "${blog.title}" Cover Image.`);
          } catch (err: any) {
            log(`⚠️ Skipped Blog Cover: ${err.message || err}`);
          }
        }
      }
      log("✅ Blogs scan completed.");

      // 4. Migrate Case Studies
      log("Scanning case studies collections...");
      const loadedCases = await getCaseStudies();
      for (const item of loadedCases) {
        if (!item.id) continue;
        const cover = item.coverImage || "";
        const isCoverOnStorage = cover.includes("firebasestorage.googleapis.com") || cover.includes(".appspot.com");
        
        if (cover && !isCoverOnStorage) {
          log(`Case Study "${item.title}" Cover is external: "${cover}". Pulling asset...`);
          try {
            const blob = await downloadImageAsBlob(cover);
            const newUrl = await uploadImage(blob, `cases/migrated_${item.id}_${Date.now()}.jpg`);
            log("Saving cover image to Firebase Storage.");
            await updateCaseStudy(item.id, { coverImage: newUrl });
            log(`✅ Synced Case Study "${item.title}" Cover Image.`);
          } catch (err: any) {
            log(`⚠️ Skipped Case Study Cover: ${err.message || err}`);
          }
        }
      }
      log("✅ Case studies scan completed.");

      log("Deep synchronization finalized successfully!");
      setMigResultMsg("All asset images in database successfully migrated and now point to your permanent Firebase Storage bucket!");
      await loadCmsData();
    } catch (err: any) {
      console.error("Migration error:", err);
      if (err.message && (err.message.includes("permission") || err.message.includes("unauthorized") || err.code === "storage/unauthorized" || (err.message && err.message.toLowerCase().includes("unauthorized")))) {
        setMigResultMsg("Permission Denied: Your Firebase Storage security rules are currently restricting write operations. Please configure storage write permissions in the Firebase console first (see troubleshooting notes below).");
        log("❌ Migration aborted because of Firebase Storage authorization failure.");
      } else {
        setMigResultMsg(`Migration failed: ${err.message || err}`);
        log("❌ Migration aborted due to an error.");
      }
    } finally {
      setIsMigrating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-brand-cyan border-r-2 border-brand-purple"></div>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest animate-pulse font-medium">Authorizing Console Access...</p>
        </div>
      </div>
    );
  }

  // Render Secured Login form if guest
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 relative z-10">
        <div className="absolute inset-0 bg-brand-cyan/5 blur-3xl -z-10 pointer-events-none"></div>
        <div className="bg-dark-card border border-white/8 rounded-3xl p-8 flex flex-col gap-6 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-brand-cyan to-brand-purple flex items-center justify-center text-white mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-xl text-white">CMS Console Credentials</h2>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-wider">Access authorized for Ramachandran S</p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-xs font-mono leading-relaxed">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase text-gray-400">Admin Email</label>
              <input
                type="email"
                required
                disabled
                value={authEmail}
                className="bg-neutral-900/50 border border-white/8 rounded-xl p-3 text-sm text-gray-400 font-mono focus:outline-hidden"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase text-gray-400">Security Phrase / Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="bg-neutral-900/50 border border-white/8 rounded-xl p-3 text-sm text-white focus:outline-hidden focus:border-brand-cyan/60 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3.5 rounded-xl bg-linear-to-r from-brand-cyan to-brand-purple text-dark-bg font-display font-bold text-sm hover:scale-102 transition-transform cursor-pointer"
            >
              {isRegisterMode ? "Confirm Register Admin" : "Authorize Session"}
            </button>
          </form>

          {/* Toggle register first time if user needs to create DB password */}
          <div className="text-center pt-2 border-t border-white/5">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="font-mono text-[10px] text-gray-500 hover:text-brand-cyan transition-colors"
            >
              {isRegisterMode ? "Switch to standard Sign In" : "First launch? Register your admin account password here"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------- MAIN SECURED LAYOUT -------------------
  return (
    <div className="max-w-[1580px] w-full mx-auto px-6 py-6 border-t border-white/5 min-h-[80vh] flex flex-col md:flex-row gap-8 relative z-10">
      
      {/* Sidebar Control panels */}
      <aside className="w-full md:w-56 shrink-0 flex flex-col gap-4">
        <div className="bg-white/3 border border-white/8 p-4 rounded-2xl flex items-center gap-3">
          <Terminal className="w-4.5 h-4.5 text-brand-cyan shrink-0 animate-pulse" />
          <div className="flex flex-col leading-tight">
            <span className="font-display font-medium text-xs text-white">Console Root</span>
            <span className="font-mono text-[9px] text-emerald-400">Authenticated (Ok)</span>
          </div>
        </div>

        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1 pb-2 md:pb-0 bg-dark-card/20 p-2 rounded-2xl border border-white/5">
          <button
            onClick={() => { setActiveTab("dashboard"); setShowCreateForm(false); }}
            className={`px-4 py-2.5 rounded-xl text-left font-display text-xs font-semibold shrink-0 cursor-pointer ${
              activeTab === "dashboard" ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20" : "text-gray-400 hover:text-white"
            }`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => { setActiveTab("projects"); resetProjectForm(); }}
            className={`px-4 py-2.5 rounded-xl text-left font-display text-xs font-semibold shrink-0 cursor-pointer ${
              activeTab === "projects" ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20" : "text-gray-400 hover:text-white"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => { setActiveTab("blogs"); resetBlogForm(); }}
            className={`px-4 py-2.5 rounded-xl text-left font-display text-xs font-semibold shrink-0 cursor-pointer ${
              activeTab === "blogs" ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20" : "text-gray-400 hover:text-white"
            }`}
          >
            Blog Articles
          </button>
          <button
            onClick={() => { setActiveTab("studies"); resetCaseForm(); }}
            className={`px-4 py-2.5 rounded-xl text-left font-display text-xs font-semibold shrink-0 cursor-pointer ${
              activeTab === "studies" ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20" : "text-gray-400 hover:text-white"
            }`}
          >
            Case Studies
          </button>
          <button
            onClick={() => { setActiveTab("services"); resetServiceForm(); }}
            className={`px-4 py-2.5 rounded-xl text-left font-display text-xs font-semibold shrink-0 cursor-pointer ${
              activeTab === "services" ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20" : "text-gray-400 hover:text-white"
            }`}
          >
            Services
          </button>
          <button
            onClick={() => { setActiveTab("skills"); resetSkillForm(); }}
            className={`px-4 py-2.5 rounded-xl text-left font-display text-xs font-semibold shrink-0 cursor-pointer ${
              activeTab === "skills" ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20" : "text-gray-400 hover:text-white"
            }`}
          >
            Skills Matrix
          </button>
          <button
            onClick={() => { setActiveTab("leads"); setShowCreateForm(false); }}
            className={`px-4 py-2.5 rounded-xl text-left font-display text-xs font-semibold shrink-0 cursor-pointer flex justify-between items-center ${
              activeTab === "leads" ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20" : "text-gray-400 hover:text-white"
            }`}
          >
            <span>Inbound Leads</span>
            {metrics.unreadLeads > 0 && (
              <span className="bg-red-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-full animate-bounce">
                {metrics.unreadLeads}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab("settings"); setShowCreateForm(false); }}
            className={`px-4 py-2.5 rounded-xl text-left font-display text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-2 ${
              activeTab === "settings" ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20" : "text-gray-400 hover:text-white"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Profile Settings</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 border border-red-500/10 hover:border-red-500/35 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-xl py-3 text-xs font-semibold font-mono cursor-pointer flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          End Consultation Session
        </button>
      </aside>

      {/* Main CMS dashboard board panel */}
      <main className="flex-1 bg-dark-card/35 rounded-3xl border border-white/5 p-6 md:p-8 backdrop-blur-md">

        {/* ------------------- TAB 1: OVERVIEW ------------------- */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h2 className="font-display font-bold text-xl text-white">Cabinet Overview</h2>
                <p className="text-gray-500 text-xs font-mono">Live Firestore collection sizes:</p>
              </div>
              <span className="font-mono text-[9px] text-gray-500 tracking-wider">Sync: Nominal</span>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/2 border border-white/5 rounded-2xl p-4">
                <span className="font-mono text-[10px] text-gray-500 font-semibold block">UNREAD LEADS</span>
                <span className="font-display font-medium text-3xl text-white">{metrics.unreadLeads}</span>
              </div>
              <div className="bg-white/2 border border-white/5 rounded-2xl p-4">
                <span className="font-mono text-[10px] text-gray-500 font-semibold block">TOTAL PORTFOLIOS</span>
                <span className="font-display font-medium text-3xl text-white">{metrics.projectsCount}</span>
              </div>
              <div className="bg-white/2 border border-white/5 rounded-2xl p-4">
                <span className="font-mono text-[10px] text-gray-500 font-semibold block">SERVICES LOADED</span>
                <span className="font-display font-medium text-3xl text-white">{metrics.servicesCount}</span>
              </div>
            </div>

            {/* Activity details log simulation */}
            <div className="bg-neutral-900/40 border border-white/8 p-5 rounded-2xl flex flex-col gap-3 font-mono text-xs text-gray-400">
              <h4 className="text-gray-500 uppercase text-[10px] tracking-wider font-semibold">Active telemetry events</h4>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="text-brand-purple">[nominal]</span>
                  <span>System startup: Seed verification complete.</span>
                </div>
                {leads.length > 0 && (
                  <div className="flex gap-2 text-brand-cyan">
                    <span>[inbound]</span>
                    <span>Last inquiry fetched from: {leads[0].name} ({leads[0].email})</span>
                  </div>
                )}
                <div className="flex gap-2 text-gray-500">
                  <span>[console]</span>
                  <span>CMS secure rules verification validated.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------- TAB 2: PROJECTS ------------------- */}
        {activeTab === "projects" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="font-display font-bold text-xl text-white">Project Cabinet</h2>
              <button
                onClick={() => { setShowCreateForm(!showCreateForm); setEditingItemID(null); }}
                className="px-4 py-2 rounded-full bg-brand-cyan text-dark-bg font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                {showCreateForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showCreateForm ? "Close Form" : "Create Project"}
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleSaveProject} className="bg-white/2 border border-white/6 p-6 rounded-2xl flex flex-col gap-4">
                <h3 className="font-sans font-semibold text-white text-sm">{editingItemID ? "Update Codebase Profile" : "Register New Codebase"}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Project Title"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g. Workflow Automation)"
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Demo URL"
                    value={projDemo}
                    onChange={(e) => setProjDemo(e.target.value)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="GitHub Source URL"
                    value={projGit}
                    onChange={(e) => setProjGit(e.target.value)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <textarea
                  placeholder="Summary description"
                  rows={2}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />

                <textarea
                  placeholder="Mechanics details markdown"
                  rows={4}
                  value={projContent}
                  onChange={(e) => setProjContent(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Features (comma separated)"
                    value={projFeatures}
                    onChange={(e) => setProjFeatures(e.target.value)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Tech Stack (comma separated)"
                    value={projStack}
                    onChange={(e) => setProjStack(e.target.value)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <textarea
                    placeholder="Challenges solved"
                    rows={2}
                    value={projChallenges}
                    onChange={(e) => setProjChallenges(e.target.value)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  />
                  <textarea
                    placeholder="Results achieved"
                    rows={2}
                    value={projResults}
                    onChange={(e) => setProjResults(e.target.value)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                {/* Drag and Drop Image Upload */}
                <div className="flex flex-col gap-2">
                  <span className="text-white text-xs font-mono uppercase tracking-wider">Representation Cover Asset</span>
                  <div 
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-brand-cyan/60"); }}
                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-brand-cyan/60"); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("border-brand-cyan/60");
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        setProjUploadFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProjUploadImg(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    onClick={() => document.getElementById("proj-file-input")?.click()}
                    className="border-2 border-dashed border-white/10 hover:border-brand-cyan/40 rounded-xl p-6 text-center cursor-pointer transition-all bg-neutral-900/40 relative flex flex-col items-center justify-center gap-2 group"
                  >
                    <input 
                      type="file" 
                      id="proj-file-input" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setProjUploadFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProjUploadImg(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {projUploadImg ? (
                      <div className="relative">
                        <img src={projUploadImg} alt="Preview" className="max-h-32 object-contain rounded-lg border border-white/15" />
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); setProjUploadImg(""); setProjUploadFile(null); }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs shadow-md transition-colors"
                        >
                          <X className="w-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Layers className="w-8 h-8 text-gray-500 group-hover:text-brand-cyan transition-colors" />
                        <p className="text-gray-400 text-xs text-center">Drag and drop any representation asset here, or click to open native file browser.</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={projFeatured}
                    onChange={(e) => setProjFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-cyan"
                  />
                  <label htmlFor="featured" className="text-white text-xs">Feature in Home Spotlights?</label>
                </div>

                <button
                  type="submit"
                  className="py-2 px-5 bg-brand-cyan text-dark-bg font-bold font-display rounded-lg text-xs self-start"
                >
                  Confirm Specifications
                </button>
              </form>
            )}

            {/* List with Delete button */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-white/5 uppercase text-gray-500 font-mono text-[9px] font-semibold">
                    <th className="py-3 px-2">Project</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/1">
                      <td className="py-3 px-2 font-semibold text-white">{p.title}</td>
                      <td className="py-3 px-2">{p.category}</td>
                      <td className="py-3 px-2 text-right text-gray-400 flex items-center justify-end gap-2">
                        <button onClick={() => startEditProject(p)} className="p-1 hover:text-brand-cyan">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProj(p.id!)} className="p-1 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------- TAB 3: BLOGS ------------------- */}
        {activeTab === "blogs" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="font-display font-bold text-xl text-white">Manual Cabinet</h2>
              <button
                onClick={() => { setShowCreateForm(!showCreateForm); setEditingItemID(null); }}
                className="px-4 py-2 rounded-full bg-brand-cyan text-dark-bg font-semibold text-xs inline-flex items-center gap-1.5"
              >
                {showCreateForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showCreateForm ? "Close Form" : "Draft Article"}
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleSaveBlog} className="bg-white/2 border border-white/6 p-6 rounded-2xl flex flex-col gap-4">
                <h3 className="font-sans font-semibold text-white text-sm">Blog Details</h3>
                <input
                  type="text"
                  required
                  placeholder="Article Title"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="URL slug (e.g. how-to-scale)"
                  value={blogSlug}
                  onChange={(e) => setBlogSlug(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <textarea
                  placeholder="Brief summary summary card text"
                  value={blogSummary}
                  onChange={(e) => setBlogSummary(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <textarea
                  placeholder="Full markdown article texts"
                  rows={6}
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Category (e.g. n8n)"
                    value={blogCat}
                    onChange={(e) => setBlogCat(e.target.value)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Tags (comma-separated)"
                    value={blogTags}
                    onChange={(e) => setBlogTags(e.target.value)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                {/* Drag and Drop Image Upload */}
                <div className="flex flex-col gap-2">
                  <span className="text-white text-xs font-mono uppercase tracking-wider">Article Cover Image</span>
                  <div 
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-brand-cyan/60"); }}
                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-brand-cyan/60"); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("border-brand-cyan/60");
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        setBlogUploadFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setBlogUploadImg(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    onClick={() => document.getElementById("blog-file-input")?.click()}
                    className="border-2 border-dashed border-white/10 hover:border-brand-cyan/40 rounded-xl p-6 text-center cursor-pointer transition-all bg-neutral-900/40 relative flex flex-col items-center justify-center gap-2 group"
                  >
                    <input 
                      type="file" 
                      id="blog-file-input" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setBlogUploadFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setBlogUploadImg(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {blogUploadImg ? (
                      <div className="relative">
                        <img src={blogUploadImg} alt="Preview" className="max-h-32 object-contain rounded-lg border border-white/15" />
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); setBlogUploadImg(""); setBlogUploadFile(null); }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs shadow-md transition-colors"
                        >
                          <X className="w-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Layers className="w-8 h-8 text-gray-500 group-hover:text-brand-cyan transition-colors" />
                        <p className="text-gray-400 text-xs text-center">Drag and drop blog cover image here, or click to open native file browser.</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <select
                    value={blogStatus}
                    onChange={(e) => setBlogStatus(e.target.value as any)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <button type="submit" className="py-2.5 px-5 bg-brand-cyan text-dark-bg font-bold rounded-lg text-xs">
                    Confirm Article Post
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-white/5 uppercase text-gray-500 font-mono text-[9px] font-semibold">
                    <td className="py-3 px-2">Article</td>
                    <td className="py-3 px-2">State</td>
                    <td className="py-3 px-2 text-right">Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((b, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/1">
                      <td className="py-3 px-2 font-semibold text-white">{b.title}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] ${
                          b.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-500"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-gray-400 flex items-center justify-end gap-2">
                        <button onClick={() => startEditBlog(b)} className="p-1 hover:text-brand-cyan">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteBlog(b.id!)} className="p-1 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------- TAB 4: CASE STUDIES ------------------- */}
        {activeTab === "studies" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="font-display font-bold text-xl text-white">Case Study Archive</h2>
              <button
                onClick={() => { setShowCreateForm(!showCreateForm); setEditingItemID(null); }}
                className="px-4 py-2 rounded-full bg-brand-cyan text-dark-bg font-semibold text-xs inline-flex items-center gap-1.5"
              >
                {showCreateForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showCreateForm ? "Close Form" : "Add Case Study"}
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleSaveCase} className="bg-white/2 border border-white/6 p-6 rounded-2xl flex flex-col gap-4 animate-in">
                <h3 className="font-sans font-semibold text-white text-sm">Register Case Study Study</h3>
                <input
                  type="text"
                  required
                  placeholder="Case study title"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Case Slug url"
                    value={caseSlug}
                    onChange={(e) => setCaseSlug(e.target.value)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Client name"
                    value={caseClient}
                    onChange={(e) => setCaseClient(e.target.value)}
                    className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
                <textarea
                  placeholder="Brief summary details"
                  value={caseDesc}
                  onChange={(e) => setCaseDesc(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <textarea
                  placeholder="Describe operational bottleneck problem"
                  value={caseProblem}
                  onChange={(e) => setCaseProblem(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <textarea
                  placeholder="Describe automation solution proposal"
                  value={caseSolution}
                  onChange={(e) => setCaseSolution(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <textarea
                  placeholder="Write step-by-step audit & rollout process"
                  rows={3}
                  value={caseProcess}
                  onChange={(e) => setCaseProcess(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <textarea
                  placeholder="Achieved metrics & outcomes"
                  value={caseResults}
                  onChange={(e) => setCaseResults(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Integration stacks used"
                  value={caseStack}
                  onChange={(e) => setCaseStack(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />

                {/* Drag and Drop Image Upload */}
                <div className="flex flex-col gap-2">
                  <span className="text-white text-xs font-mono uppercase tracking-wider">Case Study Cover image</span>
                  <div 
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-brand-cyan/60"); }}
                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-brand-cyan/60"); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("border-brand-cyan/60");
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        setCaseUploadFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setCaseUploadImg(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    onClick={() => document.getElementById("case-file-input")?.click()}
                    className="border-2 border-dashed border-white/10 hover:border-brand-cyan/40 rounded-xl p-6 text-center cursor-pointer transition-all bg-neutral-900/40 relative flex flex-col items-center justify-center gap-2 group"
                  >
                    <input 
                      type="file" 
                      id="case-file-input" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCaseUploadFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCaseUploadImg(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {caseUploadImg ? (
                      <div className="relative">
                        <img src={caseUploadImg} alt="Preview" className="max-h-32 object-contain rounded-lg border border-white/15" />
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); setCaseUploadImg(""); setCaseUploadFile(null); }}
                          className="absolute -top-2 -right-2 bg-red-400 hover:bg-red-500 text-white p-1 rounded-full text-xs shadow-md transition-colors"
                        >
                          <X className="w-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Layers className="w-8 h-8 text-gray-500 group-hover:text-brand-cyan transition-colors" />
                        <p className="text-gray-400 text-xs text-center">Drag and drop case study banner image here, or click to open native file browser.</p>
                      </>
                    )}
                  </div>
                </div>

                <button type="submit" className="py-2.5 px-5 bg-brand-cyan text-dark-bg font-bold rounded-lg text-xs self-start">
                  Save Case Log
                </button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-gray-300 text-xs">
                <thead>
                  <tr className="border-b border-white/5 uppercase text-gray-500 font-mono text-[9px] font-semibold">
                    <td className="py-3 px-2">Case Study Client</td>
                    <th className="py-3 px-2 text-right animate-pulse">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {caseStudies.map((c, sIdx) => (
                    <tr key={sIdx} className="border-b border-white/5 hover:bg-white/1">
                      <td className="py-3 px-2 font-semibold text-white">{c.client}: {c.title}</td>
                      <td className="py-3 px-2 text-right text-gray-400 flex items-center justify-end gap-2">
                        <button onClick={() => startEditCase(c)} className="p-1 hover:text-brand-cyan">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCase(c.id!)} className="p-1 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------- TAB 5: SERVICES ------------------- */}
        {activeTab === "services" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="font-display font-bold text-xl text-white">Services Profiles</h2>
              <button
                onClick={() => { setShowCreateForm(!showCreateForm); setEditingItemID(null); }}
                className="px-4 py-2 rounded-full bg-brand-cyan text-dark-bg font-semibold text-xs inline-flex items-center gap-1.5"
              >
                {showCreateForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showCreateForm ? "Close Form" : "Create Service Card"}
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleSaveService} className="bg-white/2 border border-white/6 p-6 rounded-2xl flex flex-col gap-4 animate-in">
                <input
                  type="text"
                  required
                  placeholder="Service Title"
                  value={srvTitle}
                  onChange={(e) => setSrvTitle(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <textarea
                  placeholder="Summary specifications"
                  value={srvDesc}
                  onChange={(e) => setSrvDesc(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Measurable benefits (comma separated)"
                  value={srvBenefits}
                  onChange={(e) => setSrvBenefits(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Sub technologies used"
                  value={srvStack}
                  onChange={(e) => setSrvStack(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Sample use-cases"
                  value={srvCases}
                  onChange={(e) => setSrvCases(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />
                <button type="submit" className="py-2 px-5 bg-brand-cyan text-dark-bg font-bold font-display rounded-lg text-xs self-start">
                  Save Service Shape
                </button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-white/5 uppercase text-gray-500 font-mono text-[9px] font-semibold">
                    <td className="py-3 px-2">Title</td>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/1">
                      <td className="py-3 px-2 font-semibold text-white">{s.title}</td>
                      <td className="py-3 px-2 text-right text-gray-400 flex items-center justify-end gap-2">
                        <button onClick={() => startEditService(s)} className="p-1 hover:text-brand-cyan">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteService(s.id!)} className="p-1 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------- TAB 6: SKILLS ------------------- */}
        {activeTab === "skills" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="font-display font-bold text-xl text-white">Skills Node Configurator</h2>
              <button
                onClick={() => { setShowCreateForm(!showCreateForm); setEditingItemID(null); }}
                className="px-4 py-2 rounded-full bg-brand-cyan text-dark-bg font-semibold text-xs inline-flex items-center gap-1.5"
              >
                {showCreateForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showCreateForm ? "Close" : "Register Skill Node"}
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleSaveSkill} className="bg-white/2 border border-white/6 p-6 rounded-2xl flex flex-col gap-4 animate-in">
                <input
                  type="text"
                  required
                  placeholder="Skill Tech Name (e.g. n8n.io)"
                  value={skName}
                  onChange={(e) => setSkName(e.target.value)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white"
                />

                <select
                  value={skCat}
                  onChange={(e) => setSkCat(e.target.value as any)}
                  className="bg-neutral-900 border border-white/8 rounded-lg p-2.5 text-xs text-white font-mono"
                >
                  <option value="Workflow Automation">Workflow Automation</option>
                  <option value="AI / Smart Integrations">AI / Smart Integrations</option>
                  <option value="Web Development">Web Development</option>
                  <option value="API / Backend">API / Backend</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                </select>

                <div className="flex items-center gap-4">
                  <span className="text-white text-xs font-mono">Expertise: {skLevel}%</span>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={skLevel}
                    onChange={(e) => setSkLevel(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                  />
                </div>

                <button type="submit" className="py-2 px-5 bg-brand-cyan text-dark-bg font-bold rounded-lg text-xs self-start">
                  Save Skill Node
                </button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-white/5 uppercase text-gray-500 font-mono text-[9px] font-semibold">
                    <td className="py-3 px-2">Skill Tech</td>
                    <td className="py-3 px-2">Category</td>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((s, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/1">
                      <td className="py-3 px-2 font-semibold text-white">{s.name} ({s.level}%)</td>
                      <td className="py-3 px-2 text-[10px] text-gray-500 font-mono">{s.category}</td>
                      <td className="py-3 px-2 text-right text-gray-400 flex items-center justify-end gap-2">
                        <button onClick={() => startEditSkill(s)} className="p-1 hover:text-brand-cyan">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteSkill(s.id!)} className="p-1 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------- TAB 7: LEADS ------------------- */}
        {activeTab === "leads" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-display font-bold text-xl text-white">Operational Inbound Queue</h2>
              <p className="text-gray-500 text-xs font-mono">Contact inquiries synced directly from active webpage lead forms:</p>
            </div>

            {leads.length === 0 ? (
              <div className="text-center py-20 text-gray-500 font-mono text-xs border border-dashed border-white/10 rounded-2xl">
                Operational Queue is empty. No prospects currently recorded.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {leads.map((lead, li) => (
                  <div key={li} className={`border rounded-2xl p-5 md:p-6 transition-all flex flex-col gap-4 ${
                    lead.status === "unread" ? "bg-brand-cyan/4 border-brand-cyan/25" : "bg-white/2 border-white/5"
                  }`}>
                    
                    {/* Header bar of lead */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/5 pb-3 font-mono text-[10px] uppercase text-gray-500 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-xs">{lead.name}</span>
                        <span>&bull;</span>
                        <a href={`mailto:${lead.email}`} className="text-brand-cyan underline leading-none">{lead.email}</a>
                      </div>
                      <span>Logged: {new Date(lead.createdAt).toLocaleString()}</span>
                    </div>

                    {/* Messages text content */}
                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap select-text">
                      {lead.message}
                    </div>

                    {/* Channels & metadata action tags */}
                    <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-gray-500 border-t border-white/5 pt-3">
                      <div className="flex gap-4">
                        {lead.phone && <span>PHONE: {lead.phone}</span>}
                        {lead.whatsapp && <span>WHATSAPP: {lead.whatsapp}</span>}
                      </div>

                      {/* Control keys */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleToggleLeadStatus(lead.id!, lead.status)}
                          className={`px-3 py-1.5 rounded-md hover:scale-103 font-bold cursor-pointer inline-flex items-center gap-1 shrink-0 ${
                            lead.status === "unread" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" : "bg-neutral-800 text-gray-400"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          {lead.status === "unread" ? "Mark Reviewed" : "Mark Unread"}
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteLead(lead.id!)}
                          className="p-1.5 rounded-md bg-neutral-800 text-gray-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------- TAB 8: SETTINGS ------------------- */}
        {activeTab === "settings" && (
          <>
            <form onSubmit={handleSaveSettings} className="flex flex-col gap-6 animate-fade-in">
            <div className="border-b border-white/5 pb-4 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-white">Profile & Platform Settings</h2>
                <p className="text-gray-500 text-xs font-mono">Bespoke branding customized for Ramachandran S. portfolio:</p>
              </div>
              <button
                type="submit"
                disabled={settingsSaving}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-display font-semibold text-xs tracking-wider uppercase transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                {settingsSaving ? "Saving Config..." : "Save Settings"}
              </button>
            </div>

            {settingsSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold animate-pulse">
                &bull; Success: Profile Configuration updated in Firestore securely!
              </div>
            )}

            {settingsError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-semibold">
                &bull; Error: {settingsError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Profile image column */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <span className="font-mono text-[10px] uppercase text-gray-400 font-semibold">Profile Photo</span>
                
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("border-brand-cyan/60");
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-brand-cyan/60");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-brand-cyan/60");
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      setSiteProfileFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setSiteProfileImg(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  onClick={() => document.getElementById("profile-file-input")?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-brand-cyan/40 rounded-3xl p-6 text-center cursor-pointer transition-all bg-neutral-900/40 relative flex flex-col items-center justify-center gap-3 aspect-square group overflow-hidden"
                >
                  <input 
                    type="file" 
                    id="profile-file-input" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSiteProfileFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSiteProfileImg(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {siteProfileImg ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img 
                        src={siteProfileImg} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-mono text-white">
                        Replace Photo
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-brand-cyan border border-white/8 transition-colors">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-display font-medium text-xs text-white">Drag & Drop Image</p>
                        <p className="font-mono text-[9px] text-gray-500 mt-1">PNG, JPG or WebP up to 1MB</p>
                      </div>
                    </>
                  )}
                </div>

                {siteProfileImg && (
                  <button
                    type="button"
                    onClick={() => { setSiteProfileImg(""); setSiteProfileFile(null); }}
                    className="text-center font-mono text-[10px] text-red-400 hover:text-red-300 py-1 cursor-pointer"
                  >
                    Remove and use Fallback Image
                  </button>
                )}
              </div>

              {/* Form entries */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 font-sans">
                    <label className="font-mono text-[10px] uppercase text-gray-400">Professional Name</label>
                    <input
                      type="text"
                      required
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="e.g. Ramachandran S."
                      className="bg-neutral-900/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none placeholder-gray-600"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 font-sans">
                    <label className="font-mono text-[10px] uppercase text-gray-400">Technical Role</label>
                    <input
                      type="text"
                      required
                      value={siteRole}
                      onChange={(e) => setSiteRole(e.target.value)}
                      placeholder="e.g. Automation & Web Systems Architect"
                      className="bg-neutral-900/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 font-sans">
                  <label className="font-mono text-[10px] uppercase text-gray-400">Home Title Heading</label>
                  <input
                    type="text"
                    required
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    placeholder="e.g. Building Web Applications & Automations That Replace Manual Work"
                    className="bg-neutral-900/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none placeholder-gray-600"
                  />
                </div>

                <div className="flex flex-col gap-1.5 font-sans">
                  <label className="font-mono text-[10px] uppercase text-gray-400">Sub-title Bio Statement</label>
                  <textarea
                    rows={2}
                    required
                    value={siteSubtitle}
                    onChange={(e) => setSiteSubtitle(e.target.value)}
                    placeholder="I help businesses streamline operations through custom web applications..."
                    className="bg-neutral-900/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none placeholder-gray-600 leading-relaxed resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 font-sans">
                  <label className="font-mono text-[10px] uppercase text-gray-400">Detailed About Bio</label>
                  <textarea
                    rows={4}
                    required
                    value={siteBio}
                    onChange={(e) => setSiteBio(e.target.value)}
                    placeholder="Experienced full-stack developer and solution architect specialized..."
                    className="bg-neutral-900/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none placeholder-gray-600 leading-relaxed resize-none"
                  />
                </div>

                <div className="border-t border-white/5 pt-6 my-2">
                  <h3 className="font-display font-medium text-xs text-indigo-400 mb-4 uppercase tracking-wider">Performance Statistics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5 font-sans">
                      <label className="font-mono text-[10px] text-gray-400">Projects Done</label>
                      <input
                        type="text"
                        value={siteCompletedProjects}
                        onChange={(e) => setSiteCompletedProjects(e.target.value)}
                        placeholder="45+"
                        className="bg-neutral-900/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 font-sans">
                      <label className="font-mono text-[10px] text-gray-400">Automized Pipelines</label>
                      <input
                        type="text"
                        value={siteProcessesAutomated}
                        onChange={(e) => setSiteProcessesAutomated(e.target.value)}
                        placeholder="110+"
                        className="bg-neutral-900/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 font-sans">
                      <label className="font-mono text-[10px] text-gray-400">Tech Modules</label>
                      <input
                        type="text"
                        value={siteTechStackModules}
                        onChange={(e) => setSiteTechStackModules(e.target.value)}
                        placeholder="24+"
                        className="bg-neutral-900/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 font-sans">
                      <label className="font-mono text-[10px] text-gray-400">Hours Saved / Month</label>
                      <input
                        type="text"
                        value={siteHoursShaved}
                        onChange={(e) => setSiteHoursShaved(e.target.value)}
                        placeholder="340h"
                        className="bg-neutral-900/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 my-2">
                  <h3 className="font-display font-medium text-xs text-indigo-400 mb-4 uppercase tracking-wider">Direct Channels & Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 font-sans">
                      <label className="font-mono text-[10px] text-gray-400">Public Contact Email</label>
                      <input
                        type="email"
                        required
                        value={siteEmail}
                        onChange={(e) => setSiteEmail(e.target.value)}
                        placeholder="ramachandran85966@gmail.com"
                        className="bg-neutral-900/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5 font-sans">
                      <label className="font-mono text-[10px] text-gray-400">Direct Telephone Number</label>
                      <input
                        type="text"
                        required
                        value={sitePhone}
                        onChange={(e) => setSitePhone(e.target.value)}
                        placeholder="+91 9080347710"
                        className="bg-neutral-900/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 font-sans">
                      <label className="font-mono text-[10px] text-gray-400">WhatsApp Mobile API</label>
                      <input
                        type="text"
                        required
                        value={siteWhatsapp}
                        onChange={(e) => setSiteWhatsapp(e.target.value)}
                        placeholder="+91 9080347710"
                        className="bg-neutral-900/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 font-sans">
                      <label className="font-mono text-[10px] text-gray-400">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        required
                        value={siteLinkedin}
                        onChange={(e) => setSiteLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="bg-neutral-900/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 font-sans">
                      <label className="font-mono text-[10px] text-gray-400">GitHub Profile URL</label>
                      <input
                        type="text"
                        required
                        value={siteGithub}
                        onChange={(e) => setSiteGithub(e.target.value)}
                        placeholder="https://github.com/username"
                        className="bg-neutral-900/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-brand-purple/40 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-4 justify-end">
                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-display font-semibold text-xs tracking-wider uppercase transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer"
                  >
                    {settingsSaving ? "Updating Profile..." : "Publish Brand Profile"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* ------------------- DIAGNOSTICS & STORAGE SYNC CENTER ------------------- */}
          <div className="mt-12 pt-10 border-t border-white/5 flex flex-col gap-6 animate-fade-in">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Firebase Storage & Assets Diagnostics Center</h3>
              <p className="text-gray-500 text-xs font-mono">Verify and keep all static portfolio files & image uploads stored directly inside your safe Firebase Storage:</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Control Panel */}
              <div className="lg:col-span-5 flex flex-col gap-4 bg-neutral-900/40 border border-white/5 rounded-2xl p-6">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase text-gray-500 font-semibold">Active Backend Details</span>
                  <div className="text-xs text-gray-300 font-mono flex flex-col gap-1.5 mt-2 bg-black/30 p-3 rounded-lg border border-white/5">
                    <div><strong className="text-indigo-400">Database ID:</strong> ai-studio-primary</div>
                    <div><strong className="text-indigo-400">Storage Bucket:</strong> portfolio-cf549.firebasestorage.app</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleMigrateAssets}
                    disabled={isMigrating}
                    className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 hover:from-cyan-500/20 hover:to-indigo-500/20 text-brand-cyan text-xs font-mono font-semibold uppercase tracking-wider transition-all border border-brand-cyan/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isMigrating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-t-transparent border-brand-cyan rounded-full animate-spin"></div>
                        Syncing Active Assets...
                      </>
                    ) : (
                      "Sync & Migrate Storage Assets"
                    )}
                  </button>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
                    Downloads any external or local Unsplash/asset images from projects, blogs, case studies, and your profile, and uploads them to your personal Firebase Storage bucket. Point-of-access database references will be automatically updated!
                  </p>
                </div>

                {migResultMsg && (
                  <div className={`p-4 rounded-xl text-xs font-mono font-medium leading-relaxed mt-2 ${
                    migResultMsg.toLowerCase().includes("denied") || migResultMsg.toLowerCase().includes("failed") 
                      ? "bg-red-500/10 border border-red-500/20 text-red-400" 
                      : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  }`}>
                    {migResultMsg}
                  </div>
                )}
              </div>

              {/* Console System Output */}
              <div className="lg:col-span-7 flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase text-gray-400 font-semibold">Diagnostic Output Log</span>
                <div className="bg-black/80 rounded-2xl p-5 border border-white/10 aspect-[16/9] lg:aspect-auto lg:h-[260px] overflow-y-auto font-mono text-[11px] text-zinc-400 flex flex-col gap-1 scrollbar-thin">
                  {migrationLogs.length === 0 ? (
                    <div className="text-zinc-600 italic">No output logs. Click "Sync & Migrate Storage Assets" to initiate diagnostic scanning.</div>
                  ) : (
                    migrationLogs.map((logStr, idx) => (
                      <div key={idx} className={logStr.includes("✅") ? "text-emerald-400" : logStr.includes("⚠️") ? "text-amber-400 font-medium" : logStr.includes("❌") ? "text-red-400 font-bold" : ""}>
                        {logStr}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Security Rules Help Center */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 flex flex-col gap-4 mt-2 font-sans">
              <div className="flex items-center gap-3 text-amber-500 font-display font-semibold text-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                How to Fix Permission / Storage Unauthorized Errors in Firebase Console
              </div>
              <p className="text-gray-400 text-xs leading-relaxed max-w-4xl">
                If the migration triggers an <strong>unauthorized (Permission Denied)</strong> exception, your Firebase project requires explicit Storage Rules updates. Since Storage security rules cannot be automatically deployed via API, follow these 3-step console instructions:
              </p>
              <ol className="list-decimal pl-5 text-gray-400 text-xs flex flex-col gap-2 mb-2">
                <li>Open your Firebase Console dashboard at <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline">https://console.firebase.google.com</a> and pick your active project.</li>
                <li>In the sidebar, locate and select the <strong>Storage</strong> product, and then switch to the <strong>"Rules"</strong> tab.</li>
                <li>Replace the existing rule blocks with the robust authenticated schema displayed below, and click the <strong>"Publish"</strong> button:</li>
              </ol>
              <pre className="bg-black/50 p-4 rounded-xl border border-white/5 text-[10px] text-zinc-300 font-mono overflow-x-auto leading-relaxed max-w-full">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`}
              </pre>
            </div>
          </div>
        </>
      )}

      </main>

      {/* Custom Non-blocking Deletion Confirmation Overlays (Iframe Failsafe) */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#121214] border border-white/10 max-w-sm w-full rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-400 border-b border-white/5 pb-3">
              <Trash2 className="w-5 h-5" />
              <span className="font-sans font-bold tracking-tight text-white">Confirm Deletion</span>
            </div>
            
            <div className="text-gray-300 text-xs leading-relaxed py-1">
              Are you sure you want to permanently delete this {deleteConfirm.type === "lead" ? "contact message" : deleteConfirm.type}?
              <div className="mt-2 bg-[#1a1a1e] border border-white/5 p-3 rounded-lg text-white font-mono text-[11px] truncate">
                {deleteConfirm.title}
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ isOpen: false, type: null, id: "", title: "" })}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
