// ============================================================
// js/config.js
// ============================================================
// Конфигурация: буквы, блоки, маппинг источников
// ============================================================

import { getNumberData } from './database.js';

// ============================================================
// 1. НУМЕРОЛОГИЧЕСКАЯ ТАБЛИЦА
// ============================================================

export const LETTER_TO_NUMBER = {
    'А': '1', 'Б': '2', 'В': '3', 'Г': '4', 'Д': '5', 'Е': '6', 'Ё': '7', 'Ж': '8', 'З': '9',
    'И': '1', 'Й': '2', 'К': '3', 'Л': '4', 'М': '5', 'Н': '6', 'О': '7', 'П': '8', 'Р': '9',
    'С': '1', 'Т': '2', 'У': '3', 'Ф': '4', 'Х': '5', 'Ц': '6', 'Ч': '7', 'Ш': '8', 'Щ': '9',
    'Ъ': '1', 'Ы': '2', 'Ь': '3', 'Э': '4', 'Ю': '5', 'Я': '6'
};

// ============================================================
// 2. КОНТЕКСТЫ (для БД)
// ============================================================

export const CONTEXT_LABELS = {
    core: 'Ядро',
    personality: 'Личность',
    energy: 'Энергия',
    earth: 'Земля',
    money: 'Деньги',
    mission: 'Миссия',
    minus: 'Тень'
};

export const CONTEXT_ICONS = {
    core: '💎',
    personality: '🪞',
    energy: '⚡',
    earth: '🌍',
    money: '💰',
    mission: '🌟',
    minus: '🌑'
};

// ============================================================
// 3. КОНФИГ БЛОКОВ ДЛЯ ФИО
// ============================================================

export const BLOCKS_CONFIG = [
    {
        id: 'roots',
        title: 'КОРНИ',
        icon: '🌱',
        context: 'core',
        description: 'Родовые коды — энергия фамилии, имени и отчества.',
        sources: ['code_lastname', 'code_firstname', 'code_patronymic']
    },
    {
        id: 'self',
        title: 'САМООЩУЩЕНИЕ',
        icon: '🪞',
        context: 'personality',
        description: 'Как вы видите себя и как вас видят другие.',
        sources: ['self_view', 'others_view', 'self_view_by_kt', 'others_view_by_kt']
    },
    {
        id: 'energy',
        title: 'ЭНЕРГИЯ',
        icon: '⚡',
        context: 'energy',
        description: 'Ваш рабочий ритм и жизненная сила.',
        sources: ['rk']
    },
    {
        id: 'earth',
        title: 'ЗЕМЛЯ',
        icon: '🌍',
        context: 'earth',
        description: 'Ваша связь с миром, зона комфорта и общество.',
        sources: ['earth_general', 'earth_subjective', 'earth_objective']
    },
    {
        id: 'money',
        title: 'ДЕНЬГИ',
        icon: '💰',
        context: 'money',
        description: 'Ваш финансовый поток и отношение к ресурсам.',
        sources: ['money_general', 'money_subjective', 'money_objective']
    },
    {
        id: 'mission',
        title: 'МИССИЯ',
        icon: '🌟',
        context: 'mission',
        description: 'Ваше предназначение и главный жизненный урок.',
        sources: ['mission_general', 'mission_subjective', 'mission_objective']
    }
];

// ============================================================
// 4. МАППИНГ ИСТОЧНИКОВ ДАННЫХ
// ============================================================

export const SOURCE_MAPPING = {
    'code_lastname': { label: 'Код фамилии', key: '1_суммы', field: 'фамилия' },
    'code_firstname': { label: 'Код имени', key: '1_суммы', field: 'имя' },
    'code_patronymic': { label: 'Код отчества', key: '1_суммы', field: 'отчество' },
    'self_view': { label: 'Как вы видите себя', key: '3_сам' },
    'others_view': { label: 'Как вас видят другие', key: '4_окр' },
    'self_view_by_kt': { label: 'Как себя видит по КТ', key: '9_сам_по_КТ' },
    'others_view_by_kt': { label: 'Как видят окружение по КТ', key: '10_окр_по_КТ' },
    'rk': { label: 'Рабочий код (РК)', key: '7_РК' },
    'earth_general': { label: 'Общая программа Земли', key: '12_сумма_земли' },
    'earth_subjective': { label: 'Субъективная реальность', key: '13_суб_земли' },
    'earth_objective': { label: 'Объективная реальность', key: '14_об_земли' },
    'money_general': { label: 'Общая программа Денег', key: '16_сумма_денег' },
    'money_subjective': { label: 'Субъективная реальность', key: '17_суб_денег' },
    'money_objective': { label: 'Объективная реальность', key: '18_об_денег' },
    'mission_general': { label: 'Общая программа Миссии', key: '20_сумма_миссии' },
    'mission_subjective': { label: 'Субъективная реальность', key: '21_суб_миссии' },
    'mission_objective': { label: 'Объективная реальность', key: '22_об_миссии' }
};

/**
 * Получить значение из результата по источнику
 */
export function getValueFromSource(data, sourceKey) {
    const mapping = SOURCE_MAPPING[sourceKey];
    if (!mapping) return null;

    // Для самовосприятия и восприятия другими (включая КТ)
    if (sourceKey === 'self_view' || sourceKey === 'others_view' ||
        sourceKey === 'self_view_by_kt' || sourceKey === 'others_view_by_kt') {
        const allValues = [];
        const keys = ['фамилия', 'имя', 'отчество'];

        for (const key of keys) {
            const val = data[mapping.key]?.[key];
            if (val && Array.isArray(val)) {
                for (const item of val) {
                    allValues.push(String(item));
                }
            } else if (val && !Array.isArray(val)) {
                allValues.push(String(val));
            }
        }

        const unique = [];
        const seen = new Set();
        for (const item of allValues) {
            if (!seen.has(item)) {
                seen.add(item);
                unique.push(item);
            }
        }

        return unique.length > 0 ? unique : null;
    }

    // Для кодов фамилии/имени/отчества
    if (mapping.field) {
        const val = data[mapping.key]?.[mapping.field];
        return val !== undefined && val !== null ? String(val) : null;
    }

    // Для остальных
    const val = data[mapping.key];
    if (Array.isArray(val)) return val;
    return val !== undefined && val !== null ? String(val) : null;
}

// ============================================================
// 5. СЕКЦИИ (для навигации)
// ============================================================

export const SECTION_LABELS = {
    roots: 'КОРНИ',
    self: 'САМООЩУЩЕНИЕ',
    energy: 'ЭНЕРГИЯ',
    earth: 'ЗЕМЛЯ',
    money: 'ДЕНЬГИ',
    mission: 'МИССИЯ'
};

export const SECTION_ORDER = ['roots', 'self', 'energy', 'earth', 'money', 'mission'];

export const SECTION_IDS = {
    roots: 'section-roots',
    self: 'section-self',
    energy: 'section-energy',
    earth: 'section-earth',
    money: 'section-money',
    mission: 'section-mission'
};

// ============================================================
// 6. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

export function getNumberDataWithFallback(number) {
    return getNumberData(number);
}