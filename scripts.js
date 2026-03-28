// index.html бошлаш тугмаси учун
function greetUser() {
    const greeting = document.getElementById("greeting");
    if (greeting) {
        greeting.textContent = "Assalomu alaykum! Darslarni pastdan boshlab o'qib chiqing.";
    }
}

// Playground: live HTML/CSS/JS emulyatori uchun default kodlar
const playgroundDefaults = {
    html: `<main style="max-width: 680px; margin: 0 auto; font-family: sans-serif;">
  <h1 id="salom">Assalomu alaykum!</h1>
  <p>Bu yerda yozgan HTML/CSS/JS kodingiz natijasi chiqadi.</p>
  <button id="btn">Tugmani bosing</button>
</main>`,
    css: `body {
  background: #f8fafc;
  color: #0f172a;
  line-height: 1.6;
  padding: 24px;
}

button {
  background: #1e40af;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
}`,
    js: `const btn = document.getElementById("btn");
const title = document.getElementById("salom");

btn.addEventListener("click", () => {
  const now = new Date().toLocaleTimeString();
  title.textContent = "Bosildi: " + now;
  console.log("Tugma bosildi:", now);
});`
};

function fillPlaygroundDefaults(force = false) {
    const htmlArea = document.getElementById("pg-html");
    const cssArea = document.getElementById("pg-css");
    const jsArea = document.getElementById("pg-js");
    if (!htmlArea || !cssArea || !jsArea) return;

    if (!htmlArea.value || force) htmlArea.value = playgroundDefaults.html;
    if (!cssArea.value || force) cssArea.value = playgroundDefaults.css;
    if (!jsArea.value || force) jsArea.value = playgroundDefaults.js;
}

function runPlayground() {
    const htmlArea = document.getElementById("pg-html");
    const cssArea = document.getElementById("pg-css");
    const jsArea = document.getElementById("pg-js");
    const preview = document.getElementById("pg-preview");
    const consoleEl = document.getElementById("pg-console");

    if (!htmlArea || !cssArea || !jsArea || !preview) return;

    if (consoleEl) consoleEl.textContent = "";

    const html = htmlArea.value || "";
    const css = cssArea.value || "";
    const js = jsArea.value || "";

    // Console ko'prigi
    const bridge = `
      (function() {
        const parentWin = window.parent;
        const send = (type, payload) => {
          parentWin.postMessage({ source: 'pg-console', type, payload }, '*');
        };
        ['log','warn','error','info'].forEach(fn => {
          const orig = console[fn];
          console[fn] = function(...args) {
            send(fn, args.map(a => {
              try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
              catch (e) { return String(a); }
            }));
            if (orig) orig.apply(console, args);
          };
        });
        window.onerror = function(msg, src, line, col) {
          send('error', [msg + ' (' + line + ':' + col + ')']);
        };
      })();
    `;

    const doc = `
      <!DOCTYPE html>
      <html lang="uz">
        <head>
          <meta charset="UTF-8">
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${bridge}<\/script>
          <script>
            try {
              ${js}
            } catch (e) {
              console.error(e);
            }
          <\/script>
        </body>
      </html>
    `;

    preview.srcdoc = doc;
}

function resetPlayground() {
    fillPlaygroundDefaults(true);
    runPlayground();
}

// Konsol xabarlarini ota oynaga ko'chirish
window.addEventListener("message", function (event) {
    if (!event.data || event.data.source !== "pg-console") return;
    const consoleEl = document.getElementById("pg-console");
    if (!consoleEl) return;
    const { type, payload } = event.data;
    const line = `[${type.toUpperCase()}] ${payload.join(" ")}`;
    consoleEl.textContent += line + "\n";
});

// contact.html форма учун (агар мавжуд бўлса)
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("status");

    if (form && status) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            status.textContent = "Xabaringiz yuborildi. Rahmat!";
            status.style.color = "green";
        });
    }

    fillPlaygroundDefaults();
    runPlayground();

    // Global UX features (barcha sahifalarda)
    initHeaderMobileNav();
    initBackToTop();
    initProgressAndBookmarks();
    initCodeTools();
    initPlaygroundPlus();
});

function getSiteBase() {
    try {
        const css = document.querySelector('link[rel="stylesheet"][href$="style.css"]');
        const href = css ? css.getAttribute('href') : 'style.css';
        if (!href) return '';
        return href.replace(/style\.css(\?.*)?$/i, '');
    } catch (e) {
        return '';
    }
}

