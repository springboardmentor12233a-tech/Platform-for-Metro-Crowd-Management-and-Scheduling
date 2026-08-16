import { useEffect, useRef, useState } from "react";

import { googleLogin, saveAuth } from "../../services/authService";


export default function GoogleLoginButton({
    onSuccess,
    onError,
}) {

    const buttonRef = useRef(null);

    const [loading, setLoading] =
        useState(false);


    useEffect(() => {

        const initializeGoogle =
            () => {

                if (
                    !window.google ||
                    !buttonRef.current
                ) {
                    return;
                }


                window.google.accounts.id.initialize({

                    client_id:
                        import.meta.env
                            .VITE_GOOGLE_CLIENT_ID,

                    callback:
                        handleCredentialResponse,

                });


                window.google.accounts.id.renderButton(

                    buttonRef.current,

                    {
                        theme: "outline",
                        size: "large",
                        width: 320,
                        text: "signin_with",
                        shape: "rectangular",
                    }

                );

            };


        if (window.google) {

            initializeGoogle();

        } else {

            const timer =
                setInterval(() => {

                    if (window.google) {

                        clearInterval(timer);

                        initializeGoogle();

                    }

                }, 100);


            return () => clearInterval(timer);

        }

    }, []);


    async function handleCredentialResponse(
        response
    ) {

        try {

            setLoading(true);


            if (!response?.credential) {

                throw new Error(
                    "Google did not return a credential."
                );

            }


            const data =
                await googleLogin(
                    response.credential
                );


            saveAuth(data);


            if (onSuccess) {

                onSuccess(data);

            }

        } catch (error) {

            console.error(
                "Google login failed:",
                error
            );


            if (onError) {

                onError(error);

            }

        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="flex flex-col items-center gap-3">

            <div
                ref={buttonRef}
            />

            {loading && (

                <p className="text-sm text-slate-400">
                    Signing in with Google...
                </p>

            )}

        </div>

    );

}