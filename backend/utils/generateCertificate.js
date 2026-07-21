const PDFDocument = require('pdfkit');
const { cloudinary } = require('../config/cloudinary');
const { Readable } = require('stream');

const generateCertificate = async ({ studentName, courseName, instructorName, certificateId, issuedAt }) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
    const buffers = [];

    doc.on('data', chunk => buffers.push(chunk));
    doc.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(buffers);

        // Upload to Cloudinary as raw file
        const uploadResult = await new Promise((res, rej) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'learnflow/certificates',
              resource_type: 'raw',
              format: 'pdf',
              public_id: `cert_${certificateId}`,
            },
            (error, result) => {
              if (error) rej(error);
              else res(result);
            }
          );
          Readable.from(pdfBuffer).pipe(uploadStream);
        });

        resolve(uploadResult.secure_url);
      } catch (err) {
        reject(err);
      }
    });

    doc.on('error', reject);

    const W = 841; // A4 landscape width in points
    const H = 595;

    // Background
    doc.rect(0, 0, W, H).fill('#F8F9FB');

    // Top border
    doc.rect(0, 0, W, 8).fill('#2563EB');
    doc.rect(0, H - 8, W, 8).fill('#2563EB');
    doc.rect(0, 0, 8, H).fill('#2563EB');
    doc.rect(W - 8, 0, 8, H).fill('#2563EB');

    // Inner border
    doc.rect(24, 24, W - 48, H - 48)
      .lineWidth(1)
      .strokeColor('#2563EB')
      .stroke();

    // Logo / Title
    doc.fontSize(14)
      .fillColor('#2563EB')
      .font('Helvetica-Bold')
      .text('LEARNFLOW', 0, 55, { align: 'center', characterSpacing: 6 });

    // Certificate of Completion
    doc.fontSize(32)
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .text('Certificate of Completion', 0, 95, { align: 'center' });

    // Divider
    doc.moveTo(W / 2 - 120, 145).lineTo(W / 2 + 120, 145)
      .lineWidth(1).strokeColor('#CBD5E1').stroke();

    // This is to certify
    doc.fontSize(13)
      .fillColor('#64748B')
      .font('Helvetica')
      .text('This is to certify that', 0, 165, { align: 'center' });

    // Student name
    doc.fontSize(36)
      .fillColor('#2563EB')
      .font('Helvetica-Bold')
      .text(studentName, 0, 195, { align: 'center' });

    // Has completed
    doc.fontSize(13)
      .fillColor('#64748B')
      .font('Helvetica')
      .text('has successfully completed the course', 0, 248, { align: 'center' });

    // Course name
    doc.fontSize(22)
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .text(courseName, 60, 275, { align: 'center', width: W - 120 });

    // Divider
    doc.moveTo(W / 2 - 120, 330).lineTo(W / 2 + 120, 330)
      .lineWidth(1).strokeColor('#CBD5E1').stroke();

    // Instructor + Date
    const dateStr = new Date(issuedAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    doc.fontSize(12).fillColor('#64748B').font('Helvetica');
    doc.text(`Instructor: ${instructorName}`, 120, 355);
    doc.text(`Issued: ${dateStr}`, W - 280, 355);

    // Certificate ID
    doc.fontSize(9)
      .fillColor('#94A3B8')
      .text(`Certificate ID: ${certificateId}`, 0, H - 45, { align: 'center' });

    doc.end();
  });
};

module.exports = generateCertificate;
