import React, { useRef } from "react";
import imgHead from "../../assets/receipt/header.png";
import imgFooter from "../../assets/receipt/footer.png";
import imgVisitor from "../../assets/receipt/visitor.png";
import imgPannel from "../../assets/receipt/pannel-discusion.jpg";
import imgPhone from "../../assets/receipt/phone.png";
import imgCar from "../../assets/receipt/car.jfif";
import imgBus from "../../assets/receipt/bus.jfif";
import imgMetro from "../../assets/receipt/metro.png";
import imgKeel from "../../assets/receipt/keel.png";
import imgMobile from "../../assets/receipt/images5.png";
import imgQR from "../../assets/receipt/QR.png";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";

const Receipt = () => {
  // print logic
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Receipt PDF",
  });

  return (
    <>
      <div className="w-full">

{/* header  */}
         <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-700"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Content */}
        <div className="relative flex justify-center items-center px-6 py-4 h-25">
          <div className="flex items-center justify-between w-full">
            <div className=" ">
              <h2 className="text-xl font-semibold text-white text-center">
                Receipt Management
              </h2>
              
            </div>
<div>
  <button
            onClick={handlePrint}
            className="px-3 py-1 text-gray-400 border-2 border-gray-300 cursor-pointer bg-gray-100 hover:bg-gray-900 hover:text-white"
          >
            <FaPrint />
          </button>
</div>
          </div>
        </div>
      </div>

        <div className="bg-gray-100 py-4 ">
          <div
            ref={printRef}
            className="max-w-[210mm] mx-auto bg-white shadow-lg  "
          >
            <div className="px-6">
              {/* Header Image */}
              <img src={imgHead} alt="" className="w-full h-auto" />
            </div>
            {/* Main Content */}
            <div className="px-6 py-2">
              {/* Title */}
              <h1 className="text-left text-[#555555] font-medium text-lg  pb-1 ">
                Confirmation Letter for 15th Edition of Arogya Sangosthi Seminar
              </h1>
              <hr className="w-full opacity-90 py-2" />
              {/* Main Table */}
              <table className="w-full text-[13px] text-[#555555]">
                <tbody>
                  {/* Greeting and QR Section */}
                  <tr className="border-b border-gray-200">
  {/* LEFT CONTENT */}
  <td className="align-top w-[70%]">
    <p className="mb-1 text-base font-medium text-gray-800">
      Dear Dr. Y.K. Chauhan,
    </p>

    <p className="text-sm leading-relaxed text-gray-700 font-normal">
      We are pleased to confirm your participation in the{" "}
      <span className="font-medium text-gray-800">
        15th Edition of the Arogya Sangosthi Seminar
      </span>
      , held alongside the{" "}
      <span className="font-medium text-gray-800">
        8th Edition of the International Health & Wellness Expo
      </span>{" "}
      and the{" "}
      <span className="font-medium text-gray-800">
        2nd Edition of Agritech Innovate India
      </span>
      . This prestigious event serves as a platform to bring together experts,
      exhibitors, and visitors from various sectors of health, wellness, and
      agriculture.
    </p>
  </td>

  {/* RIGHT QR SECTION */}
  <td className="align-top py-2 w-[30%] text-right">
    <div className="flex flex-col items-end gap-2">
      <img
        src={imgQR}
        alt="QR Code"
        className="w-28 h-28 object-contain"
      />

      <p className="text-sm font-medium text-gray-700">
        AGS/15th/02/093
      </p>
    </div>
  </td>
</tr>


                  {/* Event Details */}
                  <tr>
                    <td colSpan="2" className=" leading-tight">
                      <p className="font-medium mt-1 text-base text-[#555555]">
                        Event Details :
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td
                      className=" leading-tight"
                      style={{ width: "30%" }}
                    >
                      <span className="font-medium text-[#555555] text-sm">
                        Event Name :
                      </span>
                      <span className="px-2 text-sm font-normal text-[#555555]">
                        15th Edition of Arogya Sangosthi Seminar
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className=" leading-tight">
                      <span className="font-medium text-[#555555] text-sm">
                        Event Date :
                      </span>
                                            <span className="px-2 text-sm font-normal text-[#555555]"> 12 Jul 2025</span>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className=" leading-tight">
                      <span className="font-medium text-[#555555] text-sm">
                        Event Venue :
                      </span>
                                           <span className="px-2 text-sm font-normal text-[#555555]">

                        {" "}
                         Hall No- 12 Pargati Maidan New Delhi-110001{" "}
                        <a href="">
                          <span className="text-blue-600 underline text-sm ml-5">
                            Direction
                          </span>
                        </a>
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className=" leading-tight">
                      <span className="font-medium text-[#555555] text-sm">
                        Event Timing
                      </span>
                      <span className="py-2"> : 09:30 AM to 06:00 PM</span>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="py-2">
                      <hr className="w-full opacity-90 " />
                    </td>
                  </tr>

                  {/* Note */}
                  <tr>
                    <td colSpan="2" className="pb-2">
                      <p className="leading-tight">
                        <span className="font-medium text-[#555555] text-sm">
                          Note:
                        </span>{" "}
                        <span className="text-sm font-normal">
                          This pass is valid for the 15th edition of the Arogya
                          Sangosthi Seminar on
                        </span>{" "}
                        <span className="font-semibold text-[#555555] text-sm">
                          12 Jul 2025
                        </span>{" "}
                        <span className="text-sm">
                          and includes access to the exhibition area for
                        </span>{" "}
                        <span className="font-semibold text-[#555555] text-sm">
                          all three days
                        </span>
                        .
                      </p>
                    </td>
                  </tr>

                  {/* Payment Info */}
                  <tr>
                    <td colSpan="2" className="">
                      <p className=" text-sm leading-tight font-sans">
                        The total payment amount is{" "}
                        <span className="font-semibold text-[#555555] text-sm">
                          ₹ 700/-
                        </span>
                        . The payment has been successfully received, confirming
                        the completion of the transaction. The payment was made
                        through{" "}
                        <span className="font-semibold text-[#555555] text-sm">
                          Paytm
                        </span>
                        , ensuring a smooth and secure transfer. The transaction
                        number for this payment is{" "}
                        <span className="font-semibold text-[#555555] text-sm">
                          519132934247
                        </span>
                        , and the payment was completed on{" "}
                        <span className="font-semibold text-[#555555] text-sm">
                          10 Jul 2025
                        </span>
                        .
                      </p>
                    </td>
                  </tr>

                  {/* About Section */}
                  <tr>
                    <td colSpan="2" className="py-1.5">
                      <p className="font-medium text-[1rem] ">
                        About the 15th Edition of Arogya Sangosthi Seminar &
                        Expo:
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-2">
                      <p className=" text-sm leading-tight font-sans">
                        The{" "}
                        <span className="font-semibold text-[#555555] text-sm">
                          Arogya Sangosthi Seminar
                        </span>
                        , a key highlight of the{" "}
                        <span className="font-semibold text-[#555555] text-sm">
                          International Health & Wellness Expo
                        </span>
                        , is a premier platform uniting industry experts,
                        researchers, and practitioners to explore the latest
                        advancements in holistic health, Ayurveda, and
                        sustainable agriculture.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-2">
                      <p className=" text-sm leading-tight font-sans">
                        The expo will showcase a diverse range of products and
                        services in{" "}
                        <span className="font-semibold text-[#555555] text-sm">
                          AYUSH, Nutrition, Fitness, Organic Farming, Herbal
                          Products, and overall wellness
                        </span>
                        , featuring:
                      </p>
                    </td>
                  </tr>

                  {/* Features List */}
                  <tr>
                    <td colSpan="2" className="pb-2">
                      <ul className="list-disc ml-6 text-sm">
                        <li className="leading-tight">
                          Organic products & health supplements
                        </li>
                        <li className="leading-tight">
                          Fitness equipment, health retreats, spas & hospitals
                        </li>
                        <li className="leading-tight">
                          Laboratories, academic & R&D institutes
                        </li>
                        <li className="leading-tight">
                          Bio-energy products, bio-medicine & medicinal plants
                        </li>
                        <li className="leading-tight">
                          Biological clothing, lifestyle products & services
                        </li>
                      </ul>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-2">
                      <p className=" text-sm leading-tight font-sans">
                        This year's{" "}
                        <span className="font-semibold text-[#555555] text-sm">
                          15th Edition of Arogya Sangosthi Seminar
                        </span>{" "}
                        will focus on transformative trends that are shaping the
                        future of Ayurveda and integrative health:
                      </p>
                    </td>
                  </tr>

                  {/* Focus Areas */}
                  <tr>
                    <td colSpan="2" className="pb-1">
                      <ul className="list-disc ml-6 space-y-0">
                        <li className=" leading-tight">
                          <span className="font-medium text-[#555555] text-sm">
                            Globalizing Ayurveda
                          </span>{" "}
                          <span className="text-sm">
                            – Expanding Ayurveda's influence as a globally
                            recognized complementary and alternative medicine.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-medium text-[#555555] text-sm">
                            Ayurveda Meets Modern Science
                          </span>{" "}
                          <span className="text-sm">
                            – Integrating traditional wisdom with cutting-edge
                            medical research to enhance credibility and
                            efficacy.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-medium text-[#555555] text-sm">
                            Holistic Healthcare
                          </span>
                          <span className="text-sm">
                            {" "}
                            – Promoting a 360-degree wellness approach,
                            addressing physical, mental, and spiritual
                            well-being.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-medium text-[#555555] text-sm">
                            Evidence-Based Ayurveda
                          </span>{" "}
                          <span className="text-sm">
                            – Showcasing clinical trials, scientific studies,
                            and real-world case reports to validate Ayurvedic
                            treatments.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-medium text-[#555555] text-sm">
                            Sustainability & Medicinal Plants
                          </span>{" "}
                          <span className="text-sm">
                            – Advocating for ethical sourcing, conservation, and
                            responsible cultivation of Ayurvedic herbs.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-medium text-[#555555] text-sm">
                            Ayurveda for Lifestyle Disorders
                          </span>{" "}
                          <span className="text-sm">
                            – Offering time-tested solutions for diabetes,
                            hypertension, obesity, and mental health challenges.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-medium text-[#555555] text-sm">
                            Ayurveda & Pandemic Resilience
                          </span>{" "}
                          <span className="text-sm">
                            – Exploring Ayurveda's role in immune strengthening,
                            disease prevention, and post-pandemic recovery.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-medium text-[#555555] text-sm">
                            Tech-Driven Ayurveda
                          </span>{" "}
                          <span className="text-sm">
                            – Leveraging AI, telemedicine, and digital health to
                            modernize Ayurvedic diagnosis and treatment.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-medium text-[#555555] text-sm">
                            Regulations & Standardization
                          </span>{" "}
                          <span className="text-sm">
                            – Strengthening quality control, global compliance,
                            and standardization in Ayurvedic medicine.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-medium text-[#555555] text-sm">
                            Ayurveda in Education & Research
                          </span>{" "}
                          <span className="text-sm">
                            – Fostering innovation through academic
                            collaborations, research advancements, and clinical
                            practice improvements.
                          </span>
                        </li>
                      </ul>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pt-2">
                      <p className=" text-sm leading-tight font-sans">
                        This seminar presents a unique opportunity to engage
                        with global experts, researchers, and industry pioneers,
                        shaping the future of Ayurveda and holistic wellness.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="py-3">
                      <hr className="w-full opacity-45 " />
                    </td>
                  </tr>
                  {/* Stall Booking */}
                  <tr>
                    <td colSpan="2" className="pb-2">
                      <p className=" text-sm leading-tight font-sans">
                        <span className="font-medium text-[#555555] text-sm">
                          Note:
                        </span>{" "}
                        Book Your Stall for the 8th Edition of the International
                        Health & Wellness Expo. Be a part of this premier event
                        and showcase your brand to a diverse audience.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="">
                      <p className=" text-sm leading-tight font-sans">
                        <span className="font-medium text-[#555555] text-sm">
                          How to Book? : Secure your stall by clicking the link
                          below and completing your registration:
                        </span>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="py-2.5">
                      <button className="bg-[#2DBDC7] text-white font-semibold px-6 py-1 cursor-pointer">
                        Register for Expo Stall Booking
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-3">
                      <p className=" text-sm leading-tight font-sans">
                        Do not miss this incredible opportunity to connect,
                        network, and grow. We look forward to your
                        participation!
                      </p>
                    </td>
                  </tr>

                  {/* Social Media */}
                  <tr>
                    <td colSpan="2" className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300">
                          <img src={imgMobile} alt="" />
                        </div>
                        <p className="font-medium text-sm">
                          Follow Us on social media for International Health &
                          Wellness Expo Updates:
                        </p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-300">
                          <img src={imgKeel} alt="" />
                        </div>
                        <a href="">
                          <p className="text-blue-600 underline">Facebook</p>
                        </a>
                        <span>|</span>
                        <div className="w-5 h-5 bg-gray-300">
                          <img src={imgKeel} alt="" />
                        </div>
                        <a href="">
                          <p className="text-blue-600 underline">Instagram</p>
                        </a>
                        <span>|</span>
                        <div className="w-5 h-5 bg-gray-300">
                          <img src={imgKeel} alt="" />
                        </div>
                        <a href="">
                          <p className="text-blue-600 underline">Website</p>
                        </a>
                        <span>|</span>
                        <div className="w-5 h-5 bg-gray-300">
                          <img src={imgKeel} alt="" />
                        </div>
                        <a href="">
                          <p className="text-blue-600 underline">LinkedIn</p>
                        </a>
                      </div>
                    </td>
                  </tr>

                  {/* How to Reach */}
                  <tr>
                    <td colSpan="2" className="pb-2">
                      <p className="font-medium text-sm">
                        How to reach the venue
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-2">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full shrink-0 mt-0.5">
                          <img src={imgMetro} alt="" />
                        </div>
                        <p className=" text-sm leading-tight font-sans">
                          <span className="font-medium text-[#555555] text-sm">
                            By Metro:
                          </span>{" "}
                          If you are traveling by metro, please get down at
                          Pragati Maidan Metro Station. From there, our shuttle
                          service will be available to take you directly to the
                          event venue at Hall No. 12
                        </p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-2">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-orange-500 rounded shrink-0 mt-0.5">
                          <img src={imgBus} alt="" />
                        </div>
                        <p className=" text-sm leading-tight font-sans">
                          <span className="font-medium text-[#555555] text-sm">
                            By Public Transport:
                          </span>{" "}
                          If you are arriving by bus, auto, or taxi, please
                          enter through Pragati Maidan Gate No. 10. From there,
                          our shuttle service will take you to Hall No. 12.
                        </p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-4">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-red-600 rounded shrink-0 mt-0.5">
                          <img src={imgCar} alt="" />
                        </div>
                        <p className=" text-sm leading-tight font-sans">
                          <span className="font-medium text-[#555555] text-sm">
                            By Car:
                          </span>{" "}
                          If you are coming by your own vehicle, you can park
                          your car at Basement 2, Pragati Maidan Parking. After
                          parking, step outside, and our shuttle service will
                          pick you up and take you to Hall No. 12.
                        </p>
                      </div>
                    </td>
                  </tr>

                  {/* Contact Info */}
                  <tr>
                    <td colSpan="2" className="pb-2">
                      <p className=" text-sm leading-tight font-sans">
                        If you need any further information or any help, feel
                        free to contact our team members, who will be happy to
                        assist you:
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 bg-red-600 rounded-full">
                            <img src={imgPhone} alt="" />
                          </div>
                          <p className="text-sm">
                            Renu Yaday:{" "}
                            <a href="">
                              <span className="text-blue-600 underline">
                                7042818092
                              </span>
                            </a>
                          </p>
                        </div>
                        <span>|</span>
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 bg-red-600 rounded-full">
                            <img src={imgPhone} alt="" />
                          </div>
                          <p className="text-sm">
                            Reetika Singh:{" "}
                            <a href="">
                              <span className="text-blue-600 underline">
                                9773992519
                              </span>
                            </a>
                          </p>
                        </div>
                        <span>|</span>
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 bg-red-600 rounded-full">
                            <img src={imgPhone} alt="" />
                          </div>
                          <p className="text-sm">
                            Vipin Sharma:{" "}
                            <a href="">
                              <span className="text-blue-600 underline">
                                9310608427
                              </span>
                            </a>
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Conference Image Placeholder */}
                  <tr>
                    <td colSpan="2" className="pb-4">
                      <div className=" bg-white flex items-center justify-center">
                        <img
                          src={imgPannel}
                          alt=""
                          className="w-[400px] h-[516px]"
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Expo Image Placeholder */}
                  <tr>
                    <td colSpan="2" className="pb-4 ">
                      <div className=" bg-white flex items-center justify-center">
                        <img
                          src={imgVisitor}
                          alt=""
                          className="w-[400px] h-[516px]"
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Closing */}
                  <tr>
                    <td colSpan="2" className="pb-2">
                      <p className=" text-sm leading-tight font-sans">
                        We look forward to welcoming you to the{" "}
                        <span className="font-medium text-[#555555] text-sm">
                          International Health & Wellness Expo, Agritech
                          Innovate India
                        </span>
                        , and the{" "}
                        <span className="font-medium text-[#555555] text-sm">
                          Arogya Sangosthi
                        </span>{" "}
                        Seminar. See you there!
                        <span className="inline-block ml-1">🌿</span>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-1 text-sm">
                      <p>Warm regards,</p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-1">
                      <p className="font-semibold">Vijay Sharma</p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-6 text-sm">
                      <p>Chairman - Namo Gange Trust</p>
                    </td>
                  </tr>

                  {/* Footer Image Placeholder */}
                  <tr>
                    <td colSpan="2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-full h-fit bg-gray-200">
              <img src={imgFooter} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Receipt;
