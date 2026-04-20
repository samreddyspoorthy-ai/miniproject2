export const branchOptions = ['Bengaluru - Koramangala', 'Mumbai - Andheri', 'Delhi - CP', 'Hyderabad - Hitech City'];

export const topMetrics = [
  { key: 'sales', title: 'Total Sales', value: 1284500, trend: '+12.4%', up: true, icon: 'IndianRupee' },
  { key: 'wasteCost', title: 'Predicted Waste Cost', value: 96500, trend: '-8.1%', up: false, icon: 'PiggyBank' },
  { key: 'wastePct', title: 'Waste Percentage', value: '6.2%', trend: '-1.3%', up: false, icon: 'Recycle' },
  { key: 'items', title: 'Total Items Sold', value: 24390, trend: '+9.8%', up: true, icon: 'UtensilsCrossed' },
];

export const monthlySalesTrend = [
  { month: 'Jan', sales: 740000, wasteCost: 85000 },
  { month: 'Feb', sales: 790000, wasteCost: 81000 },
  { month: 'Mar', sales: 845000, wasteCost: 78000 },
  { month: 'Apr', sales: 910000, wasteCost: 76000 },
  { month: 'May', sales: 980000, wasteCost: 72000 },
  { month: 'Jun', sales: 1040000, wasteCost: 68000 },
  { month: 'Jul', sales: 1100000, wasteCost: 65000 },
  { month: 'Aug', sales: 1210000, wasteCost: 62000 },
  { month: 'Sep', sales: 1284500, wasteCost: 60500 },
];

export const wasteVsRevenue = [
  { name: 'Week 1', waste: 18500, revenue: 262000 },
  { name: 'Week 2', waste: 15200, revenue: 276000 },
  { name: 'Week 3', waste: 14100, revenue: 289000 },
  { name: 'Week 4', waste: 13000, revenue: 301000 },
];

export const branchComparison = [
  { branch: 'Koramangala', wastePct: 5.1, sales: 482000, efficiencyScore: 92 },
  { branch: 'Andheri', wastePct: 6.7, sales: 433000, efficiencyScore: 78 },
  { branch: 'CP', wastePct: 6.0, sales: 369500, efficiencyScore: 83 },
  { branch: 'Hitech City', wastePct: 6.4, sales: 351000, efficiencyScore: 80 },
];

export const topItems = [
  { item: 'Paneer Tikka Wrap', sold: 1820, wasteKg: 62, margin: 38 },
  { item: 'Hyderabadi Biryani', sold: 1760, wasteKg: 78, margin: 42 },
  { item: 'Masala Dosa', sold: 1690, wasteKg: 44, margin: 31 },
  { item: 'Butter Chicken Bowl', sold: 1530, wasteKg: 66, margin: 45 },
  { item: 'Veg Thali', sold: 1480, wasteKg: 51, margin: 34 },
  { item: 'Chole Bhature', sold: 1400, wasteKg: 48, margin: 29 },
  { item: 'Chicken Roll', sold: 1310, wasteKg: 52, margin: 36 },
  { item: 'Schezwan Noodles', sold: 1220, wasteKg: 39, margin: 30 },
  { item: 'Rajma Rice', sold: 1180, wasteKg: 36, margin: 27 },
  { item: 'Cold Coffee', sold: 1120, wasteKg: 24, margin: 33 },
];

export const uploadHistory = [
  { fileName: 'sales_sep_week4.csv', branch: 'Bengaluru - Koramangala', status: 'Processed', uploadedAt: '2026-02-25 09:40', size: '1.2MB' },
  { fileName: 'sales_sep_week3.csv', branch: 'Mumbai - Andheri', status: 'Processed', uploadedAt: '2026-02-23 11:12', size: '0.9MB' },
  { fileName: 'sales_sep_week2.csv', branch: 'Delhi - CP', status: 'Failed', uploadedAt: '2026-02-19 18:04', size: '1.4MB' },
];

export const suggestions = [
  'Reduce paneer prep by 8% for Friday lunch slot.',
  'Shift rice batch timing 25 minutes later to match demand spikes.',
  'Bundle low-turnover side dishes to reduce spoilage in evening slots.',
];

export const peakWasteDays = [
  { day: 'Friday', wasteKg: 38 },
  { day: 'Saturday', wasteKg: 42 },
  { day: 'Sunday', wasteKg: 35 },
  { day: 'Monday', wasteKg: 21 },
  { day: 'Tuesday', wasteKg: 19 },
  { day: 'Wednesday', wasteKg: 25 },
  { day: 'Thursday', wasteKg: 29 },
];

export const branchTable = [
  { name: 'Bengaluru - Koramangala', manager: 'Nisha Rao', city: 'Bengaluru', active: true, monthlyWaste: 42000 },
  { name: 'Mumbai - Andheri', manager: 'Rohan Mehta', city: 'Mumbai', active: true, monthlyWaste: 46500 },
  { name: 'Delhi - CP', manager: 'Aniket Sharma', city: 'Delhi', active: true, monthlyWaste: 39900 },
  { name: 'Hyderabad - Hitech City', manager: 'Aarav Reddy', city: 'Hyderabad', active: false, monthlyWaste: 35500 },
];

