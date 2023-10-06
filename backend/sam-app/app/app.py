from flask import Flask, jsonify, request 
import json
from langchain.agents import initialize_agent
from langchain.chat_models import ChatOpenAI
from langchain.agents import AgentType
import os
from langchain.chat_models import ChatOpenAI
from tools.custom_multix_tools import (GetAccountBalanceTool)
from dotenv import load_dotenv
from supabase import create_client, Client
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.route('/')
def index():
    return jsonify(message="Welcome to the MxAI API!")



@app.route('/generate', methods=['GET'])
def generate_output():
    try:
        data = request.get_json()
    except:
        return jsonify(message="Invalid JSON")
    if data is None:
        return jsonify(message="No JSON")
    if data['openAIKey'] is None or data['openAIKey'] == "":
        print("no open ai key")
        return jsonify(message="No OpenAI Key")
    if data['text'] is None or data['text'] == "":
        print("no text")
        return jsonify(message="No Text")
    if data['user_id'] is None or data['user_id'] == "":
        print("no user id")
        return jsonify(message="No User ID")
    if data['chat_id'] is None or data['chat_id'] == "":
        print("no chat id")
        return jsonify(message="No Chat ID")
    try:
        data['chat_id'] = int(data['chat_id'])
    except:
        print('chat_id must be a number')
        return jsonify(message="chat_id must be a number")
    
    # conversation_exists = supabase.table('conversations') \
    #     .select('id') \
    #     .eq('id', data['chat_id']) \
    #     .execute()
    # if not conversation_exists:
    #     print("Wrong conversation ID")
    #     return jsonify(message="Wrong conversation ID")    

    os.environ["OPENAI_API_KEY"] = data['openAIKey']
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
    tools = [
        GetAccountBalanceTool()
    ]
    agent = initialize_agent(tools,
                             llm,
                             agent=AgentType.OPENAI_FUNCTIONS,
                             verbose=True)
    
    output = agent.run(data['text'])

    # store in supabase
    try:
        result = supabase.table('messages') \
            .insert({
                "text": output,
                "is_bot": True,
                "conversation_id": data['chat_id'],
            }) \
            .execute()
    except Exception as e:
        print(e, "chat id must be valid")
        return jsonify(message="chat_id must be valid")
    return jsonify(message="Success")

if __name__ == '__main__':
    app.run()