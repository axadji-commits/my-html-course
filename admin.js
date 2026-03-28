// Admin panel funksiyalari

// Sahifa yuklanganda tekshirish
window.addEventListener('DOMContentLoaded', function() {
    // Admin kirish tekshiruvi
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'admin.html';
        return;
    }
    
    // Ma'lumotlarni yuklash
    loadAdminData();
});

// Admin ma'lumotlarini yuklash
function loadAdminData() {
    const saqlanganNatijalar = localStorage.getItem('testNatijalari');
    let barchaNatijalar = [];
    
    if (saqlanganNatijalar) {
        try {
            barchaNatijalar = JSON.parse(saqlanganNatijalar);
        } catch (e) {
            console.error('Ma\'lumotlarni o\'qishda xato:', e);
            barchaNatijalar = [];
        }
    }
    
    // Statistikalarni yangilash
    updateStatistics(barchaNatijalar);
    
    // Jadvalni to'ldirish
    displayResults(barchaNatijalar);
}

// Statistikalarni yangilash
function updateStatistics(natijalar) {
    const totalTests = natijalar.length;
    
    // O'rtacha ball
    let totalScore = 0;
    if (natijalar.length > 0) {
        natijalar.forEach(function(natija) {
            totalScore += natija.foiz || 0;
        });
        totalScore = Math.round(totalScore / natijalar.length);
    }
    
    // Foydalanuvchilar soni (unique)
    const uniqueUsers = new Set();
    natijalar.forEach(function(natija) {
        const userKey = (natija.ism || '') + ' ' + (natija.familiya || '');
        if (userKey.trim()) {
            uniqueUsers.add(userKey.trim());
        }
    });
    
    // Bugungi testlar
    const today = new Date().toDateString();
    const todayTests = natijalar.filter(function(natija) {
        if (!natija.sana) return false;
        const natijaSana = new Date(natija.sana).toDateString();
        return natijaSana === today;
    }).length;
    
    // DOM'ga yozish
    document.getElementById('totalTests').textContent = totalTests;
    document.getElementById('averageScore').textContent = totalScore + '%';
    document.getElementById('totalUsers').textContent = uniqueUsers.size;
    document.getElementById('todayTests').textContent = todayTests;
}

// Natijalarni ko'rsatish
function displayResults(natijalar) {
    const tbody = document.getElementById('resultsTableBody');
    if (!tbody) return;
    
    if (natijalar.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="admin-no-data">❌ Hozircha test natijalari yo\'q</td></tr>';
        return;
    }
    
    // Teskari tartibda (eng yangisi birinchi)
    const sortedNatijalar = natijalar.slice().reverse();
    
    let html = '';
    sortedNatijalar.forEach(function(natija, index) {
        const testTuri = natija.testTuri || 'Noma\'lum';
        const badgeClass = testTuri === 'HTML' ? 'badge-html' : 
                          testTuri === 'CSS' ? 'badge-css' : 
                          testTuri === 'JavaScript' ? 'badge-js' : '';
        
        const sana = natija.sanaKorishishi || natija.sana || 'Noma\'lum';
        const foiz = natija.foiz || 0;
        const score = natija.score || 0;
        const total = natija.total || 0;
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${natija.ism || 'Noma\'lum'}</td>
                <td>${natija.familiya || 'Noma\'lum'}</td>
                <td><span class="admin-badge ${badgeClass}">${testTuri}</span></td>
                <td>${score} / ${total}</td>
                <td><strong>${foiz}%</strong></td>
                <td>${sana}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Filtrlash
let allResults = [];

function filterResults() {
    // Barcha natijalarni olish
    const saqlanganNatijalar = localStorage.getItem('testNatijalari');
    if (saqlanganNatijalar) {
        try {
            allResults = JSON.parse(saqlanganNatijalar);
        } catch (e) {
            allResults = [];
        }
    }
    
    // Filtrlarni olish
    const testTypeFilter = document.getElementById('filterTestType').value;
    const scoreFilter = document.getElementById('filterScore').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    
    // Filtrlash
    let filteredResults = allResults.filter(function(natija) {
        // Test turi bo'yicha
        if (testTypeFilter && natija.testTuri !== testTypeFilter) {
            return false;
        }
        
        // Ball bo'yicha
        if (scoreFilter) {
            const foiz = natija.foiz || 0;
            if (scoreFilter === 'high' && foiz < 75) return false;
            if (scoreFilter === 'medium' && (foiz < 50 || foiz >= 75)) return false;
            if (scoreFilter === 'low' && foiz >= 50) return false;
        }
        
        // Qidirish bo'yicha
        if (searchQuery) {
            const ism = (natija.ism || '').toLowerCase();
            const familiya = (natija.familiya || '').toLowerCase();
            if (!ism.includes(searchQuery) && !familiya.includes(searchQuery)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Statistikalarni yangilash
    updateStatistics(filteredResults);
    
    // Jadvalni yangilash
    displayResults(filteredResults);
}

// CSV yuklab olish
function exportToCSV() {
    const saqlanganNatijalar = localStorage.getItem('testNatijalari');
    let barchaNatijalar = [];
    
    if (saqlanganNatijalar) {
        try {
            barchaNatijalar = JSON.parse(saqlanganNatijalar);
        } catch (e) {
            alert('Ma\'lumotlarni o\'qishda xato!');
            return;
        }
    }
    
    if (barchaNatijalar.length === 0) {
        alert('Eksport qilish uchun ma\'lumotlar yo\'q!');
        return;
    }
    
    // CSV matnini yaratish
    let csv = '\uFEFF'; // UTF-8 BOM (Excel uchun)
    csv += '№,Ism,Familiya,Test turi,Ball,To\'g\'ri javoblar,Jami savollar,Foiz,Sana\n';
    
    barchaNatijalar.reverse().forEach(function(natija, index) {
        const row = [
            index + 1,
            natija.ism || '',
            natija.familiya || '',
            natija.testTuri || '',
            natija.score || 0,
            natija.score || 0,
            natija.total || 0,
            natija.foiz || 0,
            natija.sanaKorishishi || natija.sana || ''
        ];
        
        // CSV formatida (vergul bilan ajratilgan, qo'shtirnoq ichida)
        csv += row.map(function(cell) {
            return '"' + String(cell).replace(/"/g, '""') + '"';
        }).join(',') + '\n';
    });
    
    // Faylni yuklab olish
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'admin_test_natijalari_' + new Date().toISOString().split('T')[0] + '.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Admin chiqish
function adminLogout() {
    if (confirm('Admin paneldan chiqmoqchimisiz?')) {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin.html';
    }
}

