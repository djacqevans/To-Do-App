import mysql.connector

DB_CONFIG = {
      'host': 'localhost',
      'database': 'portfolio_projects',
      'user': 'root',
      'password': ''
}

class connection:
      def __init__(self):
            self.conn = ''
            self.cursor = ''
      

      def openConn(self):
            try:
                  self.conn = mysql.connector.connect(**DB_CONFIG)
                  self.cursor = self.conn.cursor()
                  print('Connessione riuscita')
            except mysql.connector.Error as err:
                  print(f"Errore MySQL: {err}")
            except Exception as e:
                  print(f"Errore generico: {e}")

      def sqlQuery(self, query, param=None, fetch=False):
            if not self.conn and not self.cursor:
                  raise Exception('connection not active')

            try:

                  self.cursor.execute(query, param)
                  print('query riuscita')

                  if fetch:
                        result = self.cursor.fetchall()
                        return result
                  else:
                        self.conn.commit()
            except Exception as e:
                  print(f'an error occurred {e}')

      def closeConn(self):
            if self.cursor:
                  self.cursor.close()
                  print('cursor closed')

            if self.conn:
                  self.conn.close()
                  print('conn closed')

           



           
