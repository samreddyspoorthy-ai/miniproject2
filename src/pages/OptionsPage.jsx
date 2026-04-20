import { Camera, ChevronLeft, ImageUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSession } from '../context/AppSessionContext';

const OPTIONS = [
  {
    mode: 'upload',
    title: 'Upload Image',
    description: 'Choose a waste image from your device and send it to the AI classifier.',
    icon: ImageUp,
  },
  {
    mode: 'webcam',
    title: 'Live Webcam',
    description: 'Open the camera, capture a frame, and classify it instantly.',
    icon: Camera,
  },
];

function OptionsPage() {
  const navigate = useNavigate();
  const { setSelectedMode } = useAppSession();

  function handleSelect(mode) {
    setSelectedMode(mode);
    navigate('/input');
  }

  return (
    <div className="flex flex-1 flex-col p-5 sm:p-8">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      <div className="mt-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Step 1</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Choose how you want to classify waste</h1>
        <p className="mt-3 text-base leading-7 text-slate-300">
          Pick an input source and continue to the classification screen.
        </p>
      </div>

      <div className="mt-8 grid flex-1 gap-6 md:grid-cols-2">
        {OPTIONS.map(({ mode, title, description, icon: Icon }) => (
          <button
            key={mode}
            type="button"
            onClick={() => handleSelect(mode)}
            className="app-card group p-6 text-left transition hover:-translate-y-1 hover:border-emerald-300/30"
          >
            <div className="icon-pill">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-3xl font-semibold text-white">{title}</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">{description}</p>
            <div className="mt-8 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
              Continue
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default OptionsPage;
