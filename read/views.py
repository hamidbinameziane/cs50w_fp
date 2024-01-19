from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import DangoBook

import os
import fitz  # PyMuPDF

def index(request):
    return render(request, 'read/index.html')

def pages(request):
    output_dir = "extracted_images"
    output_format = "png"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    file = "dfb.pdf"
    pdf_file = fitz.open(file)
    page = pdf_file[99]
    pix = page.get_pixmap(dpi=96)
    url = "media/page-%i.png" % page.number
    pix.save(url)
    
    return JsonResponse({"image": url}, status=201)
