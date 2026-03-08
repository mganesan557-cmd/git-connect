export function AfsvIcon({ className = "w-6 h-6", ...props }: React.ComponentProps<"svg">) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={className}
            {...props}
        >
            <mask id="afsv-cutout">
                <rect width="100" height="100" fill="white" />
                <circle cx="50" cy="50" r="10" fill="black" />
                {Array.from({ length: 10 }).map((_, i) => (
                    <g key={i} transform={`rotate(${i * 36} 50 50)`}>
                        <rect x="43" y="-5" width="14" height="42" rx="7" fill="black" />
                    </g>
                ))}
            </mask>
            <circle cx="50" cy="50" r="48" fill="currentColor" mask="url(#afsv-cutout)" />
        </svg>
    );
}
