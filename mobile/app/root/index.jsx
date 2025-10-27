import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import PageLoader from "../../components/PageLoader";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import { useTransactions } from "../../hooks/useTransactions";
import { styles } from "../../assets/styles/home.styles";
import { COLORS } from "../../constants/colors";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user?.firstName
    ? `${user.firstName}${user?.lastName ? ` ${user.lastName}` : ""}`
    : user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? "usuário";


  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(user.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = (id) => {
    Alert.alert("Excluir transação", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => deleteTransaction(id) },
    ]);
  };

  const hasTx = (transactions?.length ?? 0) > 0;

  if (isLoading && !refreshing) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER (sem logo; com menu “Mais”) */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Bem vindo, </Text>
            <Text style={styles.usernameText}>{displayName}</Text>
          </View>

          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={headerStyles.menuButton}
              onPress={() => router.push("/modals/more")} // <- abre o modal
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={20} color="#ffffff" />
              <Text style={headerStyles.menuButtonText}>Mais</Text>
            </TouchableOpacity>

            {menuOpen && (
              <View style={headerStyles.menuCard}>
                <TouchableOpacity
                  style={headerStyles.menuItem}
                  onPress={() => {
                    setMenuOpen(false);
                    // Se sua tela está em app/root/edit-profile.jsx, use /root/edit-profile
                    router.push("/root/edit-profile");
                  }}
                >
                  <Ionicons name="person" size={18} color={COLORS.text} />
                  <Text style={headerStyles.menuItemText}>Editar perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[headerStyles.menuItem, headerStyles.menuItemDanger]}
                  onPress={async () => {
                    setMenuOpen(false);
                    await signOut();
                    router.replace("/sign-in");
                  }}
                >
                  <Ionicons name="log-out" size={18} color="#fff" />
                  <Text style={headerStyles.menuItemDangerText}>Sair</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Transações recentes</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={[styles.transactionsListContent, { paddingBottom: 120 }]}
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* BOTÃO INFERIOR PRINCIPAL */}
      <TouchableOpacity
        style={ctaStyles.bottomCta}
        activeOpacity={0.85}
        onPress={() => router.push("/root/create")}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={ctaStyles.bottomCtaText}>
          {hasTx ? "Adicionar transação" : "Adicione sua primeira transação"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/** estilos aditivos rápidos (mantém seu design system) */
const headerStyles = {
  menuButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 2,
  },
  menuButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  menuCard: {
    position: "absolute",
    top: 48,
    right: 0,
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    gap: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  menuItemText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  menuItemDanger: {
    backgroundColor: COLORS.expense,
    justifyContent: "flex-start",
  },
  menuItemDangerText: {
    color: "#fff",
    fontWeight: "700",
  },
};

const ctaStyles = {
  bottomCta: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  bottomCtaText: { color: "#fff", fontWeight: "700", fontSize: 16 },
};
