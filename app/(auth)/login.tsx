import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useTranslation } from '../../src/hooks/useTranslation';
import { authService } from '../../src/services/auth.service';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Colors, FontFamily, FontSize, Spacing } from '../../src/theme';

export default function Login() {
  const { t, isRTL } = useTranslation();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await authService.signIn(email, password);
      setUser(data.user);
      router.replace('/(tabs)/home');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <MaterialIcons name="local-cafe" size={40} color={Colors.accentCaramel} />
            </View>
            <Text style={styles.brandName}>{t.common.appName}</Text>
            <Text style={styles.title}>{t.auth.welcomeBack}</Text>
            <Text style={styles.subtitle}>{t.auth.signIn}</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error ? (
              <View style={styles.errorBanner}>
                <MaterialIcons name="error-outline" size={18} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label={t.auth.email}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
              isRTL={isRTL}
            />

            <Input
              label={t.auth.password}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              isRTL={isRTL}
            />

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>{t.auth.forgotPassword}</Text>
            </TouchableOpacity>

            <Button
              label={t.auth.signIn}
              onPress={handleLogin}
              loading={loading}
              fullWidth
              size="lg"
              style={styles.submitBtn}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t.auth.noAccount} </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>{t.auth.signUpHere}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[10],
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing[10],
    paddingBottom: Spacing[8],
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.darkEspresso,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  brandName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.darkEspresso,
    marginBottom: Spacing[2],
    letterSpacing: 1,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing[1],
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  form: {
    gap: 0,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '15',
    borderRadius: 10,
    padding: Spacing[3],
    marginBottom: Spacing[4],
    gap: Spacing[2],
  },
  errorText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing[6],
    marginTop: -Spacing[2],
  },
  forgotText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.accentCaramel,
  },
  submitBtn: {
    marginBottom: Spacing[4],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing[8],
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.primaryBrown,
  },
});
