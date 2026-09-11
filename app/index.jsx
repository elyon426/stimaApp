import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Keep the native splash screen visible until we explicitly hide it.
// This call should ideally live at your app's entry point (e.g. app/_layout.js),
// but calling it here too is harmless/idempotent.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function ProfessionalSplashScreen() {
  const router = useRouter();

  // Animation values — created once via useRef so they persist across renders
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const firstSplashOpacity = useRef(new Animated.Value(1)).current;
  const secondSplashOpacity = useRef(new Animated.Value(0)).current;
  const secondSplashScale = useRef(new Animated.Value(0.9)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Our custom JS splash is mounted and about to animate —
    // hide the native splash right now so there's no gap/flash.
    SplashScreen.hideAsync().catch(() => {});

    const timers = [];

    // ===== PHASE 1: Logo Elegant Entrance =====
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        damping: 12,
        stiffness: 90,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0.15,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // ===== PHASE 2: Title & Subtitle =====
    timers.push(setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400));

    // ===== PHASE 3: Logo Bulge (The Signature Move!) =====
    timers.push(setTimeout(() => {
      Animated.spring(logoScale, {
        toValue: 1.15,
        damping: 6,
        stiffness: 70,
        useNativeDriver: true,
      }).start();

      Animated.timing(glowOpacity, {
        toValue: 0.35,
        duration: 300,
        useNativeDriver: true,
      }).start();

      timers.push(setTimeout(() => {
        Animated.spring(logoScale, {
          toValue: 1,
          damping: 8,
          stiffness: 80,
          useNativeDriver: true,
        }).start();

        Animated.timing(glowOpacity, {
          toValue: 0.2,
          duration: 400,
          useNativeDriver: true,
        }).start();

        // ===== PHASE 4: Smooth Transition to Second Splash =====
        timers.push(setTimeout(() => {
          Animated.parallel([
            Animated.timing(firstSplashOpacity, {
              toValue: 0,
              duration: 600,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
              useNativeDriver: true,
            }),
            Animated.timing(secondSplashOpacity, {
              toValue: 1,
              duration: 600,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
              useNativeDriver: true,
            }),
            Animated.spring(secondSplashScale, {
              toValue: 1,
              damping: 10,
              stiffness: 70,
              useNativeDriver: true,
            }),
          ]).start();

          // ===== PHASE 5: Final Elegant Pulse =====
          timers.push(setTimeout(() => {
            Animated.spring(secondSplashScale, {
              toValue: 1.03,
              damping: 5,
              stiffness: 60,
              useNativeDriver: true,
            }).start(() => {
              Animated.spring(secondSplashScale, {
                toValue: 1,
                damping: 6,
                stiffness: 80,
                useNativeDriver: true,
              }).start();
            });
          }, 400));

          // ===== PHASE 6: Navigate =====
          timers.push(setTimeout(() => {
            router.replace('/(auth)/registerSignup');
          }, 1800));

        }, 800));
      }, 1000));
    }, 1800));

    // Cleanup: clear any pending timers if this component unmounts early
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* First Splash */}
      <Animated.View style={[styles.splashContainer, { opacity: firstSplashOpacity }]}>
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.logoGlow, { opacity: glowOpacity }]} />

          <Animated.View
            style={[
              styles.logoWrapper,
              { transform: [{ scale: logoScale }], opacity: logoOpacity },
            ]}
          >
            <Image source={require('../assets/stimaLogo.png')} style={styles.logo} />
          </Animated.View>
        </View>

        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          Stima Sacco Society App
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          Your Reliable Business Partner
        </Animated.Text>
      </Animated.View>

      {/* Second Splash */}
      <Animated.View
        style={[
          styles.splashContainer,
          styles.secondSplash,
          { opacity: secondSplashOpacity, transform: [{ scale: secondSplashScale }] },
        ]}
      >
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoGlow,
              styles.secondGlow,
              {
                opacity: glowOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.1, 0.25],
                }),
              },
            ]}
          />

          <View style={styles.logoWrapper}>
            <Image source={require('../assets/stimaLogo.png')} style={[styles.logo, styles.secondLogo]} />
          </View>
        </View>

        <Text style={[styles.title, styles.secondTitle]}>Welcome to Stima Sacco</Text>
        <Text style={[styles.subtitle, styles.secondSubtitle]}>Your trusted financial partner</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  secondSplash: {
    backgroundColor: '#f8faf8',
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  secondLogo: {
    tintColor: '#1a472a',
  },
  logoGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#2d6a2d',
  },
  secondGlow: {
    backgroundColor: '#1a472a',
  },
  title: {
    color: '#2d6a2d',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  secondTitle: {
    color: '#1a472a',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#2d6a2d',
    marginTop: 5,
  },
  secondSubtitle: {
    color: '#3d7a3d',
  },
});