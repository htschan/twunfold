
# Ionic

`ionic build --prod`

`ionic serve`

# Firebase hosting setup as PWA

Install Firebase tools

`npm install -g firebase-tools`

`firebase login`

[PWA Hosting setup in Firebase](https://ionicframework.com/docs/angular/pwa)

[Adding Firebase to an Angular project using AngularFire](https://medium.com/@AnkitMaheshwariIn/adding-firebase-to-an-angular-project-using-angularfire-528af76f802f)

[Adding Firebase Authentication to PWA with Ionic 4, Angular and AngularFire](https://medium.com/@AnkitMaheshwariIn/adding-firebase-authentication-to-pwa-with-ionic-4-angular-and-angularfire-e7cb1caf953)

[Writing functions in Typescript](https://firebase.google.com/docs/functions/typescript)

[Environment configuration](https://firebase.google.com/docs/functions/config-env)

# Config settings Cloud Functions

Sample setting:

`firebase functions:config:set tw2.prod.ro_token="Bearer 3a762b06-ae42-7a0b-bf42-9da195af4ac9"`

View current settings:

`firebase functions:config:get`

# Debug locally

`cd function`

`sudo npm install`

`npm run build`

`firebase serve --only function`

[Build and Debug Firebase Functions in VSCode](https://medium.com/@david_mccoy/build-and-debug-firebase-functions-in-vscode-73efb76166cf)

# Deploy the webapp

`ionic build --prod`

`firebase deploy --only hosting:twunfold`

`firebase deploy --only functions`

# Transferwise

[API Docs](https://api-docs.transferwise.com/)

# ngx-cacheable

[ngx-cacheable](https://github.com/angelnikolov/ngx-cacheable)


# Resources

[Cloud Functions for Firebase samples](https://github.com/firebase/functions-samples)
[Using Typescript with Cloud Functions](https://github.com/firebase/functions-samples/tree/master/typescript-getting-started)
