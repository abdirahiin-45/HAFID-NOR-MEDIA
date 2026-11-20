
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =================================================
     1. SUPABASE CONFIGURATION
  ================================================= */

  const SUPABASE_URL =
    "https://ccddbcbmypeianekxhez.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_orYahZVqH7xGceVZqORwFA_npWRYBlw";

  if (!window.supabase) {
    console.error("Supabase CDN lama soo shubin.");
    return;
  }

  const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  /* =================================================
     2. GLOBAL VARIABLES
  ================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const byId = (id) => document.getElementById(id);

  let currentUser = null;
  let currentProfile = null;
  let currentLanguage = "so";
  let newsCache = [];

  /* =================================================
     3. HELPER FUNCTIONS
  ================================================= */

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
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

  function formatDate(date) {
    if (!date) return "";

    const locale = {
      so: "so-SO",
      en: "en-US",
      ar: "ar"
    }[currentLanguage] || "so-SO";

    return new Date(date).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function setLoading(button, loading, defaultText) {
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

  function setDashboardVisible(visible) {
    const dashboard = byId("memberDashboard");

    if (!dashboard) return;

    dashboard.hidden = !visible;
    dashboard.style.display = visible ? "" : "none";
  }

  function isValidUrl(value) {
    if (!value) return true;

    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }

  /* =================================================
     4. CURRENT DATE AND YEAR
  ================================================= */

  function updateDate() {
    const dateElement = byId("currentDate");

    if (!dateElement) return;

    const now = new Date();

    dateElement.textContent = now.toLocaleDateString(
      currentLanguage === "en" ? "en-US" :
      currentLanguage === "ar" ? "ar" : "so-SO",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );
  }

  if (byId("currentYear")) {
    byId("currentYear").textContent =
      new Date().getFullYear();
  }

  /* =================================================
     5. MOBILE NAVIGATION
  ================================================= */

  const menuToggle = byId("menuToggle");
  const mainNav = byId("mainNav");

  menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav?.classList.toggle("active");

    menuToggle.classList.toggle("active", Boolean(isOpen));
    menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));

    const icon = $("i", menuToggle);

    if (icon) {
      icon.className = isOpen
        ? "fa-solid fa-xmark"
        : "fa-solid fa-bars";
    }
  });

  $$(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav?.classList.remove("active");
      menuToggle?.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");

      const icon = $("i", menuToggle);

      if (icon) {
        icon.className = "fa-solid fa-bars";
      }

      $$(".main-nav a").forEach((item) => {
        item.classList.remove("active");
      });

      link.classList.add("active");
    });
  });

  /* =================================================
     6. SEARCH BOX
  ================================================= */

  const searchBtn = byId("searchBtn");
  const searchBox = byId("searchBox");
  const searchInput = byId("searchInput");
  const searchSubmit = byId("searchSubmit");

  searchBtn?.addEventListener("click", () => {
    const opened = searchBox?.classList.toggle("active");

    searchBox?.classList.toggle("show", Boolean(opened));

    if (opened) {
      searchInput?.focus();
    }
  });

  function performSearch() {
    const query = searchInput?.value.trim().toLowerCase();

    if (!query) {
      alert("Fadlan qor erayga aad raadinayso.");
      return;
    }

    let found = 0;

    const cards = $$(".news-card, .side-news, .category-item");

    cards.forEach((card) => {
      const matches = card.textContent
        .toLowerCase()
        .includes(query);

      card.style.display = matches ? "" : "none";

      if (matches) found++;
    });

    if (found === 0) {
      alert("Wax war ah lagama helin raadintaada.");
    }
  }

  searchSubmit?.addEventListener("click", performSearch);

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      performSearch();
    }
  });

  /* =================================================
     7. DARK MODE
  ================================================= */

  const darkModeBtn = byId("darkModeBtn");

  function applyTheme(theme) {
    const dark = theme === "dark";

    document.body.classList.toggle("dark-mode", dark);
    document.documentElement.classList.toggle("dark-mode", dark);

    const icon = $("i", darkModeBtn);

    if (icon) {
      icon.className = dark
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";
    }

    localStorage.setItem("hafid-theme", theme);
  }

  applyTheme(localStorage.getItem("hafid-theme") || "light");

  darkModeBtn?.addEventListener("click", () => {
    const isDark =
      document.body.classList.contains("dark-mode");

    applyTheme(isDark ? "light" : "dark");
  });

/* =================================================
   8. COLOR CUSTOMIZER
================================================= */

