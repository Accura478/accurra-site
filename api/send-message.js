export default async function handler(req, res) {
    // Разрешаем только POST запросы (когда форма отправляет данные)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, phone, message } = req.body;

    // Шаг 2: Простейшая проверка данных (валидация)
    if (!name || !phone) {
        return res.status(400).json({ message: 'Имя и телефон обязательны' });
    }

    // Эти переменные мы настроим в панели Vercel чуть позже
    const token = process.env.TG_TOKEN;
    const chatId = process.env.CHAT_ID;
    
    const text = `🚀 *Nowe zgłoszenie!*\n\n👤 *Imię:* ${name}\n📞 *Telefon:* ${phone}\n💬 *Wiadomość:* ${message || 'Brak'}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: chatId, 
                text: text,
                parse_mode: 'Markdown' // Чтобы имя и телефон были жирными в телеграме
            })
        });

        if (response.ok) {
            return res.status(200).json({ message: 'Success' });
        } else {
            return res.status(500).json({ message: 'Błąd API Telegram' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}
