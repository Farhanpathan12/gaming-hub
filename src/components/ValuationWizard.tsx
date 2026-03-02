"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, ArrowRight, Zap, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Console = "PS4 Slim" | "PS4 Pro" | "PS5";
type Condition = "Like New" | "Good" | "Fair";

const consoles: { name: Console; emoji: string; desc: string }[] = [
    { name: "PS4 Slim", emoji: "🎮", desc: "Entry-level powerhouse" },
    { name: "PS4 Pro", emoji: "🕹️", desc: "4K gaming ready" },
    { name: "PS5", emoji: "🎯", desc: "Next-gen flagship" },
];

const conditions: { name: Condition; label: string; icon: string; sub: string }[] = [
    { name: "Like New", label: "Like New", icon: "✦", sub: "Flawless — no marks, no wear" },
    { name: "Good", label: "Good", icon: "◆", sub: "Minor signs, fully functional" },
    { name: "Fair", label: "Fair", icon: "◇", sub: "Visible wear, works perfectly" },
];

const valuations: Record<Console, Record<Condition, number>> = {
    "PS4 Slim": { "Like New": 8500, "Good": 7000, "Fair": 5500 },
    "PS4 Pro": { "Like New": 12000, "Good": 10000, "Fair": 7500 },
    "PS5": { "Like New": 28000, "Good": 24000, "Fair": 20000 },
};

