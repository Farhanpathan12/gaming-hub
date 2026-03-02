"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Zap, X, Box, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    item: {
        id?: string;
        name: string;
        type: "rental" | "purchase";
        rentPrice?: string;
        buyPrice?: string;
        emoji?: string;
    } | null;
}

type BookingState = "idle" | "loading" | "success" | "error" | "auth_required";

export default function BookingDrawer({ isOpen, onClose, item }: DrawerProps) {
    const router = useRouter();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [address, setAddress] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [kycStatus, setKycStatus] = useState<string | null>(null);
    const [state, setState] = useState<BookingState>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const isRental = item?.type === "rental";

    // Parse price number from string like "₹1,500/wk"
    const parseAmount = (price?: string) => {
        if (!price) return 0;
        return parseInt(price.replace(/[₹,/a-z]/gi, "").trim()) || 0;
    };

    const baseAmount = parseAmount(isRental ? item?.rentPrice : item?.buyPrice);
    const depositAmount = isRental ? 5000 : 0;
    const totalAmount = baseAmount + depositAmount;

    const handleConfirm = async () => {
        if (!item) return;

        // Validate required fields
        if (isRental && (!startDate || !endDate)) {
            setErrorMsg("Please select rental start and end dates.");
            setState("error");
            return;
        }
        if (!address.trim()) {
            setErrorMsg("Please enter your delivery address.");
            setState("error");
            return;
        }

        setState("loading");
        setErrorMsg("");

        const supabase = createClient();

        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setState("auth_required");
            return;
        }

        // Fetch KYC status for rental gating
        if (isRental) {
            const { data: prof } = await supabase.from("profiles").select("kyc_status").eq("id", user.id).single();
            setKycStatus(prof?.kyc_status || "not_submitted");
            // Allow booking but flag it — full block can be enabled later when KYC flow is live
        }

        // Find product_id from products table if we have it
        let productId: string | null = item.id || null;
        if (!productId) {
            const { data: products } = await supabase
                .from("products")
                .select("id")
                .ilike("name", `%${item.name.split(" ")[0]}%`)
                .limit(1);
            productId = products?.[0]?.id || null;
        }

        // Insert booking
        const { error } = await supabase.from("bookings").insert({
            user_id: user.id,
            product_id: productId,
            booking_type: isRental ? "rental" : "purchase",
            status: "pending",
            start_date: startDate || null,
            end_date: endDate || null,
            total_amount: totalAmount,
            security_deposit: depositAmount,
            delivery_address: address,
        });

        if (error) {
            setErrorMsg("Something went wrong. Please try again.");
            setState("error");
        } else {
            setState("success");
            setTimeout(() => {
                setState("idle");
                setStartDate("");
                setEndDate("");
                setAddress("");
                setAgreed(false);
                onClose();
                router.push("/dashboard");
            }, 2800);
        }
    };

    const todayStr = new Date().toISOString().split("T")[0];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={state !== "loading" ? onClose : undefined}
                        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
                    />

                    {/* Drawer panel */}
                    <motion.div
                        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 280 }}
                        className="fixed top-0 right-0 bottom-0 z-[90] w-full max-w-md flex flex-col"
                        style={{ background: "#0a0a1e", borderLeft: "1px solid rgba(30,30,74,0.9)" }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-px"
                            style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.5), rgba(168,85,247,0.4), transparent)" }} />

                        {/* Success state */}
                        <AnimatePresence>
                            {state === "success" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-10"
                                    style={{ background: "#0a0a1e" }}
                                >
                                    <div className="absolute inset-0 pointer-events-none"
                                        style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                                        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative z-10"
                                        style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}
                                    >
                                        <CheckCircle2 className="w-10 h-10 text-white" />
                                    </motion.div>
                                    <h3 className="font-heading font-extrabold text-3xl text-white mb-2 relative z-10">Booking Confirmed!</h3>
                                    <p className="text-ink-muted text-sm relative z-10">Your order is placed. Redirecting to dashboard...</p>
                                    <div className="mt-6 flex gap-1 relative z-10">
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div key={i} className="w-2 h-2 rounded-full"
                                                style={{ background: "#6366f1" }}
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Header */}
                        <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid rgba(30,30,74,0.9)" }}>
                            <div>
                                <h2 className="font-heading font-bold text-white text-xl">Complete Booking</h2>
                                <p className="text-xs text-ink-muted mt-0.5">Fill in the details below</p>
                            </div>
                            <button onClick={onClose} disabled={state === "loading"}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-muted hover:text-white transition-colors"
                                style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">

                            {/* Auth required warning */}
                            {state === "auth_required" && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col gap-3 p-4 rounded-xl"
                                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                                    <div className="flex items-center gap-2" style={{ color: "#fca5a5" }}>
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Login Required</span>
                                    </div>
                                    <p className="text-xs text-ink-muted">You need to be logged in to place a booking.</p>
                                    <button onClick={() => router.push("/login")}
                                        className="px-4 py-2 rounded-xl text-sm font-bold text-white w-fit"
                                        style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
                                        Sign In →
                                    </button>
                                </motion.div>
                            )}

                            {/* Error */}
                            {state === "error" && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-2.5 p-3.5 rounded-xl text-sm"
                                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    {errorMsg}
                                </motion.div>
                            )}

                            {/* Selected item */}
                            {item && (
                                <div className="rounded-xl p-4 flex items-center gap-4"
                                    style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}>
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                                        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                                        {item.emoji || "🎮"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm">{item.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="label text-[9px] px-2 py-0.5 rounded-full"
                                                style={isRental
                                                    ? { background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }
                                                    : { background: "rgba(168,85,247,0.15)", color: "#c084fc" }}>
                                                {isRental ? "Rental" : "Purchase"}
                                            </span>
                                            <span className="text-xs text-ink-muted">{isRental ? item.rentPrice : item.buyPrice}</span>
                                        </div>
                                    </div>
                                    <Box className="w-4 h-4 text-ink-faint flex-shrink-0" />
                                </div>
                            )}

                            {/* Rental dates */}
                            {isRental && (
                                <div className="space-y-3">
                                    <label className="label text-[9px] text-ink-muted block">Rental Period</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "Start Date", val: startDate, fn: setStartDate, min: todayStr },
                                            { label: "End Date", val: endDate, fn: setEndDate, min: startDate || todayStr },
                                        ].map(({ label, val, fn, min }) => (
                                            <div key={label}>
                                                <p className="text-[10px] text-ink-muted mb-1.5">{label}</p>
                                                <input type="date" value={val} min={min}
                                                    onChange={(e) => { fn(e.target.value); if (state === "error") setState("idle"); }}
                                                    className="w-full px-3 py-2.5 rounded-xl text-ink text-sm focus:outline-none transition-all"
                                                    style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)", colorScheme: "dark" }}
                                                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                                                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(30,30,74,0.9)"; e.currentTarget.style.boxShadow = "none"; }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Delivery address */}
                            <div>
                                <label className="label text-[9px] text-ink-muted block mb-2">Delivery Address</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => { setAddress(e.target.value); if (state === "error") setState("idle"); }}
                                    placeholder="Flat no, Building, Area, Pune..."
                                    rows={3}
                                    className="w-full px-3 py-3 rounded-xl text-ink text-sm placeholder:text-ink-faint focus:outline-none transition-all resize-none"
                                    style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)" }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(30,30,74,0.9)"; e.currentTarget.style.boxShadow = "none"; }}
                                />
                            </div>

                            {/* Cost breakdown */}
                            <div className="rounded-xl p-5 space-y-3"
                                style={{ background: "rgba(13,13,43,0.8)", border: "1px solid rgba(30,30,74,0.9)" }}>
                                <h4 className="label text-[9px] text-ink-muted mb-4">Cost Breakdown</h4>
                                {[
                                    { label: isRental ? "Base Rental" : "Console Price", val: isRental ? item?.rentPrice : item?.buyPrice },
                                    ...(isRental ? [{ label: "Refundable Deposit", val: "₹5,000" }] : []),
                                    { label: "Doorstep Delivery", val: "FREE" },
                                ].map((row) => (
                                    <div key={row.label} className="flex items-center justify-between text-sm">
                                        <span className="text-ink-muted flex items-center gap-1.5">
                                            {row.label === "Refundable Deposit" && (
                                                <ShieldCheck className="w-3 h-3" style={{ color: "#a5b4fc" }} />
                                            )}
                                            {row.label}
                                        </span>
                                        <span className="font-semibold" style={{ color: row.val === "FREE" ? "#a5b4fc" : "#e2e8f0" }}>
                                            {row.val}
                                        </span>
                                    </div>
                                ))}
                                <div className="pt-3 flex justify-between" style={{ borderTop: "1px solid rgba(30,30,74,0.9)" }}>
                                    <span className="text-sm font-bold text-white">Total Due Now</span>
                                    <span className="font-heading font-bold text-lg" style={{
                                        backgroundImage: "linear-gradient(110deg, #a5b4fc, #c084fc)",
                                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                    }}>
                                        {isRental ? item?.rentPrice : item?.buyPrice}
                                    </span>
                                </div>
                            </div>

                            {/* Digital Agreement checkbox */}
                            {isRental && (
                                <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl transition-colors"
                                    style={{ background: agreed ? "rgba(99,102,241,0.08)" : "rgba(13,13,43,0.6)", border: `1px solid ${agreed ? "rgba(99,102,241,0.3)" : "rgba(30,30,74,0.9)"}` }}>
                                    <div onClick={() => setAgreed(!agreed)}
                                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                                        style={{ background: agreed ? "#6366f1" : "#07071a", border: `1px solid ${agreed ? "#6366f1" : "rgba(30,30,74,0.9)"}` }}>
                                        {agreed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <span className="text-[11px] leading-relaxed" style={{ color: agreed ? "#a5b4fc" : "#64748b" }}>
                                        I agree to the <strong style={{ color: agreed ? "#c084fc" : "#94a3b8" }}>damage & part-swapping penalty terms</strong>. Security deposit of ₹5,000 will be held and is refundable upon safe return.
                                    </span>
                                </label>
                            )}

                            {/* KYC notice for rental */}
                            {isRental && kycStatus && kycStatus !== "verified" && (
                                <div className="flex items-start gap-2 p-3 rounded-xl text-xs"
                                    style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)" }}>
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#fbbf24" }} />
                                    <span style={{ color: "#fbbf24" }}>KYC not verified — please upload your ID in Dashboard to speed up approval.</span>
                                </div>
                            )}

                            {/* Trust badge */}
                            <div className="flex items-center gap-2 text-xs text-ink-muted">
                                <ShieldCheck className="w-4 h-4" style={{ color: "#a5b4fc" }} />
                                Secure checkout · Deposit 100% refundable on return
                            </div>
                        </div>

                        {/* Footer CTA */}
                        <div className="p-6" style={{ borderTop: "1px solid rgba(30,30,74,0.9)" }}>
                            <button
                                onClick={handleConfirm}
                                disabled={state === "loading" || state === "success" || (isRental && !agreed)}
                                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}
                            >
                                {state !== "loading" && (
                                    <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] bg-white/20 transition-transform duration-700" />
                                )}
                                {state === "loading" ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Confirming...</>
                                ) : (
                                    <><Zap className="w-4 h-4" strokeWidth={2.5} /> Confirm &amp; Book</>
                                )}
                            </button>
                            {isRental && !agreed && (
                                <p className="text-center text-[10px] text-ink-faint mt-2">Please accept the agreement above to continue</p>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
