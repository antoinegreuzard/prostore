import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { toast } from 'react-hot-toast';
// eslint-disable-next-line import/no-unresolved
import { Analytics } from '@vercel/analytics/react';
// eslint-disable-next-line import/no-unresolved
import { SpeedInsights } from '@vercel/speed-insights/next';

const Context = createContext();

export function StateContext({ children }) {
  const [navigation, setNavigation] = useState([]);
  const [cosmicUser, setCosmicUser] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [categories, setCategories] = useState({
    groups: [],
    types: {},
  });

  const onCategoriesChange = useCallback((content) => {
    setCategories((prevFields) => ({
      ...prevFields,
      ...content,
    }));
  }, []);

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => item.id === product.id);

    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    toast.success(`${quantity} of ${product.title} added to the cart.`, {
      position: 'bottom-right',
    });

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => ((cartProduct.id === product.id)
        ? { ...cartProduct, quantity: cartProduct.quantity + quantity }
        : cartProduct));

      setCartItems(updatedCartItems);
      return updatedCartItems;
    }

    const newProduct = { ...product, quantity };
    setCartItems((s) => [...s, newProduct]);
    return newProduct;
  };

  const onRemove = (product) => {
    const foundProduct = cartItems.find((item) => item.id === product.id);
    if (!foundProduct) return;

    const newCartItems = cartItems.filter((item) => item.id !== product.id);

    setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
    setCartItems(newCartItems);
  };

  const contextValues = useMemo(() => ({
    cartItems,
    totalPrice,
    totalQuantities,
    onAdd,
    onRemove,
    setCartItems,
    setTotalPrice,
    setTotalQuantities,
    categories,
    onCategoriesChange,
    navigation,
    setNavigation,
    cosmicUser,
    setCosmicUser,
  }), [
    cartItems,
    totalPrice,
    totalQuantities,
    categories,
    navigation,
    cosmicUser,
  ]);

  return (
    <Context.Provider value={contextValues}>
      {children}
      <Analytics />
      <SpeedInsights />
    </Context.Provider>
  );
}

export const useStateContext = () => useContext(Context);
