import React, { memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const ReanimatedTodoItem = memo(
  ({ todo, index, onToggle, onDelete, onReorder, colors, totalCount }) => {
    const translateY = useSharedValue(0);
    const scaleFactor = useSharedValue(1);
    const lastReorderedIndex = useSharedValue(index);

    const ITEM_HEIGHT = 72;

    // Gesture untuk reorder - bisa multi-step
    const gesture = Gesture.Pan()
      .onStart(() => {
        lastReorderedIndex.value = index;
        scaleFactor.value = withSpring(1.04, {
          damping: 10,
          mass: 0.7,
          overshootClamping: false,
        });
      })
      .onUpdate((event) => {
        // Direct translation - smooth saat drag
        translateY.value = event.translationY;

        // Hitung berapa banyak items yang perlu di-pass
        const itemsPassed = Math.round(event.translationY / ITEM_HEIGHT);
        const newIndex = Math.max(0, Math.min(index + itemsPassed, totalCount - 1));

        // Update lastReorderedIndex tapi jangan trigger reorder di onUpdate
        // Trigger reorder akan di onEnd
        lastReorderedIndex.value = newIndex;
      })
      .onEnd(() => {
        // Trigger reorder hanya 1x di onEnd dengan final index
        const finalIndex = lastReorderedIndex.value;
        if (finalIndex !== index) {
          runOnJS(onReorder)(finalIndex, index);
        }

        // Reset ke posisi awal dengan smooth spring
        translateY.value = withSpring(0, {
          damping: 12,
          mass: 0.9,
          overshootClamping: true,
          restSpeedThreshold: 0.001,
          restDisplacementThreshold: 0.001,
        });

        // Scale back ke normal
        scaleFactor.value = withSpring(1, {
          damping: 10,
          mass: 0.7,
        });

        lastReorderedIndex.value = index;
      });

    // Animated style - simple dan efficient
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateY: translateY.value },
          { scale: scaleFactor.value },
        ],
        zIndex: scaleFactor.value > 1.01 ? 1000 : 0,
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={animatedStyle}>
          <View
            style={[
              styles.container,
              {
                backgroundColor: todo.done
                  ? colors.accentLight
                  : colors.bgSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Drag Handle - untuk indicate bisa di-drag */}
            <View style={styles.dragHandle}>
              <Text style={{ color: colors.textSecondary, fontSize: 16 }}>⋮</Text>
            </View>

            {/* Checkbox */}
            <TouchableOpacity
              style={[
                styles.checkbox,
                {
                  borderColor: colors.accent,
                  backgroundColor: todo.done ? colors.accent : "transparent",
                },
              ]}
              onPress={() => onToggle(todo.id)}
            >
              {todo.done && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>

            {/* Teks */}
            <Text
              style={[
                styles.text,
                {
                  color: colors.text,
                  textDecorationLine: todo.done ? "line-through" : "none",
                },
              ]}
              numberOfLines={1}
            >
              {todo.text}
            </Text>

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete(todo.id)}
            >
              <Text style={{ color: colors.danger, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 0,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dragHandle: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  deleteBtn: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReanimatedTodoItem;