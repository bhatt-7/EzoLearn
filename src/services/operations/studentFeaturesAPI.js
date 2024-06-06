import { toast } from "react-hot-toast"

// import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { resetCart } from "../../slices/cartSlice"
import { setPaymentLoading } from "../../slices/courseSlice"
import { apiConnector } from "../apiconnector"
import { studentEndpoints } from "../apis"
import { loadStripe } from '@stripe/stripe-js';
const PUBLISH_KEY = process.env.REACT_APP_PUBLISH_KEY;
const stripePromise = loadStripe(PUBLISH_KEY);
const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

// Load the Razorpay SDK from the CDN
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// Buy the Course

export async function Payment(
  token,
  courses,
  user_details,
  navigate,
  dispatch
) {

   console.log("tkoennn",token);
  console.info(courses)
  try {
    const stripe = await stripePromise
    // Initiating the payment with Stripe
    console.log("hello")
    console.log(1+1)
    let paymentIntentResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API, courses, 
      {
        Authorisation: `Bearer ${token}`,
      }
    );
    
    console.log(paymentIntentResponse.data.data.clientSecret)

    if (!paymentIntentResponse.data.success) {
      throw new Error(paymentIntentResponse.data.message);
    }
    console.info(paymentIntentResponse.data)
    console.log("PAYMENT RESPONSE FROM BACKEND............", paymentIntentResponse.data.data.clientSecret);
    const clientSecret = paymentIntentResponse.data.data.clientSecret;
    // Initialize Stripe elements
    const appearance = {
      theme: 'flat',
      variables: { colorPrimaryText: '#262626' }
    };
    const elements = stripe.elements({appearance});
    const paymentElement = elements.create('card',{
      fields: {
        billingDetails: {
          name: 'never',
          email: 'never',
        }
      }
    });
    
    paymentElement.mount('#payment-element');

    // Confirm the payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: paymentElement,
        billing_details: {
          name: `${user_details.firstName} ${user_details.lastName}`,
          email: user_details.email,
        },
      },
    });

    if (error) {
      console.log(error);
      toast.error("Oops! Payment Failed.");
    } else if (paymentIntent.status === 'succeeded') {
      const bodyData = {
        paymentIntentId: paymentIntent.id,
        courses,
      };
      await verifyPayment(bodyData, token, navigate, dispatch);
      toast.success("Payment Successful!");
    }
  } catch (error) {
    console.error("PAYMENT API ERROR............", error);
    toast.error("Could Not make Payment.");
  }
  console.log(token)

}



// Verify the Payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorisation: `Bearer ${token}`,
    });

    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment Verified. You are Added to the course ");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.error("PAYMENT VERIFY ERROR............", error);
    toast.error("Could Not Verify Payment.");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}


// Send the Payment Success Email
async function sendPaymentSuccessEmail(paymentIntentId, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        paymentIntentId,
        amount,
      },
      {
        Authorisation: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.error("PAYMENT SUCCESS EMAIL ERROR............", error);
  }
}



export async function demo(token,
  courses,
  user_details,
  navigate,
  dispatch){
    console.log("hello")
    console.log(token)
  }