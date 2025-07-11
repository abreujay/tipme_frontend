'use client'

import { useState, useEffect } from "react"
import { PixDonationForm } from "@/components/Profile/pixDonationForm";
import ProfileHeader from "@/components/Profile/profileHeader";

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
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Carregando perfil...</p>
                </div>
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