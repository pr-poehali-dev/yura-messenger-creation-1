"""
API для работы с сообщениями мессенджера.
GET  /?chat_id=... — получить сообщения чата
POST / — отправить сообщение
GET  /chats?user_id=... — получить список чатов пользователя
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def ensure_schema(cur):
    cur.execute(f"""
        CREATE TABLE IF NOT EXISTS {SCHEMA}.users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            avatar TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'offline',
            about TEXT,
            phone TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)
    cur.execute(f"""
        CREATE TABLE IF NOT EXISTS {SCHEMA}.chats (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL DEFAULT 'personal',
            name TEXT NOT NULL,
            avatar TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)
    cur.execute(f"""
        CREATE TABLE IF NOT EXISTS {SCHEMA}.chat_members (
            chat_id TEXT NOT NULL REFERENCES {SCHEMA}.chats(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL REFERENCES {SCHEMA}.users(id) ON DELETE CASCADE,
            role TEXT NOT NULL DEFAULT 'member',
            joined_at TIMESTAMPTZ DEFAULT NOW(),
            PRIMARY KEY (chat_id, user_id)
        )
    """)
    cur.execute(f"""
        CREATE TABLE IF NOT EXISTS {SCHEMA}.messages (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
            chat_id TEXT NOT NULL REFERENCES {SCHEMA}.chats(id) ON DELETE CASCADE,
            sender_id TEXT NOT NULL,
            text TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'text',
            read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)
    cur.execute(f"CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON {SCHEMA}.messages(chat_id, created_at)")

    # Seed if empty
    cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users")
    if cur.fetchone()[0] == 0:
        seed_data(cur)

def seed_data(cur):
    users = [
        ('u0','Алексей Громов','АГ','online','Всегда на связи 🚀','+7 999 123-45-67'),
        ('u1','Марина Волкова','МВ','online','Люблю путешествия ✈️',None),
        ('u2','Дмитрий Соколов','ДС','online','Разработчик 💻',None),
        ('u3','Анна Петрова','АП','away','Дизайнер 🎨',None),
        ('u4','Кирилл Захаров','КЗ','offline','Музыкант 🎸',None),
        ('u5','Ольга Смирнова','ОС','busy','В рабочем режиме',None),
        ('u6','Павел Новиков','ПН','online','Фотограф 📸',None),
        ('u7','Екатерина Лебедева','ЕЛ','offline','☕ Кофе и книги',None),
        ('u8','Никита Орлов','НО','online','Предприниматель 🚀',None),
    ]
    for u in users:
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (id,name,avatar,status,about,phone) VALUES (%s,%s,%s,%s,%s,%s) ON CONFLICT DO NOTHING",
            u
        )

    chats = [
        ('c1','personal','Марина Волкова','МВ'),
        ('c2','group','Команда разработки 🚀','🚀'),
        ('c3','personal','Дмитрий Соколов','ДС'),
        ('c4','group','Друзья 🎮','🎮'),
        ('c5','personal','Анна Петрова','АП'),
        ('c6','personal','Ольга Смирнова','ОС'),
    ]
    for c in chats:
        cur.execute(
            f"INSERT INTO {SCHEMA}.chats (id,type,name,avatar) VALUES (%s,%s,%s,%s) ON CONFLICT DO NOTHING",
            c
        )

    members = [
        ('c1','u0','member'),('c1','u1','member'),
        ('c2','u0','admin'),('c2','u2','admin'),('c2','u3','member'),('c2','u5','member'),('c2','u8','member'),
        ('c3','u0','member'),('c3','u2','member'),
        ('c4','u0','admin'),('c4','u4','member'),('c4','u6','member'),('c4','u8','member'),
        ('c5','u0','member'),('c5','u3','member'),
        ('c6','u0','member'),('c6','u5','member'),
    ]
    for m in members:
        cur.execute(
            f"INSERT INTO {SCHEMA}.chat_members (chat_id,user_id,role) VALUES (%s,%s,%s) ON CONFLICT DO NOTHING",
            m
        )

    seed_msgs = [
        ('m1','c1','u1','Привет! Как дела?',True,'82 minutes'),
        ('m2','c1','u0','Всё отлично! Работаю над новым проектом',True,'77 minutes'),
        ('m3','c1','u1','Круто! Расскажи подробнее 😊',True,'72 minutes'),
        ('m4','c1','u0','Это мессенджер нового поколения',True,'67 minutes'),
        ('m5','c1','u1','Отлично, увидимся завтра! 🎉',False,'60 minutes'),
        ('m6','c2','u2','Народ, я завершил задачу по авторизации',True,'160 minutes'),
        ('m7','c2','u3','Я обновила макеты, посмотрите в Figma',True,'145 minutes'),
        ('m8','c2','u0','Принято! Начинаю ревью',True,'135 minutes'),
        ('m9','c2','u5','Тесты написала, всё зелёное ✅',False,'130 minutes'),
        ('m10','c2','u2','Деплой прошёл успешно 🎉',False,'125 minutes'),
        ('m11','c3','u2','Привет, можешь глянуть мой PR?',True,'190 minutes'),
        ('m12','c3','u0','Конечно, сейчас посмотрю',True,'185 minutes'),
        ('m13','c3','u2','Спасибо за код-ревью!',True,'180 minutes'),
        ('m14','c4','u6','Привет всем! Новые фотки выложил',False,'1440 minutes'),
        ('m15','c4','u4','Играем сегодня?',False,'1380 minutes'),
        ('m16','c5','u3','Посмотри, я обновила дизайн',False,'1560 minutes'),
        ('m17','c6','u5','Отчёт готов, отправляю',True,'4320 minutes'),
    ]
    for msg in seed_msgs:
        cur.execute(
            f"INSERT INTO {SCHEMA}.messages (id,chat_id,sender_id,text,read,created_at) "
            f"VALUES (%s,%s,%s,%s,%s, NOW() - INTERVAL '{msg[5]}') ON CONFLICT DO NOTHING",
            msg[:5]
        )

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    params = event.get('queryStringParameters') or {}

    conn = get_conn()
    cur = conn.cursor()
    ensure_schema(cur)
    conn.commit()

    try:
        # GET /chats — список чатов пользователя
        if method == 'GET' and path.endswith('/chats'):
            user_id = params.get('user_id', 'u0')
            cur.execute(f"""
                SELECT c.id, c.type, c.name, c.avatar,
                    (SELECT text FROM {SCHEMA}.messages m WHERE m.chat_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_text,
                    (SELECT to_char(m.created_at, 'HH24:MI') FROM {SCHEMA}.messages m WHERE m.chat_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_time,
                    (SELECT COUNT(*) FROM {SCHEMA}.messages m WHERE m.chat_id = c.id AND m.read = false AND m.sender_id != %s) as unread
                FROM {SCHEMA}.chats c
                JOIN {SCHEMA}.chat_members cm ON cm.chat_id = c.id
                WHERE cm.user_id = %s
                ORDER BY (SELECT MAX(created_at) FROM {SCHEMA}.messages m WHERE m.chat_id = c.id) DESC NULLS LAST
            """, (user_id, user_id))
            rows = cur.fetchall()
            chats_list = []
            for r in rows:
                # get members
                cur.execute(f"SELECT user_id, role FROM {SCHEMA}.chat_members WHERE chat_id = %s", (r[0],))
                members = [{'userId': m[0], 'role': m[1]} for m in cur.fetchall()]
                chats_list.append({
                    'id': r[0], 'type': r[1], 'name': r[2], 'avatar': r[3],
                    'lastMessage': r[4] or '', 'lastTime': r[5] or '',
                    'unread': int(r[6]), 'members': members,
                })
            conn.close()
            return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(chats_list, ensure_ascii=False)}

        # GET /?chat_id=... — сообщения чата
        if method == 'GET':
            chat_id = params.get('chat_id')
            after = params.get('after')
            if not chat_id:
                conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'chat_id required'})}
            if after:
                cur.execute(
                    f"SELECT id, chat_id, sender_id, text, type, read, to_char(created_at, 'HH24:MI'), created_at FROM {SCHEMA}.messages WHERE chat_id = %s AND created_at > %s ORDER BY created_at ASC",
                    (chat_id, after)
                )
            else:
                cur.execute(
                    f"SELECT id, chat_id, sender_id, text, type, read, to_char(created_at, 'HH24:MI'), created_at FROM {SCHEMA}.messages WHERE chat_id = %s ORDER BY created_at ASC LIMIT 100",
                    (chat_id,)
                )
            rows = cur.fetchall()
            msgs = [{'id': r[0], 'chatId': r[1], 'senderId': r[2], 'text': r[3], 'type': r[4], 'read': r[5], 'time': r[6], 'createdAt': r[7].isoformat()} for r in rows]
            conn.close()
            return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(msgs, ensure_ascii=False)}

        # POST / — отправить сообщение
        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            chat_id = body.get('chat_id')
            sender_id = body.get('sender_id', 'u0')
            text = body.get('text', '').strip()
            if not chat_id or not text:
                conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'chat_id and text required'})}
            cur.execute(
                f"INSERT INTO {SCHEMA}.messages (chat_id, sender_id, text) VALUES (%s, %s, %s) RETURNING id, to_char(created_at, 'HH24:MI'), created_at",
                (chat_id, sender_id, text)
            )
            row = cur.fetchone()
            conn.commit()
            conn.close()
            return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({
                'id': row[0], 'chatId': chat_id, 'senderId': sender_id,
                'text': text, 'type': 'text', 'read': False,
                'time': row[1], 'createdAt': row[2].isoformat()
            }, ensure_ascii=False)}

        conn.close()
        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'not found'})}

    except Exception as e:
        conn.rollback()
        conn.close()
        return {'statusCode': 500, 'headers': CORS, 'body': json.dumps({'error': str(e)})}
