"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./AdminPage.module.scss";

type PanelTab = "blog" | "education" | "requests";
type RequestTab = "feedback" | "educationRegistrations" | "consultationBookings";

interface AdminUser {
  id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface BlogPostItem {
  id?: number;
  external_id: string;
  slug: string;
  author: string;
  tags: string[];
  media_src: string;
  date_label_ru: string;
  date_label_bg: string;
  title_ru: string;
  title_bg: string;
  content_ru: string[];
  content_bg: string[];
  is_published: boolean;
}

interface EducationModuleItem {
  id?: number;
  sort_order: number;
  title_ru: string;
  title_bg: string;
  description_ru: string;
  description_bg: string;
}

interface EducationItem {
  id?: number;
  external_id: string;
  item_type: "course" | "webinar";
  slug: string;
  media_src: string;
  poster: string;
  title_ru: string;
  title_bg: string;
  description_ru: string;
  description_bg: string;
  start_date_ru: string;
  start_date_bg: string;
  price_ru: string;
  price_bg: string;
  level: "beginner" | "experienced" | "business";
  goal: "launch" | "taxes" | "profession" | "optimization";
  item_format: "online" | "live" | "offline";
  level_label_ru: string;
  level_label_bg: string;
  goal_label_ru: string;
  goal_label_bg: string;
  format_label_ru: string;
  format_label_bg: string;
  is_published: boolean;
  program: EducationModuleItem[];
}

interface FeedbackRequest {
  id: number;
  language: string;
  name: string;
  email: string;
  message: string;
  phone: string;
  source: string;
  created_at: string;
}

interface EducationRegistration {
  id: number;
  language: string;
  item_external_id: string;
  item_slug: string;
  item_title: string;
  item_type: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

interface ConsultationBooking {
  id: number;
  language: string;
  consultation_format: string;
  meeting_type: string;
  name: string;
  email: string;
  phone: string;
  selected_date: string;
  selected_time: string;
  total_amount_eur: string;
  status: string;
  created_at: string;
}

const AUTH_KEY = "admin.basicAuthToken";
const USERNAME_KEY = "admin.username";

function readSessionValue(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.sessionStorage.getItem(key);
}

const emptyBlogPost = (): BlogPostItem => ({
  external_id: "",
  slug: "",
  author: "",
  tags: [],
  media_src: "",
  date_label_ru: "",
  date_label_bg: "",
  title_ru: "",
  title_bg: "",
  content_ru: [],
  content_bg: [],
  is_published: true,
});

const emptyEducation = (): EducationItem => ({
  external_id: "",
  item_type: "course",
  slug: "",
  media_src: "",
  poster: "",
  title_ru: "",
  title_bg: "",
  description_ru: "",
  description_bg: "",
  start_date_ru: "",
  start_date_bg: "",
  price_ru: "",
  price_bg: "",
  level: "beginner",
  goal: "launch",
  item_format: "online",
  level_label_ru: "",
  level_label_bg: "",
  goal_label_ru: "",
  goal_label_bg: "",
  format_label_ru: "",
  format_label_bg: "",
  is_published: true,
  program: [],
});

function resolveApiAdminBase(): string {
  const fallback = "http://localhost:8000";
  const raw = process.env.NEXT_PUBLIC_API_URL || `${fallback}/api`;

  try {
    const url = new URL(raw);
    return `${url.origin}/api/admin`;
  } catch {
    const withoutApi = raw.replace(/\/api\/?$/, "");
    return `${withoutApi}/api/admin`;
  }
}

const ADMIN_API_BASE = resolveApiAdminBase();

export default function AdminPage() {
  const [tab, setTab] = useState<PanelTab>("blog");
  const [requestTab, setRequestTab] = useState<RequestTab>("feedback");
  const [username, setUsername] = useState(() => readSessionValue(USERNAME_KEY) || "");
  const [password, setPassword] = useState("");
  const [authHeader, setAuthHeader] = useState<string | null>(() => readSessionValue(AUTH_KEY));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>([]);
  const [selectedBlogId, setSelectedBlogId] = useState<number | "new">("new");
  const [blogDraft, setBlogDraft] = useState<BlogPostItem>(emptyBlogPost());
  const [blogTagsJson, setBlogTagsJson] = useState("[]");
  const [blogContentRuJson, setBlogContentRuJson] = useState("[]");
  const [blogContentBgJson, setBlogContentBgJson] = useState("[]");

  const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
  const [selectedEducationId, setSelectedEducationId] = useState<number | "new">("new");
  const [educationDraft, setEducationDraft] = useState<EducationItem>(emptyEducation());

  const [feedbackRequests, setFeedbackRequests] = useState<FeedbackRequest[]>([]);
  const [educationRegistrations, setEducationRegistrations] = useState<EducationRegistration[]>([]);
  const [consultationBookings, setConsultationBookings] = useState<ConsultationBooking[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authHeader) {
      return;
    }

    void bootstrapAdmin(authHeader);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeader]);

