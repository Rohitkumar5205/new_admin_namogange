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
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
          <div>
            <h2 className="text-lg font-medium text-gray-800">Receipt</h2>
          </div>
          <button
            onClick={handlePrint}
            className="px-3 py-1 text-gray-400 border-2 border-gray-300 cursor-pointer bg-gray-100 hover:bg-gray-900 hover:text-white"
          >
            <FaPrint />
          </button>
        </div>
        <div className="bg-[#5DBED5] py-4 ">
          <div
            ref={printRef}
            className="max-w-[210mm] mx-auto bg-white shadow-lg  mt-4 "
          >
            <div className="px-6">
              {/* Header Image */}
              <img src={imgHead} alt="" className="w-full h-auto" />
            </div>
            {/* Main Content */}
            <div className="px-6 py-2">
              {/* Title */}
              <h1 className="text-left text-[#555555] font-bold text-lg  pb-1 ">
                Confirmation Letter for 15th Edition of Arogya Sangosthi Seminar
              </h1>
              <hr className="w-full opacity-90 py-2" />
              {/* Main Table */}
              <table className="w-full text-[13px] text-[#555555]">
                <tbody>
                  {/* Greeting and QR Section */}
                  <tr>
                    <td
                      className="align-top pb-4 leading-tight"
                      style={{ width: "70%" }}
                    >
                      <p className="mb-2 font-bold">Dear Dr Y.k Chauhan,</p>
                      <p className=" text-[15px] leading-tight font-sans ">
                        We are pleased to confirm your participation in the{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
                          15th Edition of the Arogya Sangosthi Seminar
                        </span>
                        , held alongside the{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
                          8th Edition of the International Health & Wellness
                          Expo
                        </span>{" "}
                        and the{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
                          2nd Edition of Agritech Innovate India
                        </span>
                        . This prestigious event serves as a platform to bring
                        together experts, exhibitors, and visitors from various
                        sectors of health, wellness, and agriculture.
                      </p>
                    </td>
                    <td
                      className="align-top  text-right leading-tight"
                      style={{ width: "30%" }}
                    >
                      {/* QR Code Placeholder */}
                      <div className="w-40 h-40 ml-10  ">
                        {" "}
                        <img src={imgQR} alt="" />
                      </div>
                      <p className="font-bold text-sm pr-11">AGS/15th/02/093</p>
                    </td>
                  </tr>

                  {/* Event Details */}
                  <tr>
                    <td colSpan="2" className="pb-1 leading-tight">
                      <p className="font-bold text-[18px] text-[#555555]">
                        Event Details :
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td
                      className="py-0.5 leading-tight"
                      style={{ width: "30%" }}
                    >
                      <span className="font-bold text-[#555555] text-[15px]">
                        Event Name
                      </span>
                      <span className="px-2 text-[14px]">
                        : 15th Edition of Arogya Sangosthi Seminar
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-0.5 leading-tight">
                      <span className="font-bold text-[#555555] text-[15px]">
                        Event Date
                      </span>
                      <span className="px-2 text-[14px]">: 12 Jul 2025</span>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="py-0.5 leading-tight">
                      <span className="font-bold text-[#555555] text-[15px]">
                        Event Venue
                      </span>
                      <span className="px-2 text-[14px]">
                        {" "}
                        : Hall No- 12 Pargati Maidan New Delhi-110001{" "}
                        <a href="">
                          <span className="text-blue-600 underline text-base ml-5">
                            Direction
                          </span>
                        </a>
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-0.5 leading-tight">
                      <span className="font-bold text-[#555555] text-[15px]">
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
                        <span className="font-bold text-[#555555] text-[15px]">
                          Note:
                        </span>{" "}
                        <span className="text-[15px]">
                          This pass is valid for the 15th edition of the Arogya
                          Sangosthi Seminar on
                        </span>{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
                          12 Jul 2025
                        </span>{" "}
                        <span className="text-[15px]">
                          and includes access to the exhibition area for
                        </span>{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
                          all three days
                        </span>
                        .
                      </p>
                    </td>
                  </tr>

                  {/* Payment Info */}
                  <tr>
                    <td colSpan="2" className="pb-3">
                      <p className=" text-[15px] leading-tight font-sans">
                        The total payment amount is{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
                          ₹ 700/-
                        </span>
                        . The payment has been successfully received, confirming
                        the completion of the transaction. The payment was made
                        through{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
                          Paytm
                        </span>
                        , ensuring a smooth and secure transfer. The transaction
                        number for this payment is{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
                          519132934247
                        </span>
                        , and the payment was completed on{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
                          10 Jul 2025
                        </span>
                        .
                      </p>
                    </td>
                  </tr>

                  {/* About Section */}
                  <tr>
                    <td colSpan="2">
                      <p className="font-bold text-[16px]">
                        About the 15th Edition of Arogya Sangosthi Seminar &
                        Expo:
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-2">
                      <p className=" text-[15px] leading-tight font-sans">
                        The{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
                          Arogya Sangosthi Seminar
                        </span>
                        , a key highlight of the{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
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
                      <p className=" text-[15px] leading-tight font-sans">
                        The expo will showcase a diverse range of products and
                        services in{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
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
                      <ul className="list-disc ml-6 text-[15px]">
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
                      <p className=" text-[15px] leading-tight font-sans">
                        This year's{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
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
                          <span className="font-bold text-[#555555] text-[15px]">
                            Globalizing Ayurveda
                          </span>{" "}
                          <span className="text-[15px]">
                            – Expanding Ayurveda's influence as a globally
                            recognized complementary and alternative medicine.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-bold text-[#555555] text-[15px]">
                            Ayurveda Meets Modern Science
                          </span>{" "}
                          <span className="text-[15px]">
                            – Integrating traditional wisdom with cutting-edge
                            medical research to enhance credibility and
                            efficacy.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-bold text-[#555555] text-[15px]">
                            Holistic Healthcare
                          </span>
                          <span className="text-[15px]">
                            {" "}
                            – Promoting a 360-degree wellness approach,
                            addressing physical, mental, and spiritual
                            well-being.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-bold text-[#555555] text-[15px]">
                            Evidence-Based Ayurveda
                          </span>{" "}
                          <span className="text-[15px]">
                            – Showcasing clinical trials, scientific studies,
                            and real-world case reports to validate Ayurvedic
                            treatments.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-bold text-[#555555] text-[15px]">
                            Sustainability & Medicinal Plants
                          </span>{" "}
                          <span className="text-[15px]">
                            – Advocating for ethical sourcing, conservation, and
                            responsible cultivation of Ayurvedic herbs.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-bold text-[#555555] text-[15px]">
                            Ayurveda for Lifestyle Disorders
                          </span>{" "}
                          <span className="text-[15px]">
                            – Offering time-tested solutions for diabetes,
                            hypertension, obesity, and mental health challenges.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-bold text-[#555555] text-[15px]">
                            Ayurveda & Pandemic Resilience
                          </span>{" "}
                          <span className="text-[15px]">
                            – Exploring Ayurveda's role in immune strengthening,
                            disease prevention, and post-pandemic recovery.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-bold text-[#555555] text-[15px]">
                            Tech-Driven Ayurveda
                          </span>{" "}
                          <span className="text-[15px]">
                            – Leveraging AI, telemedicine, and digital health to
                            modernize Ayurvedic diagnosis and treatment.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-bold text-[#555555] text-[15px]">
                            Regulations & Standardization
                          </span>{" "}
                          <span className="text-[15px]">
                            – Strengthening quality control, global compliance,
                            and standardization in Ayurvedic medicine.
                          </span>
                        </li>
                        <li className=" leading-tight">
                          <span className="font-bold text-[#555555] text-[15px]">
                            Ayurveda in Education & Research
                          </span>{" "}
                          <span className="text-[15px]">
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
                      <p className=" text-[15px] leading-tight font-sans">
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
                      <p className=" text-[15px] leading-tight font-sans">
                        <span className="font-bold text-[#555555] text-[15px]">
                          Note:
                        </span>{" "}
                        Book Your Stall for the 8th Edition of the International
                        Health & Wellness Expo. Be a part of this premier event
                        and showcase your brand to a diverse audience.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-2">
                      <p className=" text-[15px] leading-tight font-sans">
                        <span className="font-bold text-[#555555] text-[15px]">
                          How to Book? : Secure your stall by clicking the link
                          below and completing your registration:
                        </span>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-2">
                      <button className="bg-[#2DBDC7] text-white font-bold px-6 py-2 cursor-pointer">
                        Register for Expo Stall Booking
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-3">
                      <p className=" text-[15px] leading-tight font-sans">
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
                        <p className="font-bold">
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
                      <p className="font-bold text-[14px]">
                        How to Reach the Venue
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-2">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full shrink-0 mt-0.5">
                          <img src={imgMetro} alt="" />
                        </div>
                        <p className=" text-[15px] leading-tight font-sans">
                          <span className="font-bold text-[#555555] text-[15px]">
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
                        <p className=" text-[15px] leading-tight font-sans">
                          <span className="font-bold text-[#555555] text-[15px]">
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
                        <p className=" text-[15px] leading-tight font-sans">
                          <span className="font-bold text-[#555555] text-[15px]">
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
                      <p className=" text-[15px] leading-tight font-sans">
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
                          className="w-[400px] h-[561px]"
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
                          className="w-[400px] h-[561px]"
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Closing */}
                  <tr>
                    <td colSpan="2" className="pb-2">
                      <p className=" text-[15px] leading-tight font-sans">
                        We look forward to welcoming you to the{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
                          International Health & Wellness Expo, Agritech
                          Innovate India
                        </span>
                        , and the{" "}
                        <span className="font-bold text-[#555555] text-[15px]">
                          Arogya Sangosthi
                        </span>{" "}
                        Seminar. See you there!
                        <span className="inline-block ml-1">🌿</span>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-1 text-[15px]">
                      <p>Warm regards,</p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-1">
                      <p className="font-bold">Vijay Sharma</p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="pb-6 text-[15px]">
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
