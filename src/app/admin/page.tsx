"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard, Package, BookOpen, Plus, Edit2, Trash2,
    CheckCircle2, XCircle, Clock, Loader2, ChevronDown,
    Users, TrendingUp, ShieldCheck, Zap, X, Save, RefreshCw,
    ClipboardList, Phone, UserCheck, ExternalLink, AlertTriangle, Calendar,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────
interface Booking {
    id: string;
    user_id: string | null;
    booking_type: string;
    status: string;
    total_amount: number;
    security_deposit: number;
    start_date: string | null;
    end_date: string | null;
    delivery_address: string | null;
    created_at: string;
    products: { name: string; edition: string; emoji: string } | null;
    profiles: { full_name: string | null; phone: string | null } | null;
}

interface Product {
    id: string;
    name: string;
    edition: string;
    category: string;
    rent_price: number | null;
    rent_period: string | null;
    buy_price: number | null;
    badge: string | null;
    badge_color: string;
    emoji: string;
    certified: boolean;
    available: boolean;
    serial_number: string | null;
    warehouse_status: string;
}

interface ValuationLead {
    id: string;
    name: string;
    phone: string;
    console: string;
    condition: string;
    estimated_val: number;
    status: string;
    created_at: string;
    check_warranty_seal: boolean | null;
    check_disc_drive: boolean | null;
    check_fan_noise: boolean | null;
    check_hdmi_port: boolean | null;
    check_controller: boolean | null;
    check_psn_banned: boolean | null;
    check_hdd_health: boolean | null;
    admin_notes: string | null;
}

interface KycProfile {
    id: string;
    full_name: string | null;
    phone: string | null;
    kyc_status: string;
    kyc_doc_url: string | null;
    created_at: string;
}

interface AllProfile {
    id: string;
    full_name: string | null;
    phone: string | null;
    kyc_status: string;
    created_at: string;
    booking_count?: number;
}

type Tab = "overview" | "bookings" | "leads" | "kyc" | "products";

const BOOKING_STATUSES = ["pending", "confirmed", "active", "completed", "cancelled"];
const LEAD_STATUSES = ["new", "contacted", "inspecting", "offer_made", "closed", "rejected"];

const statusStyle: Record<string, { bg: string; text: string; border: string }> = {
    pending: { bg: "rgba(234,179,8,0.1)", text: "#fbbf24", border: "rgba(234,179,8,0.25)" },
    confirmed: { bg: "rgba(34,197,94,0.12)", text: "#4ade80", border: "rgba(34,197,94,0.3)" },
    active: { bg: "rgba(99,102,241,0.15)", text: "#a5b4fc", border: "rgba(99,102,241,0.3)" },
    completed: { bg: "rgba(30,30,74,0.8)", text: "#64748b", border: "rgba(30,30,74,0.9)" },
    cancelled: { bg: "rgba(239,68,68,0.1)", text: "#fca5a5", border: "rgba(239,68,68,0.25)" },
    new: { bg: "rgba(99,102,241,0.12)", text: "#a5b4fc", border: "rgba(99,102,241,0.25)" },
    contacted: { bg: "rgba(234,179,8,0.1)", text: "#fbbf24", border: "rgba(234,179,8,0.25)" },
    inspecting: { bg: "rgba(168,85,247,0.12)", text: "#c084fc", border: "rgba(168,85,247,0.25)" },
    offer_made: { bg: "rgba(34,197,94,0.1)", text: "#4ade80", border: "rgba(34,197,94,0.25)" },
    closed: { bg: "rgba(30,30,74,0.8)", text: "#64748b", border: "rgba(30,30,74,0.9)" },
    rejected: { bg: "rgba(239,68,68,0.1)", text: "#fca5a5", border: "rgba(239,68,68,0.25)" },
};

const EMPTY_PRODUCT: Omit<Product, "id"> = {
    name: "", edition: "", category: "consoles",
    rent_price: null, rent_period: "/wk", buy_price: null,
    badge: "", badge_color: "indigo", emoji: "🎮",
    certified: true, available: true,
    serial_number: null, warehouse_status: "in_warehouse",
};

const CHECKLIST_ITEMS: { key: keyof ValuationLead; label: string }[] = [
    { key: "check_warranty_seal", label: "Warranty Seal Intact" },
    { key: "check_disc_drive", label: "Disc Drive Working" },
    { key: "check_fan_noise", label: "Fan Noise Normal" },
    { key: "check_hdmi_port", label: "HDMI Port Tight" },
    { key: "check_controller", label: "Controller No-Drift" },
    { key: "check_psn_banned", label: "PSN Not Banned" },
    { key: "check_hdd_health", label: "HDD Health Good" },
];

