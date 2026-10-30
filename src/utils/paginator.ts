import { Book, BookPage, Chapter } from '../types/book';

export function paginateBook(book: Book, charsPerPage = 1400): BookPage[] {
  // If PDF, each page corresponds to a physical PDF page
  if (book.format === 'pdf') {
    const pages: BookPage[] = [];
    for (let i = 1; i <= book.totalPages; i++) {
      pages.push({
        pageNumber: i,
        chapterIndex: Math.floor((i - 1) / 10),
        chapterTitle: `Page ${i}`,
        content: `PDF Page ${i}`,
        type: 'pdf-canvas'
      });
    }
    return pages;
  }

  const pages: BookPage[] = [];
  let globalPageNum = 1;

  book.chapters.forEach((chapter, chIdx) => {
    // Clean and split chapter content into paragraphs
    const rawContent = chapter.content;

    // Check if HTML formatted
    const isHtml = /<[a-z][\s\S]*>/i.test(rawContent);

    if (isHtml) {
      // Split by block tags like </p>, </div>, </h1>, </h2>, </h3>, <br/>
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = rawContent;
      const paragraphs = Array.from(tempDiv.querySelectorAll('p, h1, h2, h3, h4, blockquote, li')).map(el => el.outerHTML);

      if (paragraphs.length === 0) {
        paragraphs.push(tempDiv.innerHTML || '<p>Empty section</p>');
      }

      let currentPageHtml = '';
      let currentLen = 0;

      paragraphs.forEach((p) => {
        const textLen = p.replace(/<[^>]*>/g, '').length;
        if (currentLen + textLen > charsPerPage && currentPageHtml) {
          pages.push({
            pageNumber: globalPageNum++,
            chapterIndex: chIdx,
            chapterTitle: chapter.title,
            content: currentPageHtml,
            type: 'text'
          });
          currentPageHtml = p;
          currentLen = textLen;
        } else {
          currentPageHtml += (currentPageHtml ? '\n' : '') + p;
          currentLen += textLen;
        }
      });

      if (currentPageHtml.trim()) {
        pages.push({
          pageNumber: globalPageNum++,
          chapterIndex: chIdx,
          chapterTitle: chapter.title,
          content: currentPageHtml,
          type: 'text'
        });
      }
    } else {
      // Plain text: split by double newlines into paragraphs
      const paragraphs = rawContent.split(/\n\s*\n/).filter(p => p.trim().length > 0);

      let currentPageText = '';
      let currentLen = 0;

      paragraphs.forEach((p) => {
        if (currentLen + p.length > charsPerPage && currentPageText) {
          pages.push({
            pageNumber: globalPageNum++,
            chapterIndex: chIdx,
            chapterTitle: chapter.title,
            content: currentPageText,
            type: 'text'
          });
          currentPageText = p;
          currentLen = p.length;
        } else {
          currentPageText += (currentPageText ? '\n\n' : '') + p;
          currentLen += p.length;
        }
      });

      if (currentPageText.trim()) {
        pages.push({
          pageNumber: globalPageNum++,
          chapterIndex: chIdx,
          chapterTitle: chapter.title,
          content: currentPageText,
          type: 'text'
        });
      }
    }
  });

  if (pages.length === 0) {
    pages.push({
      pageNumber: 1,
      chapterIndex: 0,
      chapterTitle: 'Opening',
      content: 'No content available.',
      type: 'text'
    });
  }

  return pages;
}
