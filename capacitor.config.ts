import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.euphorys.riichitrainer',
  appName: 'riichi-trainer',
  webDir: 'build',
  ios: {
    contentInset: 'always',
  },
};

export default config;
