/**
 * Netlify Function: приём заявки с сайта и отправка в Telegram.
 *
 * Адрес: POST /api/order  (JSON: { name, phone, color, lang, company })
 *
 * Переменные окружения (Netlify → Site configuration → Environment variables):
 *   TG_BOT_TOKEN — токен бота от @BotFather
 *   TG_CHAT_ID   — id чата, куда слать заявки
 * Если переменные не заданы — функция работает в демо-режиме:
 * заявка проходит проверку и возвращает успех, но никуда не отправляется.
 */

const COLORS = {
    silver: 'Silver',
    dark: 'Deep Purple',
    gold: 'Gold',
    black: 'Space Black',
};

const json = (status, body) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });

const esc = s =>
    String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export default async req => {
    if (req.method !== 'POST') {
        return json(405, { ok: false, error: 'method' });
    }

    let data;
    try {
        data = await req.json();
    } catch {
        return json(400, { ok: false, error: 'bad_request' });
    }

    // Ловушка для ботов: скрытое поле, которое человек не заполняет
    if (data.company) {
        return json(200, { ok: true });
    }

    const name = String(data.name ?? '').trim().slice(0, 60);
    const phone = String(data.phone ?? '').trim();
    const color = String(data.color ?? '').trim();
    const lang = String(data.lang ?? '').slice(0, 2);

    if (name.length < 2) {
        return json(422, { ok: false, error: 'name' });
    }
    if (!/^[0-9+\-\s()]{7,20}$/.test(phone) || phone.replace(/\D/g, '').length < 7) {
        return json(422, { ok: false, error: 'phone' });
    }
    if (color && !COLORS[color]) {
        return json(422, { ok: false, error: 'color' });
    }

    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    if (!token || !chatId) {
        console.warn('[order] demo mode: TG_BOT_TOKEN / TG_CHAT_ID are not set');
        return json(200, { ok: true, demo: true });
    }

    const text = [
        '<b>🛒 Нова заявка з сайту</b>',
        `<b>Ім'я:</b> ${esc(name)}`,
        `<b>Телефон:</b> ${esc(phone)}`,
        color && `<b>Колір:</b> ${COLORS[color]}`,
        lang && `<b>Мова сторінки:</b> ${esc(lang)}`,
    ].filter(Boolean).join('\n');

    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, parse_mode: 'HTML', text }),
        });
        if (!res.ok) {
            console.error('[order] telegram error', res.status, await res.text());
            return json(502, { ok: false, error: 'send' });
        }
    } catch (err) {
        console.error('[order] network error', err);
        return json(502, { ok: false, error: 'send' });
    }

    return json(200, { ok: true });
};

export const config = { path: '/api/order' };
