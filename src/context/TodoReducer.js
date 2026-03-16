// src/context/TodoReducer.js
export const ACTIONS = {
  ADD_TODO: "ADD_TODO",
  TOGGLE_TODO: "TOGGLE_TODO",
  DELETE_TODO: "DELETE_TODO",
  EDIT_TODO: "EDIT_TODO",
  CLEAR_DONE: "CLEAR_DONE",
  REORDER_TODOS: "REORDER_TODOS",
};

export const todoReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      if (!action.payload.trim()) return state; // Guard
      return [
        ...state,
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: action.payload.trim(),
          done: false,
          createdAt: new Date().toISOString(),
        },
      ];
    case ACTIONS.TOGGLE_TODO:
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo,
      );
    case ACTIONS.DELETE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case ACTIONS.EDIT_TODO:
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, text: action.payload } : todo,
      );
    case ACTIONS.CLEAR_DONE:
      return state.filter((todo) => !todo.done);
    case ACTIONS.REORDER_TODOS:
      const newState = [...state];
      const [movedItem] = newState.splice(action.payload.fromIndex, 1);
      newState.splice(action.payload.toIndex, 0, movedItem);
      return newState;
    default:
      return state;
  }
};
