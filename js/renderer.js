// ============================================================
// js/renderer.js
// ============================================================
// Рендеринг результатов для админ-панели (с таблицами)
// ============================================================

import {
    BLOCKS_CONFIG,
    SECTION_IDS,
    SECTION_LABELS,
    getValueFromSource
} from './config.js';

import { getNumberData, getNumberDataDate } from './database.js';
import { sortNumbersAsc } from './helpers.js';

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

// ---- Таблица с одним значением (с Тенью) ----
function renderSingleValueWithMinus(number) {
    const numStr = String(number);
    const numberData = getNumberData(numStr);
    const contextText = numberData.core || 'Описание будет добавлено позже.';
    const minusText = numberData.minus || '';

    let minusHtml = '';
    if (minusText && minusText !== 'Описание будет добавлено позже.') {
        minusHtml = '<span class="minus-text"><span class="label">Тень:</span> ' + minusText + '</span>';
    }

    return '<table class="result-table">' +
        '<thead><tr><th>ЦИФРА</th><th>ЗНАЧЕНИЕ</th></tr></thead>' +
        '<tbody>' +
        '<tr><td class="num">' + numStr + '</td>' +
        '<td><span class="value">' + contextText + '</span>' +
        minusHtml +
        '</td></tr>' +
        '</tbody></table>';
}

// ---- Таблица с несколькими значениями (с Тенью) ----
function renderNumberTableWithMinus(numbers, contextKey) {
    if (!numbers || numbers.length === 0) {
        return '<div class="error-message show">Нет данных</div>';
    }

    let rows = '';
    for (let i = 0; i < numbers.length; i++) {
        const num = numbers[i];
        const numStr = String(num);
        const numberData = getNumberData(numStr);
        const contextText = numberData[contextKey] || 'Описание будет добавлено позже.';
        const minusText = numberData.minus || '';

        let minusHtml = '';
        if (minusText && minusText !== 'Описание будет добавлено позже.') {
            minusHtml = '<span class="minus-text"><span class="label">Тень:</span> ' + minusText + '</span>';
        }

        rows += '<tr><td class="num">' + numStr + '</td>' +
            '<td><span class="value">' + contextText + '</span>' +
            minusHtml +
            '</td></tr>';
    }

    return '<table class="result-table">' +
        '<thead><tr><th>ЦИФРА</th><th>ЗНАЧЕНИЕ</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table>';
}

// ============================================================
// 1. РЕНДЕР ДЛЯ ФИО
// ============================================================

export function renderFioResult(data) {
    if (data.error) {
        return '<div class="error-message show">' + data.error + '</div>';
    }

    let html = '';

    const MULTI_SOURCES = [
        'self_view', 'others_view', 'self_view_by_kt', 'others_view_by_kt',
        'earth_subjective', 'earth_objective',
        'money_subjective', 'money_objective',
        'mission_subjective', 'mission_objective'
    ];

    for (let b = 0; b < BLOCKS_CONFIG.length; b++) {
        const block = BLOCKS_CONFIG[b];
        const sectionId = SECTION_IDS[block.id];
        const sectionTitle = SECTION_LABELS[block.id] || block.title;
        let cardsHtml = '';
        let hasContent = false;

        const showMinus = block.id !== 'mission';

        for (let s = 0; s < block.sources.length; s++) {
            const sourceKey = block.sources[s];
            const value = getValueFromSource(data, sourceKey);
            if (!value) continue;

            let numbers = [];
            if (Array.isArray(value)) {
                if (value.length === 0) continue;
                numbers = value;
            } else {
                numbers = [String(value)];
                if (numbers[0] === '0' || numbers[0] === '') continue;
            }

            hasContent = true;

            const sourceLabels = {
                'code_lastname': 'Код фамилии',
                'code_firstname': 'Код имени',
                'code_patronymic': 'Код отчества',
                'self_view': 'Как вы видите себя',
                'others_view': 'Как вас видят другие',
                'self_view_by_kt': 'Как себя видит по КТ',
                'others_view_by_kt': 'Как видят окружение по КТ',
                'rk': 'Рабочий код (РК)',
                'earth_general': 'Общая программа Земли',
                'earth_subjective': 'Субъективная реальность',
                'earth_objective': 'Объективная реальность',
                'money_general': 'Общая программа Денег',
                'money_subjective': 'Субъективная реальность',
                'money_objective': 'Объективная реальность',
                'mission_general': 'Общая программа Миссии',
                'mission_subjective': 'Субъективная реальность',
                'mission_objective': 'Объективная реальность'
            };

            const displayLabel = sourceLabels[sourceKey] || sourceKey;
            const isMulti = MULTI_SOURCES.indexOf(sourceKey) !== -1;
            const contextKey = block.context;

            const sortedNumbers = sortNumbersAsc(numbers);

            let rows = '';
            for (let n = 0; n < sortedNumbers.length; n++) {
                const num = sortedNumbers[n];
                const numStr = String(num);
                const numberData = getNumberData(numStr);
                const contextText = numberData[contextKey] || 'Описание будет добавлено позже.';

                let minusHtml = '';
                if (showMinus) {
                    const minusText = numberData.minus || '';
                    if (minusText && minusText !== 'Описание будет добавлено позже.') {
                        minusHtml = '<span class="minus-text"><span class="label">Тень:</span> ' + minusText + '</span>';
                    }
                }

                rows += '<tr>';
                rows += '<td class="num">' + numStr + '</td>';
                rows += '<td>';
                rows += '<span class="value">' + contextText + '</span>';
                if (minusHtml) rows += minusHtml;
                rows += '</td>';
                rows += '</tr>';
            }

            let contentHtml = '';
            contentHtml += '<table class="result-table">';
            contentHtml += '<thead><tr><th>ЦИФРА</th><th>ЗНАЧЕНИЕ</th></tr></thead>';
            contentHtml += '<tbody>' + rows + '</tbody>';
            contentHtml += '</table>';

            cardsHtml += '<div class="admin-result-card">';
            cardsHtml += '<div class="result-card-header">';
            cardsHtml += '<span class="result-card-tag">' + displayLabel + '</span>';
            cardsHtml += '</div>';
            cardsHtml += contentHtml;
            cardsHtml += '</div>';
        }

        if (hasContent) {
            html += '<div class="admin-section-group" id="' + sectionId + '">';
            html += '<div class="section-header">';
            html += '<h2 class="section-group-title">' + block.icon + ' ' + sectionTitle + '</h2>';
            html += '<p class="section-description">' + block.description + '</p>';
            html += '</div>';
            html += '<div class="admin-cards-stack">' + cardsHtml + '</div>';
            html += '</div>';
        }
    }

    html += '<div class="spravochnik-link-wrapper">';
    html += '<a href="/spravochnik.html" class="spravochnik-link">📖 Посмотреть все цифры в справочнике</a>';
    html += '</div>';

    return html || '<div class="error-message show">Нет данных для отображения</div>';
}

