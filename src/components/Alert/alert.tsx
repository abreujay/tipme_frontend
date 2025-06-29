'use client'


interface IAlertProps {
    title: string;
    description: string;
    onClose: () => void;
}

export default function Alert ({title, description, onClose}: IAlertProps){


    return(
        
        <div
        className="bg-gradient-to-r from-[var(--midnight-black)] to-gray-800 p-6 rounded-xl border border-[var(--border-primary)] flex flex-col items-center mb-4 shadow-2xl backdrop-blur-sm">
            <h2
            className="text-[var(--bright-azure)] text-[20px] font-semibold mb-3 text-center">
                {title}
            </h2>
            <p
            className="text-[var(--soft-cyan)] text-[16px] text-center mb-4 leading-relaxed">
                {description}
            </p>

            <div
            className="bg-gradient-to-r from-[var(--electric-sky)] to-[var(--bright-azure)] hover:from-[var(--bright-azure)] hover:to-[var(--electric-sky)] text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[var(--electric-sky)]/30 min-w-[80px] cursor-pointer"
            onClick={onClose}>
                OK
            </div>
        </div>
    )
}