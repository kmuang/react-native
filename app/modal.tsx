import { ResizeMode, Video } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Image, Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Sample gallery with images and videos
const GALLERY_IMAGES = [
  { id: '1', uri: 'https://picsum.photos/400/300?random=1', category: 'Nature', type: 'image' },
  { id: '2', uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', category: 'Video', type: 'video', thumbnail: 'https://picsum.photos/400/300?random=20' },
  { id: '3', uri: 'https://picsum.photos/400/300?random=3', category: 'Nature', type: 'image' },
  { id: '4', uri: 'https://picsum.photos/400/300?random=4', category: 'People', type: 'image' },
  { id: '5', uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', category: 'Video', type: 'video', thumbnail: 'https://picsum.photos/400/300?random=21' },
  { id: '6', uri: 'https://picsum.photos/400/300?random=6', category: 'Nature', type: 'image' },
  { id: '7', uri: 'https://picsum.photos/400/300?random=7', category: 'Food', type: 'image' },
  { id: '8', uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', category: 'Video', type: 'video', thumbnail: 'https://picsum.photos/400/300?random=22' },
  { id: '9', uri: 'https://picsum.photos/400/300?random=9', category: 'City', type: 'image' },
  { id: '10', uri: 'https://picsum.photos/400/300?random=10', category: 'Food', type: 'image' },
  { id: '11', uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', category: 'Video', type: 'video', thumbnail: 'https://picsum.photos/400/300?random=23' },
  { id: '12', uri: 'https://picsum.photos/400/300?random=12', category: 'City', type: 'image' },
];

export default function ModalScreen() {
  const [selectedItem, setSelectedItem] = useState<typeof GALLERY_IMAGES[0] | null>(null);
  const [numColumns, setNumColumns] = useState(getNumColumns());
  const [filter, setFilter] = useState<string>('All');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculate number of columns based on screen width
  function getNumColumns() {
    const width = Dimensions.get('window').width;
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    if (width >= 480) return 2;
    return 2;
  }

  // Update columns on dimension change
  Dimensions.addEventListener('change', () => {
    setNumColumns(getNumColumns());
  });

  const categories = ['All', ...Array.from(new Set(GALLERY_IMAGES.map(img => img.category)))];
  const filteredImages = filter === 'All' 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === filter);

  const renderItem = ({ item, index }: { item: typeof GALLERY_IMAGES[0], index: number }) => {
    const screenWidth = Dimensions.get('window').width;
    const spacing = 16;
    const totalSpacing = spacing * (numColumns + 1);
    const itemSize = (screenWidth - totalSpacing) / numColumns;
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(animatedValue, {
        toValue: 1,
        delay: index * 50,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }, [filter]);

    return (
      <Animated.View
        style={{
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={[styles.imageContainer, { width: itemSize, height: itemSize }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedItem(item);
          }}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: item.type === 'video' ? item.thumbnail : item.uri }}
            style={styles.image}
            resizeMode="cover"
          />
          {item.type === 'video' && (
            <ThemedView style={styles.playIconContainer}>
              <ThemedText style={styles.playIcon}>▶️</ThemedText>
            </ThemedView>
          )}
          <ThemedView style={styles.categoryBadge}>
            <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title" style={styles.title}>✨ Media Gallery</ThemedText>
          <Link href="/" dismissTo style={styles.link}>
            <ThemedText type="link" style={styles.closeText}>✕</ThemedText>
          </Link>
        </ThemedView>
      </Animated.View>

      <Animated.ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={[styles.filterContainer, { opacity: fadeAnim }]}
        contentContainerStyle={styles.filterContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              filter === cat && styles.filterButtonActive,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFilter(cat);
            }}
          >
            <ThemedText style={[
              styles.filterText,
              filter === cat && styles.filterTextActive,
            ]}>
              {cat}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>

      <FlatList
        data={filteredImages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.gallery}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />

      {/* Full screen image/video modal */}
      <Modal
        visible={selectedItem !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setSelectedItem(null);
          if (videoRef.current) {
            videoRef.current.pauseAsync();
          }
        }}
      >
        <Pressable 
          style={styles.modalContainer}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedItem(null);
            if (videoRef.current) {
              videoRef.current.pauseAsync();
            }
          }}
        >
          <ThemedView style={styles.modalContent}>
            {selectedItem && selectedItem.type === 'image' && (
              <Image
                source={{ uri: selectedItem.uri }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
            {selectedItem && selectedItem.type === 'video' && (
              <Video
                ref={videoRef}
                source={{ uri: selectedItem.uri }}
                style={styles.fullVideo}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay
              />
            )}
            <Pressable 
              style={styles.closeButton} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setSelectedItem(null);
                if (videoRef.current) {
                  videoRef.current.pauseAsync();
                }
              }}
            >
              <ThemedText style={styles.closeButtonText}>✕</ThemedText>
            </Pressable>
            <ThemedView style={styles.imageCounter}>
              <ThemedText style={styles.counterText}>
                {selectedItem && filteredImages.findIndex(img => img.id === selectedItem.id) + 1} / {filteredImages.length}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  link: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeText: {
    fontSize: 28,
    fontWeight: '300',
  },
  filterContainer: {
    maxHeight: 60,
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  filterTextActive: {
    color: '#FFFFFF',
    opacity: 1,
  },
  gallery: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  fullVideo: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
