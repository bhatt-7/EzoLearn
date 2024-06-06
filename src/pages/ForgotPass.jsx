import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authAPI';

function ForgotPass() {

    const {loading} = useSelector((state)=>state.auth);
    const [email,setEmail] = useState("");
    const [emailSent,setEmailSent]= useState(false);
    const dispatch = useDispatch();
    const handleOnSubmit =(e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent))
    }

  return (
    <div className='text-white flex justify-center items-center'>
        {
            loading?(<div>Loading...</div>):( 
                <div>
                    <h1>
                        {
                            !emailSent?"Reset your Password":"Check Your Email"
                        }
                    </h1>

                    <p>
                        {
                            !emailSent ? "account recovery" : `${email}`
                        }
                    </p>

                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent && (
                                <label htmlFor="">
                                    <p>Email Address</p>
                                    <input type="email" required name='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your email address'/>
                                </label>
                            )
                        }
                        <button type='submit'>
                            {
                                !emailSent ? "Reset password"  : "Resend email"
                            }
                        </button>

                        <div>
                            <Link to="/login">
                                <p>Back to login</p>
                            </Link>
                        </div>
                    </form>
                </div>
            )
        }
    </div>
  )
}

export default ForgotPass