// src/context/TodoContext.js
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { todoReducer, ACTIONS } from "./TodoReducer";
// 1. Buat Context
const TodoContext = createContext(null);
const STORAGE_KEY = "@todos";
// 2. Buat Provider Component
export const TodoProvider = ({ children }) => {
  const [todos, dispatch] = useReducer(todoReducer, []);
  // Load data dari AsyncStorage saat mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.forEach((todo) => {
            dispatch({ type: ACTIONS.ADD_TODO, payload: todo.text });
          });
        }
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    };
    loadTodos();
  }, []);
  // Simpan ke AsyncStorage setiap ada perubahan
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos)).catch((err) =>
      console.error("Error saving:", err),
    );
  }, [todos]);
  // Action creators (lebih mudah dipanggil di komponen)
  const addTodo = useCallback((text) => {
    dispatch({ type: ACTIONS.ADD_TODO, payload: text });
  }, []);
  const toggleTodo = useCallback((id) => {
    dispatch({ type: ACTIONS.TOGGLE_TODO, id });
  }, []);
  const deleteTodo = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_TODO, id });
  }, []);
  const clearDone = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_DONE });
  }, []);
  const reorderTodos = useCallback((fromIndex, toIndex) => {
    dispatch({ type: ACTIONS.REORDER_TODOS, payload: { fromIndex, toIndex } });
  }, []);
  // Value yang dibagikan ke seluruh tree
  const value = {
    todos,
    dispatch,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearDone,
    reorderTodos,
  };
  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
// 3. Export custom hook untuk konsumsi
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext harus digunakan dalam TodoProvider!");
  }
  return context;
};
