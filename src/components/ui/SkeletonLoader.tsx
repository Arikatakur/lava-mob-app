import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height, borderRadius = Radius.sm, style }: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as number, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton({ width }: { width?: number }) {
  // When width is provided keep image as a square to match ProductCard aspect ratio
  const imageHeight = width ?? 140;
  return (
    <View style={[styles.cardSkeleton, width !== undefined && { width }]}>
      <Skeleton height={imageHeight} borderRadius={12} style={styles.imageSkeleton} />
      <View style={styles.textSkeletons}>
        <Skeleton height={14} width="70%" />
        <Skeleton height={12} width="50%" style={{ marginTop: 6 }} />
        <Skeleton height={16} width="40%" style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

export function BannerSkeleton() {
  return <Skeleton height={160} borderRadius={Radius.lg} style={{ marginHorizontal: 20 }} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.skeletonBase,
  },
  cardSkeleton: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',

  },
  imageSkeleton: {
    width: '100%',
  },
  textSkeletons: {
    padding: Spacing[3],
  },
});
