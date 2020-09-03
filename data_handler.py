import util
from psycopg2.extras import RealDictCursor
import bcrypt
from flask import redirect

# TODO what's the difference, and where to use cursor/RealDictCursor


@util.connection_handler
def get_boards(cursor):
    """
    Gather all boards
    :return:
    """
    query = f"""
            SELECT * FROM board
            ORDER BY title;
            """
    cursor.execute(query)
    return cursor.fetchall()


@util.connection_handler
def get_cards_for_board(cursor, board_id, status_id):
    query = """
                SELECT * FROM card
                WHERE board_id = %(board_id)s AND status_id=%(status_id)s
                ORDER BY  title;
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
def create_board(cursor: RealDictCursor, username, board_title):
    user_id = get_user(username)["id"]
    cursor.execute("""
        INSERT INTO board
        VALUES (DEFAULT, %(board_title)s, %(user_id)s)
    """, {'board_title': board_title, 'user_id': user_id})


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
        """,{'username': username})
    return cursor.fetchone()


def hash_password(plain_text_password):
    # By using bcrypt, the salt is saved into the hash itself
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)
