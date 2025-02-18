import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { BackButton, HeaderPage } from "../../../components/form";
import { VNDCurrencyFormatting, VNDFormattedDate } from "../../../utils";
import colors from "../../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { acceptOrder, doneOrder } from "../../../services/orders";
import GeocodeAddress from "../../../utils/geocodeAddress";
import ShortDistance from "../../../utils/shortDistance";
import FlattenObject from "../../../utils/flattenObject";
import { useState } from "react";
import { useEffect } from "react";

const DetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { order } = route.params;
  const { addresses } = route.params.order;
  const [totalDistanceAndTime, setTotalDistanceAndTime] = useState({});

  const name_address = FlattenObject(addresses);

  async function calculateTotalDistanceAndTime() {
    const speed = 40; // Vận tốc (km/h)
    const personALocation = await GeocodeAddress(addresses.user_address);
    const personBLocation = await GeocodeAddress(addresses.shipper_address);

    const supplierLocations = [];
    for (let i = 0; i < addresses.suppliers_address.length; i++) {
      const supplierLocation = await GeocodeAddress(
        addresses.suppliers_address[i]
      );
      supplierLocations.push(supplierLocation);
    }
    const sortedAddresses = [
      personALocation,
      ...supplierLocations,
      personBLocation,
    ];

    const distances = [];
    const times = [];

    for (let i = 0; i < sortedAddresses.length - 1; i++) {
      const distance = ShortDistance(
        sortedAddresses[i].lat,
        sortedAddresses[i].lng,
        sortedAddresses[i + 1].lat,
        sortedAddresses[i + 1].lng
      );
      distances.push(distance);

      const time = Math.round((distance / speed) * 60);
      times.push(time);
    }

    const totalDistance = distances.reduce((acc, curr) => acc + curr, 0);
    const totalTime = times.reduce((acc, curr) => acc + curr, 0);

    const result = {
      name_address: name_address,
      distances: distances,
      times: times,
      totalDistance: totalDistance,
      totalTime: totalTime,
    };

    setTotalDistanceAndTime(result);
  }

  useEffect(() => {
    calculateTotalDistanceAndTime();
  }, []);

  const handleAcceptOrder = async () => {
    const newOrder = {
      orderId: order._id,
    };
    await doneOrder(newOrder);
    Alert.alert(
      "Đặt hàng thành công!",
      "Đơn hàng của bạn đang được chuẩn bị, bạn có muốn kiếm tra lại?",
      [
        {
          text: "Xem đơn hàng",
          onPress: () => navigation.navigate("orders", { screen: "home" }),
        },
        { text: "Đóng" },
      ],
      { userInterfaceStyle: "light" }
    );
  };

  return (
    <View style={styles.container}>
      <HeaderPage>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={{ alignItems: "center", marginTop: 45 }}>
          <Text style={{ fontSize: 18, fontFamily: "inter_medium" }}>
            Đơn hàng
          </Text>
        </View>
      </HeaderPage>
      <ScrollView style={styles.order} showsVerticalScrollIndicator={false}>
        {/* Address */}
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Địa chỉ nơi cung cấp</Text>

          <View style={styles.addressSelected}>
            <View style={styles.addressSelectedData}>
              {order.products.map((product, index) => (
                <View key={index} style={{ paddingBottom: 4 }}>
                  <View style={styles.addressSelectedRight}>
                    <View style={styles.addressSelectedTag}>
                      <Text style={styles.addressSelectedTagText}>
                        Địa chỉ {index + 1}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.addressSelectedStreet}>
                    {product.addressItem.name_address}
                  </Text>
                  <View style={styles.productSelectedTag}>
                    <Text style={styles.productSelectedTagText}>
                      Sản phẩm cần mua
                    </Text>
                  </View>
                  {product.addressItem.goods.map((item, index) => (
                    <Text style={styles.productSelectedStreet} key={index}>
                      {item.item.name} x {item.qty}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Các chặng đường đi:</Text>
          {Object.keys(totalDistanceAndTime).length > 0 && (
            <View style={styles.addressSelected}>
              <View style={styles.addressSelectedData}>
                {totalDistanceAndTime.name_address.map((address, index) => {
                  if (index !== totalDistanceAndTime.name_address.length - 1) {
                    return (
                      <View key={index} style={{ paddingBottom: 4 }}>
                        <View style={styles.addressSelectedTag}>
                          <Text style={styles.addressSelectedTagText}>
                            {address} đến{" "}
                            {totalDistanceAndTime.name_address[index + 1]}
                          </Text>
                        </View>
                        <Text style={styles.addressSelectedStreet}>
                          trong{" "}
                          {totalDistanceAndTime.distances[index].toFixed(2)} km
                          x {totalDistanceAndTime.times[index]} phút
                        </Text>
                      </View>
                    );
                  }
                  return null;
                })}
                <View style={styles.productSelectedTag}>
                  <Text style={styles.productSelectedTagText}>
                    Tổng {totalDistanceAndTime.totalDistance.toFixed(2)} km x{" "}
                    {totalDistanceAndTime.totalTime} phút
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View>
          <View>
            <View style={styles.paymentContainer}>
              <View style={styles.paymentOption}>
                <MaterialCommunityIcons
                  name="credit-card-outline"
                  size={24}
                  color={colors.GREEN_LOGO_TWO}
                />
                <Text style={styles.paymentOptionText}>Tiền:</Text>
              </View>
              <View style={styles.paymentRight}>
                <Text style={styles.paymentRightText}>Tổng tiền</Text>
                <Text style={styles.paymentRightFee}>
                  {VNDCurrencyFormatting(order.total)} + Ship:{" "}
                  {VNDCurrencyFormatting(30000)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.separatorBar}></View>

        {/* Order Data & Details */}
        <View style={styles.orderData}>
          <Text style={styles.orderDataTitle}>Chi tiết đơn hàng</Text>
          <View style={styles.orderDataItem}></View>
          <View style={styles.orderDataItem}>
            <Text style={styles.orderDataItemText}>Thời gian đặt hàng</Text>
            <Text style={styles.orderDataItemText}>
              {VNDFormattedDate(order.updatedAt)}
            </Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View>
            <Text style={styles.orderDataTitle}>Các sản phẩm</Text>
            {order.items.map((item) => (
              <View key={item.item.name} style={styles.orderDataItem}>
                <Text style={styles.orderDataItemText}>{item.item.name}</Text>
                <Text style={styles.orderDataItemText}>x {item.qty}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleAcceptOrder}>
            <View style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Giao thành công</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  order: {},
  addressContainer: {
    marginBottom: 20,
  },
  addressTitle: {
    fontSize: 14,
    fontFamily: "inter_semi_bold",
    textTransform: "uppercase",
    color: "#000",
    marginBottom: 12,
  },
  addressSelected: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressSelectedData: {},
  addressSelectedTitle: {
    fontSize: 16,
    fontFamily: "inter_medium",
    color: "#000",
    marginBottom: 4,
  },
  addressSelectedStreet: {
    fontSize: 12,
    fontFamily: "inter_medium",
    color: "#000",
    maxWidth: 320,
  },
  addressSelectedRight: {},
  addressSelectedTag: {
    marginRight: 4,
    backgroundColor: colors.GREEN_LOGO_TWO,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addressSelectedTagText: {
    fontSize: 13,
    fontFamily: "inter_semi_bold",
    color: "#fff",
  },
  productSelectedTag: {
    marginRight: 4,
    backgroundColor: colors.GREEN_TEXT_TWO,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    maxWidth: 200,
  },
  productSelectedTagText: {
    fontSize: 12,
    fontFamily: "inter_semi_bold",
    color: "#fff",
  },
  productSelectedStreet: {
    fontSize: 12,
    fontFamily: "inter_medium",
    color: "#000",
    maxWidth: 200,
  },
  paymentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentOptionText: {
    fontSize: 14,
    fontFamily: "inter_semi_bold",
    color: "#000",
    marginLeft: 8,
  },
  paymentRight: {
    fontSize: 14,
    fontFamily: "inter_medium",
    color: "#000",
    marginRight: 4,
  },
  paymentRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentRightText: {
    fontSize: 14,
    fontFamily: "inter_medium",
    color: "#000",
    marginRight: 4,
  },
  paymentRightFee: {
    fontSize: 14,
    fontFamily: "inter_medium",
    color: "#000",
    marginRight: 4,
  },
  separatorBar: {
    width: "100%",
    height: 1,
    backgroundColor: "#000",
    marginVertical: 20,
  },
  orderData: {
    marginBottom: 20,
  },
  orderDataItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderDataTitle: {
    fontSize: 13,
    fontFamily: "inter_bold",
    textTransform: "uppercase",
    color: "#000",
    marginBottom: 12,
  },
  orderDataItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderDataItemText: {
    fontSize: 12,
    fontFamily: "inter_medium",
    color: "#000",
  },
  orderDetails: {
    marginBottom: 20,
  },
  logoutContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  logoutBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    backgroundColor: colors.GREEN_LOGO_TWO,
    borderRadius: 4,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: "inter_medium",
    color: "#fff",
  },
});

export default DetailScreen;
