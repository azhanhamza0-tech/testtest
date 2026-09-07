// ==========================================================================
// MERZE MOVIES (مەرزە موڤیز) - SEED DATASET
// Comprehensive Kurdish Sorani catalog with movies, series, episodes, and settings
// ==========================================================================

const SEED_GENRES = [
  { id: "action", name: "ئەکشن", slug: "action" },
  { id: "comedy", name: "کۆمیدی", slug: "comedy" },
  { id: "drama", name: "دراما", slug: "drama" },
  { id: "horror", name: "ترسناک", slug: "horror" },
  { id: "romance", name: "ڕۆمانسی", slug: "romance" },
  { id: "scifi", name: "زانستی خەیاڵی", slug: "scifi" },
  { id: "animation", name: "ئەنیمەیشن", slug: "animation" },
  { id: "kurdish", name: "سینەمای کوردی", slug: "kurdish" },
  { id: "crime", name: "تاوانکاری", slug: "crime" }
];

const SEED_PAYMENT_SETTINGS = {
  id: "default_qi_settings",
  payment_method: "QI Card",
  amount: 5000,
  currency: "IQD",
  qr_code_url: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=QICARD_MERZE_MOVIES_5000IQD_ACCOUNT_9948271049",
  instructions: "تکایە بڕی ٥,٠٠٠ دیناری عێراقی لە ڕێگەی ئەپڵیکەیشنی کی کارت (QI Card) یان فاستپەی بە سکانکردنی ئەم QR کۆدە بنێرە. دوای ناردن، ژمارەی پسوولە (Transaction ID) و وێنەی سکرینشۆتەکە لە فۆڕمەکە باربکە تا هەژمارەکەت دەستبەجێ بەرزبکرێتەوە بۆ VIP.",
  account_number: "9948-2710-4920-1188",
  account_name: "مەرزە موڤیز بۆ خزمەتگوزاری ستریمینگ",
  is_active: true
};

