// app/index.jsx
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null; // deixa o Splash do Expo até o Clerk carregar

  // você tem a pasta "root", então a home logada é "/root"
  return <Redirect href={isSignedIn ? "/root" : "/sign-in"} />;
}
