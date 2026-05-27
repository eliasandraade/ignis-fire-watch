interface Props {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
}

export function WeatherBlock({ temperature, humidity, windSpeed, windDirection }: Props) {
  const tempCritical = temperature > 35;
  const humidCritical = humidity < 20;

  const metric = (
    label: string,
    value: string | number,
    unit: string,
    isCritical: boolean
  ) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
                    color: isCritical ? 'var(--risk-crit)' : 'var(--text-hi)' }}>
        {value}
        <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 2 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 11, color: isCritical ? 'var(--risk-high)' : 'var(--text-ghost)',
                    textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
                  padding: '12px', background: 'var(--bg-raised)', borderRadius: 6 }}>
      {metric('Temperatura', temperature, '°C', tempCritical)}
      {metric('Umidade', humidity, '%', humidCritical)}
      {metric('Vento', `${windSpeed} ${windDirection}`, 'km/h', false)}
    </div>
  );
}
