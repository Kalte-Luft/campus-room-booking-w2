import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppNavigator } from "./navigation/AppNavigator";
import { SessionProvider, useSession } from "./hooks/useSession";
import { StateView, u } from "./components/Ui";
import { C } from "./theme";
export function Bootstrap() {
  const session = useSession();
  if (!session.configured)
    return (
      <SafeAreaView style={u.page}>
        <StateView
          icon="construct-outline"
          title="Cấu hình Firebase trước nhé"
          detail="Sao chép .env.example thành .env, điền cấu hình Firebase rồi chạy lại Expo. README có hướng dẫn từng bước."
        />
      </SafeAreaView>
    );
  if (session.error)
    return (
      <SafeAreaView style={u.page}>
        <StateView
          icon="cloud-offline-outline"
          title="Chưa thể kết nối"
          detail={session.error}
          action="Thử lại"
          onAction={session.retry}
        />
      </SafeAreaView>
    );
  if (!session.uid)
    return (
      <View style={[u.page, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={C.blue} />
      </View>
    );
  return (
    <SessionProvider uid={session.uid}>
      <AppNavigator />
    </SessionProvider>
  );
}
