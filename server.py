from flask import (Flask, render_template, request, flash, session, redirect)

from pprint import pformat
import os

app = Flask(__name__)
app.secret_key = "dev"

# This configuration for Flask interactive debugger
# REMOVE IN PRODUCTION
app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True


OW_API_KEY = os.environ['OPEN_WEATHER_KEY']


@app.route('/')
def homepage():
    """Show homepage."""
    
    return render_template('homepage.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