function siteUrl(path) {
    const base = getSiteBase();
    return base + path.replace(/^\//, '');
}

/* ===== Mobile nav (hamburger) ===== */
function initHeaderMobileNav() {
    const header = document.querySelector('.site-header');
    const nav = document.querySelector('.main-nav');
    const headerInner = document.querySelector('.site-header .header-inner');
    if (!header || !nav || !headerInner) return;

    let tools = headerInner.querySelector('.header-tools');
    if (!tools) {
        tools = document.createElement('div');
        tools.className = 'header-tools';
        headerInner.appendChild(tools);
    }

    if (!tools.querySelector('[data-action="toggle-nav"]')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tool-btn nav-toggle';
        btn.setAttribute('data-action', 'toggle-nav');
        btn.textContent = '☰ Menu';
        btn.addEventListener('click', function () {
            header.classList.toggle('nav-open');
        });
        if (tools.firstChild) {
            tools.insertBefore(btn, tools.firstChild);
        } else {
            tools.appendChild(btn);
        }
    }

    // default collapsed on mobile
    header.classList.add('nav-collapsed');
    const onResize = function () {
        if (window.innerWidth <= 720) {
            header.classList.add('nav-collapsed');
        } else {
            header.classList.remove('nav-open');
        }
    };
    window.addEventListener('resize', onResize);
    onResize();
}

/* ===== Back to top ===== */
function initBackToTop() {
    if (document.getElementById('backToTop')) return;
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.textContent = '↑ Tepaga';
    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);

    const onScroll = function () {
        if (window.scrollY > 500) btn.classList.add('show');
        else btn.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
}

/* ===== Progress + Bookmarks ===== */
function lessonIdFromPath() {
    const p = (location.pathname || '').replace(/\\/g, '/');
    return p.replace(/^\/+/, '');
}

function isLessonPage() {
    const p = (location.pathname || '').replace(/\\/g, '/');
    const isSub = /\/(html|css|javascript|react|git)\//.test(p);
    const isIndex = /\/(html|css|javascript|react|git)\/index\.html$/.test(p);
    return isSub && !isIndex;
}

function isCourseIndexPage() {
    const p = (location.pathname || '').replace(/\\/g, '/');
    return /\/(html|css|javascript|react|git)\/index\.html$/.test(p);
}

function progressKey(id) { return 'lesson:done:' + id; }
function bookmarkKey(id) { return 'lesson:star:' + id; }

function initProgressAndBookmarks() {
    try {
        if (isLessonPage()) {
            // CSS 14-rasmlar.html faylida progress tracking o'chirilgan
            const path = (location.pathname || '').replace(/\\/g, '/');
            if (path.includes('14-rasmlar.html')) return;
            
            const main = document.querySelector('main');
            if (!main) return;

            const id = lessonIdFromPath();
            const done = localStorage.getItem(progressKey(id)) === '1';

            const bar = document.createElement('div');
            bar.className = 'detail-section';
            bar.style.padding = '14px 16px';
            bar.style.display = 'flex';
            bar.style.alignItems = 'center';
            bar.style.justifyContent = 'space-between';
            bar.style.gap = '12px';

            const left = document.createElement('div');
            left.style.fontWeight = '700';
            left.textContent = 'Dars holati:';

            const right = document.createElement('div');
            right.style.display = 'flex';
            right.style.gap = '10px';
            right.style.flexWrap = 'wrap';

            const doneBtn = document.createElement('button');
            doneBtn.type = 'button';
            doneBtn.className = 'tool-btn';
            doneBtn.style.background = done ? 'rgba(16,185,129,0.22)' : 'rgba(255,255,255,0.08)';
            doneBtn.textContent = done ? '✅ O‘qildi' : '⬜ O‘qilmadi';
            doneBtn.addEventListener('click', function () {
                const next = !(localStorage.getItem(progressKey(id)) === '1');
                localStorage.setItem(progressKey(id), next ? '1' : '0');
                doneBtn.textContent = next ? '✅ O‘qildi' : '⬜ O‘qilmadi';
                doneBtn.style.background = next ? 'rgba(16,185,129,0.22)' : 'rgba(255,255,255,0.08)';
            });

            right.appendChild(doneBtn);
            bar.appendChild(left);
            bar.appendChild(right);

            // main boshiga qo'yamiz
            if (main.firstChild) {
                main.insertBefore(bar, main.firstChild);
            } else {
                main.appendChild(bar);
            }
        }

        if (isCourseIndexPage()) {
            const links = Array.from(document.querySelectorAll('main a[href$=".html"]'));
            const lessonLinks = links.filter(a => {
                const href = a.getAttribute('href') || '';
                return href && href !== 'index.html' && !/admin|test-|playground/.test(href);
            });
            if (lessonLinks.length === 0) return;

            let doneCount = 0;
            lessonLinks.forEach(a => {
                const href = a.getAttribute('href') || '';
                const id = lessonIdFromPath().replace(/\/index\.html$/, '/') + href;
                if (localStorage.getItem(progressKey(id)) === '1') doneCount++;
            });
            const percent = Math.round((doneCount / lessonLinks.length) * 100);

            const main = document.querySelector('main');
            if (main) {
                const info = document.createElement('div');
                info.className = 'detail-section';
                info.style.padding = '14px 16px';
                info.innerHTML = `<strong>Progress:</strong> ${doneCount}/${lessonLinks.length} (${percent}%)`;
                if (main.firstChild) {
                    main.insertBefore(info, main.firstChild);
                } else {
                    main.appendChild(info);
                }
            }
        }
    } catch (e) {
        // ignore
    }
}

/* ===== Code tools: copy + highlight ===== */
function initCodeTools() {
    try {
        injectHljs();

        // pre code bloklari uchun
        const blocks = Array.from(document.querySelectorAll('pre code'));
        blocks.forEach(function (codeEl) {
            const pre = codeEl.parentElement;
            if (!pre) return;
            if (pre.querySelector('.copy-btn')) return;

            pre.style.position = 'relative';
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'copy-btn';
            btn.textContent = '📋 Nusxalash';
            btn.style.position = 'absolute';
            btn.style.top = '10px';
            btn.style.right = '10px';
            btn.style.padding = '8px 14px';
            btn.style.borderRadius = '8px';
            btn.style.border = '1px solid rgba(255,255,255,0.16)';
            btn.style.background = 'rgba(59, 130, 246, 0.9)';
            btn.style.color = '#fff';
            btn.style.fontWeight = '600';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '13px';
            btn.style.transition = 'all 0.2s';
            btn.onmouseover = function() { this.style.background = 'rgba(59, 130, 246, 1)'; this.style.transform = 'scale(1.05)'; };
            btn.onmouseout = function() { this.style.background = 'rgba(59, 130, 246, 0.9)'; this.style.transform = 'scale(1)'; };

            btn.addEventListener('click', function () {
                const text = codeEl.innerText || codeEl.textContent || '';
                copyText(text).then(function () {
                    btn.textContent = '✅ Nusxalandi!';
                    btn.style.background = 'rgba(16, 185, 129, 0.9)';
                    setTimeout(function () { 
                        btn.textContent = '📋 Nusxalash';
                        btn.style.background = 'rgba(59, 130, 246, 0.9)';
                    }, 2000);
                });
            });

            pre.appendChild(btn);
        });


        // highlight when loaded
        window.setTimeout(function () {
            if (window.hljs) {
                blocks.forEach(function (codeEl) {
                    try { window.hljs.highlightElement(codeEl); } catch (e) {}
                });
                if (window.hljs && window.hljs.lineNumbersBlock) {
                    blocks.forEach(function (codeEl) {
                        try { window.hljs.lineNumbersBlock(codeEl); } catch (e) {}
                    });
                }
            }
        }, 500);
    } catch (e) {
        // ignore
    }
}

function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        resolve();
    });
}

let hljsInjected = false;
function injectHljs() {
    if (hljsInjected) return;
    hljsInjected = true;

    // CSS yuklash - Tracking Prevention xatoliklarini e'tiborsiz qoldirish
    try {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
        css.id = 'hljs-theme';
        css.crossOrigin = 'anonymous';
        css.onerror = function() {};
        document.head.appendChild(css);
    } catch (e) {}

    // Highlight.js script yuklash
    try {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
        s.defer = true;
        s.crossOrigin = 'anonymous';
        s.onerror = function() {};
        document.head.appendChild(s);
    } catch (e) {}

    // Line numbers script yuklash
    try {
        const ln = document.createElement('script');
        ln.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.8.0/highlightjs-line-numbers.min.js';
        ln.defer = true;
        ln.crossOrigin = 'anonymous';
        ln.onerror = function() {};
        document.head.appendChild(ln);
    } catch (e) {}
}

/* ===== Playground enhancements ===== */
function initPlaygroundPlus() {
    const htmlArea = document.getElementById("pg-html");
    const cssArea = document.getElementById("pg-css");
    const jsArea = document.getElementById("pg-js");
    if (!htmlArea || !cssArea || !jsArea) return;

    // load saved
    const savedHtml = localStorage.getItem('pg:html');
    const savedCss = localStorage.getItem('pg:css');
    const savedJs = localStorage.getItem('pg:js');
    if (savedHtml || savedCss || savedJs) {
        if (savedHtml) htmlArea.value = savedHtml;
        if (savedCss) cssArea.value = savedCss;
        if (savedJs) jsArea.value = savedJs;
        runPlayground();
    }

    // autosave
    let t = null;
    const save = function () {
        localStorage.setItem('pg:html', htmlArea.value || '');
        localStorage.setItem('pg:css', cssArea.value || '');
        localStorage.setItem('pg:js', jsArea.value || '');
    };
    const onInput = function () {
        if (t) clearTimeout(t);
        t = setTimeout(save, 400);
    };
    htmlArea.addEventListener('input', onInput);
    cssArea.addEventListener('input', onInput);
    jsArea.addEventListener('input', onInput);
}



// tests.html – foydalanuvchi ma'lumotlari va test
let foydalanuvchiIsmi = "";
let foydalanuvchiFamiliyasi = "";

