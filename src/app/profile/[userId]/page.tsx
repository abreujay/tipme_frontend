'use client'

import { useState, useEffect } from "react"
import ProfileHeader from "@/components/Profile/profileHeader";
import { LoadingSpinner } from "@/components/Loading/spinner";

type Props = {
    params: Promise<{
        userId: string;
    }>;
}

export default function UserProfilePage({ params }: Props) {
    const [userId, setUserId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        params.then(({ userId }) => {
            setUserId(userId);
            setLoading(false);
        });
    }, [params]);

    if (loading) {
        return (
             <div className="flex items-center justify-center h-screen bg-black">
                <LoadingSpinner size="lg" text="Carregando..." />
            </div>
        );
    }

    return (
         <main className="bg-[var(--midnight-black)] flex items-center text-black min-h-screen flex-col p-2">
              <section className="flex flex-col p-4 gap-6 sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px]">
                <ProfileHeader userId={userId} />
              </section>
         </main>
    );
}