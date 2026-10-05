import { useEffect } from "react";
import { AppState, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import { Bootstrap } from "./src/Bootstrap";
import { C } from "./src/theme";
const client = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 10_000, retry: 1 },
    mutations: { retry: 0 },
  },
});
export default function App() {
  useEffect(() => {
    const listener = AppState.addEventListener("change", (state) =>
      focusManager.setFocused(state === "active"),
    );
    return () => listener.remove();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={client}>
          <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
          <Bootstrap />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
