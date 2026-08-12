// ui/components/modals/ContactTrigger.tsx
'use client';

import React, { useState } from 'react';
import { ContactModal } from '@/ui/components/modals/ContactModal';

interface ContactTriggerProps {
    children: React.ReactNode;
    className?: string;
}

export function ContactTrigger({ children, className = '' }: ContactTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`cursor-pointer ${className}`}
            >
                {children}
            </button>

            {/* Renderiza el modal cuando se abre */}
            <ContactModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}