const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.capturePayment = async (req, res) => {
    let  courses  = req.body
    console.log(req.body)
    const userId = req.user.id
    console.log(userId)
    // if (courses.length === 0) {
    //   return res.json({ success: false, message: "Please Provide Course ID" })
    // }
  
    let total_amount = 0
  
    for (const course_id of courses) {
      let course
      try {
        // Find the course by its ID
        course = await Course.findById(course_id)
  
        // If the course is not found, return an error
        if (!course) {
          return res
            .status(200)
            .json({ success: false, message: "Could not find the Course" })
        }
  
        // Check if the user is already enrolled in the course
        const uid = new mongoose.Types.ObjectId(userId)
        if (course.studentsEnrolled.includes(uid)) {
          return res
            .status(200)
            .json({ success: false, message: "Student is already Enrolled" })
        }
  
        // Add the price of the course to the total amount
        total_amount += course.price
      } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
      }
    }
  
    const options = {
      amount: total_amount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    }
  
    try {
      const customer = await stripe.customers.create({
        name: 'Jenny Rosen',
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        },
      });
        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total_amount * 100,
            currency:"inr",
            description: "Payment for courses",
            customer:customer.id,
            metadata: { userId, courses: JSON.stringify(courses) }
        });
        console.log(paymentIntent)
        
         res.send({
            success: true,
            message: "Payment initent created successfully",
            data:{
              clientSecret: paymentIntent.client_secret,
              amount:paymentIntent.amount/100,
              currency:paymentIntent.currency
            }
        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Could not initiate payment" });
    }
  }

// verify the payment


exports.verifyPayment = async (req, res) => {
  const paymentIntentId = req.body?.paymentId
  console.log(req.body.paymentId)
  const courses = req.body?.courseId
  console.log(req.body.courseId)
  const userId = req.body.users
  console.log(req.body.users)
  

  if (!paymentIntentId || !userId) {
    return res.status(400).json({ success: false, message: "Invalid request" })
  }

  try {
    console.log("hello")
    console.log(paymentIntentId)
    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log(paymentIntent.status)

    if (paymentIntent.status === 'succeeded') {
      console.log("dusri usre id",userId)
      try{
        const enrollments = [];
        // Payment succeeded, enroll students
      // await enrollStudents(courses, userId, res);
      console.log("ye rhi user id",userId)
      for (const courseId of courses) {
        console.log(courseId)
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        );
        // console.log("fef",enrolledCourse)
        if (!enrolledCourse) {
          console.error("Course not found:", courseId);
          // Handle course not found error separately
          continue; // Move to the next iteration
        }
        // console.log("Updated course: ", enrolledCourse);
        console.log(userId)
        const courseProgress = await CourseProgress.create({
          courseId: courseId,
          userId: userId,
          completedVideos: [],
        });
        console.log("dfcefccrergvtrf")
        console.log(courseProgress._id)
        console.log(userId)
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        ).catch(error=>{
          console.log("error",error);
        });
  
        console.log("Enrolled student: ", enrolledStudent);
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        console.log("Email sent successfully: ", emailResponse.response)
        
      }
      return res.status(200).json({ success: true, message: "Payment Verified" });
      }catch(err){
        console.error("Error enrolling students:", err);
    return res.status(500).json({ success: false, message: "Error enrolling students" });
      }


    } else {
      // Payment failed or in another state
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

exports.confirmPaymentAndEnroll = async (req, res) => {
  const { paymentIntentId, userId, courseIds } = req.body;
  console.log(req.body)
  try {
    // Confirm the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }

    // Update courses and user
    await Course.updateMany(
      { _id: { $in: courseIds } },
      { $addToSet: { studentsEnrolled: userId } }
    );

    await User.findByIdAndUpdate(userId, {
      $addToSet: { courses: { $each: courseIds } }
    });

    res.json({
      success: true,
      message: "Payment successful and courses enrolled"
    });

  } catch (err) {
    console.error('Error confirming payment and enrolling courses:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { paymentIntentId, amount } = req.body;
    const userId = req.user.id;
  
    if (!paymentIntentId || !amount || !userId) {
      return res.status(400).json({ success: false, message: "Please provide all the details" });
    }
  
    try {
      // Retrieve enrolled student information
      const enrolledStudent = await User.findById(userId);
  
      // Fetch payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  
      // Extract orderId and paymentId from payment intent metadata
      const orderId = paymentIntent.metadata.orderId;
      const paymentId = paymentIntent.id;
  
      // Send payment success email
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100, // Assuming the amount is in cents, convert it to the appropriate format
          orderId,
          paymentId
        )
      );
  
      return res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Error in sending mail:", error);
      return res.status(500).json({ success: false, message: "Could not send email" });
    }
  }
  

// enroll the student in the courses
// const enrollStudents = async (courses, userId, res) => {

//     if (!courses || !userId) {
//       return res.status(400).json({ success: false, message: "Please Provide Course ID and User ID" });
//     }
//     try {
//       console.log("trewdvbuy")
//       for (const courseId of courses) {
//         // Find the course and enroll the student in it
//         const enrolledCourse = await Course.findOneAndUpdate(
//           { _id: courseId },
//           { $push: { studentsEnrolled: userId } },
//           { new: true }
//         );
  
//         if (!enrolledCourse) {
//           console.error("Course not found:", courseId);
//           // Handle course not found error separately
//           continue; // Move to the next iteration
//         }
//         console.log("Updated course: ", enrolledCourse);
  
//         // Create course progress for the student
//         const courseProgress = await CourseProgress.create({
//           courseID: courseId,
//           userId: userId,
//           completedVideos: [],
//         });
  
//         // Find the student and add the course to their list of enrolled courses
//         const enrolledStudent = await User.findByIdAndUpdate(
//           userId,
//           {
//             $push: {
//               courses: courseId,
//               courseProgress: courseProgress._id,
//             },
//           },
//           { new: true }
//         );
  
//         console.log("Enrolled student: ", enrolledStudent);
  
//         //Send an email notification to the enrolled student
//         const emailResponse = await mailSender(
//           enrolledStudent.email,
//           `Successfully Enrolled into ${enrolledCourse.courseName}`,
//           courseEnrollmentEmail(
//             enrolledCourse.courseName,
//             `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
//           )
//         );
  
//         console.log("Email sent successfully: ", emailResponse.response);
//       }
//     } catch (error) {
//       console.error("Error during enrollment:", error);
//       return res.status(500).json({ success: false, message: "Error during enrollment" });
//     }
//   };
 
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({ success: false, message: "Please Provide Course ID and User ID" });
  }

  try {
    console.log("trewdvbuy");
    const enrollments = [];

    for (const courseId of courses) {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        console.error("Course not found:", courseId);
        // Handle course not found error separately
        continue; // Move to the next iteration
      }
      console.log("Updated course: ", enrolledCourse);

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      console.log("Enrolled student: ", enrolledStudent);

      enrollments.push({ enrolledCourse, enrolledStudent });
    }

    // Send response after all enrollments are processed
    res.json({ success: true, enrollments });

    // Send email notifications separately after the response is sent
    for (const { enrolledCourse, enrolledStudent } of enrollments) {
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );

      console.log("Email sent successfully: ", emailResponse.response);
    }
  } catch (error) {
    console.error("Error during enrollment:", error);
    return res.status(500).json({ success: false, message: "Error during enrollment" });
  }
};

