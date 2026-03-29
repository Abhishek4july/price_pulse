import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
// import Product from './pages/Products';
// import ProductAnalytics from './pages/ProductAnalytics';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-product" element={<AddProduct />} />
          {/* <Route path="/products" element={<Product />} /> */}
          {/* <Route path="/product/:productId" element={<ProductAnalytics />} /> */}
        </Route>
      </Routes>
  );
};

export default App;