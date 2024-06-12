"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "../../app/authMiddleware";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();
  // const { authToken } = useAuth();

  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token !== null && token !== undefined) {
        setAuthToken(token);
      }
    }
  }, []);
  console.log("authToken", authToken)

  const [userData, setUserData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await axios.get(
          "http://localhost:3000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        const userId = profileResponse.data.id;

        const userResponse = await axios.get(
          `http://localhost:3000/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        const userData = {
          id: userResponse.data.id || "",
          first_name: userResponse.data.first_name || "",
          last_name: userResponse.data.last_name || "",
          email: userResponse.data.email || "",
          phone: userResponse.data.phone || "",
        };

        setUserData(userData);
      } catch (error) {
        console.error("Error fetching profile data:", error.response.data);
        // router.push("/signin");
      }
    };

    const checkAuthAndFetchProfile = async () => {
      if (!authToken) {
        // router.push("/signin");
      } else {
        await fetchProfileData();
      }
    };

    checkAuthAndFetchProfile();
  }, [authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted", userData);

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/users/${userData.id}`,
        {
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      console.log(response.data);
      setSuccessMessage("Your information has been updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Update Your Profile
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  Keep your information up-to-date
                </p>

                {successMessage && (
                  <div
                    className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-gray-800 dark:text-green-400"
                    role="alert"
                  >
                    <span className="font-medium">{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <label
                      htmlFor="firstName"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="Enter your first name"
                      value={userData.first_name}
                      onChange={handleChange}
                      className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="lastName"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Enter your last name"
                      value={userData.last_name}
                      onChange={handleChange}
                      className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={userData.email}
                      onChange={handleChange}
                      className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      disabled
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="phone"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={userData.phone}
                      onChange={handleChange}
                      className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  {/* Add more fields as needed */}
                  <div className="mb-6">
                    <button
                      className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                      type="submit"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>

                <p className="text-center text-base font-medium text-body-color">
                  Return to{" "}
                  <Link href="/" className="text-primary hover:underline">
                    Home
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="z-[-1 absolute left-0 top-0"></div>
      </section>
    </>
  );
};

export default ProfilePage;
