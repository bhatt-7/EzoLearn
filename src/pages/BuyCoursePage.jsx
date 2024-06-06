import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { apiConnector } from '../services/apiconnector';
import IconBtn from '../components/common/IconBtn'; // Adjust the import according to your project structure
import swal from 'sweetalert2';
const PUBLISH_KEY = process.env.REACT_APP_PUBLISH_KEY;
const stripePromise = loadStripe(PUBLISH_KEY); // Replace with your actual publishable key

const PaymentPage = () => {
  const COURSE_PAYMENT_API ="http://localhost:4000/api/v1/payment/capturePayment"
  const CONFIRM_PAYMENT_API = "http://localhost:4000/api/v1/payment/verifyPayment"
  const { total, cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courses = cart.map((course) => course._id);

  const [stripe, setStripe] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  

  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);

      const elements = stripeInstance.elements();
      const card = elements.create('card');
      card.mount('#payment-element');
      setCardElement(card);
    };

    initializeStripe();
    fetchClientSecret();
  }, []);
  

  const fetchClientSecret = async () => {
    try {
      let response = await apiConnector(
        "POST",
        COURSE_PAYMENT_API, courses, 
        {
          Authorisation: `Bearer ${token}`,
        }
      );
      console.log("response",response);
      if (response.data.success) {
        setClientSecret(response.data.data.clientSecret);
      } else {
        throw new Error('Failed to fetch client secret');
      }
    } catch (error) {
      console.error('Error fetching client secret:', error);
    }
    console.log(clientSecret)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("first")
    console.log("first")

    if (!stripe || !cardElement || !clientSecret) {
      console.error('Stripe.js has not loaded properly or client secret is missing.');
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
      },
    });

    // if (error) {
    //   console.error('Payment failed:', error);
    //   // Handle payment failure
    // } else if (paymentIntent.status === 'succeeded') {
    //   console.log('Payment succeeded!');
    //   navigate('/dashboard/enrolled-courses');
    //   // Optionally, dispatch an action to reset the cart or update the user's enrolled courses
    //   dispatch({ type: 'RESET_CART' }); // Example action
    // }

    if (error) {
      swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Payment not occur!",
        
      });
      console.error('Payment failed:', error);
    } else if (paymentIntent.status === 'succeeded') {
      try {
        const paymentId=paymentIntent.id
        console.log(paymentIntent.id)
        const users=user._id
        console.log(user._id)
        console.log(courses)
        let confirmResponse = await apiConnector(
          "POST",
          CONFIRM_PAYMENT_API, {paymentId , users, courseId:courses}, 
          {
            Authorisation: `Bearer ${token}`,
          }
        );
        // const confirmResponse = await axios.post(CONFIRM_PAYMENT_API, {
        //   paymentIntentId: paymentIntent.id,
        //   userId: user._id,
        //   courseIds: courses
        // }, {
        //   headers: {
        //     Authorisation: `Bearer ${token}`,
        //   },
        // });

        if (confirmResponse.data.success) {
          swal.fire({
            title: "Payment Done!",
            text: "Enrolled In course",
            icon: "success"
          });
          console.log('Payment succeeded and courses enrolled!');
          navigate('/dashboard/enrolled-courses');
          dispatch({ type: 'RESET_CART' });
        } else {
          throw new Error('Failed to enroll in courses');
        }
      } catch (error) {
        console.error('Error confirming payment and enrolling in courses:', error);
      }
    }
  };

  return (
    <div className="payment-page flex h-screen flex-col items-center justify-center gap-4">
      <h2 className='text-white text-xl'>Total Amount: ₹ {total}</h2>
      <div className='bg-white rounded-md h-[400px] w-[400px]  items-center justify-center gap-5 p-5 '>
        <h1 className='mb-12 text-xl'>Fill Card Details</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <div id="payment-element"></div>
        <button type="submit" className='bg-custom-green-100 p-3 text-white font-bold text-xl rounded-md mt-12 shadow-2xl hover:shadow-xl '>Pay Now</button>
      </form>
      </div>
    </div>
  );
};

export default PaymentPage;
