export default function RecommendationCard({

    result

}){

return(

<div className="bg-white rounded-xl shadow-lg p-8 mt-8">

<h2 className="text-2xl font-bold mb-6">

🚆 Frequency Recommendation

</h2>

<div className="space-y-4">

<p>

<strong>Current Frequency:</strong>

{result.current_frequency} min

</p>

<p>

<strong>Recommended Frequency:</strong>

<span className="text-green-600 font-bold">

{result.recommended_frequency} min

</span>

</p>

<p>

<strong>Additional Trains:</strong>

{result.additional_trains_required}

</p>

<p>

<strong>Reason:</strong>

{result.reason}

</p>

</div>

</div>

)

}