const SEED_MOVIES = [
  {
    id: "bekas-2012",
    title: "بێکەس (Bekas)",
    slug: "bekas",
    description: "چیرۆکی دوو برای هەتیوی بێ ماڵی کوردی (دانا و زانا) لە باشووری کوردستان لە ساڵی ١٩٩٠کان، کاتێک لە سینەمای گەڕەکەکەیان بینەری فیلمی سوپەرمان دەبن، بڕیار دەدەن بە کەرێک بە ناوی مایکڵ جاکسۆن بچن بەرەو ئەمریکا تا سوپەرمان بدۆزنەوە و تۆڵەی دایک و باوکیان لە سەدام بکاتەوە.",
    poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    backdrop_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&auto=format&fit=crop&q=80",
    trailer_url: "https://www.youtube.com/embed/tgbNymZ7vqY",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    qualities: {
      "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "480p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "360p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    subtitle_url: "",
    year: 2012,
    duration: "1h 37m",
    country: "کوردستان - سوید",
    rating: 7.5,
    views: 48200,
    access_type: "FREE",
    genres: ["دراما", "سینەمای کوردی", "کۆمیدی"],
    director: "کارزان قادر",
    writer: "کارزان قادر",
    cast: [
      { name: "زەمەند تەها", actor_name: "زەمەند تەها", character_description: "زانا (برا بچووک)", image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
      { name: "سەروەر فازڵ", actor_name: "سەروەر فازڵ", character_description: "دانا (برا گەورە)", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }
    ],
    is_published: true,
    is_featured: true
  },
  {
    id: "turtles-can-fly",
    title: "کیسەڵەکانیش دەفڕن (Turtles Can Fly)",
    slug: "turtles-can-fly",
    description: "لە گوندێکی کوردی لەسەر سنووری عێراق و تورکیا کەمێک پێش هێرشی ئەمریکا بۆ سەر عێراق لە ساڵی ٢٠٠٣، کۆمەڵێک منداڵی کەمئەندام و ئاوارە بە سەرپەرشتی کوڕێک بە ناوی 'سەتەلایت' بەدوای پەڕەشووت و مینە چێندراوەکاندا دەگەڕێن و دەستکەوتی خۆیان دەفرۆشنەوە.",
    poster_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80",
    backdrop_url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1400&auto=format&fit=crop&q=80",
    trailer_url: "https://www.youtube.com/embed/tgbNymZ7vqY",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    qualities: {
      "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "480p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "360p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    subtitle_url: "",
    year: 2004,
    duration: "1h 38m",
    country: "کوردستان - ئێران - فەڕەنسا",
    rating: 8.1,
    views: 65100,
    access_type: "VIP",
    genres: ["دراما", "سینەمای کوردی"],
    director: "بەهمەن قوبادی",
    writer: "بەهمەن قوبادی",
    cast: [
      { name: "سۆران ئیبراهیم", actor_name: "سۆران ئیبراهیم", character_description: "سەتەلایت", image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
      { name: "ئاواز لەتیف", actor_name: "ئاواز لەتیف", character_description: "ئاگرین", image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" }
    ],
    is_published: true,
    is_featured: true
  },
  {
    id: "oppenheimer-kurdish",
    title: "ئۆپنهایمەر (Oppenheimer)",
    slug: "oppenheimer",
    description: "چیرۆکی سەرنجڕاکێشی زانای فیزیایی ئەمریکی جەی ڕۆبێرت ئۆپنهایمەر و ڕۆڵی سەرەکیی لە پرۆژەی مانهاتن کە بووە هۆی دروستکردنی یەکەمین چەکی ئەتۆمی لە مێژوودا بە ژێرنووس و دوبلاژی کوردی.",
    poster_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80",
    backdrop_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1400&auto=format&fit=crop&q=80",
    trailer_url: "https://www.youtube.com/embed/uYPbbksJxIg",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    qualities: {
      "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "480p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "360p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    subtitle_url: "",
    year: 2023,
    duration: "3h 00m",
    country: "ئەمریکا",
    rating: 8.9,
    views: 124000,
    access_type: "VIP",
    genres: ["دراما", "مێژوویی"],
    director: "کریستۆفەر نۆلان",
    writer: "کریستۆفەر نۆلان",
    cast: [
      { name: "کیلیان مۆرفی", actor_name: "Cillian Murphy", character_description: "ڕۆبێرت ئۆپنهایمەر", image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" },
      { name: "ئیمیلی بلانت", actor_name: "Emily Blunt", character_description: "کیتی ئۆپنهایمەر", image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" },
      { name: "ڕۆبێرت داونی جونیۆر", actor_name: "Robert Downey Jr.", character_description: "لویس ستراوس", image_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" }
    ],
    is_published: true,
    is_featured: true
  },
  {
    id: "dune-part-two",
    title: "دیوون: بەشی دووەم (Dune: Part Two)",
    slug: "dune-part-two",
    description: "پۆڵ ئاتریدس یەکدەگرێت لەگەڵ چانی و فرێمەنەکان لە کاتێکدا بەدوای تۆڵەسەندنەوەدایە لەو پیلانگێڕانەی کە خێزانەکەیان لەناوبرد، و هەوڵدەدات پێشبینی ئایندەیەکی تۆقێنەر بگۆڕێت کە تەنها خۆی دەتوانێت بیبینێت.",
    poster_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    backdrop_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=80",
    trailer_url: "https://www.youtube.com/embed/Way9Dexny3w",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    qualities: {
      "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "480p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "360p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    subtitle_url: "",
    year: 2024,
    duration: "2h 46m",
    country: "ئەمریکا",
    rating: 8.6,
    views: 98000,
    access_type: "FREE",
    genres: ["ئەکشن", "زانستی خەیاڵی", "سەرکێشی"],
    director: "دێنیس ڤیلنۆڤ",
    writer: "فرانک هێربەرت",
    cast: [
      { name: "تیمۆسی شالامێ", actor_name: "Timothée Chalamet", character_description: "پۆڵ ئاتریدس", image_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" },
      { name: "زێندایا", actor_name: "Zendaya", character_description: "چانی", image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" }
    ],
    is_published: true,
    is_featured: false
  },
  {
    id: "dark-knight-kurdish",
    title: "شاسواری تاریکی (The Dark Knight)",
    slug: "the-dark-knight",
    description: "باتمان بە یارمەتی جیم گۆردۆن و هارڤی دێنت دەست دەکات بە کۆنتڕۆڵکردنی تاوان لە شاری گۆسام، بەڵام سەرکەوتنەکەیان تووشی ئاژاوەیەکی ترسناک دەبێت کاتێک جۆکەر دەردەکەوێت و شارەکە دەخاتە بەر مەترسییەکی وێرانکەر.",
    poster_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    backdrop_url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1400&auto=format&fit=crop&q=80",
    trailer_url: "https://www.youtube.com/embed/EXeTwQWrcwY",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    qualities: {
      "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "480p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "360p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    subtitle_url: "",
    year: 2008,
    duration: "2h 32m",
    country: "ئەمریکا",
    rating: 9.0,
    views: 185000,
    access_type: "FREE",
    genres: ["ئەکشن", "تاوانکاری", "دراما"],
    director: "کریستۆفەر نۆلان",
    writer: "جۆناسان نۆلان",
    cast: [
      { name: "کریستیان بەیل", actor_name: "Christian Bale", character_description: "بروس وەین / باتمان", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
      { name: "هیس لێدجەر", actor_name: "Heath Ledger", character_description: "جۆکەر", image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" }
    ],
    is_published: true,
    is_featured: false
  },
  {
    id: "interstellar-kurdish",
    title: "نێوان ئەستێرەکان (Interstellar)",
    slug: "interstellar",
    description: "لە داهاتوودا کاتێک زەوی بەرەو لەناوچوون دەچێت و خۆراک کەم دەبێتەوە، دەستەیەک لە گەڕیدەی ئاسمانی بەناو کرمەڕێگایەکی نزیک زوحەلدا تێدەپەڕن بە مەبەستی دۆزینەوەی هەسارەیەکی نوێ بۆ مانەوەی مرۆڤایەتی.",
    poster_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    backdrop_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1400&auto=format&fit=crop&q=80",
    trailer_url: "https://www.youtube.com/embed/zSWdZVtXT7E",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    qualities: {
      "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "480p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "360p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    subtitle_url: "",
    year: 2014,
    duration: "2h 49m",
    country: "ئەمریکا",
    rating: 8.7,
    views: 142000,
    access_type: "VIP",
    genres: ["زانستی خەیاڵی", "دراما", "سەرکێشی"],
    director: "کریستۆفەر نۆلان",
    writer: "جۆناسان نۆلان",
    cast: [
      { name: "ماتیۆ مەکانەهێی", actor_name: "Matthew McConaughey", character_description: "کووپەر", image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
      { name: "ئان هاساوەی", actor_name: "Anne Hathaway", character_description: "د. براند", image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" }
    ],
    is_published: true,
    is_featured: false
  },
  {
    id: "spider-man-spiderverse",
    title: "پیاوی جاڵجاڵۆکە: لە سەرووی جیهانەکان (Spider-Verse)",
    slug: "spider-verse",
    description: "مایڵز مۆرالێس دەگەڕێتەوە بۆ بەشێکی تری گەشتە سەرسوڕهێنەرەکەی لە فرەجیهاندا، لەگەڵ گوێن ستەیسی و دەستەیەکی نوێ لە کەسایەتییە جاڵجاڵۆکەییەکان ڕووبەڕووی هەڕەشەیەکی زۆر مەزنتر لە جاران دەبنەوە.",
    poster_url: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80",
    backdrop_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1400&auto=format&fit=crop&q=80",
    trailer_url: "https://www.youtube.com/embed/cqGjhVJWtEg",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    qualities: {
      "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "480p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "360p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    subtitle_url: "",
    year: 2023,
    duration: "2h 20m",
    country: "ئەمریکا",
    rating: 8.7,
    views: 79000,
    access_type: "FREE",
    genres: ["ئەنیمەیشن", "ئەکشن", "سەرکێشی"],
    director: "خواکین دۆس سانتۆس",
    writer: "فیل لۆرد",
    cast: [
      { name: "شامێک مور", actor_name: "Shameik Moore", character_description: "مایڵز مۆرالێس", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
      { name: "هایلی ستینفێڵد", actor_name: "Hailee Steinfeld", character_description: "گوێن ستەیسی", image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" }
    ],
    is_published: true,
    is_featured: false
  },
  {
    id: "the-swallow-kurdish",
    title: "پەڕەسێلکە (The Swallow)",
    slug: "the-swallow",
    description: "کچێکی گەنجی سویسری بە ناوی میرا دەچێتە باشووری کوردستان بەدوای شوێنپێی باوکە نەناسراوەکەیدا، و لەوێ ڕووبەڕووی ڕاستییە ئاڵۆزەکان و جوانی و کێشەکانی ناوچەکە دەبێتەوە.",
    poster_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    backdrop_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&auto=format&fit=crop&q=80",
    trailer_url: "https://www.youtube.com/embed/tgbNymZ7vqY",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    qualities: {
      "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "480p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "360p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    subtitle_url: "",
    year: 2016,
    duration: "1h 42m",
    country: "کوردستان - سویسرا",
    rating: 7.2,
    views: 31000,
    access_type: "FREE",
    genres: ["دراما", "سینەمای کوردی", "ڕۆمانسی"],
    director: "مانۆ خەلیل",
    writer: "مانۆ خەلیل",
    cast: [
      { name: "مانۆن پفرووندەر", actor_name: "Manon Pfrunder", character_description: "میرا", image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" },
      { name: "ئیسماعیل زاگرۆس", actor_name: "Ismail Zagros", character_description: "ڕامۆ", image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" }
    ],
    is_published: true,
    is_featured: false
  }
];

const SEED_SERIES = [
  {
    id: "game-of-thrones-kurdish",
    title: "یاریی تەختە پاشایەتییەکان (Game of Thrones)",
    slug: "game-of-thrones",
    description: "نۆ بنەماڵەی ناودار و دەسەڵاتدار لە کیشوەری وێستێرۆسدا شەڕی خوێناوی دەکەن لە پێناو بەدەستهێنانی کۆنتڕۆڵی تەختی ئاسنین، لە کاتێکدا دوژمنێکی کۆن و نەبینراو دوای هەزاران ساڵ لە باکوورەوە بەخەبەر دێتەوە.",
    poster_url: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=600&auto=format&fit=crop&q=80",
    backdrop_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=80",
    trailer_url: "https://www.youtube.com/embed/KPLWWIOCOOQ",
    year: 2011,
    rating: 9.2,
    access_type: "VIP",
    genres: ["ئەکشن", "سەرکێشی", "دراما"],
    seasons: [
      {
        season_number: 1,
        title: "وەرزی یەکەم",
        episodes: [
          {
            episode_number: 1,
            title: "زستان نزیک دەبێتەوە",
            description: "لۆرد نێد ستارک لەلایەن پاشا ڕۆبێرت باراسیۆنەوە بانگهێشت دەکرێت بۆ ئەوەی ببێتە دەستی ڕاستی پاشا لە کاتێکدا ڕووداوە نادیارەکان لە دیواری باکوور دەست پێدەکەن.",
            thumbnail_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format&fit=crop&q=80",
            video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            duration: "61m",
            release_date: "2011-04-17"
          },
          {
            episode_number: 2,
            title: "ڕێگای پاشا",
            description: "بران لە کەوتنەکەی چاک دەبێتەوە، نەد ستارک دەچێت بەرەو پایتەخت لەگەڵ کچەکانی، و جۆن سنۆ ڕوو لە دیواری باکوور دەکات.",
            thumbnail_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80",
            video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            duration: "55m",
            release_date: "2011-04-24"
          },
          {
            episode_number: 3,
            title: "لۆرد سنۆ",
            description: "جۆن سنۆ دەست دەکات بە مەشقەکانی لە قەڵای ڕەش، لە کاتێکدا نێد ستارک دەگاتە کینگز لاندینگ و تێدەگات لە گەندەڵی دەربار.",
            thumbnail_url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&auto=format&fit=crop&q=80",
            video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            duration: "57m",
            release_date: "2011-05-01"
          }
        ]
      }
    ]
  },
  {
    id: "the-last-of-us-kurdish",
    title: "دواکەوتوو لە ئێمە (The Last of Us)",
    slug: "the-last-of-us",
    description: "بیست ساڵ دوای ئەوەی کەڕوویەکی کوشندە مرۆڤایەتی بەرەو لەناوچوون برد، ڕزگاربوویەکی سەرسەخت بە ناوی جۆیل ڕاسپێردراوە بۆ بەقاچاخ بردنی کچێکی ١٤ ساڵان بە ناوی ئێلی لە ناوچەی کەرەنتینەکان کە ڕەنگە کلیلی ڕزگارکردنی مرۆڤایەتی بێت.",
    poster_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    backdrop_url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1400&auto=format&fit=crop&q=80",
    trailer_url: "https://www.youtube.com/embed/uLtkt8BonwM",
    year: 2023,
    rating: 8.8,
    access_type: "FREE",
    genres: ["ئەکشن", "سەرکێشی", "دراما", "ترسناک"],
    seasons: [
      {
        season_number: 1,
        title: "وەرزی یەکەم",
        episodes: [
          {
            episode_number: 1,
            title: "کاتێک لە تاریکیدایت ون دەبیت",
            description: "بیست ساڵ دوای دەستپێکردنی پەتایەکی کوشندە، جۆیل و تێس ئەرکێکی گرنگ وەردەگرن کە ڕەنگە جیهان بگۆڕێت.",
            thumbnail_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80",
            video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            duration: "81m",
            release_date: "2023-01-15"
          },
          {
            episode_number: 2,
            title: "تووشبووەکان",
            description: "جۆیل، تێس و ئێلی بەناو شەقامە چۆڵ و وێرانەکانی بۆستندا تێدەپەڕن بۆ گەیشتن بە ئەنجومەنی پایتەخت.",
            thumbnail_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&auto=format&fit=crop&q=80",
            video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            duration: "53m",
            release_date: "2023-01-22"
          }
        ]
      }
    ]
  }
];

const SEED_REVIEWS = [
  {
    id: "rev-1",
    movie_id: "bekas-2012",
    user_name: "ئاراس سلێمانی",
    rating: 5,
    review: "یەکێک لە جوانترین و پڕ لە هەستترین فیلمەکانی مێژووی سینەمای کوردییە! دەستتان خۆش بۆ ئەم ماڵپەڕە شازە.",
    created_at: "2024-03-01",
    likes: 18
  },
  {
    id: "rev-2",
    movie_id: "oppenheimer-kurdish",
    user_name: "شوان قادر",
    rating: 5,
    review: "دوبلاژ و کوالیتی ڤیدیۆکە لەسەر 1080p بێ وێنەیە، زۆر سوپاس بۆ مەرزە موڤیز.",
    created_at: "2024-03-02",
    likes: 14
  }
];

window.MerzeSeedData = {
  genres: SEED_GENRES,
  movies: SEED_MOVIES,
  series: SEED_SERIES,
  paymentSettings: SEED_PAYMENT_SETTINGS,
  reviews: SEED_REVIEWS
};
