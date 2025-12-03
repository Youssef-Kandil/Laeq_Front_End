"use client";

import { FaWhatsapp } from "react-icons/fa";

interface WhatsAppButtonProps {
  phone: string; // رقم الهاتف بصيغة دولية مثل 201234567890+
  message?: string; // رسالة اختيارية تضاف للرابط
}

export default function WhatsAppButton({ phone, message = "" }: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/${phone}${message ? `?text=${encodedMessage}` : ""}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed
        bottom-6 right-6
        bg-[#25D366]
        hover:bg-[#1ebe5d]
        text-white
        p-4
        rounded-full
        shadow-lg
        transition
        duration-300
        flex
        items-center
        justify-center
        z-50
      "
    >
      <FaWhatsapp className="text-3xl" />
    </a>
  );
}
