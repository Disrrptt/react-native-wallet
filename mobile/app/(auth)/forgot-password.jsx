import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function ForgotPasswordPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!isLoaded || !emailAddress?.trim()) return;
    setLoading(true);
    setError("");

    try {
      // dispara e-mail de redefinição
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress.trim(),
      });

      // vai para a tela de confirmação estilizada
      router.replace("/forgot-password-sent");
    } catch (err) {
      const code = err?.errors?.[0]?.code;
      if (code === "form_identifier_not_found") {
        setError("Não encontramos uma conta com esse e-mail.");
      } else {
        setError("Não foi possível enviar o e-mail. Tente novamente.");
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
          source={require("../../assets/images/Forgot password-amico.png")}
          style={styles.illustration}
        />
        <Text style={styles.title}>Esqueceu sua senha?</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <Text
          style={{
            color: "#E5E7EB", // cinza claro padronizado
            fontSize: 16,
            textAlign: "center",
            marginTop: 8,
            marginBottom: 20,
            lineHeight: 22,
          }}
        >
          Digite seu e-mail e enviaremos instruções para redefinir sua senha.
        </Text>


        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={emailAddress}
          placeholder="Entre com seu e-mail"
          placeholderTextColor="#9A8478"
          onChangeText={setEmailAddress}
          returnKeyType="send"
          onSubmitEditing={onSubmit}
        />

        <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? "Enviando..." : "Enviar E-mail de Recuperação"}
          </Text>
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
