import os

from flask import Flask
from flask import render_template, request, jsonify, send_file, send_from_directory, abort
from flask_dropzone import Dropzone
from werkzeug.utils import secure_filename
from acronyms import findAbbrev, findAcronyms, createXLSX, createDoc
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

@app.route('/admin')
def admin():
    print('Request for admin page received.')
    return render_template('admin.html')

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
        findAcronyms(filePath + f.filename)

        createXLSX(filename)
        createDoc(filename)

        try:
            os.remove(filePath + f.filename)
        except OSError as e:
            print("Error: %s : %s" % (filePath, e.strerror))
        
        print("\n\n\n\nFINISHED UPLOADING", f.filename)
    return jsonify(f.filename)

@app.route("/get-docx", methods=['GET', 'POST'])
def get_docx():
    filename = "output.docx"
    try:
        return send_from_directory(app.config["CLIENT_DOCX"], path=filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)

@app.route("/get-xlsx", methods=['GET', 'POST'])
def get_xlsx():
    filename = "output.xlsx"
    try:
        return send_from_directory(app.config["CLIENT_XLSX"], path=filename, as_attachment=True)
    except FileNotFoundError:
        print("cannot find file")
        abort(404)

@app.route("/get-list", methods=['GET', 'POST'])
def get_list():
    filename = "list.docx"
    try:
        return send_from_directory(app.config["CLIENT_DOCX"], path=filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)

if __name__ == "__main__":
  app.run()
  
  
  
