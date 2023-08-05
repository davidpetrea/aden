import TextField from 'components/ui/TextField';
import { Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CharacterClass,
  Player,
  usePlayerStore,
} from '../../stores/playerStore';
import { useForm, Controller } from 'react-hook-form';

import { IntroStackScreenProps } from 'src/navigation/types';

type FormState = Pick<Player, 'name' | 'specialization'>;

function CharacterCreate({
  navigation,
  route,
}: IntroStackScreenProps<'CharacterCreate'>) {
  const createPlayer = usePlayerStore((state) => state.createPlayer);

  // TODO: Add proper validation
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormState>({
    defaultValues: {
      specialization: 'warrior',
    },
  });

  const onSubmit = async (data: FormState) => {
    await createPlayer(data);

    navigation.navigate('Main', {
      screen: 'Home',
      params: {
        screen: 'Town',
      },
    });
  };

  const characterSpecialization = watch('specialization');

  return (
    <SafeAreaView className='flex-1 gap-y-4 items-center justify-center bg-neutral-900 p-4'>
      <View className='w-full rounded-md p-4 bg-gray-800'>
        <Text className='text-slate-500 font-bold text-center'>
          Character creation
        </Text>
      </View>
      <View className='w-full'>
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Character name is required.',
            },
            minLength: {
              value: 3,
              message: 'Character name has a minimum length of 3.',
            },
            maxLength: {
              value: 24,
              message: ' Character name is too long.',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label='Name'
              placeholder='Pick a character name...'
              inputProps={{
                onBlur: onBlur,
                onChangeText: onChange,
                value: value,
                selectTextOnFocus: true,
              }}
            />
          )}
          name='name'
        />
        {errors.name && (
          <Text className='text-red-500'>Character name is required.</Text>
        )}
      </View>
      <View className='flex w-full flex-row'>
        <ClassSelectButton
          isSelected={characterSpecialization === 'warrior'}
          value={'warrior'}
          onPress={() => setValue('specialization', 'warrior')}
        />
        <ClassSelectButton
          isSelected={characterSpecialization === 'mage'}
          value={'mage'}
          onPress={() => setValue('specialization', 'mage')}
        />
      </View>

      <Pressable
        className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out border border-green-400`}
        onPress={handleSubmit(onSubmit)}
      >
        <Text className='font-bold text-center uppercase font-[Josefin-Sans] text-green-400'>
          Create character
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const ClassSelectButton = ({
  isSelected,
  value,
  onPress,
}: {
  isSelected: boolean;
  value: CharacterClass;
  onPress: () => void;
}) => {
  const textClassStyling: Record<CharacterClass, string> = {
    warrior: `text-orange-500`,
    mage: 'text-blue-500',
  };

  const borderClassStyling: Record<CharacterClass, string> = {
    warrior: 'border-orange-500',
    mage: 'border-blue-500',
  };

  return (
    <Pressable
      onPress={onPress}
      className={`${
        isSelected ? `${borderClassStyling[value]}` : 'border-transparent'
      } border p-4 bg-neutral-800 rounded-md flex-1`}
    >
      <Text className={`capitalize ${textClassStyling[value]} text-center`}>
        {value}
      </Text>
    </Pressable>
  );
};

export default CharacterCreate;
