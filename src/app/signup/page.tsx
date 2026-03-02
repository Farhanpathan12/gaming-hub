"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Gamepad2, Mail, Lock, Eye, EyeOff, User, ArrowRight, Zap, Phone, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [k]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: { full_name: form.name, phone: form.phone },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => router.push("/login"), 2500);
        }
    };

    const inputBase = {
        background: "rgba(7,7,26,0.8)",
        border: "1px solid rgba(30,30,74,0.9)",
    };
    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = "rgba(99,102,241,0.5)";
        e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
    };
    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = "rgba(30,30,74,0.9)";
        e.target.style.boxShadow = "none";
    };

    const fields = [
        { key: "name" as const, icon: User, label: "Full Name", type: "text", placeholder: "Rahul Deshmukh" },
        { key: "email" as const, icon: Mail, label: "Email Address", type: "email", placeholder: "you@example.com" },
        { key: "phone" as const, icon: Phone, label: "WhatsApp Number", type: "tel", placeholder: "+91 98765 43210" },
    ];

    return (
        <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full"
                    style={{ background: "radial-gradient(ellipse at center, rgba(168,85,247,0.1) 0%, transparent 70%)" }} />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[350px] rounded-full"
                    style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(165,180,252,1) 1px, transparent 1px), linear-gradient(90deg, rgba(165,180,252,1) 1px, transparent 1px)`,
                    backgroundSize: "72px 72px",
                }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>

                    <div className="flex flex-col items-center mb-10">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}>
                            <Gamepad2 className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </div>
                        <h1 className="font-heading font-bold text-3xl text-white">Join PGH.</h1>
                        <p className="text-ink-muted text-sm mt-1.5">Create your free gamer account</p>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden p-8"
                        style={{
                            background: "linear-gradient(135deg, rgba(13,13,43,0.95), rgba(10,10,28,0.98))",
                            border: "1px solid rgba(99,102,241,0.2)",
                            boxShadow: "0 0 60px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
                        }}>
                        <div className="absolute top-0 left-0 right-0 h-px"
                            style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(99,102,241,0.4), transparent)" }} />

                        {/* Success state */}
                        {success ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6">
                                <div className="text-5xl mb-4">🎮</div>
                                <h3 className="font-heading font-bold text-white text-xl mb-2">Account created!</h3>
                                <p className="text-ink-muted text-sm">Check your email to verify your account. Redirecting to login...</p>
                            </motion.div>
                        ) : (
                            <>
                                {error && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm"
                                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {fields.map(({ key, icon: Icon, label, type, placeholder }) => (
                                        <div key={key}>
                                            <label className="label text-[10px] text-ink-muted block mb-2">{label}</label>
                                            <div className="relative">
                                                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
                                                <input type={type} value={form[key]} onChange={set(key)} placeholder={placeholder} required
                                                    onFocus={onFocus} onBlur={onBlur}
                                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-ink text-sm placeholder:text-ink-faint focus:outline-none transition-all"
                                                    style={inputBase}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <div>
                                        <label className="label text-[10px] text-ink-muted block mb-2">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
                                            <input type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")}
                                                placeholder="Min 8 characters" required onFocus={onFocus} onBlur={onBlur}
                                                className="w-full pl-11 pr-12 py-3.5 rounded-xl text-ink text-sm placeholder:text-ink-faint focus:outline-none transition-all"
                                                style={inputBase}
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-xs text-ink-muted pt-1">
                                        By signing up you agree to our{" "}
                                        <Link href="#" className="underline underline-offset-2 hover:text-white transition-colors" style={{ color: "#a5b4fc" }}>Terms</Link>
                                        {" "}and{" "}
                                        <Link href="#" className="underline underline-offset-2 hover:text-white transition-colors" style={{ color: "#a5b4fc" }}>Privacy Policy</Link>.
                                    </p>

                                    <button type="submit" disabled={loading}
                                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-white relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                                        style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 0 24px rgba(99,102,241,0.35)" }}>
                                        {!loading && <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] hover:translate-x-[250%] bg-white/20 transition-transform duration-700" />}
                                        {loading
                                            ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                            : <><Zap className="w-4 h-4" strokeWidth={2.5} /> Create Account <ArrowRight className="w-4 h-4" /></>
                                        }
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                    <p className="text-center text-sm text-ink-muted mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold hover:text-white transition-colors" style={{ color: "#a5b4fc" }}>Sign in →</Link>
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
