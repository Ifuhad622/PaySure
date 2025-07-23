const twilio = require("twilio");

class WhatsAppService {
  constructor() {
    // Initialize Twilio client
    // In production, these should be environment variables
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || "demo_account_sid";
    this.authToken = process.env.TWILIO_AUTH_TOKEN || "demo_auth_token";
    this.whatsappNumber =
      process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

    if (
      this.accountSid !== "demo_account_sid" &&
      this.authToken !== "demo_auth_token"
    ) {
      this.client = twilio(this.accountSid, this.authToken);
    } else {
      console.log("📱 WhatsApp Service running in demo mode");
    }
  }

  async sendPaymentConfirmation(customerPhone, order, invoice) {
    const message = this.createPaymentConfirmationMessage(order, invoice);
    return await this.sendMessage(customerPhone, message);
  }

  async sendOrderStatusUpdate(customerPhone, order, status) {
    const message = this.createStatusUpdateMessage(order, status);
    return await this.sendMessage(customerPhone, message);
  }

  async sendInvoiceReminder(customerPhone, invoice) {
    const message = this.createInvoiceReminderMessage(invoice);
    return await this.sendMessage(customerPhone, message);
  }

  async sendWelcomeMessage(customerPhone, customerName) {
    const message = this.createWelcomeMessage(customerName);
    return await this.sendMessage(customerPhone, message);
  }

  createPaymentConfirmationMessage(order, invoice) {
    return `🎉 *Payment Confirmed - MelHad Investment*

Dear ${order.customerName},

Thank you for your payment! Your order has been processed successfully.

📋 *Order Details:*
• Order ID: ${order.id}
• Invoice ID: ${invoice.id}
• Amount Paid: $${order.total.toFixed(2)}
• Payment Method: ${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}

📦 *Services Ordered:*
${order.items.map((item) => `• ${item.name} (${item.quantity} ${item.unit}${item.quantity > 1 ? "s" : ""})`).join("\n")}

⏰ *What's Next:*
Your print job is now in our queue and will be processed within 24 hours. We'll send you another update when your order is ready for pickup.

📄 Your invoice has been generated and is available for download.

🏢 *MelHad Investment*
Professional Printing Services
📞 (555) 123-4567
📧 info@melhadinvestment.com

Thank you for choosing MelHad Investment! 🙏`;
  }

  createStatusUpdateMessage(order, status) {
    const statusEmojis = {
      processing: "⚙️",
      printing: "🖨️",
      ready: "✅",
      completed: "🎉",
      cancelled: "❌",
    };

    const statusMessages = {
      processing: "Your order is being processed",
      printing: "Your order is currently being printed",
      ready: "Your order is ready for pickup!",
      completed: "Your order has been completed",
      cancelled: "Your order has been cancelled",
    };

    return `${statusEmojis[status] || "📋"} *Order Update - MelHad Investment*

Hello ${order.customerName},

${statusMessages[status] || "Your order status has been updated"}.

📋 *Order Details:*
• Order ID: ${order.id}
• Status: ${status.toUpperCase()}
• Total: $${order.total.toFixed(2)}

${
  status === "ready"
    ? `🏪 *Pickup Information:*
Please visit our store to collect your order:
• Address: 123 Business Street, City, State 12345
• Hours: Mon-Fri 9AM-6PM, Sat 9AM-4PM
• Bring this message and a valid ID

`
    : ""
}🏢 *MelHad Investment*
📞 (555) 123-4567`;
  }

  createInvoiceReminderMessage(invoice) {
    return `📄 *Invoice Reminder - MelHad Investment*

Hello ${invoice.customerName},

This is a friendly reminder about your invoice.

💰 *Invoice Details:*
• Invoice ID: ${invoice.id}
• Amount: $${invoice.total.toFixed(2)}
• Status: ${invoice.status.toUpperCase()}
• Date: ${new Date(invoice.generatedAt).toLocaleDateString()}

${
  invoice.status === "pending"
    ? `💳 *Payment Options:*
• Visit our store for cash/card payment
• Call us at (555) 123-4567 to pay over phone
• Online payment available at our website

`
    : ""
}🏢 *MelHad Investment*
📞 (555) 123-4567
📧 info@melhadinvestment.com`;
  }

  createWelcomeMessage(customerName) {
    return `🎉 *Welcome to MelHad Investment!*

Hello ${customerName},

Thank you for choosing MelHad Investment for your printing needs!

🖨️ *Our Services:*
• Document Printing (B&W & Color)
• Photo Printing
• Business Cards
• Flyers & Marketing Materials
• Banners
• Custom T-Shirt Printing

✨ *Why Choose Us:*
• Professional quality guaranteed
• Fast turnaround times
• Competitive pricing
• Excellent customer service

📱 You'll receive automatic updates via WhatsApp for all your orders.

🏢 *Contact Us:*
📞 (555) 123-4567
📧 info@melhadinvestment.com
🌐 www.melhadinvestment.com
📍 123 Business Street, City, State 12345

Welcome aboard! 🙏`;
  }

  async sendMessage(customerPhone, message) {
    try {
      // Format phone number for WhatsApp
      const formattedPhone = this.formatPhoneNumber(customerPhone);

      if (this.client) {
        // Send actual WhatsApp message via Twilio
        const result = await this.client.messages.create({
          from: this.whatsappNumber,
          to: `whatsapp:${formattedPhone}`,
          body: message,
        });

        console.log(
          `📱 WhatsApp message sent to ${formattedPhone}: ${result.sid}`,
        );
        return {
          success: true,
          messageId: result.sid,
          to: formattedPhone,
        };
      } else {
        // Demo mode - log message
        console.log(
          "📱 [DEMO] WhatsApp message would be sent to:",
          formattedPhone,
        );
        console.log("📱 [DEMO] Message content:");
        console.log(message);
        console.log("📱 [DEMO] ─────────────────────────────────────");

        return {
          success: true,
          messageId: "demo_" + Date.now(),
          to: formattedPhone,
          demo: true,
        };
      }
    } catch (error) {
      console.error("❌ WhatsApp message failed:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  formatPhoneNumber(phone) {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, "");

    // Add country code if not present
    if (cleaned.length === 10) {
      cleaned = "1" + cleaned; // Add US country code
    }

    // Format as +1234567890
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return "+" + cleaned;
    }

    // Return as-is if already properly formatted
    return cleaned.startsWith("+") ? cleaned : "+" + cleaned;
  }

  // Utility method to set up WhatsApp webhook (for receiving messages)
  setupWebhook(app) {
    app.post("/webhook/whatsapp", (req, res) => {
      const { Body, From, To } = req.body;

      console.log("📱 Received WhatsApp message:");
      console.log(`From: ${From}`);
      console.log(`To: ${To}`);
      console.log(`Message: ${Body}`);

      // Handle incoming messages here
      // You can implement auto-responses, order status checks, etc.

      res.status(200).send("OK");
    });
  }
}

module.exports = WhatsAppService;
