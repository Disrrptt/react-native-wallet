import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/auth.styles";
import { useState } from "react";
import { COLORS } from "../../constants/colors";

export default function ForgotPasswordSentPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onVerifyCode = async () => {
    if (!isLoaded || !code.trim()) return;
    setLoading(true);
    setError("");

    try {
      // 2) Verifica o código recebido por e-mail
      const res = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
      });

      // Se o código estiver correto, o Clerk passa para a etapa de definir nova senha
      // (em alguns SDKs o status retornado é “needs_new_password”)
      if (res?.status === "needs_new_password" || res?.status === "complete") {
        router.replace("/reset-password");
      } else {
        // fallback
        router.replace("/reset-password");
      }
    } catch (err) {
      const code = err?.errors?.[0]?.code;
      if (code === "invalid_code" || code === "form_code_incorrect") {
        setError("Código inválido. Verifique e tente novamente.");
      } else {
        setError("Não foi possível validar o código. Tente novamente.");
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
        {/* TROQUE a imagem abaixo se quiser outra ilustração para “código enviado” */}
        <Image
          source={require("../../assets/images/Email campaign-amico.png")}
          style={styles.illustration}
        />

        <Text style={styles.title}>E-mail enviado!</Text>

        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
          <Ionicons name="checkmark-circle" size={22} color={COLORS.income} />
          <Text style={styles.helperText}>
            Um e-mail de recuperação foi enviado para sua caixa de entrada. Insira o código abaixo.
          </Text>
        </View>

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
          value={code}
          placeholder="Digite o código de 6 dígitos"
          placeholderTextColor="#9A8478"
          keyboardType="number-pad"
          returnKeyType="send"
          onChangeText={setCode}
          onSubmitEditing={onVerifyCode}
        />

        <TouchableOpacity style={styles.button} onPress={onVerifyCode} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Verificando..." : "Confirmar código"}</Text>
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
