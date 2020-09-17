from flask import Flask, render_template, url_for, request, session, redirect, jsonify, make_response, flash
from util import json_response
import secrets

import data_handler
import util


app = Flask(__name__)

app.secret_key = secrets.token_hex(12)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    if "username" in session:
        username = session["username"]
    else:
        username = None
    return render_template('index.html', username=username)


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username, password = request.form["username"], request.form["password"]
        possible_user = data_handler.get_user(username)
        if possible_user:
            valid_user = data_handler.verify_password(password, possible_user["password"])
            if valid_user:
                session["username"] = request.form["username"]
                return redirect("/")
        flash("username or password invalid")
        return redirect("/login")
    return render_template('login.html')


@app.route('/logout', methods=["GET", "POST"])
def logout():
    session.clear()
    return redirect(url_for("index"))


@app.route('/register', methods=["GET", "POST"])
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
    user_id = data_handler.get_user(session['username'])['id'] if 'username' in session else None
    return data_handler.get_boards(user_id)


@app.route("/get-cards/<int:board_id>/get-statuses/<int:status_id>")
@json_response
def get_cards_for_board(board_id: int, status_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """

    return data_handler.get_cards_for_board(board_id, status_id)


@app.route("/get-status-for-board/<int:board_id>")
@json_response
def get_statuses(board_id: int):
    """
    All the statuses
    """
    return data_handler.get_statuses(board_id)


@app.route("/get-statuses/<int:status_id>")
@json_response
def get_card_by_status(status_id: int):
    """
    All cards that belongs to a board
    :param status_id: id of the parent board
    """
    return data_handler.get_card_by_status(status_id)


@app.route("/create-board", methods=["POST"])
def create_board():
    if "username" in session:
        username = session["username"]
    else:
        username = None
    req = request.get_json(force=True)
    data_handler.create_board(username, req["board_title"])
    max_id = data_handler.get_latest_board_id()["max"]
    print(max_id)  # return None (why???)
    data_handler.create_default_statuses(max_id)
    return make_response(jsonify({"message": "OK"}), 200)


@app.route('/create-status', methods=['POST'])
def create_status():
    username = session.get('username', None)
    req = request.get_json(force=True)
    data_handler.create_status(req["status_title"], req["board_id"])
    return make_response(jsonify({"message": "OK"}), 200)


@app.route("/rename-board", methods=["POST"])
def rename_board():
    req = request.get_json(force=True)
    print(req)
    data_handler.rename_board(req['board_id'], req['board_title'])
    return make_response(jsonify({"message": "OK"}), 200)


@app.route("/rename-status", methods=["POST"])
def rename_status():
    req = request.get_json(force=True)
    data_handler.rename_status(req['status_id'], req['status_title'])
    return make_response(jsonify({"message": "OK"}), 200)


@app.route("/rename-card", methods=["POST"])
def rename_card():
    req = request.get_json(force=True)
    data_handler.rename_card(req['card_title'], req['card_id'])
    return make_response(jsonify({"message": "OK"}), 200)


@app.route("/create-card", methods=["POST"])
def create_card():
    req = request.get_json()
    data_handler.create_card(req["board_id"], req["card_title"], req["status_id"])
    return make_response(jsonify({"message": "OK"}), 200)


@app.route("/delete-board/<int:board_id>", methods=["GET"])
def delete_board(board_id):
    data_handler.delete_board(board_id)
    return make_response(jsonify({"message": "OK"}), 200)


@app.route("/delete-status/<int:status_id>", methods=["GET"])
def delete_status(status_id):
    data_handler.delete_status(status_id)
    return make_response(jsonify({"message": "OK"}), 200)


@app.route("/delete-card/<int:card_id>", methods=["GET"])
def delete_card(card_id):
    data_handler.delete_card(card_id)
    return make_response(jsonify({"message": "OK"}), 200)


@app.route("/update-card/<int:card_id>/<int:status_id>/<int:previous_order>", methods=["GET", "POST"])
def update_card(card_id, status_id, previous_order):
    data_handler.update_card(card_id, status_id, previous_order)
    data_handler.update_sibling_cards(status_id, previous_order)
    # update dropped card's status_id
    # only update card with status_id === status_id,
    # if previousSibling is null => SET card.order = 0
    # dropped card's order should be previousOder + 1,
    # increment all cards order with (order > previousOder + 1) by +1
    return make_response(jsonify({"message": "OK"}), 200)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
