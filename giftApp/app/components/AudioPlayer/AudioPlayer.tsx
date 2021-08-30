import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  VirtualizedList,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider, { SliderRef } from '@react-native-community/slider';
import fetchAudio from '../../lib/fetchAudio';

const { width, height } = Dimensions.get('window');

export default function AudioPlayer() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const songsSlider = useRef(null);

  const [songIndex, setSongIndex] = useState(0);
  const [songs, setSongs] = useState<any>();

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      console.log(scrollX);
      const index = Math.round(value / width);
      setSongIndex(index);
    });
    // console.log('songs: ' + songs[0].itunes.image);
    // console.log('songs: ' + songs[0].title);

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    fetchAudio(setSongs);
  });

  const skipToNext = () => {
    songsSlider.current.scrollTopOffset({
      offset: (songIndex + 1) * width,
    });
  };

  const skipToPrev = () => {
    songsSlider.current.scrollTopOffset({
      offset: (songIndex - 1) * width,
    });
  };

  const renderSongs = ({ index, item }) => {
    // console.log('item:  ' + item);
    return (
      <Animated.View style={{ width: width, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.artWorkWrapper}>
          <Image source={{ uri: item.itunes.image }} style={styles.artWorkImg} />
        </View>
      </Animated.View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={{ width: width }}>
          <Animated.FlatList
            data={songs}
            renderItem={renderSongs}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffest: { x: scrollX },
                  },
                },
              ],
              { useNativeDriver: true },
            )}
          />
        </View>

        {songs ? (
          <View>
            <Text style={styles.title}>{songs[songIndex].title}</Text>
            <Text style={styles.artist}>{songs[songIndex].creator}</Text>
          </View>
        ) : null}

        <View>
          <Slider
            ref={songsSlider}
            style={styles.progressContainer}
            value={10}
            minimumValue={0}
            maximumValue={100}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#FFF"
            onSlidingComplete={() => {}}
          />
          <View style={styles.progressLabelContainer}>
            <Text style={styles.progressLabelTxt}>0.5</Text>
            <Text style={styles.progressLabelTxt}>3.55</Text>
          </View>
        </View>

        <View style={styles.musicControlls}>
          <TouchableOpacity onPress={skipToPrev}>
            <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" style={{ marginTop: 25 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="ios-pause-circle" size={75} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>
            <Ionicons name="play-skip-forward-outline" size={35} color="#FFD369" style={{ marginTop: 25 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={30} color="#777777" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="repeat" size={30} color="#777777" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="repeat" size={30} color="#777777" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="repeat" size={30} color="#777777" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222832',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    borderTopColor: '#393E46',
    borderTopWidth: 1,
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  artWorkWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,

    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,

    elevation: 5,
  },
  artWorkImg: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#EEEEEE',
  },
  artist: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
    color: '#EEEEEE',
  },
  progressContainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  progressLabelContainer: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelTxt: {
    color: '#fff',
  },
  musicControlls: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});
