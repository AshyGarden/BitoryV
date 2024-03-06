//async function UpdateChart() {
//    var div = d3.select("#stockChart")
//        .selectAll("*")
//        .remove();
//    const arrays = await fetchData();
//    dataArray1 = arrays[0];
//    dataArray2 = arrays[1];
//    return dataArray1, dataArray2
//};
//async function clickButton() {
//    const btn = document.querySelector("#btn1");
//    btn.addEventListener("click", UpdateChart);
//
//    const arrays1, const arrays2 = await UpdateChart();
//
//    return arrays1, arrays2;  // fetchData함수로 가상화폐 가격과 예측가격을 가져옴
//};
//const arrays1, arrays2 = clickButton();
//
//console.log(arrays1);

//document.addEventListener("DOMContentLoaded", async () => {		// select 태그의 값이 바뀌는 것을 감지하기 위해
//	await handleFetchDataAndPrepareChart();						// 차트를 그려주는 함수 호출
//
//    $("#btn1").on("click", async() => {			        // select 태그의 값이 바뀌는 것을 감지
//        await handleFetchDataAndPrepareChart();					    // 바뀐 차트를 다시 그리기 위해 함수 재호출
//    });
//});

let tickerSelect1 = document.getElementById("ticker1")

async function fetchData () {									// 예측 가격과 일시 데이터를 요청 및 전달받는 함수
    let ticker1 = tickerSelect1.value

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

	    return result		// JSON 형식으로 바꾼 데이터를 반환
	} catch (error) {
	    console.error("Error fetching data:", error);
	    throw error;
	}};



var margin = { top:40,
    right: 80,
    bottom: 40,
    left:80 }
var width = 1400, height = 600 - margin.top - margin.bottom;

// x축의 범위를 지정
var xValue = d3.scaleTime()

// var xScale = d3.scaleLinear().domain([0, d3.max(data)]).range([0, width-50])

var xScale = d3.scaleTime()


// x축에 표현할 형식을 지정
var xAxis = d3.axisBottom().scale(xValue).tickFormat(d3.timeFormat('%m-%d-h%H'));
// var xAxis = d3.axisBottom().tickFormat(d3.timeFormat('%d-%H')).scale(xScale).ticks(20, "s");

// y축의 범위를 지정
var yValue = d3.scaleLinear()

var yScale = d3.scaleLinear()

var yAxis = d3.axisLeft().scale(yScale);

// 선을 그릴 line함수
var line = d3.line()
.x(function(d,i){

    return xValue(new Date(`${d.days}`));
})
.y(function(d,i){

    return yValue(d.value);
});

// console.log([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]);

function addHours(date, hours) {
    const clone = new Date(date);

    clone.setHours(date.getHours() + hours)

    return clone;
}

// let tickerSelect2 = document.getElementById("ticker2")

function func() {
    // Selecting  div and
    // Removing the div
    let div = d3.select("#stockChart")
        .selectAll("*")
        .remove();
}

document.addEventListener("DOMContentLoaded", async () => {		// select 태그의 값이 바뀌는 것을 감지하기 위해
	func();
	await handleFetchDataAndPrepareChart();						// 차트를 그려주는 함수 호출

    $("#btn1").on("click", async() => {			        // select 태그의 값이 바뀌는 것을 감지
        func();
        await handleFetchDataAndPrepareChart();					    // 바뀐 차트를 다시 그리기 위해 함수 재호출
    });
});



//d3.select("#btn1").on("click", () => {
//    handleFetchDataAndPrepareChart()
//});


