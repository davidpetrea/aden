import { useState } from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';

import { colors } from '../../theme/colors';

type TextFieldProps = {
  label?: string;
  placeholder?: string;
  className?: string; //TODO: proper combining of classes,
  inputProps: TextInputProps;
};

function TextField({
  label,
  placeholder,
  className,
  inputProps,
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View className='w-full'>
      {label && (
        <Text className='text-slate-50 font-semibold text-lg font-[Josefin-Sans]'>
          {label}
        </Text>
      )}
      <TextInput
        className={`bg-neutral-800 p-3 rounded-lg text-slate-50 font-semibold border ${className}  ${
          isFocused ? 'border-slate-300' : 'border-slate-500'
        }`}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        {...inputProps}
      />
    </View>
  );
}

export default TextField;
