"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, MonitorPlay, Cpu, Gamepad, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
    const [activeTab, setActiveTab] = useState<"rent" | "buy">("rent");
    const [activeThumb, setActiveThumb] = useState(0);

    const product = {
        name: "Sony PlayStation 5",
        edition: "Disc Edition",
        availableText: "In Stock · 1-Hour Delivery",
        rentPrice: "₹1,500",
        rentPeriod: "/weekend",
        securityDeposit: "₹5,000",
        buyPrice: "₹38,000",
        buyCondition: "Certified Pre-Owned",
        emojis: ["🎮", "🕹️", "📦", "🎯"],
        specs: [
            { icon: Cpu, label: "825GB NVMe SSD" },
            { icon: MonitorPlay, label: "4K @ 120Hz" },
            { icon: ShieldCheck, label: "Ray Tracing" },
            { icon: Gamepad, label: "DualSense Included" },
        ],
    };

    return (
        <main className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
            {/* Background */}
            <div className="pointer-events-none fixed top-0 left-1/4 w-[600px] h-[500px] bg-violet/8 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-ink-muted mb-8 pt-4">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="#inventory" className="hover:text-white transition-colors">Arsenal</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-ink">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-14 lg:gap-20">

                    {/* Left: Visual */}
                    <div className="w-full lg:w-1/2 lg:sticky lg:top-24 h-fit">
                        {/* Main image */}
                        <motion.div
                            animate={{ y: [-8, 8, -8] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="relative w-full aspect-square rounded-2xl bg-[#111121] border border-[#252540] flex items-center justify-center overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)] mb-4"
                        >
                            {/* Atmospheric glow */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,92,246,0.1)_0%,_transparent_70%)]" />
                            {/* Top border light */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet/60 to-transparent" />
                            <span className="text-[120px] z-10">{product.emojis[activeThumb]}</span>
                        </motion.div>

                        {/* Thumbnails */}
                        <div className="flex gap-3">
                            {product.emojis.map((emoji, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveThumb(i)}
                                    className={`flex-1 aspect-square rounded-xl border flex items-center justify-center text-3xl transition-all duration-200 ${activeThumb === i
                                            ? "border-gold bg-gold/10 shadow-gold-sm"
                                            : "border-[#252540] bg-[#111121] hover:border-[#3d4663]"
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="w-full lg:w-1/2 flex flex-col">

                        {/* Availability badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet/70" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet" />
                            </span>
                            <span className="text-xs font-semibold text-violet">{product.availableText}</span>
                        </div>

                        {/* Title */}
                        <h1 className="heading-xl text-4xl sm:text-5xl text-white mb-2">{product.name}</h1>
                        <p className="text-xl text-ink-muted font-medium mb-10">{product.edition}</p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-10">
                            {product.specs.map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="panel rounded-xl p-4 flex items-center gap-3 group hover:border-violet/40 hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4 text-violet flex-shrink-0" />
                                    <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Tab toggle */}
                        <div className="panel rounded-2xl p-5 mb-6">
                            <div className="flex gap-1 p-1 rounded-xl bg-[#09090f] border border-[#252540] mb-5">
                                {(["rent", "buy"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === tab
                                                ? tab === "rent"
                                                    ? "bg-violet text-white shadow-violet"
                                                    : "bg-gold text-[#09090f] shadow-gold-sm"
                                                : "text-ink-muted hover:text-ink"
                                            }`}
                                    >
                                        {tab === "rent" ? "Rent" : "Buy"}
                                    </button>
                                ))}
                            </div>

                            {activeTab === "rent" ? (
                                <div className="text-center">
                                    <div className="flex items-baseline justify-center gap-1.5 mb-2">
                                        <span className="text-5xl font-heading font-bold text-white">{product.rentPrice}</span>
                                        <span className="text-ink-muted">{product.rentPeriod}</span>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet mt-1">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        {product.securityDeposit} refundable deposit
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <span className="text-5xl font-heading font-bold text-gradient-gold">{product.buyPrice}</span>
                                    <p className="text-sm text-ink-muted mt-2">{product.buyCondition} · Certified Hardware</p>
                                </div>
                            )}
                        </div>

                        {/* CTA */}
                        <button className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gold-gradient text-[#09090f] font-bold text-base shadow-gold hover:shadow-[0_0_40px_rgba(245,200,66,0.5)] transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group mb-3">
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                            {/* Shine */}
                            <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[200%] bg-white/20 transition-transform duration-700" />
                            <Zap className="w-4 h-4" strokeWidth={2.5} />
                            {activeTab === "rent" ? "Book for Rental" : "Purchase Now"}
                        </button>
                        <p className="text-center text-xs text-ink-muted">
                            Free doorstep delivery in Pune · Secure checkout via Razorpay
                        </p>
                    </div>

                </div>
            </div>
        </main>
    );
}