async function handleFetchDataAndPrepareChart() {
        // select 태그로 선택한 ticker1, 2
        let ticker1 = tickerSelect1.value
    try {
        const arrays = await fetchData();

        console.log(arrays);

        dataArray1 = arrays[0].slice(4320, 4344);
        dataArray2 = arrays[0].slice(4344, 4561);

    xValue.domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))])
           .range([0, width]);
    xScale.domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))])
          .range([0, width]);
    yValue.domain([d3.max(dataArray1.map(d => d.value)), d3.min(dataArray1.map(d => d.value))])
          .range([0, height])
    yScale.domain([d3.max(dataArray1.map(d => d.value)), d3.min(dataArray1.map(d => d.value))])
          .range([0, height])

    const xHour = addHours( new Date(d3.min(dataArray1.map(d => d.days))), -1);

    function tick(i) {

            let xHour_m1 = addHours( new Date(d3.min(dataArray1.map(d => d.days))), -1);

            dataArray1.push(dataArray2[i]);

        // x축의 위치를 지정
        var xaxis1 = d3.select(".xaxis")
            // .attr("class", "x axis")
            // .attr("transform", "translate("+margin.left+","+height+")")
            // .call(xAxis);

        // y축의 위치를 지정
        var yaxis1 = d3.select(".yaxis")
            // .attr("class", "y axis")
            // .attr("transform", "translate(80, 0)")
            // .call(yAxis);

            var path1 = d3.select(".line")
            //     .attr("clip-path", "url(#clip)")
            //     .attr("width", width)
            //     .attr("height", height)
            // .append('path')
            //     // 선을 그릴 데이터와 색깔, 두께를 지정
            //     .data([dataArray1])
            //     .attr('class', 'line')
            //     .attr("fill", "none")
            //     .attr("stroke", "steelblue")
            //     .attr("stroke-width", 3);

            xValue.domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]);
            xScale.domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]);
            yValue.domain([d3.max(dataArray1.map(d => d.value)), d3.min(dataArray1.map(d => d.value))])
            yScale.domain([d3.max(dataArray1.map(d => d.value)), d3.min(dataArray1.map(d => d.value))])



            path1.attr('d', line)
                .attr('transform', null)
                .transition()
                    .duration(500)
                    .ease(d3.easeLinear)
                    .attr("transform", 'translate(' + xScale(addHours( new Date(d3.min(dataArray1.map(d => d.days))), -1))+ ',0)')
                    .on('end ', ()=>{tick(i+1)});

            xaxis1
                .attr("transform", "translate(" + xScale(xHour_m1) + ","+height+")")
                    .transition()
                        .duration(500)
                        .ease(d3.easeLinear)
                        .call(xAxis)


            yaxis1
            // .attr('transform', "translate(80, 570)")
                .transition()
                    .duration(500)
                    .ease(d3.easeLinear)
                    .attr("transform", "translate("+margin.left+",0)")
                    .call(yAxis)

            dataArray1.shift();
    }


    var svg2 = d3.select("#stockChart")
            .append("svg")
                .attr("width", width - margin.left)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate("+margin.left+","+margin.top+")");

            svg2.append("defs").append("clipPath")
                .attr("id", "clip")
            .append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate("+margin.left+",0)");
                
    // x축의 위치를 지정
    var xaxis = svg2.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate("+margin.left+","+height+")")
        .call(xAxis);

    // y축의 위치를 지정
    var yaxis = svg2.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate("+margin.left+",0)")
        .call(yAxis);

        var path = svg2.append('g')
            .attr("clip-path", "url(#clip)")
            .attr("width", width)
            .attr("height", height)
        .append('path')
            // 선을 그릴 데이터와 색깔, 두께를 지정
            .data([dataArray1])
            .attr('class', 'line')
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 3);

        tick(0);

    }catch (error) {
        console.error("Error handling data:", error);
    }
}


