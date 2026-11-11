import React, { useState } from 'react';
import { X, Copy, Check, Code2, ExternalLink, Sparkles, Globe, LayoutGrid, PlayCircle } from 'lucide-react';

interface EmbedCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedCodeModal: React.FC<EmbedCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'HTML_DIRECT' | 'BY_URL' | 'CARD'>('HTML_DIRECT');
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);

  if (!isOpen) return null;

  const cloudSharedUrl = 'https://ais-pre-4qujjaaksm2xq7hmn5jpkk-562315219617.asia-southeast1.run.app';
  const embedUrl =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    !window.location.hostname.includes('127.0.0.1')
      ? window.location.origin
      : cloudSharedUrl;

  // 1. Direct Playable HTML <iframe> Code (Plays directly on the page without opening a new tab/window!)
  const directPlayableHtmlSnippet = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="700" 
  style="border: 0; width: 100%; height: 700px; border-radius: 20px; box-shadow: 0 12px 35px rgba(0,0,0,0.3); display: block;" 
  allow="autoplay; fullscreen; accelerometer; gyroscope" 
  allowfullscreen="true"
  title="Larian Kejiranan BoBoiBoy 3D - Pemanas Badan PJK">
</iframe>`;

  // 2. Card Snippet (Optional external link)
  const cardSnippet = `<div style="font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); border: 3px solid #f59e0b; border-radius: 24px; padding: 24px; text-align: center; color: #ffffff; box-shadow: 0 15px 35px rgba(0,0,0,0.4); max-width: 100%; margin: 10px auto; box-sizing: border-box;">
  <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">
    <span style="background: #f59e0b; color: #0f172a; font-weight: 900; font-size: 11px; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">Pemanas Badan PJK Tahun 5</span>
    <span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-weight: 700; font-size: 11px; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(56, 189, 248, 0.4);">Pulau Rintis 3D</span>
  </div>
  <h2 style="margin: 8px 0 10px 0; font-size: 24px; font-weight: 900; color: #fbbf24;">🏃 LARIAN KEJIRANAN 3D</h2>
  <p style="margin: 0 0 18px 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">
    Larian pemanas badan 3D POV bersama <strong>BoBoiBoy & Tok Aba</strong>. Murid bergerak di tempat masing-masing mengikut arahan.
  </p>
  <a href="${embedUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #f59e0b; color: #0f172a; text-decoration: none; font-weight: 900; font-size: 15px; padding: 14px 28px; border-radius: 16px; border-bottom: 4px solid #b45309; box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4); cursor: pointer;">
    <span>⚡ BUKA SKRIN PENUH (TAB BAHARU)</span>
  </a>
