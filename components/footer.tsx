"use client"

import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-green-800 via-emerald-800 to-teal-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-green-400" />
              <div>
                <h3 className="text-2xl font-bold">AgriGPT</h3>
                <p className="text-green-300 text-sm">Smart Farming Assistant</p>
              </div>
            </div>
            <p className="text-green-100 leading-relaxed">
              Empowering farmers with AI-powered crop health diagnosis, weather intelligence, and market insights for
              sustainable agriculture.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-green-300 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-green-300 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-green-300 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="h-6 w-6 text-green-300 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-300">Quick Links</h4>
            <ul className="space-y-2">
              {[
                "AI Chat Assistant",
                "Plant Disease Scanner",
                "Weather Intelligence",
                "Market Prices",
                "Agricultural News",
                "Government Schemes",
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="text-green-100 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-300">Services</h4>
            <ul className="space-y-2">
              {[
                "Crop Health Diagnosis",
                "Pest Identification",
                "Weather Forecasting",
                "Price Monitoring",
                "Expert Consultation",
                "Farming Tips",
              ].map((service) => (
                <li key={service}>
                  <a href="#" className="text-green-100 hover:text-white transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-300">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-400" />
                <span className="text-green-100">support@agrigpt.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-400" />
                <span className="text-green-100">+91 1800-123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-green-400" />
                <span className="text-green-100">New Delhi, India</span>
              </div>
            </div>

            {/* Languages */}
            <div className="mt-6">
              <h5 className="font-semibold mb-2 text-green-300">Available Languages</h5>
              <div className="flex flex-wrap gap-2">
                {["🇬🇧 EN", "🇮🇳 हिं", "🇮🇳 मरा", "🇮🇳 ગુજ", "🇮🇳 ਪੰਜ"].map((lang) => (
                  <span key={lang} className="text-xs bg-green-700 px-2 py-1 rounded text-green-100">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-green-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-green-200 text-sm mb-4 md:mb-0">
              © 2024 AgriGPT. All rights reserved. | Prototype for Deep-Shiva Agriculture LLM Project
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-green-200 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
