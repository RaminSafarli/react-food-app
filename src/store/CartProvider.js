import CartContext from "./cart-context";
import { useReducer } from "react";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      const updatedTotalAmount =
        state.totalAmount + action.item.price * action.item.amount;

      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.item.id
      );

      const existingCartItem = state.items[existingCartItemIndex];
      let updatedItems;

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          amount:
            parseInt(existingCartItem.amount) + parseInt(action.item.amount),
        };
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        updatedItems = state.items.concat(action.item);
      }

      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };
    case "REMOVE":
      const choosenCartItemIndex = state.items.findIndex(
        (item) => item.id === action.id
      );
      const choosenItem = state.items[choosenCartItemIndex];
      const afterRemoveTotalAmount = state.totalAmount - choosenItem.price;
      let newItems;
      if (choosenItem.amount === 1) {
        newItems = state.items.filter((item) => item.id !== action.id);
      } else {
        const newUpdatedItem = {
          ...choosenItem,
          amount: choosenItem.amount - 1,
        };
        newItems = [...state.items];
        newItems[choosenCartItemIndex] = newUpdatedItem;
      }
      return {
        items: newItems,
        totalAmount: afterRemoveTotalAmount,
      };
    default:
      break;
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
