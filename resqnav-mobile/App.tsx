import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/* 
 * 🚨 IMPORTANT: For local development using Expo Go on a physical device,
 * replace `localhost` with your computer's local IP address (e.g. 192.168.1.5).
 * e.g -> const APP_URL = 'http://192.168.1.5:3000';
 * 
 * If running on iOS Simulator locally, localhost works fine.
 * If running on Android Emulator locally, use 10.0.2.2.
 */
const APP_URL = 'http://192.168.137.75:3000'; // Updated to local IP for Expo Go physical device support

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <View style={styles.webviewWrapper}>
          <WebView 
            source={{ uri: APP_URL }} 
            style={styles.webview}
            scalesPageToFit={true}
            bounces={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsInlineMediaPlayback={true}
            onMessage={(event) => {
              console.log('[WebView Log]', event.nativeEvent.data);
            }}
            injectedJavaScript={`
              (function() {
                var oldLog = console.log;
                console.log = function (message) {
                  window.ReactNativeWebView.postMessage(message);
                  oldLog.apply(console, arguments);
                };
              })();
              true;
            `}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Matches the Next.js sidebar/topbar background
  },
  webviewWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
