// ============================================================
// js/main.js
// ============================================================
// Точка входа: инициализация, обработчики событий
// ============================================================

import { calculateAll } from './calculator.js';
import { renderResults } from './renderer.js';
import { attachNumberListeners, initRoadmap, generateMobileNav, initThemeToggle } from './ui.js';

// ---- DOM-элементы ----
let lastnameInput, firstnameInput, patronymicInput;
let calculateBtn, clearBtn;
let resultsSection, resultsContent, errorMessage;

// ---- Инициализация ----
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Квантовый код личности загружен');

    // Получаем элементы
    lastnameInput = document.getElementById('lastname');
    firstnameInput = document.getElementById('firstname');
    patronymicInput = document.getElementById('patronymic');
    calculateBtn = document.getElementById('calculateBtn');
    clearBtn = document.getElementById('clearBtn');
    resultsSection = document.getElementById('results');
    resultsContent = document.getElementById('resultsContent');
    errorMessage = document.getElementById('errorMessage');

    if (!lastnameInput || !firstnameInput || !patronymicInput ||
        !calculateBtn || !clearBtn || !resultsSection ||
        !resultsContent || !errorMessage) {
        console.error('❌ Не все DOM-элементы найдены!');
        return;
    }

    // Инициализация темы
    initThemeToggle();

    // Настраиваем обработчики
    setupEventListeners();

    // Первоначальная проверка полей
    checkFields();

    // ---- Кнопка "Админ" ----
    const adminBtn = document.getElementById('adminToggleBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }
});

// ---- Настройка обработчиков событий ----
function setupEventListeners() {
    const inputs = [lastnameInput, firstnameInput, patronymicInput];
    inputs.forEach(input => {
        input.addEventListener('input', checkFields);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (!calculateBtn.disabled) calculate();
            }
        });
    });

    calculateBtn.addEventListener('click', calculate);
    clearBtn.addEventListener('click', clearAll);
}

// ---- Проверка заполнения полей ----
function checkFields() {
    const lastname = lastnameInput.value.trim();
    const firstname = firstnameInput.value.trim();

    const hasRequired = lastname !== '' && firstname !== '';

    if (hasRequired) {
        calculateBtn.classList.add('active');
        calculateBtn.disabled = false;
        calculateBtn.style.opacity = '1';
        calculateBtn.style.pointerEvents = 'auto';
    } else {
        calculateBtn.classList.remove('active');
        calculateBtn.disabled = true;
        calculateBtn.style.opacity = '0.3';
        calculateBtn.style.pointerEvents = 'none';
    }
}

// ---- Расчёт ----
function calculate() {
    const lastname = lastnameInput.value.trim();
    const firstname = firstnameInput.value.trim();
    const patronymic = patronymicInput.value.trim();

    if (!lastname || !firstname) {
        errorMessage.textContent = '❌ Пожалуйста, заполните фамилию и имя!';
        errorMessage.classList.add('show');
        resultsSection.style.display = 'none';
        return;
    }

    errorMessage.classList.remove('show');
    errorMessage.textContent = '';

    const result = calculateAll(lastname, firstname, patronymic || '');

    if (result.error) {
        errorMessage.textContent = '❌ ' + result.error;
        errorMessage.classList.add('show');
        resultsSection.style.display = 'none';
        return;
    }

    resultsContent.innerHTML = renderResults(result);
    resultsSection.style.display = 'block';

    initRoadmap();
    generateMobileNav();
    attachNumberListeners();

    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- Очистка ----
function clearAll() {
    lastnameInput.value = '';
    firstnameInput.value = '';
    patronymicInput.value = '';
    resultsSection.style.display = 'none';
    resultsContent.innerHTML = '';
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    calculateBtn.classList.remove('active');
    calculateBtn.disabled = true;
    calculateBtn.style.opacity = '0.3';
    calculateBtn.style.pointerEvents = 'none';
    lastnameInput.focus();

    const nav = document.getElementById('roadmapNav');
    if (nav) {
        nav.classList.remove('visible');
        setTimeout(() => {
            nav.style.display = 'none';
        }, 600);
    }

    const modal = document.querySelector('.number-modal-overlay');
    if (modal) modal.remove();

    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) mobileNav.remove();
}