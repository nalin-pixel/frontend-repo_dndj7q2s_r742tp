import { useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "";

export default function ImageEditor(){
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [grayscale, setGrayscale] = useState(false);
  const [blur, setBlur] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [loading, setLoading] = useState(false);

  function toBase64(file){
    return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = ()=> resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })
  }

  async function doEdit(){
    if(!file){ alert('Upload an image first'); return; }
    setLoading(true);
    setResult(null);
    try{
      const image_base64 = await toBase64(file);
      const body = { image_base64, grayscale, blur: Number(blur), rotate: Number(rotate), flip_horizontal: flipH, flip_vertical: flipV, brightness: Number(brightness), contrast: Number(contrast) };

      const res = await fetch(`${BACKEND}/api/edit-image`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
      const data = await res.json();
      if(!res.ok) throw new Error(data.detail||'Failed');
      setResult(`${BACKEND}${data.url}`);
    }catch(e){
      alert(e.message);
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-800/50 border border-emerald-500/20 rounded-2xl p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Image Editor</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} className="block w-full text-sm text-slate-300" />

          <div className="grid grid-cols-2 gap-3 mt-4 text-slate-300 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={grayscale} onChange={e=>setGrayscale(e.target.checked)} /> Grayscale</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={flipH} onChange={e=>setFlipH(e.target.checked)} /> Flip H</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={flipV} onChange={e=>setFlipV(e.target.checked)} /> Flip V</label>
          </div>

          <div className="mt-4">
            <div className="text-xs text-slate-300 mb-1">Blur: {blur}</div>
            <input type="range" min="0" max="20" step="1" value={blur} onChange={e=>setBlur(e.target.value)} className="w-full"/>
          </div>
          <div className="mt-2">
            <div className="text-xs text-slate-300 mb-1">Rotate: {rotate}°</div>
            <input type="range" min="-180" max="180" step="1" value={rotate} onChange={e=>setRotate(e.target.value)} className="w-full"/>
          </div>
          <div className="mt-2">
            <div className="text-xs text-slate-300 mb-1">Brightness: {brightness}</div>
            <input type="range" min="0.2" max="2" step="0.1" value={brightness} onChange={e=>setBrightness(e.target.value)} className="w-full"/>
          </div>
          <div className="mt-2">
            <div className="text-xs text-slate-300 mb-1">Contrast: {contrast}</div>
            <input type="range" min="0.2" max="2" step="0.1" value={contrast} onChange={e=>setContrast(e.target.value)} className="w-full"/>
          </div>

          <button onClick={doEdit} disabled={loading} className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white rounded-lg py-2 transition">
            {loading? 'Processing...' : 'Apply'}
          </button>
        </div>

        <div>
          {!result && <div className="text-slate-400 text-sm">Upload an image, tweak settings, then hit Apply.</div>}
          {result && (
            <div>
              <img src={result} alt="edited" className="rounded-lg w-full"/>
              <a href={result} download className="inline-block mt-3 text-sm text-emerald-300 hover:text-white">Download</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
