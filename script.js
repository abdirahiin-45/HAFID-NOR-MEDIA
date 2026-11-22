/* =========================================================
   HAFID NOR MEDIA — COMPLETE FIXED JAVASCRIPT
   Somali | English | Arabic
   Supabase Auth | Owner publishing | News | Newsletter
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* 1. SUPABASE CONFIGURATION */
  const SUPABASE_URL = "https://yracqbffyieivvnhbfgj.supabase.co";

  const SUPABASE_KEY = "sb_publishable_CfxX2L9_QOgJX1Y6WQ3yZA_KmA62nG_";

  const OWNER_ID = "98ca9b87-8a68-4093-a4a9-1d7e5cde3048";

  const NEWS_TABLE = "news";
  const SUBMISSIONS_TABLE = "news_submissions";
  const PROFILE_TABLE = "profiles";
  const NEWSLETTER_TABLE = "newsletter_subscribers";
  const STORAGE_BUCKET = "news-images";

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  const $ = (selector, parent = document) => parent.querySelector(selector);

  const $$ = (selector, parent = document) => [
    ...parent.querySelectorAll(selector),
  ];

  const byId = (id) => document.getElementById(id);

  let db = null;
  let currentUser = null;
  let currentProfile = null;
  let currentNews = [];

  let currentLanguage =
    localStorage.getItem("hafid-language") ||
    localStorage.getItem("hafidLanguage") ||
    "so";

  let authReady = false;
  let authEventQueue = Promise.resolve();

  /* 2. TRANSLATIONS */

  const translations = {
    so: {
      home: "Bogga Hore",
      about: "Nagu Saabsan",
      news: "Wararka",
      contact: "Nala Soo Xiriir",
      account: "Akoon",
      search: "Raadi",
      breaking: "WAR DEGDEG AH",
      latestNews: "Wararkii Ugu Dambeeyay",
      topStories: "Wararka Ugu Muhiimsan",
      allNews: "Dhammaan Wararka",
      readNews: "Akhri Warka",
      colors: "Midabada",
      customize: "Hagaaji Website-ka",
      chooseColor: "Dooro midabka website-ka",
      mainColor: "Midabka Koowaad",
      accentColor: "Midabka Labaad",
      resetColors: "Dib u celi midabada",
      subscribe: "Isdiiwaangeli",
      newsletterTitle: "Hel Wararkii Ugu Dambeeyay",
      newsletterDescription: "La soco wararka cusub ee HAFID NOR MEDIA.",
      emailPlaceholder: "Geli email-kaaga",
      copyright: "Xuquuqda oo dhan way dhowran tahay.",
      backTop: "Kor u noqo",
      somalia: "Soomaaliya",
      world: "Caalamka",
      politics: "Siyaasadda",
      business: "Dhaqaalaha",
      sports: "Ciyaaraha",
      technology: "Tiknoolajiyadda",
      videos: "Muuqaallo",
      privacy: "Xeerka Asturnaanta",
      terms: "Shuruudaha Adeegga",
      readSource: "Isha warka",
      close: "Xir",
      noNews: "Weli wax warar ah lama daabicin.",
      loading: "Wararka ayaa la soo rarayaa...",
      wait: "Fadlan sug...",
      invalidEmail: "Fadlan geli email sax ah.",
      emailRequired: "Fadlan geli email-kaaga.",
      subscribed: "Waad ku mahadsan tahay isdiiwaangelintaada!",
      duplicateEmail: "Email-kan hore ayaa loo diiwaangeliyey.",
      subscribeError: "Isdiiwaangelintu way fashilantay.",
      login: "Gal Akoonka",
      logout: "Ka bax",
      owner: "Owner / Maamule",
      member: "Xubin",
      publishSuccess: "Warka si guul leh ayaa loo daabacay.",
      noPermission: "Ogolaansho ma lihid.",
      emptyFields: "Fadlan buuxi meelaha loo baahan yahay.",
      invalidLogin: "Email ama password khaldan.",
      registerSuccess:
        "Akoonka waa la sameeyay. Hubi email-kaaga haddii xaqiijin lagaa rabo.",
      passwordMismatch: "Labada password isma laha.",
      passwordShort: "Password-ku waa inuu ugu yaraan 8 xaraf ahaadaa.",
      imageOnly: "Fadlan dooro sawir JPG, PNG, WebP ama GIF ah.",
      imageLarge: "Sawirku waa inuusan ka weynaan 5MB.",
      pending: "Sugaya",
      approved: "La oggolaaday",
      rejected: "La diiday",
      noPending: "Ma jiraan warar sugaya oggolaansho.",
    },

    en: {
      home: "Home",
      about: "About Us",
      news: "News",
      contact: "Contact Us",
      account: "Account",
      search: "Search",
      breaking: "BREAKING NEWS",
      latestNews: "Latest News",
      topStories: "Top Stories",
      allNews: "All News",
      readNews: "Read More",
      colors: "Colors",
      customize: "Customize Website",
      chooseColor: "Choose website colors",
      mainColor: "Primary Color",
      accentColor: "Accent Color",
      resetColors: "Reset Colors",
      subscribe: "Subscribe",
      newsletterTitle: "Get the Latest News",
      newsletterDescription: "Stay updated with HAFID NOR MEDIA.",
      emailPlaceholder: "Enter your email",
      copyright: "All rights reserved.",
      backTop: "Back to top",
      somalia: "Somalia",
      world: "World",
      politics: "Politics",
      business: "Business",
      sports: "Sports",
      technology: "Technology",
      videos: "Videos",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      readSource: "News source",
      close: "Close",
      noNews: "No news has been published yet.",
      loading: "Loading news...",
      wait: "Please wait...",
      invalidEmail: "Please enter a valid email address.",
      emailRequired: "Please enter your email.",
      subscribed: "Thank you for subscribing!",
      duplicateEmail: "This email is already subscribed.",
      subscribeError: "Subscription failed.",
      login: "Login",
      logout: "Logout",
      owner: "Owner / Administrator",
      member: "Member",
      publishSuccess: "News published successfully.",
      noPermission: "You do not have permission.",
      emptyFields: "Please complete the required fields.",
      invalidLogin: "Incorrect email or password.",
      registerSuccess: "Account created. Verify your email if requested.",
      passwordMismatch: "Passwords do not match.",
      passwordShort: "Password must contain at least 8 characters.",
      imageOnly: "Choose a JPG, PNG, WebP or GIF image.",
      imageLarge: "Image must be 5MB or smaller.",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      noPending: "There are no pending submissions.",
    },

    ar: {
      home: "الرئيسية",
      about: "من نحن",
      news: "الأخبار",
      contact: "اتصل بنا",
      account: "الحساب",
      search: "بحث",
      breaking: "أخبار عاجلة",
      latestNews: "آخر الأخبار",
      topStories: "أهم الأخبار",
      allNews: "جميع الأخبار",
      readNews: "اقرأ الخبر",
      colors: "الألوان",
      customize: "تخصيص الموقع",
      chooseColor: "اختر ألوان الموقع",
      mainColor: "اللون الأساسي",
      accentColor: "اللون الإضافي",
      resetColors: "إعادة تعيين الألوان",
      subscribe: "اشترك",
      newsletterTitle: "احصل على آخر الأخبار",
      newsletterDescription: "تابع آخر أخبار HAFID NOR MEDIA.",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      copyright: "جميع الحقوق محفوظة.",
      backTop: "العودة للأعلى",
      somalia: "الصومال",
      world: "العالم",
      politics: "السياسة",
      business: "الاقتصاد",
      sports: "الرياضة",
      technology: "التكنولوجيا",
      videos: "الفيديوهات",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      readSource: "مصدر الخبر",
      close: "إغلاق",
      noNews: "لم يتم نشر أي أخبار بعد.",
      loading: "جارٍ تحميل الأخبار...",
      wait: "يرجى الانتظار...",
      invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
      emailRequired: "يرجى إدخال بريدك الإلكتروني.",
      subscribed: "شكراً لاشتراكك!",
      duplicateEmail: "هذا البريد مسجل بالفعل.",
      subscribeError: "فشل الاشتراك.",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      owner: "المالك / المدير",
      member: "عضو",
      publishSuccess: "تم نشر الخبر بنجاح.",
      noPermission: "ليس لديك إذن.",
      emptyFields: "يرجى ملء الحقول المطلوبة.",
      invalidLogin: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      registerSuccess:
        "تم إنشاء الحساب. يرجى تأكيد بريدك الإلكتروني إذا طُلب منك ذلك.",
      passwordMismatch: "كلمتا المرور غير متطابقتين.",
      passwordShort: "يجب ألا تقل كلمة المرور عن 8 أحرف.",
      imageOnly: "اختر صورة JPG أو PNG أو WebP أو GIF.",
      imageLarge: "يجب ألا يتجاوز حجم الصورة 5 ميجابايت.",
      pending: "قيد الانتظار",
      approved: "تمت الموافقة",
      rejected: "مرفوض",
      noPending: "لا توجد أخبار بانتظار الموافقة.",
    },
  };

  /* 3. HELPER FUNCTIONS */

  const t = (key) =>
    translations[currentLanguage]?.[key] ?? translations.so[key] ?? key;

  const escapeHTML = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );

  const getValue = (...ids) => {
    for (const id of ids) {
      const el = byId(id);
      if (el && "value" in el) {
        return String(el.value).trim();
      }
    }
    return "";
  };

  const setText = (id, value) => {
    const el = byId(id);
    if (el) el.textContent = value ?? "";
  };

  function message(el, text, type = "info") {
    if (!el) return;

    el.textContent = text;
    el.className = `form-message ${type}`;
    el.hidden = false;
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
  }

  function clearMessage(el) {
    if (el) {
      el.textContent = "";
      el.hidden = true;
      el.className = "form-message";
    }
  }

  function setLoading(button, loading, fallback = "Submit") {
    if (!button) return;

    if (loading) {
      if (!button.dataset.originalHtml) {
        button.dataset.originalHtml = button.innerHTML;
      }

      button.disabled = true;
      button.textContent = t("wait");
    } else {
      button.disabled = false;

      if (button.dataset.originalHtml) {
        button.innerHTML = button.dataset.originalHtml;
        delete button.dataset.originalHtml;
      } else {
        button.textContent = fallback;
      }
    }
  }

  function safeHttpUrl(value) {
    if (!value) return "";

    try {
      const url = new URL(value);

      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function validEmail(value) {
    const email = String(value || "").trim();

    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(
      email,
    );
  }

  function dateText(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString(
      { so: "so-SO", en: "en-US", ar: "ar" }[currentLanguage],
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  }

  function summary(value) {
    const text = String(value || "").trim();

    return text.length > 190 ? `${text.slice(0, 190)}…` : text;
  }

  function isOwner() {
    return Boolean(currentUser && currentUser.id === OWNER_ID);
  }

  function showDashboard(show) {
    const el = byId("memberDashboard");

    if (el) {
      el.hidden = !show;
      el.style.display = show ? "" : "none";
    }
  }

  /* 4. SUPABASE CLIENT */

  if (
    window.supabase?.createClient &&
    SUPABASE_KEY.startsWith("sb_") &&
    !SUPABASE_KEY.includes("PASTE_")
  ) {
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  } else {
    console.error(
      "Supabase lama bilaabin: geli publishable key-ga saxda ah ee project yracqbffyieivvnhbfgj.",
    );
  }

  /* 5. DATE AND LANGUAGE */

  function updateDate() {
    const el = byId("currentDate");

    if (el) {
      el.textContent = new Date().toLocaleDateString(
        { so: "so-SO", en: "en-US", ar: "ar" }[currentLanguage],
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      );
    }

    setText("currentYear", new Date().getFullYear());
    setText("loginYear", new Date().getFullYear());
  }

  function applyLanguage(language) {
    currentLanguage = translations[language] ? language : "so";

    document.documentElement.lang = currentLanguage;

    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

    $$("[data-i18n], [data-translate]").forEach((el) => {
      const key = el.dataset.i18n || el.dataset.translate;

      if (translations[currentLanguage][key]) {
        el.textContent = translations[currentLanguage][key];
      }
    });

    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;

      if (translations[currentLanguage][key]) {
        el.placeholder = translations[currentLanguage][key];
      }
    });

    const select = byId("languageSelect");

    if (select) {
      select.value = currentLanguage;
    }

    localStorage.setItem("hafid-language", currentLanguage);
    localStorage.setItem("hafidLanguage", currentLanguage);

    updateDate();
    renderPublishedNews(currentNews);
    renderDashboardNews(currentNews);
  }

  const languageSelect = byId("languageSelect");

  if (languageSelect) {
    languageSelect.addEventListener("change", () => {
      applyLanguage(languageSelect.value);
    });
  }

  applyLanguage(currentLanguage);

  /* 6. MOBILE NAVIGATION */

  const menuToggle = byId("menuToggle");
  const mainNav = byId("mainNav");

  function closeMenu() {
    mainNav?.classList.remove("active", "show");
    menuToggle?.classList.remove("active");

    menuToggle?.setAttribute("aria-expanded", "false");

    const icon = $("i", menuToggle || document);

    if (icon && menuToggle) {
      icon.className = "fa-solid fa-bars";
    }
  }

  menuToggle?.addEventListener("click", () => {
    if (!mainNav) return;

    const open = !mainNav.classList.contains("active");

    mainNav.classList.toggle("active", open);
    mainNav.classList.toggle("show", open);

    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));

    const icon = $("i", menuToggle);

    if (icon) {
      icon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    }
  });

  $$("#mainNav a, .main-nav a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

  /* 7. DARK MODE */

  function applyTheme(theme) {
    const dark = theme === "dark";

    document.body.classList.toggle("dark-mode", dark);
    document.documentElement.classList.toggle("dark-mode", dark);

    const icon = $("i", byId("darkModeBtn") || document);

    if (icon) {
      icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }

    localStorage.setItem("hafid-theme", dark ? "dark" : "light");

    localStorage.setItem("hafidDarkMode", dark ? "true" : "false");
  }

  applyTheme(
    localStorage.getItem("hafid-theme") ||
      (localStorage.getItem("hafidDarkMode") === "true" ? "dark" : "light"),
  );

  byId("darkModeBtn")?.addEventListener("click", () => {
    applyTheme(
      document.body.classList.contains("dark-mode") ? "light" : "dark",
    );
  });

  /* 8. COLOR CUSTOMIZER */

  const defaultColors = {
    primary: "#102b46",
    accent: "#f47b35",
  };

  const colorPanel = byId("colorPanel");

  function applyColors(primary, accent, persist = false) {
    if (!/^#[0-9a-f]{6}$/i.test(primary)) {
      primary = defaultColors.primary;
    }

    if (!/^#[0-9a-f]{6}$/i.test(accent)) {
      accent = defaultColors.accent;
    }

    const root = document.documentElement;

    root.style.setProperty("--primary", primary);
    root.style.setProperty("--primary-color", primary);
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-color", accent);

    if (byId("primaryColor")) {
      byId("primaryColor").value = primary;
    }

    if (byId("accentColor")) {
      byId("accentColor").value = accent;
    }

    if (persist) {
      localStorage.setItem("hafid-colors", JSON.stringify({ primary, accent }));
    }
  }

  let savedColors = {};

  try {
    savedColors = JSON.parse(localStorage.getItem("hafid-colors") || "{}");
  } catch {
    savedColors = {};
  }

  applyColors(
    savedColors.primary ||
      localStorage.getItem("hafid-primary") ||
      defaultColors.primary,

    savedColors.accent ||
      localStorage.getItem("hafid-accent") ||
      defaultColors.accent,
  );

  function toggleColorPanel(force) {
    if (!colorPanel) return;

    const open =
      typeof force === "boolean"
        ? force
        : colorPanel.hidden || !colorPanel.classList.contains("active");

    colorPanel.hidden = !open;
    colorPanel.classList.toggle("active", open);
    colorPanel.classList.toggle("show", open);

    byId("colorPickerBtn")?.setAttribute("aria-expanded", String(open));
  }

  byId("colorPickerBtn")?.addEventListener("click", () => toggleColorPanel());

  ["primaryColor", "accentColor"].forEach((id) => {
    byId(id)?.addEventListener("input", () => {
      applyColors(
        byId("primaryColor")?.value || defaultColors.primary,
        byId("accentColor")?.value || defaultColors.accent,
        true,
      );

      localStorage.setItem(
        "hafid-primary",
        byId("primaryColor")?.value || defaultColors.primary,
      );

      localStorage.setItem(
        "hafid-accent",
        byId("accentColor")?.value || defaultColors.accent,
      );
    });
  });

  $$(".preset, [data-primary][data-accent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const primary = btn.dataset.primary;
      const accent = btn.dataset.accent;

      if (primary && accent) {
        applyColors(primary, accent, true);

        localStorage.setItem("hafid-primary", primary);
        localStorage.setItem("hafid-accent", accent);
      }
    });
  });

  byId("resetColors")?.addEventListener("click", () => {
    applyColors(defaultColors.primary, defaultColors.accent, true);

    localStorage.setItem("hafid-primary", defaultColors.primary);

    localStorage.setItem("hafid-accent", defaultColors.accent);
  });

  /* 9. SEARCH */

  const searchInput = byId("searchInput");

  function performSearch() {
    const query = (searchInput?.value || "").trim().toLocaleLowerCase();

    let count = 0;

    $$(".news-card, .side-news, .category-item, [data-news-card]").forEach(
      (card) => {
        const match =
          !query || card.textContent.toLocaleLowerCase().includes(query);

        card.hidden = !match;

        if (match) count++;
      },
    );

    const result = byId("searchResults") || byId("searchResultsMessage");

    if (result) {
      result.textContent =
        query && !count
          ? "Wax war ah lagama helin raadintaada."
          : query
            ? `${count} natiijo ayaa la helay.`
            : "";
    }
  }

  byId("searchBtn")?.addEventListener("click", () => {
    const box = byId("searchBox");

    if (!box) return;

    const open = box.hidden || !box.classList.contains("active");

    box.hidden = !open;
    box.classList.toggle("active", open);
    box.classList.toggle("show", open);

    if (open) {
      searchInput?.focus();
    } else {
      if (searchInput) searchInput.value = "";
      performSearch();
    }
  });

  byId("searchSubmit")?.addEventListener("click", performSearch);

  searchInput?.addEventListener("input", performSearch);

  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });

  /* 10. AUTH MODAL AND FORMS */

  const authModal = byId("authModal");

  function openAuth() {
    if (!authModal) return;

    authModal.hidden = false;
    authModal.classList.add("active", "show");
    authModal.setAttribute("aria-hidden", "false");
  }

  function closeAuth() {
    if (!authModal) return;

    authModal.hidden = true;
    authModal.classList.remove("active", "show");
    authModal.setAttribute("aria-hidden", "true");
  }

  byId("accountBtn")?.addEventListener("click", () => {
    if (currentUser) {
      showDashboard(true);

      byId("memberDashboard")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      openAuth();
    }
  });

  byId("closeAuthModal")?.addEventListener("click", closeAuth);

  $$("[data-close-modal], .close-modal").forEach((el) => {
    el.addEventListener("click", closeAuth);
  });

  authModal?.addEventListener("click", (e) => {
    if (e.target === authModal) closeAuth();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAuth();
      byId("newsDetailsModal")?.remove();
    }
  });

  function showLogin() {
    if (byId("loginForm")) {
      byId("loginForm").hidden = false;
    }

    if (byId("registerForm")) {
      byId("registerForm").hidden = true;
    }

    clearMessage(byId("loginMessage"));
    clearMessage(byId("registerMessage"));
  }

  function showRegister() {
    if (byId("loginForm")) {
      byId("loginForm").hidden = true;
    }

    if (byId("registerForm")) {
      byId("registerForm").hidden = false;
    }

    clearMessage(byId("loginMessage"));
    clearMessage(byId("registerMessage"));
  }

  $$(
    "#showRegisterBtn, #showRegister, #switchToRegister, .show-register",
  ).forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showRegister();
    });
  });

  $$("#showLoginBtn, #showLogin, #switchToLogin, .show-login").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showLogin();
    });
  });

  async function loadProfile() {
    if (!db || !currentUser) {
      currentProfile = null;
      return null;
    }

    const { data, error } = await db
      .from(PROFILE_TABLE)
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (error) {
      console.error("Profile read:", error);
      currentProfile = null;
      return null;
    }

    currentProfile = data;

    return data;
  }

  async function updateDashboard() {
    if (!currentUser) {
      currentProfile = null;
      showDashboard(false);

      if (byId("ownerPublishPanel")) {
        byId("ownerPublishPanel").hidden = true;
      }

      setText("accountBtnText", t("account"));

      return;
    }

    if (!currentProfile) {
      await loadProfile();
    }

    const owner = isOwner();

    const name =
      currentProfile?.full_name ||
      currentUser.user_metadata?.full_name ||
      currentUser.email?.split("@")[0] ||
      t("member");

    setText("memberDisplayName", name);
    setText("memberDisplayEmail", currentUser.email);
    setText("memberRole", owner ? t("owner") : t("member"));

    setText("profileName", name);
    setText("profileEmail", currentUser.email);
    setText("profileType", owner ? "Owner" : "Member");
    setText("profileDate", dateText(currentUser.created_at));

    if (byId("ownerPublishPanel")) {
      byId("ownerPublishPanel").hidden = !owner;
    }

    if (byId("ownerBadge")) {
      byId("ownerBadge").hidden = !owner;
    }

    setText("accountBtnText", name);

    showDashboard(true);

    await loadMySubmissions();

    if (owner) {
      await loadPendingNews();
    }
  }

  /* 11. LOGIN */

  byId("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const msg = byId("loginMessage");

    const btn = byId("loginSubmit") || $('button[type="submit"]', form);

    clearMessage(msg);

    const email = getValue("loginEmail");
    const password = byId("loginPassword")?.value || "";

    if (!db) {
      return message(msg, "Supabase key-ga saxda ah geli script.js.", "error");
    }

    if (!validEmail(email) || !password) {
      return message(
        msg,
        !email ? t("emailRequired") : t("invalidEmail"),
        "error",
      );
    }

    setLoading(btn, true);

    try {
      const { data, error } = await db.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      currentUser = data.user;

      await loadProfile();
      await updateDashboard();
      await loadPublishedNews();

      closeAuth();
      form.reset();

      message(msg, "Si guul leh ayaad u gashay.", "success");
    } catch (err) {
      console.error("Login:", err);

      message(msg, err.message || t("invalidLogin"), "error");
    } finally {
      setLoading(btn, false, t("login"));
    }
  });

  /* 12. REGISTER */

  byId("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const msg = byId("registerMessage");

    const btn = byId("registerSubmit") || $('button[type="submit"]', form);

    clearMessage(msg);

    const name = getValue(
      "registerName",
      "registerFullName",
      "fullName",
      "signupName",
    );

    const email = getValue("registerEmail", "signupEmail");

    const password =
      byId("registerPassword")?.value || byId("signupPassword")?.value || "";

    const confirm =
      byId("registerConfirmPassword")?.value ||
      byId("confirmPassword")?.value ||
      "";

    if (!db) {
      return message(msg, "Supabase key-ga saxda ah geli script.js.", "error");
    }

    if (!name || !validEmail(email) || !password || !confirm) {
      return message(
        msg,
        !validEmail(email) ? t("invalidEmail") : t("emptyFields"),
        "error",
      );
    }

    if (password.length < 8) {
      return message(msg, t("passwordShort"), "error");
    }

    if (password !== confirm) {
      return message(msg, t("passwordMismatch"), "error");
    }

    setLoading(btn, true);

    try {
      const { data, error } = await db.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      if (data.session && data.user) {
        currentUser = data.user;

        await loadProfile();
        await updateDashboard();

        closeAuth();
      }

      message(msg, t("registerSuccess"), "success");

      form.reset();
    } catch (err) {
      console.error("Register:", err);

      message(msg, err.message || "Diiwaangelintu way fashilantay.", "error");
    } finally {
      setLoading(btn, false, "Register");
    }
  });

  /* 13. FORGOT PASSWORD */

  byId("forgotPasswordBtn")?.addEventListener("click", async () => {
    const email = getValue("loginEmail");
    const msg = byId("loginMessage");

    clearMessage(msg);

    if (!db) {
      return message(msg, "Supabase key-ga saxda ah geli script.js.", "error");
    }

    if (!validEmail(email)) {
      return message(msg, t("emailRequired"), "error");
    }

    try {
      const { error } = await db.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) throw error;

      message(
        msg,
        "Linkiga dib-u-dejinta password-ka waxaa lagu diray email-kaaga.",
        "success",
      );
    } catch (err) {
      console.error("Reset password:", err);

      message(msg, err.message, "error");
    }
  });

  /* 14. IMAGE UPLOAD AND PREVIEW */

  async function uploadImage(file) {
    if (!file) return null;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(t("imageOnly"));
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error(t("imageLarge"));
    }

    if (!db || !currentUser) {
      throw new Error("Fadlan marka hore gal akoonkaaga.");
    }

    const ext = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    }[file.type];

    const filename = `${currentUser.id}/${crypto.randomUUID ? crypto.randomUUID() : Date.now()}.${ext}`;

    const { error } = await db.storage
      .from(STORAGE_BUCKET)
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    return db.storage.from(STORAGE_BUCKET).getPublicUrl(filename).data
      .publicUrl;
  }

  function setupPreview(inputId, previewId) {
    const input = byId(inputId);
    const preview = byId(previewId);

    if (!input || !preview) return;

    input.addEventListener("change", () => {
      const file = input.files?.[0];

      if (!file) {
        preview.hidden = true;
        preview.removeAttribute("src");
        return;
      }

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        input.value = "";
        preview.hidden = true;

        return alert(t("imageOnly"));
      }

      if (file.size > MAX_IMAGE_SIZE) {
        input.value = "";
        preview.hidden = true;

        return alert(t("imageLarge"));
      }

      const reader = new FileReader();

      reader.onload = () => {
        preview.src = reader.result;
        preview.hidden = false;
      };

      reader.onerror = () => {
        alert("Sawirka lama akhrin karin.");
      };

      reader.readAsDataURL(file);
    });
  }

  setupPreview("newsImageFile", "newsImagePreview");

  setupPreview("memberNewsImageFile", "memberNewsImagePreview");

  /* 15. OWNER PUBLISH NEWS */

  byId("ownerNewsForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const msg = byId("ownerNewsMessage");

    const btn = byId("publishNewsBtn") || $('button[type="submit"]', form);

    clearMessage(msg);

    if (!db || !currentUser) {
      return message(msg, "Fadlan marka hore gal akoonkaaga.", "error");
    }

    if (!isOwner()) {
      return message(msg, t("noPermission"), "error");
    }

    const title = getValue("newsTitle");
    const category = getValue("newsCategory");
    const location = getValue("newsLocation");
    const content = getValue("newsContent");
    const source = getValue("newsSource");

    const imageFile = byId("newsImageFile")?.files?.[0];

    if (!title || !category || !content) {
      return message(msg, t("emptyFields"), "error");
    }

    if (source && !safeHttpUrl(source)) {
      return message(
        msg,
        "URL-ka isha warka waa inuu ku bilaabmaa http:// ama https://.",
        "error",
      );
    }

    setLoading(btn, true);

    try {
      let imageUrl = getValue("newsImage") || null;

      if (imageUrl && !safeHttpUrl(imageUrl)) {
        throw new Error("URL-ka sawirka sax ma aha.");
      }

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        title,
        category,
        location: location || null,
        content,
        summary: summary(content),
        image_url: imageUrl,
        source_url: source || null,
        author_id: currentUser.id,
        status: "approved",
      };

      const { error } = await db.from(NEWS_TABLE).insert(payload);

      if (error) throw error;

      message(msg, t("publishSuccess"), "success");

      form.reset();

      const preview = byId("newsImagePreview");

      if (preview) {
        preview.hidden = true;
        preview.removeAttribute("src");
      }

      await loadPublishedNews();
    } catch (err) {
      console.error("Publish news:", err);

      message(msg, err.message || "Warka lama daabici karin.", "error");
    } finally {
      setLoading(btn, false, "Daabac Warka");
    }
  });

  /* 16. OPTIONAL MEMBER NEWS SUBMISSION */

  byId("memberNewsForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const msg = byId("memberNewsMessage");

    const btn = byId("submitMemberNewsBtn") || $('button[type="submit"]', form);

    clearMessage(msg);

    if (!db || !currentUser) {
      return message(msg, "Fadlan marka hore gal akoonkaaga.", "error");
    }

    const title = getValue("memberNewsTitle");
    const category = getValue("memberNewsCategory");
    const location = getValue("memberNewsLocation");
    const content = getValue("memberNewsContent");
    const source = getValue("memberNewsSource");

    const file = byId("memberNewsImageFile")?.files?.[0];

    if (!title || !category || !content) {
      return message(msg, t("emptyFields"), "error");
    }

    if (source && !safeHttpUrl(source)) {
      return message(msg, "Isha warka URL-keedu sax ma aha.", "error");
    }

    setLoading(btn, true);

    try {
      let imageUrl = null;

      if (file) {
        imageUrl = await uploadImage(file);
      }

      const { error } = await db.from(SUBMISSIONS_TABLE).insert({
        user_id: currentUser.id,
        title,
        category,
        location: location || null,
        summary: summary(content),
        content,
        image_url: imageUrl,
        source_url: source || null,
        status: "pending",
      });

      if (error) throw error;

      message(
        msg,
        "Warka waa la gudbiyay; wuxuu sugayaa oggolaanshaha maamulka.",
        "success",
      );

      form.reset();

      const preview = byId("memberNewsImagePreview");

      if (preview) {
        preview.hidden = true;
        preview.removeAttribute("src");
      }

      await loadMySubmissions();
    } catch (err) {
      console.error("Member submission:", err);

      message(msg, err.message, "error");
    } finally {
      setLoading(btn, false, "Gudbi Warka");
    }
  });

  /* 17. LOAD PUBLIC NEWS */

  async function loadPublishedNews() {
    const home = byId("publishedNewsList");

    const dashboard =
      byId("dashboardPublishedNewsList") || byId("dashboardNewsList");

    if (!db) {
      if (home) {
        home.innerHTML =
          '<p class="error-message">Supabase publishable key lama gelin.</p>';
      }

      return;
    }

    if (home) {
      home.innerHTML = `<p class="loading-news">${escapeHTML(t("loading"))}</p>`;
    }

    try {
      const { data, error } = await db
        .from(NEWS_TABLE)
        .select("*")
        .eq("status", "approved")
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      currentNews = data || [];

      renderPublishedNews(currentNews);
      renderDashboardNews(currentNews);
    } catch (err) {
      console.error("Load public news:", err);

      const html =
        '<p class="error-message">Wararka lama soo bandhigi karin. Hubi in table-ka news iyo RLS policy ay sax yihiin.</p>';

      if (home) home.innerHTML = html;
      if (dashboard) dashboard.innerHTML = html;
    }
  }

  function renderPublishedNews(news) {
    const container = byId("publishedNewsList");

    if (!container) return;

    if (!news?.length) {
      container.innerHTML = `<p class="no-news">${escapeHTML(t("noNews"))}</p>`;

      return;
    }

    container.innerHTML = news
      .map((item) => {
        const title = escapeHTML(item.title);
        const image = safeHttpUrl(item.image_url);
        const id = escapeHTML(item.id);

        return `
        <article
          class="news-card database-news-card"
          data-news-card
          data-id="${id}"
        >
          ${
            image
              ? `
                <div class="news-image">
                  <img
                    src="${escapeHTML(image)}"
                    alt="${title}"
                    loading="lazy"
                  >
                </div>
              `
              : ""
          }

          <div class="news-info news-content">
            <span class="category-badge news-category">
              ${escapeHTML(item.category || "Warar")}
            </span>

            <h3 class="news-title">${title}</h3>

            <p class="news-summary">
              ${escapeHTML(item.summary || summary(item.content))}
            </p>

            <div class="news-meta">
              <span>${escapeHTML(item.location || "")}</span>

              <span class="news-date">
                ${escapeHTML(dateText(item.created_at))}
              </span>
            </div>

            <button
              type="button"
              class="read-more read-more-btn"
              data-read-news="${id}"
            >
              ${escapeHTML(t("readNews"))}
            </button>
          </div>
        </article>
      `;
      })
      .join("");
  }

  function renderDashboardNews(news) {
    const container =
      byId("dashboardPublishedNewsList") ||
      byId("dashboardNewsList") ||
      byId("ownerPublishedNews");

    if (!container) return;

    if (!news?.length) {
      container.innerHTML = `<p>${escapeHTML(t("noNews"))}</p>`;

      return;
    }

    container.innerHTML = news
      .map(
        (item) => `
      <article class="dashboard-news-item">
        <div>
          <h4>${escapeHTML(item.title)}</h4>

          <p>${escapeHTML(item.category || "Warar")}</p>

          <small>
            ${escapeHTML(dateText(item.created_at))}
          </small>
        </div>

        ${
          isOwner()
            ? `
              <button
                type="button"
                class="delete-news-btn"
                data-delete-news="${escapeHTML(item.id)}"
              >
                Delete
              </button>
            `
            : ""
        }
      </article>
    `,
      )
      .join("");
  }

  /* 18. NEWS DETAILS */

  function openNewsDetails(id) {
    const item = currentNews.find((news) => String(news.id) === String(id));

    if (!item) return;

    byId("newsDetailsModal")?.remove();

    const modal = document.createElement("div");

    modal.id = "newsDetailsModal";
    modal.className = "news-details-modal news-detail-modal";

    const image = safeHttpUrl(item.image_url);
    const source = safeHttpUrl(item.source_url);

    modal.innerHTML = `
      <div class="news-details-content news-detail-content">

        <button
          type="button"
          class="news-details-close news-detail-close"
          aria-label="${escapeHTML(t("close"))}"
        >
          ×
        </button>

        <span class="category-badge">
          ${escapeHTML(item.category || "Warar")}
        </span>

        <h2>${escapeHTML(item.title)}</h2>

        <p>${escapeHTML(dateText(item.created_at))}</p>

        ${
          image
            ? `
              <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(item.title)}"
              >
            `
            : ""
        }

        <p>${escapeHTML(item.location || "")}</p>

        <div class="news-full-content news-detail-body">
          ${escapeHTML(item.content || "").replace(/\r?\n/g, "<br>")}
        </div>

        ${
          source
            ? `
              <p>
                <a
                  href="${escapeHTML(source)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ${escapeHTML(t("readSource"))}
                </a>
              </p>
            `
            : ""
        }

        <p>HAFID NOR MEDIA</p>
      </div>
    `;

    document.body.appendChild(modal);

    modal
      .querySelector(".news-details-close")
      ?.addEventListener("click", () => modal.remove());

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  /* 19. NEWS BUTTON ACTIONS */

  document.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target : null;

    if (!target) return;

    const read = target.closest("[data-read-news]");

    if (read) {
      openNewsDetails(read.dataset.readNews);
      return;
    }

    const del = target.closest("[data-delete-news]");

    if (del) {
      deleteNews(del.dataset.deleteNews);
      return;
    }

    const approve = target.closest("[data-approve-news]");

    if (approve) {
      moderateNews(approve.dataset.approveNews, "approved");

      return;
    }

    const reject = target.closest("[data-reject-news]");

    if (reject) {
      moderateNews(reject.dataset.rejectNews, "rejected");
    }
  });

  /* 20. OWNER MODERATION */

  async function loadPendingNews() {
    const container = byId("pendingNewsList");

    if (!container || !db || !isOwner()) return;

    container.innerHTML = `<p>${escapeHTML(t("loading"))}</p>`;

    try {
      const { data, error } = await db
        .from(SUBMISSIONS_TABLE)
        .select("*")
        .eq("status", "pending")
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      if (!data?.length) {
        container.innerHTML = `<p>${escapeHTML(t("noPending"))}</p>`;

        return;
      }

      container.innerHTML = data
        .map(
          (item) => `
        <article class="submission-item">

          <h3>${escapeHTML(item.title)}</h3>

          <p>${escapeHTML(item.category || "")}</p>

          <p>
            ${escapeHTML(item.summary || summary(item.content))}
          </p>

          <small>
            ${escapeHTML(dateText(item.created_at))}
          </small>

          <div class="submission-actions">

            <button
              type="button"
              data-approve-news="${escapeHTML(item.id)}"
            >
              Approve
            </button>

            <button
              type="button"
              data-reject-news="${escapeHTML(item.id)}"
            >
              Reject
            </button>

          </div>
        </article>
      `,
        )
        .join("");
    } catch (err) {
      console.error("Pending news:", err);

      container.innerHTML =
        "<p>Wararka sugaya lama soo bandhigi karin. Hubi RLS policy.</p>";
    }
  }

  async function moderateNews(id, status) {
    if (!db || !currentUser || !isOwner()) {
      return alert(t("noPermission"));
    }

    if (!["approved", "rejected"].includes(status)) {
      return;
    }

    const confirmed = confirm(
      status === "approved"
        ? "Ma oggolaanaysaa in warkan la daabaco?"
        : "Ma diidaysaa warkan?",
    );

    if (!confirmed) return;

    try {
      const { data, error } = await db
        .from(SUBMISSIONS_TABLE)
        .select("*")
        .eq("id", id)
        .eq("status", "pending")
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        throw new Error("Warkan lama helin ama hore ayaa loo maareeyay.");
      }

      if (status === "approved") {
        const { error: insertError } = await db.from(NEWS_TABLE).insert({
          title: data.title,
          category: data.category,
          location: data.location,
          summary: data.summary || summary(data.content),
          content: data.content,
          image_url: data.image_url,
          source_url: data.source_url,
          author_id: data.user_id,
          status: "approved",
        });

        if (insertError) throw insertError;
      }

      const { error: updateError } = await db
        .from(SUBMISSIONS_TABLE)
        .update({ status })
        .eq("id", id)
        .eq("status", "pending");

      if (updateError) throw updateError;

      await loadPendingNews();
      await loadPublishedNews();
      await loadMySubmissions();

      alert(
        status === "approved"
          ? "Warka waa la daabacay."
          : "Warka waa la diiday.",
      );
    } catch (err) {
      console.error("Moderation:", err);

      alert("Hawsha way fashilantay: " + err.message);
    }
  }

  /* 21. DELETE NEWS */

  async function deleteNews(id) {
    if (!db || !isOwner()) {
      return alert(t("noPermission"));
    }

    if (!confirm("Ma hubtaa inaad tirtirayso warkan?")) {
      return;
    }

    try {
      const { error } = await db.from(NEWS_TABLE).delete().eq("id", id);

      if (error) throw error;

      await loadPublishedNews();
    } catch (err) {
      console.error("Delete news:", err);

      alert("Warka lama tirtiri karin: " + err.message);
    }
  }

  /* 22. MEMBER SUBMISSIONS */

  async function loadMySubmissions() {
    if (!db || !currentUser) return;

    const containers = [
      byId("mySubmissionsList"),
      byId("memberNewsList"),
    ].filter(Boolean);

    if (!containers.length) return;

    try {
      const { data, error } = await db
        .from(SUBMISSIONS_TABLE)
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      const html = data?.length
        ? data
            .map(
              (item) => `
            <article class="submission-item">

              <h4>${escapeHTML(item.title)}</h4>

              <p>${escapeHTML(item.category || "")}</p>

              <span class="submission-status status-${escapeHTML(item.status)}">
                ${escapeHTML(t(item.status) || item.status)}
              </span>

              <small>
                ${escapeHTML(dateText(item.created_at))}
              </small>

            </article>
          `,
            )
            .join("")
        : "<p>Weli ma aadan soo gudbin wax war ah.</p>";

      containers.forEach((container) => {
        container.innerHTML = html;
      });
    } catch (err) {
      console.error("My submissions:", err);

      containers.forEach((container) => {
        container.innerHTML = "<p>Wararkaaga lama soo gelin karin.</p>";
      });
    }
  }

  /* 23. DASHBOARD TABS */

  $$("[data-dashboard-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const raw = tab.dataset.dashboardTab;

      const panel =
        byId(raw) ||
        byId(
          {
            publishedNews: "publishedNewsPanel",
            profile: "memberProfilePanel",
          }[raw] || "",
        );

      if (!panel) return;

      $$("[data-dashboard-tab]").forEach((item) => {
        item.classList.toggle("active", item === tab);
      });

      $$("[data-dashboard-panel], .dashboard-panel").forEach((item) => {
        item.hidden = item !== panel;
        item.classList.toggle("active", item === panel);
      });

      $$(".dashboard-tab").forEach((item) => {
        item.classList.toggle("active", item === tab);
      });
    });
  });

  /* 24. NEWSLETTER */