function startTest() {
    try {
        const ismInput = document.getElementById("ism");
        const familiyaInput = document.getElementById("familiya");
        
        if (!ismInput || !familiyaInput) {
            alert("Xato: Forma elementlari topilmadi. Sahifani yangilang.");
            return;
        }
        
        const ism = ismInput.value.trim();
        const familiya = familiyaInput.value.trim();
        
        if (!ism || !familiya) {
            alert("Iltimos, ism va familiyangizni kiriting!");
            return;
        }
        
        foydalanuvchiIsmi = ism;
        foydalanuvchiFamiliyasi = familiya;
        
        // Foydalanuvchi ma'lumotlari formasini yashirish
        const userInfoForm = document.getElementById("userInfoForm");
        if (userInfoForm) {
            userInfoForm.style.display = "none";
        }
        
        // Test formasini ko'rsatish
        const quizForm = document.getElementById("quizForm");
        if (!quizForm) {
            alert("Xato: Test formasi topilmadi. Sahifani yangilang.");
            return;
        }
        
        quizForm.style.display = "block";
        
        // Eski userInfoDisplay'ni o'chirish (agar mavjud bo'lsa)
        const oldUserInfo = document.getElementById("userInfoDisplay");
        if (oldUserInfo) {
            oldUserInfo.remove();
        }
        
        // Foydalanuvchi ma'lumotlarini ko'rsatish
        const userInfo = document.createElement("div");
        userInfo.id = "userInfoDisplay";
        userInfo.style.cssText = "margin-bottom: 20px; padding: 16px; background: #dbeafe; border-left: 4px solid #38bdf8; border-radius: 6px; font-size: 16px;";
        userInfo.innerHTML = `<strong>Test topshiruvchi:</strong> ${ism} ${familiya}`;
        
        // Progress bar yaratish
        const progressContainer = document.createElement("div");
        progressContainer.id = "progressContainer";
        progressContainer.style.cssText = "margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;";
        
        const progressInfo = document.createElement("div");
        progressInfo.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;";
        
        const progressText = document.createElement("span");
        progressText.id = "progressText";
        progressText.style.cssText = "font-weight: 600; color: #374151; font-size: 14px;";
        progressText.textContent = "Progress: 0%";
        
        const progressPercent = document.createElement("span");
        progressPercent.id = "progressPercent";
        progressPercent.style.cssText = "font-weight: 600; color: #0ea5e9; font-size: 14px;";
        progressPercent.textContent = "0 / 0";
        
        progressInfo.appendChild(progressText);
        progressInfo.appendChild(progressPercent);
        
        const progressBar = document.createElement("div");
        progressBar.id = "progressBar";
        progressBar.style.cssText = "width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;";
        
        const progressFill = document.createElement("div");
        progressFill.id = "progressFill";
        progressFill.style.cssText = "width: 0%; height: 100%; background: linear-gradient(90deg, #0ea5e9, #38bdf8); border-radius: 4px; transition: width 0.3s ease;";
        
        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressInfo);
        progressContainer.appendChild(progressBar);
        
        // Savollar sonini hisoblash
        const totalQuestions = quizForm.querySelectorAll('.question-card').length;
        progressPercent.textContent = `0 / ${totalQuestions}`;
        
        // Progress bar'ni yangilash funksiyasi
        window.updateProgress = function() {
            const answered = quizForm.querySelectorAll('input[type="radio"]:checked').length;
            const percent = totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0;
            progressText.textContent = `Progress: ${percent}%`;
            progressPercent.textContent = `${answered} / ${totalQuestions}`;
            progressFill.style.width = `${percent}%`;
        };
        
        // Har bir radio button'ga event listener qo'shish
        quizForm.querySelectorAll('input[type="radio"]').forEach(function(radio) {
            radio.addEventListener('change', window.updateProgress);
        });
        
        if (quizForm.firstChild) {
            quizForm.insertBefore(userInfo, quizForm.firstChild);
            quizForm.insertBefore(progressContainer, userInfo.nextSibling);
        } else {
            quizForm.appendChild(userInfo);
            quizForm.appendChild(progressContainer);
        }
        
        // Test boshlanishini ko'rsatish
        quizForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error("startTest xatosi:", error);
        alert("Xato yuz berdi: " + error.message + "\n\nSahifani yangilab qayta urinib ko'ring.");
    }
}

// tests.html – назорат тестларини баҳолаш
function gradeQuiz() {
    const correct = {
        q1: "a",
        q2: "b",
        q3: "c",
        q4: "b",
        q5: "b",
        q6: "b",
        q7: "b",
        q8: "b"
    };

    let total = Object.keys(correct).length;
    let score = 0;

    Object.keys(correct).forEach(function (key) {
        const selected = document.querySelector('input[name="' + key + '"]:checked');
        if (selected && selected.value === correct[key]) {
            score++;
        }
    });

    const resultEl = document.getElementById("quizResult");
    if (!resultEl) return;

    // Foydalanuvchi ma'lumotlari bilan natija
    const foiz = Math.round((score / total) * 100);
    let natijaMatn = "";
    let rang = "";
    
    if (foiz >= 75) {
        natijaMatn = `✅ Ajoyib, ${foydalanuvchiIsmi} ${foydalanuvchiFamiliyasi}!`;
        rang = "#16a34a";
    } else if (foiz >= 50) {
        natijaMatn = `👍 Yaxshi, ${foydalanuvchiIsmi} ${foydalanuvchiFamiliyasi}!`;
        rang = "#facc15";
    } else {
        natijaMatn = `📚 Qayta o'qing, ${foydalanuvchiIsmi} ${foydalanuvchiFamiliyasi}!`;
        rang = "#dc2626";
    }
    
    // Natijani localStorage'ga saqlash
    const natijaMalumotlari = {
        id: (window.crypto && typeof window.crypto.randomUUID === 'function') ? window.crypto.randomUUID() : (Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10)),
        ism: foydalanuvchiIsmi,
        familiya: foydalanuvchiFamiliyasi,
        score: score,
        total: total,
        foiz: foiz,
        sana: new Date().toISOString(),
        sanaKorishishi: new Date().toLocaleString('uz-UZ'),
        natija: natijaMatn
    };
    
    // localStorage'dan eski natijalarni olish
    let barchaNatijalar = [];
    const saqlanganNatijalar = localStorage.getItem('testNatijalari');
    if (saqlanganNatijalar) {
        try {
            barchaNatijalar = JSON.parse(saqlanganNatijalar);
        } catch (e) {
            barchaNatijalar = [];
        }
    }
    
    // Yangi natijani qo'shish
    barchaNatijalar.push(natijaMalumotlari);
    
    // localStorage'ga saqlash (oxirgi 50 ta natijani saqlash)
    if (barchaNatijalar.length > 50) {
        barchaNatijalar = barchaNatijalar.slice(-50);
    }
    localStorage.setItem('testNatijalari', JSON.stringify(barchaNatijalar));

    // Serverga yuborish (cPanel PHP+MySQL bo'lsa)
    sendResultToServer(natijaMalumotlari);
    
    // Qo'shtirnoqlarni escape qilish
    const ismEscaped = String(foydalanuvchiIsmi).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const familiyaEscaped = String(foydalanuvchiFamiliyasi).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    
    // Progress bar'ni yashirish
    const progressContainer = document.getElementById("progressContainer");
    if (progressContainer) {
        progressContainer.style.display = "none";
    }
    
    resultEl.innerHTML = `
        <div style="padding: 24px; background: ${rang === "#16a34a" ? "#dcfce7" : rang === "#facc15" ? "#fef3c7" : "#fee2e2"}; border-radius: 12px; border-left: 4px solid ${rang}; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 8px;">${foiz >= 75 ? "🎉" : foiz >= 50 ? "👍" : "📚"}</div>
                <h3 style="margin: 0; color: ${rang}; font-size: 24px; font-weight: 700;">${natijaMatn}</h3>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-size: 16px; color: #6b7280; font-weight: 500;">To'g'ri javoblar:</span>
                    <span style="font-size: 24px; color: ${rang}; font-weight: 700;">${score} / ${total}</span>
                </div>
                <div style="width: 100%; height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden; margin-bottom: 12px;">
                    <div style="width: ${foiz}%; height: 100%; background: linear-gradient(90deg, ${rang}, ${rang}dd); border-radius: 6px; transition: width 0.5s ease;"></div>
                </div>
                <div style="text-align: center;">
                    <span style="font-size: 32px; color: ${rang}; font-weight: 700;">${foiz}%</span>
                </div>
            </div>
            
            <div style="background: #f9fafb; padding: 12px 16px; border-radius: 6px; margin-bottom: 16px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    <strong>📅 Test topshirildi:</strong> ${new Date().toLocaleString('uz-UZ')}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #059669; font-weight: 600;">
                    ✅ Natija localStorage'ga saqlandi
                </p>
            </div>
            
            <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
                <button onclick="location.reload()" style="padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s ease;">🔄 Testni qayta boshlash</button>
                <button onclick="korsatNatijalar()" style="padding: 10px 20px; background: #38bdf8; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">📊 Barcha natijalarni ko'rish</button>
                <button id="csvDownloadBtn" data-ism="${ismEscaped}" data-familiya="${familiyaEscaped}" data-score="${score}" data-total="${total}" data-foiz="${foiz}" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">💾 CSV yuklab olish</button>
                <button onclick="natijaniChopEtish()" style="padding: 10px 20px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">🖨️ Chop etish / PDF</button>
            </div>
        </div>
    `;
    resultEl.style.display = "block";
    
    // CSV tugmasiga event listener qo'shish
    setTimeout(function() {
        const csvBtn = document.getElementById('csvDownloadBtn');
        if (csvBtn) {
            csvBtn.addEventListener('click', function() {
                const ism = this.getAttribute('data-ism');
                const familiya = this.getAttribute('data-familiya');
                const scoreVal = parseInt(this.getAttribute('data-score'));
                const totalVal = parseInt(this.getAttribute('data-total'));
                const foizVal = parseInt(this.getAttribute('data-foiz'));
                csvYuklabOlish(ism, familiya, scoreVal, totalVal, foizVal, 'Umumiy');
            });
        }
    }, 100);
}

