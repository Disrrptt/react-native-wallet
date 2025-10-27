import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

const toJSONorThrow = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Expected JSON, got: ${text.slice(0, 200)}`);
  }
};

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ balance: 0, income: 0, expenses: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    const url = `${API_URL}/transactions/${encodeURIComponent(userId)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`List ${res.status}: ${t.slice(0, 200)}`);
      }
      const data = await toJSONorThrow(res);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    const url = `${API_URL}/transactions/summary/${encodeURIComponent(userId)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Summary ${res.status}: ${t.slice(0, 200)}`);
      }
      const data = await toJSONorThrow(res);
      // garante shape
      setSummary({
        balance: Number(data.balance) || 0,
        income: Number(data.income) || 0,
        expenses: Number(data.expenses) || 0,
      });
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Delete ${res.status}: ${t.slice(0, 200)}`);
      }
      await loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
