"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Smartphone, PackageCheck, Gamepad2, Undo2 } from "lucide-react";

const steps = [
    {
        num: "01",
        icon: Smartphone,
        title: "Choose Your Console",
        desc: "Browse the arsenal. Pick your PS5, PS4 Pro, or any game. Rent by the week or buy outright.",
        color: "#6366f1",
        glow: "rgba(99,102,241,0.25)",
        bg: "rgba(99,102,241,0.08)",
        border: "rgba(99,102,241,0.25)",
    },
    {
        num: "02",
        icon: PackageCheck,
        title: "We Verify & Pack",
        desc: "Every unit clears our 7-point hardware check — stick drift, thermals, ports, firmware — before it ships.",
        color: "#a855f7",
        glow: "rgba(168,85,247,0.25)",
        bg: "rgba(168,85,247,0.08)",
        border: "rgba(168,85,247,0.25)",
    },
    {
        num: "03",
        icon: Gamepad2,
        title: "Doorstep in 1 Hour",
        desc: "Our guy shows up at your door, sets it up live, hands you the controller. You play. Zero friction.",
        color: "#818cf8",
        glow: "rgba(129,140,248,0.25)",
        bg: "rgba(129,140,248,0.08)",
        border: "rgba(129,140,248,0.25)",
    },
    {
        num: "04",
        icon: Undo2,
        title: "Return & Refund",
        desc: "We collect it back on schedule. Your security deposit hits your UPI within 24 hours. Done.",
        color: "#c084fc",
        glow: "rgba(192,132,252,0.25)",
        bg: "rgba(192,132,252,0.08)",
        border: "rgba(192,132,252,0.25)",
    },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
    const Icon = step.icon;
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col group"
        >
            {/* Connector line (hidden on last item + on mobile) */}
            {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+44px)] right-[-calc(50%-44px)] h-px z-0"
                    style={{
                        background: `linear-gradient(90deg, ${step.color}60, ${steps[index + 1].color}30)`,
                        width: "calc(100% - 88px)",
                        left: "calc(50% + 36px)",
                    }}
                >
                    {/* Animated travel dot */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                        style={{ background: step.color, boxShadow: `0 0 8px ${step.glow}` }}
                        animate={{ left: ["0%", "100%"] }}
                        transition={{ duration: 2.5, delay: 1 + index * 0.4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                    />
                </div>
            )}

            {/* Card */}
            <div
                className="relative rounded-3xl p-7 flex flex-col gap-5 overflow-hidden transition-all duration-400 group-hover:-translate-y-2"
                style={{
                    background: "rgba(10,10,28,0.85)",
                    border: `1px solid ${step.border}`,
                    backdropFilter: "blur(20px)",
                }}
            >
                {/* BG glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                    style={{ background: `radial-gradient(ellipse 80% 60% at 30% 0%, ${step.bg} 0%, transparent 70%)` }} />

                {/* Top shimmer bar */}
                <div className="absolute top-0 left-8 right-8 h-px opacity-60"
                    style={{ background: `linear-gradient(90deg, transparent, ${step.color}, transparent)` }} />

                {/* Number + Icon row */}
                <div className="flex items-center gap-4 relative z-10">
                    {/* Big decorative number */}
                    <div className="font-heading font-black text-5xl leading-none select-none"
                        style={{
                            backgroundImage: `linear-gradient(135deg, ${step.color} 0%, ${step.color}40 100%)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        {step.num}
                    </div>

                    {/* Icon bubble */}
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                        style={{
                            background: step.bg,
                            border: `1px solid ${step.border}`,
                            boxShadow: `0 0 20px ${step.glow}`,
                        }}
                    >
                        <Icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                </div>

                {/* Text */}
                <div className="relative z-10">
                    <h3 className="font-heading font-bold text-white text-xl mb-2">{step.title}</h3>
                    <p className="text-ink-muted text-sm leading-relaxed">{step.desc}</p>
                </div>

                {/* Bottom accent dot */}
                <div className="flex items-center gap-2 relative z-10">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: step.color }} />
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${step.color}40, transparent)` }} />
                </div>
            </div>
        </motion.div>
    );
}

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-28 px-4 relative overflow-hidden">
            {/* Ambient BG */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/3 w-[500px] h-[300px] rounded-full"
                    style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] rounded-full"
                    style={{ background: "radial-gradient(ellipse at center, rgba(168,85,247,0.07) 0%, transparent 70%)" }} />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border label text-[10px] mb-6"
                        style={{ borderColor: "rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.08)", color: "#a5b4fc" }}
                    >
                        The Process
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 }}
                        className="heading-lg text-5xl sm:text-6xl text-white mb-5 leading-[1.05]"
                    >
                        How it{" "}
                        <span style={{
                            backgroundImage: "linear-gradient(110deg, #a5b4fc 0%, #c084fc 55%, #e879f9 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}>
                            works.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.18 }}
                        className="text-ink-muted max-w-lg mx-auto leading-relaxed"
                    >
                        From booking to playing — in under an hour. We handle everything in between.
                    </motion.p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
                    {steps.map((step, i) => (
                        <StepCard key={step.num} step={step} index={i} />
                    ))}
                </div>

                {/* Bottom CTA strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
                >
                    <p className="text-ink-muted text-sm">Takes less than 2 minutes to book.</p>
                    <a
                        href="#inventory"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm relative overflow-hidden transition-all hover:-translate-y-0.5"
                        style={{
                            background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                            boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                        }}
                    >
                        <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] bg-white/20 transition-transform duration-700" />
                        Start Booking Now ⚡
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
