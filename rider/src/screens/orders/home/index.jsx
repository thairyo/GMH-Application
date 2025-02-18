import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { OrderItem } from "../../../components/orders";
import colors from "../../../constants/colors";
import { getOrdersFromShipper } from "../../../services/orders";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await getOrdersFromShipper(user._id);
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const fetchOrders = async () => {
      const { data } = await getOrdersFromShipper(user._id);
      setOrders(data);
    };
    fetchOrders();
    setIsRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Lịch sử đơn hàng</Text>
        <Text style={styles.headerTitle}>
          Những đơn hàng của bạn
        </Text>
      </View>
      {orders ? (
        <FlatList
          data={orders}
          renderItem={({ item, index }) => <OrderItem order={item} />}
          keyExtractor={(item, id) => id}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
        />
      ) : (
        <View style={styles.loadingErrorContainer}>
          <Ionicons name="ios-warning-outline" size={28} color="#000" />
          <Text style={styles.loadingErrorText}>
            {"Không có đơn hàng nào đang chuẩn bị"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  header: {
    marginBottom: 48,
    marginRight: 10,
  },
  headerSubtitle: {
    fontSize: 18,
    fontFamily: "inter_semi_bold",
    color: "#000",
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: "inter_medium",
    color: colors.GRAY_VARIANT,
  },
  loadingErrorContainer: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingErrorText: {
    fontSize: 14,
    fontFamily: "inter_medium",
    color: "#000",
    marginTop: 4,
  },
});

export default HomeScreen;
