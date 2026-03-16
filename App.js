// App.js
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TodoProvider } from "./src/context/TodoContext";
import HomeScreen from "./src/screens/HomeScreen";
import { ThemeProvider } from "./src/context/ThemeContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <TodoProvider>
            <StatusBar style="light" />
            <HomeScreen />
          </TodoProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}