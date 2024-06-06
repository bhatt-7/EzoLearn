import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../services/operations/authAPI';
import { useLocation } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';
function Updatepassword() {
    const dispatch = useDispatch();
    const location = useLocation();
    const {loading} =  useSelector((state)=>state.auth);
    const [formData,setFormData]=useState({
        password:"",
        confirmPassword:"",
    })
    const[showPassword,setShowPassword]=useState(false);
    const[showConfirmPassword,setShowConfirmPassword]=useState(false);
    const {password,confirmPassword} = formData;
    
    const handleOnChange = (e)=>{
        setFormData((prevData)=>(
            {
                ...prevData,
                [e.target.name] : e.target.value,
            }
        ))
    } 

    const handleOnSubmit = (e)=>{
        e.preventDefault();
        const token = location.pathname.split("/").at(-1);
        dispatch(resetPassword(password , confirmPassword, token))
    }

  return (
    <div className='text-white'>
        {
            loading ? (
                <div>
                    Loading...
                </div>
            ):(
                <div>
                    <h1>Choose new password</h1>
                    <p>Lorem ipsum dolor sit amet.</p>

                    <form onSubmit={handleOnSubmit}>
                    <label className="relative">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                className="form-style w-full !pr-10"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showPassword ? (
                  <AiFillEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiFillEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

                        <label >
                            <p> Confirm New Password</p>
                            <input 
                            type={showConfirmPassword ?"text":"confirmPassword"} 
                            required 
                            value={confirmPassword} 
                            name='confirmPassword'
                            onClick={handleOnChange} 
                            placeholder='Confirm Password'/>

                            <span onClick={()=>setShowConfirmPassword((prev)=>!prev)}>
                            {
                                showPassword ? <AiFillEyeInvisible fontSize={24}></AiFillEyeInvisible> : <AiFillEye></AiFillEye>
                            }
                        </span>

                        </label>

                        <button type='submit'>
                            Reset Password
                        </button>

                        
                    </form>

                    <div>
                            <Link to="/login">
                                <p>Back to login</p>
                            </Link>
                        </div>
                </div>
            )
        }
    </div>
  )
}

export default Updatepassword