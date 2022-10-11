import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma';

async function saveMood(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
    };

    const moodData = JSON.parse(req.body);

    try {
        const mood = await prisma.mood.create({
            data: moodData
        });
        res.status(200).json(mood);
    }catch(e){
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default saveMood;