import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import {apiConnector} from '../../../services/apiconnector';
import {contactusEndpoint} from '../../../services/apis'
function ContractUsForm() {

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm();

    const submitContactForm = async (data) => {
        console.log("data",data);
        try{
            setLoading(true);
            // const response = await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data);
            const response = {status:"OK"};
            console.log(response);
            setLoading(false);
        }
        catch(err){
            console.log(err.message)
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({
                email: "",
                firstname: "",
                lastname: "",
                message: "",
                phoneno: "",
            })
        }
    }, [reset, isSubmitSuccessful]);

    return (
        <form onSubmit={handleSubmit(submitContactForm)} className='text-black'>
            <div className='flex gap-5 flex-col'>
                <div className='flex flex-col'>
                    <label htmlFor="firstname">First Name</label>
                    <input type="text" name='firstname' id='firstname' placeholder='Enter first name'
                        {...register("firstname", { require: true })}
                    />

                    {
                        errors.firstname && (
                            <span>Enter your first name</span>
                        )
                    }

                    <div className='flex flex-col gap-5'>
                        <label htmlFor="lastname">Last Name</label>
                        <input type="text" name='firstname' id='lastname' placeholder='Enter first name'
                            {...register("lastname")}
                        />
                    </div>
                </div>

                


                {/* email */}
                <div className='flex flex-col'>
                    <label htmlFor="email">Email address</label>
                    <input type="email" name='email' id='email' placeholder='Enter email' {...register("email", { require: true })} />
                    {
                        errors.email && (
                            <span>
                                Enter email
                            </span>
                        )
                    }
                </div>

                {/* message */}

                <div className='flex flex-col'>
                    <label htmlFor="message">Message</label>
                    <textarea name="message" id="message" cols="30" rows="10" placeholder='enter your message here' {...register("message", { require: true })} />{
                        errors.message && (
                            <span>
                                ENter your message
                            </span>
                        )
                    }
                </div>

                <button type='submit' className='rounded-md bg-[#302559] px-6 text-[16px]'> Send</button>
            </div>

           
        </form>
    )
}

export default ContractUsForm