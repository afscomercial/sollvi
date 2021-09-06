import React, {useLayoutEffect} from 'react';
import {
  FlatList,
  Platform,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {Icon} from 'react-native-elements';

import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = props => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();
  const {navigation} = props;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProduct', {productId: ''})}
          style={styles.cartButton}>
          <Icon
            name="add"
            size={23}
            color={Platform.OS === 'android' ? 'white' : Colors.primary}
          />
        </TouchableOpacity>
      ),
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

  const editProductHandler = id => {
    props.navigation.navigate('EditProduct', {productId: id});
  };

  const deleteHandler = id => {
    dispatch(productsActions.deleteProduct(id));
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      {text: 'No', style: 'default'},
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(productsActions.deleteProduct(id));
        },
      },
    ]);
  };

  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}>
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={deleteHandler.bind(this, itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};

const styles = StyleSheet.create({
  cartButton: {
    marginRight: 20,
  },
  menuButton: {
    marginLeft: 20,
  },
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default UserProductsScreen;
