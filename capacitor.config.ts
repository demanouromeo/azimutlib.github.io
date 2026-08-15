import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cm.univ.azimut',
  appName: 'Azimut',
  webDir: 'dist/frontend/browser',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#6c5fd3',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
