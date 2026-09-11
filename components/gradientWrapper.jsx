import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export default function GradientBackground({ children }) {
  return (
    <LinearGradient
      colors={['#1a4e8f', '#2563eb', '#3b82f6', '#60a5fa']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
