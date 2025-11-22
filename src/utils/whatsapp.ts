export interface WhatsAppSendOptions {
  credentials: any;
  to: string;
  body: string;
  templateId?: string | null;
}

export async function sendWhatsApp(options: WhatsAppSendOptions) {
  const { to, body, templateId } = options;
  console.log('Sending WhatsApp message', { to, body, templateId });
  // TODO: Integrate with actual provider
  return { id: 'mock-message-id', to, body };
}
