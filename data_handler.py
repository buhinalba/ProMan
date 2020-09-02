import util
from psycopg2.extras import RealDictCursor


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
def get_statuses(cursor):
    query = """
                SELECT * FROM status
                ORDER BY id;
                """

    cursor.execute(query)
    return cursor.fetchall()


@util.connection_handler
def get_card_by_status(cursor, status_id):
    query = """
                SELECT * FROM card
                WHERE status_id = %(status_id)s
                ORDER BY title;
                """

    cursor.execute(query, {'status_id': status_id})
    return cursor.fetchall()
