"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Clock, ShieldCheck, MapPin, MessageCircle, CheckCircle2,
    Zap, Package, BarChart3, ArrowRight, Calendar, LogOut, RefreshCw, Upload, AlertCircle, Disc3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const v = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    }),
};

const steps = [
    { label: "Order Placed", done: true },
    { label: "QA Testing", done: true },
    { label: "En Route", active: true },
    { label: "Delivered", done: false },
];

interface Booking {
    id: string;
    booking_type: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    total_amount: number;
    security_deposit: number;
    created_at: string;
    products: { name: string; edition: string; emoji: string } | null;
}

interface GamingPass {
    id: string;
    plan: string;
    status: string;
    starts_at: string;
    ends_at: string;
    swaps_used: number;
}

export default function Dashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState("Gamer");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [kycStatus, setKycStatus] = useState<string>("not_submitted");
    const [kycUploading, setKycUploading] = useState(false);
    const [gamingPass, setGamingPass] = useState<GamingPass | null>(null);

    const currentDate = new Date().toLocaleDateString("en-IN", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) { router.push("/login"); return; }
            const name = data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Gamer";
            setUserName(name.split(" ")[0]);

            // Fetch profile for KYC status
            supabase.from("profiles").select("kyc_status").eq("id", data.user.id).single()
                .then(({ data: prof }) => { if (prof?.kyc_status) setKycStatus(prof.kyc_status); });

            // Fetch active gaming pass
            supabase.from("gaming_passes").select("*").eq("user_id", data.user.id).eq("status", "active").order("created_at", { ascending: false }).limit(1)
                .then(({ data: passes }) => { if (passes && passes.length > 0) setGamingPass(passes[0] as GamingPass); });

            supabase
                .from("bookings")
                .select("*, products(name, edition, emoji)")
                .eq("user_id", data.user.id)
                .order("created_at", { ascending: false })
                .limit(10)
                .then(({ data: bData }) => {
                    if (bData) setBookings(bData as Booking[]);
                    setLoadingBookings(false);
                });
        });
    }, [router]);

    const handleKycUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setKycUploading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setKycUploading(false); return; }
        const ext = file.name.split(".").pop();
        const path = `kyc/${user.id}/aadhar.${ext}`;
        const { error: upErr } = await supabase.storage.from("kyc-docs").upload(path, file, { upsert: true });
        if (!upErr) {
            const { data: urlData } = supabase.storage.from("kyc-docs").getPublicUrl(path);
            await supabase.from("profiles").update({ kyc_status: "pending", kyc_doc_url: urlData.publicUrl }).eq("id", user.id);
            setKycStatus("pending");
        }
        setKycUploading(false);
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    const activeBooking = bookings.find((b) => b.status === "active" || b.status === "pending" || b.status === "confirmed");
    const activeRentals = bookings.filter((b) => b.booking_type === "rental" && (b.status === "active" || b.status === "pending")).length;
    const totalDeposit = bookings.filter((b) => b.status !== "completed" && b.status !== "cancelled").reduce((s, b) => s + (b.security_deposit || 0), 0);
    const daysRemaining = activeBooking?.end_date
        ? Math.max(0, Math.ceil((new Date(activeBooking.end_date).getTime() - Date.now()) / 86400000))
        : 0;

    const statusColor: Record<string, { bg: string; text: string; border: string }> = {
        active: { bg: "rgba(99,102,241,0.15)", text: "#a5b4fc", border: "rgba(99,102,241,0.3)" },
        pending: { bg: "rgba(234,179,8,0.1)", text: "#fbbf24", border: "rgba(234,179,8,0.25)" },
        confirmed: { bg: "rgba(34,197,94,0.12)", text: "#4ade80", border: "rgba(34,197,94,0.3)" },
        completed: { bg: "rgba(30,30,74,0.8)", text: "#64748b", border: "rgba(30,30,74,0.9)" },
        cancelled: { bg: "rgba(239,68,68,0.1)", text: "#fca5a5", border: "rgba(239,68,68,0.25)" },
    };

    return (
        <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="fixed top-0 -left-60 w-[700px] h-[500px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.09) 0%, transparent 70%)" }} />
            <div className="fixed bottom-0 -right-40 w-[500px] h-[400px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(168,85,247,0.07) 0%, transparent 70%)" }} />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* HEADER */}
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#a5b4fc" }} />
                            <span className="label text-[10px]" style={{ color: "#a5b4fc" }}>Command Center</span>
                        </div>
                        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white leading-tight">
                            Welcome back,{" "}
                            <span style={{
                                backgroundImage: "linear-gradient(110deg, #a5b4fc, #c084fc 55%, #e879f9 100%)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                            }}>{userName}.</span>
                        </h1>
                        <p className="text-sm text-ink-muted mt-1">{currentDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/#inventory"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white relative overflow-hidden group transition-all hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 0 16px rgba(99,102,241,0.3)" }}>
                            <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] bg-white/20 transition-transform duration-700" />
                            <Zap className="w-3.5 h-3.5" strokeWidth={2.5} /> New Booking
                        </Link>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-muted hover:text-white transition-colors"
                            style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                            <LogOut className="w-3.5 h-3.5" /><span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </motion.div>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: "Active Rentals", val: String(activeRentals), icon: Package, color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.25)" },
                        { label: "Days Remaining", val: activeBooking?.end_date ? String(daysRemaining) : "-", icon: Clock, color: "#a855f7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.25)" },
                        { label: "Total Bookings", val: String(bookings.length), icon: BarChart3, color: "#818cf8", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.25)" },
                        { label: "Deposit Held", val: totalDeposit > 0 ? `₹${(totalDeposit / 1000).toFixed(0)}K` : "₹0", icon: ShieldCheck, color: "#c084fc", bg: "rgba(192,132,252,0.1)", border: "rgba(192,132,252,0.25)" },
                    ].map((s, i) => (
                        <motion.div key={s.label} custom={i} variants={v} initial="hidden" animate="show"
                            className="relative rounded-2xl p-5 overflow-hidden"
                            style={{ background: "rgba(10,10,28,0.85)", border: `1px solid ${s.border}` }}>
                            <div className="absolute inset-0 rounded-2xl pointer-events-none"
                                style={{ background: `radial-gradient(ellipse at top left, ${s.bg} 0%, transparent 70%)` }} />
                            <div className="relative z-10">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                                    style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                                </div>
                                <p className="font-heading font-extrabold text-2xl text-white">{s.val}</p>
                                <p className="text-xs text-ink-muted mt-0.5">{s.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* BENTO */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Active Rental */}
                    <motion.div custom={4} variants={v} initial="hidden" animate="show"
                        className="lg:col-span-2 relative rounded-2xl overflow-hidden"
                        style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(99,102,241,0.2)" }}>
                        <div className="h-1" style={{ background: "linear-gradient(90deg, #6366f1, #a855f7, #c084fc)" }} />
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#a5b4fc" }} />
                                <span className="label text-[10px]" style={{ color: "#a5b4fc" }}>
                                    {activeBooking ? "Active Booking" : "No Active Booking"}
                                </span>
                            </div>

                            {activeBooking ? (
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="relative w-full sm:w-44 h-40 flex-shrink-0 rounded-2xl flex items-center justify-center overflow-hidden"
                                        style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, rgba(7,7,26,0.9) 70%)", border: "1px solid rgba(99,102,241,0.2)" }}>
                                        <span className="text-6xl">{activeBooking.products?.emoji || "🎮"}</span>
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <h2 className="font-heading font-bold text-2xl text-white mb-1">
                                            {activeBooking.products ? `${activeBooking.products.name} ${activeBooking.products.edition}` : "Console Booking"}
                                        </h2>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-5 w-fit"
                                            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)" }}>
                                            <span className="text-[9px] font-bold capitalize" style={{ color: "#a5b4fc" }}>
                                                {activeBooking.booking_type} · {activeBooking.status}
                                            </span>
                                        </div>
                                        <div className="mt-auto">
                                            <div className="flex justify-between text-xs mb-2">
                                                <span className="flex items-center gap-1.5 text-ink-muted">
                                                    <Clock className="w-3 h-3" style={{ color: "#a5b4fc" }} />
                                                    {daysRemaining > 0 ? `${daysRemaining} Days Remaining` : "Return Today"}
                                                </span>
                                                {activeBooking.end_date && (
                                                    <span className="text-ink-muted">Return: {new Date(activeBooking.end_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                                                )}
                                            </div>
                                            <div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: "rgba(30,30,74,0.9)" }}>
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(10, (1 - daysRemaining / 7) * 100))}%` }}
                                                    transition={{ duration: 1.2, delay: 0.5 }}
                                                    className="h-full rounded-full"
                                                    style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />
                                            </div>
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                                                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
                                                <RefreshCw className="w-3.5 h-3.5" /> Extend Rental
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="text-5xl mb-4">🎮</div>
                                    <h3 className="font-heading font-bold text-white text-lg mb-2">No active bookings yet</h3>
                                    <p className="text-ink-muted text-sm mb-5">Browse our arsenal and book your first console.</p>
                                    <Link href="/#inventory"
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                                        style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
                                        <Zap className="w-4 h-4" strokeWidth={2.5} /> Browse Arsenal
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Security Deposit */}
                    <motion.div custom={5} variants={v} initial="hidden" animate="show"
                        className="relative rounded-2xl overflow-hidden flex flex-col"
                        style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(168,85,247,0.2)" }}>
                        <div className="h-1" style={{ background: "linear-gradient(90deg, #a855f7, #c084fc)" }} />
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <span className="label text-[10px] text-ink-muted">Security Deposit</span>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                                    style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
                                    <ShieldCheck className="w-3 h-3" style={{ color: "#4ade80" }} />
                                    <span className="text-[9px] font-bold" style={{ color: "#4ade80" }}>Secured</span>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center text-center py-4">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
                                    <ShieldCheck className="w-7 h-7" style={{ color: "#c084fc" }} />
                                </div>
                                <p className="font-heading font-extrabold text-4xl text-white mb-1">
                                    {totalDeposit > 0 ? `₹${totalDeposit.toLocaleString("en-IN")}` : "₹0"}
                                </p>
                                <p className="text-xs text-ink-muted">100% Refundable on return</p>
                            </div>
                            <div className="pt-4" style={{ borderTop: "1px solid rgba(30,30,74,0.9)" }}>
                                <p className="text-[10px] text-ink-muted text-center">Auto-refunded within 24 hrs via UPI</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Live Logistics */}
                    <motion.div custom={6} variants={v} initial="hidden" animate="show"
                        className="lg:col-span-3 relative rounded-2xl overflow-hidden"
                        style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)" }}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" style={{ color: "#a5b4fc" }} />
                                    <span className="label text-[10px] text-ink-muted">Live Logistics</span>
                                </div>
                                <span className="label text-[9px] px-2.5 py-1 rounded-full text-ink-faint"
                                    style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                    {activeBooking?.id ? `#PGH-${activeBooking.id.slice(-5).toUpperCase()}` : "#PGH-XXXXX"}
                                </span>
                            </div>
                            <div className="relative">
                                <div className="absolute top-4 left-4 right-4 h-0.5 rounded-full" style={{ background: "rgba(30,30,74,0.9)" }} />
                                <motion.div initial={{ width: "0%" }} animate={{ width: activeBooking ? "66%" : "0%" }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    className="absolute top-4 left-4 h-0.5 rounded-full"
                                    style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />
                                <div className="relative flex justify-between">
                                    {steps.map((step, i) => (
                                        <div key={step.label} className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                                style={step.done
                                                    ? { background: "#6366f1", border: "2px solid #6366f1" }
                                                    : step.active
                                                        ? { background: "rgba(7,7,26,0.9)", border: "2px solid #a855f7", boxShadow: "0 0 12px rgba(168,85,247,0.4)" }
                                                        : { background: "rgba(7,7,26,0.9)", border: "1px solid rgba(30,30,74,0.9)" }
                                                }>
                                                {step.done ? <CheckCircle2 className="w-4 h-4 text-white" />
                                                    : step.active ? <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "#c084fc" }} />
                                                        : <span className="text-xs text-ink-faint font-bold">{i + 1}</span>}
                                            </div>
                                            <span className="text-[10px] font-semibold hidden sm:block"
                                                style={{ color: step.done ? "#a5b4fc" : step.active ? "#c084fc" : "#334155" }}>
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Booking History */}
                    <motion.div custom={7} variants={v} initial="hidden" animate="show"
                        className="lg:col-span-2 relative rounded-2xl overflow-hidden"
                        style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)" }}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" style={{ color: "#a5b4fc" }} />
                                    <span className="label text-[10px] text-ink-muted">Booking History</span>
                                </div>
                                <Link href="/#inventory"
                                    className="flex items-center gap-1 text-xs font-medium hover:text-white transition-colors" style={{ color: "#a5b4fc" }}>
                                    New <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>

                            {loadingBookings ? (
                                <div className="flex flex-col gap-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "rgba(7,7,26,0.7)" }} />
                                    ))}
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-3xl mb-2">📋</p>
                                    <p className="text-sm text-ink-muted">No bookings yet. Go book something! 🎮</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {bookings.slice(0, 5).map((b) => {
                                        const sc = statusColor[b.status] || statusColor.completed;
                                        return (
                                            <div key={b.id} className="flex items-center justify-between p-4 rounded-xl"
                                                style={{ background: "rgba(7,7,26,0.7)", border: "1px solid rgba(30,30,74,0.8)" }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                                        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                                                        {b.products?.emoji || "🎮"}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-white">
                                                            {b.products ? `${b.products.name} ${b.products.edition}` : "Console"}
                                                        </p>
                                                        <p className="text-xs text-ink-muted capitalize">
                                                            {b.booking_type} · {new Date(b.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="label text-[9px] px-2.5 py-1 rounded-full capitalize"
                                                    style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                                                    {b.status}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Gaming Pass */}
                    <motion.div custom={8} variants={v} initial="hidden" animate="show"
                        className="relative rounded-2xl overflow-hidden flex flex-col"
                        style={{ background: "rgba(10,10,28,0.9)", border: `1px solid ${gamingPass ? "rgba(168,85,247,0.3)" : "rgba(30,30,74,0.8)"}` }}>
                        {gamingPass && <div className="h-0.5" style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />}
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <Disc3 className="w-4 h-4" style={{ color: gamingPass ? "#c084fc" : "#a5b4fc" }} />
                                <span className="label text-[10px]" style={{ color: "#a5b4fc" }}>Gaming Pass</span>
                            </div>
                            {gamingPass ? (
                                <>
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                                        style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)" }}>
                                        <Disc3 className="w-6 h-6" style={{ color: "#c084fc" }} />
                                    </div>
                                    <h3 className="font-bold text-white mb-1 capitalize">{gamingPass.plan} Pass ✦ Active</h3>
                                    <div className="space-y-2 mt-3 flex-1">
                                        {[
                                            { l: "Expires", v: new Date(gamingPass.ends_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) },
                                            { l: "Swaps Used", v: String(gamingPass.swaps_used) },
                                            { l: "Disc Swaps", v: "Unlimited" },
                                        ].map(({ l, v }) => (
                                            <div key={l} className="flex justify-between text-xs">
                                                <span className="text-ink-muted">{l}</span>
                                                <span className="text-white font-semibold">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                                        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)" }}>
                                        <Disc3 className="w-6 h-6" style={{ color: "#a5b4fc" }} />
                                    </div>
                                    <h3 className="font-bold text-white mb-1">No Active Pass</h3>
                                    <p className="text-sm text-ink-muted flex-1 leading-relaxed">Get unlimited disc swaps for ₹499/mo.</p>
                                    <Link href="/#pass"
                                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                                        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: "0 0 16px rgba(99,102,241,0.3)" }}>
                                        <Zap className="w-4 h-4" strokeWidth={2.5} /> Activate Pass
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* WhatsApp Support */}
                    <motion.div custom={9} variants={v} initial="hidden" animate="show"
                        className="relative rounded-2xl overflow-hidden flex flex-col"
                        style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)" }}>
                        <div className="p-6 flex flex-col flex-1">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                                style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)" }}>
                                <MessageCircle className="w-6 h-6" style={{ color: "#25D366" }} />
                            </div>
                            <h3 className="font-heading font-bold text-lg text-white mb-1.5">Elite Support</h3>
                            <p className="text-sm text-ink-muted leading-relaxed flex-1">
                                Real humans on WhatsApp. Any issue resolved within the hour.
                            </p>
                            <button className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                                style={{ background: "linear-gradient(135deg, #128C7E, #25D366)", boxShadow: "0 0 16px rgba(37,211,102,0.2)" }}>
                                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                            </button>
                        </div>
                    </motion.div>
                    {/* KYC Status */}
                    <motion.div custom={9} variants={v} initial="hidden" animate="show"
                        className="relative rounded-2xl overflow-hidden flex flex-col"
                        style={{ background: "rgba(10,10,28,0.9)", border: `1px solid ${kycStatus === "verified" ? "rgba(34,197,94,0.3)" : kycStatus === "rejected" ? "rgba(239,68,68,0.3)" : kycStatus === "pending" ? "rgba(234,179,8,0.3)" : "rgba(30,30,74,0.8)"}` }}>
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-4 h-4" style={{ color: kycStatus === "verified" ? "#4ade80" : "#a5b4fc" }} />
                                <span className="label text-[10px]" style={{ color: "#a5b4fc" }}>KYC Verification</span>
                            </div>

                            {kycStatus === "verified" && (
                                <>
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                                        <CheckCircle2 className="w-6 h-6" style={{ color: "#4ade80" }} />
                                    </div>
                                    <h3 className="font-bold text-white mb-1">Verified ✓</h3>
                                    <p className="text-xs text-ink-muted">Your ID is verified. You can rent any console.</p>
                                </>
                            )}
                            {kycStatus === "pending" && (
                                <>
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)" }}>
                                        <Clock className="w-6 h-6" style={{ color: "#fbbf24" }} />
                                    </div>
                                    <h3 className="font-bold text-white mb-1">Under Review</h3>
                                    <p className="text-xs text-ink-muted">We&apos;ll verify your Aadhar within 24 hours.</p>
                                </>
                            )}
                            {kycStatus === "rejected" && (
                                <>
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                                        <AlertCircle className="w-6 h-6" style={{ color: "#fca5a5" }} />
                                    </div>
                                    <h3 className="font-bold text-white mb-1">Rejected</h3>
                                    <p className="text-xs text-ink-muted mb-3">Please re-upload a clearer photo.</p>
                                    <label className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
                                        {kycUploading ? "Uploading..." : <><Upload className="w-4 h-4" /> Re-upload ID</>}
                                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleKycUpload} disabled={kycUploading} />
                                    </label>
                                </>
                            )}
                            {kycStatus === "not_submitted" && (
                                <>
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)" }}>
                                        <Upload className="w-6 h-6" style={{ color: "#a5b4fc" }} />
                                    </div>
                                    <h3 className="font-bold text-white mb-1">Upload Aadhar / ID</h3>
                                    <p className="text-sm text-ink-muted flex-1 leading-relaxed">Required for rentals. Takes 24 hrs to verify.</p>
                                    <label className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 0 16px rgba(99,102,241,0.3)" }}>
                                        {kycUploading ? "Uploading..." : <><Upload className="w-4 h-4" /> Upload ID</>}
                                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleKycUpload} disabled={kycUploading} />
                                    </label>
                                </>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </main>
    );
}
