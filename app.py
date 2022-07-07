import os
import json

from flask import Flask
from flask import render_template, request, jsonify, send_file, send_from_directory, abort
from flask_dropzone import Dropzone
from werkzeug.utils import secure_filename
from acronyms import findAbbrev, findAcronyms, createXLSX, createDoc, getDictFromCSV
from werkzeug.exceptions import Forbidden, HTTPException, NotFound, RequestTimeout, Unauthorized

app = Flask(__name__)
app.config["CLIENT_CSV"] = "static/client/csv/"
app.config["CLIENT_DOCX"] = "static/client/docx/"
app.config["CLIENT_XLSX"] = "static/client/xlsx/"

dropzone = Dropzone(app)

#INPUT_FILE = "acronym_list.csv"

OUTPUT_FILE = "output1"

@app.route('/')
def main():
    print('Request for index page received.')
    return render_template('index.html')

@app.errorhandler(NotFound)
def page_not_found_handler(HTTPException):
    return render_template('404.html'), 404


@app.route("/upload", methods=['GET', 'POST'])
def upload():
    msg = ''
    if request.method == 'POST':
        f = request.files.get('file')
        filePath = "static/client/uploads/"
        f.save(filePath + f.filename)
        filename = secure_filename(f.filename)

        print('Request to upload file with name=%s ' % filename)

        findAbbrev(filePath + f.filename)
        # findAcronyms(filePath + f.filename)

        try:
            os.remove(filePath + f.filename)
        except OSError as e:
            print("Error: %s : %s" % (filePath, e.strerror))
 
    return jsonify(f.filename)

@app.route("/get-docx/<string:fn>", methods=['GET', 'POST'])
def get_docx(fn):
    filename = json.loads(fn)
    createDoc(filename)

    try:
        return send_from_directory(app.config["CLIENT_DOCX"], path=filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)

@app.route("/get-xlsx/<string:fn>", methods=['GET', 'POST'])
def get_xlsx(fn):
    #extracts filename without extension
    filename = (json.loads(fn)).split(".docx")[0] + ".xlsx"
    createXLSX(filename)

    try:
        return send_from_directory(app.config["CLIENT_XLSX"], path=filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)

# To-Do: Need to specify the file to get acronyms from
# or change the infrastructure when the findAbbrev should be called
# maybe findAbbrev() should be called when createDoc() and createLXSX()
# are called. And for get_list() it will be called individually with the file
# name attached to the endpoint
# @app.route("/get-list/<string:fn>", methods=['GET', 'POST'])
@app.route("/get-list/", methods=['GET', 'POST'])
def get_list():
    acronyms = getDictFromCSV()
    print("get_list request received")
    return jsonify(acronyms)

if __name__ == "__main__":
  app.run()
  
  
  
