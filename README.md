# Sytraex 🌍 — Share Your Travel Experience

**TR** · Gezginlerin gerçek seyahat deneyimlerini fotoğraf, video ve ayrıntılı rotalarla paylaştığı, toplulukça puanlanan sosyal platform. Canlı site: <https://www.sytraex.com>
**EN** · A social platform where travellers share real travel experiences with photos, video and detailed routes, rated by the community.

## Özellikler / Features

- Google veya e-posta ile güvenli kayıt ve giriş / Google or email sign-up and login
- Şifre sıfırlama (e-posta ile) / Email password reset
- Seyahat deneyimi paylaşma, düzenleme, silme (en çok 10 fotoğraf, YouTube desteği) / Create, edit, delete experiences
- Arama ve filtreleme (yer, süre, konsept) / Search and filters
- 1-5 yıldız puanlama, yorumlar, şikâyet / Ratings, comments, reporting
- Mesaj isteği ve gerçek zamanlı sohbet / Message requests and realtime chat
- SYTX puan cüzdanı (sunucu tarafında hesaplanır) / SYTX points wallet (server-side)
- TR / EN arayüz, KVKK metinleri, hesap silme / TR/EN UI, KVKK documents, account deletion

## Mimari / Architecture

| Katman | Teknoloji |
|---|---|
| Ön yüz | Statik HTML + CSS + ES modülleri (framework yok), GitHub Pages |
| Arka uç | [Supabase](https://supabase.com): Postgres + Auth (Google OAuth) + Storage + Realtime |
| Güvenlik | Row Level Security (RLS) — kurallar `sql/schema.sql` içinde |
| E-posta | Supabase Auth e-postaları, üretimde Resend SMTP önerilir |

```
├── index.html, search-results.html, post-detail.html   keşif ve içerik
├── login.html, register.html, forgot-password.html, reset-password.html
├── profile.html, public-profile.html, share-experience.html
├── whitepaper.html, privacy.html, terms.html, 404.html
├── css/app.css            tek tasarım sistemi
├── js/config.js           Supabase URL + publishable key (herkese açık değerler)
├── js/app.js              ortak modül (oturum, dil, üst/alt bilgi, yardımcılar)
├── js/i18n.js             TR/EN sözlük
├── sql/schema.sql         tablolar, RLS, tetikleyiciler, depolama
└── .github/workflows/keepalive.yml   Supabase'i uyanık tutar
```

## Güvenlik notları / Security notes

- `js/config.js` içindeki **publishable key herkese açıktır**; güvenlik RLS ile sağlanır. **Secret / service_role anahtarını asla repoya koyma.**
- Şifreler Supabase Auth tarafından hash'lenir; uygulama şifreyi hiçbir zaman görmez veya saklamaz.
- SYTX puanları yalnızca veritabanı tetikleyicileriyle yazılır; istemci değiştiremez.
- Eski Firebase sürümünde şifreler düz metin saklanıyordu; bu sürümde kaldırıldı. Eski Firebase projesini konsoldan kapatın/silin.

## Kurulum / Setup

1. Supabase > SQL Editor: `sql/schema.sql` dosyasının tamamını çalıştır.
2. Supabase > Authentication > Sign In / Providers > Google: Client ID/Secret gir. URL Configuration'da Site URL `https://www.sytraex.com`, Redirect URL `https://www.sytraex.com/**` ve `https://sytraex.com/**`.
3. `js/config.js` içindeki URL/key değerlerini kendi projenle güncelle.
4. Dosyaları GitHub Pages deposuna yükle (`CNAME` dosyasına dokunma).

## Lisans / Legal

Bu proje şablon hukuki metinler içerir (`privacy.html`, `terms.html`); yayına almadan önce bir hukuk danışmanına kontrol ettirin. SYTX, zincir dışı bir sadakat puanıdır; yatırım tavsiyesi veya getiri vaadi değildir.
