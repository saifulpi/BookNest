import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import { Book, Chapter } from '../types/book';

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

// Generate cover placeholder canvas/SVG if book has no cover
export function generateCoverArt(title: string, author: string, hue = 210): string {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Rich textured leather / cloth gradient
  const grad = ctx.createLinearGradient(0, 0, 400, 600);
  grad.addColorStop(0, `hsl(${hue}, 45%, 22%)`);
  grad.addColorStop(0.5, `hsl(${hue}, 50%, 16%)`);
  grad.addColorStop(1, `hsl(${hue}, 55%, 10%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 400, 600);

  // Gold foil borders
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, 360, 560);
  ctx.lineWidth = 1;
  ctx.strokeRect(28, 28, 344, 544);

  // Ornate corners
  const drawCorner = (x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.stroke();
  };
  drawCorner(28, 28);
  drawCorner(372, 28);
  drawCorner(28, 572);
  drawCorner(372, 572);

  // Title
  ctx.fillStyle = '#f5e6c8';
  ctx.font = 'bold 28px Cormorant Garamond, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Wrap title text
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > 300) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const startY = 240 - (lines.length * 34) / 2;
  lines.forEach((line, idx) => {
    ctx.fillText(line, 200, startY + idx * 36);
  });

  // Small divider
  ctx.beginPath();
  ctx.moveTo(150, 320);
  ctx.lineTo(250, 320);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.stroke();

  // Author
  ctx.fillStyle = '#e2cfb0';
  ctx.font = 'italic 18px Lora, serif';
  ctx.fillText(author || 'Unknown Author', 200, 355);

  return canvas.toDataURL('image/jpeg', 0.85);
}

// 1. Parse TXT / Markdown file
export async function parseTxtFile(file: File): Promise<Book> {
  const text = await file.text();
  const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const bookId = `txt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Detect chapters by lines like "Chapter 1", "# Heading", etc.
  const lines = text.split(/\r?\n/);
  const chapters: Chapter[] = [];
  let currentChapterTitle = 'Introduction';
  let currentChapterLines: string[] = [];

  const chapterRegex = /^(#{1,3}\s+|chapter\s+\d+|book\s+\d+|part\s+\d+|section\s+\d+|act\s+\d+)/i;

  for (const line of lines) {
    if (chapterRegex.test(line.trim())) {
      if (currentChapterLines.length > 0) {
        chapters.push({
          id: `${bookId}-ch-${chapters.length + 1}`,
          title: currentChapterTitle,
          content: currentChapterLines.join('\n').trim()
        });
        currentChapterLines = [];
      }
      currentChapterTitle = line.replace(/^#{1,3}\s+/, '').trim();
    } else {
      currentChapterLines.push(line);
    }
  }

  // Push remaining content
  if (currentChapterLines.length > 0) {
    chapters.push({
      id: `${bookId}-ch-${chapters.length + 1}`,
      title: currentChapterTitle || `Chapter ${chapters.length + 1}`,
      content: currentChapterLines.join('\n').trim()
    });
  }

  // If no chapter structure detected or single large text, chunk by ~2,500 characters
  if (chapters.length <= 1 && text.length > 3000) {
    chapters.length = 0;
    const chunkSize = 2500;
    let offset = 0;
    let index = 1;
    while (offset < text.length) {
      let end = offset + chunkSize;
      if (end < text.length) {
        const nextBreak = text.indexOf('\n\n', end - 200);
        if (nextBreak !== -1 && nextBreak < end + 300) {
          end = nextBreak;
        }
      }
      chapters.push({
        id: `${bookId}-ch-${index}`,
        title: `Section ${index}`,
        content: text.slice(offset, end).trim()
      });
      offset = end;
      index++;
    }
  }

  const coverUrl = generateCoverArt(title, 'Imported Document', 220);
  const estimatedPages = Math.max(1, Math.ceil(text.length / 1400));

  return {
    id: bookId,
    title,
    author: 'Imported Document',
    description: `Plain text document imported on ${new Date().toLocaleDateString()}. Contains ${chapters.length} sections and ${text.length.toLocaleString()} characters.`,
    format: 'txt',
    coverUrl,
    genre: 'Imported',
    collectionId: 'all',
    addedAt: Date.now(),
    lastReadAt: Date.now(),
    currentPage: 1,
    totalPages: estimatedPages,
    readingTimeSeconds: 0,
    isCompleted: false,
    chapters,
    fileData: text
  };
}

// 2. Parse EPUB File using JSZip
export async function parseEpubFile(file: File): Promise<Book> {
  const zip = new JSZip();
  const buffer = await file.arrayBuffer();
  const zipContent = await zip.loadAsync(buffer);
  const bookId = `epub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Find container.xml to get content.opf path
  const containerFile = zipContent.file('META-INF/container.xml');
  if (!containerFile) {
    throw new Error('Invalid EPUB file: missing META-INF/container.xml');
  }

  const containerXmlText = await containerFile.async('text');
  const parser = new DOMParser();
  const containerDoc = parser.parseFromString(containerXmlText, 'text/xml');
  const rootfilePath = containerDoc.querySelector('rootfile')?.getAttribute('full-path') || 'content.opf';

  const opfFile = zipContent.file(rootfilePath);
  if (!opfFile) {
    throw new Error('Invalid EPUB file: content.opf not found at ' + rootfilePath);
  }

  const opfText = await opfFile.async('text');
  const opfDoc = parser.parseFromString(opfText, 'text/xml');

  // Metadata
  const title = opfDoc.querySelector('title')?.textContent || file.name.replace(/\.[^/.]+$/, '');
  const author = opfDoc.querySelector('creator')?.textContent || 'Unknown Author';
  const description = opfDoc.querySelector('description')?.textContent || 'Imported EPUB publication';

  // Base directory for relative links
  const opfBaseDir = rootfilePath.includes('/') ? rootfilePath.substring(0, rootfilePath.lastIndexOf('/') + 1) : '';

  // Extract Manifest & Spine
  const manifestItems: Record<string, { href: string; mediaType: string }> = {};
  opfDoc.querySelectorAll('manifest > item').forEach((item) => {
    const id = item.getAttribute('id');
    const href = item.getAttribute('href');
    const mediaType = item.getAttribute('media-type');
    if (id && href) {
      manifestItems[id] = { href, mediaType: mediaType || '' };
    }
  });

  // Extract Cover Image if available
  let coverUrl = '';
  // Check meta cover tag or manifest cover item
  const coverMeta = opfDoc.querySelector('meta[name="cover"]');
  const coverItemId = coverMeta?.getAttribute('content') || Object.keys(manifestItems).find(k => k.toLowerCase().includes('cover'));

  if (coverItemId && manifestItems[coverItemId]) {
    const coverRelPath = opfBaseDir + manifestItems[coverItemId].href;
    const coverZipFile = zipContent.file(coverRelPath) || zipContent.file(manifestItems[coverItemId].href);
    if (coverZipFile) {
      const coverBlob = await coverZipFile.async('blob');
      coverUrl = URL.createObjectURL(coverBlob);
    }
  }

  if (!coverUrl) {
    coverUrl = generateCoverArt(title, author, 260);
  }

  // Extract Spine Chapters
  const spineItemRefs = opfDoc.querySelectorAll('spine > itemref');
  const chapters: Chapter[] = [];

  for (let i = 0; i < spineItemRefs.length; i++) {
    const idref = spineItemRefs[i].getAttribute('idref');
    if (idref && manifestItems[idref]) {
      const chapterHref = opfBaseDir + manifestItems[idref].href;
      const chapterFile = zipContent.file(chapterHref) || zipContent.file(manifestItems[idref].href);
      if (chapterFile) {
        const xhtmlText = await chapterFile.async('text');
        const chapterDoc = parser.parseFromString(xhtmlText, 'text/html');

        // Extract title
        let chTitle = chapterDoc.querySelector('h1, h2, h3, title')?.textContent?.trim();
        if (!chTitle || chTitle.length > 50) {
          chTitle = `Chapter ${chapters.length + 1}`;
        }

        // Clean body content
        const bodyContent = chapterDoc.body ? chapterDoc.body.innerHTML : xhtmlText;

        // Strip script tags
        const sanitized = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        // Only include chapters that have readable text
        const textLength = chapterDoc.body?.textContent?.trim().length || 0;
        if (textLength > 50) {
          chapters.push({
            id: `${bookId}-ch-${chapters.length + 1}`,
            title: chTitle,
            content: sanitized
          });
        }
      }
    }
  }

  if (chapters.length === 0) {
    chapters.push({
      id: `${bookId}-ch-1`,
      title: 'Full Content',
      content: '<p>Content loaded from EPUB.</p>'
    });
  }

  const estimatedPages = Math.max(chapters.length * 4, 12);

  return {
    id: bookId,
    title,
    author,
    description: description.replace(/<[^>]+>/g, '').slice(0, 300),
    format: 'epub',
    coverUrl,
    genre: 'E-Book',
    collectionId: 'all',
    addedAt: Date.now(),
    lastReadAt: Date.now(),
    currentPage: 1,
    totalPages: estimatedPages,
    readingTimeSeconds: 0,
    isCompleted: false,
    chapters
  };
}

// 3. Parse PDF File using PDF.js
export async function parsePdfFile(file: File): Promise<Book> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  let title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  let author = 'Unknown Author';

  try {
    const metadata = await pdfDoc.getMetadata();
    const info = metadata.info as Record<string, any>;
    if (info?.Title && info.Title.trim()) title = info.Title.trim();
    if (info?.Author && info.Author.trim()) author = info.Author.trim();
  } catch (e) {
    console.warn('Could not read PDF metadata', e);
  }

  // Render Page 1 to create cover thumbnail
  let coverUrl = '';
  try {
    const page1 = await pdfDoc.getPage(1);
    const viewport = page1.getViewport({ scale: 0.8 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      await page1.render({ canvasContext: ctx, viewport }).promise;
      coverUrl = canvas.toDataURL('image/jpeg', 0.85);
    }
  } catch (e) {
    console.error('Failed to generate PDF cover image', e);
    coverUrl = generateCoverArt(title, author, 190);
  }

  const bookId = `pdf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Create chapters based on PDF page blocks
  const chapters: Chapter[] = [];
  const chunkSize = Math.max(1, Math.min(10, Math.ceil(numPages / 10)));
  for (let i = 1; i <= numPages; i += chunkSize) {
    const end = Math.min(i + chunkSize - 1, numPages);
    chapters.push({
      id: `${bookId}-ch-${i}`,
      title: `Pages ${i}–${end}`,
      content: `PDF Document Page Block ${i} to ${end}`
    });
  }

  return {
    id: bookId,
    title,
    author,
    description: `PDF Document containing ${numPages} pages. Imported on ${new Date().toLocaleDateString()}.`,
    format: 'pdf',
    coverUrl,
    genre: 'Document',
    collectionId: 'all',
    addedAt: Date.now(),
    lastReadAt: Date.now(),
    currentPage: 1,
    totalPages: numPages,
    readingTimeSeconds: 0,
    isCompleted: false,
    chapters,
    fileData: arrayBuffer
  };
}
