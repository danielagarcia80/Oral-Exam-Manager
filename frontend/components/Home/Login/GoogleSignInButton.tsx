import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { Button, Flex, Text } from "@mantine/core";

const GoogleSignInButton = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!document.getElementById("google-script")) {
      const script = document.createElement("script");
      script.id = "google-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
      );
    } else {
      console.warn("Google Sign-In script not available yet, retrying...");
      setTimeout(initializeGoogleSignIn, 500);
    }
  };

  const handleCredentialResponse = (response: any) => {
    if (response.credential) {
      console.log("Encoded JWT ID token:", response.credential);
      signIn("google", { redirect: true });
    } else {
      console.error("No credential received from Google");
    }
  };

  if (session) {
    return (
      <Flex direction="column" align="start">
        <Text size="sm">Logged in as:</Text>
        <Text size="sm">{session.user?.name || "Unknown User"}</Text>
        <Text size="xs" color="dimmed">{session.user?.email || "No email provided"}</Text>
        <Button size="xs" mt="sm" color="red" onClick={() => signOut()}>
          Sign Out
        </Button>
      </Flex>
    );
  }

  return <div id="googleSignInDiv"></div>;
};

export default GoogleSignInButton;
