import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { TouchableOpacity, View, Text, Pressable } from "react-native";
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
      {/* Backdrop cobrindo 100% */}
      <Pressable
        onPress={close}
        style={{
          position: "absolute",
          top: 0, right: 0, bottom: 0, left: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      />

      {/* SHEET ancorado no rodapé (sem gaps) */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: "12%",              // ocupa ~88% da altura (ajuste se quiser mais/menos)
          backgroundColor: "#111827", // troque para #fff se preferir claro
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflow: "hidden",
        }}
      >
        <SafeAreaView edges={["bottom"]} style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
          {/* drag handle */}
          <View style={{ alignItems: "center", marginBottom: 8 }}>
            <View style={{ width: 44, height: 5, borderRadius: 999, backgroundColor: "#ffffff44" }} />
          </View>

          {/* header */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#1f2937", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="person" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                {user?.fullName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
              </Text>
              <Text style={{ color: "#9CA3AF", fontSize: 13 }}>
                {user?.emailAddresses?.[0]?.emailAddress}
              </Text>
            </View>
            <TouchableOpacity
              onPress={close}
              style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#1f2937" }}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* items */}
          <View style={{ backgroundColor: "#0b1220", borderRadius: 16, overflow: "hidden" }}>
            <Item icon="person-outline" label="Editar perfil" onPress={() => router.push("/root/edit-profile")} />
            <Sep />
            <Item icon="notifications-outline" label="Notificações" onPress={() => {}} />
            <Sep />
            <Item icon="document-text-outline" label="Termos e privacidade" onPress={() => {}} />
          </View>

          {/* sair */}
          <TouchableOpacity
            onPress={async () => { await signOut(); router.replace("/sign-in"); }}
            activeOpacity={0.8}
            style={{
              marginTop: 14, height: 56, borderRadius: 16,
              backgroundColor: COLORS.expense,
              alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8,
            }}
          >
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Sair</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </View>
  );
}

function Item({ icon, label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}
      style={{ height: 56, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Ionicons name={icon} size={20} color="#93C5FD" />
      <Text style={{ color: "#E5E7EB", fontWeight: "600", fontSize: 15 }}>{label}</Text>
      <View style={{ marginLeft: "auto" }}>
        <Ionicons name="chevron-forward" size={18} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );
}
const Sep = () => <View style={{ height: 1, backgroundColor: "#111827" }} />;
