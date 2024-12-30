from flask import request, jsonify, Blueprint
from flask_cors import CORS
from .conn import connection
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)

todo = Blueprint('todo', __name__)
CORS(todo)

current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')


def insertTasks(db, task_title: str):
      is_completed: bool = False
      insert_query = 'INSERT INTO todo (task_title, is_completed, created_at, updated_at) VALUES (%s, %s, %s, %s);'
      params = (task_title, is_completed, current_date, current_date)

      if db:
            db.sqlQuery(insert_query, params)
            logging.info('task inserted')
      else:
            logging.error('task not inserted')

def get_one_task(db, task_id):
      
      get_one_id_query = 'SELECT * FROM todo WHERE id = %s;'
      get_one_id_param = (task_id,)

      if db:
            task = db.sqlQuery(get_one_id_query, get_one_id_param, fetch=True)
            logging.info(f'task: {task}')

            if task and len(task) > 0:
                  task_data = task[0]  # Prendi la prima tupla
                  task_id = task_data[0]
                  task_title = task_data[1]

                  logging.info(f'task_id: {task_id}, task_title: {task_title}')
                  return (task_id, task_title)  # Restituisce il primo risultato (se esiste)
            else:
                  logging.error('task not found.')
                  return None  # Nessun risultato trovato
      else:
            return none  # Se il database non è presente

def get_tasks(db):
      get_undo_tasks = 'SELECT * FROM todo WHERE is_completed = 0;' #false
      get_done_tasks = 'SELECT * FROM todo WHERE is_completed = 1;'#true

      done_tasks = []
      undo_tasks = []

      if db:
            done_tasks = db.sqlQuery(get_done_tasks, fetch=True)
            
            undo_tasks = db.sqlQuery(get_undo_tasks, fetch=True)

            print('succesful query')

            return done_tasks, undo_tasks
      else:
            print('no query :(')

def update_task(db, task_title, is_completed, id):
     
      update_query = 'UPDATE todo SET task_title = %s, is_completed = %s, updated_at = %s WHERE id = %s;'
      update_params = (task_title, is_completed, current_date, id)

      yeah = db.sqlQuery(update_query, update_params)
      print(yeah)

def update_tasksss(db, ids, is_completed):
      placeholders = ', '.join(['%s'] * len(ids))
      move_more_query = f'UPDATE todo SET is_completed = %s, updated_at = %s WHERE id IN ({placeholders})'
      update_more_params =  [is_completed, current_date] + ids

      logging.debug(f"Generated SQL query: {move_more_query}")
      logging.debug(f"With parameters: {update_more_params}")

      if db:
            db.sqlQuery(move_more_query, update_more_params)
            print('succesful query')
      else:
            print('no query :(')

def delete_tasks(db, ids):
      placeholders = ', '.join(['%s'] * len(ids))

      move_query = f"""
      INSERT INTO deleted_tasks (id, task_title, is_completed, created_at, updated_at)
      SELECT id, task_title, is_completed, created_at, NOW()
      FROM todo
      WHERE id IN ({placeholders});
      """
      
      delete_query = f'DELETE FROM todo WHERE id IN ({placeholders});'

      # Crea i parametri per la query
      params = tuple(ids)

      if db:
            print(f"Eseguo la query: {move_query} con parametri: {params}")
            print(f"Eseguo la query: {delete_query} con parametri: {params}")

            db.sqlQuery(move_query, params)
            db.sqlQuery(delete_query, params)
      else:
            print('no query :(')




@todo.route('/todo', methods=['GET', 'POST', 'PUT', 'DELETE'])
def to_do():
      db = None
      try:
            db = connection()
            db.openConn()

            match request.method:
                  case 'GET':

                        done_tasks, undo_tasks = get_tasks(db)
                        return jsonify({'done_tasks': done_tasks,'undone_tasks': undo_tasks}), 200
                     
                  case 'POST':
                        action = request.json.get('action', '')
                        if action == 'one id':
                              task_id = request.json.get('task_id', '')
                              logging.debug('action: %s, task_id: %s', action, task_id)

                              final_id, final_title = get_one_task(db, task_id)
                              logging.debug(f'task_id: {task_id}, final_id: {final_id}, final_title: {final_title}')
                              if final_id and final_title:
                                    return jsonify({'id': final_id, 'title': final_title})
                              else:
                                    return jsonify({'response': 'no id or title'})
                        else:

                              task_title = request.json.get('task_title', '')

                              insertTasks(db, task_title)

                              #get inserted task
                              last_task_query = 'SELECT * FROM todo ORDER BY id DESC LIMIT 1'
                              last_query = db.sqlQuery(last_task_query, fetch=True)

                              if last_query:
                                    task = last_query[0]
                                    print(f'ciccio puppo {last_query}')

                                    return jsonify({
                                          'id': task[0],
                                          'task_title': task[1],
                                          'is_completed': bool(task[2]),
                                          'created_at': task[3],
                                          'updated_at': task[4]
                                    })
                              else:
                                    return jsonify({'error': "Task non trovata"}), 500

                  case 'PUT':
                        action = request.json.get('action', '')

                        if action == 'move1':
                              print('move1')
                              logging.debug(request.json)
                              is_completed = request.json.get('is_completed', 0) # Conversione a intero
                              task_title = request.json.get('task_title', '')
                              id = int(request.json.get('id', 0))  # Conversione a intero

                              update_task(db, task_title, is_completed, id)
                              return jsonify({'message': "Hai inviato una richiesta PUT"}), 200
                        elif action == 'move+':
                              print('move+')
                              ids = request.json.get('ids', [])
                              is_completed = request.json.get('is_completed', 0)

                              print(is_completed)

                              logging.debug(f"Received ids: {ids}")
                              logging.debug(f"Received is_completed: {is_completed}")

                              update_tasksss(db, ids, is_completed)

                              return jsonify({'message': 'query partita e funzione eseguita :)'})
                        elif action == 'change name task':
                              print('change task title')
                              id = request.json.get('id', '')
                              task_title = request.json.get('task_title', '')
                              is_completed = request.json.get('is_completed', '')
                              updated_at = request.json.get('updated_at', '')

                              update_task(db, task_title, is_completed, id)

                              return jsonify({'response': 'titolo della task modificata'})

                        else:
                              return jsonify({'response': 'errore nella spartizione delle funzioni di put'})

                  case 'DELETE':
                        ids = request.json.get('ids', [])
                        print(ids)

                        if not ids:  # Controlla se ids è vuoto
                              return jsonify({'error': 'Nessun ID fornito'}), 400


                        delete_tasks(db, ids)
                        return jsonify({'message': "Hai inviato una richiesta DELETE"}), 200

                  case _:
                        return jsonify({'message': "Metodo non supportato"}), 405

      except Exception as e:
            print(f"An error occurred: {e}")
            return jsonify({'error': 'Si è verificato un errore'}), 500

      finally:
            if db is not None:
                  #db.conn.commit() 
                  db.closeConn()  