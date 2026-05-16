import Image from "next/image"
import Link from "next/link"
const page = () => {
	return (
		<>

			<div className="relative">
				<Image
					className="size-3/6 translate-x-full object-cover"
					alt="main"
					src="/main.png"
					width={1280}
					height={720}
				/>

				<div className="absolute h-full inset-0 size-3/6 translate-x-full bg-linear-to-r from-black via-black/40 to-transparent" />
				<div className="absolute text-white top-1/2 left-16 -translate-y-1/2 flex flex-col gap-5">
					<h1 className="text-3xl w-3/5">TECHFORGE: Экосистема вашего цифрового превосходства</h1>
					<p className="text-gray-400 w-2/5">Интеллектуальное проектирование ПК, эргономика рабочего места и автоматизация обслуживания в одном месте.</p>
					<div>
						<Link href={"/Configurator"} className="px-4 py-2 bg-blue-400 text-black">НАЧАТЬ СБОРКУ</Link>
					</div>
				</div>
			</div>
		</>
	)
}

export default page
