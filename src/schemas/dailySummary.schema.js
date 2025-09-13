const dailySummarySchema = {
    store_id: { type: String, required: true },
    camera_id: { type: String, required: true },
    date: { type: Date, required: true },
    summary_metrics : {
        total_people: { type: Number, required: true },
        avg_visit_duration: { type: Number, required: true }, // in seconds

    },
    hourly_breakdown:[
        {
            hour: { type: Number, required: true }, // 0-23
            people_count: { type: Number, required: true },
            avg_duration: { type: Number, required: true } // in seconds
        }
    ]
}