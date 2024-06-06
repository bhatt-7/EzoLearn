import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

// import { formattedDate } from "../../../services/formatDate"
import IconBtn from "../../common/IconBtn"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  return (
    <>
      <h1 className="mb-14 text-3xl font-bold text-black">
        My Profile
      </h1>
      <div className="flex items-center justify-between rounded-md shadow-2xl  bg-pure-grey-900  p-8 px-12">
        <div className="flex text-white items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] border-[1px] border-richblack-50 rounded-full object-cover"
          />
          <div className="space-y-1">
            <p className="text-xl font-semibold text-white">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-md text-richblack-100">{user?.email}</p>
          </div>
        </div>
        <IconBtn
        customClasses={"text-white font-bold"}
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings")
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>
      <div className="my-10 flex flex-col gap-y-10 rounded-md shadow-2xl bg-pure-grey-900 p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-white">About</p>
          <IconBtn
          customClasses={"text-white"}
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-white"
              : "text-white"
          } text-sm font-medium text-white `}
        >
          {user.additionalDetails.about ?? "Write Something About Yourself"}
        </p>
      </div>
      <div className="my-10 flex flex-col gap-y-10 rounded-md shadow-2xl bg-pure-grey-900 p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-white">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            customClasses={"text-white"}
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="flex max-w-[500px] text-white justify-between">
          <div className="flex text-white flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-white">First Name</p>
              <p className="text-sm font-medium text-white">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-white">Email</p>
              <p className="text-sm font-medium text-white">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-white">Gender</p>
              <p className="text-sm font-medium text-white">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-white">Last Name</p>
              <p className="text-sm  font-medium text-white">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-white">Phone Number</p>
              <p className="text-sm font-medium text-white">
                {user.additionalDetails.contactNumber}
              </p>
            </div>
            <div>
              {/* <p className="mb-2  text-sm text-white">Date Of Birth</p> */}
              <p className="text-sm font-medium text-white">
                {/* {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"} */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}