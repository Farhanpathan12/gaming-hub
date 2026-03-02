"use client";

import Link from "next/link";
import { Gamepad2, MapPin, ArrowRight, Twitter, Instagram } from "lucide-react";
import { motion } from "framer-motion";

const links = {
    Inventory: [
        { label: "PS5 Rentals", href: "#inventory" },
        { label: "PS4 Deals", href: "#inventory" },
        { label: "Game Library", href: "#inventory" },
        { label: "Controller Add-ons", href: "#inventory" },
    ],
    Services: [
        { label: "Doorstep Delivery", href: "#how-it-works" },
        { label: "Sell / Buyback", href: "#value" },
        { label: "Repairs", href: "#" },
        { label: "Monthly Plans", href: "#inventory" },
    ],
    Legal: [
        { label: "Terms of Service", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Rental Agreement", href: "#" },
        { label: "Refund Policy", href: "#" },
    ],
};

export default function Footer() {
    return (
        <footer style={{ background: "#07071a" }}>

            {/* Pre-footer CTA Banner */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-3xl overflow-hidden p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8"
                    style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.1) 50%, rgba(99,102,241,0.08) 100%)",
                        border: "1px solid rgba(99,102,241,0.25)",
                    }}
                >
                    {/* Ambient inside */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(ellipse at top right, rgba(168,85,247,0.2) 0%, transparent 70%)" }} />
                    <div className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(168,85,247,0.4), transparent)" }} />

                    <div className="relative z-10">
                        <p className="label text-[10px] mb-3" style={{ color: "#a5b4fc" }}>📍 Now serving all of Pune</p>
                        <h3 className="font-heading font-extrabold text-4xl md:text-5xl text-white leading-tight">
                            Ready to play<br />
                            <span style={{
                                backgroundImage: "linear-gradient(110deg, #a5b4fc, #c084fc 50%, #e879f9 100%)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                            }}>
                                like a pro?
                            </span>
                        </h3>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-3">
                        <Link
                            href="#inventory"
                            className="group flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white relative overflow-hidden transition-all hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 0 24px rgba(99,102,241,0.4)" }}
                        >
                            <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] bg-white/20 transition-transform duration-700" />
                            Browse Arsenal
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#value"
                            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-ink-muted hover:text-white transition-colors"
                            style={{ border: "1px solid rgba(99,102,241,0.3)" }}
                        >
                            Value My Console
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Main footer content */}
            <div style={{ borderTop: "1px solid rgba(30,30,74,0.6)" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 0 14px rgba(99,102,241,0.35)" }}>
                                    <Gamepad2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <span className="font-heading font-bold text-lg text-white tracking-tight block leading-none">PGH</span>
                                    <span className="label text-[9px]" style={{ color: "#a5b4fc" }}>Gaming Hub</span>
                                </div>
                            </Link>

                            <p className="text-sm text-ink-muted leading-relaxed max-w-xs mb-5">
                                Pune&apos;s only premium console exchange. Certified hardware, doorstep delivery, instant payouts.
                            </p>

                            <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-6">
                                <MapPin className="w-3.5 h-3.5" style={{ color: "#a5b4fc" }} />
                                Serving Pune, Maharashtra
                            </div>

                            <div className="flex gap-2.5">
                                {[Instagram, Twitter].map((Icon, i) => (
                                    <a key={i} href="#"
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-muted hover:text-indigo-300 transition-colors duration-200"
                                        style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Link cols */}
                        {Object.entries(links).map(([group, items]) => (
                            <div key={group}>
                                <h4 className="label text-[9px] text-ink-muted mb-5">{group}</h4>
                                <ul className="space-y-3">
                                    {items.map((item) => (
                                        <li key={item.label}>
                                            <Link href={item.href}
                                                className="text-sm text-ink-muted hover:text-white transition-colors duration-200 hover:pl-1 inline-block"
                                                style={{ transition: "color 0.2s, padding-left 0.2s" }}
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
                        style={{ borderTop: "1px solid rgba(30,30,74,0.6)" }}>
                        <p className="text-xs text-ink-faint">
                            © {new Date().getFullYear()} PGH Gaming Hub. Designed &amp; developed in Pune.
                        </p>
                        <div className="flex items-center gap-2">
                            {["UPI", "VISA", "MC", "Razorpay"].map((p) => (
                                <span key={p} className="px-2 py-1 rounded text-[9px] font-bold tracking-wider"
                                    style={{ border: "1px solid rgba(30,30,74,0.8)", color: "#334155" }}>
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