// ─── Main Component ─────────────────────────────────────────
export default function AdminPage() {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>("overview");
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [leads, setLeads] = useState<ValuationLead[]>([]);
    const [kycProfiles, setKycProfiles] = useState<KycProfile[]>([]);
    const [allProfiles, setAllProfiles] = useState<AllProfile[]>([]);

    // Product modal state
    const [productModal, setProductModal] = useState<{ open: boolean; editing: Product | null }>({ open: false, editing: null });
    const [productForm, setProductForm] = useState<Omit<Product, "id">>(EMPTY_PRODUCT);
    const [saving, setSaving] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    // 7-point checklist modal
    const [checklistModal, setChecklistModal] = useState<ValuationLead | null>(null);
    const [checklistForm, setChecklistForm] = useState<Partial<ValuationLead>>({});
    const [savingChecklist, setSavingChecklist] = useState(false);

    // ── Load data ───────────────────────────────────────────
    const fetchData = useCallback(async () => {
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/login"); return; }

        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (!profile || profile.role !== "admin") { router.push("/dashboard"); return; }
        setIsAdmin(true);

        const [bRes, pRes, lRes, rpcRes] = await Promise.all([
            supabase.from("admin_bookings").select("*").order("created_at", { ascending: false }),
            supabase.from("products").select("*").order("created_at", { ascending: true }),
            supabase.from("valuation_leads").select("*").order("created_at", { ascending: false }),
            // SECURITY DEFINER RPC — bypasses RLS, returns all customer profiles + booking counts
            supabase.rpc("get_all_customer_profiles"),
        ]);

        if (bRes.data) {
            const booksData = bRes.data.map((row: Record<string, unknown>) => ({
                id: row.id, booking_type: row.booking_type, status: row.status,
                total_amount: row.total_amount, security_deposit: row.security_deposit,
                start_date: row.start_date, end_date: row.end_date,
                delivery_address: row.delivery_address, created_at: row.created_at,
                products: row.product_name ? { name: row.product_name, edition: row.product_edition, emoji: row.product_emoji } : null,
                profiles: row.customer_name ? { full_name: row.customer_name, phone: row.customer_phone } : null,
                user_id: row.user_id,
            })) as Booking[];
            setBookings(booksData);
        }

        // RPC returns profiles with booking_count already merged
        if (rpcRes.data) {
            const allP = rpcRes.data as AllProfile[];
            setAllProfiles(allP);
            // KYC tab: same data, filtered to those who submitted something
            setKycProfiles(allP.filter((p: AllProfile) => p.kyc_status !== "not_submitted") as KycProfile[]);
        }

        if (pRes.data) setProducts(pRes.data as Product[]);
        if (lRes.data) setLeads(lRes.data as ValuationLead[]);
        setLoading(false);
    }, [router]);


    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Update booking status ────────────────────────────────
    const updateBookingStatus = async (id: string, status: string) => {
        setOpenDropdownId(null);
        setStatusUpdating(id);
        const supabase = createClient();
        await supabase.from("bookings").update({ status }).eq("id", id);
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        setStatusUpdating(null);
    };

    // ── Update lead status ───────────────────────────────────
    const updateLeadStatus = async (id: string, status: string) => {
        setOpenDropdownId(null);
        const supabase = createClient();
        await supabase.from("valuation_leads").update({ status }).eq("id", id);
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    };

    // ── Approve / Reject KYC ────────────────────────────────
    const updateKycStatus = async (id: string, status: "verified" | "rejected") => {
        const supabase = createClient();
        await supabase.from("profiles").update({ kyc_status: status }).eq("id", id);
        setKycProfiles(prev => prev.map(p => p.id === id ? { ...p, kyc_status: status } : p));
    };

    // ── Save 7-point checklist ───────────────────────────────
    const saveChecklist = async () => {
        if (!checklistModal) return;
        setSavingChecklist(true);
        const supabase = createClient();
        const payload = {
            check_warranty_seal: checklistForm.check_warranty_seal ?? null,
            check_disc_drive: checklistForm.check_disc_drive ?? null,
            check_fan_noise: checklistForm.check_fan_noise ?? null,
            check_hdmi_port: checklistForm.check_hdmi_port ?? null,
            check_controller: checklistForm.check_controller ?? null,
            check_psn_banned: checklistForm.check_psn_banned ?? null,
            check_hdd_health: checklistForm.check_hdd_health ?? null,
            admin_notes: checklistForm.admin_notes ?? null,
            status: "inspecting",
        };
        await supabase.from("valuation_leads").update(payload).eq("id", checklistModal.id);
        setLeads(prev => prev.map(l => l.id === checklistModal.id ? { ...l, ...payload } : l));
        setSavingChecklist(false);
        setChecklistModal(null);
    };

    // ── Delete product ───────────────────────────────────────
    const deleteProduct = async (id: string) => {
        if (!confirm("Delete this product? This cannot be undone.")) return;
        const supabase = createClient();
        await supabase.from("products").delete().eq("id", id);
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const openProductModal = (p?: Product) => {
        if (p) {
            setProductForm({ name: p.name, edition: p.edition, category: p.category, rent_price: p.rent_price, rent_period: p.rent_period, buy_price: p.buy_price, badge: p.badge, badge_color: p.badge_color, emoji: p.emoji, certified: p.certified, available: p.available, serial_number: p.serial_number, warehouse_status: p.warehouse_status });
            setProductModal({ open: true, editing: p });
        } else {
            setProductForm(EMPTY_PRODUCT);
            setProductModal({ open: true, editing: null });
        }
    };

    const saveProduct = async () => {
        setSaving(true);
        const supabase = createClient();
        const payload = { ...productForm, rent_price: productForm.rent_price || null, buy_price: productForm.buy_price || null, badge: productForm.badge || null };
        if (productModal.editing) {
            const { data } = await supabase.from("products").update(payload).eq("id", productModal.editing.id).select().single();
            if (data) setProducts(prev => prev.map(p => p.id === productModal.editing!.id ? data as Product : p));
        } else {
            const { data } = await supabase.from("products").insert(payload).select().single();
            if (data) setProducts(prev => [...prev, data as Product]);
        }
        setSaving(false);
        setProductModal({ open: false, editing: null });
    };

    // ── Stats ────────────────────────────────────────────────
    const totalRevenue = bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + (b.total_amount || 0), 0);
    const activeCount = bookings.filter(b => b.status === "active" || b.status === "confirmed").length;
    const pendingCount = bookings.filter(b => b.status === "pending").length;
    const availableProducts = products.filter(p => p.available).length;
    const newLeads = leads.filter(l => l.status === "new").length;
    const pendingKyc = kycProfiles.filter(p => p.kyc_status === "pending").length;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#6366f1" }} />
        </div>
    );
    if (!isAdmin) return null;

    return (
        <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="fixed top-0 -left-60 w-[600px] h-[400px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="w-4 h-4" style={{ color: "#a5b4fc" }} />
                            <span className="label text-[10px]" style={{ color: "#a5b4fc" }}>Admin Control Panel</span>
                        </div>
                        <h1 className="font-heading font-extrabold text-3xl text-white">PGH Admin</h1>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={fetchData} className="p-2 rounded-xl text-ink-muted hover:text-white transition-colors"
                            style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-ink-muted hover:text-white transition-colors"
                            style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                            ← Dashboard
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {([
                        { key: "overview", label: "Overview", icon: LayoutDashboard },
                        { key: "bookings", label: `Bookings (${bookings.length})`, icon: BookOpen },
                        { key: "leads", label: `Sell Leads (${leads.length})`, icon: ClipboardList },
                        { key: "kyc", label: `KYC Review (${kycProfiles.length})`, icon: UserCheck },
                        { key: "products", label: `Products (${products.length})`, icon: Package },
                    ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
                        <button key={key} onClick={() => setTab(key)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all relative"
                            style={tab === key
                                ? { background: "linear-gradient(135deg, #6366f1, #7c3aed)", color: "#fff", boxShadow: "0 0 16px rgba(99,102,241,0.3)" }
                                : { border: "1px solid rgba(30,30,74,0.8)", color: "#94a3b8" }}>
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                            {key === "leads" && newLeads > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                                    style={{ background: "#6366f1" }}>{newLeads}</span>
                            )}
                            {key === "kyc" && pendingKyc > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                                    style={{ background: "#fbbf24", color: "#000" }}>{pendingKyc}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── OVERVIEW TAB ── */}
                {tab === "overview" && (() => {
                    const kycVerified = allProfiles.filter(p => p.kyc_status === "verified").length;
                    const kycPending = allProfiles.filter(p => p.kyc_status === "pending").length;
                    const kycNone = allProfiles.filter(p => p.kyc_status === "not_submitted").length;
                    const alertUsers = allProfiles.filter(p => (p.booking_count ?? 0) > 0 && p.kyc_status === "not_submitted");
                    const recentBookings = bookings.slice(0, 5);
                    return (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

                            {/* ── Alert Banner  */}
                            {alertUsers.length > 0 && (
                                <div className="rounded-2xl p-4 flex items-start gap-3"
                                    style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.3)" }}>
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#fbbf24" }} />
                                    <div>
                                        <p className="font-bold text-white text-sm mb-1">
                                            {alertUsers.length} user{alertUsers.length > 1 ? "s" : ""} have bookings but no KYC!
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {alertUsers.map(u => (
                                                <span key={u.id} className="text-xs px-2.5 py-1 rounded-full"
                                                    style={{ background: "rgba(234,179,8,0.15)", color: "#fbbf24", border: "1px solid rgba(234,179,8,0.3)" }}>
                                                    {u.full_name || "Anonymous"} · {u.booking_count} booking{(u.booking_count ?? 0) > 1 ? "s" : ""}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Stats Grid ── */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Users", val: String(allProfiles.length), icon: Users, color: "#6366f1" },
                                    { label: "Total Bookings", val: String(bookings.length), icon: BookOpen, color: "#a855f7" },
                                    { label: "Active / Confirmed", val: String(activeCount), icon: Zap, color: "#4ade80" },
                                    { label: "Total Revenue", val: `₹${(totalRevenue / 1000).toFixed(1)}K`, icon: TrendingUp, color: "#c084fc" },
                                ].map((s) => (
                                    <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden"
                                        style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)" }}>
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                                            style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                                            <s.icon className="w-4 h-4" style={{ color: s.color }} />
                                        </div>
                                        <p className="font-heading font-extrabold text-2xl text-white">{s.val}</p>
                                        <p className="text-xs text-ink-muted mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* ── KYC + Inventory breakdown ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {/* KYC breakdown */}
                                <div className="rounded-2xl p-5" style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)" }}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShieldCheck className="w-4 h-4" style={{ color: "#a5b4fc" }} />
                                        <span className="font-bold text-white text-sm">KYC Status Breakdown</span>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Verified", count: kycVerified, color: "#4ade80", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)" },
                                            { label: "Pending Review", count: kycPending, color: "#fbbf24", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.25)", action: () => setTab("kyc") },
                                            { label: "Not Submitted", count: kycNone, color: "#fca5a5", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
                                        ].map(({ label, count, color, bg, border, action }) => (
                                            <div key={label} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                                                    <span className="text-sm text-ink-muted">{label}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 rounded-full" style={{ background: bg, border: `1px solid ${border}`, width: `${Math.max(8, allProfiles.length > 0 ? (count / allProfiles.length) * 120 : 8)}px` }} />
                                                    <span className="text-sm font-bold text-white w-5 text-right">{count}</span>
                                                    {action && count > 0 && (
                                                        <button onClick={action} className="text-[9px] px-1.5 py-0.5 rounded-md label" style={{ background: bg, color, border: `1px solid ${border}` }}>Review</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Booking + inventory */}
                                <div className="rounded-2xl p-5" style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)" }}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Package className="w-4 h-4" style={{ color: "#a5b4fc" }} />
                                        <span className="font-bold text-white text-sm">Bookings &amp; Inventory</span>
                                    </div>
                                    <div className="space-y-3">
                                        {BOOKING_STATUSES.map((s) => {
                                            const count = bookings.filter(b => b.status === s).length;
                                            const st = statusStyle[s];
                                            return (
                                                <div key={s} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-2 h-2 rounded-full" style={{ background: st.text }} />
                                                        <span className="text-sm text-ink-muted capitalize">{s}</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-white">{count}</span>
                                                </div>
                                            );
                                        })}
                                        <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(30,30,74,0.8)" }}>
                                            <span className="text-xs text-ink-muted">Products available</span>
                                            <span className="text-xs font-bold text-white">{availableProducts} / {products.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Registered Users Table ── */}
                            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)" }}>
                                <div className="flex items-center justify-between p-5 pb-0">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" style={{ color: "#a5b4fc" }} />
                                        <span className="font-bold text-white text-sm">Registered Users ({allProfiles.length})</span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    {allProfiles.length === 0 ? (
                                        <p className="text-center text-ink-muted py-8 text-sm">No users yet.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {/* Header */}
                                            <div className="grid gap-3 pb-2 label text-[9px] text-ink-faint uppercase tracking-widest"
                                                style={{ gridTemplateColumns: "1fr 120px 80px 100px", borderBottom: "1px solid rgba(30,30,74,0.8)" }}>
                                                <span>User</span><span>Phone</span><span className="text-center">Bookings</span><span className="text-center">KYC</span>
                                            </div>
                                            {allProfiles.map((p) => {
                                                const kst: Record<string, { bg: string; text: string; border: string }> = {
                                                    verified: { bg: "rgba(34,197,94,0.1)", text: "#4ade80", border: "rgba(34,197,94,0.25)" },
                                                    pending: { bg: "rgba(234,179,8,0.1)", text: "#fbbf24", border: "rgba(234,179,8,0.25)" },
                                                    rejected: { bg: "rgba(239,68,68,0.1)", text: "#fca5a5", border: "rgba(239,68,68,0.25)" },
                                                    not_submitted: { bg: "rgba(100,116,139,0.1)", text: "#64748b", border: "rgba(100,116,139,0.2)" },
                                                };
                                                const ks = kst[p.kyc_status] || kst.not_submitted;
                                                const hasAlert = (p.booking_count ?? 0) > 0 && p.kyc_status === "not_submitted";
                                                return (
                                                    <div key={p.id} className="grid gap-3 py-2.5 items-center rounded-xl px-2 transition-colors"
                                                        style={{ gridTemplateColumns: "1fr 120px 80px 100px", background: hasAlert ? "rgba(234,179,8,0.04)" : "transparent" }}>
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                                                style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>
                                                                {(p.full_name || "?").charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
                                                                    {p.full_name || <span className="text-ink-faint italic">Anonymous</span>}
                                                                    {hasAlert && <AlertTriangle className="w-3 h-3 flex-shrink-0" style={{ color: "#fbbf24" }} />}
                                                                </p>
                                                                <p className="text-[10px] text-ink-faint">{new Date(p.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}</p>
                                                            </div>
                                                        </div>
                                                        <a href={p.phone ? `tel:${p.phone}` : undefined}
                                                            className="text-xs text-ink-muted hover:text-white transition-colors truncate">
                                                            {p.phone || "—"}
                                                        </a>
                                                        <div className="text-center">
                                                            <span className="text-sm font-bold" style={{ color: (p.booking_count ?? 0) > 0 ? "#a5b4fc" : "#64748b" }}>
                                                                {p.booking_count ?? 0}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-center">
                                                            <span className="label text-[8px] px-2 py-0.5 rounded-full capitalize whitespace-nowrap"
                                                                style={{ background: ks.bg, color: ks.text, border: `1px solid ${ks.border}` }}>
                                                                {p.kyc_status === "not_submitted" ? "None" : p.kyc_status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Recent Bookings ── */}
                            {recentBookings.length > 0 && (
                                <div className="rounded-2xl p-5" style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)" }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" style={{ color: "#a5b4fc" }} />
                                            <span className="font-bold text-white text-sm">Recent Bookings</span>
                                        </div>
                                        <button onClick={() => setTab("bookings")} className="text-xs hover:text-white transition-colors" style={{ color: "#a5b4fc" }}>
                                            View all →
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {recentBookings.map((b) => {
                                            const st = statusStyle[b.status] || statusStyle.completed;
                                            return (
                                                <div key={b.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
                                                    style={{ background: "rgba(7,7,26,0.7)", border: "1px solid rgba(30,30,74,0.8)" }}>
                                                    <span className="text-lg">{b.products?.emoji || "🎮"}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-white truncate">
                                                            {b.products ? `${b.products.name} ${b.products.edition}` : "Console"}
                                                        </p>
                                                        <p className="text-xs text-ink-muted">
                                                            {b.profiles?.full_name || "—"} · {b.booking_type} · ₹{b.total_amount?.toLocaleString("en-IN")}
                                                        </p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <span className="label text-[9px] px-2 py-0.5 rounded-full capitalize"
                                                            style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                                                            {b.status}
                                                        </span>
                                                        <p className="text-[10px] text-ink-faint mt-1">
                                                            {new Date(b.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })()}

                {/* ── BOOKINGS TAB ── */}
                {tab === "bookings" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        {bookings.length === 0 && <div className="text-center py-16 text-ink-muted">No bookings yet.</div>}
                        {bookings.map((b) => {
                            const st = statusStyle[b.status] || statusStyle.completed;
                            return (
                                <div key={b.id} className="rounded-2xl p-5"
                                    style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)" }}>
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                                                {b.products?.emoji || "🎮"}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-white text-sm truncate">
                                                    {b.products ? `${b.products.name} ${b.products.edition}` : "Unknown"}
                                                </p>
                                                <p className="text-xs text-ink-muted capitalize">{b.booking_type} · ₹{b.total_amount?.toLocaleString("en-IN")}</p>
                                                <p className="text-xs mt-0.5" style={{ color: "#a5b4fc" }}>
                                                    {b.profiles?.full_name || "—"} {b.profiles?.phone ? `· ${b.profiles.phone}` : ""}
                                                </p>
                                                {b.delivery_address && <p className="text-[10px] text-ink-faint mt-0.5 truncate">{b.delivery_address}</p>}
                                            </div>
                                        </div>
                                        <div className="text-xs text-ink-muted flex-shrink-0 text-right">
                                            <p>{new Date(b.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}</p>
                                            {b.start_date && <p>From: {new Date(b.start_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>}
                                            {b.end_date && <p>To: {new Date(b.end_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>}
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="label text-[9px] px-2.5 py-1 rounded-full capitalize"
                                                style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                                                {b.status}
                                            </span>
                                            {statusUpdating === b.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-ink-muted" />
                                            ) : (
                                                <div className="relative">
                                                    <button onClick={() => setOpenDropdownId(openDropdownId === b.id ? null : b.id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-ink-muted hover:text-white transition-colors"
                                                        style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                                        Update <ChevronDown className={`w-3 h-3 transition-transform ${openDropdownId === b.id ? "rotate-180" : ""}`} />
                                                    </button>
                                                    {openDropdownId === b.id && (
                                                        <div className="absolute right-0 top-full mt-1.5 rounded-xl overflow-hidden z-20"
                                                            style={{ background: "#07071a", border: "1px solid rgba(99,102,241,0.3)", minWidth: "140px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                                                            {BOOKING_STATUSES.filter(s => s !== b.status).map(s => (
                                                                <button key={s} onClick={() => updateBookingStatus(b.id, s)}
                                                                    className="w-full text-left px-3.5 py-2.5 text-xs font-medium capitalize hover:bg-indigo-950/60 transition-colors"
                                                                    style={{ color: statusStyle[s]?.text }}>
                                                                    → {s}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {/* ── VALUATION LEADS TAB ── */}
                {tab === "leads" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        {leads.length === 0 && <div className="text-center py-16 text-ink-muted">No valuation leads yet.</div>}
                        {leads.map((l) => {
                            const st = statusStyle[l.status] || statusStyle.completed;
                            const checksDone = CHECKLIST_ITEMS.filter(c => l[c.key] !== null).length;
                            return (
                                <div key={l.id} className="rounded-2xl p-5"
                                    style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)" }}>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                                style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
                                                🎮
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{l.name}</p>
                                                <p className="text-xs text-ink-muted">{l.console} · {l.condition} · Est. ₹{l.estimated_val?.toLocaleString("en-IN")}</p>
                                                <a href={`tel:${l.phone}`} className="flex items-center gap-1 text-xs mt-0.5 hover:text-white transition-colors" style={{ color: "#a5b4fc" }}>
                                                    <Phone className="w-3 h-3" /> {l.phone}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-ink-muted flex-shrink-0">
                                            <span className="text-[10px]">{checksDone}/7 checks</span>
                                            <button onClick={() => { setChecklistModal(l); setChecklistForm(l); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-ink-muted hover:text-white transition-colors"
                                                style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                                <ClipboardList className="w-3.5 h-3.5" /> 7-Point Check
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="label text-[9px] px-2.5 py-1 rounded-full capitalize"
                                                style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                                                {l.status.replace("_", " ")}
                                            </span>
                                            <div className="relative">
                                                <button onClick={() => setOpenDropdownId(openDropdownId === l.id ? null : l.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-ink-muted hover:text-white transition-colors"
                                                    style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                                    Update <ChevronDown className={`w-3 h-3 transition-transform ${openDropdownId === l.id ? "rotate-180" : ""}`} />
                                                </button>
                                                {openDropdownId === l.id && (
                                                    <div className="absolute right-0 top-full mt-1.5 rounded-xl overflow-hidden z-20"
                                                        style={{ background: "#07071a", border: "1px solid rgba(168,85,247,0.3)", minWidth: "140px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                                                        {LEAD_STATUSES.filter(s => s !== l.status).map(s => (
                                                            <button key={s} onClick={() => updateLeadStatus(l.id, s)}
                                                                className="w-full text-left px-3.5 py-2.5 text-xs font-medium capitalize hover:bg-purple-950/60 transition-colors"
                                                                style={{ color: statusStyle[s]?.text }}>
                                                                → {s.replace("_", " ")}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {/* ── KYC REVIEW TAB ── */}
                {tab === "kyc" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        {kycProfiles.length === 0 && (
                            <div className="text-center py-16 text-ink-muted">No KYC submissions yet.</div>
                        )}
                        {kycProfiles.map((p) => {
                            const st = statusStyle[p.kyc_status] || statusStyle.completed;
                            return (
                                <div key={p.id} className="rounded-2xl p-5"
                                    style={{ background: "rgba(10,10,28,0.9)", border: `1px solid ${p.kyc_status === "pending" ? "rgba(234,179,8,0.2)" : "rgba(30,30,74,0.8)"}` }}>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                                style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
                                                👤
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{p.full_name || "Anonymous"}</p>
                                                {p.phone && (
                                                    <a href={`tel:${p.phone}`} className="flex items-center gap-1 text-xs text-ink-muted hover:text-white transition-colors">
                                                        <Phone className="w-3 h-3" /> {p.phone}
                                                    </a>
                                                )}
                                                <p className="text-[10px] text-ink-faint mt-0.5">
                                                    Submitted: {new Date(p.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Doc preview link */}
                                        <div className="flex-shrink-0">
                                            {p.kyc_doc_url ? (
                                                <a href={p.kyc_doc_url} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors hover:text-white"
                                                    style={{ border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
                                                    <ExternalLink className="w-3.5 h-3.5" /> View ID Doc
                                                </a>
                                            ) : (
                                                <span className="text-xs text-ink-faint italic">No doc uploaded</span>
                                            )}
                                        </div>

                                        {/* Status + actions */}
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="label text-[9px] px-2.5 py-1 rounded-full capitalize"
                                                style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                                                {p.kyc_status}
                                            </span>
                                            {p.kyc_status === "pending" && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => updateKycStatus(p.id, "verified")}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                                                        style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", color: "#4ade80" }}>
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                                    </button>
                                                    <button onClick={() => updateKycStatus(p.id, "rejected")}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                                                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                                    </button>
                                                </div>
                                            )}
                                            {p.kyc_status === "verified" && (
                                                <button onClick={() => updateKycStatus(p.id, "rejected")}
                                                    className="text-xs text-ink-faint hover:text-red-400 transition-colors px-2 py-1">
                                                    Revoke
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {/* ── PRODUCTS TAB ── */}
                {tab === "products" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-ink-muted">{products.length} total products</p>
                            <button onClick={() => openProductModal()}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
                                style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 0 16px rgba(99,102,241,0.3)" }}>
                                <Plus className="w-4 h-4" /> Add Product
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((p) => (
                                <div key={p.id} className="rounded-2xl p-5 flex items-center gap-4"
                                    style={{ background: "rgba(10,10,28,0.9)", border: "1px solid rgba(30,30,74,0.8)", opacity: p.available ? 1 : 0.5 }}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                                        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                                        {p.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white text-sm truncate">{p.name}</p>
                                        <p className="text-xs text-ink-muted">{p.edition} · {p.category}</p>
                                        {p.serial_number && <p className="text-[10px] text-ink-faint mt-0.5">S/N: {p.serial_number}</p>}
                                        <div className="flex gap-2 mt-1 text-[10px]">
                                            {p.rent_price && <span style={{ color: "#a5b4fc" }}>₹{p.rent_price}{p.rent_period}</span>}
                                            {p.buy_price && <span style={{ color: "#c084fc" }}>Buy ₹{p.buy_price}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button onClick={() => openProductModal(p)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-white transition-colors"
                                            style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => deleteProduct(p.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-red-400 transition-colors"
                                            style={{ border: "1px solid rgba(30,30,74,0.9)", color: "#64748b" }}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* ── 7-POINT CHECKLIST MODAL ── */}
            <AnimatePresence>
                {checklistModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setChecklistModal(null)}
                            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                            <div className="w-full max-w-md rounded-2xl overflow-hidden"
                                style={{ background: "#0a0a1e", border: "1px solid rgba(168,85,247,0.3)" }}>
                                <div className="h-1" style={{ background: "linear-gradient(90deg, #a855f7, #6366f1)" }} />
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <div>
                                            <h3 className="font-heading font-bold text-white">7-Point Inspection</h3>
                                            <p className="text-xs text-ink-muted mt-0.5">{checklistModal.name} · {checklistModal.console}</p>
                                        </div>
                                        <button onClick={() => setChecklistModal(null)}
                                            className="w-8 h-8 rounded-xl flex items-center justify-center text-ink-muted hover:text-white"
                                            style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-2.5 mb-5">
                                        {CHECKLIST_ITEMS.map(({ key, label }) => {
                                            const val = checklistForm[key] as boolean | null;
                                            return (
                                                <div key={key} className="flex items-center justify-between p-3 rounded-xl"
                                                    style={{ background: "rgba(7,7,26,0.8)", border: "1px solid rgba(30,30,74,0.8)" }}>
                                                    <span className="text-sm text-ink-muted">{label}</span>
                                                    <div className="flex gap-2">
                                                        {[true, false].map((v) => (
                                                            <button key={String(v)} onClick={() => setChecklistForm(prev => ({ ...prev, [key]: v }))}
                                                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                                                                style={val === v
                                                                    ? { background: v ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)", color: v ? "#4ade80" : "#fca5a5", border: `1px solid ${v ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}` }
                                                                    : { background: "transparent", color: "#334155", border: "1px solid rgba(30,30,74,0.8)" }}>
                                                                {v ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                                {v ? "Pass" : "Fail"}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mb-4">
                                        <label className="label text-[9px] text-ink-muted block mb-1.5">Admin Notes</label>
                                        <textarea value={checklistForm.admin_notes || ""} rows={2}
                                            onChange={(e) => setChecklistForm(prev => ({ ...prev, admin_notes: e.target.value }))}
                                            placeholder="Observations, offer adjustments..."
                                            className="w-full px-3 py-2.5 rounded-xl text-ink text-sm focus:outline-none resize-none"
                                            style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)" }} />
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => setChecklistModal(null)}
                                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-ink-muted hover:text-white transition-colors"
                                            style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                            Cancel
                                        </button>
                                        <button onClick={saveChecklist} disabled={savingChecklist}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white"
                                            style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}>
                                            {savingChecklist ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Inspection
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── PRODUCT MODAL ── */}
            <AnimatePresence>
                {productModal.open && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setProductModal({ open: false, editing: null })}
                            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                            <div className="w-full max-w-lg rounded-2xl overflow-hidden"
                                style={{ background: "#0a0a1e", border: "1px solid rgba(99,102,241,0.3)" }}>
                                <div className="h-1" style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="font-heading font-bold text-white text-lg">
                                            {productModal.editing ? "Edit Product" : "Add New Product"}
                                        </h3>
                                        <button onClick={() => setProductModal({ open: false, editing: null })}
                                            className="w-8 h-8 rounded-xl flex items-center justify-center text-ink-muted hover:text-white"
                                            style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                                        <div className="grid grid-cols-4 gap-3">
                                            <div>
                                                <label className="label text-[9px] text-ink-muted block mb-1.5">Emoji</label>
                                                <input value={productForm.emoji} onChange={(e) => setProductForm({ ...productForm, emoji: e.target.value })}
                                                    className="w-full px-3 py-2.5 rounded-xl text-center text-2xl focus:outline-none"
                                                    style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)" }} />
                                            </div>
                                            <div className="col-span-3">
                                                <label className="label text-[9px] text-ink-muted block mb-1.5">Product Name *</label>
                                                <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                    placeholder="PlayStation 5" className="w-full px-3 py-2.5 rounded-xl text-ink text-sm focus:outline-none"
                                                    style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)" }} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: "Edition", key: "edition", placeholder: "Disc Edition" },
                                                { label: "Serial Number", key: "serial_number", placeholder: "CFI-1200A01" },
                                            ].map(({ label, key, placeholder }) => (
                                                <div key={key}>
                                                    <label className="label text-[9px] text-ink-muted block mb-1.5">{label}</label>
                                                    <input value={(productForm as Record<string, unknown>)[key] as string || ""} placeholder={placeholder}
                                                        onChange={(e) => setProductForm({ ...productForm, [key]: e.target.value })}
                                                        className="w-full px-3 py-2.5 rounded-xl text-ink text-sm focus:outline-none"
                                                        style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)" }} />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="label text-[9px] text-ink-muted block mb-1.5">Category</label>
                                                <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                                    className="w-full px-3 py-2.5 rounded-xl text-ink text-sm focus:outline-none"
                                                    style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)", colorScheme: "dark" }}>
                                                    <option value="consoles">Consoles</option>
                                                    <option value="games">Games</option>
                                                    <option value="accessories">Accessories</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="label text-[9px] text-ink-muted block mb-1.5">Warehouse Status</label>
                                                <select value={productForm.warehouse_status} onChange={(e) => setProductForm({ ...productForm, warehouse_status: e.target.value })}
                                                    className="w-full px-3 py-2.5 rounded-xl text-ink text-sm focus:outline-none"
                                                    style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)", colorScheme: "dark" }}>
                                                    <option value="in_warehouse">In Warehouse</option>
                                                    <option value="rented">Rented</option>
                                                    <option value="sold">Sold</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="label text-[9px] text-ink-muted block mb-1.5">Rent Price (₹)</label>
                                                <input type="number" value={productForm.rent_price ?? ""} placeholder="1500"
                                                    onChange={(e) => setProductForm({ ...productForm, rent_price: e.target.value ? Number(e.target.value) : null })}
                                                    className="w-full px-3 py-2.5 rounded-xl text-ink text-sm focus:outline-none"
                                                    style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)" }} />
                                            </div>
                                            <div>
                                                <label className="label text-[9px] text-ink-muted block mb-1.5">Period</label>
                                                <select value={productForm.rent_period ?? "/wk"} onChange={(e) => setProductForm({ ...productForm, rent_period: e.target.value })}
                                                    className="w-full px-3 py-2.5 rounded-xl text-ink text-sm focus:outline-none"
                                                    style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)", colorScheme: "dark" }}>
                                                    <option value="/day">/day</option>
                                                    <option value="/wk">/wk</option>
                                                    <option value="/mo">/mo</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="label text-[9px] text-ink-muted block mb-1.5">Buy Price (₹)</label>
                                                <input type="number" value={productForm.buy_price ?? ""} placeholder="38000"
                                                    onChange={(e) => setProductForm({ ...productForm, buy_price: e.target.value ? Number(e.target.value) : null })}
                                                    className="w-full px-3 py-2.5 rounded-xl text-ink text-sm focus:outline-none"
                                                    style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)" }} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="label text-[9px] text-ink-muted block mb-1.5">Badge Text</label>
                                                <input value={productForm.badge || ""} placeholder="Most Popular"
                                                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                                                    className="w-full px-3 py-2.5 rounded-xl text-ink text-sm focus:outline-none"
                                                    style={{ background: "#07071a", border: "1px solid rgba(30,30,74,0.9)" }} />
                                            </div>
                                        </div>

                                        <div className="flex gap-6">
                                            {[
                                                { label: "Certified ✓", key: "certified" },
                                                { label: "Available", key: "available" },
                                            ].map(({ label, key }) => (
                                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                                    <div onClick={() => setProductForm({ ...productForm, [key]: !(productForm as Record<string, unknown>)[key] })}
                                                        className="w-10 h-5 rounded-full relative transition-colors"
                                                        style={{ background: (productForm as Record<string, unknown>)[key] ? "#6366f1" : "rgba(30,30,74,0.9)" }}>
                                                        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                                                            style={{ left: (productForm as Record<string, unknown>)[key] ? "23px" : "2px" }} />
                                                    </div>
                                                    <span className="text-xs text-ink-muted">{label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-5 pt-4" style={{ borderTop: "1px solid rgba(30,30,74,0.9)" }}>
                                        <button onClick={() => setProductModal({ open: false, editing: null })}
                                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-ink-muted transition-colors hover:text-white"
                                            style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                            Cancel
                                        </button>
                                        <button onClick={saveProduct} disabled={saving || !productForm.name}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                                            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {saving ? "Saving..." : "Save Product"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}
