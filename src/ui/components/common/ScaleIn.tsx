"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScaleInProps {
    children: ReactNode;
    className?: string;
}

export function ScaleIn({ children, className = '' }: ScaleInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.6,
                ease: [0, 0.71, 0.2, 1.01]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}