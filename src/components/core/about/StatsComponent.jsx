import React from 'react'


const Stats=[
    {
        count:"50",
        label:"Sctive students"
    },
    {
        count:"50",
        label:"Sctive students"
    },
    {
        count:"50",
        label:"Sctive students"
    },
    {
        count:"50",
        label:"Sctive students"
    },    
]


function StatsComponent() {
  return (
    <div>
        <section>
            <div>
                <div className='flex gap-x-5'>
                    {
                        Stats.map((data,index)=>{
                            return(
                                <div key={index}>
                                    <h1>
                                        {data.count}
                                    </h1>
                                    <h2>
                                        {data.label}
                                    </h2>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    </div>
  )
}

export default StatsComponent