interface Props {
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  windDirection: string | null;
}

export function WeatherBlock({ temperature, humidity, windSpeed, windDirection }: Props) {
  const tempCritical = temperature != null && temperature > 35;
  const humidCritical = humidity != null && humidity < 20;
  const show = (v: number | null) => (v == null ? '—' : v);

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
      {metric('Temperatura', show(temperature), temperature == null ? '' : '°C', tempCritical)}
      {metric('Umidade', show(humidity), humidity == null ? '' : '%', humidCritical)}
      {metric('Vento', windSpeed == null ? '—' : `${windSpeed} ${windDirection ?? ''}`, windSpeed == null ? '' : 'km/h', false)}
    </div>
  );
}
