import {
    AlertTriangle,
    BrainCircuit
} from "lucide-react";

export default function AIRecommendationCard({
    recommendation,
    loading
}) {

    if (loading) {

        return (

            <div className="rounded-xl bg-white p-6 shadow">

                Generating AI Insights...

            </div>

        );
    }

    if (!recommendation) {

        return null;

    }

    return (

        <div className="rounded-xl bg-white shadow-lg p-6 border">

            <div className="flex items-center gap-3 mb-4">

                <BrainCircuit
                    className="text-blue-600"
                />

                <h2
                    className="text-xl font-semibold"
                >
                    AI Recommendation
                </h2>

            </div>

            <div className="space-y-4">

                <div>

                    <span className="font-semibold">

                        Risk Level

                    </span>

                    <p>

                        {recommendation.risk_level}

                    </p>

                </div>

                <div>

                    <span className="font-semibold">

                        Summary

                    </span>

                    <p>

                        {recommendation.summary}

                    </p>

                </div>

                <div>

                    <span className="font-semibold">

                        Recommendation

                    </span>

                    <p>

                        {recommendation.recommendation}

                    </p>

                </div>

                <div>

                    <span className="font-semibold">

                        Operational Action

                    </span>

                    <p>

                        {recommendation.operational_action}

                    </p>

                </div>

                <div>

                    <span className="font-semibold">

                        Expected Impact

                    </span>

                    <p>

                        {recommendation.expected_impact}

                    </p>

                </div>

            </div>

        </div>

    );

}