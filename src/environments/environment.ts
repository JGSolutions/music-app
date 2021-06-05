// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyD0OzFxTrhzriKMPbN7AJ_JGn07955KXso",
    authDomain: "music-app-5c927.firebaseapp.com",
    projectId: "music-app-5c927",
    storageBucket: "music-app-5c927.appspot.com",
    messagingSenderId: "162824700717",
    appId: "1:162824700717:web:a292ea718ac3ea360f49a4",
    measurementId: "G-X6XXR0TLE3"
  },
  mixcloud: {
    clientId: 'Fw4U6rr5W5f58r8HXz',
    secretApi: 'k6RypyEF3TUFUqQtbrcjBD3W7r4vJkgD'
  },
  spotify: {
    clientId: '9e85a20c69144326899c6fdae66167e7',
    secretApi: 'd412e35440c64c1b804123c3e295f5f8'
  },
  // restapiDomain: "https://music-restapi.web.app/api",
  restapiDomain: "http://localhost:5000/api"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
