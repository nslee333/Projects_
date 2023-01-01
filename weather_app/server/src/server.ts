import express, { application } from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import {
    updateMetric,
    updateQueryParams,
    realtimeWeatherSort,
    forecastWeeklySort,
    forecastHourlySort
} from './api'
import { AxiosError } from 'axios';

const app = express();
const port = 1300;
app.use(cors())

app.get('/api/realtime/', async (request: Request, response: Response) => {
    const apiResponse = await realtimeWeatherSort();

    if (apiResponse instanceof AxiosError) {
        return response.status(500).json(apiResponse);
    } else {
        return response.status(200).send(apiResponse);
    }
});


app.get('/api/weeklyForecast/', async (request: Request, response: Response) => {
    const apiResponse = await forecastWeeklySort();

    if (apiResponse instanceof Error) {
        return response.status(500).send(apiResponse);
    } else {
        return response.status(200).send(apiResponse);
    }
});


app.get('/api/hourlyForecast/', async (request: Request, response: Response) => {
    const apiResponse = await forecastHourlySort();

    if (apiResponse instanceof Error) {
        return response.status(500).send(apiResponse);
    } else {
        return response.status(200).send(apiResponse);
    }
});

app.post('/api/settings/', async (request: Request, response: Response) => {
    const area = request.query.area;
    const metric = request.query.metric;

    if (typeof area === 'string' || typeof area === 'number') {
        updateQueryParams(area);

        if (typeof metric === 'boolean') {
            updateMetric(metric)
        }

        return response.status(200);
    }
});


app.listen(port, () => {
    console.log(`Server has started listening on port ${port}`);
})