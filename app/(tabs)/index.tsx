import * as Haptics from 'expo-haptics';
import { Link, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const FEATURE_CARDS = [
  { id: 1, title: '📸 Photo Gallery', desc: 'Beautiful responsive gallery', route: '/modal', color: '#FF6B6B', icon: '🎨' },
  { id: 2, title: '🎬 Video Gallery', desc: 'Watch amazing videos', route: '/modal', color: '#4ECDC4', icon: '🎥' },
  { id: 3, title: '🎯 Interactive', desc: 'Smooth animations & gestures', color: '#45B7D1', icon: '✨' },
  { id: 4, title: '🌈 Modern Design', desc: 'Clean & beautiful UI', color: '#96CEB4', icon: '💎' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [pressedCard, setPressedCard] = useState<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef(FEATURE_CARDS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCardPress = (index: number, route?: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    if (route) {
      setTimeout(() => router.push(route as any), 200);
    }
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.container}>
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim }]}>
          <ThemedText style={styles.heroEmoji}>🎉</ThemedText>
          <ThemedText type="title" style={styles.heroTitle}>
            Welcome to CoolApp
          </ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Experience the magic of modern mobile design
          </ThemedText>
        </Animated.View>

        <ThemedView style={styles.cardsContainer}>
          {FEATURE_CARDS.map((card, index) => (
            <Animated.View
              key={card.id}
              style={[
                styles.cardWrapper,
                { transform: [{ scale: scaleAnims[index] }] }
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleCardPress(index, card.route)}
                onPressIn={() => setPressedCard(card.id)}
                onPressOut={() => setPressedCard(null)}
              >
                <ThemedView style={[
                  styles.card,
                  { 
                    borderLeftColor: card.color,
                    borderLeftWidth: 4,
                  }
                ]}>
                  <ThemedView style={styles.cardHeader}>
                    <ThemedText style={styles.cardIcon}>{card.icon}</ThemedText>
                    <ThemedText type="subtitle" style={styles.cardTitle}>
                      {card.title}
                    </ThemedText>
                  </ThemedView>
                  <ThemedText style={styles.cardDesc}>{card.desc}</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ThemedView>

        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statBox}>
            <ThemedText style={styles.statNumber}>99+</ThemedText>
            <ThemedText style={styles.statLabel}>Features</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statBox}>
            <ThemedText style={styles.statNumber}>⚡</ThemedText>
            <ThemedText style={styles.statLabel}>Fast</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statBox}>
            <ThemedText style={styles.statNumber}>💯</ThemedText>
            <ThemedText style={styles.statLabel}>Quality</ThemedText>
          </ThemedView>
        </ThemedView>

        <Link href="/modal" asChild>
          <TouchableOpacity style={styles.ctaButton}>
            <ThemedText style={styles.ctaText}>🚀 Explore Gallery</ThemedText>
          </TouchableOpacity>
        </Link>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Built with ❤️ using React Native & Expo
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  cardWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 44,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 100, 255, 0.1)',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center',
  },
});
