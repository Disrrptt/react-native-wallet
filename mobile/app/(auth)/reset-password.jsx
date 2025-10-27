import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/auth.styles";
import { useState } from "react";
import { COLORS } from "../../constants/colors";

export default function ResetPasswordPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onReset = async () => {
    if (!isLoaded) return;
    if (!password || password.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 3) Define a nova senha
      const res = await signIn.resetPassword({
        password,
        signOutOfOtherSessions: true,
      });

      // Após resetar, não vamos logar automaticamente; voltamos ao Login
      if (res?.status === "complete" || res?.status === "needs_identifier") {
        router.replace("/sign-in");
      } else {
        // fallback: mesmo assim voltar ao login
        router.replace("/sign-in");
      }
    } catch (err) {
      const code = err?.errors?.[0]?.code;
      if (code === "form_password_pwned") {
        setError("Essa senha é insegura. Tente outra.");
      } else if (code === "form_password_length_too_short") {
        setError("A senha é muito curta.");
      } else {
        setError("Não foi possível redefinir sua senha. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      enableAutomaticScroll
      extraScrollHeight={30}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/Reset password-pana.png")}
          style={styles.illustration}
        />

        <Text style={styles.title}>Definir nova senha</Text>

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
          style={styles.input}
          value={password}
          placeholder="Nova senha"
          placeholderTextColor="#9A8478"
          secureTextEntry
          onChangeText={setPassword}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          value={confirm}
          placeholder="Confirmar nova senha"
          placeholderTextColor="#9A8478"
          secureTextEntry
          onChangeText={setConfirm}
          returnKeyType="send"
          onSubmitEditing={onReset}
        />

        <TouchableOpacity style={styles.button} onPress={onReset} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Salvando..." : "Salvar nova senha"}</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Lembrou sua senha?</Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Fazer login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
