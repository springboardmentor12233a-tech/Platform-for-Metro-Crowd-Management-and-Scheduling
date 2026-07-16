function DashboardCard({title, value, color}) {

    return (

        <div className="col-md-4 mb-4">

            <div
                className="card shadow"
                style={{
                    borderLeft:`5px solid ${color}`
                }}
            >

                <div className="card-body">

                    <h5 className="card-title">
                        {title}
                    </h5>


                    <h2>
                        {value}
                    </h2>

                </div>

            </div>

        </div>

    );

}

export default DashboardCard;