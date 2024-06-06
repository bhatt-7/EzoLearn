import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux'
import { signUp } from '../services/operations/authAPI';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {sendOtp} from '../../src/services/operations/authAPI'
function VerifyEmail() {

    const [otp,setOtp] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {signupData, loading} = useSelector((state)=>state.auth);

    useEffect(()=>{
        if(!signupData){
            navigate("/signup");
        }
    },[]);

    const onSubmitHandler = (e)=>{
        e.preventDefault();

        const{
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,

        } = signupData

        dispatch(signUp( accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,otp,navigate ));
    }

  return (
    <div className='text-white flex flex-col items-center justify-center h-screen'>
      
      {
        loading ? (
          <div>Loading..</div>
        ) : (
          <div>
            <h1>Verify email</h1>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto, tenetur.</p>

            <form onSubmit={onSubmitHandler}>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props) => (
                  <input {...props} className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50" />
                )}
              />

              <button type='submit' className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'>
                Verify Email
              </button>
            </form>

            <div className='mt-4'>
              <Link to="/login">
                <p className='text-blue-500 hover:underline'>Back to login</p>
              </Link>
            </div>

            <button
              onClick={() => {
                dispatch(sendOtp(signupData.email));
              }}
              className='mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700'
            >
              Resend it
            </button>
          </div>
        )
      }
    </div>
  );
}

export default VerifyEmail