// ============================================================
// 2. РЕНДЕР ДЛЯ ДАТЫ РОЖДЕНИЯ
// ============================================================

export function renderDateResult(dateData) {
    if (dateData.error) {
        return '<div class="error-message show">' + dateData.error + '</div>';
    }

    let html = '<div class="mission-intro">';
    html += '<h3>🌱 Миссия души</h3>';
    html += '<p>Миссия души — это не конечная точка, а путь. Мы все пришли в этот мир с кодами, которые отражают наши энергии, но память о себе нам стирают.</p>';
    html += '<p><strong>Чтобы встать на миссию:</strong> познакомиться с душой → узнать, что нравится → соединиться с духом → начать действовать → использовать свои коды.</p>';
    html += '<p class="closing">Миссия души — это ваш путь, а не чужой сценарий.</p>';
    html += '</div>';

    html += '<div class="date-digits-row">';
    html += '<div class="date-digit-item"><span class="date-digit">' + dateData.dayReduced + '</span><span class="date-digit-label">День</span></div>';
    html += '<div class="date-digit-item"><span class="date-digit">' + dateData.monthReduced + '</span><span class="date-digit-label">Месяц</span></div>';
    html += '<div class="date-digit-item"><span class="date-digit">' + dateData.yearReduced + '</span><span class="date-digit-label">Год</span></div>';
    html += '<div class="date-digit-item date-digit-mission"><span class="date-digit">' + dateData.finalCode + '</span><span class="date-digit-label">Миссия</span></div>';
    html += '</div>';

    const cards = [
        { num: dateData.dayReduced, label: 'День' },
        { num: dateData.monthReduced, label: 'Месяц' },
        { num: dateData.yearReduced, label: 'Год' },
        { num: dateData.finalCode, label: 'Миссия', isMission: true }
    ];

    html += '<div class="date-cards-grid">';

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const numStr = String(card.num);
        const data = getNumberDataDate(numStr);
        const isMission = card.isMission || false;

        let cardClass = 'date-card';
        if (isMission) cardClass += ' date-card-mission';

        html += '<div class="' + cardClass + '">';
        html += '<div class="date-card-number">' + numStr + '</div>';
        html += '<div class="date-card-title">' + data.title + '</div>';
        html += '<div class="date-card-divider"></div>';

        html += '<div class="date-card-core">' + data.core + '</div>';

        if (data.strength) {
            const strengthLines = data.strength.split('\n');
            html += '<div class="date-card-section">';
            html += '<div class="date-card-section-label">💪 Сила:</div>';
            html += '<ul class="date-card-list">';
            for (let j = 0; j < strengthLines.length; j++) {
                if (strengthLines[j].trim()) {
                    html += '<li>' + strengthLines[j].trim() + '</li>';
                }
            }
            html += '</ul>';
            html += '</div>';
        }

        if (data.minus) {
            html += '<div class="date-card-section date-card-minus">';
            html += '<div class="date-card-section-label">🌑 Тень:</div>';
            html += '<p class="date-card-text">' + data.minus + '</p>';
            html += '</div>';
        }

        if (data.main_task) {
            html += '<div class="date-card-section date-card-main-task">';
            html += '<div class="date-card-section-label">⭐ Главная задача цифры:</div>';
            html += '<p class="date-card-text">' + data.main_task + '</p>';
            html += '</div>';
        }

        html += '</div>';
    }

    html += '</div>';

    html += '<div class="how-to-read">';
    html += '<h4>📖 Как читать этот код</h4>';
    html += '<p>Первые три числа (' + dateData.dayReduced + dateData.monthReduced + dateData.yearReduced + ') описывают ваши базовые энергии и способы реализации (в том числе в деньгах). Четвёртое число (' + dateData.finalCode + ') — направление, к которому они ведут — ваша миссия.</p>';
    html += '<p>Смысл не в каждой цифре отдельно, а в их сочетании. Ваша задача — научиться соединять эти качества и переводить их из минуса в плюс.</p>';
    html += '<p><strong>Все 4 цифры даны в минусе изначально.</strong></p>';
    html += '<p>Эти коды рекомендуется выписать и осознанно применять в жизни, наблюдая за изменениями и новыми возможностями.</p>';
    html += '</div>';

    return html;
}

