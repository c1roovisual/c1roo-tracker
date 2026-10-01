export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { uid, name, pid, jid } = req.query;

    if (!uid || !name) {
        return res.status(400).json({ error: 'Missing params: uid & name required' });
    }

    const webhookURL = process.env.DISCORD_WEBHOOK;

    if (!webhookURL) {
        return res.status(500).json({ error: 'Webhook not configured' });
    }

    const embed = {
        embeds: [{
            title: "🟢 c1roo Script Loaded",
            color: 0x00d9ff,
            fields: [
                { name: "Username", value: name, inline: true },
                { name: "User ID", value: String(uid), inline: true },
                { name: "Place ID", value: String(pid || "—"), inline: true },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "c1roo/ch Universal" }
        }]
    };

    try {
        await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embed)
        });
    } catch (e) {
        console.error('Failed to send webhook:', e);
    }

    res.status(200).json({ ok: true, message: 'Tracked', user: name });
}
