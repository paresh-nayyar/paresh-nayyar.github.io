import json
import socket
import requests
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

from flask_cors import CORS, cross_origin
from flask import Flask, Response, jsonify, render_template, request

API_KEY = 'c7u8f0qad3ifisk2k340'

app = Flask(__name__)
CORS(app)


@app.errorhandler(404)
def page_not_found():
    return "<h1>404</h1><p>The resource could not be found.</p>"


@app.route("/", methods=['GET'])
@cross_origin(origin="*")
def home():
    return "Hello FinHub Application"


@app.route("/company_info", methods=['GET'])
@cross_origin(origin="*")
def company_info():
    query_parameters = request.args
    get_symbol = query_parameters.get('symbol')
    api_endpoint = "https://finnhub.io/api/v1/stock/profile2"

    get_data = {'token': API_KEY,
                'symbol': get_symbol}

    response_stock = requests.get(url=api_endpoint, params=get_data)

    return response_stock.json()


@app.route("/stock_quote", methods=['GET'])
@cross_origin(origin="*")
def company_quote():
    query_parameters = request.args
    get_symbol = query_parameters.get('symbol')

    api_quote_endpoint = "https://finnhub.io/api/v1/quote"
    api_rec_endpoint = "https://finnhub.io/api/v1/stock/recommendation"

    get_quote_data = {'token': API_KEY,
                      'symbol': get_symbol}

    get_rec_data = {'token': API_KEY,
                    'symbol': get_symbol}

    response_quote = requests.get(url=api_quote_endpoint, params=get_quote_data)
    response_rec = requests.get(url=api_rec_endpoint, params=get_rec_data)

    result = {'quote': response_quote.json(), 'rec': response_rec.json()}

    return result


@app.route("/charts", methods=['GET'])
@cross_origin(origin="*")
def company_charts():
    query_parameters = request.args
    get_symbol = query_parameters.get('symbol')

    api_endpoint = "https://finnhub.io/api/v1/stock/candle"

    current_date = datetime.now()
    start_date = current_date + relativedelta(months=-6) + timedelta(days=-1)

    get_data = {'token': API_KEY,
                'symbol': get_symbol,
                'resolution': 'D',
                'from': int(start_date.timestamp()),
                'to': int(current_date.timestamp()),
                }

    response_chart = requests.get(url=api_endpoint, params=get_data)

    return response_chart.json()


@app.route("/latest_news", methods=['GET'])
@cross_origin(origin="*")
def company_news():
    query_parameters = request.args
    get_symbol = query_parameters.get('symbol')

    api_endpoint = "https://finnhub.io/api/v1/company-news"

    current_date = datetime.now()
    start_date = current_date + timedelta(days=-30)

    get_data = {'token': API_KEY,
                'symbol': get_symbol,
                'from': start_date.strftime("%Y-%m-%d"),
                'to': current_date.strftime("%Y-%m-%d"),
                }

    response_news = requests.get(url=api_endpoint, params=get_data)
    get_company_news = {'latest_news': response_news.json()}

    return get_company_news


if __name__ == '__main__':
    # hostname = socket.gethostname()
    # address = socket.gethostbyname(hostname)
    # app.run(host=address, port=5005 , debug=True)
    app.run()
