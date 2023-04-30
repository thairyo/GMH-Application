import { ActivityIndicator, FlatList, View } from "react-native";
import ProductItem from "../../components/ProductItem";
import { useEffect, useState } from "react";
import { getDishes } from "../../services/dishes";

const InfinityScroll = ({ type }) => {
  const [dishes, setDishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const getDishesPerPage = async () => {
    setIsLoading(true);
    try {
      const data = await getDishes(type, currentPage);
      setDishes([...dishes, ...data.dishes]);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const renderLoader = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
  };

  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    getDishesPerPage();
  }, [currentPage]);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 50,
      }}
    >
      <FlatList
        data={dishes}
        renderItem={({ item }) => <ProductItem item={item} />}
        keyExtractor={(item, key) => key}
        ListFooterComponent={renderLoader}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0}
      />
    </View>
  );
};

export default InfinityScroll;
