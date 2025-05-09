export interface LocationData {
    name: string
    country: string
    state?: string
    lat: number
    lon: number
}

export interface AirQualityData {
    dt: number
    main: {
        aqi: number
    }
    components: {
        co: number
        no: number
        no2: number
        o3: number
        so2: number
        pm2_5: number
        pm10: number
        nh3: number
    }
    forecast?: {
        hourly: ForecastData[]
        daily: ForecastData[]
    }
}

export interface ForecastData {
    dt: number
    main: {
        aqi: number
    }
    components: {
        co: number
        no: number
        no2: number
        o3: number
        so2: number
        pm2_5: number
        pm10: number
        nh3: number
    }
}

export interface NearbyLocationData {
    name: string
    lat: number
    lon: number
    aqi: number
}
