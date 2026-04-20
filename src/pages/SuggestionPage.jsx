import { useEffect, useState } from 'react';
import { Bot, ChevronLeft, ChevronRight, Leaf, Medal, Recycle, Send, ShieldAlert, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { askWasteAssistant, schedulePickup } from '../api/client';
import { useAppSession } from '../context/AppSessionContext';

function SuggestionPage() {
  const navigate = useNavigate();
  const { analysis } = useAppSession();
  const [question, setQuestion] = useState('How should I dispose this waste?');
  const [chatReply, setChatReply] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState('');
  const [quizRevealed, setQuizRevealed] = useState(false);

  useEffect(() => {
    if (!analysis) navigate('/input', { replace: true });
  }, [analysis, navigate]);

  if (!analysis) return null;

  async function handleAskAssistant() {
    setChatLoading(true);
    try {
      const response = await askWasteAssistant(question, analysis.waste_category.toLowerCase());
      setChatReply(response);
    } finally {
      setChatLoading(false);
    }
  }

  async function handleSchedule(option) {
    const response = await schedulePickup({
      service_type: option.title,
      category: analysis.waste_category,
      preferred_slot: option.eta,
      notes: `Scheduled from EcoVision for ${analysis.predicted_class}`,
    });
    setScheduleMessage(response.message);
  }

  return (
    <div className="flex flex-1 flex-col p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/result')}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => navigate('/organizations')}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 grid flex-1 gap-6 lg:grid-cols-2">
        <article className="app-card p-6">
          <div className="icon-pill">
            <Recycle className="h-5 w-5" />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Step 4</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Recycling or reuse suggestion</h1>
          <h2 className="mt-6 text-2xl font-semibold text-white">{analysis.recycling_suggestion.title}</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">{analysis.recycling_suggestion.description}</p>

          <div className="mt-8 rounded-[24px] border border-emerald-300/15 bg-emerald-400/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
              <Leaf className="h-4 w-4" />
              Waste guidance
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              {analysis.predicted_class} is classified under <span className="font-semibold text-white">{analysis.waste_category}</span>.
              Keep this material in the correct stream so recyclable, organic, and hazardous channels stay separate.
            </p>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-semibold text-white">Waste risk score system</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/60 p-3">
                <p className="text-sm text-slate-400">Risk level</p>
                <p className="mt-1 text-xl font-semibold text-white">{analysis.risk_assessment.level}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/60 p-3">
                <p className="text-sm text-slate-400">Risk score</p>
                <p className="mt-1 text-xl font-semibold text-white">{analysis.risk_assessment.score}/100</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{analysis.risk_assessment.note}</p>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-semibold text-white">Waste lifecycle visualization</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-5">
              {analysis.lifecycle.map((stage) => (
                <div key={stage.title} className="rounded-2xl bg-slate-950/60 p-3">
                  <div className="h-2 w-12 rounded-full" style={{ backgroundColor: stage.accent }} />
                  <p className="mt-3 text-sm font-semibold text-white">{stage.title}</p>
                  <p className="mt-2 text-xs leading-6 text-slate-400">{stage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="app-card p-6">
          <div className="icon-pill">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Environmental tip</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{analysis.awareness_tip.title}</h2>
          <p className="mt-4 text-base leading-8 text-slate-300">{analysis.awareness_tip.description}</p>

          <div className="mt-8 space-y-3">
            <div className="rounded-2xl bg-white/5 p-4 text-sm leading-7 text-slate-300">
              Clean segregation reduces contamination and makes waste collection more efficient.
            </div>
            <div className="rounded-2xl bg-white/5 p-4 text-sm leading-7 text-slate-300">
              The same image gives the same result because prediction randomness and augmentation have been removed.
            </div>
            <div className="rounded-2xl bg-white/5 p-4 text-sm leading-7 text-slate-300">{analysis.system_goal}</div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Medal className="h-4 w-4 text-emerald-300" />
                Gamification
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">{analysis.gamification.eco_score}/100</p>
              <p className="mt-1 text-sm text-slate-400">
                {analysis.gamification.badge} · {analysis.gamification.eco_points} points
              </p>
              <p className="mt-1 text-sm text-slate-400">Next badge: {analysis.gamification.next_badge}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Trophy className="h-4 w-4 text-emerald-300" />
                Community dashboard
              </div>
              <p className="mt-3 text-sm text-slate-300">
                Waste saved: {analysis.community_impact.waste_saved_from_landfill_kg} kg
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Plastic recycled: {analysis.community_impact.plastic_recycled_kg} kg
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Carbon reduction: {analysis.community_impact.carbon_reduction_kg} kg
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="app-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Bot className="h-4 w-4 text-emerald-300" />
            AI chatbot for waste guidance
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Ask how to dispose batteries, thermocol, organics, or any item related to the current waste stream.
          </p>
          <div className="mt-4 flex gap-3">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="flex-1 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none"
              placeholder="Ask a waste handling question"
            />
            <button
              type="button"
              onClick={handleAskAssistant}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              <Send className="h-4 w-4" />
              {chatLoading ? 'Asking...' : 'Ask'}
            </button>
          </div>
          {chatReply ? (
            <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm leading-7 text-slate-300">
              <p className="font-semibold text-white">Assistant answer</p>
              <p className="mt-2">{chatReply.answer}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {chatReply.suggested_questions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuestion(item)}
                    className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-200"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </article>

        <article className="app-card p-6">
          <h3 className="text-lg font-semibold text-white">Waste collection scheduling system</h3>
          <div className="mt-4 space-y-3">
            {analysis.collection_schedule_options.map((option) => (
              <button
                key={option.title}
                type="button"
                onClick={() => handleSchedule(option)}
                className="w-full rounded-2xl bg-white/5 p-4 text-left transition hover:bg-white/10"
              >
                <p className="text-base font-semibold text-white">{option.title}</p>
                <p className="mt-1 text-sm text-slate-300">{option.description}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-emerald-100">{option.eta}</p>
              </button>
            ))}
          </div>
          {scheduleMessage ? <p className="mt-4 text-sm text-emerald-200">{scheduleMessage}</p> : null}
        </article>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="app-card p-6">
          <h3 className="text-lg font-semibold text-white">Smart city integration module</h3>
          <div className="mt-4 grid gap-3">
            {analysis.government_initiatives.concat(analysis.city_statistics).map((item) => (
              <div key={item.title} className="rounded-2xl bg-white/5 p-4">
                <p className="text-base font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-emerald-100">{item.value}</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">{item.note}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{item.source}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="app-card p-6">
          <h3 className="text-lg font-semibold text-white">{analysis.education_module.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">{analysis.education_module.summary}</p>
          <div className="mt-4 rounded-2xl bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">{analysis.education_module.quiz.question}</p>
            <div className="mt-3 space-y-2">
              {analysis.education_module.quiz.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setQuizRevealed(true)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left text-sm text-slate-200"
                >
                  {option}
                </button>
              ))}
            </div>
            {quizRevealed ? (
              <div className="mt-4 rounded-2xl bg-emerald-400/10 p-4 text-sm leading-7 text-slate-200">
                <p className="font-semibold text-white">Answer: {analysis.education_module.quiz.answer}</p>
                <p className="mt-2">{analysis.education_module.quiz.explainer}</p>
              </div>
            ) : null}
          </div>
        </article>
      </div>
    </div>
  );
}

export default SuggestionPage;
