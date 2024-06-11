"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const ConfirmEmailPage: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      confirmEmail(token);
    }
  }, []);

  const confirmEmail = async (token: string) => {
    try {
      const response = await axios.post<{ message: string }>(
        "http://localhost:3000/api/auth/confirmEmail",
        { token },
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        "Email confirmation failed. The token may be invalid or expired.",
      );
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px]">
                <div className=" mb-4 flex justify-center text-center">
                  <Image
                    src="/images/email/confirmed.png"
                    alt="Confirmation email"
                    width={150}
                    height={150}
                    style={{ width: "100px", height: "100px" }} // Adjust style as needed
                  />
                </div>
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  confirmation email
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConfirmEmailPage;