//
//async function handleFetchDataAndPrepareChart() {
//        // select 태그로 선택한 ticker1, 2
//        let ticker1 = tickerSelect1.value
//
//    try {
//       const arrays = await fetchData();        // fetchData함수로 가상화폐 가격과 예측가격을 가져옴
//       //console.log(arrays);
//       //console.log(arrays[0]);
//       console.log(arrays[0], d => d.days);
//       console.log(arrays[0], d => d.value);
//
//       dataArray1 = arrays[0].slice(0, 6);
//       dataArray2 = arrays[0].slice(6, 25);
//       console.log(typeof(arrays[0].length));
//       console.log(dataArray1);
//       console.log(dataArray2);
//
//    var margin = { top:40,
//                right: 80,
//                bottom: 40,
//                left:80 }
//    var width = 1200 - margin.left - margin.right, height = 600 - margin.top - margin.bottom;
//
//
//    function addDays(date, days) {
//        const clone = new Date(date);
//
//        clone.setDate(date.getDate() + days)
//
//        return clone;
//    }
//
//    function addHours(date, hours) {
//        const clone = new Date(date);
//
//        clone.setHours(date.getHours() + hours)
//
//        return clone;
//    }
//
//    var xValue = d3.scaleTime().domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]).range([0, width])
//    // var xScale = d3.scaleLinear().domain([0, d3.max(data)]).range([0, width-50])
//    var xScale = d3.scaleTime().domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]).range([0, width])
//    var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat('%d-h%H'));
//
//    const xday = addDays( new Date(d3.min(dataArray1.map(d => d.days))), -1);
//    const xHour = addHours( new Date(d3.min(dataArray1.map(d => d.days))), -1);
//    // console.log('xScale(-1):', xHour)
//    console.log('xScale(39):', xValue(xHour))
//    var yValue = d3.scaleLinear().domain([d3.max(dataArray1.map(d => d.value)), d3.min(dataArray1.map(d => d.value))]).range([0, height])
//    var yScale = d3.scaleLinear().domain([d3.max(dataArray1.map(d => d.value)), d3.min(dataArray1.map(d => d.value))]).range([0, height])
//    var yAxis = d3.axisLeft().scale(yScale);
//
//    var line = d3.line()
//        .x(function(d,i){
//            return xValue(new Date(`${d.days}`));
//        })
//        .y(function(d,i){
//            return yValue(d.value);
//        });
//
//    var svg2 = d3.select("#stockChart")
//        .append("svg")
//            .attr("width", width - margin.left)
//            .attr("height", height+margin.top + margin.bottom)
//        .append("g")
//            .attr("transform", "translate("+margin.left+","+margin.top+")");
//
//        svg2.append("defs").append("clipPath")
//            .attr("id", "clip")
//        .append("rect")
//            .attr("width", width)
//            .attr("height", height)
//            .attr("transform", "translate("+margin.left+",0)");
//
//    var xaxis = svg2.append("g")
//        .attr("class", "x axis")
//        .attr("transform", "translate("+margin.left+","+height+")")
//
//        xaxis.call(xAxis)
//
//    var yaxis = svg2.append("g")
//        .attr("class", "y axis")
//        .attr("transform", "translate(80, 0)")
//        .call(yAxis)
//
//    var path = svg2.append('g')
//            .attr("clip-path", "url(#clip)")
//            .attr("width", width)
//            .attr("height", height)
//        .append('path')
//            .data([dataArray1])
//            .attr('class', 'line')
//            .attr("fill", "none")
//            .attr("stroke", "steelblue")
//            .attr("stroke-width", 1.5);
//
//
//    async function  tick(i) {
//        let xHour_m1 = addHours( new Date(d3.min(dataArray1.map(d => d.days))), -1);
//
//        dataArray1.push(dataArray2[i]);
//
//        xValue.domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]);
//        xScale.domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]);
//        console.log(new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days))))
//
//        xaxis
//        .attr("transform", "translate(" + xScale(xHour_m1) + ","+height+")")
//            .transition()
//                .duration(1000)
//                .ease(d3.easeLinear)
//                .call(xAxis)
//
//        path.attr('d', line)
//        .attr('transform', null)
//            .transition()
//                .duration(1000)
//                .ease(d3.easeLinear)
//                .attr("transform", 'translate(' + xScale(addHours( new Date(d3.min(dataArray1.map(d => d.days))), -1))+ ',0)')
//                .on("end", ()=>{ tick(i+1)});
//
//
//        dataArray1.shift();
//    }
//
//    tick(0);
//
//        }catch (error) {
//        console.error("Error handling data:", error);
//    }
//    }




