import Image from "next/image"
import Link from "next/link"

const Page = () => {
  return (
    <main className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center">
      {/* Левая часть: Контент */}
      <section className="w-1/2 pl-[10%] flex flex-col justify-center z-10">
        <div className="space-y-2 mb-8">
          <span className="text-blue-500 font-mono text-sm tracking-[0.2em]">TECHFORGE_SYSTEM</span>
          <h1 className="text-6xl font-black text-white leading-[0.9] tracking-tighter">
            ЭКОСИСТЕМА<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">ПРЕВОСХОДСТВА</span>
          </h1>
        </div>
        
        <p className="text-gray-400 text-lg max-w-md leading-relaxed mb-10">
          Интеллектуальное проектирование ПК, выверенная эргономика рабочего пространства и автоматизированный регламент обслуживания.
        </p>

        <div className="flex gap-4">
          <Link href="/Configurator" className="group px-8 py-4 bg-blue-500 text-black font-bold uppercase tracking-widest hover:bg-white transition-all">
            Начать сборку
          </Link>

        </div>
      </section>

      {/* Правая часть: Визуал (Абсолютное позиционирование) */}
      <div className="absolute right-0 top-0 w-1/2 h-full">
        {/* Градиентная маска для плавного перехода */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent z-10" />
        
        <Image
          className="w-full h-full object-cover object-left opacity-90 grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
          alt="main"
          src="/main.png"
          width={1280}
          height={720}
          priority
        />
      </div>


    </main>
  )
}

export default Page