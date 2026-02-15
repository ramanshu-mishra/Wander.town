export default function VirtualOfficeScene() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#e8e4f0] border border-[#d4d0e0] p-3 min-h-[200px] flex items-center justify-center">
      {/* Pixel-art style office: grid floor, furniture, avatars */}
      <div
        className="relative w-full max-w-[280px] aspect-[4/3] rounded-lg overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(#ddd8e8 1px, transparent 1px), linear-gradient(90deg, #ddd8e8 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      >
        {/* Back wall: bookshelf + windows */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-[#c4b8d4] rounded-b flex gap-1 px-2 py-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-1 rounded bg-amber-800/40 border border-amber-900/30" />
          ))}
        </div>
        <div className="absolute top-12 left-2 right-2 flex gap-2 justify-center">
          <div className="w-8 h-10 rounded bg-sky-200/80 border border-sky-300" />
          <div className="w-8 h-10 rounded bg-sky-200/80 border border-sky-300" />
        </div>

        {/* Sofa area */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-6 rounded bg-gray-500 border-2 border-gray-600" />
        <div className="absolute bottom-6 left-[42%] w-4 h-4 rounded-full bg-amber-200 border border-amber-300" />
        <div className="absolute bottom-10 left-[38%] w-3 h-3 rounded-full bg-white/90 border border-gray-300" title="pizza" />

        {/* Armchairs + table */}
        <div className="absolute bottom-12 left-4 w-8 h-6 rounded-lg bg-blue-600 border-2 border-blue-700" />
        <div className="absolute bottom-12 right-6 w-8 h-6 rounded-lg bg-blue-600 border-2 border-blue-700" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-gray-200" />

        {/* Plants */}
        <div className="absolute bottom-8 left-6 w-4 h-6 rounded-t-full bg-emerald-600 border border-emerald-700" />
        <div className="absolute bottom-8 right-4 w-3 h-5 rounded-t-full bg-emerald-600 border border-emerald-700" />

        {/* Avatars */}
        <div className="absolute bottom-14 left-[35%] flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-[#2D2D44] border-2 border-white shadow flex items-center justify-center text-[8px] text-white font-bold">
            A
          </div>
          <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white -mt-2 overflow-hidden bg-center bg-cover" />
        </div>
        <div className="absolute bottom-14 left-[48%] flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-[#2D2D44] border-2 border-white shadow flex items-center justify-center text-[8px] text-white font-bold">
            B
          </div>
          <div className="w-5 h-5 rounded-full bg-gray-300 border-2 border-white -mt-2 overflow-hidden bg-center bg-cover" />
        </div>
        <div className="absolute bottom-12 left-8 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-[#2D2D44] border-2 border-white shadow flex items-center justify-center text-[7px] text-white font-bold">
            C
          </div>
        </div>
      </div>
    </div>
  );
}
