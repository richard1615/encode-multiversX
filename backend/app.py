from imports import *

# Loading .env file
load_dotenv()

# Amazon S3 Setup
s3 = boto3.client("s3")
bucket_name = "mxai-contract"

app = Flask(__name__)
CORS(app)

# Supabase Setup
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Global Variables
chat_id: int = 0
repo_path = "../ml/github-scrapper/code_scrapped"

# ChatGPT System Pormpt
system_message = SystemMessage(
    content="""You are a specialized AI, designed to act as an chatbot that help facilitate blockchain transaction

-- When asked to generate a contract invoke the generate contract function while passing in the english description of the task
-- After calling the send transaction tool create a message that contains $start$reciver_address|value$end$
-- The generated contract code url should be sent in this format #wasmstart# url #wasmend#
"""
)

agent_kwargs = {
    "system_message": system_message,
}

## Code Generation Setup Process

## Loading Code from local repo
print("(1/4) Loading Code...")
loader = GenericLoader.from_filesystem(
    repo_path,
    glob="**/*",
    suffixes=[".rs"],
    parser=LanguageParser(language=Language.RUST, parser_threshold=500),
)
documents = loader.load()
len(documents)

print("(2/4) Splitting Code...")
rust_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.RUST, chunk_size=2000, chunk_overlap=200
)
texts = rust_splitter.split_documents(documents)
print(f"Split {len(texts)} documents")


print("(3/4) Creating Vector Store...")
db = Chroma.from_documents(texts, OpenAIEmbeddings(disallowed_special=()))

retriever_code = db.as_retriever(
    search_type="mmr",  # Also test "similarity"
    search_kwargs={"k": 8},
)

print("(4/4) Creating Q and A Retreival Agent for Code...")
llm_gen = ChatOpenAI(model_name="gpt-4")
memory = ConversationSummaryMemory(
    llm=llm_gen, memory_key="chat_history", return_messages=True
)
qa = ConversationalRetrievalChain.from_llm(
    llm_gen, retriever=retriever_code, memory=memory
)

print("Done (1/2)!")


# Document Retreival Setup Process
print("(1/1) Creating Retrival Tool for Q and A")
embeddings = OpenAIEmbeddings()
db = DeepLake(
    dataset_path="./qanda_mx2/", embedding_function=embeddings, read_only=True
)
retriever_docs = db.as_retriever()

retriever_tool = create_retriever_tool(
    retriever_docs,
    "search_multiversx_docs",
    "Searches and returns information regarding the multiversx blockchain ecosystem.",
)

print("Done (2/2)!")


def code_geneartion(text):
    return qa(text)["answer"]


class CodeGenerationInput(BaseModel):
    """Inputs for code_geneartion"""

    text: str = Field(..., description="The text to generate code from")


class CodeGenerationTool(BaseTool):
    name = "code_geneartion"
    description = """
        Useful when you want to generate and compile code.
        The input is a single string field expecting the english description task that the code should do.
        Output is the compiled WASM code link.
        """
    args_schema: Type[BaseModel] = CodeGenerationInput

    def _run(self, text: str):
        global chat_id
        print("Generating code...")
        code = code_geneartion("Generate multiversx contract code: " + text)
        # store in supabase
        try:
            result = (
                supabase.table("messages")
                .insert(
                    {
                        "text": code,
                        "is_bot": True,
                        "conversation_id": chat_id,
                    }
                )
                .execute()
            )
        except Exception as e:
            print(e, "chat id must be valid")
            return "Couldn't deploy but here is code: " + code

        match = re.search(r"```rust\n(.*?)```", code, re.DOTALL)

        # check if rust_code is not empty
        if not match:
            return "Error Generating Rust Code"

        rust_code = match.group(1)
        print("Storing Code...")

        # Replace the entire line that starts with "pub trait" with "pub trait BasicCode {"
        rust_code = re.sub(
            r"^pub trait.*$", "pub trait BasicCode {", rust_code, flags=re.MULTILINE
        )

        ## safe the code in a file
        with open("../ml/code/basic_code/src/basic_code.rs", "w") as f:
            f.write(rust_code)

        print("Building Code...")
        if run_command("cd ../ml/code/basic_code && sc-meta all build") == False:
            return "Code could not be compiled"

        print("Uploading Code...")
        # upload to s3 with timestamp
        s3_key = f"basic_code_{time.time()}.wasm"
        s3.upload_file(
            f"../ml/code/basic_code/output/basic_code.wasm", bucket_name, s3_key
        )
        url = f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"

        return url

    def _arun(self, text: str):
        raise NotImplementedError("code_geneartion does not support async")


def run_command(command):
    global chat_id
    # Using subprocess.run() method to run the shell command
    process = subprocess.Popen(
        command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True
    )
    output, error = process.communicate()

    if process.returncode != 0:
        print(f"Error occurred: {error.decode().strip()}")
        try:
            # store in supabase with relavent flags for frontend
            result = (
                supabase.table("messages")
                .insert(
                    {
                        "text": f"Error occurred: #errorstart#{error.decode().strip()}#errorend#",
                        "is_bot": True,
                        "conversation_id": chat_id,
                    }
                )
                .execute()
            )
        except Exception as e:
            print(e, "chat id must be valid")
        return False
    else:
        print(f"Output: {output.decode().strip()}")
        return True


@app.route("/")
def index():
    return jsonify(message="Welcome to the MxAI API!")


@app.route("/generate", methods=["GET", "POST"])
def generate_output():
    global chat_id
    try:
        data = request.get_json()
    except:
        return jsonify(message="Invalid JSON")
    if data is None:
        return jsonify(message="No JSON")
    if data["openAIKey"] is None or data["openAIKey"] == "":
        print("no open ai key")
        return jsonify(message="No OpenAI Key")
    if data["text"] is None or data["text"] == "":
        print("no text")
        return jsonify(message="No Text")
    if data["user_id"] is None or data["user_id"] == "":
        print("no user id")
        return jsonify(message="No User ID")
    if data["chat_id"] is None or data["chat_id"] == "":
        print("no chat id")
        return jsonify(message="No Chat ID")
    try:
        data["chat_id"] = int(data["chat_id"])
        chat_id = data["chat_id"]
    except:
        print("chat_id must be a number")
        return jsonify(message="chat_id must be a number")

    os.environ["OPENAI_API_KEY"] = data["openAIKey"]
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

    # Initialize Agent
    tools = [
        GetAccountBalanceTool(),
        SendTransactionTool(),
        CodeGenerationTool(),
        retriever_tool,
    ]
    agent = initialize_agent(
        tools,
        llm,
        agent=AgentType.OPENAI_FUNCTIONS,
        verbose=True,
        agent_kwargs=agent_kwargs,
    )

    output = agent.run(data["text"])

    # Store the output in supabase
    try:
        result = (
            supabase.table("messages")
            .insert(
                {
                    "text": output,
                    "is_bot": True,
                    "conversation_id": data["chat_id"],
                }
            )
            .execute()
        )
    except Exception as e:
        print(e, "chat id must be valid")
        return jsonify(message="chat_id must be valid")
    return jsonify(message="Success")


if __name__ == "__main__":
    app.run(debug=True, port=8000)
