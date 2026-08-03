import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudSun,
  Droplets, Wind, Sunrise, Sunset, Gauge, Eye, RefreshCw, MapPin,
} from "lucide-react";

const LAT = -1.6833;
const LON = 36.85;

type Current = {
  temp: number; feels: number; code: number; humidity: number; wind: number;
  gust: number; precip: number; pressure: number; uv: number; isDay: boolean; visibility: number;
};
type DayItem = { date: string; code: number; max: number; min: number; rain: number };
type HourItem = { time: string; temp: number; code: number; rain: number };

type WeatherData = {
  current: Current;
  days: DayItem[];
  hours: HourItem[];
  sunrise: string;
  sunset: string;
};

const CODE_LABEL: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Freezing fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  56: "Freezing drizzle", 57: "Freezing drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain",
  66: "Freezing rain", 67: "Freezing rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow",
  77: "Snow grains", 80: "Light showers", 81: "Showers", 82: "Violent showers",
  85: "Snow showers", 86: "Snow showers", 95: "Thunderstorm", 96: "Storm with hail", 99: "Severe storm",
};

function label(code: number) {
  return CODE_LABEL[code] ?? "Fair weather";
}

function Icon({ code, isDay = true, className = "h-6 w-6" }: { code: number; isDay?: boolean; className?: string }) {
  if (code === 0) return <Sun className={className} aria-hidden />;
  if (code === 1 || code === 2) return <CloudSun className={className} aria-hidden />;
  if (code === 3) return <Cloud className={className} aria-hidden />;
  if (code === 45 || code === 48) return <CloudFog className={className} aria-hidden />;
  if (code >= 95) return <CloudLightning className={className} aria-hidden />;
  if (code >= 71 && code <= 77) return <CloudSnow className={className} aria-hidden />;
  if (code >= 85 && code <= 86) return <CloudSnow className={className} aria-hidden />;
  if (code >= 51) return <CloudRain className={className} aria-hidden />;
  return isDay ? <Sun className={className} aria-hidden /> : <Cloud className={className} aria-hidden />;
}

const URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
  "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_gusts_10m,precipitation,surface_pressure,is_day,visibility" +
  "&hourly=temperature_2m,weather_code,precipitation_probability" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max" +
  "&timezone=Africa/Nairobi&forecast_days=7";

export function useIsinyaWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(URL)
      .then((r) => r.json())
      .then((j) => {
        if (!alive || !j?.current) return;
        const nowIso = j.current.time as string;
        const hourIdx = Math.max(0, (j.hourly?.time as string[]).findIndex((t) => t >= nowIso));
        const hours: HourItem[] = (j.hourly?.time as string[])
          .slice(hourIdx, hourIdx + 12)
          .map((t, i) => ({
            time: t,
            temp: Math.round(j.hourly.temperature_2m[hourIdx + i]),
            code: j.hourly.weather_code[hourIdx + i],
            rain: j.hourly.precipitation_probability?.[hourIdx + i] ?? 0,
          }));
        const days: DayItem[] = (j.daily?.time as string[]).map((d, i) => ({
          date: d,
          code: j.daily.weather_code[i],
          max: Math.round(j.daily.temperature_2m_max[i]),
          min: Math.round(j.daily.temperature_2m_min[i]),
          rain: j.daily.precipitation_probability_max?.[i] ?? 0,
        }));
        setData({
          current: {
            temp: Math.round(j.current.temperature_2m),
            feels: Math.round(j.current.apparent_temperature),
            code: j.current.weather_code,
            humidity: Math.round(j.current.relative_humidity_2m),
            wind: Math.round(j.current.wind_speed_10m),
            gust: Math.round(j.current.wind_gusts_10m ?? 0),
            precip: j.current.precipitation ?? 0,
            pressure: Math.round(j.current.surface_pressure ?? 0),
            uv: Math.round(j.daily?.uv_index_max?.[0] ?? 0),
            isDay: !!j.current.is_day,
            visibility: Math.round((j.current.visibility ?? 0) / 1000),
          },
          days,
          hours,
          sunrise: j.daily?.sunrise?.[0] ?? "",
          sunset: j.daily?.sunset?.[0] ?? "",
        });
        setError(false);
      })
      .catch(() => alive && setError(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [nonce]);

  useEffect(() => {
    const id = setInterval(() => setNonce((n) => n + 1), 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return { data, error, loading, refresh: () => setNonce((n) => n + 1), label };
}

/* ---------- animated sky ---------- */
function SkyFx({ code, isDay }: { code: number; isDay: boolean }) {
  const rainy = code >= 51 && code < 86;
  const stormy = code >= 95;
  const drops = useMemo(
    () => Array.from({ length: rainy || stormy ? 26 : 0 }, (_, i) => ({
      left: (i * 3.9 + (i % 5) * 1.7) % 100,
      delay: (i % 9) * 0.18,
      dur: 0.9 + (i % 5) * 0.12,
    })),
    [rainy, stormy],
  );
  const stars = useMemo(
    () => Array.from({ length: isDay ? 0 : 30 }, (_, i) => ({
      left: (i * 7.3) % 100, top: (i * 13.7) % 60, delay: (i % 7) * 0.4,
    })),
    [isDay],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* sun / moon glow */}
      <motion.div
        className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-primary-foreground/25 blur-2xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {isDay && (
        <motion.div
          className="absolute -right-6 -top-8 h-32 w-32 rounded-full border border-primary-foreground/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ borderStyle: "dashed" }}
        />
      )}
      {/* drifting clouds */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary-foreground/10 blur-xl"
          style={{ width: 180 + i * 70, height: 60 + i * 18, top: 20 + i * 52 }}
          initial={{ x: -260 }}
          animate={{ x: "110%" }}
          transition={{ duration: 26 + i * 9, repeat: Infinity, ease: "linear", delay: i * 3 }}
        />
      ))}
      {/* stars at night */}
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary-foreground"
          style={{ left: `${s.left}%`, top: `${s.top}%` }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: s.delay }}
        />
      ))}
      {/* rain */}
      {drops.map((d, i) => (
        <motion.span
          key={i}
          className="absolute top-0 h-6 w-[2px] rounded-full bg-primary-foreground/45"
          style={{ left: `${d.left}%` }}
          animate={{ y: ["-12%", "115%"], opacity: [0, 0.9, 0] }}
          transition={{ duration: d.dur, repeat: Infinity, delay: d.delay, ease: "linear" }}
        />
      ))}
      {/* lightning */}
      {stormy && (
        <motion.div
          className="absolute inset-0 bg-primary-foreground"
          animate={{ opacity: [0, 0, 0.35, 0, 0.15, 0] }}
          transition={{ duration: 5, repeat: Infinity, times: [0, 0.7, 0.74, 0.78, 0.82, 1] }}
        />
      )}
    </div>
  );
}