/* =====================================================
   24. HAFID NOR MEDIA — NEWSLETTER
   Email Validation | Duplicate Detection | Auto Clear
===================================================== */

const newsletterForm = byId("newsletterForm");
const newsletterEmail = byId("newsletterEmail");
const newsletterMessage = byId("newsletterMessage");
const newsletterSubmit = byId("newsletterSubmit");

if (
  newsletterForm &&
  newsletterEmail &&
  newsletterMessage &&
  newsletterSubmit
) {
  newsletterForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = String(newsletterEmail.value || "")
      .trim()
      .toLowerCase();

    // Nadiifi fariintii hore
    clearMessage(newsletterMessage);

    // 1. Hubi email madhan
    if (!email) {
      message(newsletterMessage, t("emailRequired"), "error");
      newsletterEmail.focus();
      return;
    }

    // 2. Hubi email sax ah
    if (!validEmail(email) || email.length > 254) {
      message(newsletterMessage, t("invalidEmail"), "error");
      newsletterEmail.focus();
      return;
    }

    // 3. Hubi Supabase
    if (!db) {
      message(
        newsletterMessage,
        "Adeegga isdiiwaangelintu hadda ma shaqaynayo.",
        "error"
      );
      return;
    }

    // 4. Jooji button-ka inta la dirayo
    setLoading(newsletterSubmit, true, t("subscribe"));

    try {
      // 5. Ku kaydi email-ka Supabase
      const { error } = await db
        .from(NEWSLETTER_TABLE)
        .insert([{ email }]);

      // 6. Hubi khaladaadka
      if (error) {
        console.error("Newsletter error:", error);

        // Email hore loo diiwaangeliyey
        if (
          error.code === "23505" ||
          error.message?.toLowerCase().includes("duplicate")
        ) {
          message(
            newsletterMessage,
            t("duplicateEmail"),
            "error"
          );

          // Nadiifi email-ka
          newsletterEmail.value = "";
          newsletterForm.reset();

          return;
        }

        // Khalad kale
        message(
          newsletterMessage,
          t("subscribeError"),
          "error"
        );

        return;
      }

      // 7. Fariinta guusha
      message(
        newsletterMessage,
        t("subscribed"),
        "success"
      );

      // 8. Nadiifi email-ka
      newsletterEmail.value = "";

      // 9. Dib u nadiifi form-ka
      newsletterForm.reset();

    } catch (error) {
      console.error("Newsletter error:", error);

      message(
        newsletterMessage,
        "Cilad ayaa dhacday. Hubi internet-kaaga.",
        "error"
      );

    } finally {
      // 10. Dib u hawlgeli button-ka
      setLoading(
        newsletterSubmit,
        false,
        t("subscribe")
      );
    }
  });
}

  /* 25. BACK TO TOP */

  const backToTop = byId("backToTop");

  function updateBackToTop() {
    if (backToTop) {
      const show = window.scrollY > 350;

      backToTop.classList.toggle("show", show);
      backToTop.classList.toggle("active", show);
    }
  }

  window.addEventListener("scroll", updateBackToTop, { passive: true });

  updateBackToTop();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  /* 26. LOGOUT */

  byId("logoutBtn")?.addEventListener("click", async () => {
    if (!db) return;

    try {
      const { error } = await db.auth.signOut();

      if (error) throw error;

      currentUser = null;
      currentProfile = null;

      showDashboard(false);
      closeAuth();

      await loadPublishedNews();

      setText("accountBtnText", t("account"));
    } catch (err) {
      console.error("Logout:", err);

      alert("Ka bixitaanku wuu fashilmay: " + err.message);
    }
  });

  /* 27. SESSION INITIALIZATION */

  async function initializeAuth() {
    if (!db) {
      showDashboard(false);
      authReady = true;
      return;
    }

    try {
      const { data, error } = await db.auth.getSession();

      if (error) throw error;

      currentUser = data.session?.user || null;

      if (currentUser) {
        await loadProfile();
      }

      await updateDashboard();
    } catch (err) {
      console.error("Session initialization:", err);

      currentUser = null;
      currentProfile = null;

      showDashboard(false);
    } finally {
      authReady = true;
    }
  }

  /* 28. AUTH STATE CHANGES */

  if (db) {
    db.auth.onAuthStateChange((event, session) => {
      currentUser = session?.user || null;

      if (event === "SIGNED_OUT") {
        currentProfile = null;

        showDashboard(false);

        setText("accountBtnText", t("account"));

        return;
      }

      if (!authReady) return;

      authEventQueue = authEventQueue
        .then(async () => {
          await loadProfile();
          await updateDashboard();
          await loadPublishedNews();
        })
        .catch((err) => {
          console.error("Auth state update:", err);
        });
    });
  }

  /* 29. START WEBSITE */

  async function initializeWebsite() {
    updateDate();

    await initializeAuth();

    await loadPublishedNews();

    console.log("HAFID NOR MEDIA JavaScript initialized.");
  }

  initializeWebsite();
});
