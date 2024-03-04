let tickerSelect1 = document.getElementById("ticker1")
let tickerSelect2 = document.getElementById("ticker2")

document.addEventListener("DOMContentLoaded", async () => {		// select 태그의 값이 바뀌는 것을 감지하기 위해
	await handleFetchDataAndPrepareChart();						// 차트를 그려주는 함수 호출

    $("#ticker1").on("change", async () => {			        // select 태그의 값이 바뀌는 것을 감지
    await handleFetchDataAndPrepareChart();					    // 바뀐 차트를 다시 그리기 위해 함수 재호출
    });

});


async function fetchData () {									// 예측 가격과 일시 데이터를 요청 및 전달받는 함수
    let ticker1 = tickerSelect1.value
    // let ticker2 = tickerSelect2.value

	try {
	    // fetch 함수를 사용하여 지정된 URL로 POST 요청을 보냅니다.
	    const response = await fetch(`http://127.0.0.1:8000/responsePrice/${ticker1}`, {
	        method: 'GET',
	        headers: {
	            'Content-Type': 'application/json',
	        },
	    });
	    // 응답을 기다리고 JSON으로 파싱합니다.
	    const result = await response.json();
//
//	    function convertDates(obj) {
//            if (obj.days) {
//                const newDays = {};
//                for (const key in obj.days) {
//                    if (obj.days.hasOwnProperty(key)) {
//                        newDays[key] = new Date(obj.days[key]);
//                    }
//                }
//                obj.days = newDays;
//            }
//        }

//	    result.forEach(array => {
//            // 배열 내의 각 객체에 대해 "convertDates" 함수 호출
//            array.forEach(obj => convertDates(obj));
//        });

	    return result		// JSON 형식으로 바꾼 데이터를 반환

	} catch (error) {
	    console.error("Error fetching data:", error);
	    throw error;
	}};


