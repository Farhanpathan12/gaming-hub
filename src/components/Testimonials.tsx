"use client";

import { motion } from "framer-motion";

const reviews = [
    {
        id: 1,
        name: "Rahul D.",
        role: "Casual Gamer — PS5 Rental",
        initial: "R",
        color: "#6366f1",
        accentBg: "rgba(99,102,241,0.12)",
        accentBorder: "rgba(99,102,241,0.25)",
        quote: "Rented a PS5 for the weekend to play Spider-Man 2. Console showed up in perfect condition, delivery guy even helped me set it up. 10/10.",
        stars: 5,
    },
    {
        id: 2,
        name: "Sneha P.",
        role: "Sold her PS4 Pro",
        initial: "S",
        color: "#a855f7",
        accentBg: "rgba(168,85,247,0.12)",
        accentBorder: "rgba(168,85,247,0.25)",
        quote: "Sold my PS4 in under 24 hours. Valuation was fair, they came to my house, paid me on spot via UPI. No drama. Using again for sure.",
        stars: 5,
    },
    {
        id: 3,
        name: "Vikram S.",
        role: "Monthly Renter",
        initial: "V",
        color: "#818cf8",
        accentBg: "rgba(129,140,248,0.12)",
        accentBorder: "rgba(129,140,248,0.25)",
        quote: "DualSense stick drift on Thursday night. Picked it up Friday morning, fixed it, returned Saturday afternoon. Absolutely insane turnaround.",
        stars: 5,
    },
];

export default function Testimonials() {
    return (
        <section className="py-28 px-4 relative overflow-hidden">

            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
                    style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Section label + heading — full-width banner style */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border label text-[10px] mb-6"
                        style={{ borderColor: "rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.08)", color: "#a5b4fc" }}
                    >
                        Verified Reviews
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ delay: 0.08 }}
                        className="heading-lg text-5xl sm:text-6xl text-white mb-5 leading-[1.05]"
                    >
                        They loved it.{" "}
                        <span style={{
                            backgroundImage: "linear-gradient(110deg, #a5b4fc, #c084fc 50%, #e879f9 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        }}>
                            You will too.
                        </span>
                    </motion.h2>

                    {/* Star row */}
                    <motion.div
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-2"
                    >
                        {[...Array(5)].map((_, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.25 + i * 0.06, type: "spring", stiffness: 300 }}
                                viewport={{ once: true }}
                                className="text-2xl"
                                style={{ color: "#a5b4fc" }}
                            >
                                ★
                            </motion.span>
                        ))}
                        <span className="text-sm text-ink-muted ml-3">4.9 / 5 · 200+ Gamers in Pune</span>
                    </motion.div>
                </div>

                {/* Cards — asymmetric masonry-like layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                    {reviews.map((r, i) => (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: i === 1 ? 24 : 0 }}  // middle card offset for masonry feel
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.13, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            style={{ marginTop: i === 1 ? "32px" : "0" }}
                            className="group relative rounded-3xl overflow-hidden transition-all duration-400 hover:-translate-y-2"
                        >
                            {/* Card background */}
                            <div className="absolute inset-0"
                                style={{ background: "linear-gradient(145deg, rgba(13,13,43,0.95) 0%, rgba(10,10,28,0.98) 100%)" }} />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: `radial-gradient(ellipse 80% 60% at 30% 20%, ${r.accentBg} 0%, transparent 70%)` }} />

                            {/* Border */}
                            <div className="absolute inset-0 rounded-3xl transition-all duration-300 pointer-events-none"
                                style={{ border: "1px solid rgba(30,30,74,0.8)" }} />
                            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                style={{ border: `1px solid ${r.accentBorder}` }} />

                            {/* Top color bar */}
                            <div className="h-1"
                                style={{ background: `linear-gradient(90deg, ${r.color}, ${r.color}50)` }} />

                            {/* Content */}
                            <div className="relative z-10 p-7">

                                {/* Large quote mark */}
                                <div className="text-8xl font-serif leading-none mb-2 select-none"
                                    style={{ color: `${r.color}20`, lineHeight: "0.7", fontFamily: "Georgia, serif" }}
                                >
                                    &ldquo;
                                </div>

                                {/* Review text */}
                                <p className="text-ink text-[15px] leading-relaxed mb-8 relative z-10">
                                    {r.quote}
                                </p>

                                {/* Stars */}
                                <div className="flex gap-0.5 mb-5">
                                    {[...Array(r.stars)].map((_, si) => (
                                        <span key={si} className="text-sm" style={{ color: r.color }}>★</span>
                                    ))}
                                </div>

                                {/* Author row */}
                                <div className="flex items-center gap-3 pt-5" style={{ borderTop: "1px solid rgba(30,30,74,0.8)" }}>
                                    <div
                                        className="w-10 h-10 rounded-2xl flex items-center justify-center font-heading font-extrabold text-sm flex-shrink-0"
                                        style={{ background: `linear-gradient(135deg, ${r.color} 0%, ${r.color}80 100%)`, color: "#fff", boxShadow: `0 0 16px ${r.color}40` }}
                                    >
                                        {r.initial}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{r.name}</p>
                                        <p className="text-xs text-ink-muted">{r.role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
