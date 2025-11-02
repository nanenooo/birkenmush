"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Cloud, Droplets, TrendingDown, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SensorData {
  latest_temp: string
  latest_humidity: string
  max_temp: string
  min_temp: string
  avg_temp: string
  max_humidity: string
  min_humidity: string
  avg_humidity: string
  history: Array<{
    date: string
    time: string
    temp: number
    humidity: number
  }>
}

export default function Page() {
  const [data, setData] = useState<SensorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwzr8405rwhLs9fOYd1htASi-cbierpXk-ZdhTvC-xgc0iu89JvKIRKl9cDVNiJO3LD/exec"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(APPS_SCRIPT_URL)
        if (!response.ok) throw new Error("Failed to fetch data")
        const result = await response.json()
        setData(result)
        setLastUpdate(new Date())
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch sensor data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const chartData =
    data?.history?.map((item) => ({
      time: `${item.time}`,
      temperature: item.temp,
      humidity: item.humidity,
    })) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Climate Monitor</h1>
          <p className="text-slate-400">Real-time Temperature & Humidity Dashboard</p>
          {lastUpdate && <p className="text-sm text-slate-500 mt-2">Last updated: {lastUpdate.toLocaleTimeString()}</p>}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Current Status Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Current Temperature Card */}
              <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-800/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Temperature</CardTitle>
                    <Cloud className="h-5 w-5 text-cyan-400" />
                  </div>
                  <CardDescription className="text-slate-400">Current Status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-5xl font-bold text-cyan-400 mb-1">{data.latest_temp}°C</div>
                    <p className="text-sm text-slate-400">Real-time reading</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-400" /> Max
                      </p>
                      <p className="text-lg font-semibold text-green-400">{data.max_temp}°C</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-blue-400" /> Min
                      </p>
                      <p className="text-lg font-semibold text-blue-400">{data.min_temp}°C</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Avg</p>
                      <p className="text-lg font-semibold text-purple-400">{data.avg_temp}°C</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Humidity Card */}
              <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-800/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Humidity</CardTitle>
                    <Droplets className="h-5 w-5 text-blue-400" />
                  </div>
                  <CardDescription className="text-slate-400">Current Status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-5xl font-bold text-blue-400 mb-1">{data.latest_humidity}%</div>
                    <p className="text-sm text-slate-400">Real-time reading</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-400" /> Max
                      </p>
                      <p className="text-lg font-semibold text-green-400">{data.max_humidity}%</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-blue-400" /> Min
                      </p>
                      <p className="text-lg font-semibold text-blue-400">{data.min_humidity}%</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Avg</p>
                      <p className="text-lg font-semibold text-purple-400">{data.avg_humidity}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Historical Data</CardTitle>
                  <CardDescription className="text-slate-400">Temperature and Humidity trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" />
                      <YAxis yAxisId="left" stroke="#94a3b8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="temperature"
                        stroke="#06b6d4"
                        dot={false}
                        name="Temperature (°C)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="humidity"
                        stroke="#0ea5e9"
                        dot={false}
                        name="Humidity (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}