export const demandDrivers = [
  { factor: 'Day of Week', impact: 16 },
  { factor: 'Weather', impact: 12 },
  { factor: 'Festival Season', impact: 23 },
  { factor: 'Local Events', impact: 9 },
  { factor: 'IPL Season', impact: 14 },
  { factor: 'Ramzan Nights', impact: 11 },
];

export const sevenDayForecast = [
  { day: 'Mon', demand: 840, confidence: 86 },
  { day: 'Tue', demand: 810, confidence: 88 },
  { day: 'Wed', demand: 860, confidence: 87 },
  { day: 'Thu', demand: 900, confidence: 89 },
  { day: 'Fri', demand: 1010, confidence: 91 },
  { day: 'Sat', demand: 1100, confidence: 92 },
  { day: 'Sun', demand: 980, confidence: 89 },
];

export const explainableInsights = [
  'Waste increased due to weekend spike in dine-in traffic.',
  'Rainy weather reduced footfall by 12% in Andheri branch.',
  'IPL match nights increased fried snack demand by 18%.',
];

export const purchaseOrder = [
  { material: 'Rice', requiredKg: 68, currentKg: 72, variancePct: -6 },
  { material: 'Chicken', requiredKg: 51, currentKg: 58, variancePct: -12 },
  { material: 'Vegetables', requiredKg: 39, currentKg: 44, variancePct: -11 },
  { material: 'Onions', requiredKg: 22, currentKg: 27, variancePct: -18 },
];

export const leakageAlerts = [
  'Abnormal waste detected in Koramangala branch.',
  'Waste cost increased 22% compared to last week.',
  'Spoilage in leafy vegetables crossed threshold by 14%.',
];

export const sustainabilityMetrics = {
  co2SavedKg: 2480,
  mealsSaved: 1550,
  moneySaved: 124000,
  sustainabilityScore: 89,
};

export const inventoryAging = [
  { item: 'Tomatoes', shelfLife: '2 days', risk: 'High', utilizationPct: 61 },
  { item: 'Paneer', shelfLife: '3 days', risk: 'Medium', utilizationPct: 72 },
  { item: 'Spinach', shelfLife: '1 day', risk: 'High', utilizationPct: 58 },
  { item: 'Chicken', shelfLife: '2 days', risk: 'Medium', utilizationPct: 76 },
  { item: 'Curd', shelfLife: '4 days', risk: 'Low', utilizationPct: 84 },
];

export const integrations = [
  { name: 'Zomato', status: 'Available' },
  { name: 'Swiggy', status: 'Available' },
  { name: 'POS Systems', status: 'In Progress' },
  { name: 'Razorpay', status: 'Available' },
  { name: 'Tally', status: 'Planned' },
];

export const roleAccess = [
  { role: 'Owner', access: 'Full financial + sustainability + branch controls' },
  { role: 'Manager', access: 'Branch analytics + waste alerts + ordering suggestions' },
  { role: 'Kitchen Staff', access: 'Prep recommendations + inventory aging + task alerts' },
  { role: 'Accountant', access: 'Cost leakage + waste cost reports + exports' },
];

export const pricingInsights = [
  'Increase price of Paneer Tikka Wrap by 4% due to high recurring demand.',
  'Reduce menu prominence for low-selling dessert SKUs.',
  'Bundle high-margin beverages with biryani combos to improve overall contribution margin.',
];

export const wasteHeatmap = [
  { day: 'Mon', breakfast: 3, lunch: 7, dinner: 6 },
  { day: 'Tue', breakfast: 2, lunch: 6, dinner: 5 },
  { day: 'Wed', breakfast: 3, lunch: 8, dinner: 7 },
  { day: 'Thu', breakfast: 4, lunch: 8, dinner: 8 },
  { day: 'Fri', breakfast: 5, lunch: 9, dinner: 10 },
  { day: 'Sat', breakfast: 6, lunch: 10, dinner: 11 },
  { day: 'Sun', breakfast: 5, lunch: 9, dinner: 10 },
];

export const hourlyWastePattern = [
  { hour: '9 AM', waste: 2 },
  { hour: '11 AM', waste: 4 },
  { hour: '1 PM', waste: 8 },
  { hour: '3 PM', waste: 6 },
  { hour: '5 PM', waste: 5 },
  { hour: '7 PM', waste: 9 },
  { hour: '9 PM', waste: 7 },
];

export const menuEngineering = [
  { name: 'Paneer Wrap', popularity: 82, profitability: 76 },
  { name: 'Biryani', popularity: 88, profitability: 81 },
  { name: 'Cold Coffee', popularity: 54, profitability: 72 },
  { name: 'Veg Thali', popularity: 61, profitability: 58 },
  { name: 'Schezwan Noodles', popularity: 49, profitability: 51 },
];

export const costLeakageFunnel = [
  { stage: 'Procurement', value: 100 },
  { stage: 'Storage Loss', value: 81 },
  { stage: 'Prep Loss', value: 67 },
  { stage: 'Service Waste', value: 51 },
  { stage: 'Net Retained', value: 43 },
];
