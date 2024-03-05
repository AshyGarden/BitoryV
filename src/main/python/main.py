# pip install finance-datareader prophet matplotlib seaborn plotly bs4 fastapi pyupbit
# uvicorn main:app --reload

from fastapi import FastAPI, Response
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

import pyupbit
from prophet import Prophet as prh
from prophet.plot import add_changepoints_to_plot
# from function import *

app = FastAPI()


app.add_middleware(             # cors보안 규칙 인가
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/responsePrice/{ticker1}")
async def read_root(ticker1: str):
    print(ticker1)
    pred_price1, real_price1 = get_crypto_price(ticker1)     # 전달받은 가상화폐 ticker를 함수에 인자값으로 전달
    #pred_price2, real_price2 = get_crypto_price(ticker2)


    #return [{"days":date1, "value":pred_price1}, {"days":date1, "value":real_price1},                        
    #        {"days":date1, "value":pred_price2}, {"days":date1, "value":real_price2}]           # 일시와 예측 가격데이터를 spring서버로 전달
    # return [{"days":date1, "value":pred_price1}, {"days":date1,"value":real_price1}, {"days":date2,"value":pred_price2}, {"days":date2,"value":real_price2}]           # 일시와 예측 가격데이터를 spring서버로 전달
    return pred_price1, real_price1

# @app.get("/realtimeChart/{ticker}")
# async def read_root(ticker: str):

#     pred_price, real_price, date = real_time_chart(ticker)     # 전달받은 가상화폐 ticker를 함수에 인자값으로 전달
        
#     return {"days":date, "pred_price":pred_price, "real_price":real_price}   
    #pred_price, real_price, date = get_crypto_price(ticker)     # 전달받은 가상화폐 ticker를 함수에 인자값으로 전달

    #return {"days":date, "pred_price":pred_price, "real_price":real_price}           # 일시와 예측 가격데이터를 spring서버로 전달


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}
    # pred_price, real_price, date = real_time_chart(ticker)     # 전달받은 가상화폐 ticker를 함수에 인자값으로 전달
        
    # return {"days":date, "pred_price":pred_price, "real_price":real_price}   
   # pred_price, real_price, date = real_time_chart(ticker)     # 전달받은 가상화폐 ticker를 함수에 인자값으로 전달
        
   # return {"days":date, "pred_price":pred_price, "real_price":real_price}   


# AI API
# df = pyupbit.get_ohlcv(f"KRW-BTC", count=2000, interval="minute1")


def fitting_to_real_price(df):                          # 학습 데이터를 Fitting 시키는 사용자 함수
    m = prh(                                            
    growth="linear",
    interval_width=0.95
    )

    m.fit(df)                                           # 학습데이터 Fitting

    future = m.make_future_dataframe(periods=240, freq='H')      # 예상 주기 설정

    forecast = m.predict(future)                        # 예측한 값을 forecast변수에 저장

    # forecast['yhat'] = forecast['yhat'].astype('float') # 숫자형식을 float로 변환

    # forecast['ds'] = forecast['ds'].astype('str')     # 예측과 실제 가격 추세 그래프를 양쪽으로 나눠서 그릴 수 있음
    
    return forecast                                     # 예측값 반환

# def fitting_to_real_price(df):                          # 학습 데이터를 Fitting 시키는 사용자 함수

#     window_size,forecast_size=240,24
#     ''' 1. 가공되지 않은 데이터 전처리 '''
#     date, data=split_data(df,'close')
#     ''' 2. dataloader 빌드 '''
#     dataloader=build_dataLoader(data,
#                                 window_size=window_size,
#                                 forecast_size=forecast_size,
#                                 batch_size=8)
#     ''' 3. 학습 및 검증 '''
#     pred=trainer(data,
#                 dataloader,
#                 window_size=window_size,
#                 forecast_size=forecast_size).implement() 
#     ''' 4. 결과 반환 '''
#     return date[4296:], data[4296:], pred


def get_crypto_price(ticker="BTC"):                   # 가상화폐의 가격을 가져오는 사용자 함수

    df = pyupbit.get_ohlcv(f"KRW-{ticker}", count=4320, interval="minute60")     # 원화 단위의 가상화폐, 시간 단위는 분 단위, 현재 시점부터 2000분 전의 데이터를 요청
    df.reset_index(inplace=True)
    df['y'] = df['close']
    df['ds'] = df['index']

    forecast = fitting_to_real_price(df)
    
    #pred_price = forecast['yhat']                             # 데이터 프레임에 담겨있는 예측한 가격 데이터

    #real_price = df['y']                                      # 실제 가격 데이터

    date = forecast['ds']                                     # 데이터 프레임에 담겨있는 날짜 데이터
    
    real_price_list = []
    pred_price_list = []

    for i in range(len(date)):
        pred_price = {"days":date[i],"value":forecast['yhat'][i]}

        pred_price_list.append(pred_price)

    for i in range(len(df['y'])):
        real_price = {"days":date[i],"value":df['y'][i]}

        real_price_list.append(real_price)

    # return pred_price, real_price
    return pred_price_list, real_price_list                 # 예측 가격, 실제 가격 추세 일시를 반환


# def get_crypto_price(ticker):                   # 가상화폐의 가격을 가져오는 사용자 함수
#     df = pyupbit.get_ohlcv(f"KRW-{ticker}", count=4320, interval="minute60")     # 원화 단위의 가상화폐, 시간 단위는 분 단위, 현재 시점부터 2000분 전의 데이터를 요청

#     date, data, pred = fitting_to_real_price(df)

#     real_price_list = []
#     pred_price_list = []

#     print(f"""
# date: {date}
# data: {data[0]}
# pred: {pred}
# date: {type(date)}
# data: {type(data[0])}
# pred: {type(pred)}
# """)

#     pred_Series = pd.Series(pred)
#     real_Series = pd.Series(data)

#     # pred_Series = []
#     # real_Series = []

#     # for value in pred:
#     #     value = value.astype("int")
#     #     pred_Series.append(value)

#     # for value in data:
#     #     value = value.astype("int")
#     #     real_Series.append(value)


#     print(f"""
# pred_list: {type(pred_Series)}
# real_list: {type(real_Series)}
# """)

#     for i in range(len(date)):
#         pred_price = {"days":date[i],"value":pred_Series[i]}

#         pred_price_list.append(pred_price)

#     for i in range(len(date)):
#         real_price = {"days":date[i],"value":real_Series[i]}

#         real_price_list.append(real_price)

#     print(f"""
# pred_price_list: {type(pred_price_list[0]["value"])}
# real_price_list: {real_price_list}
# """)

#     return pred_price_list, real_price_list
    # return pred_price_list, real_price_list                 # 예측 가격, 실제 가격 추세 일시를 반환


#### 렝체인

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

# # FastAPI 애플리케이션 실행
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("index:app", host="0.0.0.0", port=8000, log_level="info", access_log=True)


# FastAPI 애플리케이션 실행을 위해서는 `uvicorn` 명령어를 사용합니다.
# 터미널에서 다음 명령어를 실행하세요: uvicorn index:app --reload
# 여기서 `main`은 이 Python 스크립트 파일의 이름입니다. 만약 파일 이름이 `index.py`라면, `uvicorn index:app --reload`을 사용합니다.



