let todayWeather = '';
let recommendedFoodToday = "";

// 랜덤한 숫자를 가져오는 함수 (파라미터로 넘긴 숫자 내의 인덱스를 구해준다.)
const getRandomNumberOf = (total) => Math.floor(Math.random() * total);
let i = getRandomNumberOf(5);

window.addEventListener('load', () => {
    requestPopup();
})

// 날씨에 맞는 배경 사진
function weather_bg(weather) {
    if (weather == 'Rain') {
        document.body.style.backgroundImage = "url(../static/img/rain.jpg)";
    } else if (weather == 'Clouds') {
        document.body.style.backgroundImage = "url(../static/img/cloud.jpg)";
    } else if (weather == 'Clean') {
        document.body.style.backgroundImage = "url(../static/img/clean.jpg)";
    } else if (weather == 'Dust') {
        document.body.style.backgroundImage = "url(../static/img/mise.jpg)";
    }
}

// 위치 권한 허용창
function requestPopup() {
    const result = window.confirm('위치 권한을 허용하시겠습니까?')
    setAuthority(result)
}

//위치 정보 셋팅 (권한 거부 시 기본 위치[서울] 입력)
function setAuthority(result) {
    console.log('위치 권한 허용 여부', result)
    result ? navigator.geolocation.getCurrentPosition((res) => {
        let {latitude, longitude} = res.coords;
        void initWeatherInfo(latitude, longitude)
    }, (err) => {
        console.error(err)
        void initWeatherInfo(37.5577074, 126.9766557)
    }) : initWeatherInfo(37.5577074, 126.9766557)
}

// 사용자로부터 받은 사용자의 위치 데이터를 통해 API로 연결
async function initWeatherInfo(latitude, longitude) {
    console.log('position', latitude, longitude)
    try {
        const response = await requestWeather(latitude, longitude)
        chooseFood(response.weather[0].id)
    } catch (err) {
        console.error(err)
    }
}

// 받은 위도, 경도를 이용해 openWeatherApi 에서 날씨 받아옴
function requestWeather(latitude, longitude) {
    return new Promise((resolve, reject) => {
        const apiKey = "8e3a8d4780bc10f08f39acedc17cff21"
        const openWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=kr"
            + "&lat=" + latitude
            + "&lon=" + longitude
            + "&appid=" + apiKey;
        $.ajax({
            url: openWeatherUrl,
            type: 'GET',
            dataType: 'json',
            success: (response) => {
                console.log('weatherInfo', response)
                weather_code = response.weather[0].id
                resolve(response)
            },
            error: () => {
                reject(new Error(error))
            }
        })
    })
}

//날씨 id에 맞게 음식 랜덤 고르기
function chooseFood(weather) {
    let rainFood = ['모둠전', '불고기전골', '어묵탕', '돌솥비빔밥', '두부김치'];
    let cloudsFood = ['설렁탕', '갈비탕', '감자탕', '국밥', '찌개'];
    let dustFood = ['삼겹살', '소곱창', '돈까스', '피자', '족발'];
    let clearFood = ['냉면', '비빔면', '냉모밀', '삼계탕', '물회'];
    let weather_code = weather;
    if (300 <= weather_code && weather_code < 532) {
        recommendedFoodToday = rainFood[i]
        todayWeather = 'Rain';
        weather_bg(todayWeather)
        showFood()
        $('#weather-js').append(`😵날도 흐리잖아 ${recommendedFoodToday} 먹어 먹어 먹어😵`)
    } else if (weather_code === 731 || weather_code === 761) {
        recommendedFoodToday = dustFood[i];
        todayWeather = 'Dust';
        weather_bg(todayWeather)
        showFood()
        $('#weather-js').append(`😵이렇게 좋은날 ${recommendedFoodToday} 안먹을거야?😵`)
    } else if (800 <= weather_code && weather_code < 803) {
        recommendedFoodToday = clearFood[i];
        todayWeather = 'Clear';
        weather_bg(todayWeather)
        showFood()
        $('#weather-js').append(`😵오늘같은 날 ${recommendedFoodToday} 먹어줘야지?😵`)
    } else if (803 <= weather_code && weather_code < 805) {
        recommendedFoodToday = cloudsFood[i];
        todayWeather = 'Clouds';
        weather_bg(todayWeather)
        showFood()
        $('#weather-js').append(`😵비올거같은데 ${recommendedFoodToday} 먹어줘야지?😵`)
    } else {
        recommendedFoodToday = rainFood[i]
        todayWeather = 'Rain'
        weather_bg(todayWeather)
        showFood()
        $('#weather-js').append(`😵오늘 당신은 ${recommendedFoodToday} 먹게 된다😵`)
    }
}

//날씨에 맞는 음식 중 랜덤으로 db 가져오기
function showFood() {
    $.ajax({
        type: 'GET',
        url: '/api/list',
        data: {weather: todayWeather},
        success: function (response) {
            let food = response['recommended_food']
            let name = food[i]['name'];
            like = food[i]['like'];
            dislike = food[i]['dislike'];
            $('#like-js').append(`${like}`)
            $('#dislike-js').append(`${dislike}`)
            $('#img-box0').attr('src', `../static/img/${name}.gif`)
            $('#img-box1').attr('src', `../static/img/${name}2.gif`)
            $('#img-box2').attr('src', `../static/img/${name}3.gif`)
            $('#img-box3').attr('src', `../static/img/${name}4.gif`)
            $('#img-box4').attr('src', `../static/img/${name}5.gif`)
        }
    });
}

let like = 0;
let dislike = 0;

//음식 좋아요 +1
function likeFood() {
    like++
    $('#like-js').text(like)
    $.ajax({
        type: 'POST',
        url: `/api/${recommendedFoodToday}?action=like`,
        data: {},
        success: function (response) {
            console.log(response['food'], "좋아요 1개!!");
            //showFood();
        }
    });
}

//음식 싫어요 +1
function dislikeFood() {
    dislike++
    $('#dislike-js').text(dislike)
    $.ajax({
        type: 'POST',
        url: `/api/${recommendedFoodToday}?action=dislike`,
        data: {},
        success: function (response) {
            console.log(response['food'], "싫어요 1개 8ㅛ8");
        }
    });
}