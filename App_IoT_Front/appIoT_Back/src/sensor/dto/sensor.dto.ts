export class SensorDataDto {
    id: number;
    humidity: number;
    temperature: number;
    rain: number;
    sunIntensity: number;
    recordedAt: Date;
}

export class SensorDataFilterDto {
    from?: Date;
    to?: Date;
    limit?: number;
}