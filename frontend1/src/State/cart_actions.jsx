import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { url } from "../Components/backend_link/data";

const saveCartToLocalStorage = (cart, name) => {
  localStorage.setItem(name, JSON.stringify(cart));
};

const loadCartFromLocalStorage = (name) => {
  const storedCart = localStorage.getItem(name);
  return storedCart ? JSON.parse(storedCart) : [];
};

// Thunk to handle adding to cart
export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async (product, { getState, dispatch }) => {
    const { auth } = getState(); // Access global auth state

    if (auth?.user) {
      try {
        // Logic to handle authenticated user (e.g., send the cart data to the backend)
        console.log(product);

        const res = await axios.post(
          `${url}/api/v2/cart/add-to-cart/${auth?.user._id}`,
          {
            item: product,
          },
          {
            headers: {
              Authorization: auth?.token,
            },
          }
        );

        if (res.data.success) {
          dispatch(cartSlice.actions.addToCart(product));
          return res.data.success;
        }
      } catch (error) {
        toast.error("An error occurred while adding to cart");
        return false;
      }
    } else {
      dispatch(cartSlice.actions.addToCart(product));
      return true;
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  "cart/removeFromCart",
  async (product, { getState, dispatch }) => {
    const { auth } = getState();

    if (auth?.user) {
      try {
        // Logic to handle authenticated user (e.g., send the cart data to the backend)
        const res = await axios.put(
          `${url}/api/v2/cart/remove-from-cart/${auth?.user._id}`,
          {
            item: product,
          },
          {
            headers: {
              Authorization: auth?.token,
            },
          }
        );

        if (res.data.success) {
          dispatch(cartSlice.actions.removeFromCart(product));
        }
      } catch (error) {
        toast.error("An error occurred while removing from cart");
      }
    } else {
      dispatch(cartSlice.actions.removeFromCart(product));
      toast.success("Item removed from cart");
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (id, { getState, dispatch }) => {
    const { auth } = getState();

    if (auth?.user) {
      try {
        const response = await axios.get(`${url}/api/v2/cart/get-cart/${id}`, {
          headers: {
            Authorization: auth?.token,
          },
        });

        if (response.data.success) {
          if(response.data.cart.length > 0){
          dispatch(cartSlice.actions.setCart(response.data.cart));
          }
          else{
            let localcart = localStorage.getItem("product-cart")
            if(localcart){
              dispatch(cartSlice.actions.setCart(JSON.parse(localcart)))
            }
          }
        }
      } catch (error) {
        toast.error("Something went wrong while fetching cart");
      }
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    buy: [],
    events: [],
    labour: [],
  },
  reducers: {
    addToCart: (state, action) => {
      state.cart.push({ ...action.payload });
      saveCartToLocalStorage(state.cart, "product-cart");
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload._id);
      saveCartToLocalStorage(state.cart, "product-cart");
    },
    increaseQty: (state, action) => {
      const item = state.cart.find((item) => item._id === action.payload._id);
      if (item) {
        item.qty += 1;
      }
    },
    decreaseQty: (state, action) => {
      const item = state.cart.find((item) => item._id === action.payload._id);
      if (item && item.qty > 1) {
        item.qty -= 1;
      }
    },

    setCart: (state, action) => {
      state.cart = [];

      state.cart = action.payload;
    },

    updateSelectedVariety: (state, action) => {

      console.log("Reduxt state = " ,action.payload.selectedVariety)

      const item = state.cart.find((item) => item._id === action.payload._id);


      if (item) {
        item.selectedVariety.name = action.payload.selectedVariety.name;
        item.selectedVariety.price = action.payload.selectedVariety.price;
      }
    },
    
    buyNow: (state, action) => {
      state.buy.push(action.payload);
    },
    clearBuy: (state) => {
      state.buy = [];
    },
    addEvent: (state, action) => {
      state.events.push({ ...action.payload });

      // saveCartToLocalStorage(state.events, "event-cart");
    },

    removeEvent: (state, action) => {
      state.events = state.events.filter(
        (item) => item._id !== action.payload._id
      );

      // saveCartToLocalStorage(state.events, "event-cart");
    },

    addLabour: (state, action) => {
      state.labour.push({ ...action.payload });

      // saveCartToLocalStorage(state.labour, 'labour-cart');
    },

    removeLabour: (state, action) => {
      state.labour = state.labour.filter(
        (item) => item._id !== action.payload._id
      );

      // saveCartToLocalStorage(state.labour, 'labour-cart');
    },
  },
});

// Export actions and reducer
export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  buyNow,
  clearBuy,
  addToOrder,
  addEvent,
  removeEvent,
  setCart,
  addLabour,
  removeLabour,
  updateSelectedVariety
} = cartSlice.actions;

export default cartSlice.reducer;