async function handleFetchDataAndPrepareChart() {
        // select 태그로 선택한 ticker1, 2
        let ticker1 = tickerSelect1.value
        // let ticker2 = tickerSelect2.value

    try {
       const arrays = await fetchData();        // fetchData함수로 가상화폐 가격과 예측가격을 가져옴
       //console.log(arrays);
       //console.log(arrays[0]);
       console.log(arrays[0], d => d.days);
       console.log(arrays[0], d => d.value);

       dataArray1 = arrays[0].slice(0, 40);
       dataArray2 = arrays[0].slice(40, 4561);
       console.log(typeof(arrays[0].length));
       console.log(dataArray1);
       console.log(dataArray2);


//       result.forEach((dataset) => {
//         console.log(dataset);
////            dataset.forEach((data) => {
////                console.log(data)
////            });
//       });

//        for (const [days, value] of Object.entries(result))
//            console.log(days);
//            console.log(value);

//        for (let days of Object.keys(result)) {
//            var value = result[days];
//            console.log(value['days']);
//        }

       // 그래프의 전체 크기 지정
//       const margin = { top: 70, right: 30, bottom: 40, left: 80 };
//       const width = 1600 - margin.left - margin.right;
//       const height = 700 - margin.top - margin.bottom;
//
//       // x, y축의 스케일을 설정
//       const x = d3.scaleTime().range([0, width]);
//       const y = d3.scaleLinear().range([height, 0]);
//
//       // SVG 요소를 만들고 차트 컨테이너에 추가
//       const svg = d3.select("#stockChart")
//         .append("svg")
//           .attr("width", width + margin.left + margin.right)
//           .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//           .attr("transform", `translate(${margin.left},${margin.top})`);
//
//        // x, y축의 범위를 지정
//        // 객체의 날짜 값만 추출해서 Date타입으로 변환
////        function convertDaysToArray(obj) {
////            const dates = Object.values(obj.days).map(date => new Date(date));
////            console.log(dates);
////            return dates
////        }
//
//        // 날짜 문자열을 Date 객체로 변환하는 함수
//        function parseDateString(dateString) {
//            return new Date(dateString);
//        }
//
//        // 모든 요소의 "days" 값을 Date 객체로 변환
//        const transformedDate = arrays[0][0].map(item => {
//            return {
//                ...item,
//                days: parseDateString(item.days)
//            };
//        });
//
//        const transformedValue = arrays[0][0].map(item => {
//            return {
//                ...item,
//                value: item.value
//            };
//        });
//
//        const transformedDataset = arrays[0][0].map(item => {
//            return {
//                ...item,
//                value: item.value,
//                days: parseDateString(item.days)
//            };
//        });
//        console.log(typeof(transformedDataset))
//        // 첫 번째 배열의 "days" 속성에서 날짜에 해당하는 값들을 추출하여 배열로 변환
//         //const daysArray = convertDaysToArray(arrays[0]);
//         console.log(transformedDate, d => d.days);
//         console.log(transformedValue, d => d.value);
//
//         x.domain(d3.extent(transformedDate, d => d.days));
//
//        //  객체의 가격 값만 추출해서 반환
////        function extractValues(obj) {
////            const values = Object.values(obj.value);
////            // console.log(values);
////            return values
////        }
//        // 첫 번째 배열의 "value" 속성에서 날짜에 해당하는 값들을 추출하여 배열로 변환
//        //const valuesArray = extractValues(arrays[0]);
//        y.domain([0, d3.max(transformedValue, d => d.value)]); // Adjust according to your data;
//
//       // x축을 추가
//       svg.append("g")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(x)
//           .ticks(d3.timeHour.every(2000))
//           .tickFormat(d3.timeFormat("%H %d")));
//       // y축을 추가
//       svg.append("g")
//         .call(d3.axisLeft(y));
//
//       // 라인차트를 그리기 위한 생성자
//       //console.log(daysArray);
//       //console.log(valuesArray);
////       const line = d3.line()
////         .x(convertDaysToArray())
////         .y(extractValues());
//
//        const line = d3.line()
//       //.x(d => convertDaysToArray(d))
//       .defined(d => !isNaN(d.value))
//       .x(d => x(d.days))
//       .y(d => y(d.value));
//
//      // 라인차트 그리기
////      arrays.forEach((dataset, index) => {
////        console.log(dataset)
////        svg.append('path')
////           .data(dataset)
////           .attr('fill', 'none')
////           .attr('stroke', 'steelblue')
////           .attr('stroke-width', 2)
////           .attr('d', line());
////      });
//
//      svg.append('path')
//         //.data(arrays[0][0])
//         .attr('fill', 'none')
//         .attr('stroke', 'steelblue')
//         .attr('stroke-width', 2)
//         .attr('d', line(transformedDataset));



//const dataArray1=[  ["2023-08-30T03:00:00", 37702000],
//                    ["2023-08-30T04:00:00", 37657000],
//                    ["2023-08-30T05:00:00", 37246000],
//                    ["2023-08-30T06:00:00", 37410000],
//                    ["2023-08-30T07:00:00", 37702000],
//                    ["2023-08-30T08:00:00", 37657000]];
//
//const dataArray2=[
//                    ["2023-08-30T09:00:00", 37246000],
//                    ["2023-08-30T10:00:00", 37410000],
//                    ["2023-08-30T11:00:00", 37702000],
//                    ["2023-08-30T12:00:00", 37657000],
//                    ["2023-08-30T13:00:00", 37246000],
//                    ["2023-08-30T14:00:00", 37410000],
//                    ["2023-08-30T15:00:00", 37702000],
//                    ["2023-08-30T16:00:00", 37657000],
//                    ["2023-08-30T17:00:00", 37246000],
//                    ["2023-08-30T18:00:00", 37410000],
//                    ["2023-08-30T19:00:00", 37702000],
//                    ["2023-08-30T20:00:00", 37657000],
//                    ["2023-08-30T21:00:00", 37246000],
//                    ["2023-08-30T22:00:00", 37410000]];



var width = 1200, height = 600;
var data3=[[5,2,3,6],[10,22,10,5],[2,3,4,5],[30,50,20,13]];
// for days, values in arrays[0]:
var max = d3.max(data3, function (d) {
    return d3.max(d);
});
d3.max(data3.map(d => d[0]))
// console.log(d3.max(data3.map(d => d[2])))

// var dataArray = [Object.values(arrays[0][0].days),Object.values(arrays[0][0].value)]


var xValue = d3.scaleTime().domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]).range([0, width-50])
// var xScale = d3.scaleLinear().domain([0, d3.max(data)]).range([0, width-50])
var xScale = d3.scaleTime().domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]).range([0, width-50])
var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat('%m-%d-h%H'));
// var xAxis = d3.axisBottom().tickFormat(d3.timeFormat('%d-%H')).scale(xScale).ticks(20, "s");

