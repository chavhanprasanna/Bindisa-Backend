exports.getDashboardData = (req, res) => {
  const response = {
    recentSoilTests: [
      {
        date: "2025-05-28T10:15:00+05:30",
        location: "Field A",
        pH: 6.8,
        N: 45,
        P: 20,
        K: 30
      },
      {
        date: "2025-05-27T14:20:00+05:30",
        location: "Field B",
        pH: 7.2,
        N: 50,
        P: 18,
        K: 28
      }
    ],
    aiSuggestions: [
      {
        soilTestId: 101,
        suggestion: "Increase nitrogen by 10% and reduce phosphorus by 5%.",
        timestamp: "2025-05-28T11:00:00+05:30"
      },
      {
        soilTestId: 102,
        suggestion: "Maintain pH around 6.8 and add 2% organic compost.",
        timestamp: "2025-05-27T15:00:00+05:30"
      }
    ],
    profitSummary: {
      thisMonth: 12500.75,
      lastMonth: 9800.50,
      yearToDate: 84500.00
    },
    weather: {
      location: "Mumbai, IN",
      temperatureC: 29.4,
      condition: "Partly Cloudy",
      humidityPercent: 72
    },
    upcomingTasks: [
      {
        title: "Schedule irrigation for Field A",
        due: "2025-06-05T08:00:00+05:30"
      },
      {
        title: "Order organic compost",
        due: "2025-06-06T12:00:00+05:30"
      }
    ]
  };

  return res.json(response);
};
