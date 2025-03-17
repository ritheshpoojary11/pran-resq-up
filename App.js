import { useFonts } from 'expo-font';
import { ActivityIndicator } from 'react-native';
import AppNavigator from './AppNavigator';

const App = () => {
  const [fontsLoaded] = useFonts({
    CustomFont: require('./assets/fonts/Roboto-Medium.ttf'), // Adjust the path
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return <AppNavigator />;
};

export default App;
