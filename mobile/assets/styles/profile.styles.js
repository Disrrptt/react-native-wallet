import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* HEADER */
  header: {
    height: 72,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginRight: 40,
  },
  saveBtn: {
    position: "absolute",
    right: 16,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 14,
  },

  /* SCROLL */
  scroll: { flex: 1 },

  /* HERO */
  hero: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroImage: {
    width: "100%",
    height: 140,
    opacity: 0.9,
  },
  avatarWrap: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  fullName: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  emailText: {
    marginTop: 2,
    fontSize: 14,
    color: COLORS.textLight,
  },

  /* CARD FORM */
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
  },
  field: { marginBottom: 14 },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    fontSize: 16,
    color: COLORS.inputText,
  },
  inputDisabled: {
    backgroundColor: COLORS.border,
    color: COLORS.textLight,
  },
  helper: {
    marginTop: 6,
    fontSize: 12.5,
    color: COLORS.textLight,
  },

  /* DANGER */
  dangerCard: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 24,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.expense,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.expense,
    marginBottom: 10,
  },
  dangerAction: {
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#2B1C1C",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dangerActionText: {
    color: COLORS.expense,
    fontWeight: "800",
    fontSize: 15,
  },
});

