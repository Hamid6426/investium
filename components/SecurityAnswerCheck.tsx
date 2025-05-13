"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import SecurityAnswerModal from "@/components/SecurityAnswerModal"; // Your modal component

const SecurityAnswerCheck = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      // Decode the token
      interface DecodedToken {
        isSecured: boolean | null;
      }

      const decoded: DecodedToken = jwtDecode<DecodedToken>(storedToken);
      // If securityAnswer is null, empty string or invalid, show the modal to set the answer
      if (decoded.isSecured === false) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    }
  }, []);

  return (
    <>
      {showModal && (
        <SecurityAnswerModal
          token={localStorage.getItem("token") || ""}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default SecurityAnswerCheck;
