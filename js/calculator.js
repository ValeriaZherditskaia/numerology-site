// ============================================================
// js/calculator.js
// ============================================================
// Расчёт нумерологических кодов: ФИО, дата рождения, телефон, имя
// ============================================================

import { LETTER_TO_NUMBER } from './config.js';
import {
    wordToDigits,
    sumDigits,
    getPairs,
    splitByTwo,
    removePairs,
    removeDuplicates,
    sortNumbersAsc,
    reduceToSingle
} from './helpers.js';

// ============================================================
// 1. РАСЧЁТ ПО ФИО
// ============================================================

function calculateWord(word) {
    if (!word) return null;
    const digits = wordToDigits(word, LETTER_TO_NUMBER);
    if (!digits.length) return null;

    const unique = removePairs(digits);
    const code = unique.join('');
    const codeSum = sumDigits(unique);
    const allPrograms = removeDuplicates([...digits, ...getPairs(digits)]);
    const selfView = code.length ? [code[0], ...splitByTwo(code.slice(1))] : [];
    const envView = splitByTwo(code);
    const totalSum = sumDigits(digits);

    return {
        digits,
        unique,
        code,
        codeSum,
        allPrograms,
        selfView,
        envView,
        totalSum
    };
}

function calculateFio(lastname, firstname, patronymic) {
    const data = {
        фамилия: lastname ? calculateWord(lastname) : null,
        имя: firstname ? calculateWord(firstname) : null,
        отчество: patronymic ? calculateWord(patronymic) : null
    };

    const filled = Object.keys(data).filter(k => data[k] !== null);
    if (!filled.length) return { error: 'Заполните хотя бы одно поле!' };

    const result = {};

    result['1_коды'] = {};
    result['1_суммы'] = {};
    for (let i = 0; i < filled.length; i++) {
        const k = filled[i];
        result['1_коды'][k] = data[k].code || '0';
        result['1_суммы'][k] = data[k].codeSum || 0;
    }

    result['2_программы'] = {};
    for (let j = 0; j < filled.length; j++) {
        const key = filled[j];
        result['2_программы'][key] = data[key].allPrograms || [];
    }

    result['3_сам'] = {};
    for (let a = 0; a < filled.length; a++) {
        const k2 = filled[a];
        result['3_сам'][k2] = data[k2].selfView || [];
    }

    result['4_окр'] = {};
    for (let b = 0; b < filled.length; b++) {
        const k3 = filled[b];
        result['4_окр'][k3] = data[k3].envView || [];
    }

    result['5_общие'] = {};
    for (let c = 0; c < filled.length; c++) {
        const k4 = filled[c];
        result['5_общие'][k4] = data[k4].totalSum || 0;
    }

    let totalSumAll = 0;
    for (let d = 0; d < filled.length; d++) {
        totalSumAll += data[filled[d]].totalSum;
    }
    result['6_ПСК'] = Math.floor(totalSumAll / filled.length);

    let codeSumAll = 0;
    for (let e = 0; e < filled.length; e++) {
        codeSumAll += data[filled[e]].codeSum;
    }
    result['7_РК'] = codeSumAll;

    let allCodes = '';
    const nameKeys = ['фамилия', 'имя', 'отчество'];
    for (let f = 0; f < nameKeys.length; f++) {
        const k5 = nameKeys[f];
        if (data[k5]) allCodes += data[k5].code;
    }
    const ktArr = removePairs(allCodes.split(''));
    const kt = ktArr.join('');
    result['8_КТ'] = kt || '0';

    result['9_сам_по_КТ'] = kt.length ? [kt[0], ...splitByTwo(kt.slice(1))] : ['0'];
    result['10_окр_по_КТ'] = kt.length ? splitByTwo(kt) : ['0'];

    const earth = removePairs(('317954' + kt).split('')).join('');
    result['11_код_земли'] = earth || '0';
    result['12_сумма_земли'] = sumDigits(earth.split('')) || 0;
    result['13_суб_земли'] = earth.length ? [earth[0], ...splitByTwo(earth.slice(1))] : ['0'];
    result['14_об_земли'] = earth.length ? splitByTwo(earth) : ['0'];

    const money = removePairs(('5341' + kt).split('')).join('');
    result['15_код_денег'] = money || '0';
    result['16_сумма_денег'] = sumDigits(money.split('')) || 0;
    result['17_суб_денег'] = money.length ? [money[0], ...splitByTwo(money.slice(1))] : ['0'];
    result['18_об_денег'] = money.length ? splitByTwo(money) : ['0'];

    const mission = removePairs(('56' + kt).split('')).join('');
    result['19_код_миссии'] = mission || '0';
    result['20_сумма_миссии'] = sumDigits(mission.split('')) || 0;
    result['21_суб_миссии'] = mission.length ? [mission[0], ...splitByTwo(mission.slice(1))] : ['0'];
    result['22_об_миссии'] = mission.length ? splitByTwo(mission) : ['0'];

    return result;
}

