import type { Registration } from "@/types/arise";

export async function queueEmailConfirmation(_registration: Registration) {
  return { queued: false, reason: "Email confirmations are prepared for future activation." };
}

export async function queueWhatsAppConfirmation(_registration: Registration) {
  return { queued: false, reason: "WhatsApp confirmations are prepared for future activation." };
}

export async function createQrTicket(_registration: Registration) {
  return { created: false, reason: "QR code tickets are prepared for future activation." };
}
