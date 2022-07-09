import os
import json
import csv

from flask import Flask
from flask import render_template, request, jsonify, send_from_directory, abort
from flask_dropzone import Dropzone
from werkzeug.utils import secure_filename
from acronyms import findAbbrev, findAcronyms, createXLSX, createDoc, getDictFromCSV
from werkzeug.exceptions import Forbidden, HTTPException, NotFound, RequestTimeout, Unauthorized

app = Flask(__name__)
app.config["CLIENT_CSV"] = "static/client/csv/"
app.config["CLIENT_DOCX"] = "static/client/docx/"
app.config["CLIENT_XLSX"] = "static/client/xlsx/"
app.config["CLIENT_UPLOADS"] = "static/client/uploads/"

dropzone = Dropzone(app)

@app.route('/')
def main():
    print('Request for index page received.')
    return render_template('construction.html')

@app.errorhandler(NotFound)
def page_not_found_handler(HTTPException):
    return render_template('404.html'), 404


@app.route("/upload", methods=['GET', 'POST'])
def upload():
    f = request.files.get('file')
    filename = secure_filename(f.filename) # sanitize file name
    msg = "Could not upload file: " + filename

    if request.method == 'POST':
        data = findAbbrev(f)

        filePath = app.config["CLIENT_UPLOADS"]

        msg = "Uploaded file: " + filename

        # replaces original extension with .csv to create
        # and save a csv file of only short forms and long forms
        header = ["short form", "long form"]
        csvfile = (filename).split(".docx")[0] + ".csv"
        with open(filePath + csvfile, 'w', encoding='UTF8', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(header)
            for k,v in data.items():
                writer.writerow([k, v])
 
    return jsonify(msg)

@app.route("/get-docx/<string:fn>", methods=['GET', 'POST'])
def get_docx(fn):
    filePath = app.config["CLIENT_UPLOADS"]
    filename = secure_filename(json.loads(fn))

    # replaces original extension with .csv 
    csvfile = (filename).split(".docx")[0] + ".csv"
    with open(filePath + csvfile, mode='r') as infile:
        reader = csv.reader(infile)
        next(reader)
        data = {rows[0]:rows[1] for rows in reader}  

    createDoc(filename, data)

    try:
        return send_from_directory(app.config["CLIENT_DOCX"], path=filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)

@app.route("/get-xlsx/<string:fn>", methods=['GET', 'POST'])
def get_xlsx(fn):
    filePath = app.config["CLIENT_UPLOADS"]
    filename = secure_filename(json.loads(fn))

    # replaces original extension with .csv 
    csvfile = (filename).split(".docx")[0] + ".csv"
    with open(filePath + csvfile, mode='r') as infile:
        reader = csv.reader(infile)
        next(reader)
        data = {rows[0]:rows[1] for rows in reader}  

    createXLSX(filename, data)

    try:
        return send_from_directory(app.config["CLIENT_XLSX"], path=filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)

@app.route("/get-list/<string:fn>", methods=['GET', 'POST'])
def get_list(fn):
    filePath = app.config["CLIENT_UPLOADS"]
    filename = secure_filename(json.loads(fn))
    print("filename inside get_list: ", filename)

    # replaces original extension with .csv 
    csvfile = (filename).split(".docx")[0] + ".csv"
    with open(filePath + csvfile, mode='r') as infile:
        reader = csv.reader(infile)
        next(reader)
        data = {rows[0]:rows[1] for rows in reader}  
        
    return jsonify(data)

if __name__ == "__main__":
  app.run()
  
  
  
