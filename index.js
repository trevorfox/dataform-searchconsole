const templates = require("./includes/templates");

module.exports = (params) => {

    params = {
        gscSchema: 'searchconsole',
        defaultStartDate: 'current_date() - 28 - 2',
        defaultEndDate: 'current_date() - 2',
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
        gscTopUrlKeywords: templates.gscTopUrlKeywords
    }


}
