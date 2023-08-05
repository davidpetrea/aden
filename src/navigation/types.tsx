import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

//Root level stacks
export type RootStackParamList = {
  Intro: NavigatorScreenParams<IntroStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Battle: NavigatorScreenParams<BattleStackParamList>;
};

//Utility for getting root params list keys
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

//Intro Stack
export type IntroStackParamList = {
  CharacterCreate: undefined;
};

//Main Tab
export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamsList>;
  Map: undefined;
};

//Main Tab > Home Stack
export type HomeStackParamsList = {
  Town: undefined;
  Inventory: undefined;
};

//Battle Stack
export type BattleStackParamList = {
  BattleMain: undefined;
  BattleInventory: undefined;
};

//Screen props

export type IntroStackScreenProps<T extends keyof IntroStackParamList> =
  CompositeScreenProps<
    StackScreenProps<IntroStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type HomeStackScreenProps<T extends keyof HomeStackParamsList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamsList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type BattleStackScreenProps<T extends keyof BattleStackParamList> =
  CompositeScreenProps<
    StackScreenProps<BattleStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
