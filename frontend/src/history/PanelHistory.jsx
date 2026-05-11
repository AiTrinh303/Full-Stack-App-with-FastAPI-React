import React, {useState, useEffect} from 'react'
import { MultipleChoiceQuestion } from '../challenge/MultibleChoiceQuestion.jsx'
import {useApi} from '../utils/app.js'

export function PanelHistory() {
    const {makeRequest} = useApi()
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await makeRequest("history")
            console.log(data)
            setHistory(data.challenges)
        } catch (err) {
            setError("Failed to load history.")
        } finally {
            setLoading(false)
        }
    }

     if (loading) {
        return (
            <div className="flex items-center justify-center py-10 text-gray-500">
                Loading history...
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 m-4 rounded-lg bg-red-50 text-red-600 border border-red-200">
                Error: {error}
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    History
                </h2>
                <p className="text-sm text-gray-500">
                    Your previously completed challenges
                </p>
            </div>

            {history.length === 0 ? (
                <div className="p-6 text-center text-gray-500 border border-dashed rounded-lg">
                    No history available.
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((challenge) => (
                        <div
                            key={challenge.id}
                            className="p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            <MultipleChoiceQuestion
                                challenge={challenge}
                                showExplanation={true}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

