import { AxiosError, AxiosResponse } from 'axios';
import './App.css';
import {realtimeRequest, dailyRequest, hourlyRequest, settingsRequest} from './actions/actions';
import {realtimeWeatherData, forecastDailyData, forecastHourlyData} from './types/dataTypings'
import { RefObject, useEffect, useState, createRef, KeyboardEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEarthAmericas, faLocationDot, faSliders, faHouse} from '@fortawesome/free-solid-svg-icons';

function App() {

const [realtime, setRealtime] = useState<realtimeWeatherData>();
const [forecastDaily, setForecastDaily] = useState<forecastDailyData>();
const [forecastHourly, setForecastHourly] = useState<forecastHourlyData>();
const [time, setTime] = useState<string>(new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));

const [homeHighlighted, setHomeHighlighted] = useState(false); //TODO Reset => TRUE
const [worldHighlighted, setWorldHighlighted] = useState(false);
const [mapHighlighted, setMapHighlighted] = useState(false);
const [settingsHighlighted, setSettingsHighlighted] = useState(true);

const [location, setLocation] = useState(97702);
const [metric, setMetric] = useState(false);
const settingsLocationRef: RefObject<HTMLInputElement> = createRef();

useEffect(() => {

  // dataFetch(); // !! Make sure to limit api calls. 
  // * two times per hour w/ two calls left over.
  
  
  const interval = setInterval(() => {
    const newTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    setTime(newTime);
  }, 1000);

  return () => clearInterval(interval);
  
})



type dataTuple = [realtimeWeatherData, forecastDailyData, forecastHourlyData];

const dataFetch = async () => {

  const apiData: dataTuple | void = await dataRequest();
  if (apiData === undefined || apiData === null) return console.error("Realtime Data undefined.");

  const [realtime, daily, hourly] = apiData; // JS array destructuring

  setRealtime(realtime);
  setForecastDaily(daily);
  setForecastHourly(hourly);

}



const dataRequest: () => Promise<dataTuple| void> = async (): Promise<dataTuple | void> => {
    // TODO: Make sure this works.
  
    const responseRealtime = await realtimeRequest();
    if (responseRealtime instanceof AxiosError) return console.error(responseRealtime);
    const realtimeResult: realtimeWeatherData = responseRealtime.data;
    
    
    const responseDaily = await dailyRequest();
    if (responseDaily instanceof AxiosError) return console.error(responseDaily);
    const dailyResult: forecastDailyData = responseDaily.data;
    
    
    const responseHourly = await hourlyRequest();
    if (responseHourly instanceof AxiosError) return console.error(responseHourly);
    const hourlyResult: forecastHourlyData = responseHourly.data; 
    // TODO: Need the data shape to type effectively.


    const returnArray: dataTuple = [realtimeResult, dailyResult, hourlyResult];
     
    return returnArray;
  
}
// dataFetch(); // ! Don't use dataFetch inside useEffect??

const date = new Date();
const currentDate = date.toLocaleString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});


const realtimeComponent = () => {
  return (
    <div className='realtime-main'>
      <div className='realtime-div1'>{realtime?.weatherIcon && realtime?.weatherDescription && realtime?.temperature || 'ICON 72* Cloudy'}</div>  
      <div className='realtime-div2'>{time}</div>
      <div className='realtime-div2'>{currentDate}</div>
    </div>
  );
}


const hourForecastComponent = () => { 
  return (
    <div className='hour-forecast'>
      <div className='hour-forecast__div'>
          <hr className='hour-div__hr'/>
        <div className='hour-div__hours'>
          <div className='hour-div__hours__display'>
            {`8:00 72*`}
          </div> 
        </div>
          <hr className='hour-div__hr'/>
        <div className='hour-div__hours'>
          <div className='hour-div__hours__display'>
            {`9:00 65*`}
          </div>
        </div>
          <hr className='hour-div__hr'/>
        <div className='hour-div__hours'>
          <div className='hour-div__hours__display'>
          {`10:00 55*`}
          </div>
        </div>
          <hr className='hour-div__hr'/>
        <div className='hour-div__hours'>
          <div className='hour-div__hours__display'>
          {`11:00 43* `}
          </div>
        </div>
          <hr className='hour-div__hr'/>
        <div className='hour-div__hours'>
          <div className='hour-div__hours__display'>
          {`12:00 32*`}
          </div>
        </div>
          <hr className='hour-div__hr'/>
        <div className='hour-div__hours'>
          <div className='hour-div__hours__display'>
            {`1:00 32*`}
          </div>
        </div>
          <hr className='hour-div__hr'/>
      </div>
    </div>
  );
}

