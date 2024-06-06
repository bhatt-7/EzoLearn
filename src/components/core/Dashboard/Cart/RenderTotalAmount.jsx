import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { Payment} from "../../../../services/operations/studentFeaturesAPI"
import IconBtn from "../../../common/IconBtn"
import { demo } from "../../../../services/operations/studentFeaturesAPI" 
export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const courses = cart.map((course) => course._id)
  const handleBuyCourse = async() => {
   
    // console.log("Token",token)
    // console.log("Token",courses)
    // console.log(user)
    // await Payment(token, courses, user, navigate, dispatch)

    navigate("/payment")
    
  }

  return (
    <div className="min-w-[280px] rounded-md shadow-2xl bg-custom-green-100 p-6">
      <p className="mb-1 text-md font-medium text-black">Total:</p>
      <p className="mb-6 text-3xl font-bold text-white">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center bg-pure-grey-900 text-white p-2 rounded-xl font-bold"
      />
       {/* <IconBtn
        text="test Now"
        onclick={""}
        customClasses="w-full justify-center text-white"
      /> */}

      
      
    </div>
  )
}