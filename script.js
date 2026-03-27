// ==================== Main Application ====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initDailyQuotes();
    initContactForm();
    initScrollAnimations();
    initMobileMenu();
    updateCurrentYear();
    initSMSSubscription();
});

// ==================== Navigation System ====================
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const slider = document.querySelector('.nav-slider');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (!tabs.length || !slider) return;

    function setActiveTab(tab) {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        moveSlider(tab);
    }

    // Set active tab based on current page
    let activeTabFound = false;
    tabs.forEach(tab => {
        const tabPage = tab.getAttribute('href');
        if (tabPage === currentPage || (currentPage === '' && tabPage === 'index.html')) {
            setActiveTab(tab);
            activeTabFound = true;
        }
    });
    if (!activeTabFound && tabs.length) setActiveTab(tabs[0]);

    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            if (this.classList.contains('active')) return;
            setActiveTab(this);
            setTimeout(() => {
                window.location.href = this.getAttribute('href');
            }, 250);
        });
    });

    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.nav-tab.active');
        if (activeTab) moveSlider(activeTab);
    });

    const activeTab = document.querySelector('.nav-tab.active');
    if (activeTab) moveSlider(activeTab);
}

function moveSlider(tab) {
    const slider = document.querySelector('.nav-slider');
    if (!slider || !tab) return;
    const tabRect = tab.getBoundingClientRect();
    const containerRect = tab.parentElement.getBoundingClientRect();
    slider.style.width = `${tabRect.width}px`;
    slider.style.transform = `translateX(${tabRect.left - containerRect.left}px)`;
    slider.style.transition = 'all 0.25s ease';
}

// ==================== Daily Quotes System ====================
const islamicQuotes = [
    { text: "The best among you are those who have the best manners and character.", ref: "Prophet Muhammad (ﷺ)" },
    { text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", ref: "Sahih al-Bukhari" },
    { text: "Verily, with hardship comes ease.", ref: "Qur'an 94:5" },
    { text: "Do not lose hope, nor be sad.", ref: "Qur'an 3:139" },
    { text: "The strong believer is better and more beloved to Allah than the weak believer.", ref: "Sahih Muslim" },
    { text: "Allah does not burden a soul beyond that it can bear.", ref: "Qur'an 2:286" },
    { text: "Kindness is a mark of faith, and whoever is not kind has no faith.", ref: "Sahih Muslim" },
    { text: "The most perfect believer in faith is the one who is best in character.", ref: "Sunan al-Tirmidhi" },
    { text: "And whoever relies upon Allah – then He is sufficient for him.", ref: "Qur'an 65:3" },
    { text: "Spread the salaam, feed the hungry, and pray at night when people are sleeping.", ref: "Sunan Ibn Majah" }
];
let currentQuoteIndex = 0;

function initDailyQuotes() {
    const quoteText = document.getElementById('daily-quote');
    const quoteRef = document.getElementById('quote-ref');
    const prevBtn = document.getElementById('prev-quote');
    const nextBtn = document.getElementById('next-quote');
    if (!quoteText || !quoteRef) return;
    currentQuoteIndex = Math.floor(Math.random() * islamicQuotes.length);
    updateQuoteDisplay();
    prevBtn?.addEventListener('click', showPreviousQuote);
    nextBtn?.addEventListener('click', showNextQuote);
    setInterval(showNextQuote, 30000);
}

function showPreviousQuote() {
    currentQuoteIndex = (currentQuoteIndex - 1 + islamicQuotes.length) % islamicQuotes.length;
    updateQuoteDisplay();
}

function showNextQuote() {
    currentQuoteIndex = (currentQuoteIndex + 1) % islamicQuotes.length;
    updateQuoteDisplay();
}

function updateQuoteDisplay() {
    const quote = islamicQuotes[currentQuoteIndex];
    const quoteText = document.getElementById('daily-quote');
    const quoteRef = document.getElementById('quote-ref');
    if (!quoteText || !quoteRef) return;

    quoteText.style.opacity = '0';
    quoteRef.style.opacity = '0';

    setTimeout(() => {
        quoteText.textContent = `"${quote.text}"`;
        quoteRef.textContent = `— ${quote.ref}`;
        quoteText.style.opacity = '1';
        quoteRef.style.opacity = '1';
    }, 300);
}

// ==================== SMS Subscription - Google Sheets Integration ====================
// YOUR GOOGLE SHEETS WEB APP URL (CONFIRMED WORKING)
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbz89Q5m2mxo6ic295YRVdLk1jkspwKFxtOxSpnIK2dmp37_h-Z72D0wCqUEh6r1tgUW/exec';

function initSMSSubscription() {
    const smsForm = document.getElementById('sms-subscribe-form');
    if (!smsForm) return;

    smsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('subscriber-name')?.value.trim();
        const phone = document.getElementById('subscriber-phone')?.value.trim();
        const role = document.getElementById('subscriber-role')?.value;
        const agreed = document.getElementById('subscribe-agree')?.checked;
        
        // Validation
        if (!name) {
            showSMSMessage('Please enter your full name', 'error');
            return;
        }
        
        if (!phone) {
            showSMSMessage('Please enter your phone number', 'error');
            return;
        }
        
        // Basic Ghana phone number validation (10 digits starting with 0)
        const phoneRegex = /^0[2-9][0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            showSMSMessage('Please enter a valid Ghana phone number (e.g., 024XXXXXXX)', 'error');
            return;
        }
        
        if (!agreed) {
            showSMSMessage('Please agree to receive SMS updates', 'error');
            return;
        }
        
        // Prepare data for Google Sheets
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('role', role);
        formData.append('source', 'GMSA Website');
        formData.append('timestamp', new Date().toISOString());
        
        // Show loading state
        const submitBtn = document.getElementById('sms-submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitBtn.disabled = true;
        
        // Send to Google Sheets
        fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        })
        .then(() => {
            // With 'no-cors', we can't read the response, but if no error, assume success
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            showSMSMessage('✅ Successfully subscribed! You will receive updates via SMS.', 'success');
            smsForm.reset();
            saveToLocalBackup(name, phone, role);
        })
        .catch(error => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            console.error('Error:', error);
            showSMSMessage('⚠️ Subscription failed. Please try again later.', 'error');
            // Still save locally as backup
            saveToLocalBackup(name, phone, role);
        });
    });
}

