import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Icon} from 'react-native-elements';
import {Text, Platform, StyleSheet} from 'react-native';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import Colors from '../constants/Colors';
import OrderScreen from '../screens/shop/OrderScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const Stack = createStackNavigator();

const ProductsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultNavOptions}>
      <Stack.Screen
        name="ProductsOverview"
        component={ProductsOverviewScreen}
        options={{title: 'All Products'}}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({route}) => ({title: route.params.productTitle})}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{title: 'Your Cart'}}
      />
    </Stack.Navigator>
  );
};

const OrdersNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultNavOptions}>
      <Stack.Screen
        name="Orders"
        component={OrderScreen}
        options={{title: 'Your Orders'}}
      />
    </Stack.Navigator>
  );
};

const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultNavOptions}>
      <Stack.Screen
        name="AdminProducts"
        component={UserProductsScreen}
        options={{title: 'Your Products'}}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={({route}) => ({
          title: route.params.productId ? 'Edit Product' : 'Add Product',
        })}
      />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const ShopNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={
        ({drawerActiveTintColor: Colors.primary}, {headerShown: false})
      }>
      <Drawer.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          drawerIcon: ({focused, color}) => (
            <Icon
              name="shopping-cart"
              size={23}
              color={focused ? Colors.primary : 'grey'}
            />
          ),
          drawerLabel: ({focused}) => (
            <Text style={focused ? styles.red : styles.grey}>Products</Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          drawerIcon: ({focused}) => (
            <Icon
              name="list"
              size={23}
              color={focused ? Colors.primary : 'grey'}
            />
          ),
          drawerLabel: ({focused}) => (
            <Text style={focused ? styles.red : styles.grey}>Orders</Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Admin"
        component={AdminNavigator}
        options={{
          drawerIcon: ({focused}) => (
            <Icon
              name="check"
              size={23}
              color={focused ? Colors.primary : 'grey'}
            />
          ),
          drawerLabel: ({focused}) => (
            <Text style={focused ? styles.red : styles.grey}>Admin</Text>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  grey: {
    color: 'grey',
  },
  red: {
    color: Colors.primary,
  },
});

export default ShopNavigator;
