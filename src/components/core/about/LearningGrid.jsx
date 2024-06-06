import React from 'react'

function LearningGrid() {
  return (
    <div className='grid mx-auot grid-col-1 lg:grid-cols-4 mb-10'>
        {
            LearningGridArray.map((card,index)=>{
                return(
                    <div key={index} className={`${index===0} && `}>

                    </div>
                )
            })
        }
    </div>
  )
}

export default LearningGrid