// Backup function to save locally if Google Sheets fails
function saveToLocalBackup(name, phone, role) {
    let subscribers = JSON.parse(localStorage.getItem('gmsa_subscribers_backup') || '[]');
    // Check if already exists
    const exists = subscribers.find(s => s.phone === phone);
    if (!exists) {
        subscribers.push({
            name: name,
            phone: phone,
            role: role,
            subscribedAt: new Date().toISOString()
        });
        localStorage.setItem('gmsa_subscribers_backup', JSON.stringify(subscribers));
        console.log('📱 Saved to local backup. Total subscribers:', subscribers.length);
    }
}

// Function to export all subscribers (run in browser console: exportSubscribers())
window.exportSubscribers = function() {
    const subscribers = JSON.parse(localStorage.getItem('gmsa_subscribers_backup') || '[]');
    if (subscribers.length === 0) {
        console.log('No subscribers found in local backup');
        alert('No subscribers found. Please subscribe first.');
        return;
    }
    
    // Create CSV content
    let csvContent = 'Name,Phone,Role,Subscribed At\n';
    subscribers.forEach(sub => {
        csvContent += `"${sub.name}","${sub.phone}","${sub.role}","${sub.subscribedAt}"\n`;
    });
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'gmsa_subscribers.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`📥 Exported ${subscribers.length} subscribers to CSV`);
    alert(`Exported ${subscribers.length} subscribers to CSV file.`);
};

// View subscribers in console (run: viewSubscribers())
window.viewSubscribers = function() {
    const subscribers = JSON.parse(localStorage.getItem('gmsa_subscribers_backup') || '[]');
    console.table(subscribers);
    return subscribers;
};