// ============================================================
// 3. РЕНДЕР ДЛЯ ИМЕНИ (с Тенью)
// ============================================================

export function renderNameResult(data) {
    if (data.error) {
        return '<div class="error-message show">' + data.error + '</div>';
    }

    let html = '';

    // ---- 1. КОД ИМЕНИ (только сумма) ----
    html += '<div class="admin-section-group">';
    html += '<div class="section-header">';
    html += '<h2 class="section-group-title">📛 КОД ИМЕНИ</h2>';
    html += '</div>';
    html += '<div class="admin-cards-stack">';
    html += '<div class="admin-result-card">';
    html += '<div class="result-card-header">';
    html += '<span class="result-card-tag">Сумма кода</span>';
    html += '</div>';
    html += renderSingleValueWithMinus(String(data.codeSum));
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // ---- 2. КАК ВЫ ВИДИТЕ СЕБЯ ----
    html += '<div class="admin-section-group">';
    html += '<div class="section-header">';
    html += '<h2 class="section-group-title">🪞 КАК ВЫ ВИДИТЕ СЕБЯ</h2>';
    html += '</div>';
    html += '<div class="admin-cards-stack">';
    html += renderNumberTableWithMinus(data.selfView, 'personality');
    html += '</div>';
    html += '</div>';

    // ---- 3. КАК ВАС ВИДЯТ ДРУГИЕ ----
    html += '<div class="admin-section-group">';
    html += '<div class="section-header">';
    html += '<h2 class="section-group-title">👥 КАК ВАС ВИДЯТ ДРУГИЕ</h2>';
    html += '</div>';
    html += '<div class="admin-cards-stack">';
    html += renderNumberTableWithMinus(data.envView, 'personality');
    html += '</div>';
    html += '</div>';

    // ---- 4. ОБЩАЯ ПРОГРАММА ----
    html += '<div class="admin-section-group">';
    html += '<div class="section-header">';
    html += '<h2 class="section-group-title">📊 ОБЩАЯ ПРОГРАММА</h2>';
    html += '</div>';
    html += '<div class="admin-cards-stack">';
    html += renderSingleValueWithMinus(String(data.totalSum));
    html += '</div>';
    html += '</div>';

    // ---- 5. ВСЕ ПРОГРАММЫ ----
    html += '<div class="admin-section-group">';
    html += '<div class="section-header">';
    html += '<h2 class="section-group-title">🌀 ВСЕ ПРОГРАММЫ</h2>';
    html += '</div>';
    html += '<div class="admin-cards-stack">';
    html += renderNumberTableWithMinus(data.allPrograms, 'core');
    html += '</div>';
    html += '</div>';

    html += '<div class="spravochnik-link-wrapper">';
    html += '<a href="/spravochnik.html" class="spravochnik-link">📖 Посмотреть все цифры в справочнике</a>';
    html += '</div>';

    return html || '<div class="error-message show">Нет данных для отображения</div>';
}

// ============================================================
// ЭКСПОРТ
// ============================================================

export const renderResults = renderFioResult;