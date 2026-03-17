import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../../theme';
import type { Banner } from '../../types';

const BANNER_WIDTH = Dimensions.get('window').width - Spacing[5] * 2;

interface PromoBannerProps {
  banner: Banner;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

export function PromoBanner({ banner, title, subtitle, onPress }: PromoBannerProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {banner.image_url ? (
        <Image
          source={{ uri: banner.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}

      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: BANNER_WIDTH,
    height: 160,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.darkEspresso,
    marginRight: Spacing[4],
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primaryBrown,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlayDark,
  },
  content: {
    position: 'absolute',
    bottom: Spacing[5],
    left: Spacing[5],
    right: Spacing[5],
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.white,
    marginBottom: Spacing[1],
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
});
