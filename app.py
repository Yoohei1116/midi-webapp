# app.py
from flask_socketio import SocketIO, emit
from flask import Flask, render_template, request, redirect, url_for
from flask_mail import Mail, Message

app = Flask(__name__)
socketio = SocketIO(app)

# Flask-Mailの設定
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'midi.webapp@gmail.com'
app.config['MAIL_PASSWORD'] = 'nujt owzx zulg lcif'

mail = Mail(app)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/subpage')
def subpage():
    return render_template('subpage.html')

@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    name = request.form['name']
    email = request.form['email']
    message = request.form['message']
    
    # メールの送信
    msg = Message('お問い合わせ', sender='midi.webapp@gmail.com', recipients=['midi.webapp@gmail.com'])
    msg.body = f"Name: {name}\nEmail: {email}\nMessage: {message}"
    mail.send(msg)
    
    return redirect(url_for('subpage'))

if __name__ == '__main__':
    socketio.run(app, debug=True)
