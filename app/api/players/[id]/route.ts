import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

// Обработчик PUT запроса для обновления игрока
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const playerId = params.id
    const playerData = await request.json()

    // Создаем подключение к базе данных
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
    })

    // Формируем SQL запрос для обновления
    const fields = Object.keys(playerData)
      .map((key) => `${key} = ?`)
      .join(", ")

    const values = Object.values(playerData)
    values.push(playerId) // Добавляем ID в конец для WHERE условия

    const [result] = await connection.execute(`UPDATE players SET ${fields} WHERE id = ?`, values)

    await connection.end()

    return NextResponse.json({ success: true, message: "Игрок успешно обновлен" })
  } catch (error) {
    console.error("Ошибка при обновлении игрока:", error)
    return NextResponse.json({ error: "Не удалось обновить игрока" }, { status: 500 })
  }
}

// Обработчик DELETE запроса для удаления игрока
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const playerId = params.id

    // Создаем подключение к базе данных
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
    })

    // Проверяем, существует ли игрок перед удалением
    const [checkResult] = await connection.execute("SELECT id FROM players WHERE id = ?", [playerId])
    const players = checkResult as any[]

    if (players.length === 0) {
      await connection.end()
      return NextResponse.json({ error: "Игрок не найден" }, { status: 404 })
    }

    // Выполняем запрос на удаление
    const [result] = await connection.execute("DELETE FROM players WHERE id = ?", [playerId])

    await connection.end()

    return NextResponse.json({ success: true, message: "Игрок успешно удален" })
  } catch (error) {
    console.error("Ошибка при удалении игрока:", error)
    return NextResponse.json({ error: "Не удалось удалить игрока" }, { status: 500 })
  }
}

// Обработчик GET запроса для получения одного игрока
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const playerId = params.id

    // Создаем подключение к базе данных
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
    })

    // Выполняем запрос на получение игрока
    const [rows] = await connection.execute("SELECT * FROM players WHERE id = ?", [playerId])

    await connection.end()

    // Проверяем, найден ли игрок
    const players = rows as any[]
    if (players.length === 0) {
      return NextResponse.json({ error: "Игрок не найден" }, { status: 404 })
    }

    return NextResponse.json(players[0])
  } catch (error) {
    console.error("Ошибка при получении данных игрока:", error)
    return NextResponse.json({ error: "Не удалось получить данные игрока" }, { status: 500 })
  }
}
