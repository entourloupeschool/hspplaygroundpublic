import type { NextApiRequest, NextApiResponse } from 'next';

async function fetchWeather(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
    };
    const { lat, lon } = JSON.parse(req.body);

    const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.oWKey}&units=metric&lang=fr`);

    return res.json(await weatherData.json());
}

export default fetchWeather;