import React from 'react';

export default function ASOSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans antialiased">
            <main className="relative pb-10">{children}</main>
        </div>
    );
}
