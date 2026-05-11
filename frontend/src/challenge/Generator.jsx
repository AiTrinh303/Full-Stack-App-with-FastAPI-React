import React, { useState, useEffect } from 'react'
import { MultipleChoiceQuestion } from './MultibleChoiceQuestion.jsx'
import {useApi} from '../utils/app.js'

export function Generator() {
    const [challenge, setChallenge] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [difficulty, setDifficulty] = useState('easy')
    const [quota, setQuota] = useState({ quota_remaining: 0})
    const {makeRequest} = useApi()

    useEffect(() => {
        fetchQuota()
    }, [])

    const fetchQuota = async () => {
        try {
            const data = await makeRequest("quota")
            setQuota(data)
        } catch (err) {
            console.log(err)
        }
    }

    const generateChallenge = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await makeRequest("generate-challenge", {
                method: "POST",
                body: JSON.stringify({difficulty})
                }
            )
            setChallenge(data)
            fetchQuota()
        } catch (err) {
            setError(err.message || "Failed to generate challenge.")
        } finally {
            setIsLoading(false)
        }
    }

    const getNextResetTime = () => {
        if (!quota?.last_reset_date) return null
        const resetDate = new Date(quota.last_reset_date)
        resetDate.setHours(resetDate.getHours() + 24)
        return resetDate
    }

    const isQuotaEmpty = quota?.quota_remaining === 0

   const handleDifficultyChange = (e) => {
        const newDifficulty = e.target.value
        setDifficulty(newDifficulty)
        setChallenge(null)
        setError(null)
    }
        
   return (
        <div className="max-w-2xl mx-auto space-y-8">

    <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Generator Challenge
        </h1>
        <p className="text-gray-500 text-sm">
            Generate AI-powered PYTHON questions and test your knowledge
        </p>
    </div>

   <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex justify-between items-center">
        <div>
            <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>Challenges remaining today:</span>

                <span className={`font-semibold ${isQuotaEmpty ? 'text-red-500' : 'text-green-600'}`}>
                    {quota?.quota_remaining ?? 0}
                </span>
            </p>
        </div>

        {isQuotaEmpty && (
            <div className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                Next reset: {getNextResetTime()?.toLocaleString()}
            </div>
        )}
    </div>

    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">

        <label htmlFor="difficulty" className="text-sm font-medium text-gray-700">
            Select Level: 
        </label>

        <select
            id="difficulty"
            value={difficulty}
            onChange={handleDifficultyChange}
            disabled={isLoading}
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
        </select>

        <button
            onClick={generateChallenge}
            disabled={isLoading || quota?.quota_remaining === 0}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? 'Generating...' : 'Generate'}
        </button>
    </div>

    {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
            {error}
        </div>
    )}

    {challenge && (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-5">

        <MultipleChoiceQuestion
            key={challenge.id}
            challenge={challenge}
        />
        
    </div>
    )}
</div>
)}