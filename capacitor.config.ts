import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.matchra.bite',
  appName: 'Bite',
  webDir: 'dist',
  server: {
    url: 'https://05ac9fb4-8719-4799-a219-b762091bb3f4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