const handleNavbarClick: (pageClicked: string) => void = (pageClicked: string) => {
  if (pageClicked === 'home' && homeHighlighted === false) {
    setHomeHighlighted(true);
    setWorldHighlighted(false);
    setMapHighlighted(false);
    setSettingsHighlighted(false);
    
  } else if (pageClicked === 'world' && worldHighlighted === false) {
    setWorldHighlighted(true);
    setHomeHighlighted(false);
    setMapHighlighted(false);
    setSettingsHighlighted(false);

  } else if (pageClicked === 'map' && mapHighlighted === false) {
    setMapHighlighted(true);
    setHomeHighlighted(false);
    setWorldHighlighted(false);
    setSettingsHighlighted(false);

    
  } else if (pageClicked === 'settings' && settingsHighlighted === false) {
    setSettingsHighlighted(!settingsHighlighted);
    setHomeHighlighted(false);
    setWorldHighlighted(false);
    setMapHighlighted(false);
  }
}


type stateHooks = typeof settingsHighlighted | typeof homeHighlighted | typeof worldHighlighted | typeof mapHighlighted;

const style = (stateHook: stateHooks) => {
    return {backgroundColor: stateHook ? '#9baec8':'#d9e1e8'};
}



const navbarComponent = () => {
  return (
    <div className='navbar'>
      <div className='navbar__pages' style={style(homeHighlighted)}>
        <button 
          className='navbar__pages__button' 
          onClick={() => handleNavbarClick("home")}
          style={style(homeHighlighted)}
        >
          <div className='navbar__pages__button__icon-div' style={style(homeHighlighted)}>
            <FontAwesomeIcon icon={faHouse} className='navbar__pages__button__icon-div__icon' style={style(homeHighlighted)}/> 
          </div>
          <div className='navbar__pages__button__text' style={style(homeHighlighted)}>
            Home
          </div>
        </button>
    </div>
      <hr className='navbar__hr'/>
      <div className='navbar__pages'style={style(worldHighlighted)}>
        <button 
          className='navbar__pages__button' 
          onClick={() => handleNavbarClick("world")}
          style={style(worldHighlighted)}
        >
          <div className='navbar__pages__button__icon-div' style={style(worldHighlighted)}>
            <FontAwesomeIcon icon={faEarthAmericas} className='navbar__pages__button__icon-div__icon' style={style(worldHighlighted)}/> 
          </div>
          <div className='navbar__pages__button__text' style={style(worldHighlighted)}>
            World
          </div>
        </button>
      </div>
      <hr className='navbar__hr'/>
      <div className='navbar__pages'style={style(mapHighlighted)}>
        <button 
          className='navbar__pages__button' 
          onClick={() => handleNavbarClick("map")} 
          style={style(mapHighlighted)}
        >
          <div className='navbar__pages__button__icon-div' style={style(mapHighlighted)}>
            <FontAwesomeIcon icon={faLocationDot} className='navbar__pages__button__icon-div__icon'style={style(mapHighlighted)}/> 
          </div>
          <div className='navbar__pages__button__text' style={style(mapHighlighted)}>
            Map  
          </div>
        </button>
      </div>
      <hr className='navbar__hr' style={style(settingsHighlighted)}/>
      <div className='navbar__pages' style={style(settingsHighlighted)}>
        <button 
          className='navbar__pages__button' 
          onClick={() => handleNavbarClick("settings")}
          style={style(settingsHighlighted)}
        >
            <div className='navbar__pages__button__icon-div' 
            style={style(settingsHighlighted)}
            >
              <FontAwesomeIcon icon={faSliders} 
              className='navbar__pages__button__icon-div__icon'
              style={style(settingsHighlighted)}
              />
            </div>
            <div className='navbar__pages__button__text'
            style={style(settingsHighlighted)}
            >
              Settings
            </div>
        </button>
      </div>
      <hr className='navbar__hr'/>
    </div>
  );
}

