from flask import Flask, render_template, url_for, request, session, redirect, jsonify, make_response
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        session["username"] = request.form["username"]
        return redirect(url_for(""))
    return render_template('login.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/create-board", methods=["POST"])
def create_board():
    if "username" in session:
        username = session["username"]
    else:
        username = None
    req = request.get_json(force=True)
    print(req)
    data_handler.create_board("pistike", req["board_title"])
    return make_response(jsonify({"message": "OK"}), 200)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
