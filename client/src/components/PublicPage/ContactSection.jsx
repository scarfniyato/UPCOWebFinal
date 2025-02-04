import { Mail, Phone, MapPin } from "lucide-react";
import CustomButton from "../CustomButton.jsx";
import UPCO_logo from '../../../src/assets/UPCO_logo.png';
import emailIcon from '../../../src/assets/email-icon.png';

export default function ContactSection() {
  return (
    <footer id="contact" className="bg-dark text-white py-28 mt-20">
      <div className=" mx-32 flex flex-col lg:flex-row items-center gap-14">
        {/* Logo Section */}
        <div className="w-full lg:w-1/4 flex justify-center">
          <img src={UPCO_logo} alt="University Logo" className="w-60 h-auto" />
        </div>

        {/* Contact Information */}
        <div className="w-full lg:w-1/4">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          <div className="space-y-6 ml-3">
            <div className="flex items-center gap-3">
              <Mail className="text-white" />
              <div>
                <p className="text-xs">Email:</p>
                <h5 className="font-semibold">pco@cvsu.edu.ph</h5>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-white" />
              <div>
                <p className="text-xs">Phone:</p>
                <h5 className="font-semibold">0997 364 2045</h5>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-white" />
              <div>
                <p className="text-xs">Location:</p>
                <h5 className="font-semibold">CvSU-Main Campus</h5>
              </div>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="hidden lg:block h-64 border-l-2 border-white"></div>

        {/* Call to Action */}
        <div className="w-full lg:w-2/5 flex flex-col items-center text-center">
          <h2 className="text-base font-bold mb-4">Have a question or feedback? Reach out to us</h2>
          <img className="mb-4" src={emailIcon} alt="Email Icon" />
          <CustomButton onPress={() => window.location.href = "mailto:pco@cvsu.edu.ph"}>
            Email Us
          </CustomButton>
        </div>
      </div>
    </footer>



  );
}
