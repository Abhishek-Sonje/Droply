"use client"
import { CloudUpload } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DroplyHero() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EEDD] overflow-hidden">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes expand {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes cloudFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes filesAppear {
          from {
            opacity: 0;
            transform: translate(-50%, -30%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes fileBounce {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-3px) scale(1.05);
          }
        }

        .float-bg {
          animation: float 20s ease-in-out infinite;
        }

        .slide-left {
          animation: slideInLeft 1s ease-out;
        }

        .slide-right {
          animation: slideInRight 1s ease-out;
        }

        .highlight::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #7ae2cf, #077a7d);
          animation: expand 2s ease-out 0.5s both;
        }

        .cloud-main {
          animation: cloudFloat 6s ease-in-out infinite;
        }

        .cloud-small-1 {
          animation: cloudFloat 6s ease-in-out infinite;
          animation-delay: -2s;
        }

        .cloud-small-2 {
          animation: cloudFloat 6s ease-in-out infinite;
          animation-delay: -4s;
        }

        .files-container {
          animation: filesAppear 2s ease-out 1s both;
        }

        .file-bounce {
          animation: fileBounce 3s ease-in-out infinite;
        }

        .file-bounce:nth-child(2) {
          animation-delay: -0.5s;
        }
        .file-bounce:nth-child(3) {
          animation-delay: -1s;
        }
        .file-bounce:nth-child(4) {
          animation-delay: -1.5s;
        }
        .file-bounce:nth-child(5) {
          animation-delay: -2s;
        }
        .file-bounce:nth-child(6) {
          animation-delay: -2.5s;
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#F5EEDD]/98 backdrop-blur-lg shadow-lg shadow-[#06202B]/10"
            : "bg-[#F5EEDD]/95 backdrop-blur-sm"
        }`}
      >
        <div className="w-full max-w-screen-2xl mx-auto flex justify-between items-center py-4 px-8 lg:px-16">
          <a
            href="#"
            className="text-2xl font-bold text-[#077A7D] flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <span className="text-2xl"><CloudUpload width={35} height={35} /></span>
            Droply
          </a>

          <div className="flex gap-4 items-center">
            <Link
              href="/sign-in"
              className="px-6 py-3 text-[#077A7D] border-2 border-[#077A7D] rounded-full font-semibold hover:bg-[#077A7D] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#077A7D]/30 transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-3 bg-gradient-to-r from-[#7AE2CF] to-[#077A7D] text-white rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7AE2CF]/40 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative bg-gradient-to-br from-[#F5EEDD] to-[#7AE2CF]/10 overflow-hidden">
        {/* Floating Background Element */}
        <div className="absolute top-[-50%] right-[-20%] w-[60%] h-[200%] bg-gradient-to-br from-transparent to-[#7AE2CF]/10 transform -rotate-12 float-bg"></div>

        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Hero Content */}
          <div className="slide-left">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-[#06202B] mb-6 leading-tight">
              Your files,{" "}
              <span className="text-[#077A7D] relative highlight">
                everywhere
              </span>
            </h1>

            <p className="text-xl text-[#06202B]/80 mb-10 leading-relaxed">
              Store, sync, and share your files with ease. Droply gives you
              secure cloud storage that works seamlessly across all your
              devices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="px-8 py-4 bg-gradient-to-r from-[#7AE2CF] to-[#077A7D] text-white rounded-full font-semibold text-lg hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#7AE2CF]/40 transition-all duration-300"
              >
                Start Free Trial
              </Link>
              <Link
                href="/sign-in"
                className="px-8 py-4 text-[#077A7D] border-2 border-[#077A7D] rounded-full font-semibold text-lg hover:bg-[#077A7D] hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-[#077A7D]/30 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex justify-center items-center slide-right">
            <div className="relative w-96 h-72">
              {/* Main Cloud */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-28 bg-gradient-to-br from-[#7AE2CF] to-[#077A7D] rounded-full cloud-main shadow-2xl shadow-[#077A7D]/20"></div>

              {/* Small Clouds */}
              <div className="absolute top-[20%] left-[20%] w-20 h-12 bg-gradient-to-br from-[#7AE2CF] to-[#077A7D] rounded-full cloud-small-1 opacity-70"></div>
              <div className="absolute top-[70%] right-[20%] w-14 h-8 bg-gradient-to-br from-[#7AE2CF] to-[#077A7D] rounded-full cloud-small-2 opacity-50"></div>

              {/* Files */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-3 gap-2 files-container opacity-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-7 bg-white rounded shadow-lg file-bounce relative"
                  >
                    {/* File Content Lines */}
                    <div className="absolute top-1 left-1 right-1 h-0.5 bg-[#7AE2CF] rounded"></div>
                    <div className="absolute top-2 left-1 right-2 h-px bg-[#06202B]/20 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