// HTML test uchun alohida funksiya
function gradeHtmlQuiz() {
    const correct = {
        q1: "a",  // <html>
        q2: "b",  // <img>
        q3: "a",  // <strong>
        q4: "b",  // <ul> yoki <ol>
        q5: "b",  // <a>
        q6: "a",  // <table>
        q7: "b",  // <form>
        q8: "b",  // <textarea>
        q9: "a",  // <title>
        q10: "a", // <meta>
        q11: "a", // h1, h2, h3, h4, h5, h6
        q12: "b", // <em> yoki <i>
        q13: "b", // <p>
        q14: "b", // <hr>
        q15: "b", // <br>
        q16: "a", // <video>
        q17: "a", // <audio>
        q18: "a", // type="text"
        q19: "b", // type="checkbox"
        q20: "a", // type="radio"
        q21: "a", // <select>
        q22: "a", // <button>
        q23: "a", // <div>
        q24: "a", // <span>
        q25: "a", // <header>
        q26: "a", // <footer>
        q27: "a", // <nav>
        q28: "a", // <article>
        q29: "a", // <section>
        q30: "a"  // <aside>
    };

    let total = Object.keys(correct).length;
    let score = 0;

    Object.keys(correct).forEach(function (key) {
        const selected = document.querySelector('input[name="' + key + '"]:checked');
        if (selected && selected.value === correct[key]) {
            score++;
        }
    });

    const resultEl = document.getElementById("quizResult");
    if (!resultEl) return;

    const foiz = Math.round((score / total) * 100);
    let natijaMatn = "";
    let rang = "";
    
    if (foiz >= 75) {
        natijaMatn = `✅ Ajoyib, ${foydalanuvchiIsmi} ${foydalanuvchiFamiliyasi}!`;
        rang = "#16a34a";
    } else if (foiz >= 50) {
        natijaMatn = `👍 Yaxshi, ${foydalanuvchiIsmi} ${foydalanuvchiFamiliyasi}!`;
        rang = "#facc15";
    } else {
        natijaMatn = `📚 Qayta o'qing, ${foydalanuvchiIsmi} ${foydalanuvchiFamiliyasi}!`;
        rang = "#dc2626";
    }
    
    const natijaMalumotlari = {
        id: (window.crypto && typeof window.crypto.randomUUID === 'function') ? window.crypto.randomUUID() : (Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10)),
        ism: foydalanuvchiIsmi,
        familiya: foydalanuvchiFamiliyasi,
        score: score,
        total: total,
        foiz: foiz,
        sana: new Date().toISOString(),
        sanaKorishishi: new Date().toLocaleString('uz-UZ'),
        natija: natijaMatn,
        testTuri: "HTML"
    };
    
    let barchaNatijalar = [];
    const saqlanganNatijalar = localStorage.getItem('testNatijalari');
    if (saqlanganNatijalar) {
        try {
            barchaNatijalar = JSON.parse(saqlanganNatijalar);
        } catch (e) {
            barchaNatijalar = [];
        }
    }
    
    barchaNatijalar.push(natijaMalumotlari);
    
    if (barchaNatijalar.length > 50) {
        barchaNatijalar = barchaNatijalar.slice(-50);
    }
    localStorage.setItem('testNatijalari', JSON.stringify(barchaNatijalar));

    // Serverga yuborish (cPanel PHP+MySQL bo'lsa)
    sendResultToServer(natijaMalumotlari);
    
    const ismEscaped = String(foydalanuvchiIsmi).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const familiyaEscaped = String(foydalanuvchiFamiliyasi).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    
    // Progress bar'ni yashirish
    const progressContainer = document.getElementById("progressContainer");
    if (progressContainer) {
        progressContainer.style.display = "none";
    }
    
    resultEl.innerHTML = `
        <div style="padding: 24px; background: ${rang === "#16a34a" ? "#dcfce7" : rang === "#facc15" ? "#fef3c7" : "#fee2e2"}; border-radius: 12px; border-left: 4px solid ${rang}; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 8px;">${foiz >= 75 ? "🎉" : foiz >= 50 ? "👍" : "📚"}</div>
                <h3 style="margin: 0; color: ${rang}; font-size: 24px; font-weight: 700;">${natijaMatn}</h3>
                <p style="margin: 8px 0 0 0; font-size: 16px; color: #6b7280; font-weight: 500;">Test turi: HTML</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-size: 16px; color: #6b7280; font-weight: 500;">To'g'ri javoblar:</span>
                    <span style="font-size: 24px; color: ${rang}; font-weight: 700;">${score} / ${total}</span>
                </div>
                <div style="width: 100%; height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden; margin-bottom: 12px;">
                    <div style="width: ${foiz}%; height: 100%; background: linear-gradient(90deg, ${rang}, ${rang}dd); border-radius: 6px; transition: width 0.5s ease;"></div>
                </div>
                <div style="text-align: center;">
                    <span style="font-size: 32px; color: ${rang}; font-weight: 700;">${foiz}%</span>
                </div>
            </div>
            
            <div style="background: #f9fafb; padding: 12px 16px; border-radius: 6px; margin-bottom: 16px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    <strong>📅 Test topshirildi:</strong> ${new Date().toLocaleString('uz-UZ')}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #059669; font-weight: 600;">
                    ✅ Natija localStorage'ga saqlandi
                </p>
            </div>
            
            <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
                <button onclick="location.reload()" style="padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s ease;">🔄 Testni qayta boshlash</button>
                <button onclick="korsatNatijalar()" style="padding: 10px 20px; background: #38bdf8; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">📊 Barcha natijalarni ko'rish</button>
                <button id="csvDownloadBtn" data-ism="${ismEscaped}" data-familiya="${familiyaEscaped}" data-score="${score}" data-total="${total}" data-foiz="${foiz}" data-test-turi="HTML" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">💾 CSV yuklab olish</button>
                <button onclick="natijaniChopEtish()" style="padding: 10px 20px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">🖨️ Chop etish / PDF</button>
            </div>
        </div>
    `;
    resultEl.style.display = "block";
    
    setTimeout(function() {
        const csvBtn = document.getElementById('csvDownloadBtn');
        if (csvBtn) {
            csvBtn.addEventListener('click', function() {
                const ism = this.getAttribute('data-ism');
                const familiya = this.getAttribute('data-familiya');
                const scoreVal = parseInt(this.getAttribute('data-score'));
                const totalVal = parseInt(this.getAttribute('data-total'));
                const foizVal = parseInt(this.getAttribute('data-foiz'));
                const testTuri = this.getAttribute('data-test-turi') || 'HTML';
                csvYuklabOlish(ism, familiya, scoreVal, totalVal, foizVal, testTuri);
            });
        }
    }, 100);
}

