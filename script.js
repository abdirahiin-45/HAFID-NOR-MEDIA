
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================
     1. SUPABASE CONFIGURATION
  ========================================= */

  const SUPABASE_URL =
    "https://ccddbcbmypeianekxhez.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_orYahZVqH7xGceVZqORwFA_npWRYBlw";

  let db = null;

  if (window.supabase?.createClient) {
    db = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );
  } else {
    console.error(
      "Supabase library lama helin. Hubi CDN-ga HTML-ka."
    );
  }

  /* =========================================
     2. HELPER FUNCTIONS
  ========================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  function getSavedItem(key, fallback = null) {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch (error) {
      console.warn("localStorage lama akhrin karin:", error);
      return fallback;
    }
  }

  function saveItem(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (error) {
      console.warn("localStorage lama kaydin karin:", error);
    }
  }

  /* =========================================
     3. SELECT HTML ELEMENTS
  ========================================= */

  const languageSelect = $("#languageSelect");

  const colorPickerBtn = $("#colorPickerBtn");
  const colorPanel = $("#colorPanel");
  const primaryColorInput = $("#primaryColor");
  const accentColorInput = $("#accentColor");
  const resetColorsBtn = $("#resetColors");

  const darkModeBtn = $("#darkModeBtn");

  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  const searchBtn = $("#searchBtn");
  const searchBox = $("#searchBox");
  const searchInput = $("#searchInput");
  const searchSubmit = $("#searchSubmit");

  const accountBtn = $("#accountBtn");
  const accountBtnText = $("#accountBtnText");

  const authModal = $("#authModal");
  const closeAuthModal = $("#closeAuthModal");

  const loginForm = $("#loginForm");
  const registerForm = $("#registerForm");

  const showRegisterBtn = $("#showRegisterBtn");
  const showLoginBtn = $("#showLoginBtn");
  const forgotPasswordBtn = $("#forgotPasswordBtn");

  const loginMessage = $("#loginMessage");
  const registerMessage = $("#registerMessage");

  const memberDashboard = $("#memberDashboard");
  const logoutBtn = $("#logoutBtn");

  const publishedNewsList = $("#publishedNewsList");
  const publishedNewsPanel = $("#publishedNewsPanel");
  const memberProfilePanel = $("#memberProfilePanel");

  const newsletterForm = $("#newsletterForm");
  const backToTop = $("#backToTop");

  /* =========================================
     4. TRANSLATIONS
     SOMALI / ENGLISH / ARABIC
  ========================================= */

  const translations = {
    so: {
      latestDate: "Wararkii ugu dambeeyay",
      location: "Muqdisho, Soomaaliya",
      tagline: "XOG • XAQIIQO • WARAR",
      colors: "Midabbada",
      customize: "Hagaaji Website-ka",
      chooseColor: "Dooro midabka website-ka",
      mainColor: "Midabka koowaad",
      accentColor: "Midabka labaad",
      colorThemes: "Midabbada diyaar ah",
      resetColors: "Dib u celi midabbada",
      account: "Akoon",
      searchPlaceholder: "Raadi wararka aad rabto...",
      search: "Raadi",
      home: "Hoyga",
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
      internationalNews: "Warar caalami ah",
      sideBusiness: "Wararka dhaqaalaha iyo ganacsiga",
      analysis: "Falanqayn",
      sideSports: "Wararka ciyaaraha iyo tartamada",
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
      education: "Waxbarashada",
      report: "Warbixin",
      somaliaItem1: "Warbixinno cusub oo ku saabsan dalka",
      somaliaItem2: "Wararka waxbarashada iyo bulshada",
      community: "Bulshada",
      somaliaItem3: "Arrimaha bulshada iyo horumarka",
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
      youtubeChannel: "Kanaalka YouTube →",
      video1: "Barnaamijyada gaarka ah ee HAFID NOR MEDIA",
      video2: "Wareysiyo iyo falanqayn",
      video3: "Warbixinnada muuqaalka ah",
      aboutParagraph1: "HAFID NOR MEDIA waa madal warbaahineed loogu talagalay baahinta wararka, xogta, xaqiiqooyinka iyo falanqaynta Soomaaliya iyo caalamka.",
      aboutParagraph2: "Ujeeddadeennu waa in akhristayaasha la gaarsiiyo warar la hubiyey iyo xog waxtar leh.",
      contactUs: "Nala Soo Xiriir →",
      newsletterTitle: "Hel Wararkii Ugu Dambeeyay",
      newsletterDescription: "La soco wararka cusub ee HAFID NOR MEDIA.",
      emailPlaceholder: "Geli email-kaaga",
      subscribe: "Isdiiwaangeli",
      footerDescription: "Warbaahin madax-bannaan oo diiradda saarta wararka Soomaaliya iyo caalamka.",
      categories: "Qaybaha",
      information: "Macluumaad",
      privacy: "Xeerka Asturnaanta",
      terms: "Shuruudaha Adeegga",
      contact: "La Xiriir",
      copyright: "Xuquuqda oo dhan way dhowran tahay.",
      backTop: "Kor u noqo ↑",
      login: "Gal Akoonkaaga",
      register: "Sameyso Account Cusub",
      fullName: "Magaca oo buuxa",
      email: "Email-kaaga",
      password: "Password",
      confirmPassword: "Xaqiiji Password",
      yourName: "Magacaaga",
      createPassword: "Sameyso password",
      repeatPassword: "Ku celi password-ka",
      loginButton: "Login",
      registerButton: "Sameyso Account",
      forgotPassword: "Ma illowday password-ka?",
      noAccount: "Ma lihid account?",
      haveAccount: "Account ma leedahay?",
      signUp: "Isdiiwaangeli",
      memberType: "Nooca akoonka: Member / Xubin",
      welcomeMember: "Ku soo dhawoow xubinnimada HAFID NOR MEDIA",
      memberDashboard: "Dashboard-ka Xubinta",
      memberWelcome: "Ku soo dhawoow xubinnimada HAFID NOR MEDIA",
      logout: "Ka bax",
      websiteNews: "Wararka Website-ka",
      myProfile: "Profile-kayga",
      newsTitle: "Wararka HAFID NOR MEDIA",
      newsDescription: "Halkaan waxaad ka akhrisan kartaa dhammaan wararka maamulka HAFID NOR MEDIA soo geliyey.",
      profileInformation: "Xogta Xubinta",
      profileDescription: "Macluumaadka akoonkaaga HAFID NOR MEDIA.",
      name: "Magaca:",
      memberEmail: "Email:",
      memberRole: "Nooca xubinta:",
      registrationDate: "Taariikhda diiwaangelinta:",
      loadingNews: "Wararka ayaa la soo rarayaa...",
      noNews: "Weli ma jiraan warar la daabacay.",
      newsError: "Wararka hadda lama soo rari karo.",
      readMore: "Akhri wax dheeraad ah",
      loginSuccess: "Waad ku guuleysatay inaad gasho.",
      registerSuccess: "Waad ku mahadsan tahay isdiiwaangelintaada. Hubi email-kaaga haddii xaqiijin lagaa rabo.",
      passwordMismatch: "Labada password isma laha.",
      passwordShort: "Password-ku waa inuu ahaadaa ugu yaraan 8 xaraf.",
      resetSent: "Haddii email-ka sax yahay, fariinta dib-u-dejinta waa la diray.",
      enterEmail: "Fadlan geli email-kaaga marka hore.",
      loginError: "Gelitaanka waa fashilmay. Hubi email-ka iyo password-ka.",
      registerError: "Diiwaangelinta lama dhammaystiri karin.",
      loggedOut: "Waad ka baxday akoonkaaga.",
      searchEmpty: "Fadlan geli erayga aad raadineyso.",
      noSearchResults: "Wax natiijo ah lama helin.",
      newsletterNotice: "Foomka newsletter-ka weli lama xiriirin adeeg email.",
      owner: "Maamule",
      reader: "Akhriste",
      close: "Xir",
      darkMode: "Habka mugdiga",
      lightMode: "Habka iftiinka"
    },

    en: {
      latestDate: "Latest updates",
      location: "Mogadishu, Somalia",
      tagline: "INFORMATION • FACTS • NEWS",
      colors: "Colors",
      customize: "Customize Website",
      chooseColor: "Choose your website colors",
      mainColor: "Primary color",
      accentColor: "Accent color",
      colorThemes: "Color themes",
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
      featuredNews: "Featured news",
      heroTitle: "HAFID NOR MEDIA: Welcome to a platform for information and facts",
      heroDescription: "Follow news from Somalia, the Horn of Africa and around the world.",
      readNews: "Read News",
      sideWorld: "Latest international news",
      internationalNews: "International news",
      sideBusiness: "Business and economic news",
      analysis: "Analysis",
      sideSports: "Sports news and competitions",
      latestNews: "Latest News",
      seeAll: "View All →",
      somaliaNews: "Somalia News",
      latestSomalia: "The latest news from Somalia",
      somaliaDescription: "Read the latest local news and events here.",
      worldNews: "World News",
      latestWorld: "Major events from around the world",
      worldDescription: "Follow international news and analysis.",
      economy: "Economy",
      latestBusiness: "Business and the Somali economy",
      businessDescription: "Reports about business and the market.",
      latestTechnology: "Developments in technology and the internet",
      technologyDescription: "The latest technology news from around the world.",
      latestSports: "Football and sports news",
      sportsDescription: "Results, teams and players.",
      interviews: "Interviews",
      latestInterviews: "Interviews and different perspectives",
      interviewsDescription: "Watch discussions and special interviews.",
      somaliaSection: "Somalia News",
      somaliaFeature: "News and events from Somalia",
      localNews: "Local news",
      education: "Education",
      report: "Report",
      somaliaItem1: "New reports about the country",
      somaliaItem2: "Education and community news",
      community: "Community",
      somaliaItem3: "Community issues and development",
      worldSection: "World News",
      worldBannerTitle: "Stay informed about world events",
      worldBannerDescription: "News, analysis and international information.",
      politicsSection: "Politics",
      politicsDescription: "Political news, decisions and analysis.",
      businessSection: "Business and Economy",
      businessSectionDescription: "News about the economy, business, markets and investment.",
      sportsSection: "Sports",
      sportsSectionDescription: "Football, local sports and international competitions.",
      technologySection: "Technology",
      technologySectionDescription: "Technology, AI, internet and innovation news.",
      videoSection: "Videos and Programs",
      youtubeChannel: "YouTube Channel →",
      video1: "Special programs from HAFID NOR MEDIA",
      video2: "Interviews and analysis",
      video3: "Video reports",
      aboutParagraph1: "HAFID NOR MEDIA is a media platform dedicated to news, information, facts and analysis from Somalia and around the world.",
      aboutParagraph2: "Our mission is to provide readers with verified news and useful information.",
      contactUs: "Contact Us →",
      newsletterTitle: "Get the Latest News",
      newsletterDescription: "Stay updated with the latest news from HAFID NOR MEDIA.",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      footerDescription: "An independent media platform focused on news from Somalia and around the world.",
      categories: "Categories",
      information: "Information",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact",
      copyright: "All rights reserved.",
      backTop: "Back to top ↑",
      login: "Login to Your Account",
      register: "Create a New Account",
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      yourName: "Your name",
      createPassword: "Create a password",
      repeatPassword: "Repeat your password",
      loginButton: "Login",
      registerButton: "Create Account",
      forgotPassword: "Forgot your password?",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      signUp: "Register",
      memberType: "Account type: Member / Reader",
      welcomeMember: "Welcome to HAFID NOR MEDIA membership",
      memberDashboard: "Member Dashboard",
      memberWelcome: "Welcome to HAFID NOR MEDIA",
      logout: "Logout",
      websiteNews: "Website News",
      myProfile: "My Profile",
      newsTitle: "HAFID NOR MEDIA News",
      newsDescription: "Read all news published by the HAFID NOR MEDIA administration here.",
      profileInformation: "Member Information",
      profileDescription: "Your HAFID NOR MEDIA account information.",
      name: "Name:",
      memberEmail: "Email:",
      memberRole: "Member type:",
      registrationDate: "Registration date:",
      loadingNews: "Loading news...",
      noNews: "There are no published news articles yet.",
      newsError: "News could not be loaded right now.",
      readMore: "Read more",
      loginSuccess: "You have successfully logged in.",
      registerSuccess: "Thank you for registering. Check your email if confirmation is required.",
      passwordMismatch: "The passwords do not match.",
      passwordShort: "Your password must be at least 8 characters.",
      resetSent: "If the email is valid, a password reset message has been sent.",
      enterEmail: "Please enter your email address first.",
      loginError: "Login failed. Check your email and password.",
      registerError: "Registration could not be completed.",
      loggedOut: "You have been logged out.",
      searchEmpty: "Please enter a search term.",
      noSearchResults: "No results found.",
      newsletterNotice: "The newsletter form is not connected to an email service yet.",
      owner: "Owner",
      reader: "Reader",
      close: "Close",
      darkMode: "Dark mode",
      lightMode: "Light mode"
    },

    ar: {
      latestDate: "آخر التحديثات",
      location: "مقديشو، الصومال",
      tagline: "معلومات • حقائق • أخبار",
      colors: "الألوان",
      customize: "تخصيص الموقع",
      chooseColor: "اختر ألوان الموقع",
      mainColor: "اللون الأساسي",
      accentColor: "اللون الثانوي",
      colorThemes: "سمات الألوان",
      resetColors: "إعادة ضبط الألوان",
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
      videos: "الفيديوهات",
      about: "من نحن",
      breaking: "عاجل",
      breakingText: "مرحباً بكم في HAFID NOR MEDIA — آخر أخبار الصومال والعالم.",
      topStories: "أهم الأخبار",
      allNews: "جميع الأخبار",
      featuredNews: "أبرز الأخبار",
      heroTitle: "HAFID NOR MEDIA: مرحباً بكم في منصة المعلومات والحقائق",
      heroDescription: "تابع أخبار الصومال والقرن الأفريقي وأحداث العالم.",
      readNews: "اقرأ الخبر",
      sideWorld: "آخر الأخبار العالمية",
      internationalNews: "أخبار دولية",
      sideBusiness: "أخبار الاقتصاد والأعمال",
      analysis: "تحليل",
      sideSports: "أخبار الرياضة والمسابقات",
      latestNews: "آخر الأخبار",
      seeAll: "عرض الكل ←",
      somaliaNews: "أخبار الصومال",
      latestSomalia: "آخر الأخبار من الصومال",
      somaliaDescription: "اقرأ الأخبار والأحداث المحلية هنا.",
      worldNews: "أخبار العالم",
      latestWorld: "أهم الأحداث حول العالم",
      worldDescription: "تابع الأخبار الدولية والتحليلات.",
      economy: "الاقتصاد",
      latestBusiness: "الأعمال والاقتصاد الصومالي",
      businessDescription: "تقارير عن الأعمال والأسواق.",
      latestTechnology: "التطورات في التكنولوجيا والإنترنت",
      technologyDescription: "أحدث أخبار التكنولوجيا حول العالم.",
      latestSports: "أخبار كرة القدم والرياضة",
      sportsDescription: "النتائج والفرق واللاعبون.",
      interviews: "مقابلات",
      latestInterviews: "مقابلات ووجهات نظر مختلفة",
      interviewsDescription: "تابع النقاشات والمقابلات الخاصة.",
      somaliaSection: "أخبار الصومال",
      somaliaFeature: "أخبار وأحداث الصومال",
      localNews: "أخبار محلية",
      education: "التعليم",
      report: "تقرير",
      somaliaItem1: "تقارير جديدة عن البلاد",
      somaliaItem2: "أخبار التعليم والمجتمع",
      community: "المجتمع",
      somaliaItem3: "قضايا المجتمع والتنمية",
      worldSection: "أخبار العالم",
      worldBannerTitle: "تابع الأحداث حول العالم",
      worldBannerDescription: "أخبار وتحليلات ومعلومات دولية.",
      politicsSection: "السياسة",
      politicsDescription: "الأخبار السياسية والقرارات والتحليلات.",
      businessSection: "الاقتصاد والأعمال",
      businessSectionDescription: "أخبار الاقتصاد والأعمال والأسواق والاستثمار.",
      sportsSection: "الرياضة",
      sportsSectionDescription: "كرة القدم والرياضة المحلية والمسابقات الدولية.",
      technologySection: "التكنولوجيا",
      technologySectionDescription: "أخبار التكنولوجيا والذكاء الاصطناعي والإنترنت والابتكار.",
      videoSection: "الفيديوهات والبرامج",
      youtubeChannel: "قناة يوتيوب ←",
      video1: "برامج خاصة من HAFID NOR MEDIA",
      video2: "مقابلات وتحليلات",
      video3: "تقارير مصورة",
      aboutParagraph1: "HAFID NOR MEDIA منصة إعلامية مخصصة لنشر الأخبار والمعلومات والحقائق والتحليلات من الصومال والعالم.",
      aboutParagraph2: "هدفنا هو تزويد القراء بأخبار موثوقة ومعلومات مفيدة.",
      contactUs: "اتصل بنا ←",
      newsletterTitle: "احصل على آخر الأخبار",
      newsletterDescription: "تابع آخر أخبار HAFID NOR MEDIA.",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      subscribe: "اشترك",
      footerDescription: "منصة إعلامية مستقلة تركز على أخبار الصومال والعالم.",
      categories: "الأقسام",
      information: "معلومات",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      contact: "اتصل بنا",
      copyright: "جميع الحقوق محفوظة.",
      backTop: "العودة للأعلى ↑",
      login: "تسجيل الدخول إلى حسابك",
      register: "إنشاء حساب جديد",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      yourName: "اسمك",
      createPassword: "أنشئ كلمة مرور",
      repeatPassword: "أعد كتابة كلمة المرور",
      loginButton: "دخول",
      registerButton: "إنشاء حساب",
      forgotPassword: "هل نسيت كلمة المرور؟",
      noAccount: "ليس لديك حساب؟",
      haveAccount: "لديك حساب بالفعل؟",
      signUp: "إنشاء حساب",
      memberType: "نوع الحساب: عضو / قارئ",
      welcomeMember: "مرحباً بك في عضوية HAFID NOR MEDIA",
      memberDashboard: "لوحة تحكم العضو",
      memberWelcome: "مرحباً بك في HAFID NOR MEDIA",
      logout: "تسجيل الخروج",
      websiteNews: "أخبار الموقع",
      myProfile: "ملفي الشخصي",
      newsTitle: "أخبار HAFID NOR MEDIA",
      newsDescription: "يمكنك قراءة جميع الأخبار التي تنشرها إدارة HAFID NOR MEDIA هنا.",
      profileInformation: "معلومات العضو",
      profileDescription: "معلومات حسابك في HAFID NOR MEDIA.",
      name: "الاسم:",
      memberEmail: "البريد الإلكتروني:",
      memberRole: "نوع العضوية:",
      registrationDate: "تاريخ التسجيل:",
      loadingNews: "جارٍ تحميل الأخبار...",
      noNews: "لا توجد أخبار منشورة حتى الآن.",
      newsError: "تعذر تحميل الأخبار حالياً.",
      readMore: "اقرأ المزيد",
      loginSuccess: "تم تسجيل الدخول بنجاح.",
      registerSuccess: "شكراً لتسجيلك. تحقق من بريدك الإلكتروني إذا كان التأكيد مطلوباً.",
      passwordMismatch: "كلمتا المرور غير متطابقتين.",
      passwordShort: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
      resetSent: "إذا كان البريد الإلكتروني صحيحاً، فقد تم إرسال رسالة إعادة تعيين كلمة المرور.",
      enterEmail: "يرجى إدخال بريدك الإلكتروني أولاً.",
      loginError: "فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.",
      registerError: "تعذر إكمال التسجيل.",
      loggedOut: "تم تسجيل الخروج.",
      searchEmpty: "يرجى إدخال كلمة للبحث.",
      noSearchResults: "لم يتم العثور على نتائج.",
      newsletterNotice: "نموذج النشرة البريدية غير متصل بخدمة البريد الإلكتروني بعد.",
      owner: "المدير",
      reader: "قارئ",
      close: "إغلاق",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح"
    }
  };

  let currentLanguage = "so";

  function t(key) {
    return (
      translations[currentLanguage]?.[key] ||
      translations.so[key] ||
      key
    );
  }

  /* =========================================
     5. LANGUAGE SYSTEM
  ========================================= */

  function translateStaticElements() {
    const staticTexts = {
      "#authTitle": "HAFID NOR MEDIA",
      ".auth-heading p": "welcomeMember",
      "#loginForm h3": "login",
      "#registerForm h3": "register",
      'label[for="loginEmail"]': "email",
      'label[for="loginPassword"]': "password",
      'label[for="registerName"]': "fullName",
      'label[for="registerEmail"]': "email",
      'label[for="registerPassword"]': "password",
      'label[for="registerConfirmPassword"]': "confirmPassword",
      "#loginForm .auth-submit": "loginButton",
      "#registerForm .auth-submit": "registerButton",
      "#forgotPasswordBtn": "forgotPassword",
      "#showRegisterBtn": "signUp",
      "#showLoginBtn": "loginButton",
      ".registration-role-note": "memberType",
      ".dashboard-label": "HAFID NOR MEDIA",
      ".dashboard-header h2": "memberDashboard",
      ".dashboard-header p": "memberWelcome",
      "#logoutBtn": "logout",
      '[data-dashboard-tab="publishedNews"]': "websiteNews",
      '[data-dashboard-tab="profile"]': "myProfile",
      "#publishedNewsPanel .dashboard-panel-heading h3": "newsTitle",
      "#publishedNewsPanel .dashboard-panel-heading p": "newsDescription",
      "#memberProfilePanel .dashboard-panel-heading h3": "profileInformation",
      "#memberProfilePanel .dashboard-panel-heading p": "profileDescription"
    };

    Object.entries(staticTexts).forEach(([selector, key]) => {
      const element = $(selector);
      if (!element || key === "HAFID NOR MEDIA") return;

      const icon = element.querySelector("i");

      if (key === "memberType") {
        element.textContent = t(key);
        if (icon) element.prepend(icon);
        return;
      }

      element.textContent = t(key);

      if (icon) element.prepend(icon);
    });

    const paragraphs = [
      [
        ".dashboard-tabs + .dashboard-panel .profile-details p:nth-child(1) strong",
        "name"
      ],
      [
        ".dashboard-tabs + .dashboard-panel .profile-details p:nth-child(2) strong",
        "memberEmail"
      ],
      [
        ".dashboard-tabs + .dashboard-panel .profile-details p:nth-child(3) strong",
        "memberRole"
      ],
      [
        ".dashboard-tabs + .dashboard-panel .profile-details p:nth-child(4) strong",
        "registrationDate"
      ]
    ];

    paragraphs.forEach(([selector, key]) => {
      const element = $(selector);
      if (element) element.textContent = t(key);
    });

    const loginParagraph = $("#loginForm > p:not(.form-message)");

    if (loginParagraph?.childNodes[0]) {
      loginParagraph.childNodes[0].textContent =
        t("noAccount") + " ";
    }

    const registerParagraph =
      $("#registerForm > p:not(.form-message)");

    if (registerParagraph?.childNodes[0]) {
      registerParagraph.childNodes[0].textContent =
        t("haveAccount") + " ";
    }
  }

  function applyLanguage(language) {
    if (!translations[language]) {
      language = "so";
    }

    currentLanguage = language;

    document.documentElement.lang = language;
    document.documentElement.dir =
      language === "ar" ? "rtl" : "ltr";

    $$("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      const translated = translations[language][key];

      if (translated) {
        element.textContent = translated;
      }
    });

    $$("[data-i18n-placeholder]").forEach(element => {
      const key = element.dataset.i18nPlaceholder;
      const translated = translations[language][key];

      if (translated) {
        element.placeholder = translated;
      }
    });

    translateStaticElements();
    updateDate();
    updateAccountButton();
    updateDashboardRole();

    if (languageSelect) {
      languageSelect.value = language;
    }

    saveItem("hnm_language", language);
  }

  function updateDate() {
    const dateElement = $("#currentDate");
    if (!dateElement) return;

    const locale = {
      so: "so-SO",
      en: "en-US",
      ar: "ar"
    }[currentLanguage];

    dateElement.textContent =
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(new Date());
  }

  languageSelect?.addEventListener("change", event => {
    applyLanguage(event.target.value);
  });

  /* =========================================
     6. COLOR AND DARK MODE SYSTEM
  ========================================= */

  const defaultPrimary = "#102b46";
  const defaultAccent = "#f47b35";

  function normalizeHex(hex) {
    if (typeof hex !== "string") {
      return defaultPrimary;
    }

    let value = hex.replace("#", "").trim();

    if (value.length === 3) {
      value = value
        .split("")
        .map(char => char + char)
        .join("");
    }

    if (!/^[0-9a-fA-F]{6}$/.test(value)) {
      return defaultPrimary;
    }

    return "#" + value.toLowerCase();
  }

  function getLuminance(hex) {
    const color = normalizeHex(hex);

    const rgb = [
      parseInt(color.slice(1, 3), 16),
      parseInt(color.slice(3, 5), 16),
      parseInt(color.slice(5, 7), 16)
    ].map(value => {
      value /= 255;

      return value <= 0.04045
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4);
    });

    return (
      0.2126 * rgb[0] +
      0.7152 * rgb[1] +
      0.0722 * rgb[2]
    );
  }

  function getContrastText(background) {
    return getLuminance(background) > 0.42
      ? "#111111"
      : "#ffffff";
  }

  let primaryColor = defaultPrimary;
  let accentColor = defaultAccent;
  let darkMode = false;

  const themeStyle = document.createElement("style");
  themeStyle.id = "hnm-dynamic-theme";
  document.head.appendChild(themeStyle);

  function applyTheme() {
    const root = document.documentElement;

    const primaryContrast = getContrastText(primaryColor);
    const accentContrast = getContrastText(accentColor);

    const pageBackground = darkMode
      ? "#101820"
      : "#ffffff";

    const cardBackground = darkMode
      ? "#1b2836"
      : "#ffffff";

    const textColor = darkMode
      ? "#edf2f7"
      : "#263442";

    const headingColor = darkMode
      ? "#ffffff"
      : "#102b46";

    const mutedColor = darkMode
      ? "#c0cad5"
      : "#667085";

    const borderColor = darkMode
      ? "#354454"
      : "#e5e7eb";

    root.style.setProperty("--primary-color", primaryColor);
    root.style.setProperty("--accent-color", accentColor);

    root.style.setProperty("--primary-contrast", primaryContrast);
    root.style.setProperty("--accent-contrast", accentContrast);

    root.style.setProperty("--primary-text-color", primaryContrast);
    root.style.setProperty("--accent-text-color", accentContrast);

    root.style.setProperty("--primary-hover", primaryColor);
    root.style.setProperty("--accent-hover", accentColor);

    root.style.setProperty("--page-background", pageBackground);
    root.style.setProperty("--card-background", cardBackground);
    root.style.setProperty("--text-color", textColor);
    root.style.setProperty("--heading-color", headingColor);
    root.style.setProperty("--muted-color", mutedColor);
    root.style.setProperty("--border-color", borderColor);

    root.style.colorScheme = darkMode ? "dark" : "light";

    document.body.classList.toggle("dark-mode", darkMode);

    themeStyle.textContent = `
      body {
        background: var(--page-background) !important;
        color: var(--text-color);
      }

      .main-header,
      .main-nav {
        background: var(--primary-color) !important;
        color: var(--primary-contrast) !important;
      }

      .main-header a,
      .main-nav a {
        color: var(--primary-contrast);
      }

      .breaking-news {
        background: var(--accent-color) !important;
        color: var(--accent-contrast) !important;
      }

      .breaking-news * {
        color: var(--accent-contrast);
      }

      .main-footer {
        background: var(--primary-color) !important;
        color: var(--primary-contrast) !important;
      }

      .main-footer h2,
      .main-footer h3,
      .main-footer p,
      .main-footer a,
      .main-footer i {
        color: var(--primary-contrast);
      }

      .news-card,
      .video-card,
      .category-item,
      .auth-container,
      .dashboard-panel,
      .member-profile,
      .search-box,
      .color-panel {
        background: var(--card-background);
        color: var(--text-color);
        border-color: var(--border-color);
      }

      h1, h2, h3, h4, h5, h6 {
        color: var(--heading-color);
      }

      p, small {
        color: var(--muted-color);
      }

      .read-more,
      .auth-submit,
      #searchSubmit,
      .newsletter-section button,
      .reset-colors {
        background: var(--accent-color);
        color: var(--accent-contrast);
      }

      .account-btn,
      .color-picker-btn,
      .search-btn,
      .dark-mode-btn {
        background: var(--card-background);
        color: var(--text-color);
        border: 1px solid var(--border-color);
      }

      .menu-toggle,
      #menuToggle {
        background: var(--card-background) !important;
        color: var(--text-color) !important;
        border: 1px solid var(--border-color);
      }

      .menu-toggle i,
      #menuToggle i {
        color: inherit !important;
      }

      input, select, textarea {
        background: var(--card-background);
        color: var(--text-color);
        border-color: var(--border-color);
      }

      input::placeholder,
      textarea::placeholder {
        color: var(--muted-color);
        opacity: 1;
      }

      .section-heading a {
        color: var(--accent-color);
      }

      .dashboard-tab.active {
        background: var(--primary-color);
        color: var(--primary-contrast);
      }

      .category-badge,
      .category-small {
        background: var(--accent-color);
        color: var(--accent-contrast);
      }

      a:focus-visible,
      button:focus-visible,
      input:focus-visible,
      select:focus-visible {
        outline: 3px solid var(--accent-color);
        outline-offset: 3px;
      }
    `;

    if (primaryColorInput) {
      primaryColorInput.value = primaryColor;
    }

    if (accentColorInput) {
      accentColorInput.value = accentColor;
    }

    if (darkModeBtn) {
      darkModeBtn.innerHTML = darkMode
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

      darkModeBtn.setAttribute(
        "aria-label",
        darkMode ? t("lightMode") : t("darkMode")
      );
    }

    saveItem("hnm_primary", primaryColor);
    saveItem("hnm_accent", accentColor);
    saveItem("hnm_dark", String(darkMode));
  }

  function changeColors(primary, accent) {
    primaryColor = normalizeHex(primary);
    accentColor = normalizeHex(accent);

    applyTheme();
  }

  primaryColorInput?.addEventListener("input", () => {
    changeColors(primaryColorInput.value, accentColor);
  });

  accentColorInput?.addEventListener("input", () => {
    changeColors(primaryColor, accentColorInput.value);
  });

  $$(".preset").forEach(button => {
    button.addEventListener("click", () => {
      const primary = button.dataset.primary;
      const accent = button.dataset.accent;

      if (primary && accent) {
        changeColors(primary, accent);
      }
    });
  });

  resetColorsBtn?.addEventListener("click", () => {
    changeColors(defaultPrimary, defaultAccent);
  });

  if (colorPickerBtn && colorPanel) {
    colorPickerBtn.addEventListener("click", event => {
      event.stopPropagation();

      const isOpen = colorPanel.classList.toggle("active");

      colorPickerBtn.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    colorPanel.addEventListener("click", event => {
      event.stopPropagation();
    });

    document.addEventListener("click", event => {
      if (
        !colorPanel.contains(event.target) &&
        !colorPickerBtn.contains(event.target)
      ) {
        colorPanel.classList.remove("active");

        colorPickerBtn.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    });
  }

  darkModeBtn?.addEventListener("click", () => {
    darkMode = !darkMode;
    applyTheme();
  });

  /* =========================================
     7. MOBILE NAVIGATION
  ========================================= */

  function closeMobileMenu() {
    if (!mainNav || !menuToggle) return;

    mainNav.classList.remove("active", "open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");

    menuToggle.innerHTML =
      '<i class="fa-solid fa-bars"></i>';
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        !mainNav.classList.contains("active");

      mainNav.classList.toggle("active", isOpen);
      mainNav.classList.toggle("open", isOpen);

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );

      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    $$("#mainNav a").forEach(link => {
      link.addEventListener("click", () => {
        $$("#mainNav a").forEach(item => {
          item.classList.remove("active");
        });

        link.classList.add("active");
        closeMobileMenu();
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
  }

  /* =========================================
     8. SEARCH SYSTEM
  ========================================= */

  function openSearch() {
    if (!searchBox) return;

    searchBox.classList.add("active", "open");

    setTimeout(() => {
      searchInput?.focus();
    }, 100);
  }

  function closeSearch() {
    searchBox?.classList.remove("active", "open");
  }

  searchBtn?.addEventListener("click", () => {
    const isOpen = searchBox?.classList.contains("active");

    if (isOpen) {
      closeSearch();
    } else {
      openSearch();
    }
  });

  function performSearch() {
    if (!searchInput) return;

    const query = searchInput.value
      .trim()
      .toLocaleLowerCase();

    if (!query) {
      alert(t("searchEmpty"));
      searchInput.focus();
      return;
    }

    const searchableItems = $$(".news-card, .category-item, .video-card");

    let found = 0;

    searchableItems.forEach(item => {
      const matches = item.textContent
        .toLocaleLowerCase()
        .includes(query);

      item.hidden = !matches;

      if (matches) found++;
    });

    const latestSection = $("#latest");

    if (latestSection) {
      latestSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    if (found === 0) {
      alert(t("noSearchResults"));
    }

    closeSearch();
  }

  searchSubmit?.addEventListener("click", performSearch);

  searchInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  });

  searchInput?.addEventListener("input", () => {
    if (!searchInput.value.trim()) {
      $$(".news-card, .category-item, .video-card")
        .forEach(item => {
          item.hidden = false;
        });
    }
  });

  /* =========================================
     9. AUTH MODAL
  ========================================= */

  function openAuthModal() {
    if (!authModal) return;

    authModal.classList.add("active", "show");

    authModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    showLoginForm();
  }

  function closeAuth() {
    if (!authModal) return;

    authModal.classList.remove("active", "show");

    authModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
  }

  function showLoginForm() {
    if (loginForm) loginForm.hidden = false;
    if (registerForm) registerForm.hidden = true;

    clearMessages();
  }

  function showRegisterForm() {
    if (loginForm) loginForm.hidden = true;
    if (registerForm) registerForm.hidden = false;

    clearMessages();
  }

  function clearMessages() {
    if (loginMessage) loginMessage.textContent = "";
    if (registerMessage) registerMessage.textContent = "";
  }

  function showMessage(element, message, type = "info") {
    if (!element) return;

    element.textContent = message;
    element.className = "form-message " + type;
  }

  accountBtn?.addEventListener("click", async () => {
    if (!db) {
      openAuthModal();
      return;
    }

    try {
      const { data, error } = await db.auth.getSession();

      if (error) throw error;

      if (data.session?.user) {
        await showDashboard(data.session.user);
      } else {
        openAuthModal();
      }
    } catch (error) {
      console.error("Account error:", error);
      openAuthModal();
    }
  });

  closeAuthModal?.addEventListener("click", closeAuth);

  authModal?.addEventListener("click", event => {
    if (event.target === authModal) {
      closeAuth();
    }
  });

  showRegisterBtn?.addEventListener(
    "click",
    showRegisterForm
  );

  showLoginBtn?.addEventListener(
    "click",
    showLoginForm
  );

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeAuth();
      closeMobileMenu();
      closeSearch();

      colorPanel?.classList.remove("active");

      colorPickerBtn?.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  });

  /* =========================================
     10. USER PROFILE AND ROLES
  ========================================= */

  let currentUser = null;
  let currentProfile = null;

  function normalizeRole(role) {
    const value = String(role || "")
      .toLowerCase()
      .trim();

    return value === "owner" ? "owner" : "reader";
  }

  async function getUserProfile(user) {
    if (!db || !user) return null;

    let profile = null;

    const firstResult = await db
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!firstResult.error && firstResult.data) {
      profile = firstResult.data;
    }

    if (!profile) {
      const secondResult = await db
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!secondResult.error && secondResult.data) {
        profile = secondResult.data;
      }
    }

    const metadata = user.user_metadata || {};

    // Role-ka waxaa laga akhrinayaa profiles table oo keliya.
    // user_metadata lama aaminayo.
    const role = normalizeRole(profile?.role);

    return {
      ...profile,
      id: user.id,
      email: user.email || "",
      full_name:
        profile?.full_name ||
        profile?.name ||
        metadata.full_name ||
        metadata.name ||
        user.email?.split("@")[0] ||
        "Member",
      role,
      created_at: profile?.created_at || user.created_at
    };
  }

  function updateAccountButton() {
    if (!accountBtn || !accountBtnText) return;

    if (currentUser) {
      accountBtnText.textContent =
        currentProfile?.full_name ||
        currentUser.email ||
        t("account");
    } else {
      accountBtnText.textContent = t("account");
    }
  }

  function updateDashboardRole() {
    const roleElement = $("#memberRole");
    const profileType = $("#profileType");

    const role = currentProfile?.role || "reader";

    const roleText = role === "owner"
      ? t("owner")
      : t("reader");

    if (roleElement) {
      roleElement.textContent = roleText;
    }

    if (profileType) {
      profileType.textContent = roleText;
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) return "-";

    const locale = {
      so: "so-SO",
      en: "en-US",
      ar: "ar"
    }[currentLanguage];

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  }

  function fillProfile(profile) {
    if (!profile) return;

    const name = profile.full_name || "Member";
    const email = profile.email || "-";

    const displayName = $("#memberDisplayName");
    const displayEmail = $("#memberDisplayEmail");

    const profileName = $("#profileName");
    const profileEmail = $("#profileEmail");
    const profileDate = $("#profileDate");

    if (displayName) {
      displayName.textContent = name;
    }

    if (displayEmail) {
      displayEmail.textContent = email;
    }

    if (profileName) {
      profileName.textContent = name;
    }

    if (profileEmail) {
      profileEmail.textContent = email;
    }

    if (profileDate) {
      profileDate.textContent =
        formatDate(profile.created_at);
    }

    updateDashboardRole();
  }

  /* =========================================
     11. REGISTER
  ========================================= */

  registerForm?.addEventListener("submit", async event => {
    event.preventDefault();

    if (!db) {
      showMessage(
        registerMessage,
        t("registerError"),
        "error"
      );
      return;
    }

    const fullName = $("#registerName")?.value.trim();
    const email = $("#registerEmail")?.value.trim();
    const password = $("#registerPassword")?.value;
    const confirmPassword =
      $("#registerConfirmPassword")?.value;

    if (!fullName || !email || !password || !confirmPassword) {
      return;
    }

    if (password.length < 8) {
      showMessage(
        registerMessage,
        t("passwordShort"),
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      showMessage(
        registerMessage,
        t("passwordMismatch"),
        "error"
      );
      return;
    }

    const submitButton =
      $('button[type="submit"]', registerForm);

    const originalText = submitButton?.innerHTML;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "...";
    }

    try {
      const { data, error } = await db.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      registerForm.reset();

      showMessage(
        registerMessage,
        t("registerSuccess"),
        "success"
      );

      if (data.session && data.user) {
        currentUser = data.user;
        currentProfile = await getUserProfile(data.user);

        closeAuth();

        await showDashboard(data.user);
      }

    } catch (error) {
      console.error("Registration error:", error);

      showMessage(
        registerMessage,
        error.message || t("registerError"),
        "error"
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText || t("registerButton");
      }
    }
  });

  /* =========================================
     12. LOGIN
  ========================================= */

  loginForm?.addEventListener("submit", async event => {
    event.preventDefault();

    if (!db) {
      showMessage(
        loginMessage,
        t("loginError"),
        "error"
      );
      return;
    }

    const email = $("#loginEmail")?.value.trim();
    const password = $("#loginPassword")?.value;

    if (!email || !password) return;

    const submitButton =
      $('button[type="submit"]', loginForm);

    const originalText = submitButton?.innerHTML;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "...";
    }

    try {
      const { data, error } =
        await db.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      currentUser = data.user;

      currentProfile = await getUserProfile(data.user);

      showMessage(
        loginMessage,
        t("loginSuccess"),
        "success"
      );

      closeAuth();

      await showDashboard(data.user);

      loginForm.reset();

    } catch (error) {
      console.error("Login error:", error);

      showMessage(
        loginMessage,
        error.message || t("loginError"),
        "error"
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText || t("loginButton");
      }
    }
  });

  /* =========================================
     13. FORGOT PASSWORD
  ========================================= */

  forgotPasswordBtn?.addEventListener("click", async () => {
    if (!db) return;

    const email = $("#loginEmail")?.value.trim();

    if (!email) {
      showMessage(
        loginMessage,
        t("enterEmail"),
        "error"
      );

      $("#loginEmail")?.focus();
      return;
    }

    try {
      const { error } =
        await db.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin
        });

      if (error) throw error;

      showMessage(
        loginMessage,
        t("resetSent"),
        "success"
      );

    } catch (error) {
      console.error("Password reset error:", error);

      showMessage(
        loginMessage,
        error.message || t("registerError"),
        "error"
      );
    }
  });

  /* =========================================
     14. LOAD PUBLISHED NEWS
  ========================================= */

  function createNewsCard(news) {
    const article = document.createElement("article");

    article.className = "member-news-card news-card";

    if (news.image_url) {
      const image = document.createElement("img");

      image.src = news.image_url;
      image.alt = news.title || "News";
      image.loading = "lazy";

      article.appendChild(image);
    }

    const content = document.createElement("div");
    content.className = "news-info";

    if (news.category) {
      const category = document.createElement("span");

      category.className = "category-small";
      category.textContent = news.category;

      content.appendChild(category);
    }

    const heading = document.createElement("h3");

    heading.textContent = news.title || "News";

    content.appendChild(heading);

    const summary = document.createElement("p");

    summary.textContent =
      news.summary ||
      news.content?.slice(0, 220) ||
      "";

    content.appendChild(summary);

    if (news.created_at) {
      const date = document.createElement("small");

      date.className = "news-date";
      date.textContent = formatDate(news.created_at);

      content.appendChild(date);
    }

    if (news.source_url) {
      const link = document.createElement("a");

      link.className = "read-more";
      link.href = news.source_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = t("readMore");

      content.appendChild(link);
    }

    article.appendChild(content);

    return article;
  }

  async function loadPublishedNews() {
    if (!publishedNewsList || !db) return;

    publishedNewsList.replaceChildren();

    const loading = document.createElement("p");

    loading.className = "empty-news-message";
    loading.textContent = t("loadingNews");

    publishedNewsList.appendChild(loading);

    try {
      let result = await db
        .from("news")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (result.error) {
        result = await db
          .from("news_submissions")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false });
      }

      if (result.error) {
        throw result.error;
      }

      publishedNewsList.replaceChildren();

      if (!result.data || result.data.length === 0) {
        const empty = document.createElement("p");

        empty.className = "empty-news-message";
        empty.textContent = t("noNews");

        publishedNewsList.appendChild(empty);
        return;
      }

      const grid = document.createElement("div");

      grid.className = "news-grid member-news-grid";

      result.data.forEach(news => {
        grid.appendChild(createNewsCard(news));
      });

      publishedNewsList.appendChild(grid);

    } catch (error) {
      console.error("Published news error:", error);

      publishedNewsList.replaceChildren();

      const message = document.createElement("p");

      message.className = "empty-news-message";
      message.textContent = t("newsError");

      publishedNewsList.appendChild(message);
    }
  }

  /* =========================================
     15. SHOW MEMBER DASHBOARD
  ========================================= */

  async function showDashboard(user) {
    if (!user || !memberDashboard) return;

    currentUser = user;

    currentProfile = await getUserProfile(user);

    fillProfile(currentProfile);

    memberDashboard.hidden = false;
    memberDashboard.style.display = "";

    closeAuth();

    memberDashboard.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    await loadPublishedNews();

    updateAccountButton();
  }

  /* =========================================
     16. DASHBOARD TABS
  ========================================= */

  $$("[data-dashboard-tab]").forEach(button => {
    button.addEventListener("click", () => {
      const tab = button.dataset.dashboardTab;

      $$(".dashboard-tab").forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      if (publishedNewsPanel) {
        publishedNewsPanel.hidden =
          tab !== "publishedNews";
      }

      if (memberProfilePanel) {
        memberProfilePanel.hidden =
          tab !== "profile";
      }
    });
  });

  /* =========================================
     17. LOGOUT
  ========================================= */

  logoutBtn?.addEventListener("click", async () => {
    if (!db) return;

    try {
      const { error } = await db.auth.signOut();

      if (error) throw error;

      currentUser = null;
      currentProfile = null;

      if (memberDashboard) {
        memberDashboard.hidden = true;
        memberDashboard.style.display = "none";
      }

      updateAccountButton();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      alert(t("loggedOut"));

    } catch (error) {
      console.error("Logout error:", error);
      alert(error.message || t("loginError"));
    }
  });

  /* =========================================
     18. SESSION CHECK
  ========================================= */

  async function checkExistingSession() {
    if (!db) return;

    try {
      const { data, error } = await db.auth.getSession();

      if (error) throw error;

      if (data.session?.user) {
        currentUser = data.session.user;

        currentProfile = await getUserProfile(currentUser);

        if (memberDashboard) {
          memberDashboard.hidden = false;
          memberDashboard.style.display = "";
        }

        fillProfile(currentProfile);

        updateAccountButton();

        await loadPublishedNews();

      } else {
        currentUser = null;
        currentProfile = null;

        updateAccountButton();
      }

    } catch (error) {
      console.error("Session check error:", error);
    }
  }

  if (db) {
    db.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        currentUser = null;
        currentProfile = null;

        if (memberDashboard) {
          memberDashboard.hidden = true;
          memberDashboard.style.display = "none";
        }

        updateAccountButton();
      }

      if (event === "SIGNED_IN" && session?.user) {
        currentUser = session.user;
        updateAccountButton();
      }
    });
  }

  /* =========================================
     19. NEWSLETTER
  ========================================= */
