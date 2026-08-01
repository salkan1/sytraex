// Sytraex TR / EN Dil Sözlüğü
const translations = {
  tr: {
    // Header & Nav
    "nav_home": "Ana Sayfa",
    "nav_profile": "Profilim",
    "nav_whitepaper": "White Paper (Stake SYTX)",
    "nav_login": "Giriş Yap",
    "nav_register": "Kayıt Ol",
    
    // Hero / Karşılama
    "hero_title": "Dünyayı Keşfet.<br>Anılarını Paylaş.",
    "hero_subtitle": "Sytraex, seyahat deneyimlerini paylaşabileceğin ve ilham alabileceğin sosyal topluluk.",
    "hero_btn_profile": "Profilime Git",
    "hero_btn_share": "➕ Deneyimi Paylaş",

    // Arama Paneli
    "search_label_loc": "Nereye Gitmek İstiyorsun?",
    "search_ph_loc": "İlçe, il veya ülke yazın (Örn: Bodrum, Roma)...",
    "search_label_duration": "Süre / Zaman:",
    "search_opt_dur_all": "Tüm Süreler",
    "search_opt_dur_3h": "3 Saatlik Hızlı Tur",
    "search_opt_dur_day": "Günübirlik (6-12 Saat)",
    "search_opt_dur_1d": "Tam 1 Gün",
    "search_opt_dur_weekend": "Hafta Sonu (2-3 Gün)",
    "search_opt_dur_1w": "1 Hafta veya Daha Uzun",
    
    "search_label_mode": "Seyahat Modu:",
    "search_opt_mode_all": "Tüm Konseptler",
    "search_opt_mode_night": "🌙 Gece Hayatı & Eğlence",
    "search_opt_mode_day": "☀️ Gündüz Gezi & Şehir",
    "search_opt_mode_history": "🏛️ Tarihsel & Kültür",
    "search_opt_mode_nature": "🌿 Doğa & Sakinlik",
    "search_opt_mode_food": "🍕 Yemek & Gastronomi",
    "search_opt_mode_adventure": "🏄 Macera & Spor",
    "search_opt_mode_budget": "💰 Bütçe Dostu",
    "search_btn_submit": "🔍 Deneyimleri Ara",

    // Ana Sayfa Rotalar
    "top_rated_title": "⭐ Topluluğun En Çok Oy Alan Seyahat Rotaları",
    "no_top_posts": "Henüz öne çıkan bir seyahat rotası yok.",

    // Giriş Yap Sayfası
    "login_title": "Giriş Yap",
    "login_ph_identifier": "E-posta veya Kullanıcı Adı",
    "login_ph_password": "Şifre",
    "login_btn_submit": "Giriş Yap",
    "login_forgot_pass": "Şifremi Unuttum?",
    "login_no_account": "Hesabınız yok mu?",

    // Şifre Kurtarma Modalı
    "forgot_modal_title": "Şifre Kurtarma",
    "forgot_step1_text": "Sistemdeki E-posta adresinizi veya Kullanıcı Adınızı giriniz:",
    "forgot_btn_find": "Hesabı Bul",
    "forgot_ph_answer": "Gizli Soru Cevabınız",
    "forgot_btn_show_pass": "Şifreyi Göster",
    "forgot_success_text": "Hesap Doğrulandı!",

    // Kayıt Ol Sayfası (register.html)
    "reg_title": "📝 Sytraex'e Kayıt Ol",
    "reg_label_username": "Kullanıcı Adı:",
    "reg_ph_username": "Örn: selcukalkan",
    "reg_label_fullname": "Ad Soyad:",
    "reg_ph_fullname": "Örn: Selçuk Alkan",
    "reg_label_email": "E-Posta Adresi:",
    "reg_ph_email": "ornek@gmail.com",
    "reg_label_password": "Şifre:",
    "reg_ph_password": "••••••••",
    "reg_label_location": "Yaşadığınız Şehir ve Ülke:",
    "reg_ph_location": "Şehir adı yazın (Örn: Tekirdağ, Türkiye)...",
    "reg_label_birth": "Doğum Tarihi:",
    "reg_label_secret_q": "Gizli Soru (Şifre Kurtarma İçin):",
    "reg_opt_pet": "İlk evcil hayvanınızın adı nedir?",
    "reg_opt_school": "İlkokul öğretmeninizin adı nedir?",
    "reg_opt_city": "Annenizin doğduğu şehir neresidir?",
    "reg_opt_car": "İlk sahip olduğunuz arabanın markası nedir?",
    "reg_label_secret_a": "Gizli Soru Cevabı:",
    "reg_ph_secret_a": "Cevabınız...",
    "reg_btn_submit": "Kayıt Ol ve Katıl",

    // Detay Sayfası (post-detail.html)
    "detail_sec_summary": "📌 Genel Özet & İzlenimler",
    "detail_sec_sightseeing": "🏛️ Gezilecek Yerler & Aktivite Rotaları",
    "detail_sec_stay": "🏨 Konaklama & Otel Tavsiyeleri",
    "detail_sec_food": "🍕 Yeme & İçme Önerileri",
    "detail_sec_tips": "🚌 Ulaşım, Bütçe & Önemli Tüyolar",
    "detail_rate_title": "⭐ Bu Deneyimi Puanlayın",
    "detail_avg_score": "Ortalama Puan",
    "detail_votes_suffix": "Oy Kullanıldı",
    "detail_comments_title": "💬 Kullanıcı Yorumları",
    "detail_comment_ph": "Bu rota hakkında bir şeyler yazın veya soru sorun...",
    "detail_comment_btn": "Yorum Yap",
    "detail_no_comments": "Henüz yorum yapılmamış. İlk yorumu sen yap!",

    // Genel Profil (public-profile.html)
    "public_btn_send_req": "💬 Mesaj İsteği Gönder",
    "public_btn_edit_own": "✏️ Kendi Profilini Düzenle",
    "public_btn_pending": "⏳ Mesaj İsteği Gönderildi (Beklemede)",
    "public_btn_open_chat": "💬 Sohbeti Aç",
    "public_routes_title": "🗺️ Paylaştığı Seyahat Rotaları & Deneyimleri",
    "public_no_posts": "Bu kullanıcının henüz paylaştığı bir seyahat rotası yok.",
    "public_modal_title": "📩 Mesaj İsteği Gönder",
    "public_modal_desc_prefix": "kullanıcısına ilk mesaj isteğinizi gönderin. İsteğinizi kabul ettiğinde mesajlaşmaya başlayabilirsiniz.",
    "public_modal_ph": "Merhaba! Seyahat rotanız hakkında bir şey sormak istiyordum...",
    "public_btn_cancel": "İptal",
    "public_btn_submit_req": "İsteği Gönder",

    // Profil Sayfası
    "profile_title": "Profil Bilgilerim",
    "profile_edit_btn": "✏️ Bilgileri Düzenle",
    "profile_menu_info": "👤 Profil Bilgileri",
    "profile_menu_wallet": "💰 Cüzdanım (SYTX)",
    "profile_menu_posts": "📝 Gönderilerim",
    "profile_menu_messages": "💬 Mesajlar / İstekler",
    "profile_menu_share": "➕ Yeni Deneyim Paylaş",
    "profile_btn_logout": "Çıkış Yap",
    "profile_change_photo": "📷 Fotoğraf Değiştir",

    // Cüzdan
    "wallet_title": "💰 Sytraex Cüzdanı & Ödüller",
    "wallet_sub_label": "Toplam Kazandığınız Sytraex Coin Bakiyesi",
    "wallet_stake_btn": "Stake Et (SYTX)",
    "wallet_history_title": "📊 Coin Kazanç Geçmişi",
    "wallet_th_type": "İşlem Türü",
    "wallet_th_desc": "Açıklama",
    "wallet_th_amount": "Miktar",

    // Footer
    "footer_text": "© 2026 Sytraex | Share Your Travel Experience"
  },
  en: {
    // Header & Nav
    "nav_home": "Home",
    "nav_profile": "My Profile",
    "nav_whitepaper": "White Paper (Stake SYTX)",
    "nav_login": "Login",
    "nav_register": "Register",
    
    // Hero
    "hero_title": "Explore The World.<br>Share Your Memories.",
    "hero_subtitle": "Sytraex is a social community where you can share travel experiences and get inspired.",
    "hero_btn_profile": "Go to My Profile",
    "hero_btn_share": "➕ Share Experience",

    // Search Panel
    "search_label_loc": "Where Do You Want To Go?",
    "search_ph_loc": "Type district, city or country (e.g. Bodrum, Rome)...",
    "search_label_duration": "Duration / Time:",
    "search_opt_dur_all": "All Durations",
    "search_opt_dur_3h": "3-Hour Quick Tour",
    "search_opt_dur_day": "Day Trip (6-12 Hours)",
    "search_opt_dur_1d": "Full 1 Day",
    "search_opt_dur_weekend": "Weekend (2-3 Days)",
    "search_opt_dur_1w": "1 Week or Longer",
    
    "search_label_mode": "Travel Concept:",
    "search_opt_mode_all": "All Concepts",
    "search_opt_mode_night": "🌙 Nightlife & Fun",
    "search_opt_mode_day": "☀️ Day Tour & City",
    "search_opt_mode_history": "🏛️ Historical & Culture",
    "search_opt_mode_nature": "🌿 Nature & Quiet",
    "search_opt_mode_food": "🍕 Food & Gastronomy",
    "search_opt_mode_adventure": "🏄 Adventure & Sports",
    "search_opt_mode_budget": "💰 Budget Friendly",
    "search_btn_submit": "🔍 Search Experiences",

    // Home Posts
    "top_rated_title": "⭐ Top Rated Travel Routes of the Community",
    "no_top_posts": "No featured travel routes yet.",

    // Login Page
    "login_title": "Login",
    "login_ph_identifier": "Email or Username",
    "login_ph_password": "Password",
    "login_btn_submit": "Login",
    "login_forgot_pass": "Forgot Password?",
    "login_no_account": "Don't have an account?",

    // Password Recovery Modal
    "forgot_modal_title": "Password Recovery",
    "forgot_step1_text": "Enter your Email address or Username registered in the system:",
    "forgot_btn_find": "Find Account",
    "forgot_ph_answer": "Answer to Secret Question",
    "forgot_btn_show_pass": "Show Password",
    "forgot_success_text": "Account Verified!",

    // Register Page (register.html)
    "reg_title": "📝 Register to Sytraex",
    "reg_label_username": "Username:",
    "reg_ph_username": "e.g. selcukalkan",
    "reg_label_fullname": "Full Name:",
    "reg_ph_fullname": "e.g. Selcuk Alkan",
    "reg_label_email": "Email Address:",
    "reg_ph_email": "example@gmail.com",
    "reg_label_password": "Password:",
    "reg_ph_password": "••••••••",
    "reg_label_location": "City and Country You Live In:",
    "reg_ph_location": "Type city name (e.g. Tekirdag, Turkey)...",
    "reg_label_birth": "Date of Birth:",
    "reg_label_secret_q": "Secret Question (For Password Recovery):",
    "reg_opt_pet": "What is the name of your first pet?",
    "reg_opt_school": "What is the name of your primary school teacher?",
    "reg_opt_city": "What is the city where your mother was born?",
    "reg_opt_car": "What is the brand of your first car?",
    "reg_label_secret_a": "Secret Question Answer:",
    "reg_ph_secret_a": "Your answer...",
    "reg_btn_submit": "Register and Join",

    // Detail Page (post-detail.html)
    "detail_sec_summary": "📌 General Overview & Impressions",
    "detail_sec_sightseeing": "🏛️ Places to Visit & Activities",
    "detail_sec_stay": "🏨 Accommodation & Hotel Tips",
    "detail_sec_food": "🍕 Food & Dining Recommendations",
    "detail_sec_tips": "🚌 Transportation, Budget & Important Tips",
    "detail_rate_title": "⭐ Rate This Experience",
    "detail_avg_score": "Average Rating",
    "detail_votes_suffix": "Votes Cast",
    "detail_comments_title": "💬 User Comments",
    "detail_comment_ph": "Write something about this route or ask a question...",
    "detail_comment_btn": "Post Comment",
    "detail_no_comments": "No comments yet. Be the first to comment!",

    // Public Profile (public-profile.html)
    "public_btn_send_req": "💬 Send Message Request",
    "public_btn_edit_own": "✏️ Edit Your Profile",
    "public_btn_pending": "⏳ Message Request Sent (Pending)",
    "public_btn_open_chat": "💬 Open Chat",
    "public_routes_title": "🗺️ Shared Travel Routes & Experiences",
    "public_no_posts": "This user hasn't shared any travel routes yet.",
    "public_modal_title": "📩 Send Message Request",
    "public_modal_desc_prefix": "Send your first message request to user. You can start messaging once accepted.",
    "public_modal_ph": "Hi! I wanted to ask something about your travel route...",
    "public_btn_cancel": "Cancel",
    "public_btn_submit_req": "Send Request",

    // Profile Page
    "profile_title": "My Profile Information",
    "profile_edit_btn": "✏️ Edit Info",
    "profile_menu_info": "👤 Profile Info",
    "profile_menu_wallet": "💰 My Wallet (SYTX)",
    "profile_menu_posts": "📝 My Posts",
    "profile_menu_messages": "💬 Messages / Requests",
    "profile_menu_share": "➕ Share New Experience",
    "profile_btn_logout": "Logout",
    "profile_change_photo": "📷 Change Photo",

    // Wallet
    "wallet_title": "💰 Sytraex Wallet & Rewards",
    "wallet_sub_label": "Total Sytraex Coin Balance Earned",
    "wallet_stake_btn": "Stake Now (SYTX)",
    "wallet_history_title": "📊 Coin Earnings History",
    "wallet_th_type": "Transaction Type",
    "wallet_th_desc": "Description",
    "wallet_th_amount": "Amount",

    // Footer
    "footer_text": "© 2026 Sytraex | Share Your Travel Experience"
  }
};

let currentLang = localStorage.getItem('sytraexLang') || 'tr';

document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(currentLang);
  renderLangSwitcher();
});

window.setLanguage = function(lang) {
  currentLang = lang;
  localStorage.setItem('sytraexLang', lang);
  applyLanguage(lang);
  renderLangSwitcher();
};

function applyLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });
}

function renderLangSwitcher() {
  const switchers = document.querySelectorAll('.lang-switcher');
  switchers.forEach(sw => {
    sw.innerHTML = `
      <span onclick="setLanguage('tr')" style="cursor:pointer; ${currentLang === 'tr' ? 'color:#ffcc00; font-weight:bold; text-decoration:underline;' : 'color:#aaa;'}">TR</span> / 
      <span onclick="setLanguage('en')" style="cursor:pointer; ${currentLang === 'en' ? 'color:#ffcc00; font-weight:bold; text-decoration:underline;' : 'color:#aaa;'}">EN</span>
    `;
  });
}
