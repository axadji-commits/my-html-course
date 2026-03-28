# Informatika.uz saytiga integratsiya qilish maslahatlari

## 1. Subdomain yoki alohida papka (Tavsiya etiladi ✅)

### Variant A: Subdomain
```
https://darslar.informatika.uz/
yoki
https://webdarslar.informatika.uz/
```

**Qadamlari:**
1. Hosting panelida subdomain yarating
2. "my proekt" papkasini subdomain papkasiga ko'chiring
3. Domain DNS sozlamalarini yangilang

**Afzalliklari:**
- To'liq mustaqil ishlaydi
- SEO uchun yaxshi
- URL aniq va esda qoladi

---

### Variant B: Alohida papka
```
https://www.informatika.uz/webdarslar/
yoki
https://www.informatika.uz/darslar/
```

**Qadamlari:**
1. "my proekt" papkasini `webdarslar` yoki `darslar` deb nomlang
2. Hosting papkasiga yuklang
3. Barcha havolalarni yangilang (../ → ../../)

**Afzalliklari:**
- Oson integratsiya
- Bir domain ostida
- Boshqarish oson

---

## 2. Mavjud saytga bo'lim sifatida qo'shish

### Variant A: Navigatsiyaga qo'shish
Mavjud saytning navigatsiya menyusiga "Web Darslar" bo'limini qo'shing:

```html
<!-- Informatika.uz saytining navigatsiyasiga qo'shing -->
<nav>
  <a href="/">Bosh sahifa</a>
  <a href="/about.html">Haqida</a>
  <a href="/webdarslar/">Web Darslar</a> <!-- Yangi bo'lim -->
  <a href="/contact.html">Aloqa</a>
</nav>
```

### Variant B: Asosiy sahifaga kartochka qo'shish
Mavjud saytning bosh sahifasiga "Web Darslar" kartochkasini qo'shing:

```html
<div class="services-grid">
  <!-- Mavjud xizmatlar -->
  <div class="service-card">
    <h3>Web Darslar</h3>
    <p>HTML, CSS, JavaScript va React bo'yicha bepul darslar</p>
    <a href="/webdarslar/">Boshlash →</a>
  </div>
</div>
```

---

## 3. Iframe orqali integratsiya (Tezkor, lekin cheklangan)

Mavjud saytga iframe orqali qo'shish:

```html
<!-- Informatika.uz saytida -->
<iframe 
  src="https://www.informatika.uz/webdarslar/" 
  width="100%" 
  height="800px"
  frameborder="0"
  title="Web Darslar">
</iframe>
```

**Kamchiliklari:**
- SEO uchun yomon
- Responsive muammolari
- Browser cheklovlari

---

## 4. API orqali integratsiya (Murakkab, lekin kuchli)

Agar mavjud saytda backend bo'lsa, API orqali ma'lumotlarni ulash:

```javascript
// Mavjud saytda
fetch('https://www.informatika.uz/api/darslar')
  .then(res => res.json())
  .then(data => {
    // Darslar ro'yxatini ko'rsatish
  });
```

---

## 5. Amaliy qadamlarni bajarish

### Qadam 1: Fayllarni tayyorlash

1. **Barcha havolalarni yangilash:**
   - Agar `/webdarslar/` papkasiga qo'ysangiz:
   - `href="html/index.html"` → `href="webdarslar/html/index.html"`
   - Yoki nisbiy havolalarni saqlang (../)

2. **CSS va JS fayllarini tekshirish:**
   - Barcha fayllar to'g'ri yo'lda bo'lishi kerak
   - `style.css` va `scripts.js` to'g'ri ishlashi kerak

### Qadam 2: Hostingga yuklash

**FTP yoki cPanel orqali:**
```
public_html/
  ├── index.html (mavjud sayt)
  ├── webdarslar/ (yangi papka)
  │   ├── index.html
  │   ├── style.css
  │   ├── html/
  │   ├── css/
  │   ├── javascript/
  │   └── react/
```

### Qadam 3: Mavjud saytga havola qo'shish

**Mavjud saytning `index.html` yoki navigatsiya fayliga:**

```html
<!-- Variant 1: Navigatsiyaga -->
<nav class="main-nav">
  <a href="/">Bosh sahifa</a>
  <a href="/webdarslar/">Web Darslar</a>
  <a href="/about.html">Haqida</a>
</nav>

<!-- Variant 2: Hero bo'limiga -->
<section class="hero">
  <h1>Informatika darslari</h1>
  <p>Web dasturlashdan tortib, dasturlash asoslarigacha</p>
  <a href="/webdarslar/" class="btn">Web Darslar platformasiga o'tish →</a>
</section>

<!-- Variant 3: Xizmatlar bo'limiga -->
<div class="services">
  <div class="service-card">
    <h3>🌐 Web Darslar</h3>
    <p>HTML, CSS, JavaScript va React bo'yicha bepul, o'zbek tilidagi darslar</p>
    <a href="/webdarslar/" class="btn">Boshlash</a>
  </div>
</div>
```

