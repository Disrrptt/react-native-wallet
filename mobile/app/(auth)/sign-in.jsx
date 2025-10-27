import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
  if (!isLoaded) return;

  try {
    if (signIn && signIn.status === "needs_identifier") await signIn.reload();
    const attempt = await signIn.create({
      identifier: emailAddress.trim(),
      password,
    });

    if (attempt.status === "complete") {
      await setActive({ session: attempt.createdSessionId });
      router.replace("/");
      return;
    }

    if (attempt.status === "needs_identifier") {
      setError("E-mail não encontrado. Verifique e tente novamente.");
      return;
    }

    if (attempt.status === "needs_first_factor") {
      setError("Por favor, confirme o e-mail antes de fazer login.");
      return;
    }

    if (attempt.status === "needs_second_factor") {
      setError("Verificação em duas etapas necessária.");
      return;
    }

    // Fallback: se algo inesperado vier
    console.warn("SignIn status:", attempt.status);
    setError("Erro inesperado. Tente novamente mais tarde.");
  } catch (err) {
    console.log("Erro no login:", err);

    const code = err?.errors?.[0]?.code;

    if (code === "form_password_incorrect") {
      setError("Senha incorreta. Tente novamente.");
    } else if (code === "form_identifier_not_found") {
      setError("Conta não encontrada. Verifique o e-mail digitado.");
    } else if (code === "session_exists") {
      setError("Você já está logado em outro dispositivo.");
    } else if (code === "form_identifier_exists") {
      setError("Esse e-mail já está cadastrado.");
    } else {
      setError("Erro ao fazer login. Tente novamente.");
    }
  }
};


  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
    >
      <View style={styles.container}>
        <Image source={require("../../assets/images/Login-amico.png")} style={styles.illustration} />
        <Text style={styles.title}>Bem vindo de novo!</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Entre com seu e-mail"
          placeholderTextColor="#9A8478"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Entre com sua senha"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Link href="/forgot-password" asChild>
          <TouchableOpacity style={{ alignItems: "center", marginBottom: 10 }}>
            <Text style={styles.linkText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>

          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Crie aqui</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}