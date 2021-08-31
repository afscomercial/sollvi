import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  View,
  Button,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Icon} from 'react-native-elements';
// import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
// import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();
  const {navigation} = props;

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err);
    }
    setIsRefreshing(false);
  }, [dispatch, setError]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartButton}>
          <Icon
            name="shopping-cart"
            size={23}
            color={Platform.OS === 'android' ? 'white' : Colors.primary}
          />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={styles.menuButton}>
          <Icon
            name="menu"
            size={23}
            color={Platform.OS === 'android' ? 'white' : Colors.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  useEffect(() => {
    const willFocusSub = navigation.addListener('willFocus', loadProducts);

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts, navigation]);

  const selectItemHandler = (id, title) => {
    navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error ocurred!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}>
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

// ProductsOverviewScreen.navigationOptions = navData => {
//   return {
//     headerTitle: 'All Products',
// headerLeft: (
//   <HeaderButtons HeaderButtonComponent={HeaderButton}>
//     <Item
//       title="Menu"
//       iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
//       onPress={() => {
//         navData.navigation.toggleDrawer();
//       }}
//     />
//   </HeaderButtons>
// ),
// headerRight: (
// <TouchableHighlight
//   onPress={() => {
//     navData.navigation.navigate("Cart");
//   }}
// >
//   <View style={styles.headerButton}>
//     <Icon
//       name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
//       size={23}
//       color={Platform.OS === "android" ? "white" : Colors.primary}
//     />
//   </View>
// </TouchableHighlight>
//   <HeaderButtons HeaderButtonComponent={HeaderButton}>
//     <Item
//       title="Cart"
//       iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
//       onPress={() => {
//         navData.navigation.navigate('Cart');
//       }}
//     />
//   </HeaderButtons>
// ),
//   };
// };

const styles = StyleSheet.create({
  headerButton: {
    padding: 20,
  },
  cartButton: {
    marginRight: 20,
  },
  menuButton: {
    marginLeft: 20,
  },
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default ProductsOverviewScreen;