const colorPickerBtn = byId("colorPickerBtn");
const colorPanel = byId("colorPanel");
const primaryColor = byId("primaryColor");
const accentColor = byId("accentColor");
const resetColors = byId("resetColors");

function applyColors(primary, accent) {
  document.documentElement.style.setProperty("--primary", primary);
  document.documentElement.style.setProperty("--accent", accent);

  localStorage.setItem("hafid-primary", primary);
  localStorage.setItem("hafid-accent", accent);

  if (primaryColor) primaryColor.value = primary;
  if (accentColor) accentColor.value = accent;
}

// Fur oo xir Color Panel
colorPickerBtn?.addEventListener("click", () => {
  const opened = colorPanel?.classList.toggle("active");

  colorPanel?.classList.toggle("show", Boolean(opened));

  colorPickerBtn.setAttribute(
    "aria-expanded",
    String(Boolean(opened))
  );
});

// Soo celi midabadii hore loo kaydiyey
const savedPrimary = localStorage.getItem("hafid-primary");
const savedAccent = localStorage.getItem("hafid-accent");

applyColors(
  savedPrimary || "#102b46",
  savedAccent || "#f47b35"
);

// Beddel Main Color
primaryColor?.addEventListener("input", () => {
  applyColors(
    primaryColor.value,
    accentColor?.value || "#f47b35"
  );
});

// Beddel Accent Color
accentColor?.addEventListener("input", () => {
  applyColors(
    primaryColor?.value || "#102b46",
    accentColor.value
  );
});

// Midabada diyaarsan
$$(".preset").forEach((preset) => {
  preset.addEventListener("click", () => {
    const primary = preset.dataset.primary;
    const accent = preset.dataset.accent;

    if (!primary || !accent) return;

    applyColors(primary, accent);
  });
});

