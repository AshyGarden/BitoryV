
# # 설치
# # pip install python-dotenv
# # pip install langchain
# # pip install openai
# # pip install -q -U google-generativeai

# from dotenv import load_dotenv
# import os

# #토큰 정보 로드
# load_dotenv()

# os.environ["LANGCHAIN_PROJECT"] = "Runnables"

# # jemini key
# os.environ["GOOGLE_API_KEY"] = "AIzaSyBS4It4Ea-DyPYBGaApgxgVAqtDClYjuo8"

# from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
# from langchain_core.output_parsers import StrOutputParser

# output_parser = StrOutputParser()


# # 1. 질문을 입력받는다
# # 2. 프롬프트로 질문이 들어간다
# # 3. 프롬프트를 모델로 전달한다
# # 4. 결과를 출력한다

# from langchain.prompts import PromptTemplate

# # prompt = PromptTemplate.from_template("""{country}의 수도가 어디고, {capital}의 날씨 알려줘""")
# prompt = PromptTemplate.from_template("""현재 주가 정보 항목은 '종목명|현재가|대비|시가|고가|저가|등락률|현재날짜|예측가격|예측하는날짜|내가구매한개수|내가구매한가격' 이 순서야

# KRW-BTC|67,106,000|-203,000|67,309,000|67,370,000|66,800,000|0.30%|2020년10월10일|69,309,000|2020년10월11일|267,309,000

# KRW-ETH|3,576,000|-4,000|3,580,000|3,580,000|3,550,000|0.11%|2020년10월10일|3,380,000|2020년10월11일|6|3,580,000

# KRW-SOL|152,750|200|152,550|153,300|150,000|0.13%|2020년10월10일|302,550|2020년10월11일|0|0

# KRW-XRP|708|-3|711|711|706|0.48%|2020년10월10일|711|2020년10월11일|12|708

# 위에 작성한 현재 투자 내역을 바탕으로 투자 내역을 아래 조건들을 포함해 보고서 형식으로 작성해서 정리해줘
# 조건1: 예측 가격과 현재 가격을 기반으로 어떤 시점에 어떤 코인을 사고 어떤 코인을 파는 게 맞을지도 포함해서 얘기해줘
# 조건2: 내용을 바탕으로 구매자의 상황에 맞게 투자 전략과 향후 관리 방법을 추천해줘
# 조건3: 예측 가격에 따른 매매 전략을 알려줘""")

# prompt 

# # from langchain_openai import ChatOpenAI
# # model = ChatOpenAI(openai_api_key="")

# # gemini
# from langchain_google_genai import ChatGoogleGenerativeAI
# model = ChatGoogleGenerativeAI(model="gemini-pro")

# chain = prompt | model | output_parser

# type_check_str = chain.invoke({"country": "대한민국", "capital" : "서울"})

# # 실시간 데이터
# stock_name = ''
# current_price = ''
# price_change = ''
# opening_price = ''
# high_price = ''
# low_price = ''
# price_fluctuation = ''
# current_date = ''

# # 예측 데이터
# predicted_price = ''
# prediction_date = ''

# #유저 구매 내역
# purchase_quantity = ''
# purchase_price = ''

# #타입 체크 및 출력
# type_check_map = {"Answer" : type_check_str}
# print(type(type_check_str))
# print(type_check_str)
# print(type(type_check_map))



import logging
from fastapi import FastAPI
from pydantic import BaseModel
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os


#토큰 정보 로드
load_dotenv()

os.environ["LANGCHAIN_PROJECT"] = "Runnables"

# jemini key
os.environ["GOOGLE_API_KEY"] = "AIzaSyBS4It4Ea-DyPYBGaApgxgVAqtDClYjuo8"


from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser

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

    prompt_test = """현재 주가 정보 항목은 '기간|시간|현재가|수수료포함|종목명|구매수량|매수/매도' 이 순서야

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

# FastAPI 애플리케이션 실행을 위해서는 `uvicorn` 명령어를 사용합니다.
# 터미널에서 다음 명령어를 실행하세요: uvicorn index:app --reload
# 여기서 `main`은 이 Python 스크립트 파일의 이름입니다. 만약 파일 이름이 `index.py`라면, `uvicorn index:app --reload`을 사용합니다.
import sys

# FastAPI 애플리케이션 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("index:app", host="0.0.0.0", port=8000, log_level="info", access_log=True)