import {
    Bar,
    BarChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { Counts } from "../types/circuit";

type HistogramProps = {
    counts: Counts;
};

export function Histogram({
    counts,
}: HistogramProps) {
    const data = Object.entries(counts).map(
        ([bitstring, count]) => ({
            bitstring,
            count,
        }),
    );

    if (data.length === 0) {
        return (
            <p>
                Run circuit to see measurement results
            </p>
        );
    }

    return (
        <BarChart 
            data={data}
            responsive
            style={{
                width: "100%",
                height:320,
            }}
            margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bitstring" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
        </BarChart>    
    );
}