from flask import Flask, render_template, url_for, request, session, redirect
from util import json_response

import data_handler
import util


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
        pass
    return render_template('login.html')


@app.route('/logout', methods=["GET", "POST"])
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route('/registration', methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username, password = request.form["username"],request.form["password"]
        data_handler.register(username, password)
        return redirect(url_for("login"))
    return render_template('registration.html')





@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-cards/<int:board_id>/get-statuses/<int:status_id>")
@json_response
def get_cards_for_board(board_id: int, status_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """

    return data_handler.get_cards_for_board(board_id, status_id)


@app.route("/get-statuses")
@json_response
def get_statuses():
    """
    All the statuses
    """
    return data_handler.get_statuses()


@app.route("/get-statuses/<int:status_id>")
@json_response
def get_card_by_status(status_id: int):
    """
    All cards that belongs to a board
    :param status_id: id of the parent board
    """
    return data_handler.get_card_by_status(status_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
