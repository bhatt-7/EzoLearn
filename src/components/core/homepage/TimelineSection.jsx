import React from 'react'
import timelineimage from "../../../assets/Images/TimelineImage.png"
export default function TimelineSection() {
  return (
    <div>
        <div className='flex flex-row mb-20 gap-15 items-center'>
            {/*left*/}

            <div className='w-[45%] flex flex-col gap-11 '>
                <div className='flex flex-row gap-6'>
                    <div className='w-[50px] h-[50px] bg-white flex items-center'>
                        <img src="" alt="" />
                    </div>

                    <div>
                        <h2 className='font-semibold text-[18px] '>hello</h2>
                        <p className='text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                </div>

                <div className='flex flex-row gap-6'>
                    <div className='w-[50px] h-[50px] bg-white flex items-center'>
                        <img src="" alt="" />
                    </div>

                    <div>
                        <h2 className='font-semibold text-[18px] '>hello</h2>
                        <p className='text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                </div>

                <div className='flex flex-row gap-6'>
                    <div className='w-[50px] h-[50px] bg-white flex items-center'>
                        <img src="" alt="" />
                    </div>

                    <div>
                        <h2 className='font-semibold text-[18px] '>hello</h2>
                        <p className='text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                </div>

                
            </div>

            {/*right*/}
            <div className='relative shadow-blue-200'>
                <img src={timelineimage} alt="" className='rounded-md object-cover h-fit ' />

                <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%]'>

                    <div className='flex flex-row gap-5 items-center border-r px-7'>
                        <p className='text-3xl font-bold'>10</p>
                        <p className='text-green-300 text-sm'>Years of experience</p>
                    </div>

                    <div className='flex items-center gap-5 px-7'>
                        <p className='text-3xl font-bold'>250</p>
                        <p className='text-green-300 text-sm'>Type of courses</p>
                    </div>

                </div>

            </div>
        </div>
    </div>
  )
}
