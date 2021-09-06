import React, {useEffect, useState, useCallback, useLayoutEffect} from 'react';
import {
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Icon} from 'react-native-elements';

import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrderScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  const {navigation} = props;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
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

  const loadOrders = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(ordersActions.fetchOrders());
    } catch (err) {
      setError(err);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadOrders();
  }, [dispatch, loadOrders]);

  useEffect(() => {
    loadOrders();
  }, [dispatch, loadOrders]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error ocurred!</Text>
        <Button title="Try again" onPress={loadOrders} color={Colors.primary} />
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

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    marginLeft: 20,
  },
});

export default OrderScreen;
