import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Linking, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const MAX_ATTEMPTS = 3;

// ---- demo credentials (hardcoded for pitch/demo purposes) ----
const DEMO_PIN = '123456';
const DEMO_PASSWORD = 'stima2026';

export default function SignInScreen() {
  const router = useRouter();

  // ---- form state ----
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');

  // ---- biometric state ----
  const [hasHardware, setHasHardware] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [biometricIcon, setBiometricIcon] = useState('finger-print-outline');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  // 1 & 2: check hardware support + decide which icon to show
  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setHasHardware(compatible);

    if (!compatible) return; // no hardware -> button won't render at all

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsEnrolled(enrolled);

    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const hasFaceId =
      Platform.OS === 'ios' &&
      supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);

    setBiometricIcon(hasFaceId ? 'scan-outline' : 'finger-print-outline');
  };

  // 3: not enrolled -> tell user to go enable it in Settings
  const promptEnrollment = () => {
    Toast.show({
      type: 'error',
      text1: 'Biometrics not set up',
      text2: 'Enable Face ID / Fingerprint in your device settings first.',
      onPress: () => Linking.openSettings(),
    });
  };

  // 4 & 5: authenticate, fall back to passcode after repeated failures, redirect on success
  const handleBiometricAuth = async () => {
    if (!hasHardware) return;

    if (!isEnrolled) {
      promptEnrollment();
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      Toast.show({
        type: 'info',
        text1: 'Too many failed attempts',
        text2: 'Please use your device passcode instead.',
      });
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: biometricIcon === 'scan-outline' ? 'Sign in with Face ID' : 'Sign in with fingerprint',
      fallbackLabel: 'Use passcode', // iOS only: label for the OS-provided fallback button
      disableDeviceFallback: false,  // false = let the OS fall back to passcode/PIN natively after failures
      cancelLabel: 'Cancel',
    });

    if (result.success) {
      setAttempts(0);
      Toast.show({ type: 'success', text1: 'Welcome back!' });
      router.replace('/(tabs)');
      return;
    }

    // result.error can be: 'user_cancel', 'system_cancel', 'lockout', 'not_enrolled', 'authentication_failed', etc.
    if (result.error === 'lockout') {
      Toast.show({
        type: 'error',
        text1: 'Biometrics locked',
        text2: 'Too many attempts. Try again later or use your passcode.',
      });
      return;
    }

    if (result.error === 'user_cancel' || result.error === 'system_cancel') {
      // user backed out — don't count this as a failed attempt
      return;
    }

    setAttempts((prev) => prev + 1);
    Toast.show({
      type: 'error',
      text1: 'Authentication failed',
      text2: `Attempt ${attempts + 1} of ${MAX_ATTEMPTS}`,
    });
  };

  const handleSubmit = () => {
    if (pin === DEMO_PIN && password === DEMO_PASSWORD) {
      Toast.show({ type: 'success', text1: 'Welcome back!' });
      router.replace('/(tabs)');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Incorrect PIN or password',
        text2: 'Please check your details and try again.',
      });
    }
  };

  return (
    <View style={styles.container}>

      {/* Logo — top left corner */}
      <View style={styles.logoWrap}>
        <Image
          source={require('../../assets/stimaLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Hero text */}
      <View style={styles.heroSection}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Member PIN</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your PIN"
            placeholderTextColor="#bbb"
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            value={pin}
            onChangeText={setPin}
          />
          <LinearGradient
            colors={['forestgreen', 'limegreen', 'yellowgreen', 'yellow']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.inputUnderline}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <LinearGradient
            colors={['forestgreen', 'limegreen', 'yellowgreen', 'yellow']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.inputUnderline}
          />
        </View>

        <TouchableOpacity style={styles.forgotWrap} activeOpacity={0.7}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

      </View>

      {/* Buttons */}
      <View style={styles.buttonStack}>

        {/* Fingerprint / Face ID button — only rendered if hardware exists */}
        {hasHardware && (
          <TouchableOpacity activeOpacity={0.85} style={styles.fingerprintOuter} onPress={handleBiometricAuth}>
            <LinearGradient
              colors={['forestgreen', 'limegreen', 'yellowgreen', 'yellow']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fingerprintGradientBorder}
            >
              <View style={styles.fingerprintInner}>
                <Ionicons name={biometricIcon} size={28} color="forestgreen" />
                <Text style={styles.fingerprintText}>
                  {biometricIcon === 'scan-outline' ? 'Use Face ID' : 'Use fingerprint'}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Let me in — gradient fill */}
        <TouchableOpacity activeOpacity={0.85} onPress={handleSubmit}>
          <LinearGradient
            colors={['forestgreen', 'limegreen', 'yellowgreen', 'yellow']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.letMeInBtn}
          >
            <Text style={styles.letMeInText}>Let me in</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

      </View>

      <Toast />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
  },
  logoWrap: {
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'flex-start',
  },
  logo: {
    width: 72,
    height: 72,
  },
  heroSection: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '400',
  },
  form: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    gap: 28,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  inputUnderline: {
    height: 2,
    borderRadius: 2,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -10,
  },
  forgotText: {
    fontSize: 13,
    color: 'forestgreen',
    fontWeight: '500',
  },
  buttonStack: {
    paddingHorizontal: 28,
    paddingBottom: 58, //STYLING THE BUTTON CONTAINER TO BE CLEAR OF THE ANDROID NAV BAR    
    gap: 14,
  },
  fingerprintOuter: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  fingerprintGradientBorder: {
    padding: 2,
    borderRadius: 14,
  },
  fingerprintInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    gap: 10,
  },
  fingerprintText: {
    color: 'forestgreen',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.4,
  },
  letMeInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  letMeInText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
