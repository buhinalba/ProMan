import util
from psycopg2.extras import RealDictCursor

def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


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
def get_cards_for_board(cursor: RealDictCursor, board_id):
    """persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards"""
    query = """
                SELECT * FROM card
                WHERE board_id = %(board_id)s
                ORDER BY  title;
                """
    cursor.execute(query, {'board_id': board_id})
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

