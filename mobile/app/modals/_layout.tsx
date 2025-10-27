import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "transparentModal", // mantém o backdrop visível
        headerShown: false,
        animation: "slide_from_bottom",
      }}
    />
  );
}