var yValue = d3.scaleLinear().domain([d3.max(dataArray1.map(d => d.value)), d3.min(dataArray1.map(d => d.value))]).range([0, height-50])
var yScale = d3.scaleLinear().domain([d3.max(dataArray1.map(d => d.value)), d3.min(dataArray1.map(d => d.value))]).range([0, height-50])
var yAxis = d3.axisLeft().scale(yScale);

var line = d3.line()
    .x(function(d,i){
//        console.log('days', d)
//        console.log('i', i)
//        console.log('days', xValue(new Date(`${d.days}`)))
        // console.log(`${Object.keys(d)[i]}`)
        // console.log(new Date(`${Object.keys(d)[i]}`))
        // console.log('days', xValue(new Date(`${Object.keys(d)[i]}`)))
        // return xValue(new Date(`${Object.keys(d)[i]}`));
        return xValue(new Date(`${d.days}`));
    })
    .y(function(d,i){
        // console.log('value',d)
        // console.log('i', i)
        // console.log('value',d[1])
        // console.log('value',yValue(d[1]))
        return yValue(d.value);
    });

var svg2 = d3.select("#stockChart")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "yellow");

var xaxis = svg2.append("g")
    .attr("transform", "translate(80, 570)")
    .call(xAxis)

var yaxis = svg2.append("g")
    .attr("transform", "translate(80, 20)")
    .call(yAxis)

var path = svg2.append('g')
    .attr('clip-path', 'url(#clip)')
    .attr("transform", "translate(80, 20)")
    .append('path')
        // .data([arrays[1]["value"]])
        .data([dataArray1])
        .attr('class', 'line')
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3);
        // .attr('d', line);

// console.log(line([arrays[1]["value"]]));
// dataArray1.push(dataArray2[0]);
// console.log(dataArray1);
// dataArray1.shift();
// console.log(dataArray1);
// console.log(d3.min(dataArray1.map(d => d[0])))
tick(0);

     function tick(i) {
//            console.log(i)
        dataArray1.push(dataArray2[i]);
//
        console.log(dataArray1.length)

        path.attr('d', line)
            .attr('transform', null)
            .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                // .attr('transform', 'translate(' + xScale(-1) + ',0)')
                .attr('transform', 'translate(-185 ,0)')
                .on('end', ()=>{ tick(i+1)});


        xValue.domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]).range([0, width-50]);
        xScale.domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]).range([0, width-50]);
        // xaxis.call(xAxis);
        xaxis
        // .attr('transform', "translate(80, 570)")
            .transition()
                .duration(500)
                .ease(d3.easeLinear)
                // .attr('transform', 'translate(-107 ,570)')
                .call(xAxis)

                // await dataArray1.shift();
        yValue.domain([(d3.min(dataArray1.map(d => d.value))), (d3.max(dataArray1.map(d => d.value)))]).range([0, height-50]);
        yScale.domain([(d3.min(dataArray1.map(d => d.value))), (d3.max(dataArray1.map(d => d.value)))]).range([0, height-50]);
        // xaxis.call(xAxis);
        yaxis
        // .attr('transform', "translate(80, 570)")
            .transition()
                .duration(500)
                .ease(d3.easeLinear)
                // .attr('transform', 'translate(-107 ,570)')
                .call(yAxis)

                dataArray1.shift();
    }

        }catch (error) {
        console.error("Error handling data:", error);
    }
    }


