import React from 'react'
import image from '../../../assets/Images/teacher.png'
import Highlighttext from './Highlighttext'
import CTAButton from './Button'
export default function InstructorSection() {
  return (
    <div>
        <div className='flex flex-row gap-20 items-center mb-10'>
            
            {/* left */}
            <div className='w-[50%]'>
                <img src={image} alt="" className='shadow-white mt-20' />
            </div>

            {/* right */}

            <div className='w-[50%] flex flex-col gap-10'>
                <div className='text-4xl font-semibold'>
                    Become an 
                    <Highlighttext text={"Instructor"}></Highlighttext>
                </div>

                <p className='font-md text-[16px] w-[80%] text-richblack-300'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, iusto inventore magnam quidem quia illo!
                </p>
                
                <div className='w-fit'>
                <CTAButton active={true} linkto={"/signup"}> 
                    <div className=''>
                        Start teaching today
                    </div>
                </CTAButton>
                </div>

            </div>

        </div>
    </div>
  )
}
