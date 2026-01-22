export default function Loading() {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-zinc-400">Загрузка...</p>
        </div>
      </div>
    )
  }
  