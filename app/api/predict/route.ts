import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('➡️ Получено от клиента:', body) // ✅ 1. лог тела запроса

    const flaskResponse = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const result = await flaskResponse.json()
    console.log('⬅️ Ответ от Flask:', result) // ✅ 2. лог ответа от Flask

    const rating = Number(result.rating)
    if (isNaN(rating)) {
      console.error('❌ Ошибка: некорректный рейтинг из Flask:', result.rating)
      return NextResponse.json({ error: 'Некорректный рейтинг от модели' }, { status: 400 })
    }

    return NextResponse.json({ rating })
    
  } catch (error) {
    console.error('❗ Ошибка на API /predict:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