// CSS test uchun alohida funksiya
function gradeCssQuiz() {
    const correct = {
        q1: "c",  // <link rel="stylesheet" href="style.css">
        q2: "b",  // margin
        q3: "b",  // text-align: center;
        q4: "b",  // color
        q5: "b",  // # (hash)
        q6: "a",  // . (nuqta)
        q7: "a",  // display: flex;
        q8: "a",  // display: grid;
        q9: "a",  // @media
        q10: "b", // --nom: qiymat;
        q11: "a", // background-color
        q12: "a", // font-size
        q13: "a", // font-family
        q14: "a", // width
        q15: "a", // height
        q16: "a", // padding
        q17: "a", // border
        q18: "a", // display: none;
        q19: "a", // display: block;
        q20: "a", // position
        q21: "a", // float: left;
        q22: "a", // float: right;
        q23: "a", // box-shadow
        q24: "a", // linear-gradient()
        q25: "a", // transform
        q26: "a", // transition
        q27: "a", // animation
        q28: "a", // Elementlarning qatlam tartibini belgilash uchun
        q29: "a", // Elementdan tashqariga chiqgan kontentni boshqarish uchun
        q30: "a"  // Xususiyatning ustuvorligini oshirish uchun
    };

    let total = Object.keys(correct).length;
    let score = 0;

    Object.keys(correct).forEach(function (key) {
        const selected = document.querySelector('input[name="' + key + '"]:checked');
        if (selected && selected.value === correct[key]) {
            score++;
        }
    });

    const resultEl = document.getElementById("quizResult");
    if (!resultEl) return;

    const foiz = Math.round((score / total) * 100);
    let natijaMatn = "";
    let rang = "";
    
    if (foiz >= 75) {
        natijaMatn = `✅ Ajoyib, ${foydalanuvchiIsmi} ${foydalanuvchiFamiliyasi}!`;
        rang = "#16a34a";
    } else if (foiz >= 50) {
        natijaMatn = `👍 Yaxshi, ${foydalanuvchiIsmi} ${foydalanuvchiFamiliyasi}!`;
        rang = "#facc15";
    } else {
        natijaMatn = `📚 Qayta o'qing, ${foydalanuvchiIsmi} ${foydalanuvchiFamiliyasi}!`;
        rang = "#dc2626";
    }
    
    const natijaMalumotlari = {
        id: (window.crypto && typeof window.crypto.randomUUID === 'function') ? window.crypto.randomUUID() : (Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10)),
        ism: foydalanuvchiIsmi,
        familiya: foydalanuvchiFamiliyasi,
        score: score,
        total: total,
        foiz: foiz,
        sana: new Date().toISOString(),
        sanaKorishishi: new Date().toLocaleString('uz-UZ'),
        natija: natijaMatn,
        testTuri: "CSS"
    };
    
    let barchaNatijalar = [];
    const saqlanganNatijalar = localStorage.getItem('testNatijalari');
    if (saqlanganNatijalar) {
        try {
            barchaNatijalar = JSON.parse(saqlanganNatijalar);
        } catch (e) {
            barchaNatijalar = [];
        }
    }
    
    barchaNatijalar.push(natijaMalumotlari);
    
    if (barchaNatijalar.length > 50) {
        barchaNatijalar = barchaNatijalar.slice(-50);
    }
    localStorage.setItem('testNatijalari', JSON.stringify(barchaNatijalar));

    // Serverga yuborish (cPanel PHP+MySQL bo'lsa)
    sendResultToServer(natijaMalumotlari);
    
    const ismEscaped = String(foydalanuvchiIsmi).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const familiyaEscaped = String(foydalanuvchiFamiliyasi).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    
    // Progress bar'ni yashirish
    const progressContainer = document.getElementById("progressContainer");
    if (progressContainer) {
        progressContainer.style.display = "none";
    }
    
    resultEl.innerHTML = `
        <div style="padding: 24px; background: ${rang === "#16a34a" ? "#dcfce7" : rang === "#facc15" ? "#fef3c7" : "#fee2e2"}; border-radius: 12px; border-left: 4px solid ${rang}; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 8px;">${foiz >= 75 ? "🎉" : foiz >= 50 ? "👍" : "📚"}</div>
                <h3 style="margin: 0; color: ${rang}; font-size: 24px; font-weight: 700;">${natijaMatn}</h3>
                <p style="margin: 8px 0 0 0; font-size: 16px; color: #6b7280; font-weight: 500;">Test turi: CSS</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-size: 16px; color: #6b7280; font-weight: 500;">To'g'ri javoblar:</span>
                    <span style="font-size: 24px; color: ${rang}; font-weight: 700;">${score} / ${total}</span>
                </div>
                <div style="width: 100%; height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden; margin-bottom: 12px;">
                    <div style="width: ${foiz}%; height: 100%; background: linear-gradient(90deg, ${rang}, ${rang}dd); border-radius: 6px; transition: width 0.5s ease;"></div>
                </div>
                <div style="text-align: center;">
                    <span style="font-size: 32px; color: ${rang}; font-weight: 700;">${foiz}%</span>
                </div>
            </div>
            
            <div style="background: #f9fafb; padding: 12px 16px; border-radius: 6px; margin-bottom: 16px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    <strong>📅 Test topshirildi:</strong> ${new Date().toLocaleString('uz-UZ')}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #059669; font-weight: 600;">
                    ✅ Natija localStorage'ga saqlandi
                </p>
            </div>
            
            <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
                <button onclick="location.reload()" style="padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s ease;">🔄 Testni qayta boshlash</button>
                <button onclick="korsatNatijalar()" style="padding: 10px 20px; background: #38bdf8; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">📊 Barcha natijalarni ko'rish</button>
                <button id="csvDownloadBtn" data-ism="${ismEscaped}" data-familiya="${familiyaEscaped}" data-score="${score}" data-total="${total}" data-foiz="${foiz}" data-test-turi="CSS" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">💾 CSV yuklab olish</button>
                <button onclick="natijaniChopEtish()" style="padding: 10px 20px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">🖨️ Chop etish / PDF</button>
            </div>
        </div>
    `;
    resultEl.style.display = "block";
    
    setTimeout(function() {
        const csvBtn = document.getElementById('csvDownloadBtn');
        if (csvBtn) {
            csvBtn.addEventListener('click', function() {
                const ism = this.getAttribute('data-ism');
                const familiya = this.getAttribute('data-familiya');
                const scoreVal = parseInt(this.getAttribute('data-score'));
                const totalVal = parseInt(this.getAttribute('data-total'));
                const foizVal = parseInt(this.getAttribute('data-foiz'));
                const testTuri = this.getAttribute('data-test-turi') || 'CSS';
                csvYuklabOlish(ism, familiya, scoreVal, totalVal, foizVal, testTuri);
            });
        }
    }, 100);
}

