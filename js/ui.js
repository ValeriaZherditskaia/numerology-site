// ============================================================
// js/ui.js
// ============================================================
// Интерактивность: модальное окно, навигация, переключатель темы
// ============================================================

import { CONTEXT_LABELS, CONTEXT_ICONS, getNumberDataWithFallback } from './config.js';
import { SECTION_IDS, SECTION_LABELS, SECTION_ORDER } from './config.js';

// ============================================================
// 1. МОДАЛЬНОЕ ОКНО ДЛЯ ЦИФРЫ
// ============================================================

export function showNumberCard(number) {
    const data = getNumberDataWithFallback(number);

    const oldModal = document.querySelector('.number-modal-overlay');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.className = 'number-modal-overlay visible';

    const contexts = ['core', 'personality', 'energy', 'earth', 'money', 'mission', 'minus'];
    const contextColors = {
        core: 'gold',
        personality: 'silver',
        energy: 'orange',
        earth: 'green',
        money: 'gold-light',
        mission: 'purple',
        minus: 'dark'
    };

    let contextsHtml = '';
    for (const key of contexts) {
        const label = CONTEXT_LABELS[key] || key;
        const icon = CONTEXT_ICONS[key] || '';
        const text = data[key] || 'Описание будет добавлено позже.';
        const colorClass = contextColors[key] || '';

        contextsHtml += '<div class="modal-context ' + colorClass + '">';
        contextsHtml += '<div class="modal-context-header">';
        contextsHtml += '<span class="modal-context-icon">' + icon + '</span>';
        contextsHtml += '<span class="modal-context-label">' + label + '</span>';
        contextsHtml += '</div>';
        contextsHtml += '<p class="modal-context-text">' + text + '</p>';
        contextsHtml += '</div>';
    }

    modal.innerHTML = '';
    modal.innerHTML += '<div class="number-modal">';
    modal.innerHTML += '<button class="modal-close">&times;</button>';
    modal.innerHTML += '<div class="modal-number">' + number + '</div>';
    modal.innerHTML += '<div class="modal-content">' + contextsHtml + '</div>';
    modal.innerHTML += '</div>';

    document.body.appendChild(modal);

    // Закрытие по крестику
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
    }

    // Закрытие по клику на оверлей
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Закрытие по Escape
    function handleEscape(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.number-modal-overlay');
            if (openModal) openModal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    }
    document.addEventListener('keydown', handleEscape);
}

// ============================================================
// 2. ПРИКРЕПЛЕНИЕ СЛУШАТЕЛЕЙ К ЦИФРАМ
// ============================================================

export function attachNumberListeners() {
    const elements = document.querySelectorAll('.result-digit, .minus-number');
    elements.forEach(function(el) {
        el.addEventListener('click', function() {
            const number = this.dataset.number || this.textContent.trim();
            showNumberCard(number);
        });
    });
}

// ============================================================
// 3. НАВИГАЦИЯ "ДОРОЖНАЯ КАРТА"
// ============================================================

let roadmapInitialized = false;

export function initRoadmap() {
    generateRoadmap();
    const hasResults = document.querySelectorAll('.section-group').length > 0;
    toggleRoadmap(hasResults);
    if (hasResults) {
        initRoadmapHighlight();
    }
}

function generateRoadmap() {
    const nav = document.getElementById('roadmapList');
    if (!nav) return;

    nav.innerHTML = '';

    const sections = SECTION_ORDER.concat(['shadow']);

    sections.forEach(function(key, index) {
        const sectionId = SECTION_IDS[key] || 'section-shadow';
        const label = SECTION_LABELS[key] || 'ТЕНЬ';

        const li = document.createElement('li');
        li.className = 'roadmap-item';
        if (index === 0) li.classList.add('active');
        li.dataset.section = sectionId;

        const marker = document.createElement('span');
        marker.className = 'roadmap-marker';

        const link = document.createElement('a');
        link.href = '#' + sectionId;
        link.textContent = label;

        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById(sectionId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            const items = document.querySelectorAll('.roadmap-item');
            items.forEach(function(item) {
                item.classList.remove('active');
            });
            li.classList.add('active');
        });

        li.appendChild(marker);
        li.appendChild(link);
        nav.appendChild(li);
    });

    roadmapInitialized = true;
}

function toggleRoadmap(show) {
    const nav = document.getElementById('roadmapNav');
    if (!nav) return;

    if (show) {
        nav.style.display = 'block';
        requestAnimationFrame(function() {
            nav.classList.add('visible');
        });
    } else {
        nav.classList.remove('visible');
        setTimeout(function() {
            nav.style.display = 'none';
        }, 600);
    }
}

function initRoadmapHighlight() {
    const sectionGroups = document.querySelectorAll('.section-group');
    const navItems = document.querySelectorAll('.roadmap-item');

    if (sectionGroups.length === 0 || navItems.length === 0) return;

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navItems.forEach(function(item) {
                    if (item.dataset.section === sectionId) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    sectionGroups.forEach(function(group) {
        observer.observe(group);
    });
}

// ============================================================
// 4. ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
// ============================================================

export function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    toggle.checked = savedTheme === 'light';

    toggle.addEventListener('change', function() {
        const theme = this.checked ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

// ============================================================
// 5. МОБИЛЬНАЯ НАВИГАЦИЯ
// ============================================================

export function generateMobileNav() {
    const container = document.querySelector('.container');
    if (!container) return;

    const existing = document.querySelector('.mobile-nav');
    if (existing) existing.remove();

    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';

    const sections = SECTION_ORDER.concat(['shadow']);

    let html = '<details><summary>📋 Навигация по коду</summary><ul>';

    for (const key of sections) {
        const sectionId = SECTION_IDS[key] || 'section-shadow';
        const label = SECTION_LABELS[key] || 'ТЕНЬ';
        html += '<li><a href="#' + sectionId + '">' + label + '</a></li>';
    }

    html += '</ul></details>';

    mobileNav.innerHTML = html;

    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.after(mobileNav);
    } else {
        container.appendChild(mobileNav);
    }

    const links = mobileNav.querySelectorAll('a');
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const details = mobileNav.querySelector('details');
                if (details) details.open = false;
            }
        });
    });
}