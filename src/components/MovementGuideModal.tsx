import React from 'react';
import { X, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Activity, CheckCircle2 } from 'lucide-react';

interface MovementGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MovementGuideModal: React.FC<MovementGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-xl rounded-3xl p-6 shadow-2xl text-white relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full cursor-pointer transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-slate-900 font-extrabold text-2xl shadow">
            🏃‍♂️
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-amber-400 tracking-wide">
              Panduan Pergerakan Murid Tahun 5
            </h2>
            <p className="text-xs md:text-sm text-slate-300">
              Pendidikan Jasmani & Kesihatan: Pemanas Badan Kejiranan
            </p>
          </div>
        </div>

        {/* Movement Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* LARI SETEMPAT */}
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shrink-0 border border-amber-500/30 text-xl">
              ⚡
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-amber-300">Lari Setempat (Rentak BoBoiBoy)</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Hayun kedua-dua tangan mengikut tempo muzik ceria Tok Aba. Angkat lutut separuh paras pinggang.
              </p>
            </div>
          </div>

          {/* KIRI */}
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-slate-900 flex items-center justify-center font-black shrink-0 shadow">
              <ArrowLeft className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-sky-300">“KIRI!” (Elakan Gopal)</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Langkah sisi ke kiri satu tapak tangkas. Elak tong sampah atau halangan di laluan kanan!
              </p>
            </div>
          </div>

          {/* KANAN */}
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black shrink-0 shadow">
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-rose-300">“KANAN!” (Aksi Yaya)</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Langkah sisi ke kanan satu tapak kemas. Elak kereta sorong atau pokok bunga di laluan kiri!
              </p>
            </div>
          </div>

          {/* LOMPAT */}
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shrink-0 shadow">
              <ArrowUp className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-amber-300">“LOMPAT!” (Lompatan Petir)</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Tolak kedua-dua belah kaki, melepasi lopak air atau hos paip, mendarat dengan lutut lentur selamat.
              </p>
            </div>
          </div>

          {/* TUNDUK */}
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-start gap-3 sm:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-400 text-slate-900 flex items-center justify-center font-black shrink-0 shadow">
              <ArrowDown className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-emerald-300">“TUNDUK!” (Tundukan Laju Ying)</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Cangkung separa rendah dan tundukkan kepala melepasi dahan pokok dan kain rentang Kokotiam Tok Aba!
              </p>
            </div>
          </div>
        </div>

        {/* Tip for Teachers */}
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200">
            <strong>Petua Guru PJK:</strong> Tayangkan di projektor kelas dalam <em>Mod Tayangan Kelas</em>. Murid berdiri di ruang lapang masing-masing dan melakukan pergerakan serentak dengan muzik!
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black rounded-2xl cartoon-btn shadow-md cursor-pointer text-center text-sm"
        >
          FAHAM & TERUSKAN LARIAN!
        </button>
      </div>
    </div>
  );
};
