#!/usr/bin/env python3

#from abbreviations import schwartz_hearst
from schwartz_hearst import extract_abbreviation_definition_pairs
import json
import sys, getopt
from venv import create
import docx2txt
import re
from flask import jsonify
import xlsxwriter
import PyPDF2 as pdf2
import csv
from docx import Document
from collections import OrderedDict

#stores dictionary of acronyms and abbreviations
dict_from_csv = {}

#opens given outputfile and finds full abbreviations of acronyms
def findAbbrev(inputfile):
    pairs = extract_abbreviation_definition_pairs(doc_text=docx2txt.process(inputfile))
    # pairs = ''
    global dict_from_csv
    dict_from_csv = OrderedDict(sorted(pairs.items(), key=lambda t: t[0]))
    
#opens document and returns acronyms found
def findAcronyms(inputfile):
    outputfile = "list"

    rx = r"\b[A-Z](?=([&.]?))(?:\1[A-Z])+\b"
    doc_text=docx2txt.process(inputfile)
    list = [x.group() for x in re.finditer(rx, doc_text)]

    # remove repeated acronyms from list
    aclist = []
    for i in list:
        if i not in aclist:
           aclist.append(str(i))
    
    #obtains list of acronyms not found in shwartz-hearst algorithm
    notlist = []
    global dict_from_csv
    dict_from_csv_copy = dict_from_csv.copy()
    for item in aclist:
        if item in dict_from_csv_copy:
            pass
        else:
            dict_from_csv_copy.update({item: " "})
    dict_from_csv_copy = OrderedDict(sorted(dict_from_csv_copy.items(), key=lambda t: t[0]))
    print(dict_from_csv_copy)    

    documentObj = Document()

    table = documentObj.add_table(rows=1, cols=2)

    check = []
    
    for k,v in dict_from_csv_copy.items():
        row_cells = table.add_row().cells
        row_cells[0].text = k
        row_cells[1].text = v

    documentObj.add_page_break()

    documentObj.save("static/client/docx/" + outputfile + '.docx')

    return check

#iterates through given document and creates an excel workbook
#with given outputfile name
def createXLSX(outfilename):
    workbook = xlsxwriter.Workbook("static/client/xlsx/" + outfilename)# + '.xlsx')
    worksheet = workbook.add_worksheet()

    row = 0
    for k,v in dict_from_csv.items():
        worksheet.write(row, 0, k)
        worksheet.write(row, 1, v)
        
        row += 1
    workbook.close()

#iterates through given document and creates a word docx
#with given outputfile name
def createDoc(outfilename):
    documentObj = Document()

    table = documentObj.add_table(rows=1, cols=2)

    check = []
    
    for k,v in dict_from_csv.items():
        row_cells = table.add_row().cells
        row_cells[0].text = k
        row_cells[1].text = v

    documentObj.add_page_break()

    documentObj.save("static/client/docx/" + outfilename)# + '.docx')

    return check