  const currentRequestItems = useMemo(() => {
    if (requestTab === "feedback") {
      return feedbackRequests;
    }
    if (requestTab === "educationRegistrations") {
      return educationRegistrations;
    }
    return consultationBookings;
  }, [requestTab, feedbackRequests, educationRegistrations, consultationBookings]);

  async function adminFetch<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${ADMIN_API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
        ...(init.headers || {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(errorText || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  }

  async function bootstrapAdmin(token: string) {
    try {
      setLoading(true);
      setError(null);

      const user = await adminFetch<AdminUser>("/me/", token);
      setAdminUser(user);
      await Promise.all([loadBlogPosts(token), loadEducationItems(token), loadRequests(token)]);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  }

  function handleAuthError(err: unknown) {
    setAdminUser(null);
    setAuthHeader(null);
    window.sessionStorage.removeItem(AUTH_KEY);
    window.sessionStorage.removeItem(USERNAME_KEY);
    setError(err instanceof Error ? err.message : "Authorization failed");
  }

  async function onLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError(null);
      setSuccess(null);
      setLoading(true);

      const token = btoa(`${username}:${password}`);
      await adminFetch<AdminUser>("/me/", token);
      setAuthHeader(token);
      window.sessionStorage.setItem(AUTH_KEY, token);
      window.sessionStorage.setItem(USERNAME_KEY, username);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setAdminUser(null);
    setAuthHeader(null);
    setPassword("");
    setError(null);
    setSuccess(null);
    window.sessionStorage.removeItem(AUTH_KEY);
    window.sessionStorage.removeItem(USERNAME_KEY);
  }

  async function loadBlogPosts(token: string) {
    const data = await adminFetch<BlogPostItem[]>("/content/blog-posts/", token);
    setBlogPosts(data);
    setSelectedBlogId("new");
    setBlogDraft(emptyBlogPost());
    setBlogTagsJson("[]");
    setBlogContentRuJson("[]");
    setBlogContentBgJson("[]");
  }

  async function loadEducationItems(token: string) {
    const data = await adminFetch<EducationItem[]>("/content/education-items/", token);
    setEducationItems(data);
    setSelectedEducationId("new");
    setEducationDraft(emptyEducation());
  }

  async function loadRequests(token: string) {
    const [feedback, registrations, bookings] = await Promise.all([
      adminFetch<FeedbackRequest[]>("/requests/feedback/", token),
      adminFetch<EducationRegistration[]>("/requests/education-registrations/", token),
      adminFetch<ConsultationBooking[]>("/requests/consultation-bookings/", token),
    ]);

    setFeedbackRequests(feedback);
    setEducationRegistrations(registrations);
    setConsultationBookings(bookings);
  }

  function selectBlog(id: number | "new") {
    setSelectedBlogId(id);
    if (id === "new") {
      const fresh = emptyBlogPost();
      setBlogDraft(fresh);
      setBlogTagsJson("[]");
      setBlogContentRuJson("[]");
      setBlogContentBgJson("[]");
      return;
    }

    const match = blogPosts.find((item) => item.id === id);
    if (!match) {
      return;
    }

    setBlogDraft(match);
    setBlogTagsJson(JSON.stringify(match.tags, null, 2));
    setBlogContentRuJson(JSON.stringify(match.content_ru, null, 2));
    setBlogContentBgJson(JSON.stringify(match.content_bg, null, 2));
  }

  function selectEducation(id: number | "new") {
    setSelectedEducationId(id);
    if (id === "new") {
      setEducationDraft(emptyEducation());
      return;
    }
    const match = educationItems.find((item) => item.id === id);
    if (match) {
      setEducationDraft(match);
    }
  }

  function updateEducationProgram(index: number, field: keyof EducationModuleItem, value: string | number) {
    setEducationDraft((prev) => {
      const updatedProgram = [...prev.program];
      const current = updatedProgram[index];
      updatedProgram[index] = {
        ...current,
        [field]: value,
      };
      return {
        ...prev,
        program: updatedProgram,
      };
    });
  }

  function addProgramModule() {
    setEducationDraft((prev) => ({
      ...prev,
      program: [
        ...prev.program,
        {
          sort_order: prev.program.length,
          title_ru: "",
          title_bg: "",
          description_ru: "",
          description_bg: "",
        },
      ],
    }));
  }

  function removeProgramModule(index: number) {
    setEducationDraft((prev) => ({
      ...prev,
      program: prev.program.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function saveBlogPost() {
    if (!authHeader) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload: BlogPostItem = {
        ...blogDraft,
        tags: JSON.parse(blogTagsJson) as string[],
        content_ru: JSON.parse(blogContentRuJson) as string[],
        content_bg: JSON.parse(blogContentBgJson) as string[],
      };

      const method = payload.id ? "PUT" : "POST";
      const path = payload.id ? `/content/blog-posts/${payload.id}/` : "/content/blog-posts/";

      await adminFetch(path, authHeader, {
        method,
        body: JSON.stringify(payload),
      });

      await loadBlogPosts(authHeader);
      setSuccess("Blog post saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save blog post");
    } finally {
      setLoading(false);
    }
  }

  async function deleteBlogPost() {
    if (!authHeader || !blogDraft.id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await adminFetch(`/content/blog-posts/${blogDraft.id}/`, authHeader, {
        method: "DELETE",
      });
      await loadBlogPosts(authHeader);
      setSuccess("Blog post deleted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog post");
    } finally {
      setLoading(false);
    }
  }

  async function saveEducationItem() {
    if (!authHeader) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload: EducationItem = {
        ...educationDraft,
        program: educationDraft.program.map((moduleItem, index) => ({
          ...moduleItem,
          sort_order: moduleItem.sort_order ?? index,
        })),
      };

      const method = payload.id ? "PUT" : "POST";
      const path = payload.id ? `/content/education-items/${payload.id}/` : "/content/education-items/";

      await adminFetch(path, authHeader, {
        method,
        body: JSON.stringify(payload),
      });

      await loadEducationItems(authHeader);
      setSuccess("Education item saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save education item");
    } finally {
      setLoading(false);
    }
  }

  async function deleteEducationItem() {
    if (!authHeader || !educationDraft.id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await adminFetch(`/content/education-items/${educationDraft.id}/`, authHeader, {
        method: "DELETE",
      });
      await loadEducationItems(authHeader);
      setSuccess("Education item deleted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete education item");
    } finally {
      setLoading(false);
    }
  }

  if (!adminUser) {
    return (
      <section className={`${styles.wrapper} ${styles.authWrapper}`}>
        <div className={styles.authCard}>
          <h1>Admin Panel</h1>
          <form onSubmit={onLoginSubmit} className={styles.authForm}>
            <label>
              Username
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin"
                autoComplete="username"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit" disabled={loading} className={styles.primaryButton}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {error ? <p className={styles.error}>{error}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.topBar}>
        <div>
          <h1>Admin Panel</h1>
          <p className={styles.subtitle}>Manage website content and incoming requests</p>
        </div>

        <div className={styles.userBox}>
          <span>{adminUser.username}</span>
          <button className={styles.secondaryButton} onClick={logout} type="button">
            Log out
          </button>
        </div>
      </div>

      <nav className={styles.tabs}>
        <button className={tab === "blog" ? styles.activeTab : ""} onClick={() => setTab("blog")} type="button">
          Blog
        </button>
        <button className={tab === "education" ? styles.activeTab : ""} onClick={() => setTab("education")} type="button">
          Education
        </button>
        <button className={tab === "requests" ? styles.activeTab : ""} onClick={() => setTab("requests")} type="button">
          Requests
        </button>
      </nav>

      {error ? <p className={styles.error}>{error}</p> : null}
      {success ? <p className={styles.success}>{success}</p> : null}

      {tab === "blog" ? (
        <div className={styles.grid}>
          <aside className={styles.listCard}>
            <div className={styles.sectionHeader}>
              <h2>Blog Posts</h2>
              <button type="button" onClick={() => selectBlog("new")} className={styles.secondaryButton}>
                New
              </button>
            </div>
            <ul>
              {blogPosts.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={selectedBlogId === item.id ? styles.selectedListItem : ""}
                    onClick={() => selectBlog(item.id as number)}
                  >
                    {item.slug}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className={styles.formCard}>
            <h2>{blogDraft.id ? "Edit blog post" : "Create blog post"}</h2>
            <div className={styles.formGridThree}>
              <label>
                External ID
                <input
                  value={blogDraft.external_id}
                  onChange={(event) => setBlogDraft({ ...blogDraft, external_id: event.target.value })}
                />
              </label>
              <label>
                Slug
                <input value={blogDraft.slug} onChange={(event) => setBlogDraft({ ...blogDraft, slug: event.target.value })} />
              </label>
              <label>
                Author
                <input
                  value={blogDraft.author}
                  onChange={(event) => setBlogDraft({ ...blogDraft, author: event.target.value })}
                />
              </label>
            </div>

            <div className={styles.formGridThree}>
              <label>
                Date RU
                <input
                  value={blogDraft.date_label_ru}
                  onChange={(event) => setBlogDraft({ ...blogDraft, date_label_ru: event.target.value })}
                />
              </label>
              <label>
                Date BG
                <input
                  value={blogDraft.date_label_bg}
                  onChange={(event) => setBlogDraft({ ...blogDraft, date_label_bg: event.target.value })}
                />
              </label>
              <label>
                Published
                <select
                  value={String(blogDraft.is_published)}
                  onChange={(event) =>
                    setBlogDraft({ ...blogDraft, is_published: event.target.value === "true" })
                  }
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                Title RU
                <input
                  value={blogDraft.title_ru}
                  onChange={(event) => setBlogDraft({ ...blogDraft, title_ru: event.target.value })}
                />
              </label>
              <label>
                Title BG
                <input
                  value={blogDraft.title_bg}
                  onChange={(event) => setBlogDraft({ ...blogDraft, title_bg: event.target.value })}
                />
              </label>
            </div>

            <label>
              Media source
              <input
                value={blogDraft.media_src}
                onChange={(event) => setBlogDraft({ ...blogDraft, media_src: event.target.value })}
              />
            </label>

            <div className={styles.formGrid}>
              <label>
                Tags JSON
                <textarea value={blogTagsJson} onChange={(event) => setBlogTagsJson(event.target.value)} />
              </label>
              <label>
                Content RU JSON
                <textarea value={blogContentRuJson} onChange={(event) => setBlogContentRuJson(event.target.value)} />
              </label>
            </div>

            <label>
              Content BG JSON
              <textarea value={blogContentBgJson} onChange={(event) => setBlogContentBgJson(event.target.value)} />
            </label>

            <div className={styles.actions}>
              <button type="button" className={styles.primaryButton} onClick={saveBlogPost} disabled={loading}>
                Save
              </button>
              <button
                type="button"
                className={styles.dangerButton}
                onClick={deleteBlogPost}
                disabled={loading || !blogDraft.id}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "education" ? (
        <div className={styles.grid}>
          <aside className={styles.listCard}>
            <div className={styles.sectionHeader}>
              <h2>Education</h2>
              <button type="button" onClick={() => selectEducation("new")} className={styles.secondaryButton}>
                New
              </button>
            </div>
            <ul>
              {educationItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={selectedEducationId === item.id ? styles.selectedListItem : ""}
                    onClick={() => selectEducation(item.id as number)}
                  >
                    {item.slug}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className={styles.formCard}>
            <h2>{educationDraft.id ? "Edit education item" : "Create education item"}</h2>
            <div className={styles.formGridThree}>
              <label>
                External ID
                <input
                  value={educationDraft.external_id}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, external_id: event.target.value })
                  }
                />
              </label>
              <label>
                Type
                <select
                  value={educationDraft.item_type}
                  onChange={(event) =>
                    setEducationDraft({
                      ...educationDraft,
                      item_type: event.target.value as EducationItem["item_type"],
                    })
                  }
                >
                  <option value="course">Course</option>
                  <option value="webinar">Webinar</option>
                </select>
              </label>
              <label>
                Published
                <select
                  value={String(educationDraft.is_published)}
                  onChange={(event) =>
                    setEducationDraft({
                      ...educationDraft,
                      is_published: event.target.value === "true",
                    })
                  }
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>

            <div className={styles.formGridThree}>
              <label>
                Slug
                <input
                  value={educationDraft.slug}
                  onChange={(event) => setEducationDraft({ ...educationDraft, slug: event.target.value })}
                />
              </label>
              <label>
                Media source
                <input
                  value={educationDraft.media_src}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, media_src: event.target.value })
                  }
                />
              </label>
              <label>
                Poster
                <input
                  value={educationDraft.poster}
                  onChange={(event) => setEducationDraft({ ...educationDraft, poster: event.target.value })}
                />
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                Title RU
                <input
                  value={educationDraft.title_ru}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, title_ru: event.target.value })
                  }
                />
              </label>
              <label>
                Title BG
                <input
                  value={educationDraft.title_bg}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, title_bg: event.target.value })
                  }
                />
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                Description RU
                <textarea
                  value={educationDraft.description_ru}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, description_ru: event.target.value })
                  }
                />
              </label>
              <label>
                Description BG
                <textarea
                  value={educationDraft.description_bg}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, description_bg: event.target.value })
                  }
                />
              </label>
            </div>

            <div className={styles.formGridThree}>
              <label>
                Start RU
                <input
                  value={educationDraft.start_date_ru}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, start_date_ru: event.target.value })
                  }
                />
              </label>
              <label>
                Start BG
                <input
                  value={educationDraft.start_date_bg}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, start_date_bg: event.target.value })
                  }
                />
              </label>
              <label>
                Price RU
                <input
                  value={educationDraft.price_ru}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, price_ru: event.target.value })
                  }
                />
              </label>
            </div>

            <div className={styles.formGridThree}>
              <label>
                Price BG
                <input
                  value={educationDraft.price_bg}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, price_bg: event.target.value })
                  }
                />
              </label>
              <label>
                Level
                <select
                  value={educationDraft.level}
                  onChange={(event) =>
                    setEducationDraft({
                      ...educationDraft,
                      level: event.target.value as EducationItem["level"],
                    })
                  }
                >
                  <option value="beginner">Beginner</option>
                  <option value="experienced">Experienced</option>
                  <option value="business">Business</option>
                </select>
              </label>
              <label>
                Goal
                <select
                  value={educationDraft.goal}
                  onChange={(event) =>
                    setEducationDraft({
                      ...educationDraft,
                      goal: event.target.value as EducationItem["goal"],
                    })
                  }
                >
                  <option value="launch">Launch</option>
                  <option value="taxes">Taxes</option>
                  <option value="profession">Profession</option>
                  <option value="optimization">Optimization</option>
                </select>
              </label>
            </div>

            <div className={styles.formGridThree}>
              <label>
                Format
                <select
                  value={educationDraft.item_format}
                  onChange={(event) =>
                    setEducationDraft({
                      ...educationDraft,
                      item_format: event.target.value as EducationItem["item_format"],
                    })
                  }
                >
                  <option value="online">Online</option>
                  <option value="live">Live</option>
                  <option value="offline">Offline</option>
                </select>
              </label>
              <label>
                Level Label RU
                <input
                  value={educationDraft.level_label_ru}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, level_label_ru: event.target.value })
                  }
                />
              </label>
              <label>
                Level Label BG
                <input
                  value={educationDraft.level_label_bg}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, level_label_bg: event.target.value })
                  }
                />
              </label>
            </div>

            <div className={styles.formGridThree}>
              <label>
                Goal Label RU
                <input
                  value={educationDraft.goal_label_ru}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, goal_label_ru: event.target.value })
                  }
                />
              </label>
              <label>
                Goal Label BG
                <input
                  value={educationDraft.goal_label_bg}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, goal_label_bg: event.target.value })
                  }
                />
              </label>
              <label>
                Format Label RU
                <input
                  value={educationDraft.format_label_ru}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, format_label_ru: event.target.value })
                  }
                />
              </label>
            </div>

            <label>
              Format Label BG
              <input
                value={educationDraft.format_label_bg}
                onChange={(event) =>
                  setEducationDraft({ ...educationDraft, format_label_bg: event.target.value })
                }
              />
            </label>

            <div className={styles.programBlock}>
              <div className={styles.sectionHeader}>
                <h3>Program Modules</h3>
                <button type="button" className={styles.secondaryButton} onClick={addProgramModule}>
                  Add module
                </button>
              </div>

              {educationDraft.program.length === 0 ? <p>No modules yet</p> : null}

              {educationDraft.program.map((moduleItem, index) => (
                <div key={index} className={styles.programItem}>
                  <div className={styles.formGridThree}>
                    <label>
                      Sort
                      <input
                        type="number"
                        value={moduleItem.sort_order}
                        onChange={(event) =>
                          updateEducationProgram(index, "sort_order", Number(event.target.value))
                        }
                      />
                    </label>
                    <label>
                      Title RU
                      <input
                        value={moduleItem.title_ru}
                        onChange={(event) =>
                          updateEducationProgram(index, "title_ru", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Title BG
                      <input
                        value={moduleItem.title_bg}
                        onChange={(event) =>
                          updateEducationProgram(index, "title_bg", event.target.value)
                        }
                      />
                    </label>
                  </div>

                  <div className={styles.formGrid}>
                    <label>
                      Description RU
                      <textarea
                        value={moduleItem.description_ru}
                        onChange={(event) =>
                          updateEducationProgram(index, "description_ru", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Description BG
                      <textarea
                        value={moduleItem.description_bg}
                        onChange={(event) =>
                          updateEducationProgram(index, "description_bg", event.target.value)
                        }
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    className={styles.linkDanger}
                    onClick={() => removeProgramModule(index)}
                  >
                    Remove module
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.primaryButton} onClick={saveEducationItem} disabled={loading}>
                Save
              </button>
              <button
                type="button"
                className={styles.dangerButton}
                onClick={deleteEducationItem}
                disabled={loading || !educationDraft.id}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "requests" ? (
        <div className={styles.requestsCard}>
          <div className={styles.sectionHeader}>
            <h2>Incoming Requests</h2>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => authHeader && void loadRequests(authHeader)}
            >
              Refresh
            </button>
          </div>

          <div className={styles.requestsTabs}>
            <button
              className={requestTab === "feedback" ? styles.activeTab : ""}
              onClick={() => setRequestTab("feedback")}
              type="button"
            >
              Feedback ({feedbackRequests.length})
            </button>
            <button
              className={requestTab === "educationRegistrations" ? styles.activeTab : ""}
              onClick={() => setRequestTab("educationRegistrations")}
              type="button"
            >
              Education ({educationRegistrations.length})
            </button>
            <button
              className={requestTab === "consultationBookings" ? styles.activeTab : ""}
              onClick={() => setRequestTab("consultationBookings")}
              type="button"
            >
              Consultations ({consultationBookings.length})
            </button>
          </div>

          {currentRequestItems.length === 0 ? (
            <p>No records yet</p>
          ) : (
            <ul className={styles.requestList}>
              {currentRequestItems.map((item) => (
                <li key={item.id} className={styles.requestItem}>
                  <div className={styles.requestMeta}>
                    <strong>#{item.id}</strong>
                    <span>{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                  <pre>{JSON.stringify(item, null, 2)}</pre>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </section>
  );
}
