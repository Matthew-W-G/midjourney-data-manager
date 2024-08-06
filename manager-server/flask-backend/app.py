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

parameters_columns = [
    'aspect', 'chaos', 'character_reference', 'fast', 'image_weight', 'no',
    'quality', 'style_random', 'relax', 'repeat', 'seed', 'stop', 'style',
    'style_reference', 'stylize', 'tile', 'turbo', 'video', 'weird'
]

def get_filtered_image_data(prompt_text, enhancement_level, authors, limit, offset, param_filters):
    base_query = """
        SELECT image.*, image_metadata.*, parameters.*
        FROM image 
        JOIN image_metadata ON image.image_id = image_metadata.image_id
        LEFT JOIN parameters ON image_metadata.image_id = parameters.image_id
    """
    count_query = """
        SELECT count(*)
        FROM image 
        JOIN image_metadata ON image.image_id = image_metadata.image_id
        LEFT JOIN parameters ON image_metadata.image_id = parameters.image_id
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

    # Add parameter filters
    for param, value in param_filters.items():
        logger.debug(f"Adding filter for param: {param} with value: {value}")
        if param in ["chaos", "image_weight", "stylize", "weird"]:
            conditions.append(f"parameters.{param} >= :{param}")
            params[param] = float(value)
        else:
            conditions.append(f"LOWER(parameters.{param}) = LOWER(:{param})")
            params[param] = value.lower()

    if conditions:
        base_query += " WHERE " + " AND ".join(conditions)
        count_query += " WHERE " + " AND ".join(conditions)
    
    base_query += " ORDER BY image.id DESC "
    if limit:
        base_query += "LIMIT :limit OFFSET :offset"
    params["limit"] = limit
    params["offset"] = offset

    logger.debug(f"Constructed SQL Query: {base_query} with Params: {params}")

    return text(base_query), text(count_query), params

@app.route('/allImageData', methods=['GET'])
def get_image_metadata():
    prompt_text = request.args.get('prompt_text', '')
    enhancement_level = request.args.getlist('qualities')
    authors = request.args.getlist('author')
    limit = request.args.get('limit', None)
    limit = int(limit) if limit is not None else None
    offset = int(request.args.get('offset', 0))

    # Extract dynamic parameters from the request
    param_filters = {}
    for param in request.args:
        if param.startswith('param_'):
            param_name = param[6:]  # Remove 'param_' prefix
            param_value = request.args.get(param)
            try:
                param_filters[param_name] = float(param_value)  # Convert numeric values
            except ValueError:
                param_filters[param_name] = param_value

    logger.debug(f"Received request with: prompt_text={prompt_text}, enhancement_level={enhancement_level}, authors={authors}, limit={limit}, offset={offset}, params={param_filters}")

    sql_query, count_query, params = get_filtered_image_data(prompt_text, enhancement_level, authors, limit, offset, param_filters)

    logger.debug(f"Executing count query: {count_query} with params: {params}")
    total_count_result = db.session.execute(count_query, params)
    total_count = total_count_result.scalar()

    # If total_count is zero, return immediately with an empty response
    if total_count == 0:
        logger.debug("No results found.")
        return jsonify({"results": [], "totalCount": 0})

    logger.debug(f"Executing query: {sql_query} with params: {params}")
    data_result = db.session.execute(sql_query, params)
    filtered_data = []
    for row in data_result:
        row_data = dict(row._mapping)
        
        # Separate parameters fields from the rest
        parameters_data = {key: value for key, value in row_data.items() if key in parameters_columns and value is not None}
        non_parameters_data = {key: value for key, value in row_data.items() if key not in parameters_columns}

        # Add the separated parameters data into a 'parameters' field
        non_parameters_data['parameters'] = parameters_data
        filtered_data.append(non_parameters_data)

    result = {
        "results": filtered_data,
        "totalCount": total_count
    }
    return jsonify(result)


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
