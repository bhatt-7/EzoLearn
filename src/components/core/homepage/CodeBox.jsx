import React from 'react'
import CTAButton from "../homepage/Button"
import Highlighttext from './Highlighttext'
import { FaArrowRight } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation'


export default function CodeBox({position,heading,subheading,ctabtn1 , ctabtn2 ,codebox,codeColor}) {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10 `}>
        
        <div className='flex flex-col w-[50%] gap-8'>
          {heading}
          <div className='text-richblack-300 font-bold'>
            {subheading}
          </div>

          <div className='flex mt-7 gap-4'> 
            <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
              <div className='flex gap-3 items-center'>
                {ctabtn1.btnText}
                <FaArrowRight></FaArrowRight>
              </div>
            </CTAButton>

            <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
              {ctabtn2.btnText}
            </CTAButton>
          </div>
        </div>

        <div className='h-fit flex flex-row text-[10px] w-[100%] py-4 lg:w-[500px]'>

          <div className='text-center flex flex-col w-[10%] text-richblack-300 font-inter font-bold'>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>

          </div>
          <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
            <TypeAnimation 
            sequence={[codebox,5000,"<Html>/n"]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={true}
            style={
              {
                whiteSpace:"pre-line",
                display:"block",
              }
            }
            ></TypeAnimation>

          </div>
        </div>

    </div>
  )
}
