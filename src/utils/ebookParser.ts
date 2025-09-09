import JSZip from 'jszip';
import mammoth from 'mammoth';

export async function parseEbook(file: File): Promise<string> {
  const fileExtension = file.name.toLowerCase().split('.').pop();
  
  switch (fileExtension) {
    case 'txt':
      return parseTextFile(file);
    case 'epub':
      return parseEpubFile(file);
    case 'pdf':
      return parsePdfFile(file);
    case 'docx':
      return parseDocxFile(file);
    default:
      throw new Error('Unsupported file format');
  }
}

async function parseTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
}

async function parseEpubFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    // Find content.opf file
    const opfFile = Object.keys(zip.files).find(name => 
      name.endsWith('.opf') || name.includes('content.opf')
    );
    
    if (!opfFile) {
      throw new Error('Invalid EPUB file: No OPF file found');
    }
    
    const opfContent = await zip.files[opfFile].async('text');
    
    // Extract spine order and HTML files
    const spineMatches = opfContent.match(/<spine[^>]*>(.*?)<\/spine>/s);
    const manifestMatches = opfContent.match(/<manifest[^>]*>(.*?)<\/manifest>/s);
    
    if (!spineMatches || !manifestMatches) {
      throw new Error('Invalid EPUB structure');
    }
    
    // Parse manifest to get file mappings
    const manifest = manifestMatches[1];
    const itemRegex = /<item[^>]+id="([^"]+)"[^>]+href="([^"]+)"/g;
    const fileMap: { [key: string]: string } = {};
    let match;
    
    while ((match = itemRegex.exec(manifest)) !== null) {
      fileMap[match[1]] = match[2];
    }
    
    // Parse spine to get reading order
    const spine = spineMatches[1];
    const spineRegex = /<itemref[^>]+idref="([^"]+)"/g;
    const spineOrder: string[] = [];
    
    while ((match = spineRegex.exec(spine)) !== null) {
      if (fileMap[match[1]]) {
        spineOrder.push(fileMap[match[1]]);
      }
    }
    
    // Extract text from HTML files in order
    let fullText = '';
    const basePath = opfFile.substring(0, opfFile.lastIndexOf('/') + 1);
    
    for (const htmlFile of spineOrder) {
      const fullPath = basePath + htmlFile;
      if (zip.files[fullPath]) {
        const htmlContent = await zip.files[fullPath].async('text');
        const textContent = extractTextFromHtml(htmlContent);
        fullText += textContent + '\n\n';
      }
    }
    
    return fullText.trim();
  } catch (error) {
    throw new Error(`Failed to parse EPUB: ${error}`);
  }
}

async function parsePdfFile(file: File): Promise<string> {
  // Note: PDF parsing in browser is complex and would require pdf-parse or similar
  // For now, we'll provide a placeholder that suggests using a server-side solution
  throw new Error('PDF parsing requires server-side processing. Please convert to TXT or EPUB format.');
}

async function parseDocxFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    throw new Error(`Failed to parse DOCX: ${error}`);
  }
}

function extractTextFromHtml(html: string): string {
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove script and style elements
  const scripts = tempDiv.querySelectorAll('script, style');
  scripts.forEach(el => el.remove());
  
  // Get text content and clean it up
  let text = tempDiv.textContent || tempDiv.innerText || '';
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}