import { useState } from 'react';
import { Languages, Mic, ScanSearch, UserCircle2 } from 'lucide-react';
import { useAppSession } from '../context/AppSessionContext';

function AuthPage() {
  const { user, login, logout, language, setLanguage, voiceMode, setVoiceMode, arMode, setArMode } = useAppSession();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  function handleSubmit(event) {
    event.preventDefault();
    login({ name: name || 'Eco User', email: email || 'user@ecovision.ai' });
  }

  return (
    <div className="flex flex-1 flex-col p-5 sm:p-8">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Authentication</p>
        <h2 className="mt-3 text-4xl font-semibold text-white">User login, preferences, and accessibility tools</h2>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="app-card p-6">
          <div className="icon-pill">
            <UserCircle2 className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">{user ? 'Update account' : 'Login / Signup'}</h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none"
            />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none"
            />
            <div className="flex gap-3">
              <button type="submit" className="rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950">
                {user ? 'Save profile' : 'Login / Signup'}
              </button>
              {user ? (
                <button type="button" onClick={logout} className="rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white">
                  Logout
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="app-card p-6">
          <h3 className="text-2xl font-semibold text-white">Preferences and smart modes</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-2 text-white">
                <Languages className="h-4 w-4 text-emerald-300" />
                Multi-language support
              </div>
              <div className="mt-3 flex gap-3">
                {['English', 'Hindi'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLanguage(item)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${language === item ? 'bg-emerald-400 text-slate-950' : 'bg-slate-950/60 text-white'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-2 text-white">
                <Mic className="h-4 w-4 text-emerald-300" />
                Voice-based waste detection
              </div>
              <button type="button" onClick={() => setVoiceMode((current) => !current)} className="mt-3 rounded-full bg-slate-950/60 px-4 py-2 text-sm text-white">
                {voiceMode ? 'Disable Voice Mode' : 'Enable Voice Mode'}
              </button>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-2 text-white">
                <ScanSearch className="h-4 w-4 text-emerald-300" />
                AR waste scanning mode
              </div>
              <button type="button" onClick={() => setArMode((current) => !current)} className="mt-3 rounded-full bg-slate-950/60 px-4 py-2 text-sm text-white">
                {arMode ? 'Disable AR Mode' : 'Enable AR Mode'}
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default AuthPage;
