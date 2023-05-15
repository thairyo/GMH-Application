import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { BackButton, HeaderPage } from "../../../components/form";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { DismissKeyboardView, Input } from "../../../components/common";

const Addresses = ({ navigation }) => {
  const address = "Sơn Trà 2832, Đà Nẵng";
  const [newAddress, setNewAddress] = useState({
    address: address.address,
  });

  return (
    <DismissKeyboardView style={styles.container}>
      <HeaderPage>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={{ alignItems: "center", marginTop: 45 }}>
          <Text style={{ fontSize: 18, fontFamily: "inter_medium" }}>
            Thay đổi địa chỉ
          </Text>
        </View>
      </HeaderPage>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.inputContainer}>
          <Input
            label="Địa chỉ"
            value={newAddress.address}
            onChangeText={(text) =>
              setNewAddress((prev) => ({ ...prev, address: text }))
            }
            placeholder="Nhập thông tin..."
            autoComplete="street-address"
            autoCorrect={false}
          />
        </View>

        <View style={styles.addressPinPoint}>
          <View style={styles.addressPinPointLeft}>
            <MaterialIcons name="location-on" size={24} color="#000" />
            <Text style={styles.addressPinPointLeftText}>Bật định vị</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#000" />
        </View>

        <View style={styles.separatorBar}></View>

        <TouchableOpacity>
          <View style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  addressPinPoint: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 4,
    backgroundColor: "#fce42d",
    marginBottom: 20,
  },
  addressPinPointLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressPinPointLeftText: {
    fontSize: 12,
    fontFamily: "inter_medium",
    color: "#000",
    marginLeft: 10,
  },
  separatorBar: {
    width: "100%",
    height: 1,
    backgroundColor: "#000",
    marginTop: 6,
    marginBottom: 20,
  },
  saveBtn: {
    width: "100%",
    padding: 16,
    borderRadius: 4,
    backgroundColor: "#ec1e1e",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#000",
    borderWidth: 1,
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: "inter_medium",
    color: "#000",
  },
});

export default Addresses;