// ============================================================
// 2. РАСЧЁТ ПО ДАТЕ РОЖДЕНИЯ
// ============================================================

function calculateDate(day, month, year) {
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
        return { error: 'Введите корректную дату!' };
    }

    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
        return { error: 'Введите корректный день и месяц!' };
    }

    if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
        return { error: 'Введите корректный год (1900-текущий)!' };
    }

    const dayReduced = reduceToSingle(dayNum);
    const monthReduced = reduceToSingle(monthNum);
    const yearSum = String(yearNum).split('').reduce((s, d) => s + parseInt(d), 0);
    const yearReduced = reduceToSingle(yearSum);

    let total = dayReduced + monthReduced + yearReduced;
    let finalCode = reduceToSingle(total);
    if (finalCode === 0 && total !== 0) finalCode = 9;

    return {
        day: dayNum,
        month: monthNum,
        year: yearNum,
        dayReduced,
        monthReduced,
        yearReduced,
        finalCode,
        dateStr: String(dayNum).padStart(2, '0') + '.' + String(monthNum).padStart(2, '0') + '.' + yearNum
    };
}

// ============================================================
// 3. РАСЧЁТ ПО ИМЕНИ
// ============================================================

function calculateName(name) {
    if (!name) return { error: 'Введите имя!' };

    const digits = wordToDigits(name, LETTER_TO_NUMBER);
    if (!digits.length) return { error: 'Имя не содержит букв!' };

    // 1. КОД СЛОВА — удаляем ПАРЫ
    const codeDigits = removePairs(digits);
    const code = codeDigits.join('') || '0';
    const codeSum = sumDigits(codeDigits);

    // 2. КАК ВИДИТ СЕБЯ — первая цифра + остальные по 2
    const selfView = [];
    if (code.length > 0 && code !== '0') {
        selfView.push(code[0]);
        const rest = code.slice(1);
        const pairs = splitByTwo(rest);
        for (let p = 0; p < pairs.length; p++) {
            selfView.push(pairs[p]);
        }
    } else {
        selfView.push('0');
    }

    // 3. КАК ВИДЯТ ДРУГИЕ — разбивка кода по 2, затем сортировка по возрастанию
    const envView = code !== '0' ? sortNumbersAsc(splitByTwo(code)) : ['0'];

    // 4. ОБЩАЯ ПРОГРАММА — сумма всех цифр имени (не кода!)
    const totalSum = sumDigits(digits);

    // 5. ВСЕ ПРОГРАММЫ — уникальные цифры + соседние пары, сортировка по возрастанию
    const allPrograms = removeDuplicates([...digits, ...getPairs(digits)]);
    const sortedPrograms = sortNumbersAsc(allPrograms);

    return {
        digits,
        codeDigits,
        code,
        codeSum,
        selfView,
        envView,
        totalSum,
        allPrograms: sortedPrograms
    };
}

// ============================================================
// 4. РАСЧЁТ ПО ТЕЛЕФОНУ (заглушка)
// ============================================================

function calculatePhone(phone) {
    const cleaned = String(phone).replace(/\D/g, '');
    if (cleaned.length !== 11) {
        return { error: 'Введите 11 цифр номера телефона!' };
    }
    const digits = cleaned.split('').map(Number);
    const sum = digits.reduce((s, d) => s + d, 0);
    const finalCode = reduceToSingle(sum);
    return { phone: cleaned, sum, finalCode };
}

// ============================================================
// 5. ЭКСПОРТЫ
// ============================================================

export const calculateAll = calculateFio;
export { calculateFio, calculateDate, calculateName, calculatePhone };