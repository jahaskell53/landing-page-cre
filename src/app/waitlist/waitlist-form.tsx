"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import posthog from "posthog-js";
import { captureWaitlistStepAdvanced, captureWaitlistSubmitted, getWaitlistReferral } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import { APP_ORIGIN } from "@/lib/app-origin";
import { EMPTY_ANSWERS, WAITLIST_QUESTIONS, type WaitlistAnswers, type WaitlistQuestion } from "./questions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

/** OM wordmark, matching the marketing header. */
function BrandMark() {
    return (
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            <span className="flex size-6 items-center justify-center rounded bg-blue-900 text-[11px] font-bold text-white dark:bg-blue-600">OM</span>
            OpenMidmarket
        </Link>
    );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
    const pct = Math.round((current / total) * 100);
    return (
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <motion.div
                className="h-full rounded-full bg-blue-900 dark:bg-blue-500"
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
            />
        </div>
    );
}

/** A selectable option chip used for both single- and multi-select questions. */
function ChoiceButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={cn(
                "group flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all outline-none",
                "focus-visible:ring-[3px] focus-visible:ring-blue-900/30 dark:focus-visible:ring-blue-500/40",
                selected
                    ? "border-blue-900 bg-blue-900/5 text-gray-900 dark:border-blue-500 dark:bg-blue-500/10 dark:text-gray-100"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800/60",
            )}
        >
            <span className="font-medium">{label}</span>
            <span
                className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    selected ? "border-blue-900 bg-blue-900 text-white dark:border-blue-500 dark:bg-blue-500" : "border-gray-300 text-transparent dark:border-gray-600",
                )}
            >
                <Check className="size-3.5" />
            </span>
        </button>
    );
}

export function WaitlistForm() {
    const total = WAITLIST_QUESTIONS.length;
    const [stepIndex, setStepIndex] = React.useState(0);
    const [direction, setDirection] = React.useState(1);
    const [answers, setAnswers] = React.useState<WaitlistAnswers>(EMPTY_ANSWERS);
    const [error, setError] = React.useState<string | null>(null);
    const [status, setStatus] = React.useState<SubmitStatus>("idle");
    const [stateFilter, setStateFilter] = React.useState("");

    const question = WAITLIST_QUESTIONS[stepIndex];
    const isLast = stepIndex === total - 1;

    /** Validate the current step; returns an error message or null when valid. */
    const validate = React.useCallback(
        (q: WaitlistQuestion): string | null => {
            if (q.type === "email") {
                const email = answers.email.trim();
                if (!email) return "Please enter your email address.";
                if (!EMAIL_RE.test(email)) return "That doesn't look like a valid email.";
            }
            if (q.type === "multi" && q.required && answers[q.id].length === 0) {
                return "Please select at least one option.";
            }
            return null;
        },
        [answers],
    );

    const submit = React.useCallback(async () => {
        setStatus("submitting");
        setError(null);
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: answers.email.trim(),
                    roles: answers.roles,
                    states: answers.states,
                    asset_classes: answers.asset_classes,
                    deals_per_year: answers.deals_per_year,
                    objectives: answers.objectives.trim(),
                    referral: getWaitlistReferral(),
                }),
            });
            if (!res.ok) {
                const data = (await res.json().catch(() => null)) as { error?: string } | null;
                throw new Error(data?.error ?? "Something went wrong. Please try again.");
            }
            captureWaitlistSubmitted(answers.email.trim(), answers.roles);
            setStatus("success");
        } catch (err) {
            posthog.captureException(err);
            setStatus("error");
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        }
    }, [answers]);

    const goNext = React.useCallback(() => {
        const message = validate(question);
        if (message) {
            setError(message);
            return;
        }
        setError(null);
        if (isLast) {
            void submit();
            return;
        }
        captureWaitlistStepAdvanced(stepIndex, question.id, question.title, total);
        setDirection(1);
        setStateFilter("");
        setStepIndex((i) => Math.min(i + 1, total - 1));
    }, [validate, question, isLast, submit, total, stepIndex]);

    const goBack = React.useCallback(() => {
        setError(null);
        setDirection(-1);
        setStateFilter("");
        setStepIndex((i) => Math.max(i - 1, 0));
    }, []);

    const toggleMulti = React.useCallback((id: "roles" | "states" | "asset_classes", option: string) => {
        setError(null);
        setAnswers((prev) => {
            const current = prev[id];
            const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
            return { ...prev, [id]: next };
        });
    }, []);

    // Enter advances (except inside the multi-line objectives textarea, which
    // needs Enter for newlines — there, Cmd/Ctrl+Enter advances instead).
    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key !== "Enter") return;
        if (question.type === "longtext" && !(event.metaKey || event.ctrlKey)) return;
        event.preventDefault();
        goNext();
    };

    if (status === "success") {
        return <SuccessScreen />;
    }

    return (
        <div className="flex min-h-dvh flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
            <header className="mx-auto flex w-full max-w-xl items-center justify-between px-5 py-5">
                <BrandMark />
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    {stepIndex + 1} / {total}
                </span>
            </header>

            <div className="mx-auto w-full max-w-xl px-5">
                <ProgressBar current={stepIndex + 1} total={total} />
            </div>

            <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 py-8 sm:py-12" onKeyDown={onKeyDown}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={question.id}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -24 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="flex flex-col"
                    >
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{question.title}</h1>
                        {question.description ? <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{question.description}</p> : null}

                        <div className="mt-7">
                            <QuestionInput
                                question={question}
                                answers={answers}
                                setAnswers={setAnswers}
                                toggleMulti={toggleMulti}
                                stateFilter={stateFilter}
                                setStateFilter={setStateFilter}
                                clearError={() => setError(null)}
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>

                {error ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p> : null}

                <div className="mt-8 flex items-center gap-3">
                    {stepIndex > 0 ? (
                        <Button variant="outline" size="lg" onClick={goBack} disabled={status === "submitting"}>
                            <ArrowLeft className="size-4" />
                            Back
                        </Button>
                    ) : null}
                    <Button variant="primary" size="lg" onClick={goNext} disabled={status === "submitting"} className="min-w-32">
                        {status === "submitting" ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Submitting
                            </>
                        ) : isLast ? (
                            "Join waitlist"
                        ) : (
                            <>
                                Next
                                <ArrowRight className="size-4" />
                            </>
                        )}
                    </Button>
                    {!question.required && !isLast ? (
                        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                            Press <kbd className="rounded border border-gray-300 px-1 font-mono dark:border-gray-700">Enter</kbd>
                        </span>
                    ) : null}
                </div>
            </main>

            <footer className="mx-auto w-full max-w-xl px-5 py-6 text-xs text-gray-400 dark:text-gray-600">
                By joining, you agree to be contacted about early access to OpenMidmarket.
            </footer>
        </div>
    );
}

/** Renders the input surface for a single question. */
function QuestionInput({
    question,
    answers,
    setAnswers,
    toggleMulti,
    stateFilter,
    setStateFilter,
    clearError,
}: {
    question: WaitlistQuestion;
    answers: WaitlistAnswers;
    setAnswers: React.Dispatch<React.SetStateAction<WaitlistAnswers>>;
    toggleMulti: (id: "roles" | "states" | "asset_classes", option: string) => void;
    stateFilter: string;
    setStateFilter: (value: string) => void;
    clearError: () => void;
}) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Focus the text field when a text-entry question mounts.
    React.useEffect(() => {
        if (question.type === "email") inputRef.current?.focus();
    }, [question]);

    if (question.type === "email") {
        return (
            <input
                ref={inputRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={question.placeholder}
                value={answers.email}
                onChange={(e) => {
                    clearError();
                    setAnswers((prev) => ({ ...prev, email: e.target.value }));
                }}
                className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2 text-xl outline-none transition-colors placeholder:text-gray-300 focus:border-blue-900 dark:border-gray-800 dark:placeholder:text-gray-600 dark:focus:border-blue-500"
            />
        );
    }

    if (question.type === "longtext") {
        return (
            <Textarea
                placeholder={question.placeholder}
                value={answers.objectives}
                onChange={(e) => setAnswers((prev) => ({ ...prev, objectives: e.target.value }))}
                className="min-h-32 text-base"
            />
        );
    }

    if (question.type === "single") {
        return (
            <div className="flex flex-col gap-2.5">
                {question.options.map((option) => (
                    <ChoiceButton
                        key={option}
                        label={option}
                        selected={answers.deals_per_year === option}
                        onClick={() => {
                            clearError();
                            setAnswers((prev) => ({ ...prev, deals_per_year: prev.deals_per_year === option ? null : option }));
                        }}
                    />
                ))}
            </div>
        );
    }

    // Multi-select (roles, states, asset_classes).
    const selected = answers[question.id];
    const options = question.searchable && stateFilter.trim() ? question.options.filter((o) => o.toLowerCase().includes(stateFilter.trim().toLowerCase())) : question.options;

    return (
        <div className="flex flex-col gap-3">
            {question.searchable ? (
                <input
                    type="text"
                    placeholder="Search states…"
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900 focus:ring-[3px] focus:ring-blue-900/20 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/30"
                />
            ) : null}
            {question.searchable && selected.length > 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">{selected.length} selected</p>
            ) : null}
            <div className={cn("flex flex-col gap-2.5", question.searchable && "max-h-[46vh] overflow-y-auto pr-1")}>
                {options.map((option) => (
                    <ChoiceButton key={option} label={option} selected={selected.includes(option)} onClick={() => toggleMulti(question.id, option)} />
                ))}
                {options.length === 0 ? <p className="py-4 text-center text-sm text-gray-400">No matches.</p> : null}
            </div>
        </div>
    );
}

function SuccessScreen() {
    return (
        <div className="flex min-h-dvh flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
            <header className="mx-auto flex w-full max-w-xl items-center px-5 py-5">
                <BrandMark />
            </header>
            <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
                <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 18 }}
                    className="flex size-16 items-center justify-center rounded-full bg-blue-900/10 text-blue-900 dark:bg-blue-500/15 dark:text-blue-400"
                >
                    <CheckCircle2 className="size-9" />
                </motion.div>
                <h1 className="mt-6 text-3xl font-semibold tracking-tight">You&apos;re on the list</h1>
                <p className="mt-3 max-w-md text-gray-500 dark:text-gray-400">
                    Thanks for your interest in OpenMidmarket. We&apos;re rolling out early access in waves — keep an eye on your inbox for your invite.
                </p>
                <div className="mt-8 flex items-center gap-3">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/">Back to home</Link>
                    </Button>
                    <Button variant="primary" size="lg" asChild>
                        <a href={`${APP_ORIGIN}/login`}>Have a code? Log in</a>
                    </Button>
                </div>
            </main>
        </div>
    );
}
