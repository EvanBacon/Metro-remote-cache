import { StatusBar } from "expo-status-bar";
import { StyleSheet, Image, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/icon.png')} />
      <Text>to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
