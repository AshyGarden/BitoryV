import logging
from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from langchain_core.output_parsers import StrOutputParser

# 토큰 정보 로드
load_dotenv()
os.environ["LANGCHAIN_PROJECT"] = "Runnables"
os.environ["GOOGLE_API_KEY"] = "AIzaSyBS4It4Ea-DyPYBGaApgxgVAqtDClYjuo8"

output_parser = StrOutputParser()

app = FastAPI()

# CORS 설정: 모든 출처 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 메소드 허용 (GET, POST, DELETE 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

class TextLog(BaseModel):
    logsText: str

@app.post('/process-text-logs')
async def process_logs(log: TextLog):
    logs_text = log.logsText
    print(logs_text)

    prompt_test = """현재 주가 정보 항목은 '기간|시간|현재가|수수료포함|종목명|구매수량|매수여부(true면 매수/false면 매도)' 이 순서야

    """+logs_text+"""

    위에 작성한 현재 투자 내역을 바탕으로 투자 내역을 아래 조건들을 포함해 보고서 형식으로 작성해서 정리해줘
    조건1: 예측 가격과 현재 가격을 기반으로 어떤 시점에 어떤 코인을 사고 어떤 코인을 파는 게 맞을지도 포함해서 얘기해줘
    조건2: 내용을 바탕으로 구매자의 상황에 맞게 투자 전략과 향후 관리 방법을 추천해줘
    조건3: 예측 가격에 따른 매매 전략을 알려줘"""
    prompt = PromptTemplate.from_template(prompt_test)

    print(prompt)

    model = ChatGoogleGenerativeAI(model="gemini-pro")
    chain = prompt | model | output_parser
    type_check_str = chain.invoke({"country": "대한민국", "capital" : "서울"})

    print(type_check_str)
    try:
        return {"status": "success", "data": type_check_str}
    except Exception as e:
        logging.error(f"Error generating result: {e}")
        return {"status": "error", "message": str(e)}

# 웹소켓 핸들러
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        print(f"Received message: {data}")

        # 데이터 처리 및 모델 호출
        processed_data = await process_data(data)

        # 처리된 데이터를 클라이언트로 전송
        await websocket.send_text(f"Processed data: {processed_data}")

async def process_data(data: str):
    # 여기에 데이터 처리 및 모델 호출 로직을 추가하세요
    return "Processed data"

# FastAPI 애플리케이션 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("index:app", host="0.0.0.0", port=8000, log_level="info", access_log=True)


# FastAPI 애플리케이션 실행을 위해서는 `uvicorn` 명령어를 사용합니다.
# 터미널에서 다음 명령어를 실행하세요: uvicorn index:app --reload
# 여기서 `main`은 이 Python 스크립트 파일의 이름입니다. 만약 파일 이름이 `index.py`라면, `uvicorn index:app --reload`을 사용합니다.
