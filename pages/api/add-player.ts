import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { 
    name, age, pace, shooting, passing, dribbling, defending, physicality, height, weight, 
    tackles, interceptions, vision, ball_control, reactions, stamina, aggression, balance, composure,
    overall, photo_url
  } = req.body

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    })

    const [result] = await connection.execute(
      `INSERT INTO players 
        (name, age, pace, shooting, passing, dribbling, defending, physicality, height, weight, 
        tackles, interceptions, vision, ball_control, reactions, stamina, aggression, balance, composure,
        overall, photo_url) 
        VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, age, pace, shooting, passing, dribbling, defending, physicality, height, weight,
        tackles, interceptions, vision, ball_control, reactions, stamina, aggression, balance, composure,
        overall, photo_url
      ]
    )

    await connection.end()

    res.status(200).json({ message: 'Игрок успешно добавлен!' })
  } catch (error) {
    console.error('DB Error:', error);
res.status(500).json({ error: 'Ошибка при добавлении игрока в базу данных', details: error });

  }
}
