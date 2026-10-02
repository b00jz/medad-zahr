// ==========================================================================
// Client-Side PDF Text Extractor - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

export class PDFService {
  /**
   * Reads an uploaded PDF File and extracts text page by page.
   * @param {File} file - Uploaded PDF File object.
   * @param {Function} progressCallback - Callback(percent, statusText)
   * @returns {Promise<Object>} Object containing fullText, chapters Array, pageCount, title.
   */
  static async extractTextFromPDF(file, progressCallback = () => {}) {
    return new Promise((resolve, reject) => {
      if (!file || file.type !== 'application/pdf') {
        return reject(new Error('الملف ليس صيغة PDF صالحة.'));
      }

      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          
          if (!window.pdfjsLib) {
            throw new Error('مكتبة PDF.js غير محمّلة.');
          }

          progressCallback(10, 'جاري تحميل ملف الـ PDF...');
          const pdf = await window.pdfjsLib.getDocument({ data: typedArray }).promise;
          const totalPages = pdf.numPages;

          let fullText = '';
          const chapters = [];
          const pagesPerChapter = Math.max(1, Math.floor(totalPages / 5)); // Group pages into chapters

          let currentChapterContent = '';
          let currentChapterIndex = 1;

          for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');

            fullText += pageText + '\n\n';
            currentChapterContent += pageText + '\n\n';

            if (pageNum % pagesPerChapter === 0 || pageNum === totalPages) {
              chapters.push({
                title: `الفصل ${currentChapterIndex}: الصفحات (${pageNum - pagesPerChapter + 1} - ${pageNum})`,
                content: currentChapterContent.trim()
              });
              currentChapterIndex++;
              currentChapterContent = '';
            }

            const percent = Math.round((pageNum / totalPages) * 100);
            progressCallback(percent, `جاري قراءة الصفحة ${pageNum} من ${totalPages}...`);
          }

          resolve({
            title: file.name.replace('.pdf', ''),
            fullText,
            chapters,
            pageCount: totalPages
          });
        } catch (err) {
          reject(err);
        }
      };

      fileReader.onerror = () => reject(new Error('فشل قراءة الملف.'));
      fileReader.readAsArrayBuffer(file);
    });
  }
}
