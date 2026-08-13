'use client';

import React, { useTransition } from 'react';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/app/admin/login/actions';

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isPending}
            title="Cerrar sesión"
            className="text-brand-black/40 hover:text-brand-black transition-colors cursor-pointer disabled:opacity-50"
        >
            <LogOut className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
        </button>
    );
}