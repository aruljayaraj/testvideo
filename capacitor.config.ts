import { CapacitorConfig } from '@capacitor/cli';

/*const config: CapacitorConfig = {
  appId: 'com.localfirstapp.com',
  appName: 'localfirstapp',
  webDir: 'build',
  bundledWebRuntime: true
};*/

const config: CapacitorConfig = { 
  appId: 'com.localfirstapp.com', 
  appName: 'localfirstapp',  
  bundledWebRuntime: false,   
  webDir: "build",
  server: {
    cleartext: true
  }
};

export default config;
