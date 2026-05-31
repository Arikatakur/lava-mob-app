import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCartStore } from '../../src/store/useCartStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from '../../src/theme';

function TabIcon({
  name,
  focused,
}: {
  name: keyof typeof MaterialIcons.glyphMap;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <MaterialIcons
        name={name}
        size={24}
        color={focused ? Colors.white : Colors.textMuted}
      />
    </View>
  );
}

function CartTabIcon({ focused }: { focused: boolean }) {
  const count = useCartStore((s) => s.getItemCount());
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <MaterialIcons
        name="shopping-bag"
        size={24}
        color={focused ? Colors.white : Colors.textMuted}
      />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </View>
  );
}

function RewardsTabIcon({ focused }: { focused: boolean }) {
  const { profile } = useAuthStore();
  const points = profile?.points ?? 0;

  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <MaterialIcons
        name="card-giftcard"
        size={24}
        color={focused ? Colors.white : Colors.textMuted}
      />
      {points > 0 && (
        <View style={styles.pointsBadge}>
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
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t.home.title,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: t.menu.title,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="menu-book" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t.cart.tabTitle,
          tabBarIcon: ({ focused }) => (
            <CartTabIcon focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t.favorites.title,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="favorite" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.profile.tabTitle,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: Radius['3xl'],
    height: 68,
    paddingBottom: 4,
    paddingTop: 4,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  tabLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    marginTop: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryBrown,
    ...Shadows.float,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.white,
  },
  pointsBadge: {
    position: 'absolute',
    top: -2,
    right: -6,
    backgroundColor: Colors.softGold,
    borderRadius: Radius.full,
    minWidth: 20,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  pointsBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 8,
    color: Colors.white,
  },
});
