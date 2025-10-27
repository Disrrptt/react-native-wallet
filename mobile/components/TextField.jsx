import { useState, useMemo } from "react";
import { View, TextInput, Text } from "react-native";
import { COLORS } from "../constants/colors";

export default function TextField({
  value,
  onChangeText,
  placeholder = "",
  label,
  secureTextEntry,
  keyboardType,
  style,
  containerStyle,
  returnKeyType,
  onSubmitEditing,
  editable = true,
}) {
  const [focused, setFocused] = useState(false);
  const isEmpty = (value ?? "") === "";

  // estilos condicionais (sem afetar títulos externos)
  const bg = isEmpty ? COLORS.inputBgEmpty : COLORS.inputBg;
  const color = isEmpty ? COLORS.inputTextEmpty : COLORS.inputText;
  const phColor = isEmpty ? COLORS.inputTextEmpty : `${COLORS.text}99`;
  const borderColor = focused ? COLORS.inputBorderFocus : COLORS.inputBorder;

  const labelColor = useMemo(
    () => (isEmpty ? "#000" : COLORS.textLight),
    [isEmpty]
  );

  return (
    <View style={[{ gap: 8 }, containerStyle]}>
      {label ? (
        <Text style={{ color: labelColor, fontWeight: "700", fontSize: 14 }}>
          {label}
        </Text>
      ) : null}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={phColor}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          {
            height: 52,
            borderRadius: 14,
            paddingHorizontal: 14,
            backgroundColor: bg,
            color,
            borderWidth: 1,
            borderColor,
          },
          style,
        ]}
      />
    </View>
  );
}