export default function ValuationWizard() {
    const [step, setStep] = useState(0);
    const [selectedConsole, setSelectedConsole] = useState<Console | null>(null);
    const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const value = selectedConsole && selectedCondition ? valuations[selectedConsole][selectedCondition] : null;

    const reset = () => { setStep(0); setSelectedConsole(null); setSelectedCondition(null); setName(""); setPhone(""); setSubmitted(false); };

    const handleSchedulePickup = async () => {
        if (!name.trim() || !phone.trim()) return;
        setSubmitting(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from("valuation_leads").insert({
            user_id: user?.id || null,
            name: name.trim(),
            phone: phone.trim(),
            console: selectedConsole!,
            condition: selectedCondition!,
            estimated_val: value!,
            status: "new",
        });
        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <section id="value" className="py-28 px-4 relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="absolute -right-40 top-20 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(168,85,247,0.1) 0%, transparent 70%)" }} />
            <div className="absolute -left-20 bottom-0 w-[300px] h-[300px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Two-column layout: Left label + text, Right widget */}
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* LEFT — Section description */}
                    <div className="lg:w-2/5 lg:sticky lg:top-28">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border label text-[10px] mb-6"
                            style={{ borderColor: "rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.08)", color: "#c084fc" }}
                        >
                            <Sparkles className="w-3 h-3" />
                            Instant Valuation
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.08 }}
                            className="heading-lg text-5xl text-white mb-5 leading-[1.05]"
                        >
                            Know your{" "}
                            <br />
                            <span style={{
                                backgroundImage: "linear-gradient(110deg, #c084fc 0%, #a78bfa 60%, #818cf8 100%)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                            }}>
                                console&apos;s worth.
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.18 }}
                            className="text-ink-muted text-sm leading-relaxed mb-8"
                        >
                            Answer 2 quick questions. Get a live market-accurate offer in seconds.
                            No forms. No calls. No nonsense.
                        </motion.p>

                        {/* Steps indicator on desktop */}
                        <div className="hidden lg:flex flex-col gap-3">
                            {["Pick your console", "Tell us the condition", "Instant offer"].map((s, i) => (
                                <div key={s} className="flex items-center gap-3">
                                    <div
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300"
                                        style={
                                            i < step
                                                ? { background: "rgba(99,102,241,1)", color: "#fff" }
                                                : i === step
                                                    ? { background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.5)", color: "#a5b4fc" }
                                                    : { background: "rgba(13,13,43,0.6)", border: "1px solid rgba(30,30,74,0.8)", color: "#334155" }
                                        }
                                    >
                                        {i < step ? "✓" : i + 1}
                                    </div>
                                    <span className="text-sm" style={{ color: i <= step ? "#e2e8f0" : "#334155" }}>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — Interactive widget */}
                    <div className="lg:w-3/5 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 }}
                            className="relative rounded-3xl overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, rgba(13,13,43,0.95), rgba(18,18,50,0.98))",
                                border: "1px solid rgba(99,102,241,0.2)",
                                boxShadow: "0 0 80px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
                            }}
                        >
                            {/* Top shimmer */}
                            <div className="absolute top-0 left-0 right-0 h-px"
                                style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(99,102,241,0.5), transparent)" }} />

                            <div className="p-8">
                                <AnimatePresence mode="wait">

                                    {/* STEP 0 — Console Selection */}
                                    {step === 0 && (
                                        <motion.div key="s0"
                                            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                            <p className="text-xs text-ink-muted mb-6 label" style={{ color: "#a5b4fc" }}>Step 1 of 2 — Choose Console</p>
                                            <h3 className="font-heading font-bold text-2xl text-white mb-8">Which console are you selling?</h3>

                                            <div className="grid grid-cols-3 gap-4">
                                                {consoles.map((c) => (
                                                    <motion.button
                                                        key={c.name}
                                                        whileHover={{ scale: 1.03, y: -3 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => { setSelectedConsole(c.name); setStep(1); }}
                                                        className="relative flex flex-col items-center gap-3 p-6 rounded-2xl text-center transition-all duration-200 overflow-hidden group"
                                                        style={{
                                                            background: "rgba(7,7,26,0.8)",
                                                            border: "1px solid rgba(30,30,74,0.8)",
                                                        }}
                                                    >
                                                        {/* Hover glow */}
                                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />
                                                        {/* Top border on hover */}
                                                        <div className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                                                            style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.7), transparent)" }} />

                                                        <span className="text-5xl relative z-10">{c.emoji}</span>
                                                        <div className="relative z-10">
                                                            <p className="font-bold text-white text-sm">{c.name}</p>
                                                            <p className="text-[10px] text-ink-muted mt-0.5">{c.desc}</p>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 1 — Condition */}
                                    {step === 1 && (
                                        <motion.div key="s1"
                                            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                            <div className="flex items-center gap-3 mb-6">
                                                <button onClick={() => setStep(0)} className="text-ink-muted hover:text-white transition-colors">
                                                    <ArrowLeft className="w-4 h-4" />
                                                </button>
                                                <p className="text-xs label" style={{ color: "#a5b4fc" }}>Step 2 of 2 — Condition</p>
                                            </div>
                                            <h3 className="font-heading font-bold text-2xl text-white mb-2">
                                                What&apos;s the condition?
                                            </h3>
                                            <p className="text-sm text-ink-muted mb-8">
                                                Talking about your <span className="text-white font-semibold">{selectedConsole}</span>
                                            </p>

                                            <div className="flex flex-col gap-3">
                                                {conditions.map((cond) => (
                                                    <motion.button
                                                        key={cond.name}
                                                        whileHover={{ x: 4 }}
                                                        onClick={() => { setSelectedCondition(cond.name); setStep(2); }}
                                                        className="group flex items-center justify-between p-5 rounded-2xl text-left transition-all duration-200 overflow-hidden relative"
                                                        style={{
                                                            background: "rgba(7,7,26,0.8)",
                                                            border: "1px solid rgba(30,30,74,0.8)",
                                                        }}
                                                    >
                                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.08), transparent)" }} />
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            style={{ background: "linear-gradient(to bottom, #6366f1, #a855f7)" }} />

                                                        <div className="flex items-center gap-4 relative z-10">
                                                            <span className="text-2xl" style={{ color: "#a5b4fc" }}>{cond.icon}</span>
                                                            <div>
                                                                <p className="font-bold text-white">{cond.label}</p>
                                                                <p className="text-xs text-ink-muted mt-0.5">{cond.sub}</p>
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-ink-faint group-hover:text-indigo-400 group-hover:translate-x-1 transition-all relative z-10" />
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 2 — Result + contact */}
                                    {step === 2 && (
                                        <motion.div key="s2"
                                            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.4 }}>
                                            <div className="text-center py-4">
                                                {/* Glow ring */}
                                                <div className="relative w-24 h-24 mx-auto mb-8">
                                                    <div className="absolute inset-0 rounded-full animate-ping-slow"
                                                        style={{ background: "rgba(99,102,241,0.15)" }} />
                                                    <div className="absolute inset-2 rounded-full"
                                                        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)" }} />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Sparkles className="w-8 h-8" style={{ color: "#a5b4fc" }} />
                                                    </div>
                                                </div>

                                                <p className="label text-[10px] mb-3" style={{ color: "#c084fc" }}>
                                                    Estimated Buyback Offer
                                                </p>
                                                <motion.div
                                                    initial={{ scale: 0.7, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                                                    className="text-6xl font-heading font-extrabold mb-2 tracking-tight"
                                                    style={{
                                                        backgroundImage: "linear-gradient(110deg, #e0e7ff 0%, #a5b4fc 40%, #c084fc 80%, #f0abfc 100%)",
                                                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                                    }}
                                                >
                                                    ₹{value?.toLocaleString("en-IN")}
                                                </motion.div>
                                                <p className="text-sm text-ink-muted mb-8">
                                                    {selectedCondition} <span className="text-white">{selectedConsole}</span> · Live market rate
                                                </p>

                                                {/* Contact form to submit lead */}
                                                {submitted ? (
                                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                                        className="flex flex-col items-center gap-3 py-4">
                                                        <div className="w-14 h-14 rounded-full flex items-center justify-center"
                                                            style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                                                            <CheckCircle2 className="w-7 h-7" style={{ color: "#4ade80" }} />
                                                        </div>
                                                        <p className="font-bold text-white">Lead Submitted!</p>
                                                        <p className="text-sm text-ink-muted">We&apos;ll call you within 24 hours to schedule pickup in Pune.</p>
                                                        <button onClick={reset} className="mt-2 text-xs text-ink-faint hover:text-white transition-colors">← Start over</button>
                                                    </motion.div>
                                                ) : (
                                                    <div className="space-y-3 text-left">
                                                        <p className="text-xs text-ink-muted text-center mb-4">Enter your details to schedule a free doorstep pickup</p>
                                                        {[
                                                            { placeholder: "Your Name", val: name, fn: setName, type: "text" },
                                                            { placeholder: "WhatsApp Number", val: phone, fn: setPhone, type: "tel" },
                                                        ].map(({ placeholder, val, fn, type }) => (
                                                            <input key={placeholder} type={type} value={val} placeholder={placeholder}
                                                                onChange={(e) => fn(e.target.value)}
                                                                className="w-full px-4 py-3 rounded-xl text-sm text-ink focus:outline-none"
                                                                style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)", colorScheme: "dark" }}
                                                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
                                                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(30,30,74,0.9)"; }} />
                                                        ))}
                                                        <div className="flex gap-3 pt-2">
                                                            <button
                                                                onClick={handleSchedulePickup}
                                                                disabled={submitting || !name.trim() || !phone.trim()}
                                                                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-white disabled:opacity-60 relative overflow-hidden group transition-all hover:-translate-y-0.5"
                                                                style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 0 24px rgba(99,102,241,0.4)" }}
                                                            >
                                                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" strokeWidth={2.5} />}
                                                                {submitting ? "Submitting..." : "Schedule Pickup"}
                                                            </button>
                                                            <button onClick={reset}
                                                                className="px-5 py-3.5 rounded-xl text-ink-muted text-sm font-medium hover:text-white transition-colors"
                                                                style={{ border: "1px solid rgba(30,30,74,0.8)" }}>
                                                                Reset
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
