import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../src/store/useCartStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Colors, FontFamily, FontSize, Shadows, Spacing } from '../../src/theme';

const ICON_WRAP_W = 56;
const ICON_WRAP_H = 32;

function TabIconWrap({
  children,
  focused,
}: {
  children: React.ReactNode;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
      {children}
    </View>
  );
}

function TabIcon({
  name,
  color,
  focused,
}: {
  name: keyof typeof MaterialIcons.glyphMap;
  color: string;
  focused: boolean;
}) {
  return (
    <TabIconWrap focused={focused}>
      <MaterialIcons name={name} size={focused ? 24 : 22} color={color} />
    </TabIconWrap>
  );
}

function CartTabIcon({ color, focused }: { color: string; focused: boolean }) {
  const count = useCartStore((s) => s.getItemCount());
  return (
    <TabIconWrap focused={focused}>
      <View>
        <MaterialIcons name="shopping-bag" size={focused ? 24 : 22} color={color} />
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
          </View>
        )}
      </View>
    </TabIconWrap>
  );
}

function RewardsTabIcon({ color, focused }: { color: string; focused: boolean }) {
  const { profile } = useAuthStore();
  const points = profile?.points ?? 0;

  return (
    <TabIconWrap focused={focused}>
      <View>
        <MaterialIcons name="card-giftcard" size={focused ? 24 : 22} color={color} />
        {points > 0 && (
          <View style={[styles.pointsBadge, focused && styles.pointsBadgeFocused]}>
            <Text style={styles.pointsBadgeText}>{points >= 1000 ? '1k+' : points}</Text>
          </View>
        )}
      </View>
    </TabIconWrap>
  );
}

// Suppress unused warning — kept for future use if a rewards tab is added back.
void RewardsTabIcon;

export default function TabsLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Bottom inset already gives us the home-indicator clearance on iPhone X+.
  // Pair it with a fixed 8px breathing room so labels never crowd the bezel.
  const bottomPad = Math.max(insets.bottom, Spacing[2]);
  const tabBarHeight = 60 + bottomPad;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { height: tabBarHeight, paddingBottom: bottomPad }],
        tabBarActiveTintColor: Colors.primaryBrown,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t.home.title,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: t.menu.title,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="menu-book" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t.cart.tabTitle,
          tabBarIcon: ({ color, focused }) => (
            <CartTabIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t.favorites.title,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="favorite" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.profile.tabTitle,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    paddingTop: Spacing[1.5],
    ...Shadows.lg,
  },
  tabItem: {
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    gap: 2,
  },
  tabLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    marginTop: 2,
    // Arabic glyphs sit higher than Latin — extra line height keeps labels off the icon
    lineHeight: 14,
    includeFontPadding: false,
  },
  iconWrap: {
    width: ICON_WRAP_W,
    height: ICON_WRAP_H,
    borderRadius: ICON_WRAP_H / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapFocused: {
    backgroundColor: Colors.primaryBrown + '18', // ~9% opacity primary brown pill
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.white,
  },
  pointsBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: Colors.accentCaramel,
    borderRadius: 8,
    minWidth: 22,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  pointsBadgeFocused: {
    backgroundColor: Colors.primaryBrown,
  },
  pointsBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 8,
    color: Colors.white,
  },
});
