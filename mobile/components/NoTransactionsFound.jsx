import { Ionicons } from "@expo/vector-icons";
import { Text,View } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

const NoTransactionsFound = () => {

  return (
    <View style={styles.emptyState}>
      <Ionicons
        name="receipt-outline"
        size={60}
        color={COLORS.textLight}
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}>Sem transações ainda</Text>
      <Text style={styles.emptyStateText}>
        Comece a organizar suas finanças adicionando sua primeira transação.
      </Text>
    </View>
  );
};
export default NoTransactionsFound;