import { useEffect, useRef, useState } from 'react';
import { Camera, ChevronLeft, CircleDashed, LoaderCircle, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeWaste } from '../api/client';
import { useAppSession } from '../context/AppSessionContext';

function InputPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    selectedMode,
    setSelectedMode,
    setAnalysis,
    setPreviewUrl,
    setStatus,
    error,
    setError,
  } = useAppSession();

  useEffect(() => {
    if (!selectedMode) {
      navigate('/options', { replace: true });
    }
  }, [navigate, selectedMode]);

  useEffect(() => {
    if (selectedMode !== 'webcam') {
      stopCamera();
      return undefined;
    }

    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setError('');
        setStatus('Camera ready. Capture a frame for classification.');
      } catch {
        setError('Unable to access webcam. Please check permissions and try again.');
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [selectedMode, setError, setStatus]);

  function stopCamera() {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  }

  async function runAnalysis(file, localPreviewUrl) {
    setIsLoading(true);
    setError('');
    setStatus('Analyzing waste with deterministic MobileNetV2 preprocessing...');

    try {
      const payload = await analyzeWaste(file);
      setAnalysis(payload);
      setPreviewUrl((current) => {
        if (current?.startsWith('blob:') && current !== localPreviewUrl) URL.revokeObjectURL(current);
        return localPreviewUrl;
      });
      setStatus(`${payload.predicted_class} classified as ${payload.waste_category}.`);
      stopCamera();
      navigate('/result');
    } catch (requestError) {
      setError(requestError.message || 'Classification failed.');
      setStatus('Classification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    await runAnalysis(file, objectUrl);
  }

  function captureFromWebcam() {
    if (!videoRef.current || !canvasRef.current || isLoading) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video.videoWidth || !video.videoHeight) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `ecovision-webcam-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const objectUrl = URL.createObjectURL(blob);
      await runAnalysis(file, objectUrl);
    }, 'image/jpeg', 0.92);
  }

  return (
    <div className="flex flex-1 flex-col p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/options')}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
          {selectedMode === 'webcam' ? 'Live Webcam' : 'Upload Image'}
        </div>
      </div>

      <div className="mt-8 grid flex-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="app-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Step 2</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Provide your waste image</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Use upload for existing images or switch to webcam for live capture.
          </p>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => setSelectedMode('upload')}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                selectedMode === 'upload' ? 'bg-emerald-400 text-slate-950' : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode('webcam')}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                selectedMode === 'webcam' ? 'bg-emerald-400 text-slate-950' : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              Live Webcam
            </button>
          </div>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
            The classifier uses deterministic preprocessing, fixed label mapping, and no inference-time randomness so
            the same image returns the same result.
          </div>
          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        </article>

        <article className="app-card p-6">
          {selectedMode === 'upload' ? (
            <>
              <div className="icon-pill">
                <Upload className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-3xl font-semibold text-white">Upload waste image</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Choose a photo of plastic, glass, paper, food waste, or hazardous material.
              </p>
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isLoading}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-[24px] border border-dashed border-white/15 bg-white/5 px-5 py-16 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                Select image
              </button>
            </>
          ) : (
            <>
              <div className="icon-pill">
                <Camera className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-3xl font-semibold text-white">Live webcam capture</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Open the camera, frame the waste item clearly, then capture to classify.
              </p>
              <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-slate-900">
                <div className="relative aspect-[4/3]">
                  <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
                  {!streamRef.current ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-slate-400">
                      <CircleDashed className="h-10 w-10" />
                      <p className="mt-4 text-sm">Camera preview will appear here.</p>
                    </div>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={captureFromWebcam}
                disabled={isLoading}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                Capture and classify
              </button>
              <canvas ref={canvasRef} className="hidden" />
            </>
          )}
        </article>
      </div>
    </div>
  );
}

export default InputPage;
