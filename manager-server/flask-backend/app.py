from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'dev'
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql+psycopg2://postgres:{os.getenv('DB_PASSWORD')}@midjourney-db.crusowko6eee.us-east-2.rds.amazonaws.com/midjourney-db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route('/data', methods=['GET'])
def get_data():
    sql_query = text("SELECT id, prompt_date, prompt_text, url, enhancement_level, s3_url, author FROM image")
    result = db.session.execute(sql_query)
    data = [dict(row._mapping) for row in result]
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
