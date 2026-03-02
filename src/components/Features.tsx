"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Truck, ShieldCheck, RefreshCw, Box, MessageCircle, ArrowRight } from "lucide-react";

const mainFeature = {
    num: "01",
    icon: Truck,
    title: "Doorstep. Every Time.",
    desc: "We pick up and deliver — anywhere in Pune. Console arrives tested, packed, and ready. You play. We handle the rest. It's that simple.",
    tag: "Core Experience",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.3)",
};

const sideFeatures = [
    {
        num: "02",
        icon: ShieldCheck,
        title: "7-Point Certified Hardware",
        desc: "Thermal check, stick drift, disc drive, HDMI, ports, storage, firmware. Every unit. Every time.",
        color: "#a855f7",
        glow: "rgba(168,85,247,0.25)",
    },
    {
        num: "03",
        icon: RefreshCw,
        title: "Instant Buybacks",
        desc: "Sell your console in 24 hours. We value it live, pick it up from you, and pay via UPI on the spot.",
        color: "#818cf8",
        glow: "rgba(129,140,248,0.25)",
    },
    {
        num: "04",
        icon: Box,
        title: "Full Game Library",
        desc: "Bundle games, controllers, or VR kits alongside your console rental. One booking. Full loadout.",
        color: "#c084fc",
        glow: "rgba(192,132,252,0.25)",
    },
    {
        num: "05",
        icon: MessageCircle,
        title: "Elite WhatsApp Support",
        desc: "Real humans. Instant responses. Any issue resolved within the hour — day or night.",
        color: "#6366f1",
        glow: "rgba(99,102,241,0.25)",
    },
];

function BigCard() {
    const Icon = mainFeature.icon;
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[340px]"
            style={{
                background: "linear-gradient(135deg, rgba(13,13,43,0.95) 0%, rgba(22,22,58,0.95) 100%)",
                border: "1px solid rgba(99,102,241,0.25)",
                boxShadow: "0 0 60px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
        >
            {/* Large decorative number */}
            <div
                className="absolute top-6 right-8 font-heading font-black text-[120px] leading-none select-none pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(180deg, rgba(99,102,241,0.15) 0%, transparent 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}
            >
                {mainFeature.num}
            </div>

            {/* Radial glow top-left */}
            <div className="absolute top-0 left-0 w-56 h-56 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse at top left, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />

            {/* Top border glow */}
            <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(168,85,247,0.4), transparent)" }} />

            <div className="relative z-10">
                {/* Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 label text-[9px]"
                    style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    {mainFeature.tag}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative"
                    style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 0 20px rgba(99,102,241,0.2)" }}>
                    <Icon className="w-6 h-6" style={{ color: "#818cf8" }} />
                </div>

                <h3 className="font-heading font-extrabold text-3xl text-white mb-3 leading-tight">
                    {mainFeature.title}
                </h3>
                <p className="text-ink-muted leading-relaxed max-w-md">{mainFeature.desc}</p>
            </div>

            <div className="relative z-10 mt-8">
                <button className="inline-flex items-center gap-2 text-sm font-semibold group"
                    style={{ color: "#a5b4fc" }}>
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}

function SmallCard({ feature, index }: { feature: typeof sideFeatures[0]; index: number }) {
    const Icon = feature.icon;
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
            className="group relative rounded-2xl p-6 flex gap-5 items-start overflow-hidden transition-all duration-300 cursor-default"
            style={{
                background: "rgba(10,10,30,0.8)",
                border: "1px solid rgba(30,30,74,0.8)",
                backdropFilter: "blur(16px)",
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
            {/* Left accent line */}
            <div className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full transition-all duration-300"
                style={{ background: `linear-gradient(to bottom, ${feature.color}60, transparent)`, opacity: 0 }}
                ref={(el) => {
                    if (el) {
                        el.parentElement?.addEventListener("mouseenter", () => { el.style.opacity = "1"; });
                        el.parentElement?.addEventListener("mouseleave", () => { el.style.opacity = "0"; });
                    }
                }}
            />

            {/* Hover bloom */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 60% 50% at 20% 50%, ${feature.glow} 0%, transparent 70%)` }} />

            {/* Icon */}
            <div className="relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}35` }}>
                <Icon className="w-5 h-5" style={{ color: feature.color }} />
                {/* Decorative number overlay */}
                <span className="absolute -top-2 -right-2 font-heading font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: feature.color, color: "#07071a" }}>
                    {feature.num.slice(1)}
                </span>
            </div>

            <div className="relative z-10">
                <h3 className="font-heading font-bold text-white text-base mb-1.5 leading-tight">{feature.title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{feature.desc}</p>
            </div>
        </motion.div>
    );
}

export default function Features() {
    return (
        <section id="how-it-works" className="py-28 px-4 relative overflow-hidden">
            {/* Section ambient */}
            <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Section header */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border label text-[10px] mb-6"
                        style={{ borderColor: "rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.08)", color: "#a5b4fc" }}
                    >
                        Why PGH?
                    </motion.div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.08 }}
                            className="heading-lg text-5xl sm:text-6xl text-white max-w-xl leading-[1.05]"
                        >
                            Built to be{" "}
                            <span style={{
                                backgroundImage: "linear-gradient(110deg, #a5b4fc 0%, #c084fc 55%, #e879f9 100%)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                            }}>
                                different.
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.18 }}
                            className="text-ink-muted max-w-sm leading-relaxed text-sm lg:text-right"
                        >
                            Every detail — from certification to delivery — is engineered to eliminate friction and deliver a premium experience.
                        </motion.p>
                    </div>
                </div>

                {/* Grid layout — big card left, 2x2 right */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                    <div className="lg:col-span-2">
                        <BigCard />
                    </div>
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {sideFeatures.map((f, i) => (
                            <SmallCard key={f.num} feature={f} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
