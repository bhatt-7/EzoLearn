import signupImg from "../assets/Images/bn.png"
import Template from "../components/core/auth/Template"

function Signup() {
  return (
    <Template
      title="Join the millions learning to code with EzoLearn for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup