interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    badge?: string;
    center?: boolean;
}

export function SectionHeader({ title, subtitle, badge, center = true }: SectionHeaderProps) {
    return (
        <div className={`space-y-3 max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
            {badge && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-brand-gold/20 text-brand-gold uppercase tracking-widest">
                    {badge}
                </span>
            )}
            <h2 className="font-passion text-4xl sm:text-5xl text-white tracking-wide">
                {title}
            </h2>
            {subtitle && (
                <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
}