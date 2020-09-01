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
def get_cards_for_board(cursor, board_id):
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
