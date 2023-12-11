import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

// Android
// ca-app-pub-3599250716372898~1981768371
// ca-app-pub-3599250716372898/7178254735

// IOS
// ca-app-pub-3599250716372898~8857461048
// ca-app-pub-3599250716372898/4276924493

const unitID =
  Platform.select({
    ios: 'ca-app-pub-3599250716372898~8857461048',
    // android: 'ca-app-pub-3599250716372898~4841591771',
    android: 'ca-app-pub-3599250716372898/7376255779',
  }) || '';

const adUnitId = __DEV__ ? TestIds.BANNER : unitID;

const Admob = () => {
  return (
    <View style={styles.admob}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  admob: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
});
export default Admob;
