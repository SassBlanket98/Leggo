// src/types/react-native-swipeable-card-stack.d.ts
declare module 'react-native-swipeable-card-stack' {
    import * as React from 'react';
    import { StyleProp, ViewStyle } from 'react-native';
  
    export interface SwipeableCardStackProps<T = any> {
      data: T[];
      renderItem: (item: T, index: number) => React.ReactElement | null;
      onSwipedLeft?: (index: number) => void;
      onSwipedRight?: (index: number) => void;
      onSwipedTop?: (index: number) => void;
      onSwipedBottom?: (index: number) => void;
      onSwipedAll?: () => void;
      onSwipeStart?: (index: number) => void;
      onSwipeEnd?: (index: number) => void;
      loop?: boolean;
      stackSeparation?: number;
      stackScale?: number;
      style?: StyleProp<ViewStyle>;
      // Add other props based on the library's documentation
    }
  
    export default class SwipeableCardStack<T = any> extends React.Component<SwipeableCardStackProps<T>> {
      swipeLeft: () => void;
      swipeRight: () => void;
      swipeTop: () => void;
      swipeBottom: () => void;
      // Add other methods if available via ref
    }
  }