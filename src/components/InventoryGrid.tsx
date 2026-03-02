"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Zap, Tag, ArrowRight, Loader2 } from "lucide-react";
import BookingDrawer from "./BookingDrawer";
import { createClient } from "@/lib/supabase/client";

type FilterKey = "all" | "consoles" | "games" | "accessories";

const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "consoles", label: "Consoles" },
    { key: "accessories", label: "Accessories" },
    { key: "games", label: "Games" },
];

interface Product {
    id: string;
    name: string;
    edition: string;
    category: FilterKey;
    rent_price: number | null;
    rent_period: string | null;
    buy_price: number | null;
    badge: string | null;
    badge_color: string;
    emoji: string;
    certified: boolean;
    available: boolean;
}

const colorMap: Record<string, string> = {
    indigo: "#6366f1",
    purple: "#a855f7",
    violet: "#818cf8",
};

// Fallback static data shown while loading
const skeletons = Array.from({ length: 8 });

export default function InventoryGrid() {
    const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Product | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase
            .from("products")
            .select("*")
            .eq("available", true)
            .order("created_at", { ascending: true })
            .then(({ data, error }) => {
                if (!error && data) setProducts(data as Product[]);
                setLoading(false);
            });
    }, []);

    const filtered = activeFilter === "all"
        ? products
        : products.filter((p) => p.category === activeFilter);

    const openDrawer = (p: Product) => { setSelectedItem(p); setDrawerOpen(true); };

    const formatPrice = (amount: number | null, period?: string | null) => {
        if (!amount) return null;
        return `₹${amount.toLocaleString("en-IN")}${period || ""}`;
    };

    return (
        <section id="inventory" className="py-28 px-4 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[600px] h-[300px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border label text-[10px] mb-5"
                            style={{ borderColor: "rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.08)", color: "#a5b4fc" }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                            Live Inventory
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: 0.08 }}
                            className="heading-lg text-5xl sm:text-6xl text-white leading-[1.05]"
                        >
                            Available{" "}
                            <span style={{
                                backgroundImage: "linear-gradient(110deg, #a5b4fc 0%, #c084fc 55%, #e879f9 100%)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                            }}>Arsenal.</span>
                        </motion.h2>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 flex-wrap">
                        {filters.map((f) => (
                            <button key={f.key} onClick={() => setActiveFilter(f.key)}
                                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                                style={activeFilter === f.key
                                    ? { background: "linear-gradient(135deg, #6366f1, #7c3aed)", color: "#fff", boxShadow: "0 0 16px rgba(99,102,241,0.35)" }
                                    : { border: "1px solid rgba(30,30,74,0.8)", color: "#94a3b8" }
                                }>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    // Skeleton loader
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {skeletons.map((_, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                                style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)", height: "340px" }}>
                                <div className="h-1 bg-indigo-900/50" />
                                <div className="h-48 m-4 rounded-xl bg-indigo-950/50" />
                                <div className="px-4 space-y-2">
                                    <div className="h-3 rounded bg-indigo-950/50 w-2/3" />
                                    <div className="h-5 rounded bg-indigo-950/50 w-4/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((product, i) => {
                                const color = colorMap[product.badge_color] || "#6366f1";
                                const isHovered = hoveredId === product.id;
                                const rentStr = formatPrice(product.rent_price, product.rent_period);
                                const buyStr = formatPrice(product.buy_price);

                                return (
                                    <motion.div
                                        layout key={product.id}
                                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.92 }}
                                        transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="relative rounded-2xl overflow-hidden flex flex-col cursor-pointer group"
                                        style={{
                                            background: "rgba(10,10,28,0.9)",
                                            border: isHovered ? `1px solid ${color}50` : "1px solid rgba(30,30,74,0.8)",
                                            boxShadow: isHovered ? `0 0 40px ${color}20, 0 8px 32px rgba(0,0,0,0.4)` : "0 4px 20px rgba(0,0,0,0.3)",
                                            transition: "border 0.25s, box-shadow 0.25s",
                                        }}
                                        onHoverStart={() => setHoveredId(product.id)}
                                        onHoverEnd={() => setHoveredId(null)}
                                    >
                                        {/* Top color stripe */}
                                        <div className="h-1 transition-all duration-300"
                                            style={{ background: `linear-gradient(90deg, ${color}, ${color}80)`, opacity: isHovered ? 1 : 0.4 }} />

                                        {/* Image zone */}
                                        <div className="relative h-48 flex items-center justify-center overflow-hidden"
                                            style={{ background: `radial-gradient(ellipse at center, ${color}10 0%, rgba(7,7,26,0.8) 70%)` }}>
                                            <motion.span className="text-7xl z-10 select-none"
                                                animate={isHovered ? { y: [-4, 4, -4], transition: { repeat: Infinity, duration: 2.5 } } : { y: 0 }}>
                                                {product.emoji}
                                            </motion.span>
                                            {product.badge && (
                                                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full label text-[9px]"
                                                    style={{ background: `${color}20`, color: color, border: `1px solid ${color}40` }}>
                                                    <Tag className="w-2.5 h-2.5" />{product.badge}
                                                </div>
                                            )}
                                            {product.certified && (
                                                <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                                                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                                                    <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#a5b4fc" }} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="mb-4">
                                                <p className="text-xs text-ink-muted mb-0.5">{product.edition}</p>
                                                <h3 className="font-heading font-bold text-white text-lg leading-tight">{product.name}</h3>
                                            </div>

                                            <div className="flex items-end justify-between mb-5">
                                                {rentStr && (
                                                    <div>
                                                        <p className="label text-[9px] text-ink-muted mb-1">Rent from</p>
                                                        <div className="flex items-baseline gap-0.5">
                                                            <span className="font-heading font-bold text-xl" style={{ color }}>{rentStr}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {buyStr && (
                                                    <div className={rentStr ? "text-right" : ""}>
                                                        <p className="label text-[9px] text-ink-muted mb-1">Buy</p>
                                                        <span className="text-sm font-semibold text-ink">{buyStr}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <button onClick={() => openDrawer(product)}
                                                className="mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 group/btn relative overflow-hidden"
                                                style={{
                                                    background: isHovered ? `${color}20` : "rgba(7,7,26,0.8)",
                                                    border: `1px solid ${isHovered ? `${color}50` : "rgba(30,30,74,0.8)"}`,
                                                    color: isHovered ? color : "#94a3b8",
                                                }}>
                                                <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
                                                Book Now
                                                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {filtered.length === 0 && !loading && (
                            <div className="col-span-full text-center py-16 text-ink-muted">
                                <p className="text-4xl mb-3">🎮</p>
                                <p className="font-semibold">No items in this category right now.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <BookingDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                item={selectedItem ? {
                    id: selectedItem.id,
                    name: `${selectedItem.name} ${selectedItem.edition}`,
                    type: selectedItem.rent_price ? "rental" : "purchase",
                    rentPrice: formatPrice(selectedItem.rent_price, selectedItem.rent_period) || undefined,
                    buyPrice: formatPrice(selectedItem.buy_price) || undefined,
                    emoji: selectedItem.emoji,
                } : null}
            />
        </section>
    );
}
