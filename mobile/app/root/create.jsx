// app/root/create.jsx  (ou o caminho onde está sua tela)
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useState, useMemo } from "react";
import { API_URL } from "../../constants/api";
import { styles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
  { id: "food", name: "Comidas e bebidas", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transporte", icon: "car" },
  { id: "entertainment", name: "Entretenimento", icon: "film" },
  { id: "bills", name: "Impostos", icon: "receipt" },
  { id: "income", name: "Recebido/Entrada", icon: "cash" },
  { id: "other", name: "Outros", icon: "ellipsis-horizontal" },
];

const CreateScreen = () => {
  const router = useRouter();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // categorias habilitadas conforme o tipo
  const isCategoryDisabled = useMemo(
    () => (catId) => (isExpense ? catId === "income" : catId !== "income"),
    [isExpense]
  );

  const handleCreate = async () => {
    if (!title.trim()) return Alert.alert("Erro", "Informe o título da transação.");
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return Alert.alert("Erro", "Informe um valor válido.");
    }
    if (!selectedCategory) return Alert.alert("Erro", "Selecione uma categoria.");

    setIsLoading(true);
    try {
      const formattedAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // opcional: enviar userId p/ chavear rate limit por usuário
          "x-user-id": user?.id || "anon",
        },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: formattedAmount,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        // tenta ler json, mas cuidado para não ler 2x
        let msg = `${response.status} ${response.statusText}`;
        try {
          const err = await response.json();
          if (err?.message) msg = err.message;
        } catch { }

        if (response.status === 429 || response.status === 503) {
          Alert.alert(
            "Muitas requisições",
            "Você fez muitas ações em sequência. Tente novamente em alguns segundos."
          );
        } else {
          Alert.alert("Erro", msg || "Falha ao criar transação");
        }
        throw new Error(msg);
      }

      Alert.alert("Sucesso", "Transação criada com sucesso!");
      router.back();
    } catch (error) {
      console.error("Create transaction failed:", error?.message || error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Nova transação</Text>

        <TouchableOpacity
          style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.income} />
          ) : (
            <>
              <Text style={[styles.saveButton, { color: COLORS.income }]}>Salvar</Text>
              <Ionicons name="checkmark" size={18} color={COLORS.income} />
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* TIPO: DESPESA / RECEBIDO */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, isExpense && styles.typeButtonActiveExpense]}
              onPress={() => {
                setIsExpense(true);
                // se estiver em "Recebido" e a categoria for apenas income, mantém; senão limpa
                if (selectedCategory === "Recebido/Entrada") setSelectedCategory("");
              }}
            >
              <Ionicons
                name="arrow-down-circle"
                size={22}
                color={isExpense ? COLORS.white : COLORS.expense}
                style={styles.typeIcon}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  isExpense && styles.typeButtonTextActive,
                ]}
              >
                Despesa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeButton, !isExpense && styles.typeButtonActiveIncome]}
              onPress={() => {
                setIsExpense(false);
                // força a categoria para "Recebido/Entrada" se outra estiver selecionada
                if (selectedCategory !== "Recebido/Entrada") setSelectedCategory("");
              }}
            >
              <Ionicons
                name="arrow-up-circle"
                size={22}
                color={!isExpense ? COLORS.white : COLORS.income}
                style={styles.typeIcon}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  !isExpense && styles.typeButtonTextActive,
                ]}
              >
                Recebido
              </Text>
            </TouchableOpacity>
          </View>

          {/* VALOR */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              selectionColor={COLORS.text}
            />
          </View>

          {/* TÍTULO */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="create-outline"
              size={22}
              color={COLORS.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Título da transação"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={title}
              onChangeText={setTitle}
              selectionColor={COLORS.text}
            />
          </View>

          {/* CATEGORIA */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="pricetag-outline" size={16} color={COLORS.text} /> Categoria
          </Text>

          <View style={styles.categoryGrid}>
            {CATEGORIES.map((category) => {
              const selected = selectedCategory === category.name;
              const disabled = isCategoryDisabled(category.id);

              return (
                <TouchableOpacity
                  key={category.id}
                  activeOpacity={disabled ? 1 : 0.85}
                  onPress={() => !disabled && setSelectedCategory(category.name)}
                  style={[
                    styles.categoryButton,
                    selected && styles.categoryButtonActive,
                    disabled && { opacity: 0.35 },
                  ]}
                >
                  <Ionicons
                    name={category.icon}
                    size={20}
                    color={selected ? COLORS.white : COLORS.text}
                    style={styles.categoryIcon}
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selected && styles.categoryButtonTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.income} />
        </View>
      )}
    </View>
  );
};

export default CreateScreen;
