"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, ShieldCheck, Clock, ArrowRight, Star, Gamepad2, Cpu, MonitorPlay } from "lucide-react";

const trustBadges = [
    { icon: ShieldCheck, text: "7-Point Certified" },
    { icon: Clock, text: "1-Hr Delivery" },
    { icon: Star, text: "4.9 Rating" },
];

const stats = [
    { value: "500+", label: "Consoles Delivered" },
    { value: "4.9★", label: "Average Rating" },
    { value: "1 Hr", label: "Avg Delivery Time" },
    { value: "100%", label: "Deposit Protected" },
];

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-12 px-4">

            {/* ==============================
          BACKGROUND LAYERS
      ============================== */}

            {/* Deep base sweep */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,rgba(99,102,241,0.25)_0%,transparent_60%)]" />

            {/* Left violet orb */}
            <div className="pointer-events-none absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.2)_0%,transparent_70%)] animate-orb-pulse" />

            {/* Right purple orb */}
            <div className="pointer-events-none absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.18)_0%,transparent_70%)] animate-orb-pulse [animation-delay:2s]" />

            {/* Center subtle bloom */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(129,140,248,0.08)_0%,transparent_70%)]" />

            {/* Grid overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(165,180,252,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(165,180,252,1) 1px, transparent 1px)
          `,
                    backgroundSize: "72px 72px",
                }}
            />

            {/* Diagonal beam top-right */}
            <div
                className="pointer-events-none absolute top-0 right-0 w-px h-[80vh] origin-top-right"
                style={{
                    background: "linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)",
                    transform: "rotate(-30deg) translateX(60px)",
                }}
            />
            <div
                className="pointer-events-none absolute top-0 right-0 w-px h-[60vh] origin-top-right"
                style={{
                    background: "linear-gradient(to bottom, rgba(168,85,247,0.3), transparent)",
                    transform: "rotate(-22deg) translateX(20px)",
                }}
            />

            {/* ==============================
          MAIN CONTENT
      ============================== */}
            <div className="relative z-10 max-w-7xl mx-auto w-full">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

                    {/* ── LEFT COLUMN: Text ── */}
                    <div className="flex-1 text-center lg:text-left">

                        {/* Live badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-indigo/30 bg-indigo/8 mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo opacity-70" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo" />
                            </span>
                            <span className="label text-indigo-300 tracking-widest text-[10px]">
                                Now Live in Pune · Zero Hassle Rentals
                            </span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="heading-xl mb-6"
                            style={{ lineHeight: 1.05 }}
                        >
                            <span
                                className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gradient-hero"
                                style={{
                                    backgroundImage: "linear-gradient(110deg, #fff 0%, #c4b5fd 40%, #a78bfa 70%, #818cf8 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Plug In.
                            </span>
                            <span
                                className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold"
                                style={{
                                    backgroundImage: "linear-gradient(110deg, #a78bfa 0%, #c084fc 50%, #e879f9 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Play Elite.
                            </span>
                            <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-400 mt-2">
                                No Excuses.
                            </span>
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-ink-muted max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0"
                        >
                            Pune&apos;s only premium console exchange. Rent a PS5 this weekend, sell your gear for top price,
                            or buy certified hardware — all at your doorstep in under an hour.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14"
                        >
                            {/* Primary CTA — indigo gradient */}
                            <Link
                                href="#inventory"
                                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo"
                                style={{ background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)" }}
                            >
                                {/* Animated shimmer */}
                                <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] bg-white/20 transition-transform duration-700" />
                                <Zap className="w-4 h-4" strokeWidth={2.5} />
                                Browse the Arsenal
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            {/* Secondary CTA */}
                            <Link
                                href="#value"
                                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 text-ink-muted hover:border-indigo/40 hover:text-white hover:bg-indigo/8 transition-all duration-200 font-medium"
                            >
                                Value My Console
                            </Link>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-5 justify-center lg:justify-start"
                        >
                            {trustBadges.map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-2 text-sm text-ink-muted">
                                    <div className="w-7 h-7 rounded-lg bg-indigo/10 border border-indigo/20 flex items-center justify-center">
                                        <Icon className="w-3.5 h-3.5 text-indigo-300" />
                                    </div>
                                    {text}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── RIGHT COLUMN: Visual ── */}
                    <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                        >

                            {/* Spinning outer ring */}
                            <div className="absolute inset-[-24px] rounded-3xl border border-indigo/10 animate-spin-slow" style={{ borderRadius: "28px" }} />
                            <div className="absolute inset-[-44px] rounded-3xl border border-purple/5 animate-spin-slow [animation-direction:reverse] [animation-duration:35s]" style={{ borderRadius: "40px" }} />

                            {/* Main card */}
                            <div
                                className="relative rounded-2xl overflow-hidden shadow-glow-hero"
                                style={{
                                    background: "linear-gradient(135deg, rgba(13,13,43,0.9) 0%, rgba(18,18,58,0.95) 100%)",
                                    border: "1px solid rgba(99,102,241,0.2)",
                                }}
                            >
                                {/* Header */}
                                <div className="relative px-5 py-4 border-b border-white/5 flex items-center justify-between"
                                    style={{ background: "rgba(99,102,241,0.06)" }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo" />
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/5 text-[10px] font-medium text-ink-muted">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo animate-pulse" />
                                        pgh.in
                                    </div>
                                    <div className="flex gap-1.5">
                                        <Gamepad2 className="w-3.5 h-3.5 text-indigo-400" />
                                    </div>
                                </div>

                                {/* Hero image area */}
                                <div className="relative flex flex-col items-center justify-center py-12 px-8 overflow-hidden">
                                    {/* Radial glow behind emoji */}
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(99,102,241,0.15)_0%,transparent_70%)]" />

                                    {/* Floating emoji console */}
                                    <motion.div
                                        animate={{ y: [-10, 10, -10] }}
                                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                        className="relative z-10 text-[100px] leading-none mb-6 drop-shadow-[0_0_40px_rgba(99,102,241,0.6)]"
                                    >
                                        🎮
                                    </motion.div>

                                    {/* Orbiting particles */}
                                    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                                        <motion.div
                                            key={deg}
                                            className={`absolute w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? "bg-indigo" : "bg-purple"}`}
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 8 + i, ease: "linear" }}
                                            style={{
                                                top: "50%",
                                                left: "50%",
                                                transformOrigin: `${60 + i * 8}px 0`,
                                                marginTop: "-3px",
                                                marginLeft: "-3px",
                                                opacity: 0.5 + i * 0.08,
                                            }}
                                        />
                                    ))}

                                    <h2 className="relative z-10 font-heading font-bold text-2xl text-white text-center">
                                        Sony PlayStation 5
                                    </h2>
                                    <p className="relative z-10 text-sm text-ink-muted text-center mt-1">Disc Edition · Certified Hardware</p>
                                </div>

                                {/* Spec pills */}
                                <div className="flex gap-2 flex-wrap px-5 pb-4">
                                    {[
                                        { icon: Cpu, label: "825GB NVMe" },
                                        { icon: MonitorPlay, label: "4K 120Hz" },
                                        { icon: ShieldCheck, label: "Certified" },
                                    ].map(({ icon: Icon, label }) => (
                                        <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo/20 bg-indigo/6 text-xs font-semibold text-indigo-300">
                                            <Icon className="w-3 h-3" />
                                            {label}
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing + CTA row */}
                                <div className="px-5 pb-5">
                                    <div
                                        className="rounded-xl p-4 flex items-center justify-between"
                                        style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}
                                    >
                                        <div>
                                            <p className="label text-indigo-400 text-[9px]">Rent from</p>
                                            <p className="text-2xl font-heading font-bold text-white">₹1,500<span className="text-sm font-normal text-ink-muted"> /wk</span></p>
                                        </div>
                                        <button
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:shadow-indigo hover:-translate-y-0.5"
                                            style={{ background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)" }}
                                        >
                                            <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
                                            Book
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Floating stat cards */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="absolute -left-12 top-1/2 -translate-y-1/2 hidden xl:block"
                            >
                                <div
                                    className="px-4 py-3 rounded-xl text-sm font-semibold text-white whitespace-nowrap shadow-purple"
                                    style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", backdropFilter: "blur(12px)" }}
                                >
                                    <p className="text-2xl font-heading font-bold text-gradient-aurora" style={{ backgroundImage: "linear-gradient(100deg, #a5b4fc, #c084fc, #f0abfc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>500+</p>
                                    <p className="label text-[9px] text-ink-muted">Deliveries Made</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.85, duration: 0.5 }}
                                className="absolute -right-14 top-1/3 hidden xl:block"
                            >
                                <div
                                    className="px-4 py-3 rounded-xl text-sm whitespace-nowrap shadow-indigo"
                                    style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", backdropFilter: "blur(12px)" }}
                                >
                                    <div className="flex items-center gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2.5 h-2.5 text-gold fill-gold" />)}
                                    </div>
                                    <p className="text-xs font-semibold text-white">4.9 / 5 Stars</p>
                                    <p className="label text-[9px] text-ink-muted">200+ Reviews</p>
                                </div>
                            </motion.div>

                            {/* Bottom glow */}
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-indigo/20 blur-[40px] rounded-full" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ==============================
          STAT STRIP
      ============================== */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="relative z-10 mt-20 max-w-4xl mx-auto w-full"
            >
                <div
                    className="rounded-2xl px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white/5"
                    style={{ background: "rgba(13,13,43,0.8)", border: "1px solid rgba(99,102,241,0.15)", backdropFilter: "blur(20px)" }}
                >
                    {stats.map(({ value, label }) => (
                        <div key={label} className="text-center px-4">
                            <p className="text-2xl font-heading font-bold" style={{ backgroundImage: "linear-gradient(110deg, #a5b4fc, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{value}</p>
                            <p className="label text-[9px] text-ink-muted mt-1">{label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

        </section>
    );
}
