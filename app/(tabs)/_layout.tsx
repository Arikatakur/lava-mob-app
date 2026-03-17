import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCartStore } from '../../src/store/useCartStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Colors, FontFamily, FontSize, Shadows } from '../../src/theme';

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
    <MaterialIcons name={name} size={focused ? 26 : 24} color={color} />
  );
}

function CartTabIcon({ color, focused }: { color: string; focused: boolean }) {
  const count = useCartStore((s) => s.getItemCount());
  return (
    <View>
      <MaterialIcons name="shopping-bag" size={focused ? 26 : 24} color={color} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </View>
  );
}

function RewardsTabIcon({ color, focused }: { color: string; focused: boolean }) {
  const { profile } = useAuthStore();
  const points = profile?.points ?? 0;

  return (
    <View>
      <MaterialIcons name="card-giftcard" size={focused ? 26 : 24} color={color} />
      {points > 0 && (
        <View style={[styles.pointsBadge, focused && styles.pointsBadgeFocused]}>
          <Text style={styles.pointsBadgeText}>{points >= 1000 ? '1k+' : points}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primaryBrown,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="menu-book" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t.cart.title,
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
          title: t.profile.title,
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
    height: 72,
    paddingBottom: 12,
    paddingTop: 8,
    ...Shadows.lg,
  },
  tabLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    marginTop: 2,
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
