import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CheckOut from './CheckOut.jsx';
import { useProduct } from '../../contexts/ProductContext.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function ShippingAddress() {
  const [address, setAddress] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [errors, setErrors] = useState({});
  const [currAdd, setCurrAdd] = useState({});
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const { setTotalPrice, cart } = useProduct()


  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const validate = () => {
    let errors = {};
    if (!/^\d{6}$/.test(address.pincode)) {
      errors.pincode = "Pincode must be a 6-digit number";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(`${API_URL}/api/v1/orders/updateaddress`, address);
        console.log(response.data);
        setCurrAdd(response.data);
        setAddress({
          address_line1: "",
          address_line2: "",
          city: "",
          state: "",
          pincode: ""
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/orders/useraddress`);
        console.log("Address", response.data);
        setCurrAdd(response.data);
      } catch (error) {
        console.error('Error fetching address:', error);
        // Additional logging to help debug
        console.log('Error details:', error.response ? error.response.data : error.message);
      }

    };

    fetchAddress();
  }, [address]);

  useEffect(() => {
    setTimeout(() => {
      const totalPrice = cart.reduce((acc, product) => acc + Number(product.price) * product.quantity, 0)
      setTotal(totalPrice)
      setTotalPrice(totalPrice)
      setLoading(false)
    }, 1000)
  }, [cart, setTotalPrice])

  return (
    <div className="flex items-center justify-center min-h-screen mx-auto p-4 bg-gradient-to-r from-white to-red-300">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Shipping Address */}
        <div className="grid grid-cols-1">
          {currAdd && Object.keys(currAdd).length > 0 ? (
            <div className="max-w-sm bg-white border border-gray-500 rounded-lg p-4 mb-4">
              <h1 className="text-2xl font-bold mb-4">Current Address</h1>
              <p className="text-gray-700 mb-2">{currAdd.address_line1}</p>
              <p className="text-gray-700 mb-2">{currAdd.address_line2}</p>
              <p className="text-gray-700 mb-2">{currAdd.city}, {currAdd.state} - {currAdd.pin_code}</p>
            </div>) : (<div>
              <h1 className="text-2xl font-bold mb-4 flex justify-center">Enter Address to ship!</h1>
            </div>
          )}
          <h1 className="text-2xl font-extrabold mb-4 flex justify-center">OR</h1>

          {/* New Shipping Address Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-500 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Ship To New Address</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Address Line 1</label>
              <input
                className="w-full rounded-md placeholder-gray-500 bg-gray-200 border border-gray-300 px-4 py-2"
                type="text"
                name="address_line1"
                value={address.address_line1}
                onChange={handleChange}
                placeholder="Address line 1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Address Line 2</label>
              <input
                className="w-full rounded-md placeholder-gray-500 bg-gray-200 border border-gray-300 px-4 py-2"
                type="text"
                name="address_line2"
                value={address.address_line2}
                onChange={handleChange}
                placeholder="Address line 2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
                <input
                  className="w-full rounded-md placeholder-gray-500 bg-gray-200 border border-gray-300 px-4 py-2"
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">State</label>
                <input
                  className="w-full rounded-md placeholder-gray-500 bg-gray-200 border border-gray-300 px-4 py-2"
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Pincode</label>
              <input
                className="w-full rounded-md placeholder-gray-500 bg-gray-200 border border-gray-300 px-4 py-2"
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                placeholder="Pincode"
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
            </div>

            <button type="submit" className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
              Ship Here
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="mr-6 flex justify-end items-center">
          <table className="max-w-sm">
            <tbody>
              <tr className="bg-gray-200 border-b border-gray-300">
                <td className="px-4 py-2">Subtotal</td>
                <td className="text-right px-4 py-2">Rs.{total}</td>
              </tr>
              <tr className="bg-gray-200 border-b border-gray-300">
                <td className="px-4 py-2">Tax</td>
                <td className="text-right px-4 py-2">Rs.50</td>
              </tr>
              <tr className="bg-gray-200">
                <td className="px-4 py-2">Total</td>
                <td className="text-right px-4 py-2">Rs.{total+50}</td>
              </tr>
              <tr>
                <td colSpan="2" className="border-t border-gray-300">
                  <label className="flex items-center px-4 py-2">
                    <input
                      type="radio"
                      name="payment-method"
                      className="mr-2 appearance-none rounded-full border border-gray-500 checked:bg-red-500 checked:border-red-500 focus:outline-none"
                    />
                    Online Payment
                  </label>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="border-t border-gray-300">
                  <label className="flex items-center px-4 py-2">
                    <input
                      type="radio"
                      name="payment-method"
                      className="mr-2 appearance-none rounded-full border border-gray-500 checked:bg-red-500 checked:border-red-500 focus:outline-none"
                    />
                    Cash on Delivery
                  </label>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="border-t border-gray-300">
                  <CheckOut />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShippingAddress;
