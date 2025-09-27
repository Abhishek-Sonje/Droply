import { useAuth, useClerk, useSignIn } from '@clerk/clerk-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { fi } from 'zod/v4/locales';
import LoadingSpinner from './loading';

export const ForgotPassword: NextPage = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const clerk = useClerk();
    const { isSignedIn } = useAuth();
    const { isLoaded, signIn, setActive } = useSignIn();

    useEffect(() => {
        if (isSignedIn) {
            router.push("/dashboard");
        }
    }, [isSignedIn, router])
    
    if (!isLoaded) {
        return <LoadingSpinner label="Loading..." color="#7AE2CF" />
    }

    

    return (
        <h1>hello</h1>
    )
}