//    var margin = { top:40,
//                right: 80,
//                bottom: 40,
//                left:80 }
//    var width = 1200 - margin.left - margin.right, height = 600 - margin.top - margin.bottom;
//
//
//    function addDays(date, days) {
//        const clone = new Date(date);
//
//        clone.setDate(date.getDate() + days)
//
//        return clone;
//    }
//
//    function addHours(date, hours) {
//        const clone = new Date(date);
//
//        clone.setHours(date.getHours() + hours)
//
//        return clone;
//    }
//
//    var xValue = d3.scaleTime().domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]).range([0, width])
//    // var xScale = d3.scaleLinear().domain([0, d3.max(data)]).range([0, width-50])
//    var xScale = d3.scaleTime().domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]).range([0, width])
//    var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat('%d-h%H')).ticks(6);
//
//    const xday = addDays( new Date(d3.min(dataArray1.map(d => d.days))), -1);
//    const xHour = addHours( new Date(d3.min(dataArray1.map(d => d.days))), -1);
//    // console.log('xScale(-1):', xHour)
//    console.log('xScale(39):', xValue(xHour))
//    var yValue = d3.scaleLinear().domain([d3.max(dataArray1.map(d => d.value)), d3.min(dataArray1.map(d => d.value))]).range([0, height])
//    var yScale = d3.scaleLinear().domain([d3.max(dataArray1.map(d => d.value)), d3.min(dataArray1.map(d => d.value))]).range([0, height])
//    var yAxis = d3.axisLeft().scale(yScale);
//
//    var line = d3.line()
//        .x(function(d,i){
//            return xValue(new Date(`${d.days}`));
//        })
//        .y(function(d,i){
//            return yValue(d.value);
//        });
//
//    var svg2 = d3.select("#stockChart")
//        .append("svg")
//            .attr("width", width - margin.left)
//            .attr("height", height+margin.top + margin.bottom)
//        .append("g")
//            .attr("transform", "translate("+margin.left+","+margin.top+")");
//
//        svg2.append("defs").append("clipPath")
//            .attr("id", "clip")
//        .append("rect")
//            .attr("width", width)
//            .attr("height", height)
//            .attr("transform", "translate("+margin.left+",0)");
//
//    var xaxis = svg2.append("g")
//        .attr("class", "x axis")
//        .attr("transform", "translate("+margin.left+","+height+")")
//
//        xaxis.call(xAxis)
//
//    var yaxis = svg2.append("g")
//        .attr("class", "y axis")
//        .attr("transform", "translate(80, 0)")
//        .call(yAxis)
//
//    var path = svg2.append('g')
//            .attr("clip-path", "url(#clip)")
//            .attr("width", width)
//            .attr("height", height)
//        .append('path')
//            .data([dataArray1])
//            .attr('class', 'line')
//            .attr("fill", "none")
//            .attr("stroke", "steelblue")
//            .attr("stroke-width", 1.5);
//
//
//    async function  tick(i) {
//        let xHour_m1 = addHours( new Date(d3.min(dataArray1.map(d => d.days))), -1);
//
//        dataArray1.push(dataArray2[i]);
//
//        xValue.domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]);
//        xScale.domain([new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days)))]);
//        console.log(new Date(d3.min(dataArray1.map(d => d.days))), new Date(d3.max(dataArray1.map(d => d.days))))
//
//        xaxis
//        .attr("transform", "translate(" + xScale(xHour_m1) + ","+height+")")
//            .transition()
//                .duration(1000)
//                .ease(d3.easeLinear)
//                .call(xAxis)
//
//        path.attr('d', line)
//        .attr('transform', null)
//            .transition()
//                .duration(1000)
//                .ease(d3.easeLinear)
//                .attr("transform", 'translate(' + xScale(addHours( new Date(d3.min(dataArray1.map(d => d.days))), -1))+ ',0)')
//                .on("end", ()=>{ tick(i+1)});
//
//
//        dataArray1.shift();
//    }
//
//    tick(0);