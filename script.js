// Main Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initDailyQuotes();
    initContactForm();
    initScrollAnimations();
    initMobileMenu();
    updateCurrentYear();
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
    if (!activeTabFound) setActiveTab(tabs[0]);

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

// ==================== Contact Form System ====================
function initContactForm() {
    const form = document.getElementById('whatsapp-form');
    const roleOptions = document.querySelectorAll('.role-option');
    const messageInput = document.getElementById('message');
    const charCounter = document.getElementById('char-counter');
    const copyBtn = document.getElementById('copy-message');
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
        charCounter.textContent = length > 500 ? '500' : length;
        if (length > 500) this.value = this.value.substring(0, 500);
        updatePreview();
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        sendWhatsAppMessage();
    });

    copyBtn?.addEventListener('click', copyMessageToClipboard);
    document.getElementById('name')?.addEventListener('input', updatePreview);
    updatePreview();
}

function setActiveRole(role) {
    const roleOptions = document.querySelectorAll('.role-option');
    const roleInput = document.getElementById('role');
    roleOptions.forEach(option => option.classList.toggle('active', option.getAttribute('data-role') === role));
    if (roleInput) roleInput.value = role;
}

function updatePreview() {
    const name = document.getElementById('name')?.value || '[Name]';
    const role = document.getElementById('role')?.value || '[Role]';
    const message = document.getElementById('message')?.value || '[Message]';
    const preview = `Assalamu Alaikum, ${name} here (${role}). ${message} Jazakumullahu Khairan.`;
    document.getElementById('preview-text').textContent = preview;
}

// ==================== WhatsApp Redirect Function ====================
function sendWhatsAppMessage() {
    const name = document.getElementById('name')?.value;
    const role = document.getElementById('role')?.value;
    const message = document.getElementById('message')?.value;

    if (!name || !message) return showNotification('Please fill in all required fields', 'error');

    const fullMessage = `Assalamu Alaikum, ${name} here (${role}). ${message} Jazakumullahu Khairan.`;
    const encodedMessage = encodeURIComponent(fullMessage);

    const presidentNumber = '233548787551'; // without '+'
    // Automatic redirect to WhatsApp Web/App
    window.location.href = `https://wa.me/${presidentNumber}?text=${encodedMessage}`;
}

// ==================== Copy to Clipboard ====================
function copyMessageToClipboard() {
    const text = document.getElementById('preview-text')?.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text)
        .then(() => showNotification('Message copied to clipboard!', 'success'))
        .catch(() => showNotification('Failed to copy message', 'error'));
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
        padding: 1rem 1.5rem; border-radius: var(--border-radius);
        box-shadow: var(--shadow); display:flex; align-items:center; gap:0.75rem; z-index:10000;
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
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
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
        if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
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

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', function(e){
        e.preventDefault();
        const target=document.querySelector(this.getAttribute('href'));
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
                img.src=img.dataset.src;
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