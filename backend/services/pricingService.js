const calculateRecommendedPrice = ({
  currentPrice,
  avgCompetitorPrice,
  predictedDemand
}) => {

  let recommendedPrice =
    (0.5 * currentPrice) +
    (0.3 * avgCompetitorPrice) +
    (0.2 * (currentPrice * predictedDemand));

  let reason = "";

  if (predictedDemand > 0.7 && avgCompetitorPrice > currentPrice) {
    reason = "High demand and competitors priced higher → increase price";
  } else if (predictedDemand > 0.7) {
    reason = "High demand but strong competition → competitive pricing";
  } else {
    reason = "Low demand → reduce price";
  }

  return {
    recommendedPrice: Math.round(recommendedPrice),
    reason
  };
};

export default calculateRecommendedPrice;