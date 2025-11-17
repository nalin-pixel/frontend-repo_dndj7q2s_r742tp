import { useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "";

function Label({ children }) {
  return <label className="text-sm text-slate-300 mb-1 block">{children}</label>;
}

function Field({ children }) {
  return <div className="mb-4">{children}</div>;
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full bg-slate-800/60 border border-slate-600/40 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className||""}`}
    />
  );
}

function Range({label, value, min, max, step, onChange}){
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-slate-300 mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} className="w-full"/>
    </div>
  );
}

export default function GeneratorUI(){
  const [prompt, setPrompt] = useState("Neon waves");
  const [style, setStyle] = useState("neon");
  const [imgUrl, setImgUrl] = useState(null);
  const [vidUrl, setVidUrl] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [loadingVid, setLoadingVid] = useState(false);

  const [width, setWidth] = useState(768);
  const [height, setHeight] = useState(512);

  const [vWidth, setVWidth] = useState(720);
  const [vHeight, setVHeight] = useState(1280);
  const [duration, setDuration] = useState(5);
  const [fps, setFps] = useState(24);

  async function createImage(){
    setLoadingImg(true);
    setImgUrl(null);
    try {
      const body = { prompt, style, width: Number(width), height: Number(height) };
      const res = await fetch(`${BACKEND}/api/generate-image`,{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.detail||"Failed");
      setImgUrl(`${BACKEND}${data.url}`);
    } catch (e){
      alert(e.message);
    } finally {
      setLoadingImg(false);
    }
  }

  async function createVideo(){
    setLoadingVid(true);
    setVidUrl(null);
    try {
      const body = { prompt, style, width: Number(vWidth), height: Number(vHeight), duration: Number(duration), fps: Number(fps)};
      const res = await fetch(`${BACKEND}/api/generate-video`,{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.detail||"Failed");
      setVidUrl(`${BACKEND}${data.url}`);
    } catch (e){
      alert(e.message);
    } finally {
      setLoadingVid(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Create Image</h3>
          <Field>
            <Label>Prompt</Label>
            <Input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Describe your image"/>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label>Width</Label>
              <Input type="number" value={width} onChange={e=>setWidth(e.target.value)} />
            </Field>
            <Field>
              <Label>Height</Label>
              <Input type="number" value={height} onChange={e=>setHeight(e.target.value)} />
            </Field>
          </div>
          <Field>
            <Label>Style</Label>
            <select value={style} onChange={e=>setStyle(e.target.value)} className="w-full bg-slate-800/60 border border-slate-600/40 rounded-lg px-3 py-2 text-slate-100">
              <option value="abstract">Abstract</option>
              <option value="sunset">Sunset</option>
              <option value="ocean">Ocean</option>
              <option value="forest">Forest</option>
              <option value="neon">Neon</option>
            </select>
          </Field>
          <button onClick={createImage} disabled={loadingImg} className="w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-lg py-2 transition">
            {loadingImg? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {imgUrl && (
          <div className="mt-6 bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4">
            <h4 className="text-white font-medium mb-2">Result</h4>
            <img src={imgUrl} alt="result" className="rounded-lg w-full"/>
            <a href={imgUrl} download className="inline-block mt-3 text-sm text-blue-300 hover:text-white">Download</a>
          </div>
        )}
      </div>

      <div>
        <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Create Video</h3>
          <Field>
            <Label>Prompt (overlay text)</Label>
            <Input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Text to animate"/>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label>Width</Label>
              <Input type="number" value={vWidth} onChange={e=>setVWidth(e.target.value)} />
            </Field>
            <Field>
              <Label>Height</Label>
              <Input type="number" value={vHeight} onChange={e=>setVHeight(e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Range label="Duration (s)" value={duration} min={1} max={15} step={1} onChange={e=>setDuration(e.target.value)} />
            <Range label="FPS" value={fps} min={5} max={60} step={1} onChange={e=>setFps(e.target.value)} />
          </div>
          <Field>
            <Label>Style</Label>
            <select value={style} onChange={e=>setStyle(e.target.value)} className="w-full bg-slate-800/60 border border-slate-600/40 rounded-lg px-3 py-2 text-slate-100">
              <option value="abstract">Abstract</option>
              <option value="sunset">Sunset</option>
              <option value="ocean">Ocean</option>
              <option value="forest">Forest</option>
              <option value="neon">Neon</option>
            </select>
          </Field>
          <button onClick={createVideo} disabled={loadingVid} className="w-full mt-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white rounded-lg py-2 transition">
            {loadingVid? 'Generating...' : 'Generate Video'}
          </button>
        </div>

        {vidUrl && (
          <div className="mt-6 bg-slate-800/50 border border-purple-500/20 rounded-2xl p-4">
            <h4 className="text-white font-medium mb-2">Result</h4>
            <video src={vidUrl} controls className="rounded-lg w-full"/>
            <a href={vidUrl} download className="inline-block mt-3 text-sm text-purple-300 hover:text-white">Download</a>
          </div>
        )}
      </div>
    </div>
  );
}
