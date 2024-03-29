/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useSelector } from "react-redux";

import { Auth2FAStep1 } from "./Auth2FAStep1";
import { Auth2FAStep2 } from "./Auth2FAStep2";
import { Auth2FAStep3 } from "./Auth2FAStep3";
import { Auth2FAStep4 } from "./Auth2FAStep4";

import * as OTPAuth from "otpauth";
import { toast } from "react-toastify";
import { auth2FA } from "../../services/Firebase/FirebaseProfile";
import { getUsers } from "../../services/Firebase/FirebaseAdmin";

import { generateBackupCode, generateSecretKey } from "./Auth2FAUtils/helpers";
import DesktopStepper from "./Auth2FAUtils/DesktopStepper";
import MobilStepper from "./Auth2FAUtils/MobilStepper";

import {
  encryptData,
  decryptData,
} from "./Auth2FAUtils/LocalStorageEncryptAndDecrypt";

const steps = [
  "Uygulama Kurulumu",
  "Kimlik Doğrulama",
  "Doğrulayın",
  "Yedek Anahtar",
];

export default function Auth2FASetup() {
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [authCheck, setAuthCheck] = useState(false);

  const [totps, setTotps] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [secretKey, setSecretKey] = useState(generateSecretKey());
  const [backupCode, setBackupCode] = useState(generateBackupCode());

  let totp = useMemo(
    () =>
      new OTPAuth.TOTP({
        issuer: "CryptoXChain",
        label: `${user.email || user.displayName}`,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secretKey,
      }),
    [secretKey, user]
  );

  useEffect(() => {
    async function fetchUsers() {
      const res = await getUsers();
      setUsers(res);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const currentUser = users.find((u) => u.id === user.uid);
    if (currentUser && currentUser.auth2fa) {
      setAuthCheck(true);
    } else {
      setAuthCheck(false);
    }
  }, [users, user.uid]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let token = totp.generate();
      let uri = totp.toString();

      setGeneratedCode(token);
      setTotps(OTPAuth.URI.parse(uri));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [totp]);

  function handleVerification(data) {
    const currentCode = totp.generate();

    if (data === currentCode) {
      const ciphertextFromStorage = localStorage.getItem("auth2faCheck");
      let auth2faCheckData = decryptData(ciphertextFromStorage);

      if (!auth2faCheckData) {
        // 'auth2faCheck' verisi bulunamadı, yeni bir değer oluştur
        auth2faCheckData = {
          auth: true,
          status: "verified",
        };
      } else {
        // Durumu güncelle
        auth2faCheckData.auth = true;
        auth2faCheckData.status = "verified";
      }

      // Güncellenen veriyi şifrele ve LocalStorage'a geri kaydet
      const ciphertext = encryptData(auth2faCheckData);
      localStorage.setItem("auth2faCheck", ciphertext);

      toast.success("Doğrulama Başarılı");

      handleNext();
      handleAuthComplete();
    } else {
      toast.error("Doğrulama Başarısız");
    }
  }

  const handleAuthComplete = () => {
    const currentUser = users.find((u) => u.id === user.uid);
    auth2FA(currentUser.id, secretKey, backupCode);
    toast.success("2 Adımlı Doğrulama Başarıyla Aktif Edildi");
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className=" flex justify-center mt-10 ">
      <div className=" w-full max-w-4xl">
        {!authCheck ? (
          <Box>
            <h1 className="text-3xl font-bold text-center mb-4">
              2 Adımlı Doğrulama
            </h1>
            <div className="sm:hidden ml-5 text-xs">
              {/* mobilde */}
              <MobilStepper activeStep={activeStep} steps={steps} />
            </div>
            <div className=" hidden sm:block">
              {/* masaüstünde */}
              <DesktopStepper activeStep={activeStep} steps={steps} />
            </div>

            {activeStep === 0 && <Auth2FAStep1 />}
            {activeStep === 1 && (
              <Auth2FAStep2 totps={totps} secretKey={secretKey} />
            )}
            {activeStep === 2 && (
              <Auth2FAStep3 handleVerification={handleVerification} />
            )}
            {activeStep === 3 && <Auth2FAStep4 />}

            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  Kurulum tamamlandı.
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  {
                    <Button
                      color="inherit"
                      disabled={activeStep === 0 || activeStep === 3}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Geri
                    </Button>
                  }
                  {
                    <Button
                      color="inherit"
                      disabled={activeStep === 3 || activeStep === 4}
                      href="../settings"
                    >
                      İptal
                    </Button>
                  }
                  <Box sx={{ flex: "1 1 auto" }} />

                  <Button onClick={handleNext} disabled={activeStep === 2}>
                    {activeStep === steps.length - 1 ? "Bitir" : "Sonraki"}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>
        ) : (
          <>
            <Auth2FAStep4 backupCode={backupCode} />
          </>
        )}
      </div>
    </div>
  );
}