</div>`;

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleCopyHtml = async () => {
    const ok = await copyToClipboard(directPlayableHtmlSnippet);
    if (ok) {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2500);
    }
  };

  const handleCopyUrl = async () => {
    const ok = await copyToClipboard(embedUrl);
    if (ok) {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  const handleCopyCard = async () => {
    const ok = await copyToClipboard(cardSnippet);
    if (ok) {
      setCopiedCard(true);
      setTimeout(() => setCopiedCard(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-5 md:p-7 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center shadow-lg">
            <Code2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-amber-400 tracking-wide flex items-center gap-2">
              Sematkan Permainan (Main Terus)
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                Tanpa Buka Web Baharu
              </span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300">
              Permainan boleh dimainkan serta-merta di dalam laman Google Sites / portal sekolah anda.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-800/90 rounded-2xl border border-slate-700 mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('HTML_DIRECT')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'HTML_DIRECT'
                ? 'bg-amber-400 text-slate-900 font-black shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>1. Kod HTML (Main Terus)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BY_URL')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'BY_URL'
                ? 'bg-amber-400 text-slate-900 font-black shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>2. Mengikut URL Sites</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CARD')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'CARD'
                ? 'bg-amber-400 text-slate-900 font-black shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>3. Kad Butang</span>
          </button>
        </div>

        {/* Tab 1: Direct Playable HTML <iframe> Code */}
        {activeTab === 'HTML_DIRECT' && (
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 text-xs text-emerald-200 leading-relaxed flex items-start gap-2.5">
              <PlayCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Main terus di dalam laman:</strong> Kod HTML ini memaparkan keseluruhan permainan 3D secara terus. Murid dan guru boleh bermain, melompat, dan menunduk terus di dalam laman tanpa perlu membuka tab atau laman web baharu!
              </div>
            </div>

            <div className="relative">
              <pre className="bg-slate-950 p-3.5 rounded-2xl border border-slate-700 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
                {directPlayableHtmlSnippet}
              </pre>

              <button
                type="button"
                onClick={handleCopyHtml}
                className={`mt-2.5 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-black text-sm cartoon-btn shadow-lg cursor-pointer transition-all ${
                  copiedHtml
                    ? 'bg-emerald-500 text-white border-b-4 border-emerald-700'
                    : 'bg-amber-400 hover:bg-amber-500 text-slate-900 border-b-4 border-amber-600'
                }`}
              >
                {copiedHtml ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>KOD HTML BERJAYA DISALIN KE PAPAN KERATAN!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>SALIN KOD HTML (UNTUK MAIN TERUS DI LAMAN)</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5 text-xs text-slate-300 space-y-1.5">
              <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Cara Tampal Kod HTML di Google Sites:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-200">
                <li>Buka Google Sites anda &gt; Klik menu <strong>Sisip</strong> (<em>Insert</em>) di sebelah kanan.</li>
                <li>Pilih <strong>Sematkan</strong> (ikon <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-400">&lt;/&gt;</code>).</li>
                <li>Klik tab <strong>Sematkan kod</strong> (<em>Embed code</em>).</li>
                <li>Tampal kod HTML di atas &gt; Klik <strong>Seterusnya</strong> (<em>Next</em>) &gt; Klik <strong>Sisip</strong> (<em>Insert</em>).</li>
                <li>Tarik penjuru kotak permainan untuk membesarkan paparan mengikut keselesaan murid.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 2: Direct Google Sites "Mengikut URL" (100% Native Playable In-Page) */}
        {activeTab === 'BY_URL' && (
          <div className="space-y-4">
            <div className="bg-sky-500/10 border border-sky-500/30 rounded-2xl p-3 text-xs text-sky-200 leading-relaxed">
              <strong>Kaedah Rasmi Google Sites (Paling Licin & Main Terus):</strong> Di Google Sites, pilihan <strong>Mengikut URL</strong> (*By URL*) membolehkan permainan berjalan 100% terus di dalam laman tanpa sebarang sekatan keselamatan browser!
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-700 space-y-2">
              <div className="text-xs text-slate-400 font-semibold">Pautan URL untuk disematkan:</div>
              <div className="font-mono text-xs md:text-sm text-sky-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 break-all select-all">
                {embedUrl}
              </div>

              <button
                type="button"
                onClick={handleCopyUrl}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                  copiedUrl
                    ? 'bg-emerald-500 text-white'
                    : 'bg-sky-500 hover:bg-sky-600 text-white'
                }`}
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>URL BERJAYA DISALIN!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>SALIN PAUTAN URL INI</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5 text-xs text-slate-300 space-y-1.5">
              <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Langkah Mengikut URL di Google Sites:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-200">
                <li>Di Google Sites, klik <strong>Sisip</strong> &gt; pilih <strong>Sematkan</strong> (<code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">&lt;/&gt;</code>).</li>
                <li>Pilih tab pertama: <strong>Mengikut URL</strong> (<em>By URL</em>).</li>
                <li>Tampal URL di atas &gt; Pilih pilihan <strong>Seluruh halaman</strong> (<em>Whole page</em>).</li>
                <li>Klik <strong>Sisip</strong>. Permainan akan sedia dimainkan di dalam Google Sites!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 3: Card Button */}
        {activeTab === 'CARD' && (
          <div className="space-y-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs text-slate-300 leading-relaxed">
              Kad ini memaparkan sepanduk ringkasan dengan butang khas untuk membuka permainan dalam skrin penuh di tab baharu (sesuai jika ruangan Google Sites anda sempit).
            </div>

            <div className="relative">
              <pre className="bg-slate-950 p-3.5 rounded-2xl border border-slate-700 font-mono text-xs text-emerald-300 overflow-x-auto max-h-40 whitespace-pre leading-relaxed select-all">
                {cardSnippet}
              </pre>

              <button
                type="button"
                onClick={handleCopyCard}
                className={`mt-2.5 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-black text-sm cartoon-btn shadow-lg cursor-pointer transition-all ${
                  copiedCard
                    ? 'bg-emerald-500 text-white border-b-4 border-emerald-700'
                    : 'bg-amber-400 hover:bg-amber-500 text-slate-900 border-b-4 border-amber-600'
                }`}
              >
                {copiedCard ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>KOD KAD BERJAYA DISALIN!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>SALIN KOD KAD BUTANG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Direct Link Footer */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <span>Pautan terus pelayar untuk murid / projektor:</span>
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
          >
            <span>Buka Terus di Pelayar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
