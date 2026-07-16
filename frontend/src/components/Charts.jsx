import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,

    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,

    LineChart,
    Line
} from "recharts";


function Charts({data}) {


    const colors = [
        "#28a745",
        "#ffc107",
        "#dc3545"
    ];


    return (

        <div className="row g-4">


            {/* PIE CHART */}

            <div className="col-lg-6 col-md-12">


                <div className="chart-card">


                    <h4>
                        🟢🟡🔴 Crowd Level Distribution
                    </h4>


                    <ResponsiveContainer width="100%" height={350}>

                        <PieChart>


                            <Pie

                            data={data.Analytics.Crowd_Distribution}

                            dataKey="value"

                            nameKey="name"

                            cx="50%"

                            cy="50%"

                            outerRadius={110}

                            label

                            >


                            {
                                data.Analytics.Crowd_Distribution.map(
                                    (entry,index)=>(

                                        <Cell

                                        key={index}

                                        fill={
                                            colors[index % colors.length]
                                        }

                                        />

                                    )
                                )
                            }


                            </Pie>


                            <Tooltip/>

                            <Legend/>


                        </PieChart>


                    </ResponsiveContainer>


                </div>


            </div>





            {/* BAR CHART */}


            <div className="col-lg-6 col-md-12">


                <div className="chart-card">


                    <h4>
                        🚉 Top 5 Crowded Stations
                    </h4>



                    <ResponsiveContainer width="100%" height={350}>


                        <BarChart

                        data={data.Analytics.Top_Stations}

                        margin={{
                            top:20,
                            right:20,
                            left:0,
                            bottom:50
                        }}

                        >


                        <CartesianGrid
                        strokeDasharray="3 3"
                        />


                        <XAxis

                        dataKey="station"

                        angle={-30}

                        textAnchor="end"

                        />


                        <YAxis/>


                        <Tooltip/>


                        <Bar

                        dataKey="passengers"

                        fill="#0d6efd"

                        />


                        </BarChart>


                    </ResponsiveContainer>


                </div>


            </div>







            {/* LINE CHART */}


            <div className="col-12">


                <div className="chart-card">


                    <h4>
                        ⏰ Peak Hour Passenger Flow
                    </h4>



                    <ResponsiveContainer width="100%" height={400}>


                        <LineChart

                        data={data.Analytics.Peak_Hour}

                        >


                        <CartesianGrid
                        strokeDasharray="3 3"
                        />


                        <XAxis

                        dataKey="hour"

                        />


                        <YAxis/>


                        <Tooltip/>


                        <Line

                        type="monotone"

                        dataKey="passengers"

                        stroke="#ff0000"

                        strokeWidth={3}

                        />


                        </LineChart>


                    </ResponsiveContainer>


                </div>


            </div>



        </div>


    );

}


export default Charts;