(function () {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;
          function pad2(number) {
   
            return (number < 10 ? '0' : '') + number
          
       }
  
    let birthday = "May 30, 2021 00:00:00",
        countDown = new Date(birthday).getTime(),
        x = setInterval(function() {    
  
          let now = new Date().getTime(),
              distance = countDown - now;
  
          document.getElementById("days").innerText = pad2(Math.floor(distance / (day))),
            document.getElementById("hours").innerText = pad2(Math.floor((distance % (day)) / (hour))),
            document.getElementById("minutes").innerText = pad2(Math.floor((distance % (hour)) / (minute))),
            document.getElementById("seconds").innerText = pad2(Math.floor((distance % (minute)) / second));
  
          
          if (distance < 0) {
            
            clearInterval(x);
          }
          //seconds
        }, 0)
    }());
    