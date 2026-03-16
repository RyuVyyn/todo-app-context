// src/components/FilterBar.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { FILTERS } from "../hooks/useFilter";
const FilterBar = ({ activeFilter, onFilterChange, stats }) => {
  const buttons = [
    { key: FILTERS.ALL, label: `Semua (${stats.total})` },
    { key: FILTERS.ACTIVE, label: `Aktif (${stats.active})` },
    { key: FILTERS.COMPLETED, label: `Selesai (${stats.completed})` },
  ];
  return (
    <View style={styles.container}>
      {buttons.map((btn) => (
        <TouchableOpacity
          key={btn.key}
          style={[styles.btn, activeFilter === btn.key && styles.btnActive]}
          onPress={() => onFilterChange(btn.key)}
        >
          <Text
            style={[
              styles.label,
              activeFilter === btn.key && styles.labelActive,
            ]}
          >
            {btn.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flexDirection: "row", marginBottom: 16, gap: 8 },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  btnActive: { backgroundColor: "#38BDF8" },
  label: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  labelActive: { color: "#FFFFFF", fontWeight: "700" },
});
export default FilterBar;
