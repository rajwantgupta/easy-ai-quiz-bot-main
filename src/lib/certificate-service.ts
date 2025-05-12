import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Initialize Twilio client for WhatsApp
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export interface CertificateData {
  candidateName: string;
  quizTitle: string;
  score: number;
  passed: boolean;
  completedAt: string;
  certificateId: string;
}

export const generateCertificatePDF = async (data: CertificateData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add certificate design
      doc
        .font('Helvetica-Bold')
        .fontSize(40)
        .text('Certificate of Completion', { align: 'center' })
        .moveDown()
        .fontSize(25)
        .text('This is to certify that', { align: 'center' })
        .moveDown()
        .fontSize(30)
        .text(data.candidateName, { align: 'center' })
        .moveDown()
        .fontSize(20)
        .text(`has successfully completed the ${data.quizTitle}`, { align: 'center' })
        .moveDown()
        .text(`with a score of ${data.score}%`, { align: 'center' })
        .moveDown()
        .fontSize(15)
        .text(`Certificate ID: ${data.certificateId}`, { align: 'center' })
        .moveDown()
        .text(`Issued on: ${new Date(data.completedAt).toLocaleDateString()}`, { align: 'center' });

      // Add border
      doc.rect(50, 50, doc.page.width - 100, doc.page.height - 100).stroke();

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export const sendCertificateEmail = async (
  email: string,
  certificateData: CertificateData
): Promise<void> => {
  try {
    const pdfBuffer = await generateCertificatePDF(certificateData);

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Certificate of Completion - ${certificateData.quizTitle}`,
      text: `Dear ${certificateData.candidateName},\n\nCongratulations on completing the ${certificateData.quizTitle}! Please find your certificate attached.\n\nBest regards,\nEASY AI Quiz Team`,
      attachments: [
        {
          filename: `certificate_${certificateData.certificateId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  } catch (error) {
    console.error('Error sending certificate email:', error);
    throw error;
  }
};

export const sendCertificateWhatsApp = async (
  phoneNumber: string,
  certificateData: CertificateData
): Promise<void> => {
  try {
    const pdfBuffer = await generateCertificatePDF(certificateData);
    const pdfBase64 = pdfBuffer.toString('base64');

    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phoneNumber}`,
      body: `Congratulations ${certificateData.candidateName}! You have successfully completed the ${certificateData.quizTitle} with a score of ${certificateData.score}%. Your certificate is attached.`,
      mediaUrl: [`data:application/pdf;base64,${pdfBase64}`],
    });
  } catch (error) {
    console.error('Error sending certificate via WhatsApp:', error);
    throw error;
  }
}; 