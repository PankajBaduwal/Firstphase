import sys
from pypdf import PdfReader
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PdfReader(file)
            
            num_pages = len(pdf_reader.pages)
            
            if num_pages == 0:
                print("Error: PDF has no pages", file=sys.stderr)
                sys.exit(1)
            
            extracted_text = ""
            
            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                
                text = page.extract_text(extraction_mode="layout")
                
                if text:
                    extracted_text += f"--- Page {page_num + 1} ---\n"
                    extracted_text += text + "\n\n"
            
            if not extracted_text.strip():
                print("Error: No text could be extracted from PDF", file=sys.stderr)
                sys.exit(1)
            
            print(extracted_text, end='')
            
    except FileNotFoundError:
        print(f"Error: File not found - {pdf_path}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_pdf.py <pdf_file_path>", file=sys.stderr)
        sys.exit(1)
    
    pdf_file_path = sys.argv[1]
    extract_text_from_pdf(pdf_file_path)
