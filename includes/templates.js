function gsc_query(tableRef, headers, timeFrameStart, timeFrameEnd, whereConditions) {
    const table = Array.isArray(tableRef) ? tableRef.pop() : tableRef.split('.').pop();
    const positionMetric = table === 'searchdata_site_impression' ? 'sum_top_position' : 'sum_position'
    return `
    select 
        ${headers.map(function(h){return `i.${h},`}).join('\n\t')}
        sum(i.clicks) clicks,
        sum(i.impressions) impressions,
        sum(i.clicks) / sum(i.impressions) ctr,
        sum(i.${positionMetric}) ${positionMetric},
        round((sum(i.${positionMetric}) / sum(i.impressions)) + 1, 1) avg_position
    from ${tableRef} i 
    where i.data_date between ${timeFrameStart} and ${timeFrameEnd}
        ${Array.isArray(whereConditions) && whereConditions.length > 0 ? whereConditions.map((x) => 'and ' + x).join('\n\t') : '' }
    ${headers.length > 0 ? 'group by ' + headers.map((x,i) => i + 1).join(',') : '' }
    `
}

function top_n_url_keywords(tableRef, n, timeFrameStart, timeFrameEnd) {
    return `
    with gsc_url_keywords as (${gsc_query(tableRef, ['url','query'], timeFrameStart, timeFrameEnd, ['query is not null'])})
    select 
        uk.url,
        ARRAY_AGG(STRUCT(uk.query, uk.impressions, uk.clicks, uk.ctr, round((sum_position / impressions) + 1, 1) as avg_position) ORDER BY uk.clicks desc, uk.impressions desc limit ${n}) top_clicks,
        ARRAY_AGG(STRUCT(uk.query, uk.impressions, uk.clicks, uk.ctr, round((sum_position / impressions) + 1, 1) as avg_position) ORDER BY (sum_position / impressions) + 1 asc, uk.impressions desc limit ${n}) top_position
    from gsc_url_keywords uk
    group by 1
    `
}
function get_distincts(tableRef, header, timeFrameStart, timeFrameEnd, whereConditions) {
    return `
    select distinct ${header}
    from ${tableRef}
    where data_date between ${timeFrameStart} and ${timeFrameEnd}
        ${Array.isArray(whereConditions) && whereConditions.length > 0 ? whereConditions.map((x) => 'and ' + x).join('\n\t') : '' }
    `
}

module.exports = {
    gsc_query,
    top_n_url_keywords,
    get_distincts,
}
