export const getProductImages = (item) => {
  if (item.images && item.images.length > 0) return item.images;

  const name = item.name.toLowerCase();

  if (name.includes("mic") || name.includes("condenser")) {
    return [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1621406830743-4f04c6020c24?auto=format&fit=crop&w=600&q=80"
    ];
  }

  if (name.includes("earbud") || name.includes("tws") || name.includes("headset")) {
    return [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3a58e658ce5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1572569533944-cb1d3fb668f4?auto=format&fit=crop&w=600&q=80"
    ];
  }

  if (name.includes("monitor") || name.includes("display")) {
    return [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
    ];
  }

  if (name.includes("laptop") || name.includes("book")) {
    return [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80"
    ];
  }

  return [
    "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80"
  ];
};
