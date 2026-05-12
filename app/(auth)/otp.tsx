import React, { useState, useEffect, useRef } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useTranslation } from '../../src/hooks/useTranslation';
import { authService } from '../../src/services/auth.service';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../../src/theme';
import type { User } from '@supabase/supabase-js';

const RESEND_TIMEOUT = 60;

export default function Otp() {
  const { t, isRTL } = useTranslation();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { setUser, setProfile } = useAuthStore();

  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [verifiedUser, setVerifiedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCount, setResendCount] = useState(RESEND_TIMEOUT);
  const [resending, setResending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, []);

  const startTimer = () => {
    clearTimer();
    setResendCount(RESEND_TIMEOUT);
    timerRef.current = setInterval(() => {
      setResendCount((n) => {
        if (n <= 1) { clearTimer(); return 0; }
        return n - 1;
      });
    }, 1000);
  };

  const clearTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const handleAction = async () => {
    setError('');

    // Step 2: new user entering their name
    if (verifiedUser) {
      if (!fullName.trim()) {
        setError(isRTL ? 'אנא הכנס את שמך' : 'Please enter your name');
        return;
      }
      setLoading(true);
      try {
        const profile = await authService.updateProfile(verifiedUser.id, {
          full_name: fullName.trim(),
          phone,
        });
        setProfile(profile);
        router.replace('/order-mode');
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step 1: verify OTP
    if (code.length !== 6) {
      setError(isRTL ? 'הכנס קוד בן 6 ספרות' : 'Enter the 6-digit code');
      return;
    }
    setLoading(true);
    try {
      const data = await authService.verifyOtp(phone, code);
      const user = data.user;
      if (!user) throw new Error('Verification failed');
      setUser(user);

      const profile = await authService.getProfile(user.id);
      if (profile?.full_name) {
        setProfile(profile);
        router.replace('/order-mode');
      } else {
        // New user — collect name
        setVerifiedUser(user);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('expired')) {
        setError(isRTL ? 'קוד שגוי או פג תוקף' : 'Invalid or expired code');
      } else {
        setError(msg || (isRTL ? 'שגיאה, נסה שוב' : 'Something went wrong'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCount > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      await authService.sendOtp(phone);
      setCode('');
      startTimer();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  const maskedPhone = phone
    ? phone.replace(/(\+\d{3})(\d{2})(\d*)(\d{3})/, '$1 $2•••$4')
    : '';

  const isNameStep = !!verifiedUser;

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
          {/* Back */}
          {!isNameStep && (
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <MaterialIcons
                name={isRTL ? 'arrow-forward' : 'arrow-back'}
                size={24}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialIcons
                name={isNameStep ? 'person' : 'sms'}
                size={32}
                color={Colors.accentCaramel}
              />
            </View>
            <Text style={styles.title}>
              {isNameStep
                ? (isRTL ? 'ברוך הבא!' : 'Welcome!')
                : t.auth.verifyPhone}
            </Text>
            <Text style={styles.subtitle}>
              {isNameStep
                ? (isRTL ? 'רק עוד שנייה לפני שמתחילים' : 'Just one more step before we dive in')
                : <>{t.auth.otpSentTo} <Text style={styles.phoneHighlight}>{maskedPhone}</Text></>
              }
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error ? (
              <View style={styles.errorBanner}>
                <MaterialIcons name="error-outline" size={18} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {isNameStep ? (
              /* Name input for new users */
              <Input
                label={t.auth.fullName}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                leftIcon="person"
                isRTL={isRTL}
                autoFocus
              />
            ) : (
              /* OTP code input */
              <>
                <View style={styles.codeInputWrapper}>
                  <TextInput
                    style={styles.codeInput}
                    placeholder="• • • • • •"
                    placeholderTextColor={Colors.textMuted}
                    value={code}
                    onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={handleAction}
                  />
                </View>

                <View style={styles.resendRow}>
                  <Text style={styles.resendLabel}>
                    {resendCount > 0 ? `${t.auth.resendIn} ${resendCount}${t.auth.seconds}` : ''}
                  </Text>
                  <TouchableOpacity
                    onPress={handleResend}
                    disabled={resendCount > 0 || resending}
                  >
                    <Text style={[
                      styles.resendLink,
                      (resendCount > 0 || resending) && styles.resendDisabled,
                    ]}>
                      {t.auth.resendCode}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <Button
              label={isNameStep ? t.common.done : t.auth.verify}
              onPress={handleAction}
              loading={loading}
              fullWidth
              size="lg"
              style={styles.submitBtn}
            />
          </View>
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
  backBtn: {
    marginTop: Spacing[4],
    padding: Spacing[2],
    alignSelf: 'flex-start',
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing[6],
    paddingBottom: Spacing[8],
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.darkEspresso,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  phoneHighlight: {
    fontFamily: FontFamily.semiBold,
    color: Colors.primaryBrown,
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
  codeInputWrapper: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
  },
  codeInput: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.primaryBrown,
    letterSpacing: 14,
    textAlign: 'center',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -Spacing[2],
  },
  resendLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  resendLink: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.accentCaramel,
  },
  resendDisabled: {
    color: Colors.textMuted,
  },
  submitBtn: { marginTop: Spacing[2] },
});
