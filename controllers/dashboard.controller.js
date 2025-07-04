const SoilTest = require('../models/soil_test');
const CropSuggestion = require('../models/crop_suggestion');
const FarmingPlan = require('../models/farming_plan');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Get recent soil tests (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSoilTests = await SoilTest.find({
      user_id: userId,
      test_time: { $gte: thirtyDaysAgo }
    })
    .sort({ test_time: -1 })
    .limit(5)
    .populate('crop_suggestions');

    // Get AI suggestions
    const aiSuggestions = await CropSuggestion.find({
      'soil_test_id.user_id': userId
    })
    .sort({ created_at: -1 })
    .limit(5);

    // Get farming plans
    const farmingPlans = await FarmingPlan.find({
      user_id: userId
    })
    .sort({ start_date: -1 })
    .limit(3);

    // Get profit summary (aggregate from farming plans)
    const profitSummary = await FarmingPlan.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          thisMonth: {
            $sum: {
              $cond: [
                { $gte: ["$start_date", new Date(new Date().setMonth(new Date().getMonth() - 1))]},
                "$cost_estimate",
                0
              ]
            }
          },
          lastMonth: {
            $sum: {
              $cond: [
                { $and: [
                  { $lt: ["$start_date", new Date(new Date().setMonth(new Date().getMonth() - 1))]},
                  { $gte: ["$start_date", new Date(new Date().setMonth(new Date().getMonth() - 2))]},
                ]},
                "$cost_estimate",
                0
              ]
            }
          },
          yearToDate: { $sum: "$cost_estimate" }
        }
      }
    ]);

    // Get upcoming tasks (from farming plans)
    const upcomingTasks = farmingPlans.map(plan => ({
      title: `Manage ${plan.crop_name} crop`,
      due: plan.start_date,
      type: 'farming'
    }));

    res.json({
      recentSoilTests,
      aiSuggestions,
      farmingPlans,
      profitSummary: profitSummary[0] || { thisMonth: 0, lastMonth: 0, yearToDate: 0 },
      upcomingTasks,
      weather: {  // TODO: Integrate with weather API
        location: "Loading...",
        temperatureC: null,
        condition: "Loading...",
        humidityPercent: null
      }
    });
  } catch (error) {
    next(error);
  }
};
