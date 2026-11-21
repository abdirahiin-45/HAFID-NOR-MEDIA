
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
     HAFID NOR MEDIA
     PROFESSIONAL MERGED JAVASCRIPT
     Supabase + Authentication + News + Dashboard
  ===================================================== */

  /* =====================================================
     1. SUPABASE CONFIGURATION
  ===================================================== */

  const SUPABASE_URL =
    "https://ccddbcbmypeianekxhez.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_orYahZVqH7xGceVZqORwFA_npWRYBlw";

  const STORAGE_BUCKET = "news-images";

  // Owner-ka rasmiga ah
  const OWNER_ID = "9d5c8d5f-02ed-4bd4-a03a-96a9dacb70d2";

  if (!window.supabase) {
    console.error("Supabase CDN lama soo shubin.");
    return;
  }

  const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  /* =====================================================
     2. GLOBAL VARIABLES
  ===================================================== */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const byId = (id) => document.getElementById(id);

  let currentUser = null;
  let currentProfile = null;
  let currentNews = [];
  let currentLanguage = "so";
  let authInitialized = false;

  /* =====================================================
     3. HELPER FUNCTIONS
  ===================================================== */

  function getValue(...ids) {
    for (const id of ids) {
      const element = byId(id);

      if (element && "value" in element) {
        return String(element.value).trim();
      }
    }

    return "";
  }

  function setText(id, value) {
    const element = byId(id);

    if (element) {
      element.textContent = value ?? "";
    }
  }

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  function showMessage(element, message, type = "info") {
    if (!element) return;

    element.textContent = message;
    element.className = `form-message ${type}`;
    element.hidden = false;
  }

  function clearMessage(element) {
    if (!element) return;

    element.textContent = "";
    element.hidden = true;
  }

  function setLoading(button, loading, defaultText = "Submit") {
    if (!button) return;

    if (loading) {
      button.dataset.originalText =
        button.textContent.trim() || defaultText;

      button.disabled = true;
      button.textContent = "Fadlan sug...";
    } else {
      button.disabled = false;

      button.textContent =
        button.dataset.originalText || defaultText;
    }
  }

  function formatDate(date) {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "";

    const locale = {
      so: "so-SO",
      en: "en-US",
      ar: "ar"
    }[currentLanguage] || "so-SO";

    return parsed.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function makeSummary(content) {
    const text = String(content || "").trim();

    return text.length > 180
      ? text.substring(0, 180) + "..."
      : text;
  }

  function isValidUrl(value) {
    if (!value) return true;

    try {
      const url = new URL(value);

      return (
        url.protocol === "https:" ||
        url.protocol === "http:"
      );
    } catch {
      return false;
    }
  }

  function getSavedValue(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);

      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function isOwner() {
    return Boolean(
      currentUser &&
      (
        currentUser.id === OWNER_ID ||
        currentProfile?.role === "owner"
      )
    );
  }

  function setDashboardVisible(visible) {
    const dashboard = byId("memberDashboard");

    if (!dashboard) return;

    dashboard.hidden = !visible;
    dashboard.style.display = visible ? "" : "none";
  }

  /* =====================================================
     4. DATE AND COPYRIGHT YEAR
  ===================================================== */

  function updateDate() {
    const element = byId("currentDate");

    if (!element) return;

    const locale = {
      so: "so-SO",
      en: "en-US",
      ar: "ar"
    }[currentLanguage] || "so-SO";

    element.textContent = new Date().toLocaleDateString(
      locale,
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );
  }

  setText("currentYear", new Date().getFullYear());
  setText("loginYear", new Date().getFullYear());

  /* =====================================================
     5. MOBILE NAVIGATION
  ===================================================== */

  const menuToggle = byId("menuToggle");
  const mainNav = byId("mainNav");

  function closeMobileMenu() {
    mainNav?.classList.remove("active");
    menuToggle?.classList.remove("active");

    menuToggle?.setAttribute("aria-expanded", "false");

    const icon = $("i", menuToggle);

    if (icon) {
      icon.className = "fa-solid fa-bars";
    }
  }

  menuToggle?.addEventListener("click", () => {
    if (!mainNav) return;

    const opened = mainNav.classList.toggle("active");

    menuToggle.classList.toggle("active", opened);

    menuToggle.setAttribute(
      "aria-expanded",
      String(opened)
    );

    const icon = $("i", menuToggle);

    if (icon) {
      icon.className = opened
        ? "fa-solid fa-xmark"
        : "fa-solid fa-bars";
    }
  });

  $$(".main-nav a, #mainNav a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();

      $$(".main-nav a, #mainNav a").forEach((item) => {
        item.classList.remove("active");
      });

      link.classList.add("active");
    });
  });

  /* =====================================================
     6. DARK MODE
  ===================================================== */

  const darkModeBtn = byId("darkModeBtn");

  function applyTheme(theme) {
    const dark = theme === "dark";

    document.body.classList.toggle("dark-mode", dark);

    document.documentElement.classList.toggle(
      "dark-mode",
      dark
    );

    const icon = $("i", darkModeBtn);

    if (icon) {
      icon.className = dark
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";
    }

    localStorage.setItem("hafid-theme", theme);
  }

  applyTheme(
    localStorage.getItem("hafid-theme") || "light"
  );

  darkModeBtn?.addEventListener("click", () => {
    const dark = document.body.classList.contains("dark-mode");

    applyTheme(dark ? "light" : "dark");
  });

  /* =====================================================
     7. COLOR CUSTOMIZER
  ===================================================== */

  const colorPickerBtn = byId("colorPickerBtn");
  const colorPanel = byId("colorPanel");
  const primaryColor = byId("primaryColor");
  const accentColor = byId("accentColor");
  const resetColors = byId("resetColors");

  const defaultColors = {
    primary: "#102b46",
    accent: "#f47b35"
  };

  function applyColors(primary, accent) {
    document.documentElement.style.setProperty(
      "--primary",
      primary
    );

    document.documentElement.style.setProperty(
      "--accent",
      accent
    );

    if (primaryColor) primaryColor.value = primary;
    if (accentColor) accentColor.value = accent;
  }

  function saveColors() {
    const colors = {
      primary: primaryColor?.value || defaultColors.primary,
      accent: accentColor?.value || defaultColors.accent
    };

    applyColors(colors.primary, colors.accent);

    localStorage.setItem(
      "hafid-colors",
      JSON.stringify(colors)
    );

    localStorage.setItem(
      "hafid-primary",
      colors.primary
    );

    localStorage.setItem(
      "hafid-accent",
      colors.accent
    );
  }

  const savedColors = getSavedValue("hafid-colors");

  applyColors(
    savedColors?.primary ||
      localStorage.getItem("hafid-primary") ||
      defaultColors.primary,

    savedColors?.accent ||
      localStorage.getItem("hafid-accent") ||
      defaultColors.accent
  );

  colorPickerBtn?.addEventListener("click", () => {
    if (!colorPanel) return;

    const opened = colorPanel.classList.toggle("active");

    colorPanel.classList.toggle("show", opened);
    colorPanel.hidden = !opened;

    colorPickerBtn.setAttribute(
      "aria-expanded",
      String(opened)
    );
  });

  primaryColor?.addEventListener("input", saveColors);
  accentColor?.addEventListener("input", saveColors);

  $$(".preset").forEach((preset) => {
    preset.addEventListener("click", () => {
      const primary = preset.dataset.primary;
      const accent = preset.dataset.accent;

      if (!primary || !accent) return;

      applyColors(primary, accent);

      localStorage.setItem(
        "hafid-colors",
        JSON.stringify({ primary, accent })
      );

      localStorage.setItem("hafid-primary", primary);
      localStorage.setItem("hafid-accent", accent);
    });
  });

  resetColors?.addEventListener("click", () => {
    applyColors(
      defaultColors.primary,
      defaultColors.accent
    );

    localStorage.removeItem("hafid-colors");
    localStorage.removeItem("hafid-primary");
    localStorage.removeItem("hafid-accent");
  });

  /* =====================================================
     8. SEARCH SYSTEM
  ===================================================== */

  const searchBtn = byId("searchBtn");
  const searchBox = byId("searchBox");
  const searchInput = byId("searchInput");
  const searchSubmit = byId("searchSubmit");

  searchBtn?.addEventListener("click", () => {
    if (!searchBox) return;

    const opened = searchBox.classList.toggle("active");

    searchBox.classList.toggle("show", opened);
    searchBox.hidden = !opened;

    if (opened) {
      searchInput?.focus();
    } else {
      searchInput.value = "";
      performSearch();
    }
  });

  function performSearch() {
    const query =
      searchInput?.value.trim().toLowerCase() || "";

    const cards = $$(
      ".news-card, .side-news, .category-item, [data-news-card]"
    );

    let found = 0;

    cards.forEach((card) => {
      const matches = card.textContent
        .toLowerCase()
        .includes(query);

      card.hidden = !matches;

      if (matches) found++;
    });

    const resultMessage = byId("searchResults");

    if (resultMessage) {
      resultMessage.textContent =
        query && found === 0
          ? "Wax war ah lagama helin raadintaada."
          : query
            ? `${found} natiijo ayaa la helay.`
            : "";
    }
  }

  searchSubmit?.addEventListener("click", performSearch);

  searchInput?.addEventListener("input", performSearch);

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  });

  /* =====================================================
     9. LANGUAGE SYSTEM
  ===================================================== */

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
      terms: "Shuruudaha Adeegga"
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
      terms: "Terms of Service"
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
      videos: "مقاطع الفيديو",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة"
    }
  };

  function applyLanguage(language) {
    if (!translations[language]) {
      language = "so";
    }

    currentLanguage = language;

    document.documentElement.lang = language;

    document.documentElement.dir =
      language === "ar" ? "rtl" : "ltr";

    $$("[data-i18n], [data-translate]").forEach((element) => {
      const key =
        element.dataset.i18n ||
        element.dataset.translate;

      const value = translations[language][key];

      if (value !== undefined) {
        element.textContent = value;
      }
    });

    $$("[data-i18n-placeholder]").forEach((element) => {
      const key = element.dataset.i18nPlaceholder;
      const value = translations[language][key];

      if (value !== undefined) {
        element.placeholder = value;
      }
    });

    updateDate();

    localStorage.setItem("hafid-language", language);
  }

  const languageSelect = byId("languageSelect");

  const savedLanguage =
    localStorage.getItem("hafid-language") || "so";

  if (languageSelect) {
    languageSelect.value = savedLanguage;
  }

  applyLanguage(savedLanguage);

  languageSelect?.addEventListener("change", () => {
    applyLanguage(languageSelect.value);
  });

  /* =====================================================
     10. AUTH MODAL
  ===================================================== */

  const authModal = byId("authModal");

  function openAuthModal() {
    if (!authModal) return;

    authModal.hidden = false;
    authModal.classList.add("active", "show");

    authModal.setAttribute("aria-hidden", "false");
  }

  function closeAuthModal() {
    if (!authModal) return;

    authModal.hidden = true;
    authModal.classList.remove("active", "show");

    authModal.setAttribute("aria-hidden", "true");
  }

  byId("accountBtn")?.addEventListener("click", () => {
    if (currentUser) {
      setDashboardVisible(true);

      byId("memberDashboard")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else {
      openAuthModal();
    }
  });

  byId("closeAuthModal")?.addEventListener(
    "click",
    closeAuthModal
  );

  $$("[data-close-modal], .close-modal").forEach((button) => {
    button.addEventListener("click", closeAuthModal);
  });

  authModal?.addEventListener("click", (event) => {
    if (event.target === authModal) {
      closeAuthModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAuthModal();

      const modal =
        byId("newsDetailsModal") ||
        byId("newsDetailModal");

      modal?.remove();
    }
  });

  /* =====================================================
     11. LOGIN / REGISTER FORM SWITCH
  ===================================================== */

  function showLoginForm() {
    if (byId("loginForm")) {
      byId("loginForm").hidden = false;
    }

    if (byId("registerForm")) {
      byId("registerForm").hidden = true;
    }

    clearMessage(byId("loginMessage"));
    clearMessage(byId("registerMessage"));
  }

  function showRegisterForm() {
    if (byId("loginForm")) {
      byId("loginForm").hidden = true;
    }

    if (byId("registerForm")) {
      byId("registerForm").hidden = false;
    }

    clearMessage(byId("loginMessage"));
    clearMessage(byId("registerMessage"));
  }

  $$("#showRegisterBtn, #showRegister, #switchToRegister, .show-register")
    .forEach((button) => {
      button.addEventListener("click", showRegisterForm);
    });

  $$("#showLoginBtn, #showLogin, #switchToLogin, .show-login")
    .forEach((button) => {
      button.addEventListener("click", showLoginForm);
    });

  /* =====================================================
     12. LOAD USER PROFILE
  ===================================================== */

  async function loadProfile() {
    if (!currentUser) {
      currentProfile = null;
      return null;
    }

    try {
      const { data, error } = await db
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) throw error;

      currentProfile = data;

      return data;

    } catch (error) {
      console.error("Profile loading error:", error);

      currentProfile = null;

      return null;
    }
  }

  /* =====================================================
     13. LOGIN
  ===================================================== */

  const loginForm = byId("loginForm");

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = byId("loginMessage");

    const button =
      byId("loginSubmit") ||
      $('button[type="submit"]', loginForm);

    clearMessage(message);

    const email = getValue("loginEmail");
    const password = byId("loginPassword")?.value || "";

    if (!email || !password) {
      showMessage(
        message,
        "Fadlan geli email-ka iyo password-ka.",
        "error"
      );
      return;
    }

    setLoading(button, true, "Login");

    try {
      const { data, error } = await db.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      currentUser = data.user;

      await loadProfile();
      await updateDashboard();
      await loadPublishedNews();

      closeAuthModal();
      loginForm.reset();

      showMessage(
        message,
        "Waad ku guulaysatay inaad gasho.",
        "success"
      );

    } catch (error) {
      console.error("Login error:", error);

      showMessage(
        message,
        error.message || "Email ama password khaldan.",
        "error"
      );

    } finally {
      setLoading(button, false, "Login");
    }
  });

  /* =====================================================
     14. REGISTER
  ===================================================== */

  const registerForm = byId("registerForm");

  registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = byId("registerMessage");

    const button =
      byId("registerSubmit") ||
      $('button[type="submit"]', registerForm);

    clearMessage(message);

    const name = getValue(
      "registerName",
      "registerFullName",
      "fullName",
      "signupName"
    );

    const email = getValue(
      "registerEmail",
      "signupEmail"
    );

    const password =
      byId("registerPassword")?.value ||
      byId("signupPassword")?.value ||
      "";

    const confirmPassword =
      byId("registerConfirmPassword")?.value ||
      byId("confirmPassword")?.value ||
      "";

    if (!name || !email || !password || !confirmPassword) {
      showMessage(
        message,
        "Fadlan buuxi dhammaan meelaha.",
        "error"
      );
      return;
    }

    if (password.length < 8) {
      showMessage(
        message,
        "Password-ku waa inuu ugu yaraan 8 xaraf ahaadaa.",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      showMessage(
        message,
        "Labada password isma laha.",
        "error"
      );
      return;
    }

    setLoading(button, true, "Register");

    try {
      const { data, error } = await db.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) throw error;

      if (data.user && data.session) {
        currentUser = data.user;

        await loadProfile();
        await updateDashboard();
        await loadPublishedNews();

        closeAuthModal();
      }

      showMessage(
        message,
        data.session
          ? "Akoonkaaga waa la sameeyay."
          : "Akoonka waa la sameeyay. Fadlan email-kaaga xaqiiji.",
        "success"
      );

      registerForm.reset();

    } catch (error) {
      console.error("Register error:", error);

      showMessage(
        message,
        error.message || "Diiwaangelintu way fashilantay.",
        "error"
      );

    } finally {
      setLoading(button, false, "Register");
    }
  });

  /* =====================================================
     15. FORGOT PASSWORD
  ===================================================== */

  byId("forgotPasswordBtn")?.addEventListener(
    "click",
    async () => {
      const email = getValue("loginEmail");
      const message = byId("loginMessage");

      clearMessage(message);

      if (!email) {
        showMessage(
          message,
          "Marka hore geli email-kaaga.",
          "error"
        );
        return;
      }

      try {
        const { error } =
          await db.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin
          });

        if (error) throw error;

        showMessage(
          message,
          "Linkiga dib-u-dejinta password-ka waxaa lagu diray email-kaaga.",
          "success"
        );

      } catch (error) {
        console.error("Password reset error:", error);

        showMessage(
          message,
          error.message || "Password reset wuu fashilmay.",
          "error"
        );
      }
    }
  );

  /* =====================================================
     16. UPDATE MEMBER DASHBOARD
  ===================================================== */

  async function updateDashboard() {
    if (!currentUser) {
      currentProfile = null;

      setDashboardVisible(false);

      if (byId("ownerPublishPanel")) {
        byId("ownerPublishPanel").hidden = true;
      }

      setText("accountBtnText", "Account");

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
      "Akhriste";

    setText("memberDisplayName", name);
    setText("memberDisplayEmail", currentUser.email);

    setText(
      "memberRole",
      owner ? "Owner / Maamule" : "Reader / Akhriste"
    );

    setText("profileName", name);
    setText("profileEmail", currentUser.email);

    setText(
      "profileType",
      owner ? "Owner" : "Reader"
    );

    setText(
      "profileDate",
      formatDate(currentUser.created_at)
    );

    const ownerPanel = byId("ownerPublishPanel");

    if (ownerPanel) {
      ownerPanel.hidden = !owner;
    }

    const ownerBadge = byId("ownerBadge");

    if (ownerBadge) {
      ownerBadge.hidden = !owner;
    }

    setText("accountBtnText", name);

    setDashboardVisible(true);

    await loadMySubmissions();

    if (owner) {
      await loadPendingNews();
    }
  }

  /* =====================================================
     17. LOGOUT
  ===================================================== */

  async function logoutUser() {
    try {
      const { error } = await db.auth.signOut();

      if (error) throw error;

      currentUser = null;
      currentProfile = null;
      currentNews = [];

      setDashboardVisible(false);

      closeAuthModal();

      window.location.reload();

    } catch (error) {
      console.error("Logout error:", error);

      alert("Ka bixitaanku wuu fashilmay: " + error.message);
    }
  }

  byId("logoutBtn")?.addEventListener("click", logoutUser);

  /* =====================================================
     18. SUPABASE IMAGE UPLOAD
  ===================================================== */

  async function uploadNewsImage(file) {
    if (!file) return null;

    if (!file.type.startsWith("image/")) {
      throw new Error("Fadlan dooro sawir sax ah.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Sawirku waa inuusan ka weynaan 5MB.");
    }

    if (!currentUser) {
      throw new Error("Fadlan marka hore login samee.");
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeExtension = /^[a-z0-9]+$/.test(extension)
      ? extension
      : "jpg";

    const uniqueName =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const filePath =
      `${currentUser.id}/${uniqueName}.${safeExtension}`;

    const { error } = await db.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type
      });

    if (error) throw error;

    const { data } = db.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /* =====================================================
     19. IMAGE PREVIEW
  ===================================================== */

  function setupImagePreview(inputId, previewId) {
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

      if (!file.type.startsWith("image/")) {
        alert("Fadlan dooro sawir sax ah.");

        input.value = "";
        preview.hidden = true;

        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Sawirku waa inuusan ka weynaan 5MB.");

        input.value = "";
        preview.hidden = true;

        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        preview.src = reader.result;
        preview.hidden = false;
      };

      reader.readAsDataURL(file);
    });
  }

  setupImagePreview("newsImageFile", "newsImagePreview");

  setupImagePreview(
    "memberNewsImageFile",
    "memberNewsImagePreview"
  );

  /* =====================================================
     20. PUBLISH OWNER NEWS
  ===================================================== */

  const ownerNewsForm = byId("ownerNewsForm");

  ownerNewsForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = byId("ownerNewsMessage");

    const button =
      byId("publishNewsBtn") ||
      $('button[type="submit"]', ownerNewsForm);

    clearMessage(message);

    if (!currentUser) {
      showMessage(
        message,
        "Fadlan marka hore login samee.",
        "error"
      );
      return;
    }

    await loadProfile();

    if (!isOwner()) {
      showMessage(
        message,
        "Kaliya Owner ayaa si toos ah u daabici kara wararka.",
        "error"
      );
      return;
    }

    const title = getValue("newsTitle");
    const category = getValue("newsCategory");
    const location = getValue("newsLocation");
    const content = getValue("newsContent");
    const sourceUrl = getValue("newsSource");
    const imageUrlInput = getValue("newsImage");

    const imageFile =
      byId("newsImageFile")?.files?.[0];

    if (!title || !category || !content) {
      showMessage(
        message,
        "Fadlan geli cinwaanka, qaybta iyo qoraalka warka.",
        "error"
      );
      return;
    }

    if (!isValidUrl(sourceUrl) || !isValidUrl(imageUrlInput)) {
      showMessage(
        message,
        "URL-ka sawirka ama isha warka sax ma aha.",
        "error"
      );
      return;
    }

    setLoading(button, true, "Daabac Warka");

    try {
      let imageUrl = imageUrlInput || null;

      if (imageFile) {
        imageUrl = await uploadNewsImage(imageFile);
      }

      const { error } = await db
        .from("news_submissions")
        .insert({
          user_id: currentUser.id,
          title,
          category,
          location: location || null,
          summary: makeSummary(content),
          content,
          image_url: imageUrl,
          source_url: sourceUrl || null,
          status: "approved"
        });

      if (error) throw error;

      showMessage(
        message,
        "Hambalyo! Warka si guul leh ayaa loo daabacay.",
        "success"
      );

      ownerNewsForm.reset();

      const preview = byId("newsImagePreview");

      if (preview) {
        preview.hidden = true;
        preview.removeAttribute("src");
      }

      await loadPublishedNews();
      await loadMySubmissions();
      await loadPendingNews();

    } catch (error) {
      console.error("Owner publish error:", error);

      showMessage(
        message,
        error.message || "Warka lama daabici karin.",
        "error"
      );

    } finally {
      setLoading(button, false, "Daabac Warka");
    }
  });

  /* =====================================================
     21. MEMBER NEWS SUBMISSION
     MEMBER NEWS = PENDING
  ===================================================== */

  const memberNewsForm = byId("memberNewsForm");

  memberNewsForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = byId("memberNewsMessage");

    const button =
      byId("submitMemberNewsBtn") ||
      $('button[type="submit"]', memberNewsForm);

    clearMessage(message);

    if (!currentUser) {
      showMessage(
        message,
        "Fadlan marka hore login samee.",
        "error"
      );
      return;
    }

    const title = getValue("memberNewsTitle");
    const category = getValue("memberNewsCategory");
    const location = getValue("memberNewsLocation");
    const content = getValue("memberNewsContent");
    const sourceUrl = getValue("memberNewsSource");

    const imageFile =
      byId("memberNewsImageFile")?.files?.[0];

    if (!title || !category || !content) {
      showMessage(
        message,
        "Fadlan buuxi cinwaanka, qaybta iyo qoraalka.",
        "error"
      );
      return;
    }

    if (!isValidUrl(sourceUrl)) {
      showMessage(
        message,
        "Isha warka URL-keedu sax ma aha.",
        "error"
      );
      return;
    }

    setLoading(button, true, "Gudbi Warka");

    try {
      let imageUrl = null;

      if (imageFile) {
        imageUrl = await uploadNewsImage(imageFile);
      }

      const { error } = await db
        .from("news_submissions")
        .insert({
          user_id: currentUser.id,
          title,
          category,
          location: location || null,
          summary: makeSummary(content),
          content,
          image_url: imageUrl,
          source_url: sourceUrl || null,
          status: "pending"
        });

      if (error) throw error;

      showMessage(
        message,
        "Warka waa la gudbiyay. Wuxuu sugayaa oggolaanshaha Owner-ka.",
        "success"
      );

      memberNewsForm.reset();

      const preview = byId("memberNewsImagePreview");

      if (preview) {
        preview.hidden = true;
        preview.removeAttribute("src");
      }

      await loadMySubmissions();

    } catch (error) {
      console.error("Member submission error:", error);

      showMessage(
        message,
        error.message || "Warka lama gudbin karin.",
        "error"
      );

    } finally {
      setLoading(button, false, "Gudbi Warka");
    }
  });

  /* =====================================================
     22. LOAD APPROVED NEWS
  ===================================================== */

  async function loadPublishedNews() {
    const homeContainer = byId("publishedNewsList");
    const dashboardContainer =
      byId("dashboardPublishedNewsList") ||
      byId("dashboardNewsList");

    if (homeContainer) {
      homeContainer.innerHTML =
        '<p class="loading-news">Wararka ayaa la soo rarayaa...</p>';
    }

    try {
      const { data, error } = await db
        .from("news_submissions")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;

      currentNews = data || [];

      renderPublishedNews(currentNews);
      renderDashboardNews(currentNews);

    } catch (error) {
      console.error("Published news error:", error);

      const errorHTML =
        '<p class="error-message">Wararka lama soo bandhigi karin. Hubi Supabase RLS policies.</p>';

      if (homeContainer) {
        homeContainer.innerHTML = errorHTML;
      }

      if (dashboardContainer) {
        dashboardContainer.innerHTML = errorHTML;
      }
    }
  }

  /* =====================================================
     23. RENDER HOMEPAGE NEWS
  ===================================================== */

  function renderPublishedNews(news) {
    const container = byId("publishedNewsList");

    if (!container) return;

    if (!news || news.length === 0) {
      container.innerHTML =
        '<p class="no-news">Weli wax warar ah lama daabicin.</p>';
      return;
    }

    container.innerHTML = news.map((item) => {
      const title = escapeHTML(item.title);
      const category = escapeHTML(item.category || "Warar");

      const summary = escapeHTML(
        item.summary || makeSummary(item.content)
      );

      const location = escapeHTML(item.location || "");

      const image = item.image_url &&
        isValidUrl(item.image_url)
        ? `
          <div class="news-image">
            <img
              src="${escapeHTML(item.image_url)}"
              alt="${title}"
              loading="lazy"
              onerror="this.parentElement.style.display='none'">
          </div>
        `
        : "";

      return `
        <article
          class="news-card database-news-card"
          data-news-card
          data-id="${escapeHTML(item.id)}">

          ${image}

          <div class="news-info news-content">

            <span class="category-badge news-category">
              ${category}
            </span>

            <h3 class="news-title">${title}</h3>

            <p class="news-summary">${summary}</p>

            <div class="news-meta">
              <span>${location}</span>
              <span class="news-date">
                ${formatDate(item.created_at)}
              </span>
            </div>

            <button
              type="button"
              class="read-more read-more-btn"
              data-read-news="${escapeHTML(item.id)}">

              Akhri Warka
              <i class="fa-solid fa-arrow-right"></i>
            </button>

          </div>
        </article>
      `;
    }).join("");
  }

  /* =====================================================
     24. DASHBOARD PUBLISHED NEWS
  ===================================================== */

  function renderDashboardNews(news) {
    const container =
      byId("dashboardPublishedNewsList") ||
      byId("dashboardNewsList") ||
      byId("ownerPublishedNews");

    if (!container) return;

    if (!news || news.length === 0) {
      container.innerHTML =
        "<p>Weli warar lama daabicin.</p>";
      return;
    }

    container.innerHTML = news.map((item) => `
      <article class="dashboard-news-item">

        <div>
          <h4>${escapeHTML(item.title)}</h4>
          <p>${escapeHTML(item.category || "Warar")}</p>
          <small>${formatDate(item.created_at)}</small>
        </div>

        ${
          isOwner()
            ? `
              <button
                type="button"
                class="delete-news-btn"
                data-delete-news="${escapeHTML(item.id)}">
                Delete
              </button>
            `
            : ""
        }

      </article>
    `).join("");
  }

  /* =====================================================
     25. NEWS DETAILS MODAL
  ===================================================== */

  function openNewsDetails(newsId) {
    const item = currentNews.find(
      (news) => String(news.id) === String(newsId)
    );

    if (!item) return;

    byId("newsDetailsModal")?.remove();
    byId("newsDetailModal")?.remove();

    const modal = document.createElement("div");

    modal.id = "newsDetailsModal";
    modal.className = "news-details-modal news-detail-modal";

    const safeImage =
      item.image_url && isValidUrl(item.image_url)
        ? `
          <img
            src="${escapeHTML(item.image_url)}"
            alt="${escapeHTML(item.title)}">
        `
        : "";

    const safeSource =
      item.source_url && isValidUrl(item.source_url)
        ? `
          <p>
            <a
              href="${escapeHTML(item.source_url)}"
              target="_blank"
              rel="noopener noreferrer">
              Isha warka
            </a>
          </p>
        `
        : "";

    modal.innerHTML = `
      <div class="news-details-content news-detail-content">

        <button
          type="button"
          class="news-details-close news-detail-close"
          aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <span class="category-badge">
          ${escapeHTML(item.category || "Warar")}
        </span>

        <h2>${escapeHTML(item.title)}</h2>

        <p class="news-date">
          ${formatDate(item.created_at)}
        </p>

        ${safeImage}

        <p class="news-details-location">
          ${escapeHTML(item.location || "")}
        </p>

        <p class="news-detail-summary">
          ${escapeHTML(item.summary || "")}
        </p>

        <div class="news-full-content news-detail-body">
          ${escapeHTML(item.content || "").replace(/\n/g, "<br>")}
        </div>

        ${safeSource}

        <p class="news-detail-brand">
          HAFID NOR MEDIA
        </p>

      </div>
    `;

    document.body.appendChild(modal);

    modal.hidden = false;
    modal.classList.add("active", "show");

    modal.querySelector(".news-details-close")
      ?.addEventListener("click", () => {
        modal.remove();
      });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });
  }

  /* =====================================================
     26. NEWS CLICK EVENTS
  ===================================================== */

  document.addEventListener("click", (event) => {
    const readButton = event.target.closest("[data-read-news]");

    if (readButton) {
      openNewsDetails(readButton.dataset.readNews);
      return;
    }

    const deleteButton = event.target.closest("[data-delete-news]");

    if (deleteButton) {
      deleteNews(deleteButton.dataset.deleteNews);
      return;
    }

    const approveButton = event.target.closest("[data-approve-news]");

    if (approveButton) {
      moderateNews(approveButton.dataset.approveNews, "approved");
      return;
    }

    const rejectButton = event.target.closest("[data-reject-news]");

    if (rejectButton) {
      moderateNews(rejectButton.dataset.rejectNews, "rejected");
    }
  });

  /* =====================================================
     27. OWNER PENDING NEWS
  ===================================================== */

  async function loadPendingNews() {
    if (!currentUser || !isOwner()) return;

    const container = byId("pendingNewsList");

    if (!container) return;

    container.innerHTML =
      '<p class="loading-news">Wararka sugaya oggolaanshaha...</p>';

    try {
      const { data, error } = await db
        .from("news_submissions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        container.innerHTML =
          "<p>Ma jiraan warar sugaya oggolaansho.</p>";
        return;
      }

      container.innerHTML = data.map((item) => `
        <article class="submission-item">

          <h3>${escapeHTML(item.title)}</h3>

          <p>${escapeHTML(item.category || "")}</p>

          <p>${escapeHTML(item.summary || makeSummary(item.content))}</p>

          <small>${formatDate(item.created_at)}</small>

          <div class="submission-actions">

            <button
              type="button"
              data-approve-news="${escapeHTML(item.id)}">
              Approve
            </button>

            <button
              type="button"
              data-reject-news="${escapeHTML(item.id)}">
              Reject
            </button>

          </div>

        </article>
      `).join("");

    } catch (error) {
      console.error("Pending news error:", error);

      container.innerHTML =
        "<p>Wararka sugaya lama soo bandhigi karin.</p>";
    }
  }

  /* =====================================================
     28. APPROVE / REJECT NEWS
  ===================================================== */

  async function moderateNews(newsId, status) {
    if (!currentUser) return;

    await loadProfile();

    if (!isOwner()) {
      alert("Ogolaansho ma lihid.");
      return;
    }

    if (!["approved", "rejected"].includes(status)) {
      return;
    }

    const question = status === "approved"
      ? "Ma oggolaanaysaa in warkan la daabaco?"
      : "Ma diidaysaa warkan?";

    if (!confirm(question)) return;

    try {
      const { error } = await db
        .from("news_submissions")
        .update({ status })
        .eq("id", newsId)
        .eq("status", "pending");

      if (error) throw error;

      alert(
        status === "approved"
          ? "Warka waa la oggolaaday."
          : "Warka waa la diiday."
      );

      await loadPendingNews();
      await loadPublishedNews();
      await loadMySubmissions();

    } catch (error) {
      console.error("Moderation error:", error);

      alert("Hawsha way fashilantay: " + error.message);
    }
  }

  /* =====================================================
     29. DELETE NEWS
  ===================================================== */

  async function deleteNews(newsId) {
    if (!currentUser) return;

    await loadProfile();

    if (!isOwner()) {
      alert("Kaliya Owner ayaa tirtiri kara wararka.");
      return;
    }

    if (!confirm("Ma hubtaa inaad tirtirayso warkan?")) {
      return;
    }

    try {
      const { error } = await db
        .from("news_submissions")
        .delete()
        .eq("id", newsId);

      if (error) throw error;

      alert("Warka waa la tirtiray.");

      await loadPublishedNews();
      await loadPendingNews();
      await loadMySubmissions();

    } catch (error) {
      console.error("Delete news error:", error);

      alert("Warka lama tirtiri karin: " + error.message);
    }
  }

  /* =====================================================
     30. LOAD MY SUBMISSIONS
  ===================================================== */

  async function loadMySubmissions() {
    if (!currentUser) return;

    const containers = [
      byId("mySubmissionsList"),
      byId("memberNewsList")
    ].filter(Boolean);

    if (!containers.length) return;

    try {
      const { data, error } = await db
        .from("news_submissions")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      let html = "";

      if (!data || data.length === 0) {
        html =
          "<p>Weli ma aadan soo gudbin wax war ah.</p>";
      } else {
        html = data.map((item) => `
          <article class="submission-item">

            <h4>${escapeHTML(item.title)}</h4>

            <p>${escapeHTML(item.category || "")}</p>

            <span class="submission-status status-${escapeHTML(item.status)}">
              ${escapeHTML(item.status)}
            </span>

            <small>${formatDate(item.created_at)}</small>

          </article>
        `).join("");
      }

      containers.forEach((container) => {
        container.innerHTML = html;
      });

    } catch (error) {
      console.error("My submissions error:", error);

      containers.forEach((container) => {
        container.innerHTML =
          "<p>Wararkaaga lama soo gelin karin.</p>";
      });
    }
  }

  /* =====================================================
     31. DASHBOARD TABS
  ===================================================== */

  const dashboardTabMap = {
    publishedNews: "publishedNewsPanel",
    profile: "memberProfilePanel"
  };

  function activateDashboardTab(tab, panel) {
    $$(".dashboard-tab").forEach((item) => {
      item.classList.remove("active");
    });

    $$(".dashboard-panel").forEach((item) => {
      item.classList.remove("active");
      item.hidden = true;
    });

    tab.classList.add("active");

    if (panel) {
      panel.hidden = false;
      panel.classList.add("active");
    }
  }

  $$(".dashboard-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetName = tab.dataset.dashboardTab;

      const panelId =
        dashboardTabMap[targetName] || targetName;

      const panel = byId(panelId);

      if (panel) {
        activateDashboardTab(tab, panel);
      }
    });
  });

  $$("[data-dashboard-tab]").forEach((tab) => {
    if (tab.classList.contains("dashboard-tab")) return;

    tab.addEventListener("click", () => {
      const panel = byId(tab.dataset.dashboardTab);

      if (panel) {
        $$("[data-dashboard-tab]").forEach((item) => {
          item.classList.remove("active");
        });

        $$("[data-dashboard-panel]").forEach((item) => {
          item.hidden = true;
        });

        tab.classList.add("active");
        panel.hidden = false;
      }
    });
  });

  /* =====================================================
     32. NEWSLETTER
  ===================================================== */

  const newsletterForm = byId("newsletterForm");

  newsletterForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = getValue("newsletterEmail");

    const message =
      byId("newsletterMessage") ||
      $(".form-message", newsletterForm);

    const button =
      $('button[type="submit"]', newsletterForm);

    clearMessage(message);

    if (!email) {
      showMessage(
        message,
        "Fadlan geli email-kaaga.",
        "error"
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage(
        message,
        "Fadlan geli email sax ah.",
        "error"
      );
      return;
    }

    setLoading(button, true, "Isdiiwaangeli");

    try {
      const { error } = await db
        .from("newsletter_subscribers")
        .insert({ email });

      if (error) {
        if (error.code === "23505") {
          throw new Error(
            "Email-kan hore ayaa loo diiwaangeliyey."
          );
        }

        throw error;
      }

      showMessage(
        message,
        "Waad ku mahadsan tahay isdiiwaangelintaada!",
        "success"
      );

      newsletterForm.reset();

    } catch (error) {
      console.error("Newsletter error:", error);

      showMessage(
        message,
        error.message || "Isdiiwaangelintu way fashilantay.",
        "error"
      );

    } finally {
      setLoading(button, false, "Isdiiwaangeli");
    }
  });

  /* =====================================================
     33. BACK TO TOP
  ===================================================== */

  const backToTop = byId("backToTop");

  window.addEventListener("scroll", () => {
    if (!backToTop) return;

    const visible = window.scrollY > 400;

    backToTop.classList.toggle("show", visible);
    backToTop.classList.toggle("active", visible);
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  /* =====================================================
     34. AUTH SESSION INITIALIZATION
  ===================================================== */

  async function initializeAuth() {
    try {
      const { data, error } = await db.auth.getSession();

      if (error) throw error;

      currentUser = data.session?.user || null;

      if (currentUser) {
        await loadProfile();
      } else {
        currentProfile = null;
      }

      await updateDashboard();

      authInitialized = true;

    } catch (error) {
      console.error("Session initialization error:", error);

      currentUser = null;
      currentProfile = null;

      setDashboardVisible(false);

      authInitialized = true;
    }
  }

  /* =====================================================
     35. AUTH STATE CHANGES
  ===================================================== */

  db.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;

    if (event === "SIGNED_OUT") {
      currentProfile = null;

      setDashboardVisible(false);

      return;
    }

    if (
      event === "SIGNED_IN" ||
      event === "TOKEN_REFRESHED" ||
      event === "USER_UPDATED"
    ) {
      if (!authInitialized) return;

      setTimeout(async () => {
        await loadProfile();
        await updateDashboard();
        await loadPublishedNews();
      }, 0);
    }
  });

  /* =====================================================
     36. INITIALIZE WEBSITE
  ===================================================== */

  async function initializeWebsite() {
    try {
      await initializeAuth();

      // Approved news is public.
      await loadPublishedNews();

      console.log(
        "HAFID NOR MEDIA loaded successfully."
      );

    } catch (error) {
      console.error(
        "Website initialization error:",
        error
      );
    }
  }

  initializeWebsite();

});
