from flask import Flask

def create_app():
      app = Flask(__name__)

      from app.routes.todo import todo
      app.register_blueprint(todo, url_prefix='/api')

      return app