// Dib u celi midabada
resetColors?.addEventListener("click", () => {
  localStorage.removeItem("hafid-primary");
  localStorage.removeItem("hafid-accent");

  applyColors("#102b46", "#f47b35");
});


  /* =================================================
     9. LANGUAGE TRANSLATIONS
  ================================================= */

  const translations = {
    so: {
      latestDate: "Wararkii ugu dambeeyay",
      location: "Muqdisho, Soomaaliya",
      tagline: "XOG • XAQIIQO • WARAR",
      colors: "Midabada",
      customize: "Hagaaji Website-ka",
      chooseColor: "Dooro midabka website-ka",
      mainColor: "Midabka Koowaad",
      accentColor: "Midabka Labaad",
      colorThemes: "Midabada Diyaarsan",
      resetColors: "Dib u celi midabada",
      account: "Akoon",
      searchPlaceholder: "Raadi wararka aad rabto...",
      search: "Raadi",
      home: "Bogga Hore",
      somalia: "Soomaaliya",
      world: "Caalamka",
      politics: "Siyaasadda",
      business: "Dhaqaalaha",
      sports: "Ciyaaraha",
      technology: "Tiknoolajiyadda",
      videos: "Muuqaallo",
      about: "Nagu Saabsan",
      breaking: "WAR DEGDEG AH",
      breakingText: "Ku soo dhawoow HAFID NOR MEDIA — Wararkii ugu dambeeyay ee Soomaaliya iyo Caalamka.",
      topStories: "Wararka Ugu Muhiimsan",
      allNews: "Dhammaan Wararka",
      featuredNews: "Wararka ugu waaweyn",
      heroTitle: "HAFID NOR MEDIA: Ku soo dhawoow warbaahinta xogta iyo xaqiiqada",
      heroDescription: "Halkaan kala soco wararka Soomaaliya, Geeska Afrika iyo dhacdooyinka caalamka.",
      readNews: "Akhri Warka",
      sideWorld: "Wararkii ugu dambeeyay ee caalamka",
      sideBusiness: "Wararka dhaqaalaha iyo ganacsiga",
      sideSports: "Wararka ciyaaraha iyo tartamada",
      internationalNews: "Warar caalami ah",
      analysis: "Falanqayn",
      latestNews: "Wararkii Ugu Dambeeyay",
      seeAll: "Arag Dhammaan →",
      somaliaNews: "Wararka Soomaaliya",
      latestSomalia: "Wararkii ugu dambeeyay ee dalka Soomaaliya",
      somaliaDescription: "Halkaan ka akhri wararka iyo dhacdooyinka dalka.",
      worldNews: "Wararka Caalamka",
      latestWorld: "Dhacdooyinka ugu waaweyn ee caalamka",
      worldDescription: "La soco wararka caalamiga ah iyo falanqaynta.",
      economy: "Dhaqaalaha",
      latestBusiness: "Ganacsiga iyo dhaqaalaha Soomaaliya",
      businessDescription: "Warbixinno ku saabsan ganacsiga iyo suuqa.",
      latestTechnology: "Horumarka tiknoolajiyadda iyo internetka",
      technologyDescription: "Wararka cusub ee tiknoolajiyadda adduunka.",
      latestSports: "Wararka kubadda cagta iyo ciyaaraha",
      sportsDescription: "Natiijooyinka, kooxaha iyo ciyaartoyda.",
      interviews: "Wareysiyo",
      latestInterviews: "Wareysiyo iyo aragtiyo kala duwan",
      interviewsDescription: "La soco doodaha iyo wareysiyada gaarka ah.",
      somaliaSection: "Wararka Soomaaliya",
      somaliaFeature: "Wararka iyo dhacdooyinka Soomaaliya",
      localNews: "Wararka gudaha",
      report: "Warbixin",
      education: "Waxbarashada",
      community: "Bulshada",
      worldSection: "Wararka Caalamka",
      worldBannerTitle: "La soco dhacdooyinka caalamka",
      worldBannerDescription: "Warar, falanqayn iyo xog caalami ah.",
      politicsSection: "Siyaasadda",
      politicsDescription: "Halkaan waxaa lagu soo bandhigayaa wararka siyaasadda, go'aamada iyo falanqaynta.",
      businessSection: "Dhaqaalaha iyo Ganacsiga",
      businessSectionDescription: "Wararka dhaqaalaha, ganacsiga, suuqyada iyo maalgashiga.",
      sportsSection: "Ciyaaraha",
      sportsSectionDescription: "Wararka kubadda cagta, ciyaaraha gudaha iyo kuwa caalamka.",
      technologySection: "Tiknoolajiyadda",
      technologySectionDescription: "Wararka tiknoolajiyadda, AI, internetka iyo hal-abuurka.",
      videoSection: "Muuqaallo iyo Barnaamijyo",
      youtubeChannel: "YouTube Channel →",
      video1: "Barnaamijyada gaarka ah ee HAFID NOR MEDIA",
      video2: "Wareysiyo iyo falanqayn",
      video3: "Warbixinnada muuqaalka ah",
      aboutParagraph1: "HAFID NOR MEDIA waa madal warbaahineed loogu talagalay baahinta wararka, xogta, xaqiiqooyinka iyo falanqaynta Soomaaliya iyo caalamka.",
      aboutParagraph2: "Ujeeddadeennu waa in akhristayaasha la gaarsiiyo warar la hubiyey iyo xog waxtar leh.",
      contactUs: "Nala Soo Xiriir",
      newsletterTitle: "Hel Wararkii Ugu Dambeeyay",
      newsletterDescription: "La soco wararka cusub ee HAFID NOR MEDIA.",
      emailPlaceholder: "Geli email-kaaga",
      subscribe: "Isdiiwaangeli",
      footerDescription: "Warbaahin madax-bannaan oo diiradda saarta wararka Soomaaliya iyo caalamka.",
      categories: "Qaybaha",
      information: "Macluumaad",
      contact: "La Xiriir",
      privacy: "Xeerka Asturnaanta",
      terms: "Shuruudaha Adeegga",
      copyright: "Xuquuqda oo dhan way dhowran tahay.",
      backTop: "Kor u noqo ↑"
    },

    en: {
      latestDate: "Latest updates",
      location: "Mogadishu, Somalia",
      tagline: "INFORMATION • FACTS • NEWS",
      colors: "Colors",
      customize: "Customize Website",
      chooseColor: "Choose website colors",
      mainColor: "Primary Color",
      accentColor: "Accent Color",
      colorThemes: "Color Themes",
      resetColors: "Reset Colors",
      account: "Account",
      searchPlaceholder: "Search for news...",
      search: "Search",
      home: "Home",
      somalia: "Somalia",
      world: "World",
      politics: "Politics",
      business: "Business",
      sports: "Sports",
      technology: "Technology",
      videos: "Videos",
      about: "About Us",
      breaking: "BREAKING NEWS",
      breakingText: "Welcome to HAFID NOR MEDIA — The latest news from Somalia and around the world.",
      topStories: "Top Stories",
      allNews: "All News",
      featuredNews: "Featured News",
      heroTitle: "HAFID NOR MEDIA: Welcome to information and factual journalism",
      heroDescription: "Follow news from Somalia, the Horn of Africa and around the world.",
      readNews: "Read More",
      sideWorld: "Latest international news",
      sideBusiness: "Business and economic news",
      sideSports: "Sports and competition news",
      internationalNews: "International News",
      analysis: "Analysis",
      latestNews: "Latest News",
      seeAll: "See All →",
      somaliaNews: "Somalia News",
      latestSomalia: "Latest news from Somalia",
      somaliaDescription: "Read the latest news and events from the country.",
      worldNews: "World News",
      latestWorld: "Major events around the world",
      worldDescription: "Follow international news and analysis.",
      economy: "Economy",
      latestBusiness: "Business and economy in Somalia",
      businessDescription: "Reports about business and markets.",
      latestTechnology: "Technology and internet developments",
      technologyDescription: "Latest technology news around the world.",
      latestSports: "Football and sports news",
      sportsDescription: "Results, teams and players.",
      interviews: "Interviews",
      latestInterviews: "Interviews and different perspectives",
      interviewsDescription: "Follow discussions and special interviews.",
      somaliaSection: "Somalia News",
      somaliaFeature: "News and events in Somalia",
      localNews: "Local News",
      report: "Report",
      education: "Education",
      community: "Community",
      worldSection: "World News",
      worldBannerTitle: "Follow events around the world",
      worldBannerDescription: "News, analysis and international information.",
      politicsSection: "Politics",
      politicsDescription: "Political news, decisions and analysis.",
      businessSection: "Business and Economy",
      businessSectionDescription: "Economy, business, markets and investment news.",
      sportsSection: "Sports",
      sportsSectionDescription: "Football, local sports and international sports.",
      technologySection: "Technology",
      technologySectionDescription: "Technology, AI, internet and innovation news.",
      videoSection: "Videos and Programs",
      youtubeChannel: "YouTube Channel →",
      video1: "Special programs from HAFID NOR MEDIA",
      video2: "Interviews and analysis",
      video3: "Video reports",
      aboutParagraph1: "HAFID NOR MEDIA is a media platform dedicated to news, facts and analysis from Somalia and around the world.",
      aboutParagraph2: "Our goal is to provide readers with verified news and useful information.",
      contactUs: "Contact Us",
      newsletterTitle: "Get the Latest News",
      newsletterDescription: "Stay updated with HAFID NOR MEDIA.",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      footerDescription: "Independent media focused on news from Somalia and around the world.",
      categories: "Categories",
      information: "Information",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      copyright: "All rights reserved.",
      backTop: "Back to top ↑"
    },

    ar: {
      latestDate: "آخر التحديثات",
      location: "مقديشو، الصومال",
      tagline: "معلومات • حقائق • أخبار",
      colors: "الألوان",
      customize: "تخصيص الموقع",
      chooseColor: "اختر ألوان الموقع",
      mainColor: "اللون الأساسي",
      accentColor: "اللون الإضافي",
      colorThemes: "ألوان جاهزة",
      resetColors: "إعادة تعيين الألوان",
      account: "الحساب",
      searchPlaceholder: "ابحث عن الأخبار...",
      search: "بحث",
      home: "الرئيسية",
      somalia: "الصومال",
      world: "العالم",
      politics: "السياسة",
      business: "الاقتصاد",
      sports: "الرياضة",
      technology: "التكنولوجيا",
      videos: "مقاطع الفيديو",
      about: "من نحن",
      breaking: "أخبار عاجلة",
      breakingText: "مرحباً بكم في HAFID NOR MEDIA — آخر أخبار الصومال والعالم.",
      topStories: "أهم الأخبار",
      allNews: "جميع الأخبار",
      featuredNews: "أهم الأخبار",
      heroTitle: "HAFID NOR MEDIA: مرحباً بكم في منصة المعلومات والحقائق",
      heroDescription: "تابعوا أخبار الصومال والقرن الأفريقي والعالم.",
      readNews: "اقرأ الخبر",
      sideWorld: "آخر الأخبار العالمية",
      sideBusiness: "أخبار الاقتصاد والأعمال",
      sideSports: "أخبار الرياضة والمسابقات",
      internationalNews: "أخبار دولية",
      analysis: "تحليل",
      latestNews: "آخر الأخبار",
      seeAll: "عرض الكل ←",
      somaliaNews: "أخبار الصومال",
      latestSomalia: "آخر الأخبار من الصومال",
      somaliaDescription: "اقرأ أخبار وأحداث البلاد.",
      worldNews: "أخبار العالم",
      latestWorld: "أهم الأحداث حول العالم",
      worldDescription: "تابع الأخبار والتحليلات الدولية.",
      economy: "الاقتصاد",
      latestBusiness: "الأعمال والاقتصاد في الصومال",
      businessDescription: "تقارير عن الأعمال والأسواق.",
      latestTechnology: "تطورات التكنولوجيا والإنترنت",
      technologyDescription: "أحدث أخبار التكنولوجيا حول العالم.",
      latestSports: "أخبار كرة القدم والرياضة",
      sportsDescription: "النتائج والفرق واللاعبون.",
      interviews: "مقابلات",
      latestInterviews: "مقابلات ووجهات نظر مختلفة",
      interviewsDescription: "تابع النقاشات والمقابلات الخاصة.",
      somaliaSection: "أخبار الصومال",
      somaliaFeature: "أخبار وأحداث الصومال",
      localNews: "أخبار محلية",
      report: "تقرير",
      education: "التعليم",
      community: "المجتمع",
      worldSection: "أخبار العالم",
      worldBannerTitle: "تابع الأحداث حول العالم",
      worldBannerDescription: "أخبار وتحليلات ومعلومات دولية.",
      politicsSection: "السياسة",
      politicsDescription: "الأخبار السياسية والقرارات والتحليلات.",
      businessSection: "الاقتصاد والأعمال",
      businessSectionDescription: "أخبار الاقتصاد والأسواق والاستثمار.",
      sportsSection: "الرياضة",
      sportsSectionDescription: "كرة القدم والرياضة المحلية والدولية.",
      technologySection: "التكنولوجيا",
      technologySectionDescription: "أخبار التكنولوجيا والذكاء الاصطناعي والإنترنت.",
      videoSection: "مقاطع الفيديو والبرامج",
      youtubeChannel: "قناة يوتيوب ←",
      video1: "برامج HAFID NOR MEDIA الخاصة",
      video2: "مقابلات وتحليلات",
      video3: "تقارير مصورة",
      aboutParagraph1: "HAFID NOR MEDIA منصة إعلامية مخصصة لنشر الأخبار والحقائق والتحليلات من الصومال والعالم.",
      aboutParagraph2: "هدفنا تزويد القراء بأخبار موثوقة ومعلومات مفيدة.",
      contactUs: "اتصل بنا",
      newsletterTitle: "احصل على آخر الأخبار",
      newsletterDescription: "تابع آخر أخبار HAFID NOR MEDIA.",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      subscribe: "اشترك",
      footerDescription: "وسيلة إعلام مستقلة تركز على أخبار الصومال والعالم.",
      categories: "الأقسام",
      information: "معلومات",
      contact: "اتصل بنا",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      copyright: "جميع الحقوق محفوظة.",
      backTop: "العودة للأعلى ↑"
    }
  };

  function applyLanguage(language) {
    if (!translations[language]) language = "so";

    currentLanguage = language;

    document.documentElement.lang = language;
    document.documentElement.dir =
      language === "ar" ? "rtl" : "ltr";

    $$("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      const translation = translations[language][key];

      if (translation !== undefined) {
        element.textContent = translation;
      }
    });

    $$("[data-i18n-placeholder]").forEach((element) => {
      const key = element.dataset.i18nPlaceholder;
      const translation = translations[language][key];

      if (translation !== undefined) {
        element.placeholder = translation;
      }
    });

    updateDate();

    localStorage.setItem("hafid-language", language);
  }

  const languageSelect = byId("languageSelect");

  languageSelect?.addEventListener("change", () => {
    applyLanguage(languageSelect.value);
  });

  const savedLanguage =
    localStorage.getItem("hafid-language") || "so";

  if (languageSelect) {
    languageSelect.value = savedLanguage;
  }

  applyLanguage(savedLanguage);

  /* =================================================
     10. AUTH MODAL
  ================================================= */

  const authModal = byId("authModal");

  function openAuthModal() {
    if (!authModal) return;

    authModal.classList.add("active", "show");
    authModal.setAttribute("aria-hidden", "false");
  }

  function closeAuthModal() {
    if (!authModal) return;

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

  authModal?.addEventListener("click", (event) => {
    if (event.target === authModal) {
      closeAuthModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAuthModal();
  });

  /* =================================================
     11. SWITCH LOGIN AND REGISTER
  ================================================= */

  function showLoginForm() {
    byId("loginForm").hidden = false;
    byId("registerForm").hidden = true;

    clearMessage(byId("loginMessage"));
    clearMessage(byId("registerMessage"));
  }

  function showRegisterForm() {
    byId("loginForm").hidden = true;
    byId("registerForm").hidden = false;

    clearMessage(byId("loginMessage"));
    clearMessage(byId("registerMessage"));
  }

  byId("showRegisterBtn")?.addEventListener(
    "click",
    showRegisterForm
  );

  byId("showLoginBtn")?.addEventListener(
    "click",
    showLoginForm
  );

  /* =================================================
     12. LOAD USER PROFILE
  ================================================= */

  async function loadUserProfile(user) {
    if (!user) return null;

    try {
      const { data, error } = await db
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      currentProfile = data;

      return data;

    } catch (error) {
      console.error("Profile error:", error);
      currentProfile = null;
      return null;
    }
  }

  function getUserRole() {
    const role = String(
      currentProfile?.role || "reader"
    ).toLowerCase();

    return role === "owner" ? "owner" : "reader";
  }

  /* =================================================
     13. REGISTER ACCOUNT
  ================================================= */

  const registerForm = byId("registerForm");

  registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = byId("registerName").value.trim();
    const email = byId("registerEmail").value.trim();
    const password = byId("registerPassword").value;
    const confirmPassword =
      byId("registerConfirmPassword").value;

    const message = byId("registerMessage");
    const button = $('button[type="submit"]', registerForm);

    clearMessage(message);

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

    setLoading(button, true, "Sameyso Account");

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

      if (data.session && data.user) {
        currentUser = data.user;

        await loadUserProfile(currentUser);
        await updateDashboard();

        closeAuthModal();
      }

      showMessage(
        message,
        data.session
          ? "Akoonkaaga waa la sameeyay. Waad ku mahadsan tahay!"
          : "Waad ku mahadsan tahay isdiiwaangelintaada! Fadlan email-kaaga ka xaqiiji akoonka.",
        "success"
      );

    } catch (error) {
      console.error("Register error:", error);

      showMessage(
        message,
        error.message || "Isdiiwaangelintu way fashilantay.",
        "error"
      );

    } finally {
      setLoading(button, false, "Sameyso Account");
    }
  });

  /* =================================================
     14. LOGIN ACCOUNT
  ================================================= */

  const loginForm = byId("loginForm");

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = byId("loginEmail").value.trim();
    const password = byId("loginPassword").value;

    const message = byId("loginMessage");
    const button = $('button[type="submit"]', loginForm);

    clearMessage(message);

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
      const { data, error } =
        await db.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      currentUser = data.user;

      await loadUserProfile(currentUser);
      await updateDashboard();

      closeAuthModal();

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

  /* =================================================
     15. FORGOT PASSWORD
  ================================================= */

  byId("forgotPasswordBtn")?.addEventListener(
    "click",
    async () => {
      const email = byId("loginEmail")?.value.trim();

      if (!email) {
        showMessage(
          byId("loginMessage"),
          "Marka hore geli email-kaaga.",
          "error"
        );
        return;
      }

      try {
        const { error } = await db.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: window.location.origin
          }
        );

        if (error) throw error;

        showMessage(
          byId("loginMessage"),
          "Waxaan kuu dirnay email dib loogu dejinayo password-ka. Hubi email-kaaga.",
          "success"
        );

      } catch (error) {
        console.error("Password reset error:", error);

        showMessage(
          byId("loginMessage"),
          error.message || "Password-ka lama soo celin karin.",
          "error"
        );
      }
    }
  );

  /* =================================================
     16. UPDATE DASHBOARD
  ================================================= */

  async function updateDashboard() {
    if (!currentUser) {
      setDashboardVisible(false);
      return;
    }

    const role = getUserRole();

    const name =
      currentProfile?.full_name ||
      currentUser.user_metadata?.full_name ||
      currentUser.email?.split("@")[0] ||
      "Akhriste";

    byId("memberDisplayName").textContent = name;
    byId("memberDisplayEmail").textContent =
      currentUser.email || "";

    byId("memberRole").textContent =
      role === "owner" ? "Owner" : "Reader / Akhriste";

    byId("profileName").textContent = name;
    byId("profileEmail").textContent =
      currentUser.email || "";

    byId("profileType").textContent =
      role === "owner" ? "Owner" : "Reader / Akhriste";

    byId("profileDate").textContent =
      formatDate(currentUser.created_at);

    // Owner only
    byId("ownerPublishPanel").hidden =
      role !== "owner";

    setDashboardVisible(true);

    await loadPublishedNews();
  }

  /* =================================================
     17. LOGOUT
  ================================================= */

  async function logoutUser() {
    try {
      const { error } = await db.auth.signOut();

      if (error) throw error;

      currentUser = null;
      currentProfile = null;

      setDashboardVisible(false);

      location.reload();

    } catch (error) {
      console.error("Logout error:", error);
      alert("Ka bixitaanku wuu fashilmay.");
    }
  }

  byId("logoutBtn")?.addEventListener("click", logoutUser);

  /* =================================================
     18. LOAD APPROVED NEWS
  ================================================= */

  async function loadPublishedNews() {
    const list = byId("publishedNewsList");

    if (!list) return;

    list.innerHTML =
      '<p class="empty-news-message">Wararka ayaa la soo rarayaa...</p>';

    try {
      const { data, error } = await db
        .from("news_submissions")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;

      newsCache = data || [];

      renderPublishedNews(newsCache);

    } catch (error) {
      console.error("News loading error:", error);

      list.innerHTML =
        '<p class="empty-news-message">Wararka lama soo bandhigi karin. Hubi Supabase RLS policies.</p>';
    }
  }

  /* =================================================
     19. DISPLAY NEWS
  ================================================= */

  function renderPublishedNews(news) {
    const list = byId("publishedNewsList");

    if (!list) return;

    if (!news.length) {
      list.innerHTML =
        '<p class="empty-news-message">Weli ma jiraan warar la daabacay.</p>';
      return;
    }

    list.innerHTML = news.map((item) => {
      const title = escapeHTML(item.title);
      const category = escapeHTML(item.category || "Warar");

      const image = escapeHTML(
        item.image_url ||
        "https://placehold.co/700x450?text=HAFID+NOR+MEDIA"
      );

      return `
        <article class="news-card database-news-card">

          <div class="news-image">
            <img
              src="${image}"
              alt="${title}"
              loading="lazy"
              onerror="this.src='https://placehold.co/700x450?text=HAFID+NOR+MEDIA'">
          </div>

          <div class="news-info">

            <span class="category-badge">
              ${category}
            </span>

            <h3>${title}</h3>

            <p>${summary}</p>

            <span class="news-date">
              <i class="fa-regular fa-clock"></i>
              ${formatDate(item.created_at)}
            </span>

            <button
              type="button"
              class="read-more dynamic-news-button"
              data-news-id="${escapeHTML(item.id)}">

              Akhri Warka
              <i class="fa-solid fa-arrow-right"></i>
            </button>

          </div>
        </article>
      `;
    }).join("");
  }

  /* =================================================
     20. NEWS DETAILS
  ================================================= */

  byId("publishedNewsList")?.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest(
        ".dynamic-news-button"
      );

      if (!button) return;

      const id = button.dataset.newsId;

      const article = newsCache.find(
        (item) => String(item.id) === String(id)
      );

      if (!article) return;

      openNewsDetails(article);
    }
  );

  function openNewsDetails(article) {
    const existing = byId("newsDetailModal");

    existing?.remove();

    const modal = document.createElement("div");

    modal.id = "newsDetailModal";
    modal.className = "news-detail-modal";

    modal.innerHTML = `
      <div class="news-detail-content">

        <button
          type="button"
          class="news-detail-close"
          aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <span class="category-badge">
          ${escapeHTML(article.category || "Warar")}
        </span>

        <h2>${escapeHTML(article.title)}</h2>

        <p class="news-date">
          ${formatDate(article.created_at)}
        </p>

        ${
          article.image_url
            ? `<img src="${escapeHTML(article.image_url)}" alt="${escapeHTML(article.title)}">`
            : ""
        }

        <p class="news-detail-summary">
          ${escapeHTML(article.summary || "")}
        </p>

        <div class="news-detail-body">
          ${escapeHTML(article.content || "").replace(/\n/g, "<br>")}
        </div>

        ${
          isValidUrl(article.source_url) && article.source_url
            ? `<p><a href="${escapeHTML(article.source_url)}" target="_blank" rel="noopener noreferrer">Isha warka</a></p>`
            : ""
        }

        <p class="news-detail-brand">
          HAFID NOR MEDIA
        </p>

      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".news-detail-close")
      ?.addEventListener("click", () => modal.remove());

    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.remove();
    });

    document.addEventListener("keydown", function closeOnEscape(event) {
      if (event.key === "Escape") {
        modal.remove();
        document.removeEventListener("keydown", closeOnEscape);
      }
    });
  }

  /* =================================================
     21. OWNER PUBLISH NEWS
  ================================================= */

  const ownerNewsForm = byId("ownerNewsForm");

  ownerNewsForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = byId("ownerNewsMessage");
    const button = byId("publishNewsBtn");

    clearMessage(message);

    if (!currentUser) {
      showMessage(
        message,
        "Fadlan marka hore login samee.",
        "error"
      );
      return;
    }

    // Re-check the profile role before publishing.
    await loadUserProfile(currentUser);

    if (getUserRole() !== "owner") {
      showMessage(
        message,
        "Ogolaansho ma lihid. Kaliya Owner ayaa war daabici kara.",
        "error"
      );
      return;
    }

    const title = byId("newsTitle").value.trim();
    const category = byId("newsCategory").value;
    const location = byId("newsLocation").value.trim();
    const imageUrl = byId("newsImage").value.trim();
    const content = byId("newsContent").value.trim();
    const sourceUrl = byId("newsSource").value.trim();

if (!title || !category || !content) {
  showMessage(
    message,
    "Fadlan buuxi cinwaanka, qaybta iyo qoraalka warka.",
    "error"
  );
  return;
}

    if (!isValidUrl(imageUrl) || !isValidUrl(sourceUrl)) {
      showMessage(
        message,
        "URL-ka sawirka ama isha warka sax ma aha.",
        "error"
      );
      return;
    }

    setLoading(button, true, "Daabac Warka");

    try {
const { error } = await db
  .from("news_submissions")
  .insert({
    user_id: currentUser.id,
    title,
    category,
    location: location || null,
    content,
    image_url: imageUrl || null,
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

      await loadPublishedNews();

    } catch (error) {
      console.error("Publish error:", error);

      showMessage(
        message,
        error.message || "Warka lama daabici karin.",
        "error"
      );

    } finally {
      setLoading(button, false, "Daabac Warka");
    }
  });

  /* =================================================
     22. DASHBOARD TABS
  ================================================= */

  const dashboardTabMap = {
    publishedNews: "publishedNewsPanel",
    profile: "memberProfilePanel"
  };

  $$(".dashboard-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.dashboardTab;
      const panelId = dashboardTabMap[tabName];

      if (!panelId) return;

      $$(".dashboard-tab").forEach((item) => {
        item.classList.remove("active");
      });

      $$(".dashboard-panel").forEach((panel) => {
        panel.classList.remove("active");
        panel.hidden = true;
      });

      tab.classList.add("active");

      const targetPanel = byId(panelId);

      if (targetPanel) {
        targetPanel.hidden = false;
        targetPanel.classList.add("active");
      }
    });
  });

  /* =================================================
     23. NEWSLETTER SUBSCRIPTION
  ================================================= */

  const newsletterForm = byId("newsletterForm");

  newsletterForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = byId("newsletterEmail").value.trim();

    const button = $('button[type="submit"]', newsletterForm);

    if (!email) {
      alert("Fadlan geli email-kaaga.");
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

      alert("Waad ku mahadsan tahay isdiiwaangelintaada!");

      newsletterForm.reset();

    } catch (error) {
      console.error("Newsletter error:", error);

      alert(error.message || "Isdiiwaangelintu way fashilantay.");

    } finally {
      setLoading(button, false, "Isdiiwaangeli");
    }
  });

  /* =================================================
     24. BACK TO TOP
  ================================================= */

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

  /* =================================================
     25. AUTH SESSION
  ================================================= */

  async function initializeAuth() {
    try {
      const { data, error } = await db.auth.getSession();

      if (error) throw error;

      currentUser = data.session?.user || null;

      if (currentUser) {
        await loadUserProfile(currentUser);
        await updateDashboard();
      } else {
        setDashboardVisible(false);
      }

    } catch (error) {
      console.error("Session error:", error);
      setDashboardVisible(false);
    }
  }

  db.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;

    if (event === "SIGNED_OUT") {
      currentProfile = null;
      setDashboardVisible(false);
    }
  });

  /* =================================================
     26. START WEBSITE
  ================================================= */

  async function initializeWebsite() {
    await initializeAuth();

    // Load public news only when the user dashboard is open.
    // The dashboard list is private to signed-in members.
  }

  initializeWebsite();

});
