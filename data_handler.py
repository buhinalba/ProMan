import util
from psycopg2.extras import RealDictCursor
import bcrypt
from flask import redirect


@util.connection_handler
def get_boards(cursor, user_id):
    """
    Gather all boards
    :return:
    """
    query_private = f"""
            SELECT * FROM board
            WHERE user_id = %(user_id)s
            ORDER BY id;
            """
    query_public = """
            SELECT * FROM board
            WHERE user_id IS NULL
            ORDER BY id;
            """
    query = query_private if user_id else query_public
    cursor.execute(query, {'user_id': user_id})
    return cursor.fetchall()


@util.connection_handler
def get_cards_for_board(cursor, board_id, status_id):
    query = """
                SELECT * FROM card
                WHERE board_id = %(board_id)s AND status_id=%(status_id)s
                ORDER BY  "order" ;
                """
    cursor.execute(query, {'board_id': board_id, 'status_id': status_id})
    return cursor.fetchall()


@util.connection_handler
def get_statuses(cursor, board_id):
    query = """
                SELECT * FROM status
                WHERE board_id = %(board_id)s
                ORDER BY id;
                """

    cursor.execute(query, {"board_id": board_id})
    return cursor.fetchall()


@util.connection_handler
def create_status(cursor: RealDictCursor, status_title, board_id):
    query = """
                INSERT INTO status (title, board_id)
                VALUES (%(status_title)s, %(board_id)s);
                """
    cursor.execute(query, {'status_title': status_title, 'board_id': board_id})


@util.connection_handler
def create_board(cursor: RealDictCursor, username, board_title):
    user_id = get_user(username)["id"] if username else None
    cursor.execute("""
        INSERT INTO board
        VALUES (DEFAULT, %(board_title)s, %(user_id)s)
    """, {'board_title': board_title, 'user_id': user_id})


@util.connection_handler
def create_card(cursor: RealDictCursor, board_id, card_title, status_id):
    cursor.execute("""
        INSERT INTO card(id, board_id, title, status_id, "order")
        VALUES (DEFAULT, %(board_id)s, %(card_title)s, %(status_id)s, 1)
    """, {'board_id': board_id, 'card_title': card_title, 'status_id': status_id})


@util.connection_handler
def leave_feedback(cursor: RealDictCursor, username, message):
    cursor.execute("""
            INSERT INTO feedback(username, message)
            VALUES (%(username)s, %(message)s)
        """, {'username': username, 'message': message})


@util.connection_handler
def create_default_statuses(cursor: RealDictCursor, max_id):
    cursor.execute("""
        INSERT INTO status (title, board_id)
        VALUES
        ('new', %(board_id)s),
        ('in progress', %(board_id)s),
        ('testing', %(board_id)s),
        ('done', %(board_id)s)
    """, {'board_id': max_id})


@util.connection_handler
def get_user(cursor: RealDictCursor, username):
    query = """
        SELECT * FROM "user"
            WHERE username = %(username)s
        """
    cursor.execute(query, {'username': username})
    return cursor.fetchone()


@util.connection_handler
def get_latest_board_id(cursor: RealDictCursor):
    cursor.execute("""
        SELECT max(id) FROM board
    """)
    return cursor.fetchone()


@util.connection_handler
def get_card_by_status(cursor, status_id):
    query = """
                SELECT * FROM card
                WHERE status_id = %(status_id)s
                ORDER BY title;
                """

    cursor.execute(query, {'status_id': status_id})
    return cursor.fetchall()


@util.connection_handler
def register(cursor: RealDictCursor, username, password):
    password = hash_password(password)
    cursor.execute("""
        INSERT INTO "user"
        VALUES(DEFAULT, %(username)s, %(password)s)
        ON CONFLICT
        DO NOTHING
        """, {'username':username, 'password':password})


@util.connection_handler
def get_user(cursor: RealDictCursor, username):
    cursor.execute("""
        SELECT * FROM "user" 
        WHERE username like %(username)s
        """, {'username': username})
    return cursor.fetchone()


@util.connection_handler
def rename_board(cursor: RealDictCursor, board_id, board_title):
    cursor.execute("""
        UPDATE board
            SET title = %(board_title)s
            WHERE id = %(board_id)s;
        """, {'board_id': board_id, 'board_title': board_title})


@util.connection_handler
def rename_status(cursor: RealDictCursor, status_id, status_title):
    cursor.execute("""
        UPDATE status
            SET title = %(status_title)s
            WHERE id = %(status_id)s;
        """, {'status_id': status_id, 'status_title': status_title})


@util.connection_handler
def rename_card(cursor: RealDictCursor, card_title, card_id):
    query = """
                UPDATE card
                SET title = %(card_title)s
                WHERE id = %(card_id)s;
                """
    cursor.execute(query, {'card_title': card_title, 'card_id': card_id})


@util.connection_handler
def delete_board(cursor: RealDictCursor, board_id):
    query = """
            DELETE
            FROM card
            WHERE board_id = %(board_id)s;
            """
    cursor.execute(query, {'board_id': board_id}),
    query1 = """
            DELETE
            FROM status
            WHERE board_id = %(board_id)s;
            """
    cursor.execute(query1, {'board_id': board_id}),
    query2 = """
                DELETE
                FROM board
                WHERE id = %(board_id)s;
                """
    cursor.execute(query2, {'board_id': board_id})


@util.connection_handler
def delete_status(cursor: RealDictCursor, status_id):
    query = """
            DELETE
            FROM card
            WHERE status_id = %(status_id)s;
            """
    cursor.execute(query, {'status_id': status_id}),
    query1 = """
            DELETE
            FROM status
            WHERE id = %(status_id)s;
            """
    cursor.execute(query1, {'status_id': status_id})


@util.connection_handler
def delete_card(cursor: RealDictCursor, card_id):
    query = """
            DELETE
            FROM card
            WHERE id = %(card_id)s;
            """
    cursor.execute(query, {'card_id': card_id})


@util.connection_handler
def update_card(cursor, card_id, status_id, previous_order):
    query = """
    UPDATE card
    SET status_id = %(status_id)s, "order" = %(prev_order)s + 1
    WHERE id = %(card_id)s
    """
    cursor.execute(query, {"status_id": status_id, "prev_order": previous_order, "card_id": card_id})


@util.connection_handler
def update_sibling_cards(cursor, status_id, previous_order):
    query = """
    UPDATE card
    SET "order" = "order" + 1
    WHERE status_id = %(status_id)s and "order" > %(prev_order)s
    """
    cursor.execute(query, {"status_id": status_id, "prev_order": previous_order})


def hash_password(plain_text_password):
    # By using bcrypt, the salt is saved into the hash itself
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)
