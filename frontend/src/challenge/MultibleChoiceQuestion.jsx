import React, { useState } from 'react'

export function MultipleChoiceQuestion({ challenge, showExplanation = false }) {
    const [selectedOption, setSelectedOption] = useState(null)
    const [shouldShowExplanation, setShouldShowExplanation] = useState(false)

    const options =
        typeof challenge.options === 'string'
            ? JSON.parse(challenge.options)
            : challenge.options

    const handleOptionSelect = (index) => {
        if (selectedOption !== null) return
        setSelectedOption(index)
        setShouldShowExplanation(true)
    }

    const getOptionClass = (index) => {
        if (selectedOption === null) {
            return 'border hover:bg-gray-50'
        }

        if (index === challenge.correct_answer_id) {
            return 'border-green-500 bg-green-50 text-green-700'
        }

        if (index === selectedOption) {
            return 'border-red-500 bg-red-50 text-red-700'
        }

        return 'border opacity-60'
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-500">
                <span className="font-medium">Level:</span>{' '}
                <span className="capitalize">{challenge.difficulty}</span>
            </div>

            <h3 className="text-lg font-semibold leading-relaxed">
                {challenge.title}
            </h3>

            <div className="space-y-2">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        disabled={selectedOption !== null}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition ${getOptionClass(
                            index
                        )} ${
                            selectedOption === null
                                ? 'cursor-pointer'
                                : 'cursor-default'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {shouldShowExplanation && selectedOption !== null && (
                <div className="bg-gray-50 border rounded-lg p-4">
                    <h4 className="font-semibold mb-1">Explanation</h4>
                    <p className="text-sm text-gray-700">
                        {challenge.explanation}
                    </p>
                </div>
            )}
        </div>
    )
}