// JavaScript test uchun alohida funksiya
function gradeJsQuiz() {
    const correct = {
        q1: "b",  // let
        q2: "b",  // document.getElementById()
        q3: "b",  // push()
        q4: "a",  // function nom() {}
        q5: "a",  // if
        q6: "b",  // for
        q7: "b",  // addEventListener()
        q8: "a",  // typeof
        q9: "a",  // async/await
        q10: "b", // setItem()
        q11: "a", // getItem()
        q12: "a", // pop()
        q13: "a", // length
        q14: "a", // length
        q15: "a", // toUpperCase()
        q16: "a", // toLowerCase()
        q17: "a", // map()
        q18: "a", // filter()
        q19: "a", // find()
        q20: "a", // forEach()
        q21: "a", // Object.keys()
        q22: "a", // Object.values()
        q23: "a", // Object.entries()
        q24: "a", // textContent
        q25: "a", // innerHTML
        q26: "a", // classList.add()
        q27: "a", // classList.remove()
        q28: "a", // setTimeout()
        q29: "a", // setInterval()
        q30: "a"  // try/catch
    };

    let total = Object.keys(correct).length;
    let score = 0;

    Object.keys(correct).forEach(function (key) {
        const selected = document.querySelector('input[name="' + key + '"]:checked');
        if (selected && selected.value === correct[key]) {
            score++;
        }
    });

    const resultEl = document.getElementById("quizResult");
    if (!resultEl) return;

    const foiz = Math.round((score / total) * 100);
    let natijaMatn = "";
    let rang = "";
    
    if (foiz >= 75) {
        natijaMatn = `✅ Ajoyib, ${foydalanuvchiIsmi} ${foydalanuvchiFamiliyasi}!`;
        rang = "#16a34a";
    } else if (foiz >= 50) {
        natijaMatn = `👍 Yaxshi, ${foydalanuvchiIsmi} ${foydalanuvchiFamiliyasi}!`;
        rang = "#facc15";
    } else {
        natijaMatn = `📚 Qayta o'qing, ${foydalanuvchiIsmi} ${foydalanuvchiFamiliyasi}!`;
        rang = "#dc2626";
    }
    
    const natijaMalumotlari = {
        id: (window.crypto && typeof window.crypto.randomUUID === 'function') ? window.crypto.randomUUID() : (Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10)),
        ism: foydalanuvchiIsmi,
        familiya: foydalanuvchiFamiliyasi,
        score: score,
        total: total,
        foiz: foiz,
        sana: new Date().toISOString(),
        sanaKorishishi: new Date().toLocaleString('uz-UZ'),
        natija: natijaMatn,
        testTuri: "JavaScript"
    };
    
    let barchaNatijalar = [];
    const saqlanganNatijalar = localStorage.getItem('testNatijalari');
    if (saqlanganNatijalar) {
        try {
            barchaNatijalar = JSON.parse(saqlanganNatijalar);
        } catch (e) {
            barchaNatijalar = [];
        }
    }
    
    barchaNatijalar.push(natijaMalumotlari);
    
    if (barchaNatijalar.length > 50) {
        barchaNatijalar = barchaNatijalar.slice(-50);
    }
    localStorage.setItem('testNatijalari', JSON.stringify(barchaNatijalar));

    // Serverga yuborish (cPanel PHP+MySQL bo'lsa)
    sendResultToServer(natijaMalumotlari);
    
    const ismEscaped = String(foydalanuvchiIsmi).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const familiyaEscaped = String(foydalanuvchiFamiliyasi).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    
    // Progress bar'ni yashirish
    const progressContainer = document.getElementById("progressContainer");
    if (progressContainer) {
        progressContainer.style.display = "none";
    }
    
    resultEl.innerHTML = `
        <div style="padding: 24px; background: ${rang === "#16a34a" ? "#dcfce7" : rang === "#facc15" ? "#fef3c7" : "#fee2e2"}; border-radius: 12px; border-left: 4px solid ${rang}; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 8px;">${foiz >= 75 ? "🎉" : foiz >= 50 ? "👍" : "📚"}</div>
                <h3 style="margin: 0; color: ${rang}; font-size: 24px; font-weight: 700;">${natijaMatn}</h3>
                <p style="margin: 8px 0 0 0; font-size: 16px; color: #6b7280; font-weight: 500;">Test turi: JavaScript</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-size: 16px; color: #6b7280; font-weight: 500;">To'g'ri javoblar:</span>
                    <span style="font-size: 24px; color: ${rang}; font-weight: 700;">${score} / ${total}</span>
                </div>
                <div style="width: 100%; height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden; margin-bottom: 12px;">
                    <div style="width: ${foiz}%; height: 100%; background: linear-gradient(90deg, ${rang}, ${rang}dd); border-radius: 6px; transition: width 0.5s ease;"></div>
                </div>
                <div style="text-align: center;">
                    <span style="font-size: 32px; color: ${rang}; font-weight: 700;">${foiz}%</span>
                </div>
            </div>
            
            <div style="background: #f9fafb; padding: 12px 16px; border-radius: 6px; margin-bottom: 16px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    <strong>📅 Test topshirildi:</strong> ${new Date().toLocaleString('uz-UZ')}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #059669; font-weight: 600;">
                    ✅ Natija localStorage'ga saqlandi
                </p>
            </div>
            
            <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
                <button onclick="location.reload()" style="padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s ease;">🔄 Testni qayta boshlash</button>
                <button onclick="korsatNatijalar()" style="padding: 10px 20px; background: #38bdf8; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">📊 Barcha natijalarni ko'rish</button>
                <button id="csvDownloadBtn" data-ism="${ismEscaped}" data-familiya="${familiyaEscaped}" data-score="${score}" data-total="${total}" data-foiz="${foiz}" data-test-turi="JavaScript" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">💾 CSV yuklab olish</button>
                <button onclick="natijaniChopEtish()" style="padding: 10px 20px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">🖨️ Chop etish / PDF</button>
            </div>
        </div>
    `;
    resultEl.style.display = "block";
    
    setTimeout(function() {
        const csvBtn = document.getElementById('csvDownloadBtn');
        if (csvBtn) {
            csvBtn.addEventListener('click', function() {
                const ism = this.getAttribute('data-ism');
                const familiya = this.getAttribute('data-familiya');
                const scoreVal = parseInt(this.getAttribute('data-score'));
                const totalVal = parseInt(this.getAttribute('data-total'));
                const foizVal = parseInt(this.getAttribute('data-foiz'));
                const testTuri = this.getAttribute('data-test-turi') || 'JavaScript';
                csvYuklabOlish(ism, familiya, scoreVal, totalVal, foizVal, testTuri);
            });
        }
    }, 100);
}

// Barcha natijalarni ko'rsatish funksiyasi
function korsatNatijalar() {
    const saqlanganNatijalar = localStorage.getItem('testNatijalari');
    if (!saqlanganNatijalar) {
        alert("Hozircha saqlangan natijalar yo'q.");
        return;
    }
    
    let barchaNatijalar = [];
    try {
        barchaNatijalar = JSON.parse(saqlanganNatijalar);
    } catch (e) {
        alert("Natijalarni o'qishda xato yuz berdi.");
        return;
    }
    
    // Natijalarni ko'rsatish
    let natijalarHTML = '<div style="margin-top: 20px; padding: 20px; background: #f9fafb; border-radius: 8px; border: 2px solid #38bdf8;"><h3 style="margin-top: 0; color: #374151;">Barcha test natijalari (' + barchaNatijalar.length + ' ta)</h3>';
    
    // Eng so'nggi natijalar birinchi ko'rsatiladi
    barchaNatijalar.reverse().forEach(function(natija, index) {
        const rang = natija.foiz >= 75 ? "#16a34a" : natija.foiz >= 50 ? "#facc15" : "#dc2626";
        const fonRang = natija.foiz >= 75 ? "#dcfce7" : natija.foiz >= 50 ? "#fef3c7" : "#fee2e2";
        
        natijalarHTML += `
            <div style="margin-bottom: 12px; padding: 16px; background: ${fonRang}; border-left: 4px solid ${rang}; border-radius: 6px;">
                <p style="margin: 0 0 8px 0; font-weight: 600; color: #374151; font-size: 16px;">${natija.ism} ${natija.familiya}</p>
                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;"><strong>Test turi:</strong> ${natija.testTuri || 'Umumiy'}</p>
                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;"><strong>Natija:</strong> ${natija.score} / ${natija.total} (${natija.foiz}%)</p>
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">${natija.sanaKorishishi || natija.sana || ''}</p>
            </div>
        `;
    });
    
    natijalarHTML += '<div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap;"><button onclick="barchaNatijalarniCSV()" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">Barcha natijalarni CSV yuklab olish</button><button onclick="tozalashNatijalar()" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">Barcha natijalarni o\'chirish</button></div></div>';
    
    const resultEl = document.getElementById("quizResult");
    if (resultEl) {
        resultEl.innerHTML += natijalarHTML;
    }
}

