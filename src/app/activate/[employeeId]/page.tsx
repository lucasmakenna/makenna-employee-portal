'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  FileText,
  GraduationCap,
  Calendar,
  MessageSquare,
  Clock,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Apple,
  Coffee,
} from 'lucide-react';
import { useEmployees, usePackets } from '@/data/store';
import { fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import { ONBOARDING_DOCS } from '@/data/onboarding';
import { supabase } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';

type Step = 'welcome' | 'tour' | 'docs' | 'day1' | 'done';

export default function ActivatePage() {
  const params = useParams<{ employeeId: string }>();
  const router = useRouter();
  const { getById } = useEmployees();
  const { get: getPacket } = usePackets();
  const employee = getById(params.employeeId);
  const packet = getPacket(params.employeeId);

  const [step, setStep] = useState<Step>('welcome');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // No useCurrentUser gate — this page is intentionally accessible from
    // an email link before the user has signed in.
  }, []);

  if (!employee || !packet) {
    return (
      <Centered>
        <div className="card max-w-md p-8 text-center">
          <h1 className="text-xl font-bold text-ink-700">Activation link expired</h1>
          <p className="mt-2 text-sm text-ink-500">
            This activation link is no longer valid. Please contact your manager for help.
          </p>
        </div>
      </Centered>
    );
  }

  const location = getLocation(employee.homeLocationId);
  const startDateLong = format(parseISO(packet.startDate), 'EEEE, MMMM d');

  const passwordValid =
    password.length >= 8 && password === confirm;

  return (
    <Centered>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Makenna Koffee" className="h-16 w-auto" />
          <div className="tri-stripe rounded-full w-32" />
        </div>

        {/* Stepper */}
        <Stepper step={step} />

        <div className="card mt-4 p-8">
          {step === 'welcome' && (
            <>
              <h1 className="text-3xl font-bold text-ink-700">
                Welcome, {employee.firstName}! 🌺
              </h1>
              <p className="mt-2 text-ink-600">
                You're starting at <strong>{location?.name}</strong> on{' '}
                <strong>{startDateLong}</strong>. Let's get you set up.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="label">Email (used to sign in)</label>
                  <input className="input bg-ink-50" value={employee.email} readOnly />
                </div>
                <div>
                  <label className="label">Create a password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      className="input pr-10"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                      onClick={() => setShowPw(!showPw)}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirm password</label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input"
                    placeholder="Re-enter your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  {confirm && password !== confirm && (
                    <p className="mt-1 text-xs text-hibiscus-500">Passwords don't match.</p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2 rounded-lg bg-cyan-50/60 p-3 text-xs text-ink-600">
                <Lock size={14} className="text-cyan-500 mt-0.5 shrink-0" />
                Your password is encrypted. We can't see it, and we'll never email it back to you.
              </div>

              {authError && (
                <p className="mt-3 text-sm text-hibiscus-600 bg-hibiscus-50 rounded-lg px-3 py-2">
                  {authError}
                </p>
              )}

              <NavRow
                onNext={async () => {
                  setAuthError('');
                  setAuthLoading(true);
                  const { error } = await supabase.auth.signUp({
                    email: employee.email,
                    password,
                  });
                  setAuthLoading(false);
                  if (error && !error.message.includes('already registered')) {
                    setAuthError(error.message);
                    return;
                  }
                  setStep('tour');
                }}
                nextDisabled={!passwordValid || authLoading}
                nextLabel={authLoading ? 'Setting up…' : 'Continue'}
              />
            </>
          )}

          {step === 'tour' && (
            <>
              <h1 className="text-3xl font-bold text-ink-700">Welcome to the Makenna Mafia!</h1>
              <p className="mt-2 text-ink-600">
                The Makenna Team app keeps everything you need in one spot. Here's a quick tour.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Feature
                  icon={<FileText size={18} />}
                  title="Your Employee Files"
                  body="Executed W-4, I-9, Handbook, and any other relevant document."
                />
                <Feature
                  icon={<GraduationCap size={18} />}
                  title="Training checklists"
                  body="Stations, skills, and trainer sign-offs — all on the iPad in the shop."
                />
                <Feature
                  icon={<Calendar size={18} />}
                  title="Schedule & availability"
                  body="See your shifts, set when you can work, post a shift for someone to cover."
                />
                <Feature
                  icon={<Clock size={18} />}
                  title="Clock in/out"
                  body="Phone clock-in checks you're at the store. Meal break and end-of-shift are tracked."
                />
                <Feature
                  icon={<MessageSquare size={18} />}
                  title="Messages"
                  body="Chat with your store team, DM your manager, and see all-hands announcements."
                />
                <Feature
                  icon={<Sparkles size={18} />}
                  title="Rewards & milestones"
                  body="Birthday drinks, anniversaries, and shoutouts when you crush a station."
                />
              </div>

              <NavRow
                onBack={() => setStep('welcome')}
                onNext={() => setStep('docs')}
                nextLabel="Continue"
              />
            </>
          )}

          {step === 'docs' && (
            <>
              <h1 className="text-3xl font-bold text-ink-700">What you'll be signing</h1>
              <p className="mt-2 text-ink-600">
                Read these now so you have your questions ready when you come in. You'll sign each
                of them on Day 1 with your manager.
              </p>

              <div className="mt-5 space-y-2">
                {ONBOARDING_DOCS.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-xl border border-ink-100 bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-500">
                        <FileText size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <div className="font-bold text-ink-700">{d.title}</div>
                          {d.required ? (
                            <span className="pill bg-hibiscus-50 text-hibiscus-500">Required</span>
                          ) : (
                            <span className="pill bg-ink-50 text-ink-400">Optional</span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-ink-500">{d.description}</p>
                        <details className="mt-2 text-xs text-ink-600">
                          <summary className="cursor-pointer text-cyan-500 hover:underline">
                            Read the full text
                          </summary>
                          <p className="mt-2 leading-relaxed bg-cyan-50/40 p-3 rounded-md">
                            {d.templateBody}
                          </p>
                        </details>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <NavRow
                onBack={() => setStep('tour')}
                onNext={() => setStep('day1')}
                nextLabel="Continue"
              />
            </>
          )}

          {step === 'day1' && (
            <>
              <h1 className="text-3xl font-bold text-ink-700">Show up ready ☀️</h1>
              <p className="mt-2 text-ink-600">
                Bring these on <strong>{startDateLong}</strong> so we can knock everything out
                quickly and get you behind the bar.
              </p>

              <Section title="Bring with you">
                <Item>
                  <strong>Government photo ID</strong> — driver's license, state ID, or passport.
                </Item>
                <Item>
                  <strong>SSN card OR U.S. passport</strong> — federal I-9 requires your manager to
                  physically inspect one of these. A passport satisfies it on its own.
                </Item>
                <Item>
                  <strong>Voided check or bank info</strong> — routing and account numbers for
                  direct deposit. A photo of a voided check works.
                </Item>
                <Item>
                  <strong>Emergency contact info</strong> — at least one name and phone number.
                </Item>
              </Section>

              <Section title="Dress code">
                <Item>Comfortable shirt (we'll give you Makenna shirts on Day 1)</Item>
                <Item>Comfortable work pants</Item>
                <Item>Closed-toe, non-slip shoes</Item>
                <Item>Hair tied back. Limited jewelry. No strong cologne/perfume.</Item>
              </Section>

              <Section title="Be ready 15 min early">
                <Item>
                  Pre-shift orientation runs 15–30 minutes before your scheduled start. Use the
                  back entrance — your manager will be expecting you.
                </Item>
              </Section>

              <Section title="Download the team app">
                <p className="text-sm text-ink-500 mb-2">
                  You'll use the app to clock in/out, see your schedule, and message your team.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-lg bg-ink-700 px-4 py-2 text-white text-sm hover:bg-ink-600"
                  >
                    <Apple size={18} /> Download for iPhone
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-lg bg-ink-700 px-4 py-2 text-white text-sm hover:bg-ink-600"
                  >
                    <Smartphone size={18} /> Download for Android
                  </a>
                </div>
                <p className="mt-2 text-xs text-ink-400">
                  Sign in with the same email and password you just created.
                </p>
              </Section>

              <NavRow
                onBack={() => setStep('docs')}
                onNext={() => setStep('done')}
                nextLabel="I'm ready"
              />
            </>
          )}

          {step === 'done' && (
            <div className="text-center py-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="mt-4 text-3xl font-bold text-ink-700">You're all set 🎉</h1>
              <p className="mt-2 text-ink-600 max-w-md mx-auto">
                We'll see you on <strong>{startDateLong}</strong> at <strong>{location?.name}</strong>.
                Reply to your welcome email or text your manager if anything comes up.
              </p>

              <div className="mt-6 rounded-xl bg-cyan-50 p-4 text-sm text-ink-700 max-w-md mx-auto">
                <Coffee size={20} className="text-cyan-500 mx-auto mb-2" />
                Want to peek at the docs again? You can always sign in to{' '}
                <a className="font-bold text-cyan-500 underline" href="/login">
                  the portal
                </a>{' '}
                and review them before your start date.
              </div>
            </div>
          )}
        </div>
      </div>
    </Centered>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page py-10 px-4 flex justify-center">
      {children}
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const order: Step[] = ['welcome', 'tour', 'docs', 'day1', 'done'];
  const current = order.indexOf(step);
  const labels: Record<Step, string> = {
    welcome: 'Account',
    tour: 'Tour',
    docs: 'Docs',
    day1: 'Day 1',
    done: 'Done',
  };
  return (
    <div className="flex items-center justify-center gap-1.5 text-xs">
      {order.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex items-center gap-1.5">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                done
                  ? 'bg-cyan-400 text-white'
                  : active
                  ? 'bg-ink-700 text-white'
                  : 'bg-ink-100 text-ink-400'
              }`}
            >
              {done ? <CheckCircle2 size={12} /> : i + 1}
            </div>
            <span className={active ? 'font-bold text-ink-700' : 'text-ink-400'}>
              {labels[s]}
            </span>
            {i < order.length - 1 && <span className="text-ink-200">·</span>}
          </div>
        );
      })}
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-ink-100 bg-cyan-50/40 p-3">
      <div className="flex items-center gap-2 text-cyan-500">
        {icon}
        <div className="font-bold text-ink-700">{title}</div>
      </div>
      <p className="mt-1 text-sm text-ink-600 leading-relaxed">{body}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-bold uppercase tracking-wider text-ink-400 mb-2">{title}</h3>
      <div className="rounded-xl border border-ink-100 bg-white p-4 space-y-2">{children}</div>
    </div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-ink-700">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-hibiscus-400" />
      <div>{children}</div>
    </div>
  );
}

function NavRow({
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-7 flex items-center justify-between border-t border-ink-100 pt-5">
      {onBack ? (
        <button onClick={onBack} className="btn-ghost">
          <ChevronLeft size={16} /> Back
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="btn-cyan disabled:opacity-40"
      >
        {nextLabel} <ChevronRight size={16} />
      </button>
    </div>
  );
}
