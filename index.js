const templates = require("./includes/templates");
const timeframe = require("./includes/timeframe");

module.exports = (params) => {

    params = {
        gsc_schema: 'searchconsole',
        default_window_offset: 2,
        ...params
    }

    const gscTables = [
       'searchdata_site_impression',
       'searchdata_url_impression',
       'ExportLog'
    ]

    gscTables.forEach(function(table) {
        declare({
            schema: params.gsc_schema,
            name: table
        });
    })

    return {
        gsc_query: templates.gsc_query,
        top_n_url_keywords: templates.top_n_url_keywords,
        get_distincts: templates.get_distincts,
        timeframe: timeframe.timeframer(params.default_window_offset) 
    }


}
