import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const FEATURES = [
  { icon: '🎨', title: 'Beautiful Design', desc: 'Modern & clean user interface', color: '#FF6B6B' },
  { icon: '⚡', title: 'Fast Performance', desc: 'Optimized for speed', color: '#4ECDC4' },
  { icon: '📱', title: 'Responsive', desc: 'Works on all screen sizes', color: '#45B7D1' },
  { icon: '🔒', title: 'Secure', desc: 'Your data is protected', color: '#96CEB4' },
  { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes', color: '#FECA57' },
  { icon: '🚀', title: 'Modern Tech', desc: 'Built with latest tools', color: '#A29BFE' },
];

const STATS = [
  { label: 'Users', value: '10K+', icon: '👥' },
  { label: 'Downloads', value: '50K+', icon: '📥' },
  { label: 'Rating', value: '4.9★', icon: '⭐' },
  { label: 'Countries', value: '150+', icon: '🌍' },
];

export default function TabTwoScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleFeaturePress = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.content}>
        <Animated.View 
          style={[
            styles.heroSection,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <ThemedText style={styles.heroEmoji}>🚀</ThemedText>
          <ThemedText type="title" style={styles.heroTitle}>
            Explore Features
          </ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Discover what makes this app amazing
          </ThemedText>
        </Animated.View>

        <ThemedView style={styles.statsGrid}>
          {STATS.map((stat, index) => (
            <Animated.View
              key={index}
              style={[
                styles.statCard,
                {
                  opacity: fadeAnim,
                  transform: [{
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  }],
                },
              ]}
            >
              <ThemedText style={styles.statIcon}>{stat.icon}</ThemedText>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </Animated.View>
          ))}
        </ThemedView>

        <ThemedView style={styles.featuresSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            ✨ Key Features
          </ThemedText>
          {FEATURES.map((feature, index) => (
            <Animated.View
              key={index}
              style={[
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateX: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  }],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleFeaturePress(index)}
                activeOpacity={0.7}
              >
                <ThemedView style={[
                  styles.featureCard,
                  { borderLeftColor: feature.color }
                ]}>
                  <ThemedView style={styles.featureHeader}>
                    <ThemedText style={styles.featureIcon}>{feature.icon}</ThemedText>
                    <ThemedView style={styles.featureInfo}>
                      <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
                      <ThemedText style={styles.featureDesc}>{feature.desc}</ThemedText>
                    </ThemedView>
                    <ThemedText style={styles.expandIcon}>
                      {expandedFeature === index ? '▼' : '▶'}
                    </ThemedText>
                  </ThemedView>
                  {expandedFeature === index && (
                    <ThemedView style={styles.expandedContent}>
                      <ThemedText style={styles.expandedText}>
                        This feature provides an exceptional user experience with cutting-edge technology
                        and thoughtful design principles.
                      </ThemedText>
                    </ThemedView>
                  )}
                </ThemedView>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ThemedView>

        <ThemedView style={styles.testimonialSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            💬 What Users Say
          </ThemedText>
          <ThemedView style={styles.testimonialCard}>
            <ThemedText style={styles.testimonialText}>
              "This is the best app I've ever used! The design is beautiful and it's so easy to navigate."
            </ThemedText>
            <ThemedText style={styles.testimonialAuthor}>- Sarah K.</ThemedText>
          </ThemedView>
          <ThemedView style={styles.testimonialCard}>
            <ThemedText style={styles.testimonialText}>
              "Fast, reliable, and gorgeous. Everything I needed in one place!"
            </ThemedText>
            <ThemedText style={styles.testimonialAuthor}>- Mike D.</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Made with 💜 by awesome developers
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(100, 100, 255, 0.1)',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    opacity: 0.7,
  },
  expandIcon: {
    fontSize: 12,
    opacity: 0.5,
    marginLeft: 8,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  expandedText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  testimonialSection: {
    marginBottom: 32,
  },
  testimonialCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(100, 200, 255, 0.1)',
    marginBottom: 12,
  },
  testimonialText: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 12,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
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
