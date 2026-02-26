// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');
import * as mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    console.error('Error parsing PDF:', err);
    throw new Error('Failed to parse PDF document.');
  }
}

export async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (err) {
    console.error('Error parsing DOCX:', err);
    throw new Error('Failed to parse DOCX document.');
  }
}

export function parseTxt(buffer: Buffer): string {
  try {
    return buffer.toString('utf-8');
  } catch (err) {
    console.error('Error parsing TXT:', err);
    throw new Error('Failed to parse text document.');
  }
}

export async function parseImage(buffer: Buffer): Promise<string> {
  try {
    // Tesseract.js recognize can accept a buffer in Node.js
    const result = await Tesseract.recognize(buffer, 'eng+heb', {
      logger: (m) => console.log(m)
    });
    return result.data.text;
  } catch (err) {
    console.error('Error parsing Image with OCR:', err);
    throw new Error('Failed to extract text from image.');
  }
}

export async function parseDocument(buffer: Buffer, fileType: string): Promise<string> {
  switch (fileType) {
    case 'pdf':
      return parsePdf(buffer);
    case 'docx':
      return parseDocx(buffer);
    case 'txt':
      return parseTxt(buffer);
    case 'image':
      return parseImage(buffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}