// Natijalarni tozalash funksiyasi
function tozalashNatijalar() {
    if (confirm("Haqiqatan ham barcha natijalarni o'chirmoqchimisiz?")) {
        localStorage.removeItem('testNatijalari');
        alert("Barcha natijalar o'chirildi.");
        location.reload();
    }
}

// CSV fayl sifatida yuklab olish
function csvYuklabOlish(ism, familiya, ball, jami, foiz, testTuri) {
    try {
        const sana = new Date().toLocaleString('uz-UZ');
        const natija = foiz >= 75 ? 'Ajoyib' : foiz >= 50 ? 'Yaxshi' : 'Qayta o\'qing';
        const turi = testTuri || 'Umumiy';
        
        // CSV kontentini yaratish (Excel uchun optimallashtirilgan)
        const csvRows = [
            ['Test Natijasi', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['Ism', 'Familiya', 'Test turi', 'Ball', 'Jami', 'Foiz', 'Sana', 'Natija'],
            [ism, familiya, turi, ball, jami, foiz + '%', sana, natija]
        ];
        
        // CSV formatini yaratish (Excel uchun)
        const csvContent = csvRows.map(row => {
            return row.map(cell => {
                // Matnni tozalash va qo'shtirnoqlar bilan o'ralash
                const cleanCell = String(cell || '').replace(/"/g, '""');
                return `"${cleanCell}"`;
            }).join(',');
        }).join('\n');
        
        // UTF-8 BOM qo'shish (Excel'da to'g'ri ochilishi uchun)
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { 
            type: 'text/csv;charset=utf-8;' 
        });
        
        // Fayl nomini yaratish (maxsus belgilar olib tashlanadi)
        const cleanIsm = ism.replace(/[^a-zA-Z0-9]/g, '_');
        const cleanFamiliya = familiya.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `test_natijasi_${cleanIsm}_${cleanFamiliya}_${new Date().toISOString().split('T')[0]}.csv`;
        
        // Yuklab olish
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // URL'ni tozalash
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        alert('✅ CSV fayl muvaffaqiyatli yuklab olindi!\n\nFayl Excel yoki boshqa jadval dasturida ochilishi mumkin.');
    } catch (error) {
        console.error('CSV yuklab olishda xato:', error);
        alert('❌ Xato yuz berdi. Iltimos, qayta urinib ko\'ring.');
    }
}

// Barcha natijalarni CSV sifatida yuklab olish
function barchaNatijalarniCSV() {
    try {
        const saqlanganNatijalar = localStorage.getItem('testNatijalari');
        if (!saqlanganNatijalar) {
            alert("Hozircha saqlangan natijalar yo'q.");
            return;
        }
        
        let barchaNatijalar = [];
        try {
            barchaNatijalar = JSON.parse(saqlanganNatijalar);
        } catch (e) {
            alert("Natijalarni o'qishda xato yuz berdi.");
            return;
        }
        
        if (barchaNatijalar.length === 0) {
            alert("Hozircha saqlangan natijalar yo'q.");
            return;
        }
        
        // CSV kontentini yaratish (Excel uchun optimallashtirilgan)
        const csvRows = [
            ['Barcha Test Natijalari', '', '', '', '', '', '', ''],
            ['Jami natijalar soni:', barchaNatijalar.length, '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['Ism', 'Familiya', 'Test turi', 'Ball', 'Jami', 'Foiz', 'Sana', 'Natija']
        ];
        
        // Eng so'nggi natijalar birinchi (tartib bo'yicha)
        barchaNatijalar.reverse().forEach(natija => {
            csvRows.push([
                natija.ism || '',
                natija.familiya || '',
                natija.testTuri || 'Umumiy',
                natija.score || 0,
                natija.total || 0,
                (natija.foiz || 0) + '%',
                natija.sanaKorishishi || natija.sana || '',
                natija.natija || ''
            ]);
        });
        
        // CSV formatini yaratish
        const csvContent = csvRows.map(row => {
            return row.map(cell => {
                // Matnni tozalash va qo'shtirnoqlar bilan o'ralash
                const cleanCell = String(cell || '').replace(/"/g, '""');
                return `"${cleanCell}"`;
            }).join(',');
        }).join('\n');
        
        // UTF-8 BOM qo'shish (Excel'da to'g'ri ochilishi uchun)
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { 
            type: 'text/csv;charset=utf-8;' 
        });
        
        // Fayl nomini yaratish
        const sana = new Date().toISOString().split('T')[0];
        const fileName = `barcha_test_natijalari_${sana}.csv`;
        
        // Yuklab olish
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // URL'ni tozalash
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        alert(`✅ ${barchaNatijalar.length} ta natija CSV fayl sifatida muvaffaqiyatli yuklab olindi!\n\nFayl Excel yoki boshqa jadval dasturida ochilishi mumkin.`);
    } catch (error) {
        console.error('CSV yuklab olishda xato:', error);
        alert('❌ Xato yuz berdi. Iltimos, qayta urinib ko\'ring.');
    }
}

// Natijani chop etish yoki PDF sifatida saqlash
function natijaniChopEtish() {
    const resultEl = document.getElementById("quizResult");
    if (!resultEl) {
        alert("Natija topilmadi.");
        return;
    }
    
    // Yangi oyna ochish
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="uz">
        <head>
            <meta charset="UTF-8">
            <title>Test Natijasi</title>
            <style>
                @media print {
                    @page {
                        margin: 2cm;
                    }
                }
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                h1 {
                    color: #374151;
                    border-bottom: 3px solid #38bdf8;
                    padding-bottom: 10px;
                }
                .natija-box {
                    background: #f9fafb;
                    padding: 30px;
                    border-radius: 8px;
                    border-left: 4px solid #38bdf8;
                    margin: 20px 0;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                .info-label {
                    font-weight: 600;
                    color: #6b7280;
                }
                .info-value {
                    color: #374151;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    color: #9ca3af;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <h1>Test Natijasi</h1>
            <div class="natija-box">
                ${resultEl.innerHTML}
            </div>
            <div class="footer">
                <p>Web Darslar — Frontend dasturlash bo'yicha test natijasi</p>
                <p>Chop etilgan sana: ${new Date().toLocaleString('uz-UZ')}</p>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Test natijasini serverga saqlash (cPanel PHP+MySQL)
function sendResultToServer(result) {
    try {
        fetch(siteUrl('api/save_result.php'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result),
            keepalive: true
        }).catch(function () {});
    } catch (e) {
        // ignore
    }
}

// ===== O'QUV JARAYONI YAXSHILASHLARI =====

// Progress tracking - o'qilgan mavzularni saqlash
function markTopicAsRead(topicId) {
    try {
        const readTopics = JSON.parse(localStorage.getItem('readTopics') || '[]');
        if (!readTopics.includes(topicId)) {
            readTopics.push(topicId);
            localStorage.setItem('readTopics', JSON.stringify(readTopics));
            updateReadIndicator(topicId);
            updateProgress();
        }
    } catch (e) {
        console.error('Progress saqlashda xatolik:', e);
    }
}

// O'qilgan mavzularni tekshirish
function isTopicRead(topicId) {
    try {
        const readTopics = JSON.parse(localStorage.getItem('readTopics') || '[]');
        return readTopics.includes(topicId);
    } catch (e) {
        return false;
    }
}

// O'qildi belgisini yangilash
function updateReadIndicator(topicId) {
    const indicator = document.getElementById('read-indicator');
    if (indicator) {
        indicator.style.display = 'flex';
        indicator.innerHTML = '<span style="color: #16a34a; font-weight: 600;">✓ O\'qildi</span>';
    }
}

// Progress foizini hisoblash va ko'rsatish
function updateProgress() {
    try {
        const readTopics = JSON.parse(localStorage.getItem('readTopics') || '[]');
        const totalTopics = 11; // HTML mavzulari soni
        const progress = Math.round((readTopics.length / totalTopics) * 100);
        
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (progressText) {
            progressText.textContent = `${readTopics.length}/${totalTopics} mavzu o'qildi (${progress}%)`;
        }
    } catch (e) {
        console.error('Progress yangilashda xatolik:', e);
    }
}

// Reading progress - sahifa o'qilgan foizini ko'rsatish
function initReadingProgress() {
    // Progress bar allaqachon mavjud bo'lsa, qayta yaratmaymiz
    if (document.getElementById('reading-progress')) return;
    
    const progressContainer = document.createElement('div');
    progressContainer.id = 'reading-progress';
    
    // Header balandligini hisobga olamiz
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    progressContainer.style.cssText = `
        position: fixed;
        top: ${headerHeight}px;
        left: 0;
        width: 100%;
        height: 4px;
        background: rgba(0,0,0,0.1);
        z-index: 1001;
        pointer-events: none;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #2563eb 0%, #16a34a 100%);
        transition: width 0.15s ease-out;
        box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
    `;
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    function updateReadingProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Progress hisoblash
        const scrollableHeight = documentHeight - windowHeight;
        const progress = scrollableHeight > 0 
            ? Math.min(100, Math.round((scrollTop / scrollableHeight) * 100))
            : 0;
        
        progressBar.style.width = progress + '%';
    }
    
    // Scroll event listener
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateReadingProgress();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Resize event listener - header balandligi o'zgarganda
    window.addEventListener('resize', function() {
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;
        progressContainer.style.top = headerHeight + 'px';
    });
    
    // Dastlabki progress
    updateReadingProgress();
}

// Keyboard shortcuts - tezkor navigatsiya
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K - qidiruv (keyingi bosqichda)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Qidiruv funksiyasi keyingi bosqichda
        }
        
        // ← va → tugmalar - oldingi/keyingi mavzuga o'tish
        if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
            const prevLink = document.querySelector('.nav-prev');
            if (prevLink) {
                prevLink.click();
            }
        }
        
        if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
            const nextLink = document.querySelector('.nav-next');
            if (nextLink) {
                nextLink.click();
            }
        }
        
        // Home - yuqoriga qaytish
        if (e.key === 'Home' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Back to top button
function initBackToTop() {
    const button = document.createElement('button');
    button.id = 'back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Yuqoriga qaytish');
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #2563eb;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        transition: all 0.3s ease;
    `;
    
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.6)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
    });
    
    button.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
}

// Table of Contents (TOC) yaratish
function initTableOfContents() {
    // Bosh sahifada, kirish sahifalarida va testlar sahifasida TOC yaratmaymiz
    const path = (location.pathname || '').replace(/\\/g, '/');
    if (path === '/' || 
        path.endsWith('/index.html') && !path.includes('/html/') && !path.includes('/css/') && !path.includes('/javascript/') && !path.includes('/react/') && !path.includes('/git/') ||
        path.includes('/1-kirish.html') ||
        path.includes('/tests.html') ||
        path.includes('/test-')) {
        return;
    }
    
    const headings = document.querySelectorAll('h2, h3');
    if (headings.length < 2) return;
    
    const toc = document.createElement('div');
    toc.id = 'table-of-contents';
    toc.style.cssText = `
        width: 100%;
        max-width: 100%;
        padding: 20px;
        background: #f9fafb;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        margin-bottom: 24px;
        box-sizing: border-box;
        display: block;
    `;
    
    toc.innerHTML = '<h3 style="margin-top: 0; margin-bottom: 16px; color: #1e40af; font-size: 18px; font-weight: 700; text-align: center; padding-bottom: 12px; border-bottom: 2px solid #e5e7eb;">📑 Mavzu tarkibi</h3><ul style="list-style: none; padding: 0; margin: 0;"></ul>';
    const tocList = toc.querySelector('ul');
    
    headings.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        if (!heading.id) heading.id = id;
        
        const li = document.createElement('li');
        li.style.marginBottom = '8px';
        
        const a = document.createElement('a');
        a.href = '#' + id;
        a.textContent = heading.textContent;
        a.style.cssText = `
            color: ${heading.tagName === 'H2' ? '#1e40af' : '#6b7280'};
            text-decoration: none;
            font-size: ${heading.tagName === 'H2' ? '15px' : '14px'};
            font-weight: ${heading.tagName === 'H2' ? '600' : '400'};
            padding-left: ${heading.tagName === 'H3' ? '20px' : '0'};
            padding: ${heading.tagName === 'H2' ? '8px 12px' : '6px 12px 6px 32px'};
            display: block;
            transition: all 0.2s ease;
            line-height: 1.5;
            border-radius: 6px;
            border-left: ${heading.tagName === 'H2' ? '3px solid #2563eb' : 'none'};
        `;
        
        a.addEventListener('mouseenter', function() {
            this.style.color = '#2563eb';
            this.style.backgroundColor = '#eff6ff';
            this.style.transform = 'translateX(4px)';
        });
        
        a.addEventListener('mouseleave', function() {
            this.style.color = heading.tagName === 'H2' ? '#1e40af' : '#6b7280';
            this.style.backgroundColor = 'transparent';
            this.style.transform = 'translateX(0)';
        });
        
        a.addEventListener('click', function(e) {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        
        li.appendChild(a);
        tocList.appendChild(li);
    });
    
    // TOC'ni h1 dan keyin qo'shish
    const mainContent = document.querySelector('.detail-section') || document.querySelector('main');
    if (mainContent) {
        const h1 = mainContent.querySelector('h1');
        if (h1 && h1.nextSibling) {
            // h1 dan keyin qo'shamiz
            mainContent.insertBefore(toc, h1.nextSibling);
        } else if (h1) {
            // h1 dan keyin, lekin nextSibling yo'q bo'lsa
            h1.parentNode.insertBefore(toc, h1.nextSibling);
        } else if (mainContent.firstChild) {
            // h1 topilmasa, boshiga qo'shamiz
            mainContent.insertBefore(toc, mainContent.firstChild);
        } else {
            mainContent.appendChild(toc);
        }
    }
}

// Barcha funksiyalarni ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    // Reading progress - o'chirilgan
    // initReadingProgress();
    
    // Keyboard shortcuts
    initKeyboardShortcuts();
    
    // Back to top
    initBackToTop();
    
    // Table of Contents
    initTableOfContents();
    
    // Progress tracking - joriy sahifani o'qilgan deb belgilash
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    if (currentPage && currentPage !== 'index') {
        markTopicAsRead(currentPage);
    }
    
    // Progress yangilash
    updateProgress();
});