---

## 6. SEO optimallashtirish

### Meta teglarni yangilash

```html
<!-- webdarslar/index.html -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Darslar — Informatika.uz | HTML, CSS, JavaScript, React</title>
  <meta name="description" content="Informatika.uz platformasida HTML, CSS, JavaScript va React bo'yicha bepul, o'zbek tilidagi darslar va qo'llanmalar.">
  <meta name="keywords" content="web dasturlash, HTML, CSS, JavaScript, React, o'zbek tilida darslar">
  <link rel="canonical" href="https://www.informatika.uz/webdarslar/">
</head>
```

### Sitemap.xml ga qo'shish

```xml
<!-- sitemap.xml -->
<url>
  <loc>https://www.informatika.uz/webdarslar/</loc>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://www.informatika.uz/webdarslar/html/</loc>
  <priority>0.7</priority>
</url>
<!-- ... boshqa sahifalar -->
```

---

## 7. Stilni moslashtirish

Agar mavjud saytning dizayni bilan moslashtirmoqchi bo'lsangiz:

### Variant A: Mavjud saytning CSS'ini qo'llash

```html
<!-- webdarslar/index.html -->
<head>
  <!-- Mavjud saytning CSS'ini qo'shing -->
  <link rel="stylesheet" href="../main-style.css">
  <!-- Yoki -->
  <link rel="stylesheet" href="/assets/css/main.css">
  
  <!-- O'z CSS'ingizni qo'shing (override qilish uchun) -->
  <link rel="stylesheet" href="style.css">
</head>
```

### Variant B: Header va Footer'ni bir xil qilish

Mavjud saytning header va footer'ini qo'shing:

```html
<!-- webdarslar/index.html -->
<body>
  <!-- Mavjud saytning header'ini include qiling -->
  <?php include '../includes/header.php'; ?>
  <!-- yoki -->
  <div id="header-placeholder"></div>
  <script>
    fetch('../includes/header.html')
      .then(res => res.text())
      .then(html => {
        document.getElementById('header-placeholder').innerHTML = html;
      });
  </script>

  <!-- O'z kontentingiz -->
  <main>
    <!-- ... -->
  </main>

  <!-- Mavjud saytning footer'ini include qiling -->
  <?php include '../includes/footer.php'; ?>
</body>
```

---

## 8. Tavsiya etilgan yondashuv

**Eng yaxshi variant: Alohida papka + Navigatsiyaga qo'shish**

1. ✅ "my proekt" papkasini `webdarslar` deb nomlang
2. ✅ Hosting papkasiga yuklang
3. ✅ Mavjud saytning navigatsiyasiga havola qo'shing
4. ✅ Meta teglarni yangilang
5. ✅ Sitemap.xml ga qo'shing

**Natija:**
- To'liq mustaqil ishlaydi
- SEO uchun yaxshi
- Foydalanuvchilar oson topadi
- Boshqarish oson

---

## 9. Tekshiruv ro'yxati

Integratsiyadan keyin tekshiring:

- [ ] Barcha havolalar ishlaydi
- [ ] CSS va JS fayllar yuklanadi
- [ ] Responsive dizayn ishlaydi
- [ ] Mavjud saytdan o'tish ishlaydi
- [ ] SEO meta teglar to'g'ri
- [ ] Sitemap yangilangan
- [ ] 404 xatolar yo'q
- [ ] Rasmlar yuklanadi

---

## 10. Qo'shimcha maslahatlar

1. **Google Analytics qo'shing:**
   ```html
   <!-- webdarslar/index.html -->
   <head>
     <!-- Google Analytics kodi -->
   </head>
   ```

2. **Breadcrumb navigatsiya qo'shing:**
   ```html
   <nav class="breadcrumb">
     <a href="/">Bosh sahifa</a> / 
     <a href="/webdarslar/">Web Darslar</a> / 
     <span>HTML</span>
   </nav>
   ```

3. **"Orqaga" tugmasi qo'shing:**
   ```html
   <a href="/" class="back-btn">← Informatika.uz ga qaytish</a>
   ```

4. **Mavjud saytning footer'iga havola qo'shing:**
   ```html
   <!-- Informatika.uz footer'ida -->
   <div class="footer-links">
     <a href="/webdarslar/">Web Darslar</a>
   </div>
   ```

---

## Yordam kerakmi?

Agar qaysidir qadamda muammo bo'lsa:
1. Hosting provider bilan bog'laning
2. DNS sozlamalarini tekshiring
3. Fayl yo'llarini tekshiring
4. Browser Console'da xatolarni ko'ring (F12)