newsletterForm?.addEventListener("submit", async event => {
  event.preventDefault();

  const email = $("#newsletterEmail")?.value.trim().toLowerCase();

  if (!email) {
    alert("Fadlan geli email-kaaga.");
    return;
  }

  try {
    const { error } = await db
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (error) {
      if (error.code === "23505") {
        alert("Email-kan hore ayaa loo diiwaangeliyey.");
      } else {
        console.error(error);
        alert("Diiwaangelintu way fashilantay.");
      }
      return;
    }

    alert(t("newsletterNotice"));
    newsletterForm.reset();

  } catch (error) {
    console.error(error);
    alert("Cilad ayaa dhacday. Mar kale isku day.");
  }
});

  /* =========================================
     20. BACK TO TOP
  ========================================= */

  function updateBackToTop() {
    if (!backToTop) return;

    backToTop.classList.toggle(
      "show",
      window.scrollY > 400
    );
  }

  window.addEventListener("scroll", updateBackToTop);

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  /* =========================================
     21. CURRENT YEAR
  ========================================= */

  const currentYear = $("#currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* =========================================
     22. LOAD SAVED SETTINGS
  ========================================= */

  function loadSavedSettings() {
    const savedLanguage =
      getSavedItem("hnm_language", "so");

    primaryColor = normalizeHex(
      getSavedItem("hnm_primary", defaultPrimary)
    );

    accentColor = normalizeHex(
      getSavedItem("hnm_accent", defaultAccent)
    );

    darkMode =
      getSavedItem("hnm_dark", "false") === "true";

    applyLanguage(savedLanguage);
    applyTheme();
  }

  /* =========================================
     23. INITIALIZE WEBSITE
  ========================================= */

  loadSavedSettings();

  if (authModal) {
    authModal.setAttribute("aria-hidden", "true");
  }

  if (memberDashboard) {
    memberDashboard.hidden = true;
    memberDashboard.style.display = "none";
  }

  closeMobileMenu();
  updateBackToTop();

  checkExistingSession();

  console.log("HAFID NOR MEDIA website is ready.");
});
