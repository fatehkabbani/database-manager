import { useState, useEffect, useCallback } from "react"
import { QueryResults } from '../components/QueryResults'
import { createMockQueryResult } from '@/utils/mockData'



export default function ResultUD() {
    const [isExecuting, setIsExecuting] = useState(false)
    return (
        <QueryResults
            queryResults={createMockQueryResult()}
            isExecuting={isExecuting}
            onExecuteQuery={() => {
                console.log("Executing query...")
                setIsExecuting(true)
            }}
            canExecute={true}
        />
    )
}
