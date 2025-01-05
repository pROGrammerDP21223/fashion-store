import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const { navigate, cartItems, products, delivery_fee, getCartAmount, backendUrl, token, setCartItems } = useContext(ShopContext); // Get cartItems and products from context

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Build order items array
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      console.log(orderItems);

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,

      }

      switch (method) {

        case 'cod':

          const response = await axios.post(backendUrl + "/api/order/place", orderData, { headers : { token } })
          if (response.data.success) {
            setCartItems({})
            navigate('/orders');
          }
          else {
            toast.error(response.data.message)
          }
          break

        default:
          break
      }

      // Here, you would likely send the orderItems to your backend or perform other actions

      // Reset the form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
      });

      // Navigate to the orders page after submitting

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input
            required
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            placeholder='First name'
          />
          <input
            required
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChangeHandler}
            placeholder='Last name'
          />
        </div>

        <input
          required
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type="email"
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
          placeholder='Email address'
        />
        <input
          required
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type="text"
          name="street"
          value={formData.street}
          onChange={onChangeHandler}
          placeholder='Address'
        />

        <div className='flex gap-3'>
          <input
            required
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type="text"
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            placeholder='City'
          />
          <input
            required
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type="text"
            name="state"
            value={formData.state}
            onChange={onChangeHandler}
            placeholder='State'
          />
        </div>
        <div className='flex gap-3'>
          <input
            required
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type="number"
            name="zipcode"
            value={formData.zipcode}
            onChange={onChangeHandler}
            placeholder='Zipcode'
            min="0"
          />
          <input
            required
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type="text"
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            placeholder='Country'
          />
        </div>
        <input
          required
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type="number"
          name="phone"
          value={formData.phone}
          onChange={onChangeHandler}
          placeholder='Phone'
        />
      </div>

      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