function timeShort(iso: string) {
  if (!iso) return "--:--";
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function hourShort(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function dayShort(iso: string, i: number) {
  if (i === 0) return "Today";
  return new Date(iso).toLocaleDateString("en-GB", { weekday: "short" });
}

function eventAdvice(d: WeatherData) {
  const rain = d.days[0].rain;
  if (rain >= 60) return "High chance of rain today — our covered gazebo & indoor hall are the safe bet for events.";
  if (rain >= 30) return "A few passing showers possible — garden ceremonies are fine with a tent on standby.";
  if (d.current.temp >= 28) return "Warm and bright — perfect poolside afternoon; we'll set shaded seating for your guests.";
  return "Beautiful open-air conditions — ideal for garden weddings, team-building and outdoor dining.";
}

/* ---------- main showcase panel ---------- */
export function WeatherPanel() {
  const { data, error, loading, refresh } = useIsinyaWeather();
  const maxTemp = data ? Math.max(...data.hours.map((h) => h.temp)) : 0;
  const minTemp = data ? Math.min(...data.hours.map((h) => h.temp)) : 0;

  return (
    <section id="weather" aria-labelledby="weather-title" className="mx-auto max-w-7xl px-5 py-20">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Live from the gardens</p>
        <h2 id="weather-title" className="mt-2 font-display text-3xl sm:text-4xl font-bold text-foreground">
          Isinya Weather Right Now
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base font-medium text-muted-foreground">
          Plan your stay, wedding or team-building day with real-time conditions and a 7-day outlook for Tumaini Gardens Resort.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        {/* hero weather card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-primary to-accent p-6 sm:p-8 text-primary-foreground shadow-xl"
        >
          <SkyFx code={data?.current.code ?? 1} isDay={data?.current.isDay ?? true} />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-bold">
                <MapPin className="h-3.5 w-3.5" /> Isinya, Kajiado County
              </span>
              <button
                onClick={refresh}
                aria-label="Refresh weather"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/25 transition"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {error ? (
              <p className="mt-8 text-sm font-semibold">
                Live weather is unavailable right now. Tap refresh to try again.
              </p>
            ) : (
              <>
                <div className="mt-6 flex items-end gap-4">
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Icon
                      code={data?.current.code ?? 1}
                      isDay={data?.current.isDay ?? true}
                      className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow"
                    />
                  </motion.div>
                  <div>
                    <p className="font-display text-6xl sm:text-7xl font-bold leading-none tabular-nums">
                      {data ? data.current.temp : "--"}°
                      <span className="align-top text-2xl sm:text-3xl">C</span>
                    </p>
                    <p className="mt-1 text-base sm:text-lg font-bold">
                      {data ? label(data.current.code) : "Loading live conditions…"}
                    </p>
                    <p className="text-sm font-semibold opacity-90">
                      Feels like {data ? `${data.current.feels}°C` : "--"} · {data ? `${data.days[0].min}° / ${data.days[0].max}°` : "--"}
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  {[
                    { icon: <Droplets className="h-4 w-4" />, l: "Humidity", v: data ? `${data.current.humidity}%` : "--" },
                    { icon: <Wind className="h-4 w-4" />, l: "Wind", v: data ? `${data.current.wind} km/h` : "--" },
                    { icon: <Sun className="h-4 w-4" />, l: "UV index", v: data ? `${data.current.uv}` : "--" },
                    { icon: <Eye className="h-4 w-4" />, l: "Visibility", v: data ? `${data.current.visibility} km` : "--" },
                    { icon: <Gauge className="h-4 w-4" />, l: "Pressure", v: data ? `${data.current.pressure} hPa` : "--" },
                    { icon: <CloudRain className="h-4 w-4" />, l: "Rain chance", v: data ? `${data.days[0].rain}%` : "--" },
                    { icon: <Sunrise className="h-4 w-4" />, l: "Sunrise", v: data ? timeShort(data.sunrise) : "--" },
                    { icon: <Sunset className="h-4 w-4" />, l: "Sunset", v: data ? timeShort(data.sunset) : "--" },
                  ].map((m) => (
                    <div key={m.l} className="rounded-2xl bg-primary-foreground/15 p-3 backdrop-blur-sm">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide opacity-90 whitespace-nowrap">
                        {m.icon} {m.l}
                      </span>
                      <p className="mt-1 text-lg font-bold tabular-nums">{m.v}</p>
                    </div>
                  ))}
                </div>

                {data && (
                  <p className="mt-6 rounded-2xl border border-primary-foreground/25 bg-primary-foreground/10 p-4 text-sm font-semibold">
                    {eventAdvice(data)}
                  </p>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* hourly + 7 day */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex min-w-0 flex-col gap-5"
        >
          <div className="min-w-0 rounded-3xl border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Next 12 hours</h3>
            <div className="flex w-full gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
              {(data?.hours ?? Array.from({ length: 8 }, () => null)).map((h, i) => {
                const pct = h && maxTemp !== minTemp ? ((h.temp - minTemp) / (maxTemp - minTemp)) * 100 : 50;
                return (
                  <div key={i} className="flex min-w-[62px] flex-col items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">{h ? hourShort(h.time) : "--"}</span>
                    <span className="text-primary">{h ? <Icon code={h.code} className="h-5 w-5" /> : <Cloud className="h-5 w-5 animate-pulse" />}</span>
                    <div className="flex h-20 w-2 items-end overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="w-full rounded-full bg-gradient-to-t from-primary to-accent"
                        initial={{ height: 0 }}
                        animate={{ height: `${20 + pct * 0.8}%` }}
                        transition={{ duration: 0.7, delay: i * 0.05 }}
                      />
                    </div>
                    <span className="text-sm font-bold tabular-nums text-foreground">{h ? `${h.temp}°` : "--"}</span>
                    <span className="text-[11px] font-semibold text-accent">{h ? `${h.rain}%` : ""}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">7-day outlook</h3>
            <ul className="divide-y">
              {(data?.days ?? Array.from({ length: 5 }, () => null)).map((d, i) => (
                <li key={i} className="flex items-center gap-3 py-2.5">
                  <span className="w-14 text-sm font-bold text-foreground">{d ? dayShort(d.date, i) : "--"}</span>
                  <span className="text-primary">{d ? <Icon code={d.code} className="h-5 w-5" /> : <Cloud className="h-5 w-5 animate-pulse" />}</span>
                  <span className="flex-1 truncate text-xs font-semibold text-muted-foreground">{d ? label(d.code) : ""}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-accent">
                    <Droplets className="h-3.5 w-3.5" />{d ? `${d.rain}%` : "--"}
                  </span>
                  <span className="w-20 text-right text-sm font-bold tabular-nums text-foreground">
                    {d ? `${d.min}° / ${d.max}°` : "--"}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] font-medium text-muted-foreground">
              Live data updates every 10 minutes · Africa/Nairobi time
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
