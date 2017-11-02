# webph.one
__SayCel Webph.one - An App for Community Cell Networks__
<p style="text-align:center"><img src="https://media.giphy.com/media/l1LbYlLPdBc8ZxKBa/giphy.gif"/></p>

___

## What is this?
In this repository you will find the source code of the progressive web app (PWA) part of the Webph.one system.
The PWA can communicate with the Community Cell Network server, request a virtual phone number, store contacts, perform and receive calls and notifications. Also if you access from an Android device you can install it as if it were a native application.

## It's not..

This app is the frontend of a more complex system, with it alone you can not mount a virutal telephone system. It acts as a client for the user and connects with notifications and WebRTC communication services via JsSip.

## Parts that make up the app
This development is done on Angualar (version 4 at the moment). Use:
* Angular Material for interface components
* angular-serviceworker + rollup for notifications and cache (will change in version 5 of Angular)
* jsSip for the connection with the Kamailio servers
* webpush-api developed to manage notifications between Kamailio and the PWA
* pouchDb for local data storage (contact, settings, user data)

## Development environment
The recommended development environment is:
* Node 7.5.0 (I recommend installation with [nvm](https://github.com/creationix/nvm))
* Fork, clone and install of this repository
* Run `npm install` after each fetch or pull in which the package.json file changes

The service worker build is currently not integrated with angular-cli (something that in version 5 of Angular may change). The process is carried out after the Angular build to determine the hash of each file (cache management). This makes it impossible to generate a service worker when `ng serve` is run, so to test the changes in service worker it is necessary to follow the following steps:
1) Make a production build of the app (`npm run build-prod`)
2) Login to ./build and raise a static data server ([http-server](https://www.npmjs.com/package/http-server) for example)
3) Open the web in the browser, and in the __Development panel> Aplication> Service Worker__ select the option __Update on reload__
4) In another terminal run `npm run build-sw` every time you want to publish a service worker change
5) Refresh the web to install the new service worker.

### Variables and configurations
There are two places that centralize the possible configurations of the app: __src/app/jssip.config.ts__ and the files inside the folder __src/environments__

#### jssip.config.ts
Most of them respond to the standard configuration of jsSip (you can see the information on your website), the "custom" elements are this:
```javascript
{
    ...
    custom:
        {
            
            // If another address is used as a gateway for calls. If you do not use leave in null
            dtmfsGateway: '385485876@did.callwithus.com',

            // If you use an outbound key for area codes. If you do not use it, leave it in null.
            outbound: null,

            // Domain to add to calls that have none.
            defaultUtiDomain: 'rhizortc.specialstories.org',

            // Array of special prefix codes to identify when the call is to a virutal number.
            virtualNumbersPrefixs: [999100, 999200],

            // Virtual number prefix to request when a user is created
            virtualNumberPrefix: 999111,

            // Array of prefixes for conference calls.
            conferenceCallPrefixs: [500],

            // Fake domain for the automatic request of new numbers.
            fakeEmail: '@ generic_email.saycel'
        }
}
```

#### Environment Variables
The environment variables are managed by Angular when making the build or raising a development server. In the case of the build to production Angular takes as valid the options entered in `src / environments / environment.prod.ts`.
Actually there are two fields to use:
* endpoint -> The url of the webpush-server service
* kamailioNewNumber -> The url of the service that assigns new numbers.

## Travis
The continuous integration system Travis is configured so that in the face of changes in the branch __develop__ and __rhizomatica__, perform a build. If the build is successful, it deploys the app to the corresponding server. Before the build, a version file is generated that exposes the hash of the commit from which it is being performed. This is used to identify the build for the purpose of bug reporting.

## Docker
This repository also includes a Dockerfile file to generate images and containers.
The docker consists of two parts, one used for buildinding the app (which is based on node 7.5.0) and the other one to run the app (nginx). To generate the image, after making the modifications to the necessary variables, you just have to execute:
```
docker build -t webphone-app:dev .
```
Then with the following command you can run the server:
```
docker run -p 8080:80 -it webphone-app:dev
```