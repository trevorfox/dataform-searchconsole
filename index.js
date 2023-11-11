const templates = require("./includes/templates");
const timeframe = require("./includes/timeframe");

module.exports = (params) => {

    params = {
        projectConfig: dataform.projectConfig,
        gscSchema: 'searchconsole',
        defaultWindowOffset: 2,
        ...params
    }

    const gscTables = [
        'searchdata_site_impression',
        'searchdata_url_impression',
        'ExportLog'
    ]

    gscTables.forEach(function(table) {
        declare({
            schema: params.gscSchema,
            name: table
        });
    })

    return {
        gscWindow: templates.gscWindow,
        gscTopUrlKeywords: templates.gscTopUrlKeywords,
        timeframe: timeframe.timeframeFactory(params.defaultWindowOffset) 
    }


}
