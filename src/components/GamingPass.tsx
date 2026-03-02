"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RefreshCw, CheckCircle2, Loader2, X, Disc3 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const PLANS = [
    {
        key: "monthly",
        label: "Monthly",
        price: "₹499",
        period: "/mo",
        badge: null,
        desc: "Unlimited disc swaps for 30 days",
        color: "#6366f1",
        glow: "rgba(99,102,241,0.3)",
    },
    {
        key: "quarterly",
        label: "Quarterly",
        price: "₹1,199",
        period: "/3 mo",
        badge: "Save ₹300",
        desc: "Unlimited disc swaps for 90 days",
        color: "#a855f7",
        glow: "rgba(168,85,247,0.3)",
    },
] as const;

const PERKS = [
    "Unlimited game disc swaps",
    "Swap up to 2 games at once",
    "Free doorstep pickup & delivery",
    "Access to 100+ game titles",
    "Priority support on WhatsApp",
];

type PlanKey = "monthly" | "quarterly";
type ModalState = "idle" | "loading" | "success" | "auth_required";

export default function GamingPass() {
    const router = useRouter();
    const [selected, setSelected] = useState<PlanKey>("monthly");
    const [modal, setModal] = useState(false);
    const [modalState, setModalState] = useState<ModalState>("idle");

    const handleSubscribe = async () => {
        setModalState("loading");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setModalState("auth_required");
            return;
        }

        // Check if already has an active pass
        const { data: existing } = await supabase
            .from("gaming_passes")
            .select("id, status")
            .eq("user_id", user.id)
            .eq("status", "active")
            .single();

        if (existing) {
            setModalState("success");
            return;
        }

        const days = selected === "monthly" ? 30 : 90;
        const endsAt = new Date();
        endsAt.setDate(endsAt.getDate() + days);

        await supabase.from("gaming_passes").insert({
            user_id: user.id,
            plan: selected,
            status: "active",
            starts_at: new Date().toISOString().split("T")[0],
            ends_at: endsAt.toISOString().split("T")[0],
        });

        setModalState("success");
    };

    const plan = PLANS.find(p => p.key === selected)!;

    return (
        <section id="pass" className="py-28 px-4 relative overflow-hidden">
            {/* Ambient */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(168,85,247,0.08) 0%, transparent 65%)" }} />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Section header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border label text-[10px] mb-6"
                        style={{ borderColor: "rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.08)", color: "#c084fc" }}>
                        <Disc3 className="w-3 h-3" />
                        Gaming Pass
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.07 }}
                        className="heading-lg text-4xl sm:text-5xl text-white mb-4 leading-[1.1]">
                        Unlimited Games.{" "}
                        <span style={{
                            backgroundImage: "linear-gradient(110deg, #c084fc 0%, #a78bfa 50%, #818cf8 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        }}>One flat price.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                        viewport={{ once: true }} transition={{ delay: 0.15 }}
                        className="text-ink-muted text-sm max-w-md mx-auto">
                        Swap game discs as many times as you want. No late fees. No per-game charges. Just play.
                    </motion.p>
                </div>

                {/* Main bento */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* LEFT — Perks */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.55 }}
                        className="rounded-3xl p-8 relative overflow-hidden"
                        style={{ background: "linear-gradient(135deg, rgba(13,13,43,0.98), rgba(18,18,55,0.95))", border: "1px solid rgba(99,102,241,0.2)" }}>
                        <div className="absolute top-0 left-0 right-0 h-px"
                            style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.7), rgba(99,102,241,0.6), transparent)" }} />
                        <div className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full pointer-events-none"
                            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />

                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                            style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)" }}>
                            <Disc3 className="w-7 h-7" style={{ color: "#c084fc" }} />
                        </div>

                        <h3 className="font-heading font-extrabold text-2xl text-white mb-2">
                            The Pass Includes
                        </h3>
                        <p className="text-ink-muted text-sm mb-8">Everything you need, nothing you don&apos;t.</p>

                        <ul className="space-y-4">
                            {PERKS.map((perk, i) => (
                                <motion.li key={perk}
                                    initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }} transition={{ delay: 0.05 * i }}
                                    className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)" }}>
                                        <CheckCircle2 className="w-3 h-3" style={{ color: "#a5b4fc" }} />
                                    </div>
                                    <span className="text-sm text-ink-muted">{perk}</span>
                                </motion.li>
                            ))}
                        </ul>

                        <div className="mt-8 pt-6 flex items-center gap-2 text-xs text-ink-faint"
                            style={{ borderTop: "1px solid rgba(30,30,74,0.8)" }}>
                            <RefreshCw className="w-3.5 h-3.5" style={{ color: "#6366f1" }} />
                            Cancel anytime · No contracts
                        </div>
                    </motion.div>

                    {/* RIGHT — Plan selector + CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08 }}>

                        {/* Plan toggle */}
                        <div className="flex gap-3 mb-6">
                            {PLANS.map((p) => (
                                <button key={p.key} onClick={() => setSelected(p.key)}
                                    className="flex-1 relative rounded-2xl p-5 text-left transition-all duration-300"
                                    style={selected === p.key
                                        ? { background: `linear-gradient(135deg, ${p.color}22, ${p.color}10)`, border: `1px solid ${p.color}50`, boxShadow: `0 0 24px ${p.glow}` }
                                        : { background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)" }}>
                                    {p.badge && (
                                        <span className="absolute -top-2.5 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full text-white label"
                                            style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}>
                                            {p.badge}
                                        </span>
                                    )}
                                    <p className="text-xs text-ink-muted mb-1">{p.label}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-heading font-extrabold text-3xl text-white">{p.price}</span>
                                        <span className="text-xs text-ink-muted">{p.period}</span>
                                    </div>
                                    <p className="text-xs text-ink-faint mt-1.5">{p.desc}</p>
                                </button>
                            ))}
                        </div>

                        {/* Preview card */}
                        <div className="rounded-2xl p-6 mb-5 relative overflow-hidden"
                            style={{ background: "rgba(10,10,28,0.95)", border: "1px solid rgba(30,30,74,0.8)" }}>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="label text-[9px] mb-1" style={{ color: "#a5b4fc" }}>Gaming Pass · {plan.label}</p>
                                    <p className="font-heading font-extrabold text-xl text-white">{plan.price}<span className="text-sm font-normal text-ink-muted">{plan.period}</span></p>
                                </div>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ background: `${plan.color}18`, border: `1px solid ${plan.color}30` }}>
                                    <Disc3 className="w-6 h-6" style={{ color: plan.color }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                {["Disc swaps", "Titles available", "Delivery"].map((r, i) => (
                                    <div key={r} className="flex justify-between text-xs">
                                        <span className="text-ink-muted">{r}</span>
                                        <span className="text-white font-semibold">{["Unlimited", "100+", "Free doorstep"][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <button onClick={() => { setModal(true); setModalState("idle"); }}
                            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-white relative overflow-hidden group transition-all duration-300 hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: "0 0 32px rgba(99,102,241,0.4)" }}>
                            <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] bg-white/20 transition-transform duration-700" />
                            <Zap className="w-4 h-4" strokeWidth={2.5} />
                            Activate Gaming Pass — {plan.price}{plan.period}
                        </button>
                        <p className="text-center text-xs text-ink-faint mt-3">Pune only · Doorstep swap · Cancel anytime</p>
                    </motion.div>
                </div>
            </div>

            {/* ── Subscribe Modal ── */}
            <AnimatePresence>
                {modal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => { if (modalState !== "loading") setModal(false); }}
                            className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm" />

                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                            <div className="w-full max-w-sm rounded-2xl overflow-hidden"
                                style={{ background: "#0a0a1e", border: "1px solid rgba(168,85,247,0.35)" }}>
                                <div className="h-1" style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />
                                <div className="p-6">

                                    {/* Idle — confirm */}
                                    {modalState === "idle" && (
                                        <>
                                            <div className="flex items-center justify-between mb-5">
                                                <div>
                                                    <h3 className="font-heading font-bold text-white">Activate Gaming Pass</h3>
                                                    <p className="text-xs text-ink-muted mt-0.5">{plan.label} · {plan.price}{plan.period}</p>
                                                </div>
                                                <button onClick={() => setModal(false)}
                                                    className="w-8 h-8 rounded-xl flex items-center justify-center text-ink-muted hover:text-white"
                                                    style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="rounded-xl p-4 mb-5 space-y-2"
                                                style={{ background: "rgba(7,7,26,0.8)", border: "1px solid rgba(30,30,74,0.9)" }}>
                                                {[
                                                    { l: "Plan", v: plan.label },
                                                    { l: "Price", v: `${plan.price}${plan.period}` },
                                                    { l: "Disc Swaps", v: "Unlimited" },
                                                    { l: "Delivery", v: "Free doorstep" },
                                                ].map(({ l, v }) => (
                                                    <div key={l} className="flex justify-between text-sm">
                                                        <span className="text-ink-muted">{l}</span>
                                                        <span className="text-white font-semibold">{v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-ink-faint mb-4 text-center">
                                                Our team will contact you on WhatsApp to collect payment & schedule first delivery.
                                            </p>
                                            <button onClick={handleSubscribe}
                                                className="w-full py-3 rounded-xl font-bold text-white"
                                                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
                                                Confirm Subscription
                                            </button>
                                        </>
                                    )}

                                    {/* Loading */}
                                    {modalState === "loading" && (
                                        <div className="flex flex-col items-center gap-4 py-8">
                                            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#a5b4fc" }} />
                                            <p className="text-ink-muted text-sm">Activating your pass...</p>
                                        </div>
                                    )}

                                    {/* Success */}
                                    {modalState === "success" && (
                                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center gap-4 py-8 text-center">
                                            <div className="w-16 h-16 rounded-full flex items-center justify-center"
                                                style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)" }}>
                                                <CheckCircle2 className="w-8 h-8" style={{ color: "#a5b4fc" }} />
                                            </div>
                                            <div>
                                                <p className="font-heading font-bold text-white text-lg">Pass Activated! 🎮</p>
                                                <p className="text-xs text-ink-muted mt-1.5">We&apos;ll WhatsApp you within 24 hours to collect payment &amp; schedule your first disc swap.</p>
                                            </div>
                                            <button onClick={() => { setModal(false); router.push("/dashboard"); }}
                                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white mt-2"
                                                style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
                                                View in Dashboard →
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Auth required */}
                                    {modalState === "auth_required" && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="flex flex-col items-center gap-4 py-6 text-center">
                                            <p className="text-3xl">🔐</p>
                                            <div>
                                                <p className="font-bold text-white">Login Required</p>
                                                <p className="text-xs text-ink-muted mt-1">Please create an account to activate your Gaming Pass.</p>
                                            </div>
                                            <div className="flex gap-3 w-full">
                                                <button onClick={() => router.push("/signup")}
                                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                                                    style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
                                                    Sign Up
                                                </button>
                                                <button onClick={() => router.push("/login")}
                                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-ink-muted hover:text-white transition-colors"
                                                    style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                                    Login
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
