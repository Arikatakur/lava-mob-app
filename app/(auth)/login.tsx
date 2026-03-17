import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { useTranslation } from '../../src/hooks/useTranslation';
import { authService } from '../../src/services/auth.service';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../../src/theme';

function toE164(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('972')) return '+' + digits;
  if (digits.startsWith('0')) return '+972' + digits.slice(1);
  if (digits.length >= 9) return '+972' + digits;
  return digits;
}

export default function Login() {
  const { t, isRTL } = useTranslation();
  const { setGuest } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    const e164 = toE164(phone.trim());
    if (e164.length < 12) {
      setError(isRTL ? 'מספר טלפון לא תקין' : 'Invalid phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.sendOtp(e164);
      router.push({ pathname: '/(auth)/otp' as never, params: { phone: e164 } });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send code');
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
            <Text style={styles.title}>{t.auth.enterPhone}</Text>
            <Text style={styles.subtitle}>{t.auth.phoneSubtitle}</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error ? (
              <View style={styles.errorBanner}>
                <MaterialIcons name="error-outline" size={18} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputWrapper}>
              <View style={styles.prefixBox}>
                <Text style={styles.prefixText}>🇮🇱 +972</Text>
              </View>
              <TextInput
                style={[styles.phoneInput, isRTL && styles.rtlInput]}
                placeholder="05X-XXX-XXXX"
                placeholderTextColor={Colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoFocus
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />
            </View>

            <Button
              label={t.auth.sendCode}
              onPress={handleSend}
              loading={loading}
              fullWidth
              size="lg"
              style={styles.submitBtn}
            />
          </View>

          {/* Guest */}
          <TouchableOpacity
            style={styles.guestBtn}
            onPress={() => {
              setGuest(true);
              router.replace('/(tabs)/home');
            }}
          >
            <Text style={styles.guestText}>{t.auth.guest}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.backgroundPrimary },
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
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: { gap: Spacing[4] },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '15',
    borderRadius: 10,
    padding: Spacing[3],
    gap: Spacing[2],
  },
  errorText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  prefixBox: {
    paddingHorizontal: Spacing[3],
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
  },
  prefixText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  rtlInput: { textAlign: 'right' },
  submitBtn: { marginTop: Spacing[2] },
  guestBtn: {
    alignSelf: 'center',
    marginTop: Spacing[8],
    paddingVertical: Spacing[2],
  },
  guestText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
