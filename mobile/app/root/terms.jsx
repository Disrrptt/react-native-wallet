import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function TermsPrivacyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Termos & Privacidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>Atualizado em 27/10/2025</Text>

        <Section title="1. Introdução">
          <P>
            Este documento descreve os Termos de Uso e a Política de Privacidade do aplicativo Wallet. Ao
            utilizar o app, você concorda com as condições aqui apresentadas.
          </P>
        </Section>

        <Section title="2. Coleta e uso de dados">
          <P>
            Coletamos dados pessoais básicos (ex.: e-mail, nome) para autenticação e dados de uso para
            melhorar a experiência. Seus dados financeiros inseridos são utilizados exclusivamente para
            exibir saldos, transações e estatísticas.
          </P>
        </Section>

        <Section title="3. Compartilhamento">
          <P>
            Não vendemos seus dados. Podemos compartilhar informações estritamente necessárias com serviços
            de infraestrutura (ex.: provedor de banco de dados) sob acordo de processamento.
          </P>
        </Section>

        <Section title="4. Segurança">
          <P>
            Empregamos práticas de segurança adequadas e camadas de proteção. Ainda assim, nenhum sistema é
            100% imune; recomendamos uso de senhas fortes e manter seu dispositivo atualizado.
          </P>
        </Section>

        <Section title="5. Seus direitos">
          <P>
            Você pode solicitar acesso, correção e exclusão de seus dados. Para isso, utilize o menu
            <Text style={styles.bold}> Editar perfil</Text> ou contate o suporte.
          </P>
        </Section>

        <Section title="6. Termos de uso">
          <P>
            Você concorda em usar o app de forma lícita, sem tentar explorar falhas ou violar limites de
            uso. Podemos suspender contas em caso de abuso ou violação destes termos.
          </P>
        </Section>

        <Section title="7. Contato">
          <P>
            Em caso de dúvidas: <Text style={styles.link}>supportwallet@gmail.com</Text>.
          </P>
        </Section>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}
function P({ children }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: COLORS.text },
  backButton: { padding: 4 },

  content: { padding: 16 },
  updated: { color: COLORS.textLight, fontSize: 12, marginBottom: 12 },

  section: { backgroundColor: COLORS.card, borderRadius: 16, padding: 14, marginBottom: 12 },
  sectionTitle: { color: COLORS.white, fontWeight: "700", fontSize: 16, marginBottom: 6 },
  paragraph: { color: COLORS.text, lineHeight: 20, fontSize: 14 },
  bold: { fontWeight: "700", color: COLORS.white },
  link: { color: COLORS.primary, textDecorationLine: "underline" },
});
