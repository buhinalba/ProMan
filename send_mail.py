import smtplib
from email.mime.text import MIMEText


def send_mail(username, message):
    port = 2525
    smtp_server = 'smtp.mailtrap.io'
    login = 'dbb752b08814f6'
    password = '8e9fbc64a707ee'
    message = f"<h3>New Feedback Submission</h3><ul><li>Username: {username}</li><li>Message: {message}</li></ul>"

    sender_email = f'{username}@example.com'
    receiver_email = 'staff@noobman.com'
    msg = MIMEText(message, 'html')
    msg['Subject'] = 'ProMan Feedback'
    msg['From'] = sender_email
    msg['To'] = receiver_email

    # Send email
    with smtplib.SMTP(smtp_server, port) as server:
        server.login(login, password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
