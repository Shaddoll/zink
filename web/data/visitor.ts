import { google } from 'googleapis';
import fs from 'fs/promises';
import getLatLon from './geo';
import siteMetadata from './siteMetadata';

// Load the service account key file
let credentials;

// Function to authenticate and create a Google Analytics API client
async function getAnalyticsDataClient() {
  if (!credentials) {
    const keyFileContent = await fs.readFile(siteMetadata.googleAcountKeyFilePath, 'utf8');
    credentials = JSON.parse(keyFileContent);
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const analyticsData = google.analyticsdata({
    version: 'v1beta',
    auth,
  });

  return analyticsData;
}

export default async function fetchVisitor(startDate: Date, currentDate: Date) {
  try {
  const analyticsData = await getAnalyticsDataClient();
  const startDateStr = startDate.toISOString().slice(0, 10);

  const response = await analyticsData.properties.batchRunReports({
    property: `properties/${siteMetadata.googleAnalyticsProperty}`,
      requestBody: {
        requests: [
          {
            dateRanges: [{ startDate: startDateStr, endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
            dimensions: [{ name: 'city' }, { name: 'region' }, { name: 'countryId' }],
          },
          {
            dateRanges: [{ startDate: startDateStr, endDate: 'today' }],
            metrics: [{ name: 'sessions' }],
            dimensions: [{ name: 'date' }],
          },
        ],
      },
    });

  const reports = response.data.reports;
  const visitorData = reports?.[0]?.rows ? await Promise.all(reports[0].rows.map(async (row) => {
    const location = await getLatLon(
      row.dimensionValues?.[0].value || '', 
      row.dimensionValues?.[1].value || '', 
      row.dimensionValues?.[2].value || '',
    );
    if (location === null) {
      return null;
    }
    return {
      location: location,
      city: row.dimensionValues?.[0].value,
      distinctVisitors: parseInt(row.metricValues?.[0].value || '0', 10) || 0,
      totalVisits: parseInt(row.metricValues?.[1].value || '0', 10) || 0,
    }
  })) : [];

  const toFilterDateStr = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, '')

  const lastMonthDateStr = toFilterDateStr(new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000))
  const lastWeekDateStr = toFilterDateStr(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
  const yesterdayDateStr = toFilterDateStr(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))

  const totalVisits = reports?.[1]?.rows?.reduce((acc, row) => acc + parseInt(row.metricValues?.[0].value || '0', 10), 0) || 0;
  const lastMonthVisits = reports?.[1].rows?.filter((row) => row.dimensionValues?.[0] && row.dimensionValues[0] > lastMonthDateStr).
    reduce((acc, row) => acc + parseInt(row.metricValues?.[0].value || '0', 10), 0) || 0;
  const lastWeekVisits = reports?.[1].rows?.filter((row) => row.dimensionValues?.[0] && row.dimensionValues[0] > lastWeekDateStr).
    reduce((acc, row) => acc + parseInt(row.metricValues?.[0].value || '0', 10), 0) || 0;
  const yesterdayVisits = reports?.[1].rows?.filter((row) => row.dimensionValues?.[0] && row.dimensionValues[0] === yesterdayDateStr).
    reduce((acc, row) => acc + parseInt(row.metricValues?.[0].value || '0', 10), 0) || 0;
  const todayVisits = reports?.[1].rows?.filter((row) => row.dimensionValues?.[0] && row.dimensionValues[0] === toFilterDateStr(currentDate)).
    reduce((acc, row) => acc + parseInt(row.metricValues?.[0].value || '0', 10), 0) || 0;

  return {
    data: visitorData.filter((entry) => entry !== null && (entry.distinctVisitors > 0 || entry.totalVisits > 0)),
    visits: {
      total: totalVisits,
      lastMonth: lastMonthVisits,
      lastWeek: lastWeekVisits,
      yesterday: yesterdayVisits,
      today: todayVisits,
    },
  }
  } catch (error) {
    console.error('Error fetching visitor data:', error);
    return {
      data: [],
    };
  }
}
