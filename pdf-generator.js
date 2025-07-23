const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

class PDFGenerator {
  constructor() {
    this.ensureDirectories();
  }

  ensureDirectories() {
    const pdfDir = path.join(__dirname, "public", "pdfs");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
  }

  async generateInvoice(invoice, order, customer) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const filename = `invoice-${invoice.id}.pdf`;
        const filepath = path.join(__dirname, "public", "pdfs", filename);

        // Pipe the PDF to a file
        doc.pipe(fs.createWriteStream(filepath));

        // Header with branding
        this.addHeader(doc);

        // Company Information
        this.addCompanyInfo(doc);

        // Invoice Information
        this.addInvoiceInfo(doc, invoice, customer);

        // Items Table
        const tableEndY = this.addItemsTable(doc, order.items);

        // Totals
        const totalsEndY = this.addTotals(doc, order, tableEndY);

        // Payment Information
        const paymentEndY = this.addPaymentInfo(doc, order.paymentMethod || 'cash', totalsEndY);

        // Footer with complete branding
        this.addFooter(doc, paymentEndY);

        doc.end();

        doc.on("end", () => {
          resolve({
            filename,
            filepath,
            url: `/pdfs/${filename}`,
          });
        });

        doc.on("error", reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  addHeader(doc) {
    // Purple gradient header background
    doc.rect(0, 0, 612, 120).fillAndStroke('#6a1b9a', '#6a1b9a');

    // Company Logo Area with enhanced branding
    doc.fontSize(28).fillColor("#ffffff").text("🏢", 50, 35);

    // Company Name with enhanced styling
    doc.fontSize(24).fillColor("#ffffff").font('Helvetica-Bold').text("MelHad Investment", 90, 35);

    // Tagline
    doc.fontSize(12).fillColor("#e1bee7").font('Helvetica').text("Professional Printing & Digital Services", 90, 65);
    doc.fontSize(10).fillColor("#e1bee7").text("Excellence in Every Print", 90, 82);

    // Invoice Title with modern styling
    doc.fontSize(28).fillColor("#ffffff").font('Helvetica-Bold').text("INVOICE", 420, 35);
    doc.fontSize(10).fillColor("#e1bee7").font('Helvetica').text("Tax Invoice / Receipt", 445, 70);

    // Reset color for rest of document
    doc.fillColor('#333');
  }

  addCompanyInfo(doc) {
    const startY = 140;

    // Company section header
    doc.fontSize(14).fillColor("#6a1b9a").font('Helvetica-Bold')
       .text("FROM:", 50, startY);

    // Company name with enhanced styling
    doc.fontSize(16).fillColor("#333").font('Helvetica-Bold')
       .text("MelHad Investment", 50, startY + 20, { width: 250 });

    // Business details
    doc.fontSize(11).fillColor("#666").font('Helvetica')
       .text("5 Naimbana Street", 50, startY + 45)
       .text("Freetown, Sierra Leone", 50, startY + 60)
       .text("West Africa", 50, startY + 75)
       .text("Phone: +232 78 475 680", 50, startY + 95)
       .text("WhatsApp: +232 78 475 680", 50, startY + 110)
       .text("Email: info@melhadinvestment.com", 50, startY + 125)
       .text("Website: www.melhadinvestment.com", 50, startY + 140);

    // Business registration info
    doc.fontSize(9).fillColor("#999")
       .text("Business Registration: SL-REG-2023-001", 50, startY + 160)
       .text("Tax ID: SL-TAX-789456123", 50, startY + 175);
  }

  addInvoiceInfo(doc, invoice, customer) {
    const startY = 140;
    const rightX = 350;

    // Invoice Details with enhanced styling
    doc.fontSize(14).fillColor("#6a1b9a").font('Helvetica-Bold')
       .text("INVOICE DETAILS:", rightX, startY);

    // Create a nice box for invoice details
    doc.rect(rightX - 10, startY + 20, 200, 80).fillAndStroke('#f8f9fa', '#e9ecef');

    doc.fontSize(11).fillColor("#333").font('Helvetica-Bold')
       .text("Invoice #:", rightX, startY + 30)
       .fillColor("#6a1b9a")
       .text(invoice.id, rightX + 70, startY + 30);

    doc.fillColor("#333").font('Helvetica-Bold')
       .text("Date:", rightX, startY + 45)
       .fillColor("#666").font('Helvetica')
       .text(new Date(invoice.generatedAt).toLocaleDateString('en-SL'), rightX + 70, startY + 45);

    doc.fillColor("#333").font('Helvetica-Bold')
       .text("Order ID:", rightX, startY + 60)
       .fillColor("#666").font('Helvetica')
       .text(invoice.orderId, rightX + 70, startY + 60);

    doc.fillColor("#333").font('Helvetica-Bold')
       .text("Currency:", rightX, startY + 75)
       .fillColor("#666").font('Helvetica')
       .text("Sierra Leone Leone (Le)", rightX + 70, startY + 75);

    // Customer Information with enhanced styling
    doc.fontSize(14).fillColor("#6a1b9a").font('Helvetica-Bold')
       .text("BILL TO:", rightX, startY + 120);

    // Customer details box
    doc.rect(rightX - 10, startY + 140, 200, 100).fillAndStroke('#f0f8ff', '#d1ecf1');

    doc.fontSize(12).fillColor("#333").font('Helvetica-Bold')
       .text(customer.customerName || invoice.customerName, rightX, startY + 150, { width: 180 });

    doc.fontSize(10).fillColor("#666").font('Helvetica')
       .text(customer.customerPhone || "Phone not provided", rightX, startY + 170);

    if (customer.customerEmail) {
      doc.text(customer.customerEmail, rightX, startY + 185);
    }
    if (customer.customerAddress) {
      doc.text(customer.customerAddress, rightX, startY + 200, { width: 180 });
    } else {
      doc.text("Freetown, Sierra Leone", rightX, startY + 200);
    }
  }

  addItemsTable(doc, items) {
    const tableTop = 380;
    const itemCodeX = 50;
    const descriptionX = 150;
    const quantityX = 350;
    const priceX = 420;
    const amountX = 490;

    // Table title
    doc.fontSize(14).fillColor("#6a1b9a").font('Helvetica-Bold')
       .text("SERVICES PROVIDED:", 50, tableTop - 25);

    // Table Header with background
    doc.rect(itemCodeX - 5, tableTop - 5, 510, 25).fillAndStroke('#6a1b9a', '#6a1b9a');

    doc.fontSize(11).fillColor("#ffffff").font('Helvetica-Bold')
       .text("Service", itemCodeX, tableTop + 5)
       .text("Description", descriptionX, tableTop + 5)
       .text("Qty", quantityX, tableTop + 5)
       .text("Unit Price (Le)", priceX - 10, tableTop + 5)
       .text("Total (Le)", amountX, tableTop + 5);

    // Table Items with alternating row colors
    let currentY = tableTop + 30;

    items.forEach((item, index) => {
      // Alternating row background
      if (index % 2 === 0) {
        doc.rect(itemCodeX - 5, currentY - 3, 510, 22).fillAndStroke('#f8f9fa', '#f8f9fa');
      }

      doc.fontSize(10).fillColor("#333").font('Helvetica')
         .text(item.name.substring(0, 12) + (item.name.length > 12 ? "..." : ""), itemCodeX, currentY, { width: 90 })
         .text(item.name, descriptionX, currentY, { width: 180 })
         .text(item.quantity.toString(), quantityX + 10, currentY)
         .text(`Le ${this.formatCurrency(item.price)}`, priceX - 10, currentY)
         .text(`Le ${this.formatCurrency(item.total || item.price * item.quantity)}`, amountX, currentY);

      currentY += 25;
    });

    // Add bottom border
    doc.moveTo(itemCodeX - 5, currentY + 5)
       .lineTo(amountX + 50, currentY + 5)
       .strokeColor("#6a1b9a")
       .lineWidth(2)
       .stroke();

    return currentY + 20;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-SL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  addTotals(doc, order, currentY) {
    const totalsX = 350;
    let startY = currentY + 20;

    // Totals box background
    doc.rect(totalsX - 10, startY - 10, 200, 120).fillAndStroke('#f0f8ff', '#d1ecf1');

    // Subtotal
    doc.fontSize(11).fillColor("#666").font('Helvetica')
       .text("Subtotal:", totalsX, startY)
       .fillColor("#333")
       .text(`Le ${this.formatCurrency(order.subtotal)}`, totalsX + 100, startY);

    // Delivery Fee (if applicable)
    if (order.deliveryFee && order.deliveryFee > 0) {
      startY += 20;
      doc.fillColor("#666")
         .text("Delivery Fee:", totalsX, startY)
         .fillColor("#333")
         .text(`Le ${this.formatCurrency(order.deliveryFee)}`, totalsX + 100, startY);
    }

    // Tax (if applicable)
    if (order.tax && order.tax > 0) {
      startY += 20;
      doc.fillColor("#666")
         .text("Tax (8%):", totalsX, startY)
         .fillColor("#333")
         .text(`Le ${this.formatCurrency(order.tax)}`, totalsX + 100, startY);
    }

    // Total with emphasis
    startY += 30;
    doc.rect(totalsX - 5, startY - 5, 180, 30).fillAndStroke('#6a1b9a', '#6a1b9a');

    doc.fontSize(14).fillColor("#ffffff").font('Helvetica-Bold')
       .text("TOTAL:", totalsX, startY + 5)
       .fontSize(16)
       .text(`Le ${this.formatCurrency(order.total)}`, totalsX + 80, startY + 5);

    // Add currency note
    doc.fontSize(9).fillColor("#999").font('Helvetica')
       .text("All amounts in Sierra Leone Leone (Le)", totalsX, startY + 40);

    return startY + 60;
  }

  addPaymentInfo(doc, paymentMethod, startY) {
    const paymentY = startY + 20;

    // Payment info header
    doc.fontSize(14).fillColor("#6a1b9a").font('Helvetica-Bold')
       .text("PAYMENT INFORMATION:", 50, paymentY);

    // Payment info box
    doc.rect(45, paymentY + 20, 250, 80).fillAndStroke('#e8f5e8', '#c3e6c3');

    doc.fontSize(11).fillColor("#333").font('Helvetica')
       .text(`Payment Method: ${this.formatPaymentMethod(paymentMethod)}`, 50, paymentY + 35)
       .text("Status: PAID IN FULL", 50, paymentY + 50)
       .text(`Payment Date: ${new Date().toLocaleDateString('en-SL')}`, 50, paymentY + 65);

    doc.fontSize(12).fillColor("#28a745").font('Helvetica-Bold')
       .text("✓ PAYMENT CONFIRMED", 50, paymentY + 80);

    return paymentY + 120;
  }

  formatPaymentMethod(method) {
    const methods = {
      'orange-money': 'Orange Money',
      'afrimoney': 'Afrimoney',
      'bank-transfer': 'Bank Transfer',
      'cash': 'Cash Payment',
      'card': 'Card Payment'
    };
    return methods[method] || method.charAt(0).toUpperCase() + method.slice(1);
  }

  addFooter(doc, startY) {
    const footerY = Math.max(startY + 40, 650);

    // Purple footer background
    doc.rect(0, footerY - 20, 612, 120).fillAndStroke('#6a1b9a', '#6a1b9a');

    // Thank you message
    doc.fontSize(16).fillColor("#ffffff").font('Helvetica-Bold')
       .text("Thank You for Choosing MelHad Investment!", 50, footerY);

    doc.fontSize(11).fillColor("#e1bee7").font('Helvetica')
       .text("Your trusted partner for all printing and digital services in Sierra Leone.", 50, footerY + 25);

    // Contact information in footer
    doc.fontSize(10).fillColor("#ffffff")
       .text("📍 5 Naimbana Street, Freetown, Sierra Leone", 50, footerY + 45)
       .text("📞 +232 78 475 680  |  📱 WhatsApp: +232 78 475 680", 50, footerY + 60)
       .text("📧 info@melhadinvestment.com  |  🌐 www.melhadinvestment.com", 50, footerY + 75);

    // QR Code area placeholder
    doc.fontSize(9).fillColor("#e1bee7")
       .text("Scan QR code to share this invoice:", 420, footerY + 45);

    // QR code placeholder (would be actual QR in production)
    doc.rect(420, footerY + 55, 40, 40).fillAndStroke('#ffffff', '#ffffff');
    doc.fontSize(8).fillColor("#6a1b9a")
       .text("QR", 435, footerY + 72);

    // Social sharing text
    doc.fontSize(8).fillColor("#e1bee7")
       .text("Share via WhatsApp, Email, or Download", 470, footerY + 70);
  }
}

module.exports = PDFGenerator;
