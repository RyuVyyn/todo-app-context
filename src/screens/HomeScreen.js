// src/screens/HomeScreen.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useTodos } from "../hooks/useTodos";
import { useFilter } from "../hooks/useFilter";
import AddTodoForm from "../components/AddTodoForm";
import TodoItem from "../components/TodoItem";
import { useTheme } from "../context/ThemeContext";
import { TouchableOpacity } from "react-native";
import FilterBar from "../components/FilterBar";
import ReanimatedTodoItem from "../components/ReanimatedTodoItem";
const HomeScreen = () => {
  // Custom hook untuk filter
  const { activeFilter, setFilter, FILTERS } = useFilter();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const styles = getStyles(colors);
  // Custom hook untuk semua todo operations
  const { todos, stats, addTodo, toggleTodo, deleteTodo, clearDone, reorderTodos } =
    useTodos(activeFilter);

  // Function untuk handle reorder dengan index tracking
  const handleReorder = (toIndex, fromIndex) => {
    if (toIndex !== fromIndex && toIndex >= 0 && toIndex < todos.length) {
      reorderTodos(fromIndex, toIndex);
    }
  };
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.container}>
        {/* Header with Toggle Theme Button */}
        <View style={[styles.header, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
          <View>
            <Text style={styles.title}>My Todos</Text>
            <Text style={styles.subtitle}>
              {stats.completed} dari {stats.total} selesai
            </Text>
          </View>
          {/* Toggle Theme Button */}
          <TouchableOpacity
            style={[styles.themeBtn, { backgroundColor: colors.accent }]}
            onPress={toggleTheme}
          >
            <Text style={styles.themeBtnText}>{isDarkMode ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
        </View>
        {/* Form tambah todo */}
        <AddTodoForm onAdd={addTodo} />
        {/* Filter bar */}
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setFilter}
          stats={stats}
        />
        {/* Daftar todo */}
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ReanimatedTodoItem
              todo={item}
              index={index}
              totalCount={todos.length}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onReorder={handleReorder}
              colors={colors}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Tidak ada todo{" "}
              {activeFilter !== "all" ? `dengan filter '${activeFilter}'` : ""}
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
        {/* Clear done button */}
        {stats.completed > 0 && (
          <Text style={styles.clearBtn} onPress={clearDone}>
            Hapus {stats.completed} item selesai
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};
// Fungsi yang generate styles berdasarkan colors
const getStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: 20, backgroundColor: colors.bg },
  header: { marginBottom: 24, paddingTop: 8 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  themeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  themeBtnText: { fontSize: 24 },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 60,
    fontSize: 16,
  },
  clearBtn: {
    textAlign: "center",
    color: colors.danger,
    padding: 12,
    fontSize: 14,
  },
});
export default HomeScreen;
