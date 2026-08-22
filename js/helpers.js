// ============================================================
// js/helpers.js
// ============================================================
// Вспомогательные функции (чистые, без побочных эффектов)
// ============================================================

// ---- Редукция числа до однозначного (0–9) ----
export function reduceToSingle(num) {
    let result = parseInt(num);
    if (isNaN(result)) return 0;
    while (result > 9) {
        result = String(result).split('').reduce((s, d) => s + parseInt(d), 0);
    }
    return result;
}

// ---- Сортировка чисел по возрастанию ----
export function sortNumbersAsc(numbers) {
    return [...numbers].sort((a, b) => {
        const numA = parseInt(String(a).replace(/\D/g, ''));
        const numB = parseInt(String(b).replace(/\D/g, ''));
        return numA - numB;
    });
}

// ---- Преобразование слова в цифры ----
export function wordToDigits(word, table) {
    word = word.toUpperCase();
    const digits = [];
    for (let i = 0; i < word.length; i++) {
        const ch = word[i];
        if (table[ch]) digits.push(table[ch]);
    }
    return digits;
}

// ---- Сумма цифр в массиве ----
export function sumDigits(arr) {
    return arr.reduce((s, d) => s + parseInt(d), 0);
}

// ---- Получение соседних пар ----
export function getPairs(arr) {
    const pairs = [];
    for (let i = 0; i < arr.length - 1; i++) {
        pairs.push(arr[i] + arr[i + 1]);
    }
    return pairs;
}

// ---- Разбивка строки по 2 символа ----
export function splitByTwo(str) {
    const result = [];
    for (let i = 0; i < str.length; i += 2) {
        result.push(i + 1 < str.length ? str[i] + str[i + 1] : str[i]);
    }
    return result;
}

// ---- Удаление дублей (простое) ----
export function removeDuplicates(arr) {
    return [...new Set(arr)];
}

// ---- Удаление пар одинаковых цифр (ключевой алгоритм) ----
export function removePairs(arr) {
    const remaining = arr.slice();
    const result = [];
    let i = 0;
    while (i < remaining.length) {
        const current = remaining[i];
        let found = -1;
        for (let j = i + 1; j < remaining.length; j++) {
            if (remaining[j] === current) {
                found = j;
                break;
            }
        }
        if (found === -1) {
            result.push(current);
            i++;
        } else {
            remaining.splice(found, 1);
            remaining.splice(i, 1);
        }
    }
    return result;
}

// ---- Числовая сортировка ----
export function sortNumbers(arr) {
    if (!Array.isArray(arr)) return arr;
    return arr.slice().sort((a, b) => {
        const numA = parseInt(String(a).replace(/\s/g, ''));
        const numB = parseInt(String(b).replace(/\s/g, ''));
        return numA - numB;
    });
}

// ---- Объединение значений из нескольких полей с удалением дублей ----
export function combineValues(data, field, keys) {
    const allValues = [];
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const val = data[field]?.[key];
        if (val && val !== '0' && val !== '') {
            if (Array.isArray(val)) {
                allValues.push(...val);
            } else {
                allValues.push(val);
            }
        }
    }
    return removeDuplicates(allValues);
}

// ---- Объединение простых чисел с удалением дублей ----
export function combineSimpleValues(data, field, keys) {
    const allValues = [];
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const val = data[field]?.[key];
        if (val && val !== 0 && val !== '0') {
            allValues.push(String(val));
        }
    }
    return removeDuplicates(allValues);
}

// ---- Преобразование строки в массив цифр ----
export function stringToDigits(str) {
    if (!str) return [];
    return str.replace(/\s/g, '').split('').map(Number).filter(n => !isNaN(n));
}

// ---- Проверка, является ли значение числом ----
export function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

// ---- Форматирование числа с ведущим нулём ----
export function padZero(num, length = 2) {
    return String(num).padStart(length, '0');
}

// ---- Получение уникальных значений из массива с сохранением порядка ----
export function uniqueOrdered(arr) {
    const seen = new Set();
    return arr.filter(item => {
        const key = String(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

// ---- Разбивка массива на чанки ----
export function chunkArray(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

// ---- Перемешивание массива (фишер-йетс) ----
export function shuffleArray(arr) {
    const result = arr.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// ---- Получение случайного элемента из массива ----
export function randomItem(arr) {
    if (!arr || !arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

// ---- Проверка на пустой объект ----
export function isEmptyObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length === 0;
}

// ---- Глубокое копирование объекта ----
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// ---- Безопасное получение значения по пути ----
export function safeGet(obj, path, defaultValue) {
    const keys = path.split('.');
    let result = obj;
    for (let i = 0; i < keys.length; i++) {
        if (result === undefined || result === null) return defaultValue;
        result = result[keys[i]];
    }
    return result === undefined ? defaultValue : result;
}

// ---- Ограничение числа в диапазоне ----
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// ---- Проверка на простое число ----
export function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// ---- Цифровой корень (альтернатива reduceToSingle) ----
export function digitalRoot(num) {
    const str = String(num);
    if (str.length === 1) return parseInt(num);
    const sum = str.split('').reduce((s, d) => s + parseInt(d), 0);
    return digitalRoot(sum);
}

// ---- Проверка на палиндром ----
export function isPalindrome(str) {
    const clean = String(str).replace(/\s/g, '').toLowerCase();
    return clean === clean.split('').reverse().join('');
}

// ---- Разбивка числа на цифры ----
export function digitsOf(num) {
    return String(num).split('').map(Number);
}

// ---- Соединение массива цифр в число ----
export function joinDigits(arr) {
    return parseInt(arr.join('')) || 0;
}

// ============================================================
// ЭКСПОРТ ПО УМОЛЧАНИЮ
// ============================================================

export default {
    wordToDigits,
    sumDigits,
    getPairs,
    splitByTwo,
    removeDuplicates,
    removePairs,
    sortNumbers,
    sortNumbersAsc,
    combineValues,
    combineSimpleValues,
    reduceToSingle,
    stringToDigits,
    isNumber,
    padZero,
    uniqueOrdered,
    chunkArray,
    shuffleArray,
    randomItem,
    isEmptyObject,
    deepClone,
    safeGet,
    clamp,
    isPrime,
    digitalRoot,
    isPalindrome,
    digitsOf,
    joinDigits
};