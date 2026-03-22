const SHEET_URL = "https://script.google.com/macros/s/AKfycbzDsYVIgQ5r1EhLG4_7C7Wd4uhIjcb6blVGgY9q-iZn80Pk3p1_N3y4OYf0KayWdlt3WA/exec";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        let response;

        if (req.method === "POST") {
            const params = new URLSearchParams(req.body);
            response = await fetch(`${SHEET_URL}?${params.toString()}`);
        } else {
            const params = new URLSearchParams(req.query);
            response = await fetch(`${SHEET_URL}?${params.toString()}`);
        }

        const text = await response.text();
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(text);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
