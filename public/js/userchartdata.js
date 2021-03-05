/*$(document).ready(function() {
    var ctx = $("#chart-line");
    var myLineChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["주식1", "예수금", "거래대기금"],
            datasets: [{
                data: [1000000, 170000, 540000],
                backgroundColor: ["#17375E", "#367DD3", "#D4E8FF"]
            }]
        },
        options: {
            title: {
                display: true,
                text: '상품별'
            },
            cutoutPercentage: 75,

           
        }
    });
    function percentage(number){ //왜 작동을 하지 않을까요?
        var tot = myLineChart.data.datasets.data[0] + myLineChart.data.datasets.data[1] + myLineChart.data.datasets.data[2];
        return (number / tot) * 100;
    }
    document.getElementById('getStock').innerHTML = `주식 ${percentage(myLineChart.data.datasets.data[0])}%`;
    
});*/

