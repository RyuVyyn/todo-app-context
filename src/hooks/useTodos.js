// src/hooks/useTodos.js
import { useTodoContext } from "../context/TodoContext";
import { useMemo } from "react";
export const useTodos = (filter = "all") => {
  const { todos, addTodo, toggleTodo, deleteTodo, clearDone, reorderTodos } =
    useTodoContext();
  // Computed values — gunakan useMemo untuk optimasi
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.done);
      case "completed":
        return todos.filter((t) => t.done);
      default:
        return todos;
    }
  }, [todos, filter]);
  const stats = useMemo(
    () => ({
      total: todos.length,
      active: todos.filter((t) => !t.done).length,
      completed: todos.filter((t) => t.done).length,
    }),
    [todos],
  );
  return {
    todos: filteredTodos,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearDone,
    reorderTodos,
  };
};
