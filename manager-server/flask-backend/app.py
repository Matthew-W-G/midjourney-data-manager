from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import os
from dotenv import load_dotenv
from flask_cors import CORS
import logging

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'dev'
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql+psycopg2://postgres:{os.getenv('DB_PASSWORD')}@midjourney-db.crusowko6eee.us-east-2.rds.amazonaws.com/midjourney-db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_filtered_image_data(prompt_text, enhancement_level, authors, limit, offset):
    base_query = """
        SELECT image.*, image_metadata.* 
        FROM image 
        JOIN image_metadata ON image.image_id = image_metadata.image_id
    """
    conditions = []
    params = {}

    if prompt_text:
        conditions.append("image.prompt_text LIKE :prompt_text")
        params["prompt_text"] = f"%{prompt_text}%"
    if enhancement_level:
        # Dynamically construct the IN clause
        conditions.append(f"image.enhancement_level IN ({','.join([f':enhancement_level_{i}' for i in range(len(enhancement_level))])})")
        for i, level in enumerate(enhancement_level):
            params[f"enhancement_level_{i}"] = level
    if authors:
        conditions.append(f"image.author IN ({','.join([f':author_{i}' for i in range(len(authors))])})")
        for i, author in enumerate(authors):
            params[f"author_{i}"] = author

    if conditions:
        base_query += " WHERE " + " AND ".join(conditions)
    
    base_query += " ORDER BY image.id DESC "
    if limit:
        base_query += "LIMIT :limit OFFSET :offset"
    params["limit"] = limit
    params["offset"] = offset

    return text(base_query), params

@app.route('/allImageData', methods=['GET'])
def get_image_metadata():
    prompt_text = request.args.get('prompt_text', '')
    enhancement_level = request.args.getlist('qualities')
    authors = request.args.getlist('author')
    limit = int(request.args.get('limit'))
    offset = int(request.args.get('offset', 0))

    logger.debug(f"Received request with: prompt_text={prompt_text}, enhancement_level={enhancement_level}, authors={authors}, limit={limit}, offset={offset}")

    sql_query, params = get_filtered_image_data(prompt_text, enhancement_level, authors, limit, offset)
    logger.debug(f"Executing query: {sql_query} with params: {params}")
    
    result = db.session.execute(sql_query, params)
    data = [dict(row._mapping) for row in result]
    return jsonify(data)

@app.route('/listAuthors', methods=['GET'])
def get_authors():
    sql_query = text("SELECT DISTINCT author FROM image")
    result = db.session.execute(sql_query)
    authors = [row[0] for row in result]
    return jsonify(authors)

@app.route('/listQualities', methods=['GET'])
def get_qualities():
    sql_query = text("SELECT DISTINCT enhancement_level FROM image")
    result = db.session.execute(sql_query)
    qualities = [row[0] for row in result]
    return jsonify(qualities)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
