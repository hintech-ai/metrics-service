const sendMetric = require("./index.js");

sendMetric(
  "other_metric",
  {
      v1: "1 \n",
      v2: "ted",
      v3: 110,
      v4: "abc  def",
      v5: "akjajka\"kaka",
      v6: true
  },
    {
        t1: 1,
        t2: 1.030021,
        t3: "akaldakakdlda",
        t4: "akaka elooo"
  }
);