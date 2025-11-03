import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function NotificationsScreen() {
  const router = useRouter();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [tipsEnabled, setTipsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Preferências */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferências</Text>

          <RowSwitch
            icon="notifications-outline"
            label="Notificações push"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <Divider />

          <RowSwitch
            icon="mail-outline"
            label="E-mail"
            value={emailEnabled}
            onValueChange={setEmailEnabled}
          />
          <Divider />

          <RowSwitch
            icon="chatbubble-ellipses-outline"
            label="SMS"
            value={smsEnabled}
            onValueChange={setSmsEnabled}
          />
          <Divider />

          <RowSwitch
            icon="sparkles-outline"
            label="Dicas e novidades"
            value={tipsEnabled}
            onValueChange={setTipsEnabled}
          />
        </View>

        {/* Categorias de alerta */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Categorias de alerta</Text>
          <RowInfo icon="cash-outline" title="Movimentações" subtitle="Avisos sobre entradas e despesas" />
          <Divider />
          <RowInfo icon="alert-circle-outline" title="Falhas e limites" subtitle="Erros no app e limites de uso" />
          <Divider />
          <RowInfo icon="shield-checkmark-outline" title="Segurança" subtitle="Acessos, trocas de senha e afins" />
        </View>

        <Text style={styles.helper}>
          Você pode alterar essas preferências a qualquer momento. Algumas comunicações essenciais (ex.: segurança)
          poderão ser enviadas mesmo com notificações desativadas.
        </Text>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function RowSwitch({ icon, label, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? COLORS.white : COLORS.card}
        trackColor={{ false: COLORS.border, true: COLORS.income }}
      />
    </View>
  );
}

function RowInfo({ icon, title, subtitle }) {
  return (
    <View style={styles.rowCol}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
        <View>
          <Text style={styles.rowLabel}>{title}</Text>
          <Text style={styles.rowSub}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: COLORS.text },
  backButton: { padding: 4 },

  card: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 14, marginBottom: 16,
    shadowColor: COLORS.shadow, shadowOpacity: 0.15, shadowRadius: 6, elevation: 2,
  },
  cardTitle: { color: COLORS.white, fontWeight: "700", fontSize: 16, marginBottom: 8 },

  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  rowCol: { paddingVertical: 10 },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowLabel: { color: COLORS.white, fontSize: 15, fontWeight: "600" },
  rowSub: { color: COLORS.textLight, fontSize: 13, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 6 },

  helper: { color: COLORS.textLight, fontSize: 12, textAlign: "center", paddingHorizontal: 16 },
});
