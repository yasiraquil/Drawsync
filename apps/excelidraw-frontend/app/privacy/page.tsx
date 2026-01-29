"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="fixed w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
                <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                </nav>
            </header>

            {/* Content */}
            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
                    <p className="text-gray-400 mb-8">Last updated: January 29, 2026</p>

                    <div className="prose prose-invert prose-gray max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
                            <p className="text-gray-300 leading-relaxed">
                                At DrawSync, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our collaborative whiteboard service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">2. Information We Collect</h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                We collect information that you provide directly to us, including:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>Account information (name, email address, password)</li>
                                <li>Room data and drawings you create</li>
                                <li>Communications with us</li>
                                <li>Usage data and interaction with the service</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Send technical notices and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Protect against fraudulent or illegal activity</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Storage and Security</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We implement appropriate technical and organizational security measures to protect your personal information. Your data is stored on secure servers and transmitted using encryption. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">5. Data Sharing</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances: with your consent, to comply with legal obligations, to protect our rights, or with service providers who assist in our operations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">6. Your Rights</h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>Access your personal data</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to processing of your data</li>
                                <li>Export your data in a portable format</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">7. Cookies and Tracking</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">8. Children&apos;s Privacy</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">9. Changes to This Policy</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Us</h2>
                            <p className="text-gray-300 leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at privacy@drawsync.com.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