const homeComponent: () => JSX.Element = () => {
  return (
    <div className='variable__home'>
      // TODO: Weekly Weather.
    </div>
  );
}

const worldComponent: () => JSX.Element = () => {
  return (
    <div className='variable__world'>
      // TODO: Search bar and city forecast.
    </div>
  );
}

const mapComponent: () => JSX.Element = () => {
  return (
    <div className='variable__map'>
      // TODO Render a forecast map of the local area.
    </div>
  );
}

const settingsUpdate = async (locationString: string, metricBool: boolean) => {
  const response: AxiosResponse | AxiosError = await settingsRequest(locationString, metricBool);
  if (response instanceof AxiosError) return console.error(response);
  
  console.log(response);

  // ! Separate settingsUpdate into two functions -> metric update + location update
}


const handleLocationInput = (event: KeyboardEvent<HTMLInputElement>) => {
  console.log("location input success")

  const target = event.target as HTMLInputElement;

  const stringValue: string = target.value;

  const inputNumber = (!isNaN(parseInt(stringValue)));

  if (!isNaN(parseInt(stringValue))) {
    if (stringValue.length < 5) return window.alert("Zip code is too short.");
    if (stringValue.length > 5) return window.alert("Zip code is too long."); 

  } else {
    // & string query case
  }

  // ^ If string
  // ^ AccuWeatherAPI Query requirements?
  // ^ if bad string => return window alert => error & requirements.
  // ^ if good string => call settingsUpdate. "city, state"
  // ^ success -> window alert success? 

  // & If number:
  // & number.length exactly 5 numbers.
  // & if bad number => return window alert => error & requirements.


  // ! setLocation(event);
}

const handleMetricButtonClick = () => {
  console.log("metric button success.")
  setMetric(!metric);
}

/* 
  ^ Keydown Handler: Location input.
  ^ Submits string => `handleLocationInput` on `Enter` keypress.
  ^ Clears Ref after submission.
*/ 
const keyDownLocationHandler: (event: KeyboardEvent<HTMLInputElement>) => void = (event: KeyboardEvent<HTMLInputElement>) => {
  // ^ Form validation in here? might be better
  if (event.key === 'Enter') {
    event.preventDefault();

    handleLocationInput(event);

    if (settingsLocationRef.current === null) {
      return console.error("Settings Location Ref Error:", settingsLocationRef.current)
    }

    settingsLocationRef.current.value = "";
  }
}

// const zipCodeRegex: RegExp = /[0-9]{0,5}/;
const regex = '^[a-z]+, (A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$i';
// TODO: Properly implement form validation.

const settingsComponent: () => JSX.Element = () => {
  return (
    <div className='variable__settings'>
      <div className='variable__settings__location-div'>
        <div className='variable__settings__location-div__input-label'>Change Location</div>
        <div className='variable__settings__location-div__current-location'>Location: {location}</div>
        <form>

        <input className='variable__settings__location-div__input' 
          type='text'
          onKeyDown={keyDownLocationHandler}
          ref={settingsLocationRef}
          placeholder='City or ZIP Code'
          pattern='^[a-z]+, (A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$i' //TODO Data validation with regular expression.
        />
        </form>
      </div>  
      <div className='variable__settings__metric'>
        <div className='variable__settings__metric__button-label'>Change Measurement System</div>
        <div className='variable__settings__metric__metric-current'>Current: {metric ? 'Metric' : 'Imperial'}</div>
        <button className='variable__settings__metric__button' onClick={handleMetricButtonClick}>{metric ? 'Imperial' : 'Metric'}</button>
      </div> 
    </div>
  );
}


const variableBar: () => JSX.Element = () => {
  return (
    <div className='variable'>
      {settingsHighlighted ? settingsComponent() : worldHighlighted ? 
      worldComponent(): mapHighlighted ? mapComponent() : homeComponent()}
    </div>
  );
}


  return (
    <div className='App'>
      <div>{variableBar()}</div>
      <div>{navbarComponent()}</div>
      <div>{realtimeComponent()}</div>
      <div>{hourForecastComponent()}</div>
    </div>
    
  );
}


export default App;