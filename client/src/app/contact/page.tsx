import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page | Exam Generator",
  description: "This is Contact Page for Exam Generator",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Page"
        description="Get in touch with us! We're here to help you with any questions or concerns you may have."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