function showSMSMessage(message, type) {
    const messageDiv = document.getElementById('sms-message');
    if (!messageDiv) return;
    
    messageDiv.textContent = message;
    messageDiv.className = `sms-message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
        messageDiv.className = 'sms-message';
    }, 5000);
}

// ==================== Contact Form System ====================
function initContactForm() {
    const form = document.getElementById('whatsapp-form');
    const roleOptions = document.querySelectorAll('.role-option');
    const messageInput = document.getElementById('message');
    const charCounter = document.getElementById('char-counter');
    if (!form) return;

    setActiveRole('Student');

    roleOptions.forEach(option => {
        option.addEventListener('click', function() {
            setActiveRole(this.getAttribute('data-role'));
            updatePreview();
        });
    });

    messageInput?.addEventListener('input', function() {
        const length = this.value.length;
        if (charCounter) charCounter.textContent = length > 500 ? '500' : length;
        if (length > 500) this.value = this.value.substring(0, 500);
        updatePreview();
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        sendWhatsAppMessage();
    });

    document.getElementById('name')?.addEventListener('input', updatePreview);
    updatePreview();
}

function setActiveRole(role) {
    const roleOptions = document.querySelectorAll('.role-option');
    const roleInput = document.getElementById('role');
    roleOptions.forEach(option => {
        if (option.getAttribute('data-role') === role) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    if (roleInput) roleInput.value = role;
}

function updatePreview() {
    const name = document.getElementById('name')?.value || '[Name]';
    const role = document.getElementById('role')?.value || '[Role]';
    const message = document.getElementById('message')?.value || '[Message]';
    const preview = `Assalamu Alaikum, ${name} here (${role}). ${message} Jazakumullahu Khairan.`;
    const previewBox = document.getElementById('preview-text');
    if (previewBox) previewBox.textContent = preview;
}

// ==================== WhatsApp Redirect Function ====================
function sendWhatsAppMessage() {
    const name = document.getElementById('name')?.value;
    const role = document.getElementById('role')?.value;
    const message = document.getElementById('message')?.value;

    if (!name || !message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const fullMessage = `Assalamu Alaikum, ${name} here (${role}). ${message} Jazakumullahu Khairan.`;
    const encodedMessage = encodeURIComponent(fullMessage);
    const presidentNumber = '233548787551';
    
    window.location.href = `https://wa.me/${presidentNumber}?text=${encodedMessage}`;
}

// ==================== Notifications ====================
function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':'exclamation-circle'}"></i><span>${message}</span>`;
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px; 
        background: ${type==='success'?'#d4edda':'#f8d7da'};
        color: ${type==='success'?'#155724':'#721c24'};
        padding: 1rem 1.5rem; border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1); display:flex; align-items:center; gap:0.75rem; z-index:10000;
        border-left:4px solid ${type==='success'?'#28a745':'#dc3545'};
        animation: slideIn 0.3s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}
        @keyframes slideOut {from{transform:translateX(0);opacity:1;}to{transform:translateX(100%);opacity:0;}}
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ==================== Scroll Animations ====================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) entry.target.classList.add('visible'); 
        });
    }, { threshold:0.1, rootMargin:'0px 0px -100px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    let lastScroll = 0;
    const nav = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        if (!nav) return;
        const currentScroll = window.pageYOffset;
        nav.style.background = currentScroll>100?'rgba(255,255,255,0.98)':'rgba(255,255,255,0.95)';
        nav.style.boxShadow = currentScroll>100?'0 5px 20px rgba(0,0,0,0.1)':'var(--shadow)';
        nav.style.transform = (currentScroll>lastScroll && currentScroll>200)?'translateY(-100%)':'translateY(0)';
        lastScroll = currentScroll;
    });
}

// ==================== Mobile Menu ====================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    if (!menuBtn || !mobileNav) return;

    menuBtn.addEventListener('click', () => {
        const expanded = menuBtn.getAttribute('aria-expanded')==='true';
        menuBtn.setAttribute('aria-expanded', !expanded);
        mobileNav.style.display = expanded?'none':'block';
        menuBtn.innerHTML = expanded?'<i class="fas fa-bars"></i>':'<i class="fas fa-times"></i>';
    });

    mobileLinks.forEach(link => link.addEventListener('click', () => {
        mobileNav.style.display='none';
        menuBtn.setAttribute('aria-expanded','false');
        menuBtn.innerHTML='<i class="fas fa-bars"></i>';
    }));

    document.addEventListener('click', e => {
        if (mobileNav && menuBtn && !mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileNav.style.display='none';
            menuBtn.setAttribute('aria-expanded','false');
            menuBtn.innerHTML='<i class="fas fa-bars"></i>';
        }
    });
}

// ==================== Utilities ====================
function updateCurrentYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', function(e){
        const href = this.getAttribute('href');
        if (href === '#' || href === '#') return;
        e.preventDefault();
        const target=document.querySelector(href);
        if(!target) return;
        const navHeight=document.querySelector('.main-nav')?.offsetHeight||0;
        window.scrollTo({top:target.offsetTop-navHeight,behavior:'smooth'});
    });
});

// ==================== Image Lazy Loading ====================
if('IntersectionObserver' in window){
    const imgObserver=new IntersectionObserver((entries,obs)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                const img=entry.target;
                if (img.dataset.src) {
                    img.src=img.dataset.src;
                }
                img.classList.add('loaded');
                obs.unobserve(img);
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img=>imgObserver.observe(img));
}

document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('img:not([src=""])').forEach(img=>{
        if(!img.complete){
            img.classList.add('loading');
            img.addEventListener('load',()=>{img.classList.remove('loading'); img.classList.add('loaded');});
            img.addEventListener('error',()=>{img.classList.remove('loading'); img.alt='Image failed to load';});
        }
    });
});