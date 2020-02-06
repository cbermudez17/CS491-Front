# CS491-Front
Following this guide will help you set up the repository for development.

## Requirements
The following requirements need to be installed on your development machine.
1. Node JS v10+
1. Git
1. Expo CLI
1. React Native Paper

## Cloning the Repository
To clone the repository, run the following commands on your development machine.

```bash
cd {project_directory}
git clone https://github.com/cbermudez17/CS491-Front.git
npm i react-native-paper # This will install the Material Design Framework
npm install # This will set up expo build tools
```

## Starting the Development Server
To start your development server, you must be inside your project's root directory. The directory must include all expo files/directories, such as *.expo-shared* and *.expo*.

```bash
cd {project_root_directory}
npm start
```

After starting your development server, your machine will locally host the application. You should see a new window open up in the browser, as well as a QR code in the terminal window.

## Testing on Physical Devices

### Andriod
To test on an Andriod device, the running OS must be compatible with the Expo Client App. After downloading the Expo application, use the `Scan QR Code` feature to scan the QR code and start the app.

### IOS
To test on an IOS device, the running OS must be compatible with the Expo Client App. After downloading the Expo application, use the native Camera App to scan the QR code and start the app.
