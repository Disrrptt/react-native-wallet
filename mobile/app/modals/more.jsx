// app/modals/more.jsx
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { TouchableOpacity, View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function MoreSheet() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();

  const close = () => router.back();

  return (
    <View style={{ flex: 1 }}>
      {/* Backdrop cobrindo 100% (tema) */}
      <Pressable
        onPress={close}
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.70)", // mais escuro (sem “cinza”)
        }}
      />

      {/* Sheet ancorado no rodapé (tema) */}
      <View style={styles.sheet}>
        <SafeAreaView edges={["bottom"]} style={styles.safer}>
          {/* drag handle */}
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          {/* header */}
          <View style={styles.headerRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={22} color={COLORS.white} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.nameText}>
                {user?.fullName ||
                  user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
              </Text>
              <Text style={styles.emailText}>
                {user?.emailAddresses?.[0]?.emailAddress}
              </Text>
            </View>

            <TouchableOpacity onPress={close} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* lista */}
          <View style={styles.listCard}>
            <Item
              icon="person-outline"
              label="Editar perfil"
              onPress={() => router.push("/root/edit-profile")}
            />
            <Sep />
            <Item icon="notifications-outline" label="Notificações"  onPress={() => router.push("/root/notifications")} />
            <Sep />
            <Item
              icon="document-text-outline"
              label="Termos e privacidade"
               onPress={() => router.push("/root/terms")}
            />
          </View>

          {/* Sair (vermelho do tema) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={async () => {
              await signOut();
              router.replace("/sign-in");
            }}
            style={styles.signOutBtn}
          >
            <Ionicons name="log-out-outline" size={18} color={COLORS.white} />
            <Text style={styles.signOutText}>Sair</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </View>
  );
}

function Item({ icon, label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.itemRow}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <Text style={styles.itemText}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
    </TouchableOpacity>
  );
}
const Sep = () => <View style={styles.sep} />;

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0, right: 0, bottom: 0, left: 0,
    backgroundColor: "rgba(0,0,0,0.45)", // escurece sem “cinza chapado”
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: "12%", // ocupa ~88% da altura
    backgroundColor: COLORS.background, // fundo do tema
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  safer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  handleWrap: { alignItems: "center", marginBottom: 8 },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: COLORS.border,
    opacity: 0.7,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },
  nameText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
  emailText: { color: COLORS.textLight, fontSize: 13 },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
  },

  listCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: "hidden",
  },
  itemRow: {
    height: 56,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemText: { color: COLORS.white, fontWeight: "600", fontSize: 15, flex: 1 },
  sep: { height: 1, backgroundColor: COLORS.border },

  signOutBtn: {
    marginTop: 350,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.expense,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  signOutText: { color: COLORS.white, fontWeight: "800", fontSize: 16 },
});
