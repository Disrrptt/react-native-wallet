import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useState, useEffect, useMemo } from "react";
import { styles } from "../../assets/styles/profile.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Pré-carrega dados
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.emailAddresses?.[0]?.emailAddress || "");
      setPhone(user.phoneNumbers?.[0]?.phoneNumber || "");
    }
  }, [user]);

  const fullName = useMemo(() => {
    const n = `${firstName?.trim() || ""} ${lastName?.trim() || ""}`.trim();
    return n || "Usuário";
  }, [firstName, lastName]);

  const handleSaveProfile = async () => {
    if (!firstName.trim()) {
      Alert.alert("Erro", "O nome é obrigatório");
      return;
    }

    setIsLoading(true);
    try {
      // Clerk usa camelCase nas propriedades
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Força atualização dos dados locais
      if (user?.reload) await user.reload();

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Erro ao atualizar Clerk:", error);
      Alert.alert("Erro", "Falha ao atualizar o perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Editar Perfil</Text>

        <TouchableOpacity
          style={[styles.saveBtn, isLoading && styles.saveBtnDisabled]}
          disabled={isLoading}
          onPress={handleSaveProfile}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              <Text style={styles.saveBtnText}>Salvar</Text>
              <Ionicons name="checkmark" size={18} color={COLORS.primary} />
            </>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* HERO */}
          <View style={styles.hero}>
            <Image
              source={require("../../assets/images/Privacy policy-rafiki.png")}
              style={styles.heroImage}
              resizeMode="contain"
            />
            <View style={styles.avatarWrap}>
              <Text style={styles.fullName}>{fullName}</Text>
              <Text style={styles.emailText}>{email || "email@exemplo.com"}</Text>
            </View>
          </View>

          {/* FORM CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informações Pessoais</Text>

            {/* Nome */}
            <View style={styles.field}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                placeholder="Digite seu nome"
                placeholderTextColor={COLORS.textLight}
                onChangeText={setFirstName}
                returnKeyType="next"
              />
            </View>

            {/* Sobrenome */}
            <View style={styles.field}>
              <Text style={styles.label}>Sobrenome</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                placeholder="Digite seu sobrenome"
                placeholderTextColor={COLORS.textLight}
                onChangeText={setLastName}
                returnKeyType="next"
              />
            </View>

            {/* E-mail (bloqueado) */}
            <View style={styles.field}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={email}
                editable={false}
                placeholder="Digite seu e-mail"
                placeholderTextColor={COLORS.textLight}
              />
              <Text style={styles.helper}>
                O e-mail não pode ser alterado por questões de segurança
              </Text>
            </View>

            {/* Telefone */}
            <View style={styles.field}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                placeholder="Digite seu telefone"
                placeholderTextColor={COLORS.textLight}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* DANGER ZONE */}
          <View style={styles.dangerCard}>
            <Text style={styles.dangerTitle}>Zona de Perigo</Text>

            <TouchableOpacity
              style={styles.dangerAction}
              onPress={() =>
                Alert.alert(
                  "Excluir Conta",
                  "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
                  [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Excluir", style: "destructive" },
                  ]
                )
              }
            >
              <Ionicons name="trash" size={20} color={COLORS.expense} />
              <Text style={styles.dangerActionText}>Excluir Conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
