import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.matchra.bite',
  appName: 'Bite',
  webDir: 'dist',
  server: {
    url: 'https://bite-app.lovable.app',
    cleartext: true
  }
};

export default config;
