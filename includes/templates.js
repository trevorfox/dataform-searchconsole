function ga4OrganicWindow(timeFrameStart, timeFrameEnd, ctx) {
    return `
    select
        (
        select ep.value.string_value AS page_location 
        from unnest(event_params) ep 
        where ep.key = 'page_location'
    ) AS url,
    count(*) sessions
    from ${ctx.ref('events_*')} pv
    where event_name = 'session_start'
        and parse_date("%Y%m%d",pv.event_date) between ${timeFrameStart} and ${timeFrameEnd}
        and pv.traffic_source.source = 'google'
    group by 1
    `
}

function gscWindow(tableRef, headers, timeFrameStart, timeFrameEnd, ctx, whereConditions) {

    const positionMetric = tableRef === 'searchdata_site_impression' ? 'sum_top_position' : 'sum_position'
    return `
    select 
        ${headers.map(function(h){return `i.${h},`}).join('\n\t')}
        sum(i.clicks) clicks,
        sum(i.impressions) impressions,
        sum(i.clicks) / sum(i.impressions) ctr,
        sum(i.${positionMetric}) ${positionMetric},
        round((sum(i.${positionMetric}) / sum(i.impressions)) + 1, 1) avg_position
    from ${ctx.ref(tableRef)} i 
    where i.data_date between ${timeFrameStart} and ${timeFrameEnd}
        ${Array.isArray(whereConditions) && whereConditions.length > 0 ? whereConditions.map((x,i) => 'and ' + x).join('\n\t') : '' }
    ${headers.length > 0 ? 'group by ' + headers.map((x,i) => i + 1).join(',') : '' }
    `
}

function gscTopUrlKeywords(timeFrameStart, timeFrameEnd, ctx) {
    return `
    with gsc_url_keywords as (${gscWindow(['dataform', 'url_keyword_searchtype_daily_metrics'], ['url','query'], timeFrameStart, timeFrameEnd, ctx, ['query is not null'])})
    select 
        uk.url,
        ARRAY_AGG(STRUCT(uk.query, uk.impressions, uk.clicks, uk.ctr, round((sum_position / impressions) + 1, 1) as avg_position) ORDER BY uk.clicks desc, uk.impressions desc limit 1) top_clicks,
        ARRAY_AGG(STRUCT(uk.query, uk.impressions, uk.clicks, uk.ctr, round((sum_position / impressions) + 1, 1) as avg_position) ORDER BY (sum_position / impressions) + 1 asc, uk.impressions desc limit 1) top_position
    from gsc_url_keywords uk
    group by 1
    `
}

module.exports = {
    ga4OrganicWindow,
    gscWindow,
    gscTopUrlKeywords
}
