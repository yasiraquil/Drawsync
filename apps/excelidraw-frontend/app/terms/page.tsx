"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsPage() {
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
                    <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms & Conditions</h1>
                    <p className="text-gray-400 mb-8">Last updated: January 29, 2026</p>

                    <div className="prose prose-invert prose-gray max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
                            <p className="text-gray-300 leading-relaxed">
                                By accessing and using DrawSync, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">2. Description of Service</h2>
                            <p className="text-gray-300 leading-relaxed">
                                DrawSync is a real-time collaborative whiteboard application that allows users to create, share, and collaborate on digital drawings and diagrams. The service includes features such as real-time synchronization, room management, and AI-powered tools.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">3. User Accounts</h2>
                            <p className="text-gray-300 leading-relaxed">
                                To access certain features of DrawSync, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">4. User Content</h2>
                            <p className="text-gray-300 leading-relaxed">
                                You retain ownership of any content you create using DrawSync. By using our service, you grant us a limited license to store, display, and transmit your content as necessary to provide the service. You are solely responsible for the content you create and share.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">5. Acceptable Use</h2>
                            <p className="text-gray-300 leading-relaxed">
                                You agree not to use DrawSync for any unlawful purpose or in any way that could damage, disable, or impair the service. Prohibited activities include but are not limited to: uploading malicious content, attempting to gain unauthorized access, or interfering with other users&apos; enjoyment of the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">6. Intellectual Property</h2>
                            <p className="text-gray-300 leading-relaxed">
                                The DrawSync service, including its original content, features, and functionality, is owned by DrawSync and is protected by international copyright, trademark, and other intellectual property laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">7. Termination</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">8. Limitation of Liability</h2>
                            <p className="text-gray-300 leading-relaxed">
                                DrawSync shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. We provide the service &quot;as is&quot; without any warranties of any kind.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">9. Changes to Terms</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page. Your continued use of the service after such modifications constitutes your acceptance of the updated terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Us</h2>
                            <p className="text-gray-300 leading-relaxed">
                                If you have any questions about these Terms & Conditions, please contact us at support@drawsync.com.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
